/**
 * ThemeToggle – Epic day/night toggle with Framer Motion
 *
 * Architecture:
 *   - Framer Motion handles choreographed state transitions
 *     (knob spring, scene cross-fade, star entrance/exit)
 *   - CSS handles ambient loops (cloud drift, star twinkle)
 *   - prefers-reduced-motion disables all animation
 *   - Sky/haze/knob use opacity-based cross-fade between two
 *     static gradient layers (no gradient interpolation needed)
 *
 * Owner CSS: src/styles/components/theme-toggle.css
 */

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

/* ── Scene data ─────────────────────────────────────── */

const clouds = [
  { w: 20, h: 8, top: 4,  left: 6,  opacity: 0.92, drift: 22 },
  { w: 14, h: 6, top: 12, left: 24, opacity: 0.70, drift: 32 },
  { w: 16, h: 7, top: 19, left: 12, opacity: 0.55, drift: 28 },
  { w: 10, h: 5, top: 8,  left: 40, opacity: 0.65, drift: 38 },
] as const;

const stars = [
  { size: 2.4, top: 5,  left: 42, twinkleDur: 2.0, twinkleDelay: 0    },
  { size: 1.6, top: 12, left: 52, twinkleDur: 2.8, twinkleDelay: 0.4  },
  { size: 2.8, top: 20, left: 38, twinkleDur: 1.8, twinkleDelay: 0.8  },
  { size: 1.2, top: 7,  left: 58, twinkleDur: 3.2, twinkleDelay: 0.2  },
  { size: 2.0, top: 24, left: 50, twinkleDur: 2.4, twinkleDelay: 1.0  },
  { size: 1.4, top: 16, left: 62, twinkleDur: 2.6, twinkleDelay: 0.6  },
  { size: 1.0, top: 22, left: 56, twinkleDur: 3.0, twinkleDelay: 0.3  },
  { size: 1.8, top: 10, left: 46, twinkleDur: 2.2, twinkleDelay: 0.7  },
] as const;

const craters = [
  { w: 6, h: 6, top: 4,  left: 7  },
  { w: 4, h: 4, top: 14, left: 4  },
  { w: 5, h: 5, top: 15, left: 14 },
] as const;

/* ── Component ──────────────────────────────────────── */

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const prefersReduced = useReducedMotion();

  const dur = prefersReduced ? 0 : 0.5;

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
    >
      {/* ── Sky: two static gradient layers, cross-fade via opacity ── */}
      <span className="theme-toggle__sky theme-toggle__sky--day" aria-hidden="true" />
      <motion.span
        className="theme-toggle__sky theme-toggle__sky--night"
        aria-hidden="true"
        animate={{ opacity: isDark ? 1 : 0 }}
        transition={{ duration: dur, ease: 'easeInOut' }}
      />

      {/* ── Atmospheric haze: two layers, cross-fade ── */}
      <motion.span
        className="theme-toggle__haze theme-toggle__haze--day"
        aria-hidden="true"
        animate={{ opacity: isDark ? 0 : 1 }}
        transition={{ duration: dur * 1.2 }}
      />
      <motion.span
        className="theme-toggle__haze theme-toggle__haze--night"
        aria-hidden="true"
        animate={{ opacity: isDark ? 1 : 0 }}
        transition={{ duration: dur * 1.2 }}
      />

      {/* ── Clouds (day only) ── */}
      <AnimatePresence>
        {!isDark &&
          clouds.map((c, i) => (
            <motion.span
              key={`cloud-${i}`}
              className="theme-toggle__cloud"
              aria-hidden="true"
              style={{
                width: c.w,
                height: c.h,
                top: c.top,
                left: c.left,
                '--cloud-drift-speed': `${c.drift}s`,
              } as React.CSSProperties}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: c.opacity, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{
                duration: prefersReduced ? 0 : 0.35,
                delay: prefersReduced ? 0 : i * 0.06,
              }}
            />
          ))}
      </AnimatePresence>

      {/* ── Stars (night only) ── */}
      <AnimatePresence>
        {isDark &&
          stars.map((s, i) => (
            <motion.span
              key={`star-${i}`}
              className="theme-toggle__star"
              aria-hidden="true"
              style={{
                width: s.size,
                height: s.size,
                top: s.top,
                left: s.left,
                '--twinkle-duration': `${s.twinkleDur}s`,
                '--twinkle-delay': `${s.twinkleDelay}s`,
              } as React.CSSProperties}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: prefersReduced ? 0 : 0.3,
                delay: prefersReduced ? 0 : 0.32 + i * 0.055,
                scale: {
                  type: 'spring',
                  stiffness: 400,
                  damping: 15,
                  delay: prefersReduced ? 0 : 0.32 + i * 0.055,
                },
              }}
            />
          ))}
      </AnimatePresence>

      {/* ── Knob (sun → moon) ── */}
      <motion.span
        className={`theme-toggle__knob ${isDark ? 'theme-toggle__knob--moon' : 'theme-toggle__knob--sun'}`}
        aria-hidden="true"
        animate={{ x: isDark ? 38 : 0 }}
        transition={
          prefersReduced
            ? { duration: 0 }
            : { type: 'spring', stiffness: 300, damping: 25 }
        }
      >
        {/* Sun glow layer — fades out in dark mode */}
        <motion.span
          className="theme-toggle__knob-face theme-toggle__knob-face--sun"
          animate={{ opacity: isDark ? 0 : 1 }}
          transition={{ duration: dur }}
        />
        {/* Moon glow layer — fades in in dark mode */}
        <motion.span
          className="theme-toggle__knob-face theme-toggle__knob-face--moon"
          animate={{ opacity: isDark ? 1 : 0 }}
          transition={{ duration: dur }}
        />

        {/* Craters appear on the moon */}
        {craters.map((cr, i) => (
          <motion.span
            key={`crater-${i}`}
            className="theme-toggle__crater"
            style={{ width: cr.w, height: cr.h, top: cr.top, left: cr.left }}
            animate={{
              opacity: isDark ? 0.45 : 0,
              scale: isDark ? 1 : 0.4,
            }}
            transition={{
              duration: prefersReduced ? 0 : 0.28,
              delay: prefersReduced ? 0 : isDark ? 0.28 + i * 0.05 : 0,
            }}
          />
        ))}
      </motion.span>
    </button>
  );
}
