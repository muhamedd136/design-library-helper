/* Design Style Library: red and cream mosaic. Data logic lives in shared/lib.js. */
(() => {
  'use strict';
  const { styles, cats, el } = DL;
  const $ = (s) => document.querySelector(s);
  const state = { q: '', cat: 'all' };

  /* Serif with a roman/italic mix: the last word of a title goes italic. */
  function mixed(text, q) {
    const frag = document.createDocumentFragment();
    const i = text.lastIndexOf(' ');
    if (i < 0) { frag.append(DL.mark(text, q)); return frag; }
    const em = el('em');
    em.append(DL.mark(text.slice(i + 1), q));
    frag.append(DL.mark(text.slice(0, i + 1), q), em);
    return frag;
  }

  /* ---------- header ---------- */
  $('#theme').addEventListener('click', DL.toggleTheme);
  if (DL.generatedAt) $('#genAt').textContent = new Date(DL.generatedAt).toLocaleString();

  const tapeBits = [
    `${styles.length} design languages`, `${cats.length} categories`, 'press / to search',
    'copy a brief', 'copy a hero image prompt', 'palettes included',
  ];
  const tape = $('#tape');
  for (let r = 0; r < 2; r++) {
    for (let k = 0; k < 3; k++) tapeBits.forEach((b) => tape.append(el('span', null, b), el('i', null, '✻')));
  }

  // The cover strip is five real entries: each one opens its style.
  const withShot = styles.filter((s) => DL.src(s));
  const stripSet = ['magazine-cover', 'red-cream-fashion-folio', 'elegant-fashion-photographer', 'didone-fashion-consultant', 'dark-photo-portfolio']
    .map((id) => DL.byId.get(id)).filter((s) => s && DL.src(s));
  (stripSet.length === 5 ? stripSet : withShot.slice(0, 5)).forEach((s) => {
    const b = el('button', 'shot');
    b.type = 'button';
    b.setAttribute('aria-label', `Open ${s.title}`);
    b.append(DL.shot(s, { eager: true, alt: '' }), el('span', 'shot__name', s.title));
    b.addEventListener('click', () => open(s, b));
    $('#strip').append(b);
  });

  /* ---------- categories ---------- */
  // Built once; a change only flips aria-pressed, so keyboard focus stays on the link.
  const catsEl = $('#cats');
  [{ id: 'all', name: 'Everything', n: styles.length }]
    .concat(cats.map((c) => ({ id: c.id, name: c.name, n: DL.counts.get(c.id) })))
    .forEach((r) => {
      const btn = el('button', 'cat');
      btn.type = 'button';
      btn.dataset.cat = r.id;
      btn.append(el('span', null, r.name), el('sup', null, String(r.n)));
      btn.addEventListener('click', () => { state.cat = r.id; render(); showResults('filter'); });
      catsEl.append(btn);
    });
  function paintCats() {
    catsEl.querySelectorAll('.cat').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === state.cat)));
  }

  /* ---------- mosaic ---------- */
  const grid = $('#grid');
  function tile(s) {
    const t = el('button', 'tile');
    t.type = 'button';
    const img = el('span', 'tile__img');
    img.append(DL.shot(s, { alt: '' }));
    if (!DL.src(s)) img.append(el('span', 'tile__flag', 'palette only'));
    const txt = el('span', 'tile__txt');
    const title = el('span', 'tile__title');
    title.append(mixed(s.title, state.q));
    const short = el('span', 'tile__short');
    short.append(DL.mark(s.short || '', state.q));
    txt.append(el('span', 'tile__cat', DL.catName(s) + (s.draft ? ' · draft' : '')), title, short);
    // The query matched text this tile does not show: say where.
    const hit = state.q && DL.hiddenHit(s, state.q);
    if (hit) {
      const line = el('span', 'tile__hit');
      if (hit.keywords) line.append('Filed under ', DL.mark(hit.keywords.join(', '), state.q));
      else line.append('Mentioned in ' + hit.place);
      txt.append(line);
    }
    txt.append(el('span', 'tile__go', 'Read it →'));
    t.append(img, txt);
    t.addEventListener('click', () => open(s, t));
    return t;
  }

  const plural = (n) => `${n === 1 ? 'style' : 'styles'}`;
  function render() {
    const list = DL.rank(DL.search(state.q, state.cat), state.q);
    const query = state.q.trim();
    grid.textContent = '';
    const frag = document.createDocumentFragment();
    list.forEach((s) => frag.append(tile(s)));
    grid.append(frag);
    paintCats();

    const cat = state.cat === 'all' ? null : DL.catById.get(state.cat);
    $('#word').textContent = cat ? cat.name.split(' ')[0] : 'Library';
    $('.wall').classList.toggle('is-searching', !!query);
    $('#intro').classList.toggle('has-query', !!query);

    // status line in the sticky bar: count, active query, clear
    const count = $('#count');
    count.textContent = '';
    count.append(el('b', null, String(list.length)), ` ${plural(list.length)}`);
    if (query) count.append(' for ', el('q', null, query));
    count.title = count.textContent + (cat ? ` in ${cat.name}` : '');
    $('#clear').hidden = !query;

    // empty state: name what was asked for, and offer the wider search when it has results
    const none = list.length === 0;
    $('#empty').hidden = !none;
    if (none) {
      const text = $('#emptyText');
      text.textContent = '';
      text.append('Nothing ', el('em', null, 'filed'), ' under ', el('q', null, query));
      if (cat) text.append(' in ', el('em', null, cat.name));
      text.append('.');
      const wider = cat ? DL.search(state.q, 'all').length : 0;
      const widen = $('#widen');
      widen.hidden = !wider;
      widen.textContent = wider ? `Show the ${wider} in every category` : '';
    }
  }

  /* ---------- keep the results in view ---------- */
  const bar = $('#bar');
  const wall = $('.wall');
  function showResults(from) {
    const y = window.scrollY;
    if (from === 'search') {
      // Typing: keep the field on screen and bring the first row up beneath it.
      const field = q.getBoundingClientRect();
      const first = grid.getBoundingClientRect().top;
      if (field.top >= 0 && first < window.innerHeight * 0.7) return;
      window.scrollTo({ top: $('.search').getBoundingClientRect().top + y - 16 });
      return;
    }
    // Category, keyword or clear: put the top of the wall directly under the bar.
    const top = wall.getBoundingClientRect().top + y - bar.offsetHeight;
    if (y > top) window.scrollTo({ top, behavior: 'instant' });
    else if (grid.getBoundingClientRect().top > window.innerHeight * 0.6) window.scrollTo({ top });
  }

  /* ---------- search ---------- */
  const q = $('#q');
  let deb;
  q.addEventListener('input', () => {
    clearTimeout(deb);
    deb = setTimeout(() => {
      if (q.value === state.q) return;
      state.q = q.value;
      render();
      showResults('search');
    }, 120);
  });
  function setQuery(v, { keepCat = false } = {}) {
    clearTimeout(deb);
    q.value = v;
    state.q = v;
    if (!keepCat) state.cat = 'all';
    render();
  }
  $('#clear').addEventListener('click', () => { setQuery('', { keepCat: true }); showResults('filter'); });
  $('#reset').addEventListener('click', () => { setQuery(''); q.focus(); });
  $('#widen').addEventListener('click', () => { state.cat = 'all'; render(); showResults('filter'); });
  DL.slashFocus(q);

  /* ---------- detail ---------- */
  const sheet = $('#sheet');
  const body = $('#sheetBody');
  let opener = null;
  function open(s, from) {
    opener = from || null;
    body.textContent = '';
    body.append(DL.detail(s, {
      title: (st) => mixed(st.title, ''),
      labels: { long: 'How it works', traits: 'The direction', palette: 'The palette', keywords: 'Filed under', prompt: 'Hero image prompt' },
      onKeyword: (k) => { sheet.close(); setQuery(k); showResults('filter'); },
    }));
    if (!sheet.open) sheet.showModal();
    sheet.scrollTop = 0;
    DL.hash.set(s.id);
  }
  $('#sheetX').addEventListener('click', () => sheet.close());
  sheet.addEventListener('click', (e) => { if (e.target === sheet) sheet.close(); });
  sheet.addEventListener('close', () => { DL.hash.set(null); if (opener && opener.isConnected) opener.focus(); });

  render();
  const linked = DL.hash.get();
  if (linked) open(linked);
})();
