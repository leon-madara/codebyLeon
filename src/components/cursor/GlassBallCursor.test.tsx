import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const threeMock = vi.hoisted(() => {
  const mock = {
    rendererDispose: vi.fn(),
    rendererRender: vi.fn(),
    rendererSetPixelRatio: vi.fn(),
    rendererSetSize: vi.fn(),
    geometryDispose: vi.fn(),
    materialDispose: vi.fn(),
    emissiveSetHex: vi.fn(),
    reset() {
      mock.rendererDispose.mockClear();
      mock.rendererRender.mockClear();
      mock.rendererSetPixelRatio.mockClear();
      mock.rendererSetSize.mockClear();
      mock.geometryDispose.mockClear();
      mock.materialDispose.mockClear();
      mock.emissiveSetHex.mockClear();
    },
  };

  return mock;
});

vi.mock('three', () => {
  class WebGLRenderer {
    setPixelRatio = threeMock.rendererSetPixelRatio;
    setSize = threeMock.rendererSetSize;
    render = threeMock.rendererRender;
    dispose = threeMock.rendererDispose;

    constructor() {}
  }

  class Scene {
    add = vi.fn();
  }

  class PerspectiveCamera {
    position = { z: 0 };

    constructor() {}
  }

  class AmbientLight {
    constructor() {}
  }

  class DirectionalLight {
    position = { set: vi.fn() };

    constructor() {}
  }

  class PointLight {
    position = { set: vi.fn() };

    constructor() {}
  }

  class SphereGeometry {
    dispose = threeMock.geometryDispose;

    constructor() {}
  }

  class TorusGeometry {
    dispose = threeMock.geometryDispose;

    constructor() {}
  }

  class MeshPhysicalMaterial {
    emissive = { setHex: threeMock.emissiveSetHex };
    emissiveIntensity = 0.05;
    dispose = threeMock.materialDispose;

    constructor(parameters: { emissiveIntensity?: number } = {}) {
      this.emissiveIntensity = parameters.emissiveIntensity ?? 0.05;
    }
  }

  class MeshBasicMaterial {
    opacity = 1;
    dispose = threeMock.materialDispose;

    constructor(parameters: { opacity?: number } = {}) {
      this.opacity = parameters.opacity ?? 1;
    }
  }

  class Mesh {
    rotation = { x: 0, y: 0, z: 0 };
    scale = {
      x: 1,
      y: 1,
      z: 1,
      set: (x: number, y: number, z: number) => {
        this.scale.x = x;
        this.scale.y = y;
        this.scale.z = z;
      },
    };
    add = vi.fn();

    constructor() {}
  }

  class CanvasTexture {
    wrapS = 0;
    wrapT = 0;
    dispose = vi.fn();
    constructor() {}
  }

  const RepeatWrapping = 1000;
  const ClampToEdgeWrapping = 1001;

  return {
    WebGLRenderer,
    Scene,
    PerspectiveCamera,
    AmbientLight,
    DirectionalLight,
    PointLight,
    SphereGeometry,
    TorusGeometry,
    MeshPhysicalMaterial,
    MeshBasicMaterial,
    Mesh,
    CanvasTexture,
    RepeatWrapping,
    ClampToEdgeWrapping,
  };
});

import { GlassBallCursor } from './GlassBallCursor';

function installMatchMedia({
  desktopFine = true,
  reducedMotion = false,
}: {
  desktopFine?: boolean;
  reducedMotion?: boolean;
} = {}) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn((query: string) => ({
      matches: query.includes('prefers-reduced-motion') ? reducedMotion : desktopFine,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

function installAnimationFrame(frameId = 42) {
  const requestAnimationFrameMock = vi.fn(() => frameId);
  const cancelAnimationFrameMock = vi.fn();

  Object.defineProperty(window, 'requestAnimationFrame', {
    configurable: true,
    value: requestAnimationFrameMock,
  });
  Object.defineProperty(globalThis, 'requestAnimationFrame', {
    configurable: true,
    value: requestAnimationFrameMock,
  });
  Object.defineProperty(window, 'cancelAnimationFrame', {
    configurable: true,
    value: cancelAnimationFrameMock,
  });
  Object.defineProperty(globalThis, 'cancelAnimationFrame', {
    configurable: true,
    value: cancelAnimationFrameMock,
  });

  return {
    requestAnimationFrameMock,
    cancelAnimationFrameMock,
  };
}

async function waitForCursorEligibilityCheck() {
  await waitFor(() => {
    expect(window.matchMedia).toHaveBeenCalled();
  });
}

describe('GlassBallCursor', () => {
  beforeEach(() => {
    threeMock.reset();
    installMatchMedia();
    installAnimationFrame();
    window.history.pushState({}, '', '/');
    document.documentElement.removeAttribute('data-visual-test');
    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: vi.fn(() => null),
    });
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-visual-test');
    vi.restoreAllMocks();
  });

  it('renders nothing in visual test mode', async () => {
    document.documentElement.setAttribute('data-visual-test', 'true');

    render(<GlassBallCursor />);

    await waitForCursorEligibilityCheck();
    expect(screen.queryByTestId('glass-ball-cursor')).not.toBeInTheDocument();
    expect(threeMock.rendererRender).not.toHaveBeenCalled();
  });

  it('renders nothing when reduced motion is enabled', async () => {
    installMatchMedia({ desktopFine: true, reducedMotion: true });

    render(<GlassBallCursor />);

    await waitForCursorEligibilityCheck();
    expect(screen.queryByTestId('glass-ball-cursor')).not.toBeInTheDocument();
    expect(threeMock.rendererRender).not.toHaveBeenCalled();
  });

  it('renders nothing on non-desktop or coarse-pointer environments', async () => {
    installMatchMedia({ desktopFine: false, reducedMotion: false });

    render(<GlassBallCursor />);

    await waitForCursorEligibilityCheck();
    expect(screen.queryByTestId('glass-ball-cursor')).not.toBeInTheDocument();
    expect(threeMock.rendererRender).not.toHaveBeenCalled();
  });

  it('portals a fixed-size canvas to document.body on desktop fine-pointer devices', async () => {
    render(<GlassBallCursor />);

    const cursor = await screen.findByTestId('glass-ball-cursor');
    const canvas = screen.getByTestId('glass-ball-cursor-canvas') as HTMLCanvasElement;

    expect(cursor.parentElement).toBe(document.body);
    expect(canvas.width).toBe(160);
    expect(canvas.height).toBe(160);
    expect(threeMock.rendererSetPixelRatio).toHaveBeenCalledWith(1);
    expect(threeMock.rendererSetSize).toHaveBeenCalledWith(160, 160, false);
    expect(threeMock.rendererRender).toHaveBeenCalled();
  });

  it('registers runtime handlers and cleans up animation and Three.js resources', async () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { cancelAnimationFrameMock } = installAnimationFrame(77);

    const { unmount } = render(<GlassBallCursor />);

    await screen.findByTestId('glass-ball-cursor');

    expect(addEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function), {
      passive: true,
    });
    expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('blur', expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('blur', expect.any(Function));
    expect(cancelAnimationFrameMock).toHaveBeenCalledWith(77);
    expect(threeMock.rendererDispose).toHaveBeenCalledTimes(1);
    expect(threeMock.geometryDispose).toHaveBeenCalledTimes(4);
    expect(threeMock.materialDispose).toHaveBeenCalledTimes(4);
  });

  it('does not throw when hover probing finds no element under the pointer', async () => {
    const ourWorkSection = document.createElement('section');
    ourWorkSection.id = 'our-work';
    ourWorkSection.getBoundingClientRect = vi.fn(() => ({
      x: 0,
      y: 0,
      top: 0,
      right: 300,
      bottom: 300,
      left: 0,
      width: 300,
      height: 300,
      toJSON: () => ({}),
    }));
    document.body.appendChild(ourWorkSection);

    render(<GlassBallCursor />);

    await screen.findByTestId('glass-ball-cursor');

    expect(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 120, clientY: 80 }));
    }).not.toThrow();
    expect(document.elementFromPoint).toHaveBeenCalledWith(120, 80);

    ourWorkSection.remove();
  });

  it('only activates while the pointer is inside the Our Work section', async () => {
    const ourWorkSection = document.createElement('section');
    ourWorkSection.id = 'our-work';
    ourWorkSection.getBoundingClientRect = vi.fn(() => ({
      x: 0,
      y: 100,
      top: 100,
      right: 700,
      bottom: 700,
      left: 0,
      width: 700,
      height: 600,
      toJSON: () => ({}),
    }));
    document.body.appendChild(ourWorkSection);

    render(<GlassBallCursor />);

    const cursor = await screen.findByTestId('glass-ball-cursor');

    expect(cursor).toHaveAttribute('data-active', 'false');

    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 240, clientY: 240 }));

    await waitFor(() => {
      expect(cursor).toHaveAttribute('data-active', 'true');
    });

    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 240, clientY: 80 }));

    await waitFor(() => {
      expect(cursor).toHaveAttribute('data-active', 'false');
    });

    ourWorkSection.remove();
  });
});
