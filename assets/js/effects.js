/* ============================================================
   EFFECTS.JS — Advanced Visual Effects & Interactive Features
   Matrix rain, tilt cards, text scramble, accordion, tabs
   ============================================================ */

/* ==================== MATRIX RAIN EFFECT ==================== */
class MatrixRain {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.columns = [];
    this.isRunning = false;

    this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`';
    this.fontSize = 14;
    this.color = 'rgba(0, 240, 255, ';

    this.init();
  }

  init() {
    this.resize();
    this.createColumns();
    this.bindEvents();
    this.start();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.width = rect.width;
    this.height = rect.height;
  }

  createColumns() {
    const columnCount = Math.floor(this.width / this.fontSize);
    this.columns = [];
    for (let i = 0; i < columnCount; i++) {
      this.columns.push(Math.floor(Math.random() * this.height / this.fontSize));
    }
  }

  bindEvents() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.resize();
        this.createColumns();
      }, 250);
    });

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
    this.animate();
  }

  stop() {
    this.isRunning = false;
  }

  animate() {
    if (!this.isRunning) return;

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.font = this.fontSize + 'px monospace';

    for (let i = 0; i < this.columns.length; i++) {
      const char = this.characters[Math.floor(Math.random() * this.characters.length)];
      const x = i * this.fontSize;
      const y = this.columns[i] * this.fontSize;

      const brightness = Math.random() * 0.5 + 0.3;
      this.ctx.fillStyle = this.color + brightness + ')';
      this.ctx.fillText(char, x, y);

      if (y > this.height && Math.random() > 0.975) {
        this.columns[i] = 0;
      }
      this.columns[i]++;
    }

    setTimeout(() => requestAnimationFrame(() => this.animate()), 50);
  }

  updateColor(color) {
    this.color = color;
  }
}

/* ==================== TILT EFFECT ==================== */
class TiltEffect {
  constructor(selector, options = {}) {
    this.elements = document.querySelectorAll(selector);
    this.options = {
      maxTilt: options.maxTilt || 10,
      perspective: options.perspective || 1000,
      speed: options.speed || 300,
      scale: options.scale || 1.02,
      glare: options.glare !== false,
      ...options
    };

    this.init();
  }

  init() {
    this.elements.forEach(el => {
      el.style.transformStyle = 'preserve-3d';
      el.style.transition = `transform ${this.options.speed}ms ease-out`;

      if (this.options.glare) {
        const glareEl = document.createElement('div');
        glareEl.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          border-radius: inherit;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0) 40%,
            rgba(255, 255, 255, 0.03) 50%,
            rgba(255, 255, 255, 0) 60%,
            rgba(255, 255, 255, 0) 100%
          );
          opacity: 0;
          transition: opacity ${this.options.speed}ms ease-out;
        `;
        glareEl.className = 'tilt-glare';
        el.style.position = 'relative';
        el.style.overflow = 'hidden';
        el.appendChild(glareEl);
      }

      el.addEventListener('mouseenter', () => this.onEnter(el));
      el.addEventListener('mousemove', (e) => this.onMove(el, e));
      el.addEventListener('mouseleave', () => this.onLeave(el));
    });
  }

  onEnter(el) {
    el.style.transition = 'none';
    const glare = el.querySelector('.tilt-glare');
    if (glare) glare.style.opacity = '1';
  }

  onMove(el, e) {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((y - centerY) / centerY) * this.options.maxTilt;
    const tiltY = ((centerX - x) / centerX) * this.options.maxTilt;

    el.style.transform = `
      perspective(${this.options.perspective}px)
      rotateX(${tiltX}deg)
      rotateY(${tiltY}deg)
      scale(${this.options.scale})
    `;

    const glare = el.querySelector('.tilt-glare');
    if (glare) {
      const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) + 90;
      glare.style.background = `linear-gradient(
        ${angle}deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0) 40%,
        rgba(255, 255, 255, 0.06) 50%,
        rgba(255, 255, 255, 0) 60%,
        rgba(255, 255, 255, 0) 100%
      )`;
    }
  }

  onLeave(el) {
    el.style.transition = `transform ${this.options.speed}ms ease-out`;
    el.style.transform = `
      perspective(${this.options.perspective}px)
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `;

    const glare = el.querySelector('.tilt-glare');
    if (glare) glare.style.opacity = '0';
  }
}

/* ==================== TEXT SCRAMBLE EFFECT ==================== */
class TextScramble {
  constructor(element) {
    this.element = element;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.queue = [];
    this.frameRequest = null;
    this.frame = 0;
    this.resolve = null;
  }

  setText(newText) {
    const oldText = this.element.textContent;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise(resolve => this.resolve = resolve);

    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;

    for (let i = 0; i < this.queue.length; i++) {
      let { from, to, start, end, char } = this.queue[i];

      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span style="color: var(--primary); opacity: 0.6;">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.element.innerHTML = output;

    if (complete === this.queue.length) {
      if (this.resolve) this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(() => this.update());
      this.frame++;
    }
  }
}

/* ==================== ACCORDION ==================== */
function initAccordions() {
  const accordions = document.querySelectorAll('.accordion-item');

  accordions.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      accordions.forEach(acc => acc.classList.remove('open'));

      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

/* ==================== TAB SYSTEM ==================== */
function initTabs() {
  const tabGroups = document.querySelectorAll('[data-tab-group]');

  tabGroups.forEach(group => {
    const buttons = group.querySelectorAll('.tab-btn');
    const groupId = group.dataset.tabGroup;
    const contents = document.querySelectorAll(`[data-tab-content="${groupId}"]`);

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;

        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        contents.forEach(content => {
          content.classList.toggle('active', content.dataset.tabId === tabId);
        });
      });
    });
  });
}

/* ==================== SMOOTH REVEAL ==================== */
function initRevealOnScroll() {
  const reveals = document.querySelectorAll('.reveal-clip');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach(el => observer.observe(el));
  }
}

/* ==================== LAZY LOAD IMAGES ==================== */
function initLazyLoad() {
  const images = document.querySelectorAll('img[data-src]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });

    images.forEach(img => observer.observe(img));
  } else {
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}

/* ==================== COPY TO CLIPBOARD ==================== */
function initCopyButtons() {
  document.querySelectorAll('.code-block-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const codeBlock = btn.closest('.code-block');
      const code = codeBlock.querySelector('code') || codeBlock;
      const text = code.textContent;

      navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.color = 'var(--success)';
        btn.style.borderColor = 'var(--success)';

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.color = '';
          btn.style.borderColor = '';
        }, 2000);
      });
    });
  });
}

/* ==================== NOTIFICATION SYSTEM ==================== */
class NotificationSystem {
  constructor() {
    this.container = document.createElement('div');
    this.container.style.cssText = `
      position: fixed;
      top: 80px;
      right: 16px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 8px;
    `;
    document.body.appendChild(this.container);
  }

  show(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.transform = 'translateX(0)';
    notification.style.position = 'relative';
    notification.style.right = 'auto';
    notification.style.top = 'auto';

    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      info: 'fas fa-info-circle',
      warning: 'fas fa-exclamation-triangle'
    };

    notification.innerHTML = `
      <i class="${icons[type] || icons.info}" style="color: var(--${type === 'error' ? 'danger' : type});"></i>
      <span>${message}</span>
    `;

    this.container.appendChild(notification);

    requestAnimationFrame(() => {
      notification.classList.add('show');
    });

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }
}

/* ==================== READING PROGRESS BAR ==================== */
function initReadingProgress() {
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, var(--primary), var(--secondary));
    z-index: 10001;
    transition: width 0.1s linear;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  });
}

/* ==================== INITIALIZE ==================== */
document.addEventListener('DOMContentLoaded', () => {
  initAccordions();
  initTabs();
  initRevealOnScroll();
  initLazyLoad();
  initCopyButtons();
  initReadingProgress();

  new TiltEffect('.project-card, .skill-category, .interest-card', {
    maxTilt: 5,
    scale: 1.01,
    glare: true
  });

  window.notifier = new NotificationSystem();
});

window.MatrixRain = MatrixRain;
window.TextScramble = TextScramble;
window.TiltEffect = TiltEffect;
