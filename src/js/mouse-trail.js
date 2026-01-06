/**
 * Mouse Trail Effect - Code by Leon
 * Smooth, natural trail with graduated sizes (larger near cursor)
 */

class MouseTrail {
  constructor() {
    // Configuration
    this.config = {
      // Theme colors (HSL values)
      cursorColor: 'hsl(243, 88%, 16%)',
      trailColors: [
        'hsl(214, 90%, 59%)',  // Deep blue
        'hsl(262, 76%, 54%)',  // Purple
        'hsl(4, 96%, 79%)'     // Coral/peach
      ],

      // Element count
      trailElementCount: 3,

      // Graduated sizes (largest first, near cursor)
      cursorSize: 14,
      trailSizes: [12, 9, 6], // Decreasing sizes

      // Smooth follow speeds (higher = more responsive, but less smooth)
      // Using very smooth interpolation
      cursorLerp: 0.25,
      trailLerps: [0.15, 0.12, 0.09], // Staggered for natural lag

      // Coalescing
      stationaryThreshold: 150, // ms before coalescing
      coalesceSpeed: 0.08
    };

    // State
    this.container = null;
    this.cursor = null;
    this.trailElements = [];
    this.isStationary = false;
    this.lastMoveTime = 0;
    this.animationFrame = null;
    this.isEnabled = false;

    // Smooth positions (interpolated)
    this.mouseX = 0;
    this.mouseY = 0;
    this.cursorX = 0;
    this.cursorY = 0;
    this.trailPositions = [];

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
      this.createTrailElements();
      this.attachEventListeners();
      this.isEnabled = true;
      this.animate();
      console.log('Mouse trail initialized successfully');
    } catch (error) {
      console.error('Error initializing mouse trail:', error);
    }
  }

  createContainer() {
    this.container = document.createElement('div');
    this.container.className = 'mouse-trail-container';
    document.body.appendChild(this.container);
  }

  createTrailElements() {
    // Create cursor element
    this.cursor = document.createElement('div');
    this.cursor.className = 'mouse-cursor';
    this.cursor.style.width = `${this.config.cursorSize}px`;
    this.cursor.style.height = `${this.config.cursorSize}px`;
    this.cursor.style.opacity = '0';
    this.container.appendChild(this.cursor);

    // Create trail elements with graduated sizes
    for (let i = 0; i < this.config.trailElementCount; i++) {
      const element = document.createElement('div');
      element.className = 'trail-element';
      element.setAttribute('data-index', i);
      element.style.width = `${this.config.trailSizes[i]}px`;
      element.style.height = `${this.config.trailSizes[i]}px`;
      element.style.backgroundColor = this.config.trailColors[i];
      element.style.opacity = '0';
      this.container.appendChild(element);
      this.trailElements.push(element);

      // Initialize positions
      this.trailPositions.push({ x: 0, y: 0 });
    }
  }

  attachEventListeners() {
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e), { passive: true });
    document.addEventListener('mouseleave', () => this.handleMouseLeave());
    window.addEventListener('beforeunload', () => this.cleanup());
  }

  handleMouseMove(event) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    this.lastMoveTime = performance.now();
    this.isStationary = false;

    // Show elements on first move
    if (this.cursor.style.opacity === '0') {
      this.cursor.style.opacity = '1';
      this.cursorX = this.mouseX;
      this.cursorY = this.mouseY;

      // Initialize trail positions to cursor
      for (let i = 0; i < this.config.trailElementCount; i++) {
        this.trailPositions[i] = { x: this.mouseX, y: this.mouseY };
        this.trailElements[i].style.opacity = '1';
      }
    }
  }

  handleMouseLeave() {
    if (this.cursor) this.cursor.style.opacity = '0';
    this.trailElements.forEach(el => el.style.opacity = '0');
  }

  // Smooth linear interpolation
  lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  animate() {
    if (!this.isEnabled) return;

    const now = performance.now();
    this.isStationary = (now - this.lastMoveTime) > this.config.stationaryThreshold;

    // Smoothly interpolate cursor position
    this.cursorX = this.lerp(this.cursorX, this.mouseX, this.config.cursorLerp);
    this.cursorY = this.lerp(this.cursorY, this.mouseY, this.config.cursorLerp);

    // Update cursor element
    if (this.cursor) {
      const offsetX = this.cursorX - (this.config.cursorSize / 2);
      const offsetY = this.cursorY - (this.config.cursorSize / 2);
      this.cursor.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
    }

    // Update trail elements - each follows the previous one for natural chain effect
    for (let i = 0; i < this.config.trailElementCount; i++) {
      let targetX, targetY, lerpFactor;

      if (this.isStationary) {
        // Coalesce toward cursor
        targetX = this.cursorX;
        targetY = this.cursorY;
        lerpFactor = this.config.coalesceSpeed;
      } else {
        // Chain follow: first follows cursor, others follow the previous element
        if (i === 0) {
          targetX = this.cursorX;
          targetY = this.cursorY;
        } else {
          targetX = this.trailPositions[i - 1].x;
          targetY = this.trailPositions[i - 1].y;
        }
        lerpFactor = this.config.trailLerps[i];
      }

      // Smooth interpolation
      this.trailPositions[i].x = this.lerp(this.trailPositions[i].x, targetX, lerpFactor);
      this.trailPositions[i].y = this.lerp(this.trailPositions[i].y, targetY, lerpFactor);

      // Apply position
      const size = this.config.trailSizes[i];
      const offsetX = this.trailPositions[i].x - (size / 2);
      const offsetY = this.trailPositions[i].y - (size / 2);
      this.trailElements[i].style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
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
