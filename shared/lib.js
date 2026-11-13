/*
 * Data logic for the main page.
 * No styling lives here: each version owns its markup classes and CSS.
 * Exposes window.DL. Expects data/styles.js to be loaded first.
 */
(() => {
  'use strict';

  const DB = window.DESIGN_LIBRARY || { categories: [], styles: [] };
  const styles = DB.styles || [];
  const counts = new Map();
  for (const s of styles) counts.set(s.category, (counts.get(s.category) || 0) + 1);
  const catById = new Map((DB.categories || []).map((c) => [c.id, c]));
  const cats = (DB.categories || []).filter((c) => counts.get(c.id));
  const catName = (s) => (catById.get(s.category) || {}).name || s.category;
  const byId = new Map(styles.map((s) => [s.id, s]));

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  /* ---------- images ---------- */
  // Prefix for image paths: the root page sets DL_BASE to ''; a page one folder down would leave it unset.
  const BASE = typeof window.DL_BASE === 'string' ? window.DL_BASE : '../';
  const src = (s) => (s.image && !s.missing ? BASE + s.image : null);

  // Flat palette bands, ground colour widest. Used where a style has no screenshot.
  function bands(s) {
    const p = s.palette && s.palette.length ? s.palette : ['#d9d9d9', '#a8a8a8', '#6f6f6f', '#2b2b2b'];
    const w = [46, 22, 14, 10, 8].slice(0, p.length);
    const total = w.reduce((a, b) => a + b, 0);
    let at = 0;
    const stops = p.slice(0, w.length).map((c, i) => {
      const from = at;
      at += (w[i] / total) * 100;
      return `${c} ${from.toFixed(2)}% ${at.toFixed(2)}%`;
    });
    return `linear-gradient(90deg, ${stops.join(', ')})`;
  }

  // An <img> for the reference screenshot, or a palette-band block when there is none.
  function shot(s, { eager = false, alt } = {}) {
    const url = src(s);
    if (url) {
      const img = el('img');
      img.src = url;
      img.alt = alt != null ? alt : `${s.title}, reference screenshot`;
      if (!eager) img.loading = 'lazy';
      img.decoding = 'async';
      return img;
    }
    const d = el('span', 'dl-bands');
    d.style.background = bands(s);
    d.setAttribute('role', 'img');
    d.setAttribute('aria-label', `${s.title}, palette only (no screenshot)`);
    return d;
  }

  const lum = (hex) => {
    const h = hex.replace('#', '');
    const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16) / 255);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const inkOn = (hex) => (lum(hex) > 0.55 ? '#111111' : '#ffffff');

  /* ---------- search ---------- */
  function hay(s) {
    if (s._hay) return s._hay;
    s._hay = [
      s.title, s.id, s.short, s.long, s.category, catName(s),
      (s.keywords || []).join(' '),
      Object.values(s.traits || {}).join(' '),
      s.prompt || '',
    ].join(' ').toLowerCase();
    return s._hay;
  }

  function search(q, cat) {
    const terms = (q || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
    return styles.filter((s) => {
      if (cat && cat !== 'all' && s.category !== cat) return false;
      if (!terms.length) return true;
      const h = hay(s);
      return terms.every((t) => h.includes(t));
    });
  }

  // Text with matched search terms wrapped in <mark>.
  function mark(text, q) {
    const terms = (q || '').trim().toLowerCase().split(/\s+/).filter((t) => t.length > 1);
    if (!terms.length) return document.createTextNode(text);
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

  /* ---------- brief ---------- */
  function brief(s) {
    const lines = [
      `DESIGN BRIEF: ${s.title}`,
      `Category: ${catName(s)}`,
      '', 'SUMMARY', s.short || '',
      '', 'DESCRIPTION', s.long || '',
      '', 'KEYWORDS', (s.keywords || []).join(', '),
    ];
    if (s.palette && s.palette.length) lines.push('', 'PALETTE', s.palette.join('  '));
    const traits = Object.entries(s.traits || {});
    if (traits.length) {
      lines.push('', 'DIRECTION');
      traits.forEach(([k, v]) => lines.push(`- ${k}: ${v}`));
    }
    if (s.prompt) lines.push('', 'IMAGE PROMPT (hero artwork)', s.prompt);
    return lines.join('\n');
  }

  /* ---------- clipboard + toast ---------- */
  function copy(text) {
    const fallback = () => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      (document.querySelector('dialog[open]') || document.body).append(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch { ok = false; }
      ta.remove();
      return ok;
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(() => true, fallback);
    }
    return Promise.resolve(fallback());
  }

  let toastTimer;
  function toast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    // A modal <dialog> sits in the top layer; move the toast inside so it stays visible.
    const host = document.querySelector('dialog[open]') || document.body;
    if (t.parentNode !== host) host.append(t);
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-on'), 1900);
  }

  function copyWith(text, okMsg, btn) {
    return copy(text).then((ok) => {
      toast(ok ? okMsg : 'Copy failed. Select the text and copy it by hand');
      if (ok && btn) {
        if (!btn.dataset.label) btn.dataset.label = btn.textContent;
        btn.textContent = 'Copied';
        btn.classList.add('is-done');
        clearTimeout(btn._t);
        btn._t = setTimeout(() => {
          btn.textContent = btn.dataset.label;
          btn.classList.remove('is-done');
        }, 1400);
      }
      return ok;
    });
  }

  /* ---------- theme ---------- */
  const root = document.documentElement;
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const store = {
    get() { try { return localStorage.getItem('dsl-theme'); } catch { return null; } },
    set(v) { try { v ? localStorage.setItem('dsl-theme', v) : localStorage.removeItem('dsl-theme'); } catch {} },
  };
  const isDark = () => (root.dataset.theme ? root.dataset.theme === 'dark' : mq.matches);

  function setTheme(t, { tell = true } = {}) {
    if (t === 'light' || t === 'dark') root.dataset.theme = t;
    else delete root.dataset.theme;
    store.set(root.dataset.theme || null);
    if (tell && window.parent !== window) {
      window.parent.postMessage({ type: 'dsl-theme-changed', theme: root.dataset.theme || 'auto' }, '*');
    }
  }
  const toggleTheme = () => setTheme(isDark() ? 'light' : 'dark');

  const saved = store.get();
  if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
  // A parent page embedding this one in a frame can push its theme choice in.
  window.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'dsl-theme') setTheme(e.data.theme, { tell: false });
  });

  /* ---------- deep link (#style-id) ---------- */
  const hash = {
    get() { return byId.get(decodeURIComponent(location.hash.slice(1))) || null; },
    set(id) {
      const url = id ? '#' + encodeURIComponent(id) : location.pathname + location.search;
      try { history.replaceState(null, '', url); } catch { if (id) location.hash = id; }
    },
  };

  /* ---------- "/" focuses search ---------- */
  function slashFocus(input) {
    document.addEventListener('keydown', (e) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const a = document.activeElement;
      if (a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA')) return;
      if (document.querySelector('dialog[open]')) return;
      e.preventDefault();
      input.focus();
      input.select();
    });
  }

  /* ---------- detail parts ----------
   * Returns a fragment of blocks, each tagged data-part, so every version can
   * place them with its own grid: head, shot, long, traits, palette, keywords,
   * prompt, actions.
   */
  function detail(s, opts = {}) {
    const L = Object.assign({
      long: 'How it works', traits: 'Direction', palette: 'Palette', keywords: 'Keywords',
      prompt: 'Hero image prompt', brief: 'Copy brief', copyPrompt: 'Copy image prompt',
      note: 'Describes the hero artwork, not the page. Paste into an image model and add your own subject at the end.',
    }, opts.labels || {});
    const part = (tag, name) => { const n = el(tag); n.dataset.part = name; return n; };
    const frag = document.createDocumentFragment();

    const head = part('header', 'head');
    const cat = el('p', 'd-cat', catName(s));
    if (s.draft) cat.append(' ', el('span', 'd-draft', 'draft'));
    const h = el('h2', 'd-title');
    h.id = 'dTitle';
    h.append(opts.title ? opts.title(s) : s.title);
    head.append(cat, h);
    if (s.short) head.append(el('p', 'd-short', s.short));
    frag.append(head);

    const fig = part('figure', 'shot');
    fig.append(shot(s, { eager: true }));
    if (s.image) fig.append(el('figcaption', null, s.image + (s.missing ? ' (file not found)' : '')));
    frag.append(fig);

    if (s.long) {
      const sec = part('section', 'long');
      sec.append(el('h3', null, L.long), el('p', null, s.long));
      frag.append(sec);
    }

    const traits = Object.entries(s.traits || {});
    if (traits.length) {
      const sec = part('section', 'traits');
      const dl = el('dl');
      traits.forEach(([k, v]) => {
        const row = el('div');
        row.append(el('dt', null, k), el('dd', null, v));
        dl.append(row);
      });
      sec.append(el('h3', null, L.traits), dl);
      frag.append(sec);
    }

    if (s.palette && s.palette.length) {
      const sec = part('section', 'palette');
      const row = el('div', 'd-swatches');
      s.palette.forEach((c) => {
        const b = el('button', 'd-sw');
        b.type = 'button';
        b.style.setProperty('--c', c);
        b.style.setProperty('--on', inkOn(c));
        b.setAttribute('aria-label', `Copy colour ${c}`);
        b.append(el('i'), el('span', null, c.toUpperCase()));
        b.addEventListener('click', () => copyWith(c, `Copied ${c.toUpperCase()}`));
        row.append(b);
      });
      sec.append(el('h3', null, L.palette), row);
      frag.append(sec);
    }

    if (s.keywords && s.keywords.length) {
      const sec = part('section', 'keywords');
      const ul = el('ul', 'd-kw');
      s.keywords.forEach((k) => {
        const li = el('li');
        const b = el('button', null, k);
        b.type = 'button';
        b.title = `Search the library for "${k}"`;
        b.addEventListener('click', () => opts.onKeyword && opts.onKeyword(k));
        li.append(b);
        ul.append(li);
      });
      sec.append(el('h3', null, L.keywords), ul);
      frag.append(sec);
    }

    const pr = part('section', 'prompt');
    pr.append(el('h3', null, L.prompt), el('p', 'd-prompt', s.prompt || 'No prompt written yet for this style.'));
    if (s.prompt) pr.append(el('p', 'd-note', L.note));
    frag.append(pr);

    const act = part('div', 'actions');
    const b1 = el('button', 'd-btn d-btn--brief', L.brief);
    b1.type = 'button';
    b1.addEventListener('click', () => copyWith(brief(s), 'Design brief copied', b1));
    act.append(b1);
    if (s.prompt) {
      const b2 = el('button', 'd-btn d-btn--prompt', L.copyPrompt);
      b2.type = 'button';
      b2.addEventListener('click', () => copyWith(s.prompt, 'Image prompt copied', b2));
      act.append(b2);
    }
    frag.append(act);
    return frag;
  }

  window.DL = {
    styles, cats, counts, catById, byId, catName,
    shots: styles.filter((s) => s.image && !s.missing).length,
    generatedAt: DB.generatedAt || null,
    el, src, shot, bands, lum, inkOn,
    search, mark, brief, copy, copyWith, toast,
    isDark, setTheme, toggleTheme, hash, slashFocus, detail,
  };
})();
