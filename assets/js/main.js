/* ============================================================
   MAIN.JS — Core Functionality for Abhishek Issac Portfolio
   Navigation, Scroll Animations, Typewriter, Theme Switcher,
   GitHub Integration, Counters, and more
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initNavigation();
  initScrollAnimations();
  initTypewriter();
  initThemeSwitcher();
  initScrollToTop();
  initCounterAnimations();
  initSkillBars();
  initProjectFilter();
  initContactForm();
  initRippleEffect();
  initParallax();
  initGitHubIntegration();
  initTerminalAnimation();
  initMagneticButtons();
  initSmoothScroll();
  initCodeHighlight();
});

/* ==================== PAGE LOADER ==================== */
function initPageLoader() {
  const loader = document.querySelector('.page-transition');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('loaded');
      document.body.classList.add('loaded');
    }, 500);
  });

  setTimeout(() => {
    loader.classList.add('loaded');
    document.body.classList.add('loaded');
  }, 3000);
}

/* ==================== NAVIGATION ==================== */
function initNavigation() {
  const nav = document.querySelector('.main-nav');
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  if (nav) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      nav.classList.toggle('scrolled', currentScroll > 50);

      if (currentScroll > lastScroll && currentScroll > 200) {
        nav.style.transform = 'translateY(-100%)';
      } else {
        nav.style.transform = 'translateY(0)';
      }
      lastScroll = currentScroll;
    });
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
      if (mobileNavOverlay) mobileNavOverlay.classList.toggle('visible');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    if (mobileNavOverlay) {
      mobileNavOverlay.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        mobileNavOverlay.classList.remove('visible');
        document.body.style.overflow = '';
      });
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (hamburger) hamburger.classList.remove('active');
      if (mobileNav) mobileNav.classList.remove('open');
      if (mobileNavOverlay) mobileNavOverlay.classList.remove('visible');
      document.body.style.overflow = '';
    });
  });

  updateActiveNavLink();
  window.addEventListener('scroll', debounce(updateActiveNavLink, 100));
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    }
  });
}

/* ==================== SCROLL ANIMATIONS ==================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll(
    '.animate-on-scroll, .fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right, .scale-in, .blur-in, .stagger-children, .reveal-clip'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (!entry.target.classList.contains('stagger-children')) {
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    elements.forEach(el => observer.observe(el));
  } else {
    elements.forEach(el => el.classList.add('visible'));
  }
}

/* ==================== TYPEWRITER EFFECT ==================== */
function initTypewriter() {
  const element = document.querySelector('.typewriter-text');
  if (!element) return;

  const strings = [
    'Telegram Bot Developer',
    'Python Enthusiast',
    'Full-Stack Builder',
    'Open Source Contributor',
    'MongoDB & PostgreSQL Expert',
    'Linux Server Administrator',
    'Tech Explorer & Innovator',
    'Series & Anime Enthusiast'
  ];

  let stringIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function type() {
    const current = strings[stringIndex];

    if (isDeleting) {
      element.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      element.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === current.length) {
      isDeleting = true;
      typingSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      stringIndex = (stringIndex + 1) % strings.length;
      typingSpeed = 300;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==================== THEME SWITCHER ==================== */
function initThemeSwitcher() {
  const panel = document.querySelector('.theme-switcher-panel');
  const toggle = document.querySelector('.theme-switcher-toggle');
  const options = document.querySelectorAll('.theme-option');
  const themeToggleBtn = document.querySelector('.theme-toggle');

  const savedTheme = localStorage.getItem('portfolio-theme') || 'neon';
  applyTheme(savedTheme);

  if (toggle && panel) {
    toggle.addEventListener('click', () => {
      panel.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (panel.classList.contains('open') && !panel.contains(e.target)) {
        panel.classList.remove('open');
      }
    });
  }

  options.forEach(option => {
    option.addEventListener('click', () => {
      const theme = option.dataset.theme;
      applyTheme(theme);
      localStorage.setItem('portfolio-theme', theme);

      options.forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');
    });
  });

  if (themeToggleBtn) {
    const themes = ['neon', 'cyberpunk', 'ocean', 'ember', 'aurora', 'matrix'];
    let currentIndex = themes.indexOf(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % themes.length;
      const theme = themes[currentIndex];
      applyTheme(theme);
      localStorage.setItem('portfolio-theme', theme);

      options.forEach(opt => {
        opt.classList.toggle('active', opt.dataset.theme === theme);
      });
    });
  }
}

function applyTheme(theme) {
  if (theme === 'neon') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }

  const particleCanvas = document.getElementById('particle-canvas');
  if (particleCanvas && window.particleSystem) {
    const colors = getThemeColors(theme);
    window.particleSystem.updateColors(colors.particle, colors.line);
  }
}

function getThemeColors(theme) {
  const colorMap = {
    neon: { particle: 'rgba(0, 240, 255, ', line: 'rgba(0, 240, 255, ' },
    cyberpunk: { particle: 'rgba(255, 0, 255, ', line: 'rgba(255, 0, 255, ' },
    ocean: { particle: 'rgba(0, 212, 255, ', line: 'rgba(0, 212, 255, ' },
    ember: { particle: 'rgba(255, 107, 53, ', line: 'rgba(255, 107, 53, ' },
    aurora: { particle: 'rgba(168, 85, 247, ', line: 'rgba(168, 85, 247, ' },
    matrix: { particle: 'rgba(0, 255, 65, ', line: 'rgba(0, 255, 65, ' },
  };
  return colorMap[theme] || colorMap.neon;
}

/* ==================== SCROLL TO TOP ==================== */
function initScrollToTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==================== COUNTER ANIMATIONS ==================== */
function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-count]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(counter => observer.observe(counter));
  }
}

function animateCounter(element) {
  const target = parseInt(element.dataset.count, 10);
  const suffix = element.dataset.suffix || '';
  const prefix = element.dataset.prefix || '';
  const duration = 2000;
  const start = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);
    const current = Math.floor(eased * target);

    element.textContent = prefix + current.toLocaleString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = prefix + target.toLocaleString() + suffix;
    }
  }

  requestAnimationFrame(update);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/* ==================== SKILL BARS ==================== */
function initSkillBars() {
  const bars = document.querySelectorAll('.progress-bar-fill');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const width = entry.target.dataset.width;
            entry.target.style.width = width + '%';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    bars.forEach(bar => {
      bar.style.width = '0%';
      observer.observe(bar);
    });
  }
}

/* ==================== PROJECT FILTER ==================== */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        const category = card.dataset.category;
        const shouldShow = filter === 'all' || category === filter;

        if (shouldShow) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 400);
        }
      });
    });
  });
}

/* ==================== CONTACT FORM ==================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #00ff88, #00cc66)';

      form.reset();

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1500);
  });
}

/* ==================== RIPPLE EFFECT ==================== */
function initRippleEffect() {
  document.querySelectorAll('.ripple-effect').forEach(element => {
    element.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

/* ==================== PARALLAX ==================== */
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  if (!parallaxElements.length) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.5;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  });
}

/* ==================== GITHUB INTEGRATION ==================== */
function initGitHubIntegration() {
  const username = 'Abhishek-Issac';
  const reposContainer = document.getElementById('github-repos');
  const statsContainer = document.getElementById('github-stats');

  if (reposContainer) {
    fetchGitHubRepos(username, reposContainer);
  }

  if (statsContainer) {
    fetchGitHubProfile(username, statsContainer);
  }
}

async function fetchGitHubRepos(username, container) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`
    );
    if (!response.ok) throw new Error('GitHub API error');
    const repos = await response.json();

    container.innerHTML = repos.map(repo => `
      <div class="github-repo-card card animate-on-scroll">
        <div class="github-repo-header">
          <i class="fas fa-book-bookmark"></i>
          <a href="${repo.html_url}" target="_blank" rel="noopener" class="github-repo-name">
            ${repo.name}
          </a>
        </div>
        <p class="github-repo-description">
          ${repo.description || 'No description provided'}
        </p>
        <div class="github-repo-meta">
          ${repo.language ? `
            <span>
              <span class="language-dot ${repo.language.toLowerCase()}"></span>
              ${repo.language}
            </span>
          ` : ''}
          <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
          <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
        </div>
      </div>
    `).join('');

    initScrollAnimations();
  } catch (err) {
    container.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
        <i class="fab fa-github" style="font-size: 2rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
        <p>Visit my GitHub profile to see my repositories</p>
        <a href="https://github.com/${username}" target="_blank" class="btn btn-outline mt-md">
          <i class="fab fa-github"></i> View GitHub
        </a>
      </div>
    `;
  }
}

async function fetchGitHubProfile(username, container) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) throw new Error('GitHub API error');
    const profile = await response.json();

    const statCards = container.querySelectorAll('[data-github-stat]');
    statCards.forEach(card => {
      const stat = card.dataset.githubStat;
      const valueEl = card.querySelector('.stat-number, [data-count]');
      if (valueEl && profile[stat] !== undefined) {
        valueEl.dataset.count = profile[stat];
      }
    });

    initCounterAnimations();
  } catch (err) {
    /* Graceful fallback: static values remain */
  }
}

/* ==================== TERMINAL ANIMATION ==================== */
function initTerminalAnimation() {
  const terminals = document.querySelectorAll('.terminal-animate');

  terminals.forEach(terminal => {
    const lines = terminal.querySelectorAll('.terminal-line, .terminal-output');
    lines.forEach((line, index) => {
      line.style.opacity = '0';
      line.style.transform = 'translateY(10px)';

      setTimeout(() => {
        line.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        line.style.opacity = '1';
        line.style.transform = 'translateY(0)';
      }, 300 + index * 200);
    });
  });
}

/* ==================== MAGNETIC BUTTONS ==================== */
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.magnetic-hover');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

/* ==================== SMOOTH SCROLL ==================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ==================== CODE HIGHLIGHT ==================== */
function initCodeHighlight() {
  document.querySelectorAll('code').forEach(block => {
    if (block.parentElement.tagName === 'PRE') {
      block.innerHTML = block.innerHTML
        .replace(/\b(const|let|var|function|return|if|else|for|while|class|import|from|export|async|await|new)\b/g,
          '<span style="color: var(--secondary);">$1</span>')
        .replace(/\b(true|false|null|undefined|NaN)\b/g,
          '<span style="color: var(--accent);">$1</span>')
        .replace(/(["'`])(?:(?=(\\?))\2.)*?\1/g,
          '<span style="color: var(--success);">$&</span>')
        .replace(/\/\/.*/g,
          '<span style="color: var(--text-muted);">$&</span>');
    }
  });
}

/* ==================== UTILITY FUNCTIONS ==================== */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/* ==================== CURSOR TRAIL (Optional) ==================== */
function initCursorTrail() {
  const trail = [];
  const trailLength = 20;

  for (let i = 0; i < trailLength; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed;
      width: ${4 + i * 0.5}px;
      height: ${4 + i * 0.5}px;
      border-radius: 50%;
      background: rgba(var(--primary-rgb), ${0.3 - i * 0.015});
      pointer-events: none;
      z-index: 9998;
      transition: transform 0.1s ease;
    `;
    document.body.appendChild(dot);
    trail.push({ el: dot, x: 0, y: 0 });
  }

  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateTrail() {
    let x = mouseX, y = mouseY;

    trail.forEach((dot, i) => {
      const nextX = x;
      const nextY = y;

      dot.x += (nextX - dot.x) * (0.3 - i * 0.01);
      dot.y += (nextY - dot.y) * (0.3 - i * 0.01);

      dot.el.style.left = dot.x + 'px';
      dot.el.style.top = dot.y + 'px';

      x = dot.x;
      y = dot.y;
    });

    requestAnimationFrame(animateTrail);
  }

  animateTrail();
}
