/**
 * Mouse Trail Effect - Code by Leon
 * Smooth, natural trail with graduated sizes (larger near cursor)
 */

class MouseTrail {
  constructor() {
    // Configuration
    this.config = {
      // Theme colors (Brand Colors: Purple, Blue, Green, Orange)
      brandColors: [
        '#8B5CF6', // Purple
        '#3B82F6', // Blue
        '#22c55e', // Green
        '#D9751A'  // Orange
      ],

      // Element count - 0 for no trail, just the cursor
      trailElementCount: 0,

      // Cursor settings
      cursorSize: 14,

      // Smooth follow speeds
      cursorLerp: 0.25,

      // Stationary detection
      stationaryThreshold: 150, // ms to consider stopped
    };

    // State
    this.container = null;
    this.cursor = null;
    this.trailElements = []; // Kept empty for compatibility
    this.isStationary = false;
    this.lastMoveTime = 0;
    this.animationFrame = null;
    this.isEnabled = false;

    // Color cycling state
    this.currentColorIndex = 0;

    // Smooth positions
    this.mouseX = 0;
    this.mouseY = 0;
    this.cursorX = 0;
    this.cursorY = 0;

    // Initialize
    this.init();
  }

  init() {
    // Check for reduced motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    try {
      this.createContainer();
      this.createCursor();
      this.attachEventListeners();
      this.isEnabled = true;
      this.animate();
      console.log('Mouse trail initialized with color cycling');
    } catch (error) {
      console.error('Error initializing mouse trail:', error);
    }
  }

  createContainer() {
    this.container = document.createElement('div');
    this.container.className = 'mouse-trail-container';
    document.body.appendChild(this.container);
  }

  createCursor() {
    this.cursor = document.createElement('div');
    this.cursor.className = 'mouse-cursor';
    this.cursor.style.width = `${this.config.cursorSize}px`;
    this.cursor.style.height = `${this.config.cursorSize}px`;

    // Set initial color
    this.cursor.style.backgroundColor = this.config.brandColors[0];
    // Add transition for smooth color changes
    this.cursor.style.transition = 'background-color 0.3s ease, opacity 0.3s ease';

    this.cursor.style.opacity = '0';
    this.container.appendChild(this.cursor);
  }

  attachEventListeners() {
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e), { passive: true });
    document.addEventListener('mouseleave', () => this.handleMouseLeave());
    window.addEventListener('beforeunload', () => this.cleanup());
  }

  handleMouseMove(event) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;

    const now = performance.now();

    // Detect "Stop & Go" motion
    // If we were stationary (time since last move > threshold), this is a new movement
    if (now - this.lastMoveTime > this.config.stationaryThreshold) {
      this.cycleColor();
    }

    this.lastMoveTime = now;
    this.isStationary = false;

    // Show elements on first move
    if (this.cursor && this.cursor.style.opacity === '0') {
      this.cursor.style.opacity = '1';
      this.cursorX = this.mouseX;
      this.cursorY = this.mouseY;
    }
  }

  cycleColor() {
    if (!this.cursor) return;

    // Move to next color
    this.currentColorIndex = (this.currentColorIndex + 1) % this.config.brandColors.length;
    const newColor = this.config.brandColors[this.currentColorIndex];

    this.cursor.style.backgroundColor = newColor;
  }

  handleMouseLeave() {
    if (this.cursor) this.cursor.style.opacity = '0';
  }

  // Smooth linear interpolation
  lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  animate() {
    if (!this.isEnabled) return;

    // Smoothly interpolate cursor position
    this.cursorX = this.lerp(this.cursorX, this.mouseX, this.config.cursorLerp);
    this.cursorY = this.lerp(this.cursorY, this.mouseY, this.config.cursorLerp);

    // Update cursor element
    if (this.cursor) {
      const offsetX = this.cursorX - (this.config.cursorSize / 2);
      const offsetY = this.cursorY - (this.config.cursorSize / 2);
      this.cursor.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
    }

    // Continue animation loop
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  cleanup() {
    this.isEnabled = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}

// Auto-initialize
const mouseTrail = new MouseTrail();
