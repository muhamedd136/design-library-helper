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
  $('#nStyles').textContent = styles.length;
  $('#nShots').textContent = DL.shots;
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

  const withShot = styles.filter((s) => DL.src(s));
  const pick = (ids) => ids.map((id) => DL.byId.get(id)).filter((s) => s && DL.src(s));
  const stripSet = pick(['magazine-cover', 'red-cream-fashion-folio', 'elegant-fashion-photographer', 'didone-fashion-consultant', 'dark-photo-portfolio']);
  (stripSet.length === 5 ? stripSet : withShot.slice(0, 5)).forEach((s) => {
    $('#strip').append(DL.shot(s, { eager: true, alt: '' }));
  });
  const a = pick(['sliced-monochrome'])[0] || withShot[5];
  const b = pick(['cherry-bold-brand'])[0] || withShot[6];
  if (a) $('#introPhoto').append(DL.shot(a, { eager: true, alt: '' }));
  if (b) $('#introSmall').append(DL.shot(b, { eager: true, alt: '' }));

  /* ---------- categories ---------- */
  const catsEl = $('#cats');
  function buildCats() {
    catsEl.textContent = '';
    const rows = [{ id: 'all', name: 'Everything', n: styles.length }]
      .concat(cats.map((c) => ({ id: c.id, name: c.name, n: DL.counts.get(c.id) })));
    rows.forEach((r) => {
      const btn = el('button', 'cat');
      btn.type = 'button';
      btn.setAttribute('aria-pressed', String(state.cat === r.id));
      btn.append(el('span', null, r.name), el('sup', null, String(r.n)));
      btn.addEventListener('click', () => { state.cat = r.id; buildCats(); render(); });
      catsEl.append(btn);
    });
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
    txt.append(el('span', 'tile__cat', DL.catName(s) + (s.draft ? ' · draft' : '')), title, short, el('span', 'tile__go', 'Read it →'));
    t.append(img, txt);
    t.addEventListener('click', () => open(s, t));
    return t;
  }

  function render() {
    const list = DL.search(state.q, state.cat);
    grid.textContent = '';
    const frag = document.createDocumentFragment();
    list.forEach((s) => frag.append(tile(s)));
    grid.append(frag);
    $('#empty').hidden = list.length > 0;
    const cat = state.cat === 'all' ? null : DL.catById.get(state.cat);
    $('#word').textContent = cat ? cat.name.split(' ')[0] : 'Library';
    $('#count').textContent = `${list.length} ${list.length === 1 ? 'style' : 'styles'}` +
      (cat ? ` in ${cat.name}` : '') + (state.q ? ` matching "${state.q}"` : '');
  }

  /* ---------- search ---------- */
  const q = $('#q');
  let deb;
  q.addEventListener('input', () => {
    clearTimeout(deb);
    deb = setTimeout(() => { state.q = q.value; render(); }, 120);
  });
  function setQuery(v) { q.value = v; state.q = v; state.cat = 'all'; buildCats(); render(); }
  $('#reset').addEventListener('click', () => { setQuery(''); q.focus(); });
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
      onKeyword: (k) => { sheet.close(); setQuery(k); $('.cats').scrollIntoView(); },
    }));
    if (!sheet.open) sheet.showModal();
    sheet.scrollTop = 0;
    DL.hash.set(s.id);
  }
  $('#sheetX').addEventListener('click', () => sheet.close());
  sheet.addEventListener('click', (e) => { if (e.target === sheet) sheet.close(); });
  sheet.addEventListener('close', () => { DL.hash.set(null); if (opener && opener.isConnected) opener.focus(); });

  buildCats();
  render();
  const linked = DL.hash.get();
  if (linked) open(linked);
})();
