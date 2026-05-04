/* premium.js — interactions for the whitish-minimal index.html
   v2 — May 2026:
   - typewriter for hero roles
   - IntersectionObserver reveal-on-scroll
   - decorative side-rail builder
   - live GitHub stats: counters + recent public repos (excludes forks/private)
   - card 3D tilt on hover
   - animated skill progress bars
   - scroll progress bar
   - dynamic navbar shrink
   - page-load splash dismiss
   - subtle cursor follower
   - smooth in-page anchor scroll
*/
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarse = window.matchMedia('(hover: none)').matches;

  /* ====== PAGE-LOAD SPLASH ====== */
  function dismissSplash() {
    const s = document.querySelector('.pg-splash');
    if (!s) return;
    requestAnimationFrame(() => {
      s.classList.add('gone');
      setTimeout(() => { s.parentNode && s.parentNode.removeChild(s); }, 1100);
    });
  }
  if (document.readyState === 'complete') setTimeout(dismissSplash, 250);
  else window.addEventListener('load', () => setTimeout(dismissSplash, 250));

  /* ====== TYPEWRITER ====== */
  const tw = document.querySelector('[data-typewriter]');
  if (tw) {
    const roles = (tw.getAttribute('data-roles') || '').split('|').map(s => s.trim()).filter(Boolean);
    let r = 0, i = 0, deleting = false;
    const target = tw.querySelector('.pg-tw-text');

    function tick() {
      if (!target || roles.length === 0) return;
      const role = roles[r];
      if (!deleting) {
        i++;
        target.textContent = role.slice(0, i);
        if (i === role.length) { deleting = true; setTimeout(tick, 1500); return; }
        setTimeout(tick, 60 + Math.random() * 40);
      } else {
        i--;
        target.textContent = role.slice(0, i);
        if (i === 0) { deleting = false; r = (r + 1) % roles.length; setTimeout(tick, 280); return; }
        setTimeout(tick, 28);
      }
    }
    if (!reduceMotion) tick();
    else if (target && roles[0]) target.textContent = roles[0];
  }

  /* ====== REVEAL ON SCROLL ====== */
  const reveals = document.querySelectorAll('.pg-reveal');
  if (reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
    reveals.forEach(el => io.observe(el));
  }

  /* ====== SKILL BARS ====== */
  const skills = document.querySelectorAll('.pg-skill');
  if (skills.length) {
    const so = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          so.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    skills.forEach(s => so.observe(s));
  }

  /* ====== SCROLL PROGRESS BAR ====== */
  const progressEl = document.querySelector('.pg-progress > span');
  function onScroll() {
    if (progressEl) {
      const h = document.documentElement;
      const max = (h.scrollHeight - h.clientHeight) || 1;
      const pct = Math.min(100, Math.max(0, (h.scrollTop / max) * 100));
      progressEl.style.width = pct + '%';
    }
    const nav = document.querySelector('.pg-nav');
    if (nav) {
      if (window.scrollY > 24) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ====== SIDE RAILS DECORATION BUILDER ====== */
  function buildRail(rail, ticks) {
    if (!rail) return;
    for (let i = 0; i < ticks.length; i++) {
      const t = document.createElement('span');
      t.className = 'tick';
      t.textContent = ticks[i];
      const top = (i + 1) * (100 / (ticks.length + 1));
      t.style.top = top + '%';
      if (rail.classList.contains('left')) t.style.left = '40px';
      else t.style.right = '40px';
      rail.appendChild(t);
    }
    const dotPositions = [10, 22, 38, 55, 70, 86];
    dotPositions.forEach((p, idx) => {
      const d = document.createElement('span');
      d.className = 'dot' + (idx % 3 === 0 ? ' gold' : (idx % 3 === 1 ? ' green' : ''));
      d.style.top = p + '%';
      if (rail.classList.contains('left')) d.style.left = (24 + (idx % 2 ? 6 : -6)) + 'px';
      else d.style.right = (24 + (idx % 2 ? 6 : -6)) + 'px';
      d.style.animationDelay = (-idx * 1.3) + 's';
      rail.appendChild(d);
    });
    const s = document.createElement('span');
    s.className = 'slider';
    rail.appendChild(s);
    const v = document.createElement('span');
    v.className = 'vline';
    rail.appendChild(v);
  }
  buildRail(document.querySelector('.pg-rail.left'),
    ['/* portfolio */', '01010110', '@kerala_in', 'commit -m', 'pyrogram', 'mongo://', 'orangefox', 'oos15_port', 'tmux a -t']);
  buildRail(document.querySelector('.pg-rail.right'),
    ['v1.5.0', 'main *', '+ feat', '~/projects', 'tg::abhishek', 'sd860 boot', '0xA17B', '200 OK', 'render(html)']);

  /* ====== LIVE GITHUB STATS ====== */
  const username = 'Abhishek-Issac';
  const apiBase = 'https://api.github.com/users/' + username;

  function animateCount(el, to) {
    if (!el) return;
    const from = 0;
    const dur = 1100;
    const start = performance.now();
    function step(t) {
      const k = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(from + (to - from) * eased).toLocaleString();
      if (k < 1) requestAnimationFrame(step);
    }
    if (reduceMotion) { el.textContent = to.toLocaleString(); return; }
    requestAnimationFrame(step);
  }

  function loadGitHub() {
    fetch(apiBase, { headers: { 'Accept': 'application/vnd.github+json' } })
      .then(r => r.ok ? r.json() : null)
      .then(profile => {
        if (!profile) return;
        animateCount(document.getElementById('gh-public-repos'), profile.public_repos || 0);
        animateCount(document.getElementById('gh-followers'), profile.followers || 0);
        animateCount(document.getElementById('gh-following'), profile.following || 0);
        const created = new Date(profile.created_at);
        const now = new Date();
        const years = Math.max(1, now.getFullYear() - created.getFullYear() - (now < new Date(now.getFullYear(), created.getMonth(), created.getDate()) ? 1 : 0));
        animateCount(document.getElementById('gh-years'), years);
        const joinedEl = document.getElementById('gh-joined');
        if (joinedEl) joinedEl.textContent = created.toISOString().slice(0, 10);
      }).catch(() => {});

    Promise.all([
      fetch(apiBase + '/repos?per_page=100&type=owner&sort=updated&page=1').then(r => r.ok ? r.json() : []),
      fetch(apiBase + '/repos?per_page=100&type=owner&sort=updated&page=2').then(r => r.ok ? r.json() : [])
    ]).then(([a, b]) => {
      const repos = (a || []).concat(b || []).filter(r => r && !r.fork && !r.private);
      const langs = {};
      repos.forEach(r => { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1; });
      const sorted = Object.entries(langs).sort((x, y) => y[1] - x[1]).slice(0, 6);
      const total = sorted.reduce((s, [, n]) => s + n, 0) || 1;
      const langWrap = document.getElementById('gh-langs');
      if (langWrap) {
        langWrap.innerHTML = sorted.map(([name, n]) => {
          const pct = ((n / total) * 100).toFixed(1);
          return '<span class="pg-tag" title="' + n + ' repo' + (n > 1 ? 's' : '') + '">' +
                 name + ' &middot; <span class="pg-muted-text">' + pct + '%</span></span>';
        }).join('');
      }
      const stars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
      animateCount(document.getElementById('gh-stars'), stars);

      const recent = [...repos]
        .sort((x, y) => (new Date(y.pushed_at)) - (new Date(x.pushed_at)))
        .slice(0, 8);
      const list = document.getElementById('gh-repo-list');
      if (list) {
        if (recent.length === 0) {
          list.innerHTML = '<a class="pg-repo" href="https://github.com/' + username + '" target="_blank" rel="noopener"><span class="pg-repo-name">github API rate-limited or offline</span><span class="pg-repo-desc">refresh in a minute, or open the GitHub profile directly.</span><span class="pg-repo-meta"><span>·</span><span>★ —</span><span>—</span></span></a>';
        } else {
          list.innerHTML = recent.map(r => {
            const desc = (r.description || '').replace(/[<>]/g, '').slice(0, 110);
            return (
              '<a class="pg-repo" href="' + r.html_url + '" target="_blank" rel="noopener">' +
                '<span class="pg-repo-name">' + r.name + '</span>' +
                (desc ? '<span class="pg-repo-desc">' + desc + '</span>' : '') +
                '<span class="pg-repo-meta">' +
                  (r.language ? '<span class="lang">' + r.language + '</span>' : '<span>·</span>') +
                  '<span>★ ' + (r.stargazers_count || 0) + '</span>' +
                  '<span>updated ' + new Date(r.pushed_at).toLocaleDateString() + '</span>' +
                '</span>' +
              '</a>'
            );
          }).join('');
        }
      }
    }).catch(() => {});
  }
  loadGitHub();

  /* ====== SNAKE FALLBACK (works even before the workflow runs) ====== */
  const snakeImg = document.getElementById('pg-snake-img');
  const snakeFallback = document.getElementById('pg-snake-fallback');
  if (snakeImg) {
    snakeImg.addEventListener('error', () => {
      if (snakeFallback) snakeFallback.style.display = 'block';
      snakeImg.style.display = 'none';
      const heatmap = document.getElementById('pg-snake-heatmap');
      if (heatmap) heatmap.style.display = 'block';
    }, { once: true });
  }

  /* ====== 3D TILT (subtle) ====== */
  document.querySelectorAll('[data-tilt]').forEach(el => {
    if (reduceMotion || isCoarse) return;
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (py - 0.5) * -6;
      const ry = (px - 0.5) * 6;
      el.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-2px)';
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });

  /* ====== CURSOR FOLLOWER (desktop only) ====== */
  if (!reduceMotion && !isCoarse) {
    const cur = document.createElement('div');
    cur.className = 'pg-cursor';
    document.body.appendChild(cur);
    let x = window.innerWidth / 2, y = window.innerHeight / 2, tx = x, ty = y;
    document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    function loop() {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      cur.style.transform = 'translate(' + x + 'px, ' + y + 'px) translate(-50%, -50%)';
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    document.addEventListener('mouseover', e => {
      const t = e.target;
      if (t && (t.tagName === 'A' || t.tagName === 'BUTTON' || t.closest('a,button,[data-tilt]'))) cur.classList.add('is-link');
      else cur.classList.remove('is-link');
    });
  }

  /* ====== Year stamp ====== */
  const yearEl = document.getElementById('pg-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ====== Smooth in-page anchor scroll ====== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id && id.length > 1 && document.querySelector(id)) {
        e.preventDefault();
        document.querySelector(id).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });
})();
