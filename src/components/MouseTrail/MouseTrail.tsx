import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface MouseTrailConfig {
  trailCount?: number;
  colors?: string[];
  sizes?: number[];
  cursorSize?: number;
}

const MouseTrail = ({
  trailCount = 3,
  colors = ['hsl(214, 90%, 59%)', 'hsl(262, 76%, 54%)', 'hsl(4, 96%, 79%)'],
  sizes = [12, 9, 6],
  cursorSize = 14,
}: MouseTrailConfig) => {
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);
  const [cursor, setCursor] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isStationary, setStationary] = useState(false);
  const lastMoveTime = useRef(Date.now());

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY });
      lastMoveTime.current = Date.now();
      setStationary(false);
    };

    const interval = setInterval(() => {
      if (Date.now() - lastMoveTime.current > 100) {
        setStationary(true);
      }
    }, 100);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // Only update trail if we have a cursor movement or stationary check
    // We use a functional update to avoid depending on 'trail' itself
    setTrail(prevTrail => {
      const newTrail = [...prevTrail];
      let changed = false;

      if (newTrail.length === 0) {
        // Initialize trail
        for (let i = 0; i < trailCount; i++) {
          newTrail.push({ x: cursor.x, y: cursor.y });
        }
        changed = true;
      } else {
        // Update trail
        for (let i = 0; i < trailCount; i++) {
          const leader = i === 0 ? cursor : newTrail[i - 1];
          const follower = newTrail[i];
          const dx = leader.x - follower.x;
          const dy = leader.y - follower.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (isStationary || distance > 2) {
            const newX = follower.x + dx * 0.2;
            const newY = follower.y + dy * 0.2;
            newTrail[i] = { x: newX, y: newY };
            changed = true;
          }
        }
      }

      return changed ? newTrail : prevTrail;
    });
  }, [cursor, isStationary, trailCount]);

  if (typeof window === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="mouse-trail-container">
      <div
        className="mouse-cursor"
        style={{
          transform: `translate(${cursor.x - cursorSize / 2}px, ${cursor.y - cursorSize / 2}px)`,
          width: `${cursorSize}px`,
          height: `${cursorSize}px`,
          opacity: trail.length === 0 ? '0' : '1', // Start hidden, become visible after first move
        }}
      />
      {trail.map((pos, i) => (
        <div
          key={i}
          className="trail-element"
          data-index={i}
          style={{
            transform: `translate(${pos.x - sizes[i] / 2}px, ${pos.y - sizes[i] / 2}px)`,
            width: `${sizes[i]}px`,
            height: `${sizes[i]}px`,
            opacity: trail.length === 0 ? '0' : '1', // Start hidden, become visible after first move
          }}
        />
      ))}
    </div>,
    document.body
  );
};

export default MouseTrail;