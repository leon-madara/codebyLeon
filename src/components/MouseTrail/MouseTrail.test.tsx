import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import React, { useRef } from 'react';
import MouseTrail from './MouseTrail';

// Helper component that provides a ref
function TestWrapper({ disabled = false }: { disabled?: boolean }) {
  const scopeRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={scopeRef} data-testid="scope" style={{ width: 800, height: 600 }}>
      <MouseTrail scopeRef={scopeRef} disabled={disabled} />
    </div>
  );
}

describe('MouseTrail (Obsidian Assembly style)', () => {
  beforeEach(() => {
    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 800,
      height: 600,
      top: 0,
      left: 0,
      bottom: 600,
      right: 800,
      x: 0,
      y: 0,
      toJSON: () => {}
    }));

    // Mock matchMedia
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }));

    // Mock HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      setTransform: vi.fn(),
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      arc: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      lineCap: 'round',
      lineJoin: 'round',
      strokeStyle: '',
      lineWidth: 1,
      fillStyle: ''
    });

    // Mock ResizeObserver
    globalThis.ResizeObserver = class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    } as unknown as typeof ResizeObserver;
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders canvas element inside mouse-trail-container', () => {
    const { container } = render(<TestWrapper />);
    const trailContainer = container.querySelector('.mouse-trail-container');
    expect(trailContainer).toBeTruthy();
    expect(trailContainer?.classList.contains('mouse-trail-container--hero')).toBe(true);

    const canvas = trailContainer?.querySelector('canvas.mouse-trail-canvas');
    expect(canvas).toBeTruthy();
  });

  it('does not crash when disabled', () => {
    const { container } = render(<TestWrapper disabled={true} />);
    const canvas = container.querySelector('canvas.mouse-trail-canvas');
    expect(canvas).toBeTruthy();
  });

  it('handles pointerenter, pointermove, pointerleave events without throwing', () => {
    const { getByTestId } = render(<TestWrapper />);
    const scope = getByTestId('scope');

    expect(() => {
      scope.dispatchEvent(new PointerEvent('pointerenter', { clientX: 100, clientY: 100 }));
      scope.dispatchEvent(new PointerEvent('pointermove', { clientX: 150, clientY: 120 }));
      scope.dispatchEvent(new PointerEvent('pointerleave'));
    }).not.toThrow();
  });
});
