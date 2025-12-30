/**
 * Mouse Trail Effect - Code by Leon
 * Speed-responsive trail with theme colors that coalesces when stationary
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
      cursorSize: 12,
      trailElementSize: 10,
      
      // Speed thresholds (px per frame, ~16ms)
      speedFast: 10,
      speedMedium: 3,
      speedSlow: 0.5,
      
      // Spacing based on speed (px)
      spacingFast: 35,
      spacingMedium: 20,
      spacingSlow: 10,
      
      // Coalescing
      stationaryThreshold: 100, // ms
      coalesceSpeed: 0.15, // lerp factor for coalescing
      
      // Follow speed (lerp factor)
      followSpeedFast: 0.08,
      followSpeedMedium: 0.12,
      followSpeedSlow: 0.18,
      
      // Position history
      positionHistorySize: 10
    };
    
    // State
    this.container = null;
    this.cursor = null;
    this.trailElements = [];
    this.positionHistory = [];
    this.currentSpeed = 0;
    this.isStationary = false;
    this.lastMoveTime = 0;
    this.animationFrame = null;
    this.isEnabled = false;
    
    // Current positions
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
      return; // Disable effect if user prefers reduced motion
    }
    
    // Wait for DOM to be ready
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
      this.updateTrail();
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
    this.cursor.style.backgroundColor = this.config.cursorColor;
    this.cursor.style.width = `${this.config.cursorSize}px`;
    this.cursor.style.height = `${this.config.cursorSize}px`;
    this.container.appendChild(this.cursor);
    
    // Create trail elements
    for (let i = 0; i < this.config.trailElementCount; i++) {
      const element = document.createElement('div');
      element.className = 'trail-element';
      element.setAttribute('data-index', i);
      element.style.backgroundColor = this.config.trailColors[i];
      element.style.width = `${this.config.trailElementSize}px`;
      element.style.height = `${this.config.trailElementSize}px`;
      element.style.opacity = '0';
      this.container.appendChild(element);
      this.trailElements.push(element);
      
      // Initialize positions
      this.trailPositions.push({ x: 0, y: 0 });
    }
  }
  
  attachEventListeners() {
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    document.addEventListener('mouseleave', () => this.handleMouseLeave());
    window.addEventListener('beforeunload', () => this.cleanup());
  }
  
  handleMouseMove(event) {
    const now = Date.now();
    const x = event.clientX;
    const y = event.clientY;
    
    // Update mouse position
    this.mouseX = x;
    this.mouseY = y;
    this.cursorX = x;
    this.cursorY = y;
    this.lastMoveTime = now;
    
    // Initialize trail positions on first move if not set
    if (this.positionHistory.length === 0) {
      for (let i = 0; i < this.config.trailElementCount; i++) {
        this.trailPositions[i] = {
          x: x - (i + 1) * 15,
          y: y
        };
      }
    }
    
    // Add to position history
    this.positionHistory.push({ x, y, time: now });
    
    // Limit history size
    if (this.positionHistory.length > this.config.positionHistorySize) {
      this.positionHistory.shift();
    }
    
    // Calculate speed
    this.calculateSpeed();
    
    // Mark as not stationary
    this.isStationary = false;
  }
  
  handleMouseLeave() {
    // Hide trail when mouse leaves window
    if (this.cursor) {
      this.cursor.style.opacity = '0';
    }
    this.trailElements.forEach(el => {
      el.style.opacity = '0';
    });
  }
  
  calculateSpeed() {
    if (this.positionHistory.length < 2) {
      this.currentSpeed = 0;
      return;
    }
    
    const recent = this.positionHistory.slice(-2);
    const [prev, curr] = recent;
    
    const dx = curr.x - prev.x;
    const dy = curr.y - prev.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const timeDelta = curr.time - prev.time;
    
    // Speed in px per 16ms (roughly one frame)
    this.currentSpeed = timeDelta > 0 ? (distance / timeDelta) * 16 : 0;
  }
  
  
  getSpacing() {
    if (this.currentSpeed >= this.config.speedFast) {
      return this.config.spacingFast;
    } else if (this.currentSpeed >= this.config.speedMedium) {
      return this.config.spacingMedium;
    } else if (this.currentSpeed >= this.config.speedSlow) {
      return this.config.spacingSlow;
    } else {
      return this.config.spacingSlow;
    }
  }
  
  getFollowSpeed() {
    if (this.currentSpeed >= this.config.speedFast) {
      return this.config.followSpeedFast;
    } else if (this.currentSpeed >= this.config.speedMedium) {
      return this.config.followSpeedMedium;
    } else {
      return this.config.followSpeedSlow;
    }
  }
  
  lerp(start, end, factor) {
    return start + (end - start) * factor;
  }
  
  updateTrail() {
    if (!this.isEnabled) return;
    
    // Update cursor position (always follows mouse directly)
    this.cursorX = this.mouseX;
    this.cursorY = this.mouseY;
    
    // Update stationary state
    const now = Date.now();
    const timeSinceLastMove = now - this.lastMoveTime;
    this.isStationary = timeSinceLastMove > this.config.stationaryThreshold;
    
    if (this.cursor) {
      const offsetX = this.cursorX - (this.config.cursorSize / 2);
      const offsetY = this.cursorY - (this.config.cursorSize / 2);
      this.cursor.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
      // Show cursor if mouse has moved
      if (this.lastMoveTime > 0) {
        this.cursor.style.opacity = '1';
      }
    }
    
    // Update trail if we have position history
    if (this.positionHistory.length > 0) {
      if (this.isStationary) {
        // Coalescing mode - all elements move toward cursor
        this.coalesce();
      } else {
        // Normal following mode - elements follow path with spacing
        this.followPath();
      }
    }
    
    // Continue animation loop
    this.animationFrame = requestAnimationFrame(() => this.updateTrail());
  }
  
  coalesce() {
    const coalesceSpeed = this.config.coalesceSpeed;
    
    this.trailElements.forEach((element, index) => {
      // Move toward cursor position
      this.trailPositions[index].x = this.lerp(
        this.trailPositions[index].x,
        this.cursorX,
        coalesceSpeed
      );
      this.trailPositions[index].y = this.lerp(
        this.trailPositions[index].y,
        this.cursorY,
        coalesceSpeed
      );
      
      // Update element position
      const pos = this.trailPositions[index];
      const offsetX = pos.x - (this.config.trailElementSize / 2);
      const offsetY = pos.y - (this.config.trailElementSize / 2);
      element.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
      element.style.opacity = '1';
      element.classList.add('coalescing');
    });
  }
  
  followPath() {
    const spacing = this.getSpacing();
    const followSpeed = this.getFollowSpeed();
    
    // Calculate target positions along the path
    const targetPositions = [];
    let accumulatedDistance = 0;
    let currentIndex = this.positionHistory.length - 1;
    
    // Work backwards from cursor to determine where each element should be
    for (let i = 0; i < this.config.trailElementCount; i++) {
      let targetX = this.cursorX;
      let targetY = this.cursorY;
      
      // Find position along path that's 'spacing * (i+1)' pixels away
      accumulatedDistance = 0;
      currentIndex = this.positionHistory.length - 1;
      
      while (currentIndex > 0 && accumulatedDistance < spacing * (i + 1)) {
        const curr = this.positionHistory[currentIndex];
        const prev = this.positionHistory[currentIndex - 1];
        
        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        const segmentDistance = Math.sqrt(dx * dx + dy * dy);
        
        if (accumulatedDistance + segmentDistance >= spacing * (i + 1)) {
          // Interpolate along this segment
          const remaining = spacing * (i + 1) - accumulatedDistance;
          const t = remaining / segmentDistance;
          targetX = prev.x + dx * t;
          targetY = prev.y + dy * t;
          break;
        }
        
        accumulatedDistance += segmentDistance;
        currentIndex--;
      }
      
      // If we don't have enough history, use cursor position with offset
      if (accumulatedDistance < spacing * (i + 1)) {
        const angle = Math.atan2(
          this.positionHistory[this.positionHistory.length - 1].y - 
          (this.positionHistory[0]?.y || this.cursorY),
          this.positionHistory[this.positionHistory.length - 1].x - 
          (this.positionHistory[0]?.x || this.cursorX)
        );
        targetX = this.cursorX - Math.cos(angle) * spacing * (i + 1);
        targetY = this.cursorY - Math.sin(angle) * spacing * (i + 1);
      }
      
      targetPositions.push({ x: targetX, y: targetY });
    }
    
    // Update each trail element toward its target
    this.trailElements.forEach((element, index) => {
      const target = targetPositions[index];
      
      // Smoothly move toward target
      this.trailPositions[index].x = this.lerp(
        this.trailPositions[index].x,
        target.x,
        followSpeed
      );
      this.trailPositions[index].y = this.lerp(
        this.trailPositions[index].y,
        target.y,
        followSpeed
      );
      
      // Update element position
      const pos = this.trailPositions[index];
      const offsetX = pos.x - (this.config.trailElementSize / 2);
      const offsetY = pos.y - (this.config.trailElementSize / 2);
      element.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
      element.style.opacity = '1';
      element.classList.remove('coalescing');
    });
  }
  
  cleanup() {
    this.isEnabled = false;
    
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    
    // Remove event listeners would be handled by browser on page unload
  }
}

// Auto-initialize
const mouseTrail = new MouseTrail();
