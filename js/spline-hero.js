/* ==========================================================================
   SPLINE 3D ROBOT CONTROLLER (FAST RESPONSIVE ENGINE)
   Scene: https://prod.spline.design/rXdQLHKEiQRKgnvW/scene.splinecode
   High-Speed Head Tracking (120fps), Shadow DOM Penetration, Zero-Lag Tilting
   ========================================================================== */

class SplineRobotHero {
  constructor() {
    this.viewer = document.querySelector('spline-viewer');
    this.stage = document.querySelector('.hero-3d-stage');
    this.holoFrame = document.querySelector('.holo-frame');
    this.loader = document.querySelector('.robot-loader');
    this.loaderText = document.querySelector('.loader-text');
    this.canvas = null;
    this.isLoaded = false;
    this.loadTimeout = null;

    // Fast coordinate tracking
    this.targetRotateX = 0;
    this.targetRotateY = 0;
    this.currentRotateX = 0;
    this.currentRotateY = 0;
    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    this.isTicking = false;

    this.init();
  }

  init() {
    if (!this.viewer) return;

    // Safety timeout to hide loader even on slow connections
    this.loadTimeout = setTimeout(() => {
      this.handleLoadComplete();
    }, 7000);

    // Spline load hook
    this.viewer.addEventListener('load', () => {
      clearTimeout(this.loadTimeout);
      this.handleLoadComplete();
    });

    // High performance mouse tracking
    window.addEventListener('mousemove', (e) => this.onMouseMove(e), { passive: true });
    
    // Fast mobile touch tracking
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        this.onMouseMove(e.touches[0]);
      }
    }, { passive: true });

    // Start 60-120fps animation loop for butter-smooth fast movement
    this.renderLoop();
  }

  handleLoadComplete() {
    if (this.isLoaded) return;
    this.isLoaded = true;

    // Clean up Spline Logo from Shadow Root
    try {
      const shadow = this.viewer.shadowRoot;
      if (shadow) {
        const logo = shadow.querySelector('#logo');
        if (logo) logo.remove();

        this.canvas = shadow.querySelector('canvas');
        if (this.canvas) {
          this.canvas.style.outline = 'none';
          this.canvas.style.width = '100%';
          this.canvas.style.height = '100%';
        }
      }
    } catch (err) {
      console.warn('Spline shadow DOM access notice:', err);
    }

    // Instantly hide loader
    if (this.loader) {
      if (this.loaderText) this.loaderText.textContent = '3D ROBOT ONLINE';
      setTimeout(() => {
        this.loader.classList.add('loaded');
      }, 300);
    }
  }

  onMouseMove(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    // Normalize coordinates (-1 to +1)
    const normX = (this.mouseX - screenW / 2) / (screenW / 2);
    const normY = (this.mouseY - screenH / 2) / (screenH / 2);

    // Target angles (snappy & reactive)
    this.targetRotateY = normX * 14;  // 14 deg range for responsive depth
    this.targetRotateX = -normY * 11; // 11 deg pitch

    // Instantly dispatch composed pointermove into Spline Canvas for head tracking
    if (this.canvas) {
      try {
        const syntheticEvent = new PointerEvent('pointermove', {
          clientX: this.mouseX,
          clientY: this.mouseY,
          screenX: e.screenX || this.mouseX,
          screenY: e.screenY || this.mouseY,
          bubbles: true,
          cancelable: true,
          composed: true, // Crosses shadow DOM boundary into Spline runtime!
          pointerType: 'mouse',
          isPrimary: true
        });
        this.canvas.dispatchEvent(syntheticEvent);
      } catch (err) {
        // fail-safe ignore
      }
    }
  }

  renderLoop() {
    // Ultra-snappy Lerp factor (0.22 for fast, immediate response without sluggish delay)
    this.currentRotateX += (this.targetRotateX - this.currentRotateX) * 0.22;
    this.currentRotateY += (this.targetRotateY - this.currentRotateY) * 0.22;

    if (this.holoFrame) {
      this.holoFrame.style.transform = `perspective(1200px) rotateX(${this.currentRotateX.toFixed(2)}deg) rotateY(${this.currentRotateY.toFixed(2)}deg) translateZ(0)`;
    }

    requestAnimationFrame(() => this.renderLoop());
  }
}

// Instantiate on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.robotHero = new SplineRobotHero();
});
