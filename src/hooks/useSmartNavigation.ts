import { useCallback, useRef, useState, type RefObject } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Observer } from 'gsap/Observer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import {
  SMART_NAV_HIDE_AFTER_IDLE_MS,
  SMART_NAV_SHOW_AFTER_STOP_MS,
} from '../utils/smartNavigationRoutes';

gsap.registerPlugin(Observer, ScrollTrigger);

const SCROLL_UP_TOLERANCE = 5;
const OBSERVER_TOLERANCE = 10;

type UseSmartNavigationOptions = {
  navRef: RefObject<HTMLElement | null>;
  enabled: boolean;
  pathname: string;
};

function isPinnedSectionActive(): boolean {
  return ScrollTrigger.getAll().some((trigger) => Boolean(trigger.vars.pin) && trigger.isActive);
}

function getScrollObserverTarget(): Window | HTMLElement {
  const smoother = ScrollSmoother.get();
  if (smoother && typeof smoother.wrapper === 'function') {
    const el = smoother.wrapper();
    if (el instanceof HTMLElement) {
      return el;
    }
  }
  return window;
}

export function useSmartNavigation({
  navRef,
  enabled,
  pathname,
}: UseSmartNavigationOptions) {
  const [isHidden, setIsHidden] = useState(false);
  const isHiddenRef = useRef(false);
  const pinActiveRef = useRef(false);
  const showAfterStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideAfterIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearShowAfterStopTimer = useCallback(() => {
    if (showAfterStopTimerRef.current) {
      clearTimeout(showAfterStopTimerRef.current);
      showAfterStopTimerRef.current = null;
    }
  }, []);

  const clearHideAfterIdleTimer = useCallback(() => {
    if (hideAfterIdleTimerRef.current) {
      clearTimeout(hideAfterIdleTimerRef.current);
      hideAfterIdleTimerRef.current = null;
    }
  }, []);

  const clearAllTimers = useCallback(() => {
    clearShowAfterStopTimer();
    clearHideAfterIdleTimer();
  }, [clearHideAfterIdleTimer, clearShowAfterStopTimer]);

  const syncHiddenState = useCallback((hidden: boolean) => {
    isHiddenRef.current = hidden;
    setIsHidden(hidden);
    if (hidden && navRef.current && document.activeElement && navRef.current.contains(document.activeElement)) {
      (document.activeElement as HTMLElement).blur();
    }
  }, [navRef]);

  const scheduleHideAfterIdle = useCallback(() => {
    clearHideAfterIdleTimer();
    hideAfterIdleTimerRef.current = setTimeout(() => {
      if (pinActiveRef.current) return;
      syncHiddenState(true);
    }, SMART_NAV_HIDE_AFTER_IDLE_MS);
  }, [clearHideAfterIdleTimer, syncHiddenState]);

  const showNavigation = useCallback(() => {
    clearShowAfterStopTimer();
    syncHiddenState(false);
    scheduleHideAfterIdle();
  }, [clearShowAfterStopTimer, scheduleHideAfterIdle, syncHiddenState]);

  const hideNavigation = useCallback(() => {
    if (pinActiveRef.current) {
      showNavigation();
      return;
    }

    clearHideAfterIdleTimer();
    syncHiddenState(true);
  }, [clearHideAfterIdleTimer, showNavigation, syncHiddenState]);

  const scheduleShowAfterStop = useCallback(() => {
    clearShowAfterStopTimer();
    showAfterStopTimerRef.current = setTimeout(() => {
      showNavigation();
    }, SMART_NAV_SHOW_AFTER_STOP_MS);
  }, [clearShowAfterStopTimer, showNavigation]);

  const refreshPinState = useCallback(() => {
    const pinActive = isPinnedSectionActive();
    pinActiveRef.current = pinActive;

    if (pinActive && isHiddenRef.current) {
      showNavigation();
    }
  }, [showNavigation]);

  useGSAP(() => {
    clearAllTimers();
    pinActiveRef.current = false;
    syncHiddenState(false);
  }, { scope: navRef, dependencies: [enabled, pathname] });

  useGSAP(
    () => {
      if (!enabled || !navRef.current) return;

      refreshPinState();
      scheduleHideAfterIdle();

      const observer = Observer.create({
        target: getScrollObserverTarget(),
        type: 'wheel,touch,scroll,pointer',
        tolerance: OBSERVER_TOLERANCE,
        preventDefault: false,
        onChange: (self) => {
          refreshPinState();
          clearShowAfterStopTimer();
          clearHideAfterIdleTimer();

          if (pinActiveRef.current) {
            showNavigation();
            return;
          }

          if (self.deltaY > 0) {
            hideNavigation();
            return;
          }

          if (self.deltaY < -SCROLL_UP_TOLERANCE) {
            showNavigation();
          }
        },
        onStop: () => {
          refreshPinState();

          if (pinActiveRef.current) {
            showNavigation();
            return;
          }

          if (isHiddenRef.current) {
            scheduleShowAfterStop();
            return;
          }

          scheduleHideAfterIdle();
        },
      });

      const handleScrollTriggerUpdate = () => {
        refreshPinState();
      };

      ScrollTrigger.addEventListener('scrollEnd', handleScrollTriggerUpdate);
      ScrollTrigger.addEventListener('refresh', handleScrollTriggerUpdate);

      return () => {
        observer.kill();
        ScrollTrigger.removeEventListener('scrollEnd', handleScrollTriggerUpdate);
        ScrollTrigger.removeEventListener('refresh', handleScrollTriggerUpdate);
        clearAllTimers();
      };
    },
    { scope: navRef, dependencies: [enabled, pathname] },
  );

  useGSAP(
    () => {
      if (!navRef.current) return;
      if (!enabled) {
        gsap.set(navRef.current, { clearProps: "opacity,visibility,transform,pointerEvents" });
        return;
      }

      gsap.to(navRef.current, {
        autoAlpha: isHidden ? 0 : 1,
        y: isHidden ? -16 : 0,
        duration: 0.3,
        ease: isHidden ? 'power2.in' : 'power2.out',
        pointerEvents: isHidden ? 'none' : 'auto',
        overwrite: 'auto',
      });
    },
    { scope: navRef, dependencies: [enabled, isHidden] },
  );

  return { isHidden };
}
