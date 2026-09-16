/* ==========================================================
   昭和学院パソコン部 サイト共通スクリプト
   ========================================================== */
(function () {
  const root = document.documentElement;
  const themeIcon = document.getElementById('themeIcon');

  function systemPrefersDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function applyTheme(mode) {
    if (mode === 'dark') {
      root.setAttribute('data-theme', 'dark');
      if (themeIcon) themeIcon.textContent = 'light_mode';
    } else if (mode === 'light') {
      root.setAttribute('data-theme', 'light');
      if (themeIcon) themeIcon.textContent = 'dark_mode';
    } else {
      root.removeAttribute('data-theme');
      if (themeIcon) themeIcon.textContent = systemPrefersDark() ? 'light_mode' : 'dark_mode';
    }
  }
  const savedTheme = localStorage.getItem('pcclub-theme');
  applyTheme(savedTheme || 'auto');
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = localStorage.getItem('pcclub-theme') || 'auto';
      const effectiveDark = current === 'dark' || (current === 'auto' && systemPrefersDark());
      const next = effectiveDark ? 'light' : 'dark';
      localStorage.setItem('pcclub-theme', next);
      applyTheme(next);
    });
  }

  /* ---- drawer ---- */
  const menuBtn = document.getElementById('menuBtn');
  const drawer = document.getElementById('drawer');
  const scrim = document.getElementById('scrim');
  function openDrawer() { drawer.classList.add('open'); scrim.classList.add('open'); }
  function closeDrawer() { drawer.classList.remove('open'); scrim.classList.remove('open'); }
  if (menuBtn) menuBtn.addEventListener('click', openDrawer);
  if (scrim) scrim.addEventListener('click', closeDrawer);

  /* ---- photo slider (auto) ---- */
  const track = document.getElementById('sliderTrack');
  if (track) {
    const dotsWrap = document.getElementById('sliderDots');
    const slides = track.children.length;
    let idx = 0;
    for (let i = 0; i < slides; i++) {
      const d = document.createElement('div');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      dotsWrap.appendChild(d);
    }
    function goToSlide(i) {
      idx = i;
      track.style.transform = `translateX(-${idx * 100}%)`;
      [...dotsWrap.children].forEach((d, k) => d.classList.toggle('active', k === idx));
    }
    if (slides > 1) setInterval(() => goToSlide((idx + 1) % slides), 4500);
  }

  /* ---- tagline auto slider ---- */
  const taglineEl = document.getElementById('tagline');
  if (taglineEl && window.PCCLUB_TAGLINES && window.PCCLUB_TAGLINES.length) {
    const taglines = window.PCCLUB_TAGLINES;
    let tIdx = 0;
    function showTagline(i) {
      taglineEl.classList.remove('show');
      setTimeout(() => {
        taglineEl.textContent = taglines[i];
        taglineEl.classList.add('show');
      }, 220);
    }
    showTagline(0);
    if (taglines.length > 1) {
      setInterval(() => { tIdx = (tIdx + 1) % taglines.length; showTagline(tIdx); }, 3800);
    }
  }

  /* ---- blog: tag filter + date sort + text search ---- */
  const blogList = document.getElementById('blogList');
  if (blogList) {
    const rows = [...blogList.querySelectorAll('.blog-row')];
    const chips = [...document.querySelectorAll('.chip[data-tag]')];
    const sortBtn = document.getElementById('sortBtn');
    const searchInput = document.getElementById('blogSearch');
    const emptyMsg = document.getElementById('blogEmpty');
    let activeTag = 'all';
    let sortDesc = true;

    function render() {
      const q = (searchInput && searchInput.value || '').trim().toLowerCase();
      const filtered = rows.filter(r => {
        const tagOk = activeTag === 'all' || (r.dataset.tags || '').split(',').includes(activeTag);
        const text = (r.dataset.title || '') + (r.dataset.tags || '');
        const searchOk = !q || text.toLowerCase().includes(q);
        return tagOk && searchOk;
      });
      filtered.sort((a, b) => {
        const da = new Date(a.dataset.date), db = new Date(b.dataset.date);
        return sortDesc ? db - da : da - db;
      });
      rows.forEach(r => r.style.display = 'none');
      filtered.forEach(r => { r.style.display = ''; blogList.appendChild(r); });
      if (sortBtn) sortBtn.querySelector('.msr').textContent = sortDesc ? 'arrow_downward' : 'arrow_upward';
      if (emptyMsg) emptyMsg.style.display = filtered.length ? 'none' : 'block';
    }
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeTag = chip.dataset.tag;
        render();
      });
    });
    if (sortBtn) sortBtn.addEventListener('click', () => { sortDesc = !sortDesc; render(); });
    if (searchInput) searchInput.addEventListener('input', render);
    render();
  }

  /* ---- site-wide search ---- */
  const siteSearchInput = document.getElementById('siteSearchInput');
  if (siteSearchInput && window.PCCLUB_INDEX) {
    const resultsWrap = document.getElementById('searchResults');
    const emptyMsg = document.getElementById('searchEmpty');
    function renderResults() {
      const q = siteSearchInput.value.trim().toLowerCase();
      resultsWrap.innerHTML = '';
      if (!q) { emptyMsg.style.display = 'none'; return; }
      const hits = window.PCCLUB_INDEX.filter(item =>
        (item.title + item.snippet + (item.tags || '')).toLowerCase().includes(q)
      ).slice(0, 30);
      emptyMsg.style.display = hits.length ? 'none' : 'block';
      hits.forEach(item => {
        const a = document.createElement('a');
        a.className = 'search-result';
        a.href = item.url;
        a.innerHTML = `<span class="type-chip">${item.type}</span><h3>${item.title}</h3><p>${item.snippet}</p>`;
        resultsWrap.appendChild(a);
      });
    }
    siteSearchInput.addEventListener('input', renderResults);
  }
  /* ---- FAQ accordion ---- */
  document.addEventListener('click', (e) => {
    const q = e.target.closest('.faq-question');
    if (q) q.parentElement.classList.toggle('open');
  });

  /* ---- ripple feedback (works on dynamically added elements too) ---- */
  const RIPPLE_SELECTOR = '.icon-btn, .tab, .chip, .work-card, .blog-row, .search-result, .event-card, .drawer-item, .sort-btn, .faq-question, .see-all';
  document.addEventListener('click', (e) => {
    const target = e.target.closest(RIPPLE_SELECTOR);
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const span = document.createElement('span');
    span.className = 'ripple-effect';
    span.style.width = span.style.height = size + 'px';
    span.style.left = (e.clientX - rect.left - size / 2) + 'px';
    span.style.top = (e.clientY - rect.top - size / 2) + 'px';
    target.appendChild(span);
    setTimeout(() => span.remove(), 550);
  });
})();
