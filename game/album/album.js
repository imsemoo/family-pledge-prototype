/* صورة وحكاية — a memory game where the two halves of a pair are different:
   a picture from one of the platform's stories, and the title of that story. No dependencies. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rand = (n) => Math.floor(Math.random() * n);
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const IMG = '../../assets/img/world/', LISTEN = 'https://familypledge.org/Bagdetails/E4BD7361-27D6-4E74-BD48-109342E804C6#premium';

  /* six episodes of the platform's podcast, then the three people who tell them */
  const TALES = [
    { id: 't02', img: 'tale-02.webp', kind: 'حكاية', title: 'المسجد العمري: لم يبق منه إلا مئذنة' },
    { id: 't04', img: 'tale-04.webp', kind: 'حكاية', title: 'زوارق غزة: كيف يمنع البحر أن يكون بحرا' },
    { id: 't05', img: 'tale-05.webp', kind: 'حكاية', title: 'الأطراف المبتورة: هل نركض بدونها؟' },
    { id: 't07', img: 'tale-07.webp', kind: 'حكاية', title: 'المخيمات أصل الحكاية' },
    { id: 't12', img: 'tale-12.webp', kind: 'حكاية', title: 'جد الزيتون' },
    { id: 't15', img: 'tale-15.webp', kind: 'حكاية', title: 'العلم الفلسطيني' },
  ];
  const CAST = [
    { id: 'jadda', img: 'cast-jadda-1.webp', kind: 'من أبطال الحكايات', title: 'الجدة' },
    { id: 'raed', img: 'cast-raed-1.webp', kind: 'من أبطال الحكايات', title: 'رائد' },
    { id: 'yafa', img: 'cast-yafa-1.webp', kind: 'من أبطال الحكايات', title: 'يافا' },
  ];
  const LEVELS = { buds: { set: TALES, cols: 4, par: 11 }, knights: { set: [...TALES, ...CAST], cols: 6, par: 18 } };

  const el = {
    body: document.body, start: $('#screen-start'), play: $('#screen-play'), setup: $('#setup'), best: $('#best'), board: $('#board'), status: $('#status'), album: $('#album'),
    found: $('#hud-found'), total: $('#hud-total'), moves: $('#hud-moves'), time: $('#hud-time'), hint: $('#btn-hint'), hints: $('#hud-hints'), sound: $('#btn-sound'), dWin: $('#dlg-win'),
  };
  let S = null;

  /* ---------- sound ---------- */
  let ac = null, soundOn = localStorage.getItem('album-sound') !== '0';
  const tone = (f, d, { type = 'sine', g = 0.07, at = 0 } = {}) => {
    if (!soundOn) return;
    try {
      ac ||= new (window.AudioContext || window.webkitAudioContext)();
      const t = ac.currentTime + at, o = ac.createOscillator(), v = ac.createGain();
      o.type = type; o.frequency.value = f; v.gain.setValueAtTime(0.0001, t); v.gain.linearRampToValueAtTime(g, t + 0.012); v.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(v).connect(ac.destination); o.start(t); o.stop(t + d + 0.05);
    } catch { /* audio is optional */ }
  };
  const sfx = {
    flip: () => tone(480, 0.07, { type: 'triangle', g: 0.05 }),
    match: () => { tone(659, 0.4); tone(988, 0.6, { at: 0.09, g: 0.06 }); tone(1318, 0.8, { at: 0.2, g: 0.035 }); },
    miss: () => tone(180, 0.15, { type: 'triangle', g: 0.05 }),
    peek: () => { tone(660, 0.18, { g: 0.05 }); tone(880, 0.3, { at: 0.1, g: 0.04 }); },
    win: () => [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => tone(f, 1.1, { at: i * 0.13, g: 0.07 })),
  };
  const syncSound = () => { el.sound.setAttribute('aria-pressed', soundOn); $('use', el.sound).setAttribute('href', soundOn ? '#i-sound' : '#i-mute'); el.sound.setAttribute('aria-label', soundOn ? 'إيقاف الصوت' : 'تشغيل الصوت'); };
  el.sound.addEventListener('click', () => { soundOn = !soundOn; localStorage.setItem('album-sound', soundOn ? '1' : '0'); syncSound(); if (soundOn) sfx.flip(); });
  syncSound();

  const say = (text, kind = '') => { el.status.textContent = text; el.status.dataset.kind = kind; };

  /* ---------- board ---------- */
  const faceHTML = (c) => c.side === 'pic'
    ? `<img src="${IMG}${c.item.img}" alt="" width="720" height="720" decoding="async" draggable="false">`
    : `<span class="ac__sheet"><small>${c.item.kind}</small><b>${c.item.title}</b><i></i></span>`;
  const openLabel = (c) => (c.side === 'pic' ? `صورة: ${c.item.title}` : `عنوان: ${c.item.title}`);

  const build = () => {
    const L = LEVELS[S.level];
    S.cards = shuffle(L.set.flatMap((item) => [{ item, side: 'pic' }, { item, side: 'title' }]));
    el.board.style.setProperty('--cols', L.cols); el.board.parentElement.style.setProperty('--cols', L.cols); el.board.dataset.n = S.cards.length;
    el.board.innerHTML = S.cards.map((c, i) => `<button type="button" class="ac ac--${c.side}" data-i="${i}" aria-label="بطاقة مقلوبة رقم ${i + 1}" style="--d:${i}"><span class="ac__in"><span class="ac__back"><img src="../../assets/img/logo-mark.png" alt="" width="120" height="120" draggable="false"></span><span class="ac__face">${faceHTML(c)}</span></span></button>`).join('');
    S.cards.forEach((c, i) => { c.node = el.board.children[i]; c.open = false; c.done = false; });
    el.album.innerHTML = L.set.map((item) => `<li data-id="${item.id}"><span class="album__pic"><img src="${IMG}${item.img}" alt="" width="720" height="720" loading="lazy" decoding="async"></span><span class="album__t">؟</span></li>`).join('');
    el.total.textContent = L.set.length; el.found.textContent = 0; el.moves.textContent = 0; el.time.textContent = '0:00'; el.hints.textContent = S.hints; el.hint.disabled = false;
    say('اقلب بطاقتين: صورة وعنوان حكايتها.');
  };

  const show = (c, on) => { c.open = on; c.node.classList.toggle('is-open', on); c.node.setAttribute('aria-label', on ? openLabel(c) : `بطاقة مقلوبة رقم ${S.cards.indexOf(c) + 1}`); };

  const pick = (c) => {
    if (!S || S.over || S.busy || c.open || c.done) return;
    show(c, true); sfx.flip();
    if (!S.first) { S.first = c; say(c.side === 'pic' ? 'الآن ابحث عن عنوان هذه الصورة.' : 'الآن ابحث عن صورة هذه الحكاية.'); return; }
    const a = S.first; S.first = null; S.moves++; el.moves.textContent = S.moves;
    if (a.item === c.item && a.side !== c.side) return matched(a, c);
    S.busy = true; sfx.miss();
    say(a.side === c.side ? (c.side === 'pic' ? 'صورتان. المطلوب صورة وعنوانها.' : 'عنوانان. المطلوب عنوان وصورته.') : 'ليست حكاية هذه الصورة. تذكر مكانيهما.', 'bad');
    [a, c].forEach((x) => x.node.classList.add('is-no'));
    setTimeout(() => { [a, c].forEach((x) => { x.node.classList.remove('is-no'); show(x, false); }); S.busy = false; }, reduced ? 900 : 1150);
  };

  const matched = (a, c) => {
    [a, c].forEach((x) => { x.done = true; x.node.classList.add('is-done'); x.node.disabled = true; });
    S.found++; el.found.textContent = S.found; sfx.match(); try { navigator.vibrate?.(18); } catch { /* not allowed before a real tap */ }
    const li = $(`[data-id="${a.item.id}"]`, el.album); li.classList.add('is-in'); $('.album__t', li).textContent = a.item.title;
    const left = LEVELS[S.level].set.length - S.found;
    say(left ? `أحسنت! «${a.item.title}» عادت إلى الألبوم. ${left === 1 ? 'بقيت حكاية واحدة' : left === 2 ? 'بقيت حكايتان' : `بقيت ${left} حكايات`}.` : 'اكتمل الألبوم!', 'good');
    if (!left) win();
  };

  el.board.addEventListener('click', (e) => { const b = e.target.closest('.ac'); if (b) pick(S.cards[+b.dataset.i]); });
  /* arrows move between cards */
  el.board.addEventListener('keydown', (e) => {
    const b = e.target.closest('.ac'); if (!b || !S) return;
    const cols = +getComputedStyle(el.board).getPropertyValue('--cols-now') || LEVELS[S.level].cols, i = +b.dataset.i;
    const step = { ArrowLeft: 1, ArrowRight: -1, ArrowDown: cols, ArrowUp: -cols }[e.key]; if (!step) return;
    e.preventDefault(); const t = el.board.children[i + step]; if (t) t.focus();
  });

  /* a look: every card shows its face for a moment */
  el.hint.addEventListener('click', () => {
    if (!S || S.over || S.busy || S.hints <= 0) return;
    S.hints--; S.hintsUsed++; el.hints.textContent = S.hints; el.hint.disabled = S.hints === 0; S.busy = true; sfx.peek();
    const closed = S.cards.filter((c) => !c.open && !c.done); closed.forEach((c) => c.node.classList.add('is-open', 'is-peek'));
    say('انظر جيدا وتذكر الأماكن.', 'good');
    setTimeout(() => { closed.forEach((c) => c.node.classList.remove('is-open', 'is-peek')); S.busy = false; say('الآن اقلب بطاقتين.'); }, 1800);
  });

  setInterval(() => { if (!S || S.over) return; S.t++; el.time.textContent = fmt(S.t); }, 1000);

  /* ---------- endings ---------- */
  const win = () => {
    S.over = true; el.body.dataset.screen = 'win'; el.body.style.setProperty('--dawn', 1);
    const par = LEVELS[S.level].par; let stars = 3; if (S.moves > par || S.hintsUsed >= 2) stars--; if (S.moves > par * 1.6) stars--;
    $('#win-stars').innerHTML = [0, 1, 2].map((k) => `<svg viewBox="0 0 24 24" class="${k < stars ? 'on' : ''}" style="--k:${k}"><use href="#i-star"/></svg>`).join('');
    $('#win-stars').setAttribute('aria-label', `${stars} من 3 نجوم`);
    $('#win-moves').textContent = S.moves; $('#win-time').textContent = fmt(S.t); $('#win-listen').href = LISTEN;
    const key = `album-best-${S.level}`, prev = +localStorage.getItem(key) || 0, wb = $('#win-best');
    if (!prev || S.moves < prev) { localStorage.setItem(key, S.moves); wb.hidden = !prev; wb.textContent = 'رقم جديد! هذا أقل عدد محاولات لك في هذا المستوى.'; } else { wb.hidden = false; wb.textContent = `أقل عدد محاولات لك: ${prev}`; }
    setTimeout(() => sfx.win(), 400);
    setTimeout(() => { el.dWin.showModal(); el.dWin.scrollTop = 0; }, reduced ? 300 : 1500);
  };
  el.dWin.addEventListener('cancel', (e) => e.preventDefault());

  /* ---------- flow ---------- */
  const showStart = () => { S = null; el.body.dataset.screen = 'start'; el.body.style.setProperty('--dawn', 0); el.play.hidden = true; el.start.hidden = false; syncSetup(); scrollTo(0, 0); };
  const startGame = (level) => {
    S = { level, t: 0, moves: 0, found: 0, hints: 2, hintsUsed: 0, first: null, busy: false, over: false, cards: [] };
    el.body.dataset.screen = 'play'; el.body.style.setProperty('--dawn', 0); el.start.hidden = true; el.play.hidden = false; scrollTo(0, 0);
    build();
  };
  const syncSetup = () => { const best = +localStorage.getItem(`album-best-${el.setup.level.value}`) || 0; el.best.hidden = !best; el.best.textContent = best ? `أقل عدد محاولات لك في هذا المستوى: ${best}` : ''; };
  el.setup.addEventListener('change', syncSetup); syncSetup();
  el.setup.addEventListener('submit', (e) => { e.preventDefault(); sfx.flip(); startGame(el.setup.level.value); });
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]'); if (!b) return; const level = S?.level;
    $$('dialog[open]').forEach((d) => d.close());
    if (b.dataset.act === 'restart' && level) startGame(level); else showStart();
  });

  window.__album = { get state() { return S; } }; // for testing in the console
})();
