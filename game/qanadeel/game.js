/* قناديل الأقصى — word search. No dependencies.
   Columns are counted from the right (the board is RTL), so a word placed with
   dc = +1 reads the way Arabic is read. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rand = (n) => Math.floor(Math.random() * n);
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  /* word, then one line the family learns when it is found */
  const WORDS = [
    ['قدس', 'القدس مدينة المسجد الأقصى، ومهوى قلوب المسلمين.'],
    ['منبر', 'منبر صلاح الدين وضع في المصلى القبلي بعد تحرير القدس، وأحرق في 21 آب 1969.'],
    ['محراب', 'المحراب يدل المصلين على اتجاه القبلة داخل المصلى.'],
    ['مئذنة', 'للمسجد الأقصى أربع مآذن ترتفع عند أسواره وأبوابه.'],
    ['اسراء', 'الإسراء رحلة النبي ﷺ ليلا من المسجد الحرام إلى المسجد الأقصى.'],
    ['معراج', 'من المسجد الأقصى عرج بالنبي ﷺ إلى السماوات العلى.'],
    ['بائكة', 'البائكة أعمدة تعلوها أقواس، تقوم على رأس الدرج الصاعد إلى صحن قبة الصخرة.'],
    ['مصلى', 'في الأقصى مصليات عدة، منها المصلى القبلي والمصلى المرواني.'],
    ['قباب', 'في ساحات الأقصى قباب كثيرة، أشهرها قبة الصخرة وقبة السلسلة.'],
    ['مسجد', 'المسجد الأقصى ثاني مسجد وضع في الأرض بعد المسجد الحرام.'],
    ['بركة', 'وصف الله أرض الأقصى بالبركة فقال: «الذي باركنا حوله».'],
    ['قبلة', 'المسجد الأقصى أولى القبلتين، صلى المسلمون نحوه قبل الكعبة.'],
    ['رباط', 'الرباط هو الثبات في الأقصى وعمارته بالصلاة والعلم.'],
    ['سور', 'يحيط بالمسجد الأقصى سور يضم كل ما بداخله من مصليات وساحات.'],
    ['رحلة', 'رحلة الإسراء والمعراج ربطت مكة بالقدس إلى الأبد.'],
    ['ابواب', 'للأقصى أبواب عدة، منها باب المغاربة وباب السلسلة وباب الأسباط.'],
    ['صخرة', 'قبة الصخرة بناها الخليفة عبد الملك بن مروان، وهي جزء من المسجد الأقصى.'],
    ['مسرى', 'الأقصى مسرى النبي ﷺ، إليه أسري به من مكة.'],
    ['براق', 'حائط البراق جزء من السور الغربي للمسجد الأقصى.'],
    ['شجر', 'أشجار الزيتون والسرو تظلل ساحات الأقصى ومصاطبه.'],
  ];
  const FACT = Object.fromEntries(WORDS);
  const SECRET = 'المسجد الأقصى';
  const FILLER = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي'; // base letters only: a stray ة or ى in mid-grid reads as a mistake
  const ALL = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
  const LEVELS = {
    buds: { n: 10, count: 12, dirs: [[1, 0], [0, 1], [1, 1]], time: 300, par: 210 },
    knights: { n: 12, count: 20, dirs: ALL, time: 420, par: 360 },
  };
  const TINTS = ['#409db7', '#e087a6', '#f4b740'];

  const el = {
    body: document.body, start: $('#screen-start'), play: $('#screen-play'), setup: $('#setup'), best: $('#best'), dawnNote: $('#dawn-note'),
    rail: $('#rail'), board: $('#board'), lines: $('#lines'), status: $('#status'), words: $('#words'), secret: $('#secret'),
    fact: $('#fact'), factWord: $('#fact-word'), factBox: $('.fact'), found: $('#hud-found'), total: $('#hud-total'), time: $('#hud-time'), timeBox: $('#hud-time-box'),
    hint: $('#btn-hint'), hints: $('#hud-hints'), pause: $('#btn-pause'), sound: $('#btn-sound'),
    dPause: $('#dlg-pause'), dLose: $('#dlg-lose'), dWin: $('#dlg-win'),
  };
  el.board.setAttribute('role', 'group');

  /* ---------- the scene ---------- */
  const mood = () => {}; // the helper sprite left the game; the status line carries the feedback
  $('#start-cast').innerHTML = '<img src="../../assets/img/world/raed.webp" alt="" width="307" height="900" decoding="async">';
  $('#win-art').innerHTML = '<img src="../../assets/img/world/tale-18.webp" alt="" width="720" height="720" loading="lazy" decoding="async">';
  /* the skyline at night: wall, dome and minaret as one quiet silhouette */
  const tree = (x, h, w) => `<path d="M${x} 176c${-w} ${-h * 0.35} ${-w * 0.7} ${-h * 0.8} 0 ${-h}c${w * 0.7} ${h * 0.2} ${w} ${h * 0.65} 0 ${h}z"/>`;
  const wall = Array.from({ length: 60 }, (_, k) => `M${k * 20} 166v-10h11v10z`).join('');
  $('#land').innerHTML = `<svg viewBox="0 0 1200 220" preserveAspectRatio="xMidYMax meet" fill="currentColor">
    <path d="M0 220v-56h1200v56z"/><path d="${wall}"/>
    <path d="M520 166v-34l14-10h132l14 10v34zM548 122V98h104v24zM556 98c0-34 20-52 44-52s44 18 44 52zM598.500 30h3v18h-3z"/><circle cx="600" cy="28" r="4"/>
    <path d="M882 166V70h20v96zM877 92h30v7h-30zM885 70l7-26 7 26z"/>
    ${tree(250, 96, 20)}${tree(292, 70, 15)}${tree(430, 84, 17)}${tree(760, 104, 21)}${tree(990, 78, 16)}${tree(1040, 60, 13)}</svg>`;

  let S = null; // game state

  /* ---------- sound: a few synthesised notes, nothing to download ---------- */
  let ac = null, soundOn = localStorage.getItem('qanadeel-sound') !== '0';
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
    tick: (n) => tone(440 + n * 55, 0.07, { g: 0.035 }),
    found: () => { tone(880, 0.5); tone(1318.5, 0.7, { at: 0.09, g: 0.06 }); tone(1760, 0.9, { at: 0.2, g: 0.035 }); },
    miss: () => tone(170, 0.16, { type: 'triangle', g: 0.06 }),
    hint: () => { tone(660, 0.18, { g: 0.05 }); tone(990, 0.3, { at: 0.1, g: 0.04 }); },
    win: () => [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => tone(f, 1.1, { at: i * 0.13, g: 0.07 })),
    lose: () => { tone(392, 0.4, { g: 0.06 }); tone(311, 0.7, { at: 0.22, g: 0.06 }); },
  };
  const syncSound = () => { el.sound.setAttribute('aria-pressed', soundOn); $('use', el.sound).setAttribute('href', soundOn ? '#i-sound' : '#i-mute'); el.sound.setAttribute('aria-label', soundOn ? 'إيقاف الصوت' : 'تشغيل الصوت'); };
  el.sound.addEventListener('click', () => { soundOn = !soundOn; localStorage.setItem('qanadeel-sound', soundOn ? '1' : '0'); syncSound(); if (soundOn) sfx.tick(2); });
  syncSound();

  /* ---------- grid ---------- */
  const occurrences = (g, w) => {
    const n = g.length, ch = [...w]; let k = 0;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      if (g[r][c] !== ch[0]) continue;
      for (const [dc, dr] of ALL) {
        const ce = c + dc * (ch.length - 1), re = r + dr * (ch.length - 1);
        if (ce < 0 || ce >= n || re < 0 || re >= n) continue;
        let i = 1; while (i < ch.length && g[r + dr * i][c + dc * i] === ch[i]) i++;
        if (i === ch.length) k++;
      }
    }
    return k;
  };
  const generate = (L, words) => {
    for (let attempt = 0; attempt < 80; attempt++) {
      const n = L.n, g = Array.from({ length: n }, () => Array(n).fill('')), placed = [];
      let ok = true;
      for (const w of [...words].sort((a, b) => b.length - a.length || Math.random() - 0.5)) {
        const ch = [...w]; let best = null;
        for (let t = 0; t < 260; t++) {
          const [dc, dr] = L.dirs[rand(L.dirs.length)], c0 = rand(n), r0 = rand(n), c1 = c0 + dc * (ch.length - 1), r1 = r0 + dr * (ch.length - 1);
          if (c1 < 0 || c1 >= n || r1 < 0 || r1 >= n) continue;
          let fit = true, overlap = 0;
          for (let i = 0; i < ch.length; i++) { const v = g[r0 + dr * i][c0 + dc * i]; if (v) { if (v !== ch[i]) { fit = false; break; } overlap++; } }
          if (!fit || overlap === ch.length) continue;
          if (!best || overlap > best.overlap) best = { c0, r0, dc, dr, overlap };
          if (best && (best.overlap > 0 || t > 60)) break;
        }
        if (!best) { ok = false; break; }
        const cells = ch.map((_, i) => [best.c0 + best.dc * i, best.r0 + best.dr * i]);
        cells.forEach(([c, r], i) => (g[r][c] = ch[i])); placed.push({ word: w, cells });
      }
      if (!ok) continue;
      for (let f = 0; f < 40; f++) {
        const full = g.map((row) => row.map((v) => v || FILLER[rand(FILLER.length)]));
        // every word must exist exactly once; read backwards it is the same single run of cells
        if (words.every((w) => occurrences(full, w) === 1 && occurrences(full, [...w].reverse().join('')) === 1)) return { grid: full, placed };
      }
    }
    throw new Error('grid generation failed');
  };

  /* ---------- rendering ---------- */
  const cellEl = (c, r) => el.board.children[r * S.n + c];
  const pt = (c, r) => [S.n - (c + 0.5), r + 0.5];
  const svg = (tag, attrs) => { const e = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
  const say = (text, kind = '') => { el.status.textContent = text; el.status.dataset.kind = kind; };

  const build = () => {
    const { n, grid } = S;
    el.board.style.setProperty('--n', n); el.board.innerHTML = '';
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'cell'; b.textContent = grid[r][c]; b.tabIndex = -1;
      b.dataset.c = c; b.dataset.r = r; b.style.setProperty('--d', c + r); b.setAttribute('aria-label', `الحرف ${grid[r][c]}، الصف ${r + 1}، العمود ${c + 1}`);
      el.board.append(b);
    }
    cellEl(0, 0).tabIndex = 0;
    el.lines.setAttribute('viewBox', `0 0 ${n} ${n}`); el.lines.innerHTML = '';
    S.live = svg('line', { class: 'band live', visibility: 'hidden' }); el.lines.append(S.live);

    el.words.innerHTML = S.words.map((w) => `<li data-w="${w}">${w}</li>`).join('');
    el.secret.innerHTML = tiles();
    const drops = [16, 34, 22, 42, 12, 28];
    el.rail.innerHTML = S.words.map((_, i) => `<i class="lan" style="--drop:${drops[i % drops.length]}px;--n:${i}"><b></b></i>`).join('');
    el.total.textContent = S.words.length; el.found.textContent = 0; el.hints.textContent = S.hints; el.hint.disabled = false;
    el.factWord.textContent = 'هل تعلم؟'; el.fact.textContent = 'يضم المسجد الأقصى معالم تاريخية كثيرة، منها قبة الصخرة والمصلى القبلي.';
    el.timeBox.classList.remove('low'); showTime();
    say(matchMedia('(pointer: coarse)').matches ? 'اسحب فوق الكلمة، أو المس أول حرف ثم آخر حرف.' : 'اسحب من أول حرف إلى آخر حرف.');
  };

  /* the secret phrase as letter tiles; each word stays on one line */
  const tiles = () => { let k = 0; return SECRET.split(' ').map((w) => `<span class="w">${[...w].map((ch) => `<b style="--k:${k++}">${ch}</b>`).join('')}</span>`).join(''); };

  const showTime = () => { el.time.textContent = fmt(S.mode === 'dawn' ? Math.max(0, S.limit - S.t) : S.t); };

  /* ---------- selection ---------- */
  const lineTo = (c0, r0, c1, r1, strict) => {
    const dc = c1 - c0, dr = r1 - r0;
    if (!dc && !dr) return [[c0, r0]];
    if (strict && dc && dr && Math.abs(dc) !== Math.abs(dr)) return null;
    const oct = (Math.round(Math.atan2(dr, dc) / (Math.PI / 4)) + 8) % 8, [ux, uy] = ALL[oct];
    const len = ux && uy ? Math.round((Math.abs(dc) + Math.abs(dr)) / 2) : Math.max(Math.abs(dc), Math.abs(dr));
    const out = [];
    for (let i = 0; i <= len; i++) { const c = c0 + ux * i, r = r0 + uy * i; if (c < 0 || c >= S.n || r < 0 || r >= S.n) break; out.push([c, r]); }
    return out;
  };
  const paint = (path) => {
    $$('.cell.sel', el.board).forEach((x) => x.classList.remove('sel'));
    if (!path) { S.live.setAttribute('visibility', 'hidden'); return; }
    path.forEach(([c, r]) => cellEl(c, r).classList.add('sel'));
    const [x1, y1] = pt(...path[0]), [x2, y2] = pt(...path[path.length - 1]);
    for (const [k, v] of Object.entries({ x1, y1, x2, y2: y2 + 0.0001, visibility: 'visible' })) S.live.setAttribute(k, v);
  };
  const setAnchor = (a) => { $$('.cell.anchor', el.board).forEach((x) => x.classList.remove('anchor')); S.anchor = a; if (a) cellEl(...a).classList.add('anchor'); };

  const commit = (path) => {
    paint(null); setAnchor(null);
    if (!path || path.length < 2) return;
    const str = path.map(([c, r]) => S.grid[r][c]).join(''), rev = [...str].reverse().join('');
    const word = S.words.find((w) => w === str || w === rev);
    if (word && !S.found.has(word)) return onFound(word, path);
    if (word) { say('هذه الكلمة أضاءت قنديلها من قبل.'); return; }
    say('هذه الحروف لا تكون كلمة من القائمة. جرب اتجاها آخر.', 'bad'); sfx.miss(); mood('sad');
    if (!reduced) { el.board.classList.remove('shake'); void el.board.offsetWidth; el.board.classList.add('shake'); }
  };

  const tap = (c, r) => {
    if (!S.anchor) { setAnchor([c, r]); paint([[c, r]]); say('الآن اختر آخر حرف في الكلمة.'); sfx.tick(1); return; }
    if (S.anchor[0] === c && S.anchor[1] === r) { setAnchor(null); paint(null); say('ألغي الاختيار.'); return; }
    const path = lineTo(...S.anchor, c, r, true);
    if (!path) { say('الكلمات على خط مستقيم: أفقيا أو عموديا أو قطريا.', 'bad'); sfx.miss(); setAnchor(null); paint(null); return; }
    commit(path);
  };

  const cellAt = (x, y) => {
    const b = el.board.getBoundingClientRect(), s = b.width / S.n, cl = (v) => Math.max(0, Math.min(S.n - 1, v));
    return [cl(Math.floor((b.right - x) / s)), cl(Math.floor((y - b.top) / s))];
  };
  let drag = null;
  el.board.addEventListener('pointerdown', (e) => {
    if (!S || S.over || S.paused || (e.pointerType === 'mouse' && e.button)) return;
    e.preventDefault(); const [c, r] = cellAt(e.clientX, e.clientY);
    drag = { c, r, moved: false, path: [[c, r]], id: e.pointerId }; try { el.board.setPointerCapture(e.pointerId); } catch { /* synthetic pointers cannot be captured */ }
    if (!S.anchor) paint(drag.path);
  });
  el.board.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const [c, r] = cellAt(e.clientX, e.clientY);
    if (c === drag.c && r === drag.r && !drag.moved) return;
    if (!drag.moved) { drag.moved = true; setAnchor(null); }
    const path = lineTo(drag.c, drag.r, c, r);
    if (path.length !== drag.path.length) sfx.tick(path.length);
    drag.path = path; paint(path);
  });
  const endDrag = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag; drag = null;
    if (e.type === 'pointercancel') { paint(null); return; }
    el.board.querySelectorAll('.cell[tabindex="0"]').forEach((x) => (x.tabIndex = -1)); cellEl(d.c, d.r).tabIndex = 0;
    if (d.moved) commit(d.path); else tap(d.c, d.r);
  };
  el.board.addEventListener('pointerup', endDrag); el.board.addEventListener('pointercancel', endDrag);

  /* keyboard: arrows move, Enter marks the first then the last letter */
  el.board.addEventListener('keydown', (e) => {
    const t = e.target.closest('.cell'); if (!t || !S || S.over) return;
    let c = +t.dataset.c, r = +t.dataset.r;
    const move = { ArrowLeft: [1, 0], ArrowRight: [-1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
    if (move) {
      e.preventDefault(); c = Math.max(0, Math.min(S.n - 1, c + move[0])); r = Math.max(0, Math.min(S.n - 1, r + move[1]));
      t.tabIndex = -1; const nx = cellEl(c, r); nx.tabIndex = 0; nx.focus();
      if (S.anchor) paint(lineTo(...S.anchor, c, r, true) || [S.anchor]);
    } else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tap(c, r); }
    else if (e.key === 'Escape' && S.anchor) { e.stopPropagation(); setAnchor(null); paint(null); say('ألغي الاختيار.'); }
  });

  /* ---------- found ---------- */
  const fly = (x, y, target, done) => {
    if (reduced) return done();
    const r = target.querySelector('b').getBoundingClientRect(), s = document.createElement('i');
    s.className = 'spark'; s.style.left = x + 'px'; s.style.top = y + 'px'; document.body.append(s);
    const dx = r.left + r.width / 2 - x, dy = r.top + r.height / 2 - y;
    s.animate([
      { transform: 'translate(0,0) rotate(45deg) scale(0.6)' },
      { transform: `translate(${dx * 0.45}px, ${dy * 0.45 - 46}px) rotate(200deg) scale(1.5)`, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) rotate(405deg) scale(0.7)` },
    ], { duration: 680, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' });
    // a throttled tab may never finish the animation; the lantern still has to light
    let landed = false; const land = () => { if (landed) return; landed = true; s.remove(); done(); };
    s.getAnimations()[0].onfinish = land; setTimeout(land, 900);
  };

  const onFound = (word, path) => {
    const i = S.found.size; S.found.add(word);
    path.forEach(([c, r], k) => { const x = cellEl(c, r); x.classList.add('found'); x.style.setProperty('--k', k); x.classList.remove('pop'); void x.offsetWidth; x.classList.add('pop'); });
    const [x1, y1] = pt(...path[0]), [x2, y2] = pt(...path[path.length - 1]);
    el.lines.insertBefore(svg('line', { class: 'band', x1, y1, x2, y2: y2 + 0.0001, stroke: TINTS[i % 3] }), S.live);
    $(`[data-w="${word}"]`, el.words).classList.add('found');

    const b = el.board.getBoundingClientRect(), s = b.width / S.n, mid = path[Math.floor(path.length / 2)];
    const lan = el.rail.children[i];
    fly(b.right - (mid[0] + 0.5) * s, b.top + (mid[1] + 0.5) * s, lan, () => { lan.classList.add('lit', 'just'); });

    const total = S.words.length, letters = $$('b', el.secret), show = Math.floor((S.found.size / total) * letters.length);
    letters.forEach((sp, k) => sp.classList.toggle('on', k < show));
    el.found.textContent = S.found.size; el.body.style.setProperty('--dawn', (S.found.size / total) * 0.55);
    el.factWord.textContent = word; el.fact.textContent = FACT[word];
    el.factBox.classList.remove('flash'); void el.factBox.offsetWidth; el.factBox.classList.add('flash');
    const left = total - S.found.size;
    say(left ? `أحسنت! وجدت «${word}». ${left === 1 ? 'بقي قنديل واحد' : left === 2 ? 'بقي قنديلان' : left <= 10 ? `بقيت ${left} قناديل` : `بقي ${left} قنديلا`}.` : 'اكتملت الكلمات وانكشفت العبارة السرية!', 'good');
    sfx.found(); navigator.vibrate?.(18); mood('happy', !left);
    if (!left) win();
  };

  /* ---------- hint ---------- */
  el.hint.addEventListener('click', () => {
    if (!S || S.over || S.hints <= 0) return;
    const left = S.placed.filter((p) => !S.found.has(p.word)); if (!left.length) return;
    const p = left[rand(left.length)], cell = cellEl(...p.cells[0]), chip = $(`[data-w="${p.word}"]`, el.words);
    S.hints--; S.hintsUsed++; el.hints.textContent = S.hints; el.hint.disabled = S.hints === 0;
    cell.classList.add('hint'); chip.classList.add('hint'); sfx.hint(); mood('wow');
    say(`كلمة «${p.word}» تبدأ من الخانة المضيئة.`, 'good');
    setTimeout(() => { cell.classList.remove('hint'); chip.classList.remove('hint'); }, 4200);
  });

  /* ---------- time ---------- */
  const tickTime = () => {
    if (!S || S.over || S.paused) return;
    S.t++; showTime();
    if (S.mode !== 'dawn') return;
    const left = S.limit - S.t; el.timeBox.classList.toggle('low', left <= 30);
    if (left <= 10 && left > 0) tone(880, 0.06, { g: 0.03 });
    if (left <= 0) lose();
  };
  setInterval(tickTime, 1000);

  const setPaused = (p) => { if (!S || S.over) return; S.paused = p; el.board.classList.toggle('paused', p); };
  el.pause.addEventListener('click', () => { setPaused(true); el.dPause.showModal(); });
  el.dPause.addEventListener('close', () => setPaused(false));
  document.addEventListener('visibilitychange', () => { if (document.hidden && S && !S.over && !S.paused && S.mode === 'dawn' && !el.play.hidden) { setPaused(true); el.dPause.showModal(); } });

  /* ---------- endings ---------- */
  const embers = (on) => {
    $$('.ember').forEach((e) => e.remove()); if (!on || reduced) return;
    for (let i = 0; i < 16; i++) { const e = document.createElement('i'); e.className = 'ember'; e.style.cssText = `left:${4 + rand(92)}%;--t:${4 + Math.random() * 4}s;--dl:${Math.random() * 4}s;width:${6 + rand(8)}px;height:${6 + rand(8)}px`; document.body.append(e); }
  };
  const win = () => {
    S.over = true; el.body.dataset.screen = 'win'; el.body.style.setProperty('--dawn', 1); el.pause.hidden = true;
    let stars = 3; if (S.hintsUsed >= 2) stars--; if (S.t > LEVELS[S.level].par) stars--;
    $('#win-stars').innerHTML = [0, 1, 2].map((k) => `<svg viewBox="0 0 24 24" class="${k < stars ? 'on' : ''}" style="--k:${k}"><use href="#i-star"/></svg>`).join('');
    $('#win-stars').setAttribute('aria-label', `${stars} من 3 نجوم`);
    $('#win-time').textContent = fmt(S.t); $('#win-hints').textContent = S.hintsUsed;
    $('#win-phrase').innerHTML = tiles();
    const key = `qanadeel-best-${S.level}`, prev = +localStorage.getItem(key) || 0, wb = $('#win-best');
    if (!prev || S.t < prev) { localStorage.setItem(key, S.t); wb.hidden = !prev; wb.textContent = 'رقم جديد! هذا أفضل وقت لك في هذا المستوى.'; } else { wb.hidden = false; wb.textContent = `أفضل وقت لك: ${fmt(prev)}`; wb.style.color = ''; }
    const share = $('#btn-share'); share.hidden = !navigator.share;
    share.onclick = () => navigator.share({ title: (window.FPI18N?.t || ((v) => v))('قناديل الأقصى'), text: (window.FPI18N?.t || ((v) => v))('أضأت قناديل الأقصى كلها في {0}. جرب أنت وعائلتك!').replace('{0}', fmt(S.t)), url: location.href }).catch(() => {});
    setTimeout(() => { sfx.win(); embers(true); }, 500);
    setTimeout(() => { el.dWin.showModal(); el.dWin.scrollTop = 0; }, reduced ? 300 : 1700);
  };
  const lose = () => {
    S.over = true; el.pause.hidden = true; el.timeBox.classList.remove('low'); sfx.lose();
    const total = S.words.length, got = S.found.size;
    $('#lose-rail').innerHTML = S.words.map((_, i) => `<i class="lan ${i < got ? 'lit' : ''}"><b></b></i>`).join('');
    $('#lose-msg').textContent = `أضأت ${got} من ${total}. ${total - got <= 4 ? 'كنت على بعد خطوات قليلة.' : 'المحاولة التالية أقرب.'}`;
    el.dLose.showModal();
  };
  [el.dWin, el.dLose].forEach((d) => d.addEventListener('cancel', (e) => e.preventDefault()));

  /* ---------- flow ---------- */
  const showStart = () => {
    S = null; embers(false); el.body.dataset.screen = 'start'; el.body.style.setProperty('--dawn', 0);
    el.play.hidden = true; el.start.hidden = false; el.pause.hidden = true; syncSetup(); scrollTo(0, 0);
  };
  const startGame = (level, mode) => {
    const L = LEVELS[level]; let made = null;
    // a rare word set cannot be laid out; draw another instead of leaving the player on an empty board
    for (let k = 0; k < 6 && !made; k++) { try { made = generate(L, shuffle(WORDS.map((w) => w[0])).slice(0, L.count)); } catch { made = null; } }
    if (!made) return;
    const { grid, placed } = made;
    S = { level, mode, n: L.n, grid, placed, words: placed.map((p) => p.word).sort((a, b) => a.length - b.length || a.localeCompare(b, 'ar')), found: new Set(), hints: 3, hintsUsed: 0, t: 0, limit: L.time, paused: false, over: false, anchor: null, live: null };
    embers(false); el.body.dataset.screen = 'play'; el.body.style.setProperty('--dawn', 0);
    el.start.hidden = true; el.play.hidden = false; el.pause.hidden = false; el.board.classList.remove('paused');
    build(); mood('calm'); scrollTo(0, 0);
  };
  const syncSetup = () => {
    const level = el.setup.level.value, L = LEVELS[level], best = +localStorage.getItem(`qanadeel-best-${level}`) || 0;
    el.dawnNote.textContent = `أضئها كلها خلال ${L.time / 60} دقائق`;
    el.best.hidden = !best; el.best.textContent = best ? `أفضل وقت لك في هذا المستوى: ${fmt(best)}` : '';
  };
  el.setup.addEventListener('change', syncSetup); syncSetup();
  el.setup.addEventListener('submit', (e) => { e.preventDefault(); sfx.tick(3); startGame(el.setup.level.value, el.setup.mode.value); });

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const act = b.dataset.act, keep = S && { level: S.level, mode: S.mode };
    $$('dialog[open]').forEach((d) => d.close());
    setPaused(false); // do not wait for the dialog's close event
    if (act === 'restart' && keep) startGame(keep.level, keep.mode);
    else if (act === 'home') showStart();
    else if (act === 'calm' && S) { S.mode = 'calm'; S.over = false; el.pause.hidden = false; showTime(); say('أكمل على مهلك، لا وقت يلاحقك الآن.'); }
  });

  window.__qanadeel = { get state() { return S; } }; // for testing in the console
})();
