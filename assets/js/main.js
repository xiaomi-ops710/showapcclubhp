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

  /* ---- blog: tag filter + date sort ---- */
  const blogList = document.getElementById('blogList');
  if (blogList) {
    const rows = [...blogList.querySelectorAll('.blog-row')];
    const chips = [...document.querySelectorAll('.chip[data-tag]')];
    const sortBtn = document.getElementById('sortBtn');
    let activeTag = 'all';
    let sortDesc = true;

    function render() {
      const filtered = rows.filter(r => activeTag === 'all' || (r.dataset.tags || '').split(',').includes(activeTag));
      filtered.sort((a, b) => {
        const da = new Date(a.dataset.date), db = new Date(b.dataset.date);
        return sortDesc ? db - da : da - db;
      });
      rows.forEach(r => r.style.display = 'none');
      filtered.forEach(r => { r.style.display = ''; blogList.appendChild(r); });
      if (sortBtn) {
        sortBtn.querySelector('.msr').textContent = sortDesc ? 'arrow_downward' : 'arrow_upward';
      }
    }
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeTag = chip.dataset.tag;
        render();
      });
    });
    if (sortBtn) {
      sortBtn.addEventListener('click', () => { sortDesc = !sortDesc; render(); });
    }
    render();
  }
})();
