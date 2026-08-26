(() => {
  'use strict';

  const DB = window.DESIGN_LIBRARY || { categories: [], styles: [] };
  const CATS = DB.categories || [];
  const STYLES = DB.styles || [];
  const catById = new Map(CATS.map((c) => [c.id, c]));

  const $ = (sel) => document.querySelector(sel);
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  const state = { cat: 'all', q: '' };

  /* ---------------- theme ---------------- */
  const root = document.documentElement;
  const savedTheme = (() => { try { return localStorage.getItem('dsl-theme'); } catch { return null; } })();
  if (savedTheme) root.dataset.theme = savedTheme;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  $('#themeToggle').addEventListener('click', () => {
    const isDark = root.dataset.theme
      ? root.dataset.theme === 'dark'
      : prefersDark.matches;
    const next = isDark ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('dsl-theme', next); } catch {}
  });

  /* ---------------- header counts ---------------- */
  $('#countStyles').textContent = STYLES.length;
  $('#countCats').textContent = CATS.filter((c) => STYLES.some((s) => s.category === c.id)).length;
  $('#countShots').textContent = STYLES.filter((s) => s.image).length;
  if (DB.generatedAt) {
    $('#genAt').textContent = new Date(DB.generatedAt).toLocaleString();
  }

  /* ---------------- filters ---------------- */
  const filtersEl = $('#filters');

  function buildFilters() {
    filtersEl.innerHTML = '';
    const counts = new Map();
    for (const s of STYLES) counts.set(s.category, (counts.get(s.category) || 0) + 1);

    const rows = [{ id: 'all', name: 'All styles', accent: 'var(--ink-3)', n: STYLES.length }].concat(
      CATS.filter((c) => counts.get(c.id)).map((c) => ({ ...c, n: counts.get(c.id) }))
    );

    for (const r of rows) {
      const b = el('button', 'chip');
      b.type = 'button';
      b.dataset.cat = r.id;
      b.setAttribute('aria-pressed', String(state.cat === r.id));
      b.title = r.blurb || '';
      const dot = el('span', 'chip__dot');
      dot.style.background = r.accent || 'currentColor';
      b.append(dot, el('span', null, r.name), el('span', 'chip__n', String(r.n)));
      b.addEventListener('click', () => {
        state.cat = r.id;
        buildFilters();
        render();
      });
      filtersEl.append(b);
    }
    updateRail();
  }

  /* ---- filter rail: edge fades + drag to scroll ---- */
  function updateRail() {
    const max = filtersEl.scrollWidth - filtersEl.clientWidth;
    const scrollable = max > 1;
    filtersEl.classList.toggle('is-scrollable', scrollable);
    filtersEl.classList.toggle('fade-l', scrollable && filtersEl.scrollLeft > 1);
    filtersEl.classList.toggle('fade-r', scrollable && filtersEl.scrollLeft < max - 1);
  }

  filtersEl.addEventListener('scroll', updateRail, { passive: true });
  window.addEventListener('resize', updateRail);

  (() => {
    const THRESHOLD = 5;
    let down = false, startX = 0, startScroll = 0, moved = 0, swallowClick = false;

    filtersEl.addEventListener('pointerdown', (e) => {
      moved = 0;
      swallowClick = false;
      if (e.button !== 0 || e.pointerType !== 'mouse') return;
      if (filtersEl.scrollWidth - filtersEl.clientWidth <= 1) return;
      down = true;
      startX = e.clientX;
      startScroll = filtersEl.scrollLeft;
    });

    window.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      // Only become a drag once the pointer has actually travelled, so a
      // stationary click never enters drag state.
      if (moved > THRESHOLD) filtersEl.classList.add('is-dragging');
      filtersEl.scrollLeft = startScroll - dx;
    });

    const end = () => {
      if (!down) return;
      down = false;
      filtersEl.classList.remove('is-dragging');
      // A drag that finishes on top of a chip must not also activate it.
      // The click (if any) is dispatched in this same task, so clearing the
      // flag on a 0ms timer guarantees it can never leak into a later click.
      if (moved > THRESHOLD) {
        swallowClick = true;
        setTimeout(() => { swallowClick = false; }, 0);
      }
    };
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);

    filtersEl.addEventListener('click', (e) => {
      if (!swallowClick) return;
      swallowClick = false;
      e.stopPropagation();
      e.preventDefault();
    }, true);
  })();

  /* ---------------- generated preview for image-less styles ---------------- */
  const lum = (hex) => {
    const h = hex.replace('#', '');
    const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16) / 255);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  function mockPreview(style) {
    const raw = style.palette && style.palette.length ? style.palette : ['#ddd', '#bbb', '#999', '#333'];
    // Use the most extreme tone as the ground, then order the rest by contrast against it.
    const ground = raw.slice().sort((a, b) => Math.abs(lum(b) - 0.5) - Math.abs(lum(a) - 0.5))[0];
    const gl = lum(ground);
    const p = raw.filter((c) => c !== ground).sort((a, b) => Math.abs(lum(b) - gl) - Math.abs(lum(a) - gl));
    if (!p.length) p.push(gl > 0.5 ? '#333333' : '#dddddd');
    const at = (i) => p[i % p.length];
    const wrap = el('div', 'mock');
    wrap.style.background = ground;

    const bar = el('i', 'bar');
    bar.style.background = at(0);
    wrap.append(bar);

    const row = el('div', 'row');
    const layout = style.previewLayout || 'hero';

    const col = (fills) => {
      const c = el('div', 'col');
      for (const f of fills) {
        const n = el('i', f.k);
        n.style.background = f.c;
        c.append(n);
      }
      return c;
    };

    if (layout === 'grid') {
      for (let i = 0; i < 3; i++) {
        row.append(col([{ k: 'blob', c: at(i) }, { k: 'txt m', c: at(0) }, { k: 'txt s', c: at(0) }]));
      }
    } else if (layout === 'split') {
      row.append(col([{ k: 'txt m', c: at(0) }, { k: 'txt s', c: at(0) }, { k: 'blob', c: at(1) }]));
      row.append(col([{ k: 'blob', c: at(2) }]));
    } else if (layout === 'poster') {
      row.append(col([{ k: 'circle', c: at(1) }, { k: 'blob', c: at(2) }, { k: 'txt m', c: at(0) }]));
    } else if (layout === 'cards') {
      row.append(col([{ k: 'blob', c: at(0) }, { k: 'txt s', c: at(1) }]));
      row.append(col([{ k: 'blob', c: at(1) }, { k: 'blob', c: at(2) }]));
    } else {
      row.append(col([{ k: 'txt m', c: at(0) }, { k: 'txt s', c: at(0) }, { k: 'blob', c: at(1) }]));
      row.append(col([{ k: 'blob', c: at(2) }, { k: 'txt s', c: at(0) }]));
    }
    wrap.append(row);
    return wrap;
  }

  /* ---------------- search ---------------- */
  function haystack(s) {
    if (s._hay) return s._hay;
    const cat = catById.get(s.category);
    s._hay = [
      s.title, s.short, s.long, s.category, cat ? cat.name : '',
      (s.keywords || []).join(' '),
      Object.values(s.traits || {}).join(' '),
      s.prompt || '',
    ].join(' ').toLowerCase();
    return s._hay;
  }

  function visible() {
    const q = state.q.trim().toLowerCase();
    const terms = q ? q.split(/\s+/) : [];
    return STYLES.filter((s) => {
      if (state.cat !== 'all' && s.category !== state.cat) return false;
      if (!terms.length) return true;
      const h = haystack(s);
      return terms.every((t) => h.includes(t));
    });
  }

  function highlight(text, q) {
    if (!q) return text;
    const terms = q.trim().toLowerCase().split(/\s+/).filter((t) => t.length > 1);
    if (!terms.length) return text;
    const frag = document.createDocumentFragment();
    const re = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'ig');
    let last = 0;
    for (const m of text.matchAll(re)) {
      if (m.index > last) frag.append(text.slice(last, m.index));
      frag.append(el('mark', null, m[0]));
      last = m.index + m[0].length;
    }
    frag.append(text.slice(last));
    return frag;
  }

  /* ---------------- grid ---------------- */
  const gridEl = $('#grid');
  const emptyEl = $('#empty');
  const resultLine = $('#resultLine');

  function card(style) {
    const cat = catById.get(style.category) || { name: style.category, accent: 'var(--ink-3)' };
    const b = el('button', 'card');
    b.type = 'button';
    b.setAttribute('aria-label', `Open ${style.title}`);

    const shot = el('div', 'card__shot');
    if (style.image && !style.missing) {
      const img = el('img');
      img.src = style.image;
      img.alt = `${style.title} — reference screenshot`;
      img.loading = 'lazy';
      img.decoding = 'async';
      shot.append(img);
    } else {
      shot.append(mockPreview(style));
      const flag = el('span', 'card__flag card__flag--noimg', style.missing ? 'image missing' : 'no screenshot');
      shot.append(flag);
    }
    if (style.draft) shot.append(el('span', 'card__flag', 'draft'));

    const body = el('div', 'card__body');
    const h = el('h2', 'card__title');
    h.append(highlight(style.title, state.q));
    const p = el('p', 'card__short');
    p.append(highlight(style.short || '', state.q));

    const tags = el('div', 'tags');
    const kws = style.keywords || [];
    kws.slice(0, 4).forEach((k) => tags.append(el('span', 'tag', k)));
    if (kws.length > 4) tags.append(el('span', 'tag tag--more', `+${kws.length - 4}`));

    const catRow = el('div', 'card__cat');
    const dot = el('span', 'cat-dot');
    dot.style.background = cat.accent;
    catRow.append(dot, el('b', null, cat.name));

    body.append(h, p, tags, catRow);
    b.append(shot, body);
    b.addEventListener('click', () => openModal(style));
    return b;
  }

  function render() {
    const list = visible();
    gridEl.innerHTML = '';
    const frag = document.createDocumentFragment();
    list.forEach((s) => frag.append(card(s)));
    gridEl.append(frag);

    emptyEl.hidden = list.length > 0;
    const catName = state.cat === 'all' ? 'all categories' : (catById.get(state.cat)?.name || state.cat);
    resultLine.textContent = `${list.length} style${list.length === 1 ? '' : 's'} · ${catName}` +
      (state.q ? ` · matching “${state.q}”` : '');
  }

  /* ---------------- modal ---------------- */
  const modal = $('#modal');
  const modalBody = $('#modalBody');
  let current = null;
  let lastFocus = null;

  function brief(s) {
    const cat = catById.get(s.category);
    const lines = [
      `DESIGN BRIEF — ${s.title}`,
      `Category: ${cat ? cat.name : s.category}`,
      '',
      'SUMMARY',
      s.short || '',
      '',
      'DESCRIPTION',
      s.long || '',
      '',
      'KEYWORDS',
      (s.keywords || []).join(', '),
    ];
    if (s.palette?.length) lines.push('', 'PALETTE', s.palette.join('  '));
    const traits = Object.entries(s.traits || {});
    if (traits.length) {
      lines.push('', 'DIRECTION');
      traits.forEach(([k, v]) => lines.push(`- ${k}: ${v}`));
    }
    if (s.prompt) lines.push('', 'IMAGE PROMPT (higgsfield.ai)', s.prompt);
    return lines.join('\n');
  }

  function openModal(style) {
    current = style;
    lastFocus = document.activeElement;
    const cat = catById.get(style.category) || { name: style.category, accent: 'var(--ink-3)' };

    modalBody.innerHTML = '';

    const shot = el('div', 'm-shot');
    if (style.image && !style.missing) {
      const img = el('img');
      img.src = style.image;
      img.alt = `${style.title} — full reference screenshot`;
      shot.append(img);
    } else {
      shot.classList.add('m-shot--mock');
      shot.append(mockPreview(style));
    }

    const main = el('div', 'm-main');

    /* left column */
    const left = el('div');
    const eyebrow = el('p', 'm-eyebrow');
    const dot = el('span', 'cat-dot');
    dot.style.background = cat.accent;
    eyebrow.append(dot, el('span', null, cat.name));
    if (style.draft) {
      const f = el('span', 'card__flag', 'draft');
      f.style.position = 'static';
      eyebrow.append(f);
    }
    const mTitle = el('h2', 'm-title', style.title);
    mTitle.id = 'modalTitle';
    left.append(eyebrow, mTitle);
    if (style.short) left.append(el('p', 'm-lede', style.short));
    if (style.long) left.append(el('p', 'm-long', style.long));

    const promptBlock = el('div', 'm-block');
    promptBlock.style.marginTop = '26px';
    promptBlock.append(el('h3', 'm-h', 'Image prompt — higgsfield.ai'));
    const box = el('div', 'prompt-box');
    box.append(el('pre', null, style.prompt || 'No prompt written yet for this style.'));
    promptBlock.append(box);
    promptBlock.append(el('p', 'prompt-note',
      'Paste into higgsfield.ai. Add your subject/brand at the end, and set a wide (16:9) or tall (2:3) ratio to match the layout.'));
    left.append(promptBlock);

    /* right column */
    const right = el('div');

    const kwBlock = el('div', 'm-block');
    kwBlock.append(el('h3', 'm-h', `Keywords (${(style.keywords || []).length})`));
    const tags = el('div', 'tags');
    (style.keywords || []).forEach((k) => tags.append(el('span', 'tag', k)));
    kwBlock.append(tags);
    right.append(kwBlock);

    if (style.palette?.length) {
      const pal = el('div', 'm-block');
      pal.append(el('h3', 'm-h', 'Palette'));
      const sw = el('div', 'swatches');
      style.palette.forEach((c) => {
        const s1 = el('button', 'swatch');
        s1.type = 'button';
        s1.title = `Copy ${c}`;
        const i = el('i');
        i.style.background = c;
        s1.append(i, el('span', null, c.replace('#', '').toUpperCase()));
        s1.addEventListener('click', () => copy(c, `Copied ${c}`));
        sw.append(s1);
      });
      pal.append(sw);
      right.append(pal);
    }

    const traits = Object.entries(style.traits || {});
    if (traits.length) {
      const tb = el('div', 'm-block');
      tb.append(el('h3', 'm-h', 'Direction'));
      const dl = el('dl', 'traits');
      traits.forEach(([k, v]) => {
        const d = el('div');
        d.append(el('dt', null, k), el('dd', null, v));
        dl.append(d);
      });
      tb.append(dl);
      right.append(tb);
    }

    if (style.image) {
      const src = el('div', 'm-block');
      src.append(el('h3', 'm-h', 'Reference'));
      src.append(el('p', 'prompt-note', style.image + (style.missing ? ' — file not found' : '')));
      right.append(src);
    }

    main.append(left, right);
    modalBody.append(shot, main);

    modal.hidden = false;
    document.body.classList.add('is-locked');
    modalBody.scrollTop = 0;
    $('#copyBrief').focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove('is-locked');
    current = null;
    if (lastFocus) lastFocus.focus();
  }

  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
    if (e.key === '/' && modal.hidden && document.activeElement !== searchEl) {
      e.preventDefault();
      searchEl.focus();
    }
  });

  /* ---------------- clipboard ---------------- */
  function copy(text, msg, btn) {
    const done = () => {
      toast(msg);
      if (btn) {
        const old = btn.textContent;
        btn.textContent = 'Copied ✓';
        btn.classList.add('is-done');
        setTimeout(() => { btn.textContent = old; btn.classList.remove('is-done'); }, 1400);
      }
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done, () => fallback(text, done));
    } else {
      fallback(text, done);
    }
  }
  function fallback(text, done) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
    document.body.append(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch { toast('Copy failed — select the text manually'); }
    ta.remove();
  }

  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 1900);
  }

  $('#copyBrief').addEventListener('click', (e) => {
    if (current) copy(brief(current), 'Design brief copied', e.currentTarget);
  });
  $('#copyPrompt').addEventListener('click', (e) => {
    if (!current) return;
    if (!current.prompt) return toast('No image prompt for this style yet');
    copy(current.prompt, 'Image prompt copied', e.currentTarget);
  });

  /* ---------------- search wiring ---------------- */
  const searchEl = $('#search');
  const clearEl = $('#searchClear');
  let debounce;
  searchEl.addEventListener('input', () => {
    clearTimeout(debounce);
    clearEl.hidden = !searchEl.value;
    debounce = setTimeout(() => { state.q = searchEl.value; render(); }, 120);
  });
  clearEl.addEventListener('click', () => {
    searchEl.value = ''; state.q = ''; clearEl.hidden = true; render(); searchEl.focus();
  });
  $('#resetAll').addEventListener('click', () => {
    state.q = ''; state.cat = 'all'; searchEl.value = ''; clearEl.hidden = true;
    buildFilters(); render();
  });

  /* ---------------- go ---------------- */
  buildFilters();
  render();
})();
