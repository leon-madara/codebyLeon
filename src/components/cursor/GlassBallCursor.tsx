import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';
import { isVisualTestMode } from '@/utils/runtimeFlags';
import { useTheme } from '@/contexts/ThemeContext';

const CANVAS_SIZE = 160;
const HALF_CANVAS_SIZE = CANVAS_SIZE / 2;
const DESKTOP_FINE_POINTER_QUERY = '(min-width: 1024px) and (pointer: fine)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const OUR_WORK_SECTION_SELECTOR = '#our-work';
const INTERACTIVE_TAGS = ['a', 'button', 'input', 'textarea', 'select', 'summary'];
const INTERACTIVE_ROLES = ['button', 'link', 'menuitem'];

type Point = {
  x: number;
  y: number;
};

function getViewportCenter(): Point {
  if (typeof window === 'undefined') {
    return { x: 0, y: 0 };
  }

  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };
}

function canUseGlassBallCursor(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  if (typeof window.matchMedia !== 'function' || isVisualTestMode()) {
    return false;
  }

  return (
    window.matchMedia(DESKTOP_FINE_POINTER_QUERY).matches &&
    !window.matchMedia(REDUCED_MOTION_QUERY).matches
  );
}

function addMediaListener(media: MediaQueryList, listener: () => void) {
  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', listener);
    return;
  }

  media.addListener(listener);
}

function removeMediaListener(media: MediaQueryList, listener: () => void) {
  if (typeof media.removeEventListener === 'function') {
    media.removeEventListener('change', listener);
    return;
  }

  media.removeListener(listener);
}

function lerp(current: number, target: number, amount: number) {
  return current + (target - current) * amount;
}

function isInteractiveTarget(element: Element | null): boolean {
  let current: Element | null = element;

  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    const tag = current.tagName.toLowerCase();
    const role = current.getAttribute('role');

    if (
      style.cursor === 'pointer' ||
      INTERACTIVE_TAGS.includes(tag) ||
      INTERACTIVE_ROLES.includes(role || '')
    ) {
      return true;
    }

    current = current.parentElement;
  }

  return false;
}

function isPointInsideOurWorkSection(point: Point): boolean {
  const section = document.querySelector<HTMLElement>(OUR_WORK_SECTION_SELECTOR);

  if (!section) {
    return false;
  }

  const rect = section.getBoundingClientRect();

  return (
    point.x >= rect.left &&
    point.x <= rect.right &&
    point.y >= rect.top &&
    point.y <= rect.bottom
  );
}

function disposeMaterial(material: THREE.Material | THREE.Material[]) {
  if (Array.isArray(material)) {
    material.forEach((item) => item.dispose());
    return;
  }

  material.dispose();
}

function createTextTexture(text: string, theme: 'light' | 'dark'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Setup modern text styling on 2D canvas
    ctx.font = 'bold 54px Outfit, Inter, sans-serif';
    ctx.fillStyle = theme === 'light' ? '#000000' : '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw text repeated around the equator
    const count = 3;
    const segmentWidth = canvas.width / count;
    for (let i = 0; i < count; i++) {
      const x = (i + 0.5) * segmentWidth;
      const y = canvas.height / 2;
      ctx.fillText(`${text.toUpperCase()}   •`, x, y);
    }
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function GlassBallCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetRef = useRef<Point>(getViewportCenter());
  const positionRef = useRef<Point>(getViewportCenter());
  const previousPositionRef = useRef<Point>(getViewportCenter());
  const hoverRef = useRef(false);
  const mouseDownRef = useRef(false);
  const pointerSeenRef = useRef(false);
  const cursorActiveRef = useRef(false);

  let theme: 'light' | 'dark' = 'dark';
  try {
    theme = useTheme().theme;
  } catch {
    const htmlTheme = typeof document !== 'undefined' ? document.documentElement.getAttribute('data-theme') : null;
    theme = htmlTheme === 'light' ? 'light' : 'dark';
  }
  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isCursorActive, setIsCursorActive] = useState(false);
  const [isSectionVisible, setIsSectionVisible] = useState(false);

  // Switcher state: 'glass' (Clear Sphere), 'torus' (Glass Torus), 'crystal' (Faceted Crystal), 'glossy' (Glossy Blue Sphere)
  const [cursorType, setCursorType] = useState<'glass' | 'torus' | 'crystal' | 'glossy'>('glossy');

  useEffect(() => {
    setPortalHost(document.body);
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    if (typeof window === 'undefined' || typeof window.IntersectionObserver === 'undefined') {
      setIsSectionVisible(true);
      return;
    }

    const section = document.querySelector(OUR_WORK_SECTION_SELECTOR);
    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [isEnabled]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const desktopFinePointer = window.matchMedia(DESKTOP_FINE_POINTER_QUERY);
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);

    const updateEnabledState = () => {
      setIsEnabled(canUseGlassBallCursor());
    };

    updateEnabledState();
    addMediaListener(desktopFinePointer, updateEnabledState);
    addMediaListener(reducedMotion, updateEnabledState);

    return () => {
      removeMediaListener(desktopFinePointer, updateEnabledState);
      removeMediaListener(reducedMotion, updateEnabledState);
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas) {
      return;
    }

    const updateCursorActive = (nextIsActive: boolean) => {
      if (cursorActiveRef.current === nextIsActive) {
        return;
      }

      cursorActiveRef.current = nextIsActive;
      setIsCursorActive(nextIsActive);
    };

    const startPoint = getViewportCenter();
    targetRef.current = { ...startPoint };
    positionRef.current = { ...startPoint };
    previousPositionRef.current = { ...startPoint };
    container.style.transform = `translate3d(${startPoint.x - HALF_CANVAS_SIZE}px, ${
      startPoint.y - HALF_CANVAS_SIZE
    }px, 0)`;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(CANVAS_SIZE, CANVAS_SIZE, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 4;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.65);
    keyLight.position.set(2, 3, 4);
    const blueLight = new THREE.PointLight(0x4fc3f7, 1.8, 8);
    blueLight.position.set(-2, -1.25, 2);
    scene.add(ambientLight, keyLight, blueLight);

    const textTexture = createTextTexture('scroll', theme);

    /* ── Dynamic Geometry & Material Selection ───────────────── */
    let ballGeometry: THREE.BufferGeometry;
    let ballMaterial: THREE.MeshPhysicalMaterial;
    let innerCore: THREE.Mesh | null = null;
    let innerLight: THREE.PointLight | null = null;

    if (cursorType === 'torus') {
      ballGeometry = new THREE.TorusGeometry(0.72, 0.28, 32, 64);
      ballMaterial = new THREE.MeshPhysicalMaterial({
        color: theme === 'light' ? 0xdddddd : 0xffffff,
        metalness: 0.02,
        roughness: 0.05,
        transmission: 0.96,
        thickness: 1.2,
        ior: 1.5,
        clearcoat: 0.8,
        clearcoatRoughness: 0.05,
        transparent: true,
        opacity: 1.0,
      });
    } else if (cursorType === 'crystal') {
      ballGeometry = new THREE.IcosahedronGeometry(0.95, 1);
      ballMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xaaddff,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.90,
        thickness: 2.0,
        ior: 1.7,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 1.0,
      });
    } else if (cursorType === 'glossy') {
      // Glossy Blue Sphere matching the specs and screenshot
      ballGeometry = new THREE.SphereGeometry(1, 64, 64);
      ballMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x4fc3f7,
        metalness: 0.05,
        roughness: 0.08,
        transmission: 0.55,
        thickness: 1.6,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        ior: 1.5,
        transparent: true,
        opacity: 1.0,
      });

      const coreGeometry = new THREE.SphereGeometry(0.55, 32, 32);
      const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0x66bbff,
        transparent: true,
        opacity: 0.25,
      });
      innerCore = new THREE.Mesh(coreGeometry, coreMaterial);

      innerLight = new THREE.PointLight(0x88ccff, 1.2, 5);
      innerLight.position.set(0, 0, 0);
    } else {
      // Standard Clear Glass Sphere
      ballGeometry = new THREE.SphereGeometry(1, 64, 64);
      ballMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.02,
        roughness: 0.02,
        transmission: 0.96,
        thickness: 1.5,
        ior: 1.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
        transparent: true,
        opacity: 1.0,
      });
    }

    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    scene.add(ball);

    if (innerCore) {
      ball.add(innerCore);
    }
    if (innerLight) {
      scene.add(innerLight);
    }

    const shellGeometry = new THREE.SphereGeometry(1.15, 32, 32);
    const shellMaterial = new THREE.MeshBasicMaterial({
      map: textTexture,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const shell = new THREE.Mesh(shellGeometry, shellMaterial);
    ball.add(shell);

    const glowGeometry = new THREE.SphereGeometry(0.82, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: cursorType === 'glossy' ? 0x88ccff : 0xaaddff,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    ball.add(glow);

    const ringGeometry = new THREE.TorusGeometry(1.18, 0.035, 16, 96);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ball.add(ring);

    let frameId = 0;
    let scrollVelocity = 0;
    let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;

    const handleMouseMove = (event: MouseEvent) => {
      const nextPoint = {
        x: event.clientX,
        y: event.clientY,
      };
      const isInsideOurWork = isPointInsideOurWorkSection(nextPoint);
      pointerSeenRef.current = true;

      updateCursorActive(isInsideOurWork);

      if (!isInsideOurWork) {
        hoverRef.current = false;
        mouseDownRef.current = false;
        return;
      }

      targetRef.current.x = nextPoint.x;
      targetRef.current.y = nextPoint.y;
      hoverRef.current = isInteractiveTarget(document.elementFromPoint(nextPoint.x, nextPoint.y));
    };

    const handleMouseDown = () => {
      if (!cursorActiveRef.current) {
        return;
      }

      mouseDownRef.current = true;
    };

    const handleMouseUp = () => {
      mouseDownRef.current = false;
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      if (cursorActiveRef.current) {
        const delta = diff * 0.002;
        scrollVelocity = Math.max(-0.04, Math.min(0.04, scrollVelocity + delta));
      }
    };

    const animate = () => {
      positionRef.current.x = lerp(positionRef.current.x, targetRef.current.x, 0.15);
      positionRef.current.y = lerp(positionRef.current.y, targetRef.current.y, 0.15);

      if (pointerSeenRef.current) {
        updateCursorActive(isPointInsideOurWorkSection(targetRef.current));
      }

      const velocityX = positionRef.current.x - previousPositionRef.current.x;
      const velocityY = positionRef.current.y - previousPositionRef.current.y;
      previousPositionRef.current.x = positionRef.current.x;
      previousPositionRef.current.y = positionRef.current.y;

      container.style.transform = `translate3d(${positionRef.current.x - HALF_CANVAS_SIZE}px, ${
        positionRef.current.y - HALF_CANVAS_SIZE
      }px, 0)`;

      // Apply mouse movement rotation
      ball.rotation.y += velocityX * 0.018;
      ball.rotation.x -= velocityY * 0.018;
      ring.rotation.z -= velocityX * 0.01;

      // Apply scroll rotation on X-axis and decay it (friction)
      ball.rotation.x -= scrollVelocity;
      scrollVelocity *= 0.85;

      // Rotate the satellite text shell
      shell.rotation.y += 0.008;

      // Smoothly transition satellite text opacity on hover
      const targetShellOpacity = hoverRef.current ? 0.0 : 0.85;
      shellMaterial.opacity = lerp(shellMaterial.opacity, targetShellOpacity, 0.16);

      const hoverScale = hoverRef.current ? 1.35 : 1;
      const baseScale = lerp(ball.scale.x, hoverScale, 0.14);
      const squashX = mouseDownRef.current ? 1.08 : 1;
      const squashY = mouseDownRef.current ? 0.88 : 1;
      ball.scale.set(baseScale * squashX, baseScale * squashY, baseScale);

      const ringOpacity = hoverRef.current ? 0.72 : 0;
      ringMaterial.opacity = lerp(ringMaterial.opacity, ringOpacity, 0.16);
      glowMaterial.opacity = lerp(glowMaterial.opacity, hoverRef.current ? 0.3 : 0.16, 0.12);

      const pulse = hoverRef.current ? Math.sin(performance.now() * 0.008) * 0.06 : 0;
      
      const targetEmissive = hoverRef.current 
        ? (cursorType === 'glossy' ? 0x113355 : 0x114466) 
        : 0x000000;
      ballMaterial.emissive.setHex(targetEmissive);
      ballMaterial.emissiveIntensity = lerp(
        ballMaterial.emissiveIntensity,
        hoverRef.current ? 0.38 + pulse : 0.05,
        0.12
      );

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('blur', handleMouseUp);
    window.addEventListener('scroll', handleScroll, { passive: true });
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('blur', handleMouseUp);
      window.removeEventListener('scroll', handleScroll);

      cancelAnimationFrame(frameId);
      pointerSeenRef.current = false;
      cursorActiveRef.current = false;
      setIsCursorActive(false);
      renderer.dispose();
      ballGeometry.dispose();
      glowGeometry.dispose();
      ringGeometry.dispose();
      disposeMaterial(ballMaterial);
      disposeMaterial(glowMaterial);
      disposeMaterial(ringMaterial);
      shellGeometry.dispose();
      disposeMaterial(shellMaterial);
      textTexture.dispose();

      if (innerCore) {
        innerCore.geometry?.dispose();
        if (innerCore.material) {
          disposeMaterial(innerCore.material);
        }
      }
      if (innerLight) {
        scene.remove?.(innerLight);
      }
    };
  }, [isEnabled, theme, cursorType]);

  if (!portalHost || !isEnabled) {
    return null;
  }

  return createPortal(
    <>
      <div
        ref={containerRef}
        className="glass-ball-cursor"
        data-testid="glass-ball-cursor"
        data-active={isCursorActive ? 'true' : 'false'}
        aria-hidden="true"
      >
        <canvas
          ref={canvasRef}
          className="glass-ball-cursor__canvas"
          data-testid="glass-ball-cursor-canvas"
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
        />
      </div>

      <div 
        className="cursor-switcher" 
        data-theme={theme} 
        data-active={isSectionVisible ? 'true' : 'false'}
      >
        <div
          className="cursor-switcher__indicator"
          style={{
            transform: `translateX(${
              ['glass', 'torus', 'crystal', 'glossy'].indexOf(cursorType) * 100
            }%)`,
          }}
        />
        <button
          className={`cursor-switcher__btn ${cursorType === 'glass' ? 'is-active' : ''}`}
          onClick={() => setCursorType('glass')}
          title="Clear Glass Sphere"
        >
          Glass
        </button>
        <button
          className={`cursor-switcher__btn ${cursorType === 'torus' ? 'is-active' : ''}`}
          onClick={() => setCursorType('torus')}
          title="Frosted Glass Torus"
        >
          Torus
        </button>
        <button
          className={`cursor-switcher__btn ${cursorType === 'crystal' ? 'is-active' : ''}`}
          onClick={() => setCursorType('crystal')}
          title="Faceted Crystal Ball"
        >
          Crystal
        </button>
        <button
          className={`cursor-switcher__btn ${cursorType === 'glossy' ? 'is-active' : ''}`}
          onClick={() => setCursorType('glossy')}
          title="Glossy Blue Sphere"
        >
          Glossy
        </button>
      </div>
    </>,
    portalHost
  );
}

export default GlassBallCursor;
