/* regal.js — v3 portfolio interactions
   - splash dismiss
   - typewriter
   - reveal-on-scroll
   - skill-bar fill on enter viewport
   - scroll progress bar
   - sticky nav shrink + scroll-spy
   - cursor follower with trail (desktop)
   - parallax for hero card
   - magnetic CTA buttons
   - live GitHub stats fetch (counters, languages, repos)
   - smooth in-page scroll
   - graceful snake fallback
*/
(function () {
  'use strict';

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(hover: none)').matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* -------- SPLASH -------- */
  function dismissSplash() {
    const sp = $('.rg-splash');
    if (!sp) return;
    sp.classList.add('gone');
    setTimeout(() => sp.remove(), 1400);
  }
  if (document.readyState === 'complete') setTimeout(dismissSplash, 500);
  else window.addEventListener('load', () => setTimeout(dismissSplash, 500));

  /* -------- TYPEWRITER -------- */
  const tw = $('[data-typewriter]');
  if (tw) {
    const target = tw.querySelector('.text');
    const roles = (tw.getAttribute('data-roles') || '').split('|').map(s => s.trim()).filter(Boolean);
    let r = 0, i = 0, deleting = false;
    function tick() {
      if (!target || roles.length === 0) return;
      const role = roles[r];
      if (!deleting) {
        i++; target.textContent = role.slice(0, i);
        if (i === role.length) { deleting = true; setTimeout(tick, 1700); return; }
        setTimeout(tick, 55 + Math.random() * 40);
      } else {
        i--; target.textContent = role.slice(0, i);
        if (i === 0) { deleting = false; r = (r + 1) % roles.length; setTimeout(tick, 280); return; }
        setTimeout(tick, 25);
      }
    }
    if (!reduceMotion) tick();
    else if (target && roles[0]) target.textContent = roles[0];
  }

  /* -------- REVEAL-ON-SCROLL -------- */
  const reveals = $$('.rg-reveal');
  if (reveals.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const delay = parseInt(e.target.getAttribute('data-delay') || '0', 10);
          setTimeout(() => e.target.classList.add('in'), delay);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => io.observe(el));
  }

  /* -------- SKILL BARS -------- */
  const skills = $$('.rg-skill');
  if (skills.length) {
    const so = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); so.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    skills.forEach(s => so.observe(s));
  }

  /* -------- SCROLL PROGRESS + NAV SHRINK + SCROLL-SPY -------- */
  const progressEl = $('.rg-progress > span');
  const nav = $('.rg-nav');
  const sections = $$('section[id]').filter(s => s.id);
  const navLinks = $$('.rg-nav-links a[href^="#"]');

  function onScroll() {
    const h = document.documentElement;
    const max = (h.scrollHeight - h.clientHeight) || 1;
    const pct = Math.min(100, Math.max(0, (h.scrollTop / max) * 100));
    if (progressEl) progressEl.style.width = pct + '%';
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 24);

    // scroll-spy
    const cur = window.scrollY + 140;
    let activeId = null;
    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      if (cur >= s.offsetTop) activeId = s.id;
    }
    navLinks.forEach(a => {
      const m = a.getAttribute('href').slice(1);
      a.classList.toggle('is-active', m === activeId);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* -------- CURSOR FOLLOWER + TRAIL (desktop only) -------- */
  if (!reduceMotion && !isTouch) {
    const cur = document.createElement('div');
    cur.className = 'rg-cursor';
    document.body.appendChild(cur);
    const trail = document.createElement('div');
    trail.className = 'rg-cursor-trail';
    document.body.appendChild(trail);

    let x = innerWidth / 2, y = innerHeight / 2;
    let tx = x, ty = y, txt = x, tyt = y;
    document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    function loop() {
      x  += (tx - x)  * 0.28;
      y  += (ty - y)  * 0.28;
      txt += (tx - txt) * 0.10;
      tyt += (ty - tyt) * 0.10;
      cur.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      trail.style.transform = `translate(${txt}px, ${tyt}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    document.addEventListener('mouseover', e => {
      const t = e.target;
      const isLink = t && (t.closest('a, button, [data-tilt], .rg-card, .rg-project'));
      cur.classList.toggle('is-link', !!isLink);
    });
  }

  /* -------- PARALLAX HERO CARD -------- */
  const card = $('.rg-hero-card');
  if (card && !reduceMotion && !isTouch) {
    window.addEventListener('scroll', () => {
      const y = Math.min(80, window.scrollY * 0.12);
      card.style.transform = `rotate(${2 - y * 0.04}deg) translateY(${y * 0.4}px)`;
    }, { passive: true });
  }

  /* -------- MAGNETIC BUTTONS -------- */
  if (!reduceMotion && !isTouch) {
    $$('.rg-btn, [data-magnet]').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.18;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.18;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* -------- TILT CARDS -------- */
  if (!reduceMotion && !isTouch) {
    $$('[data-tilt]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = (py - 0.5) * -8;
        const ry = (px - 0.5) * 8;
        el.style.transform = `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* -------- LIVE GITHUB DATA -------- */
  const username = 'Abhishek-Issac';
  const apiBase = 'https://api.github.com/users/' + username;

  function animateNum(el, to) {
    if (!el) return;
    if (reduceMotion) { el.textContent = to.toLocaleString(); return; }
    const dur = 1500, start = performance.now(), from = 0;
    function step(t) {
      const k = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(from + (to - from) * eased).toLocaleString();
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  fetch(apiBase, { headers: { Accept: 'application/vnd.github+json' } })
    .then(r => r.ok ? r.json() : null)
    .then(profile => {
      if (!profile) return;
      animateNum($('#gh-public-repos'), profile.public_repos || 0);
      animateNum($('#gh-followers'), profile.followers || 0);
      animateNum($('#gh-following'), profile.following || 0);
      const created = new Date(profile.created_at);
      const now = new Date();
      const yrs = Math.max(1, now.getFullYear() - created.getFullYear() - (now < new Date(now.getFullYear(), created.getMonth(), created.getDate()) ? 1 : 0));
      animateNum($('#gh-years'), yrs);
      const joined = $('#gh-joined');
      if (joined) joined.textContent = created.toISOString().slice(0, 10);
    })
    .catch(() => {});

  Promise.all([
    fetch(apiBase + '/repos?per_page=100&type=owner&sort=updated&page=1').then(r => r.ok ? r.json() : []),
    fetch(apiBase + '/repos?per_page=100&type=owner&sort=updated&page=2').then(r => r.ok ? r.json() : [])
  ]).then(([a, b]) => {
    const repos = (a || []).concat(b || []).filter(r => r && !r.fork && !r.private);
    const langs = {};
    repos.forEach(r => { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1; });
    const sorted = Object.entries(langs).sort((x, y) => y[1] - x[1]).slice(0, 7);
    const total = sorted.reduce((s, [, n]) => s + n, 0) || 1;
    const langWrap = $('#gh-langs');
    if (langWrap) {
      langWrap.innerHTML = sorted.map(([n, c]) => {
        const pct = ((c / total) * 100).toFixed(1);
        return `<span class="rg-tag" title="${c} repos">${n} <span class="rg-muted">· ${pct}%</span></span>`;
      }).join('');
    }
    animateNum($('#gh-stars'), repos.reduce((s, r) => s + (r.stargazers_count || 0), 0));

    const recent = [...repos]
      .sort((x, y) => new Date(y.pushed_at) - new Date(x.pushed_at))
      .slice(0, 8);
    const list = $('#gh-repo-list');
    if (list) {
      if (recent.length === 0) {
        list.innerHTML = '<a class="rg-repo" href="https://github.com/' + username + '" target="_blank" rel="noopener"><span class="rg-repo-name">github API rate-limited or offline</span><span class="rg-repo-desc">try a refresh in a minute, or open the GitHub profile directly.</span><span class="rg-repo-meta"><span>—</span><span>★ —</span><span>—</span></span></a>';
      } else {
        list.innerHTML = recent.map(r => {
          const desc = (r.description || '').replace(/[<>]/g, '').slice(0, 100);
          return `<a class="rg-repo" href="${r.html_url}" target="_blank" rel="noopener">
            <span class="rg-repo-name">${r.name}</span>
            ${desc ? `<span class="rg-repo-desc">${desc}</span>` : ''}
            <span class="rg-repo-meta">
              ${r.language ? `<span class="lang">${r.language}</span>` : '<span>—</span>'}
              <span>★ ${r.stargazers_count || 0}</span>
              <span>updated ${new Date(r.pushed_at).toLocaleDateString()}</span>
            </span>
          </a>`;
        }).join('');
      }
    }
  }).catch(() => {});

  /* -------- SNAKE FALLBACK -------- */
  const snakeImg = $('#rg-snake-img');
  const snakeFb = $('#rg-snake-fb');
  if (snakeImg) {
    snakeImg.addEventListener('error', () => {
      if (snakeFb) snakeFb.style.display = 'block';
      snakeImg.style.display = 'none';
    }, { once: true });
  }

  /* -------- SMOOTH IN-PAGE SCROLL -------- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id && id.length > 1) {
        const t = $(id);
        if (t) {
          e.preventDefault();
          t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        }
      }
    });
  });

  /* -------- YEAR STAMP -------- */
  const yr = $('#rg-year');
  if (yr) yr.textContent = new Date().getFullYear();

})();
