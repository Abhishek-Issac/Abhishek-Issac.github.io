/* ============================================================
   PARTICLES.JS — Interactive Particle Background System
   A lightweight canvas-based particle engine with mouse interaction
   ============================================================ */

class ParticleSystem {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.animationId = null;
    this.isRunning = false;

    this.options = {
      particleCount: options.particleCount || 80,
      particleColor: options.particleColor || 'rgba(0, 240, 255, ',
      lineColor: options.lineColor || 'rgba(0, 240, 255, ',
      particleMinSize: options.particleMinSize || 1,
      particleMaxSize: options.particleMaxSize || 3,
      speed: options.speed || 0.5,
      connectionDistance: options.connectionDistance || 150,
      mouseInteraction: options.mouseInteraction !== false,
      responsive: options.responsive !== false,
      fps: options.fps || 60,
    };

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.start();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    this.ctx.scale(dpr, dpr);
    this.width = rect.width;
    this.height = rect.height;
  }

  createParticles() {
    this.particles = [];
    const count = Math.min(
      this.options.particleCount,
      Math.floor((this.width * this.height) / 8000)
    );

    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(this));
    }
  }

  bindEvents() {
    if (this.options.mouseInteraction) {
      this.canvas.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      });

      this.canvas.addEventListener('mouseleave', () => {
        this.mouse.x = null;
        this.mouse.y = null;
      });
    }

    if (this.options.responsive) {
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          this.resize();
          this.createParticles();
        }, 250);
      });
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else {
        this.start();
      }
    });
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.frameInterval = 1000 / this.options.fps;
    this.animate();
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  animate(currentTime) {
    if (!this.isRunning) return;

    this.animationId = requestAnimationFrame((t) => this.animate(t));

    if (!currentTime) currentTime = performance.now();
    const elapsed = currentTime - this.lastTime;

    if (elapsed < this.frameInterval) return;
    this.lastTime = currentTime - (elapsed % this.frameInterval);

    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
      this.particles[i].draw();

      for (let j = i + 1; j < this.particles.length; j++) {
        this.connectParticles(this.particles[i], this.particles[j]);
      }
    }
  }

  connectParticles(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.options.connectionDistance) {
      const opacity = 1 - distance / this.options.connectionDistance;
      this.ctx.strokeStyle = this.options.lineColor + (opacity * 0.3) + ')';
      this.ctx.lineWidth = 0.5;
      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.lineTo(p2.x, p2.y);
      this.ctx.stroke();
    }
  }

  updateColors(particleColor, lineColor) {
    this.options.particleColor = particleColor;
    this.options.lineColor = lineColor;
  }
}

class Particle {
  constructor(system) {
    this.system = system;
    this.x = Math.random() * system.width;
    this.y = Math.random() * system.height;
    this.size = Math.random() * (system.options.particleMaxSize - system.options.particleMinSize)
                + system.options.particleMinSize;
    this.baseSize = this.size;
    this.vx = (Math.random() - 0.5) * system.options.speed;
    this.vy = (Math.random() - 0.5) * system.options.speed;
    this.opacity = Math.random() * 0.5 + 0.3;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > this.system.width) this.vx *= -1;
    if (this.y < 0 || this.y > this.system.height) this.vy *= -1;

    if (this.x < 0) this.x = 0;
    if (this.x > this.system.width) this.x = this.system.width;
    if (this.y < 0) this.y = 0;
    if (this.y > this.system.height) this.y = this.system.height;

    if (this.system.mouse.x !== null && this.system.options.mouseInteraction) {
      const dx = this.x - this.system.mouse.x;
      const dy = this.y - this.system.mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.system.mouse.radius) {
        const force = (this.system.mouse.radius - distance) / this.system.mouse.radius;
        const angle = Math.atan2(dy, dx);
        this.x += Math.cos(angle) * force * 2;
        this.y += Math.sin(angle) * force * 2;
        this.size = this.baseSize + force * 2;
      } else {
        this.size += (this.baseSize - this.size) * 0.1;
      }
    }
  }

  draw() {
    this.system.ctx.fillStyle = this.system.options.particleColor + this.opacity + ')';
    this.system.ctx.beginPath();
    this.system.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.system.ctx.fill();
  }
}

/* ---------- Floating Shapes System ---------- */
class FloatingShapes {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.shapes = [];
    this.init();
  }

  init() {
    const shapeTypes = ['circle', 'square', 'triangle', 'hexagon'];
    const count = 12;

    for (let i = 0; i < count; i++) {
      const shape = document.createElement('div');
      shape.className = 'floating-shape';
      const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
      const size = Math.random() * 30 + 10;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = Math.random() * 10 + 15;
      const delay = Math.random() * 5;

      shape.style.cssText = `
        position: absolute;
        left: ${x}%;
        top: ${y}%;
        width: ${size}px;
        height: ${size}px;
        opacity: ${Math.random() * 0.1 + 0.02};
        animation: float ${duration}s ease-in-out ${delay}s infinite;
        pointer-events: none;
      `;

      switch (type) {
        case 'circle':
          shape.style.borderRadius = '50%';
          shape.style.border = '1px solid var(--primary)';
          break;
        case 'square':
          shape.style.border = '1px solid var(--secondary)';
          shape.style.transform = `rotate(${Math.random() * 45}deg)`;
          break;
        case 'triangle':
          shape.style.width = '0';
          shape.style.height = '0';
          shape.style.borderLeft = `${size / 2}px solid transparent`;
          shape.style.borderRight = `${size / 2}px solid transparent`;
          shape.style.borderBottom = `${size}px solid rgba(var(--accent-rgb), 0.1)`;
          break;
        case 'hexagon':
          shape.style.clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
          shape.style.background = 'rgba(var(--primary-rgb), 0.05)';
          break;
      }

      this.container.appendChild(shape);
      this.shapes.push(shape);
    }
  }
}

window.ParticleSystem = ParticleSystem;
window.FloatingShapes = FloatingShapes;
