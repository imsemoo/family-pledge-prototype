/* منبر صلاح الدين — eight pieces bring the burnt minbar back. No dependencies.
   Every piece is the same picture, clipped to one polygon; the polygons tile the picture exactly. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rand = (n) => Math.floor(Math.random() * n);
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const W = 1200, H = 958; // the picture's own coordinate space

  const PIECES = [
    { id: 'base', name: 'القاعدة', fact: 'العارضة السفلية التي تثبت أجزاء المنبر كلها.', pts: [[0, 848], [200, 864], [765, 910], [790, 912], [1125, 885], [1200, 880], [1200, 958], [0, 958]] },
    { id: 'tower', name: 'البرج الأيسر', fact: 'الواجهة الرأسية المزخرفة في يسار المنبر، بحشواتها الهندسية المتتابعة.', pts: [[0, 170], [200, 170], [200, 864], [0, 848]] },
    { id: 'crown-l', name: 'التاج الأيسر', fact: 'الإفريز العلوي المتموج فوق مدخل المنبر.', pts: [[0, 0], [560, 0], [560, 170], [0, 170]] },
    { id: 'arch', name: 'العقد العلوي', fact: 'بوابة الصعود والعقد الخشبي أعلى الدرج.', pts: [[200, 170], [560, 170], [560, 250], [600, 300], [700, 345], [740, 365], [740, 410], [765, 410], [765, 640], [200, 262]] },
    { id: 'rail', name: 'الدرابزين', fact: 'الشريط المائل بزخارف النجوم فوق الدرج، صنع من قطع صغيرة معشقة بلا مسامير.', pts: [[200, 262], [765, 640], [765, 870], [200, 415]] },
    { id: 'panel', name: 'لوحة الدرج', fact: 'اللوحة الهندسية الكبيرة أسفل الدرابزين، تتكرر فيها النجمة في نسق واحد.', pts: [[200, 415], [765, 870], [765, 910], [200, 864]] },
    { id: 'crown-r', name: 'التاج الأيمن', fact: 'الشرفة العلوية المزخرفة التي يقف عندها الخطيب.', pts: [[560, 0], [1200, 0], [1200, 410], [740, 410], [740, 365], [700, 345], [600, 300], [560, 250]] },
    { id: 'body', name: 'الواجهة اليمنى', fact: 'الواجهة ذات العقد واللوحات النجمية في يمين المنبر.', pts: [[765, 410], [1200, 410], [1200, 880], [1125, 885], [790, 912], [765, 910]] },
  ].map((p) => {
    const xs = p.pts.map((q) => q[0]), ys = p.pts.map((q) => q[1]);
    const x = Math.min(...xs), y = Math.min(...ys), w = Math.max(...xs) - x, h = Math.max(...ys) - y;
    return { ...p, x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
  });

  const el = {
    body: document.body, start: $('#screen-start'), play: $('#screen-play'), setup: $('#setup'), best: $('#best'),
    board: $('#board'), slots: $('#slots'), tray: $('#tray'), status: $('#status'), fact: $('#fact'), factWord: $('#fact-word'), factBox: $('.fact'),
    found: $('#hud-found'), time: $('#hud-time'), miss: $('#hud-miss'), hint: $('#btn-hint'), hints: $('#hud-hints'), mix: $('#btn-mix'), sound: $('#btn-sound'), dWin: $('#dlg-win'),
  };
  let S = null;

  /* ---------- sound ---------- */
  let ac = null, soundOn = localStorage.getItem('minbar-sound') !== '0';
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
    turn: () => tone(520, 0.08, { type: 'triangle', g: 0.05 }),
    lift: () => tone(380, 0.06, { g: 0.035 }),
    place: () => { tone(196, 0.16, { type: 'triangle', g: 0.09 }); tone(659, 0.5, { at: 0.05 }); tone(988, 0.7, { at: 0.14, g: 0.05 }); },
    miss: () => tone(170, 0.16, { type: 'triangle', g: 0.06 }),
    hint: () => { tone(660, 0.18, { g: 0.05 }); tone(990, 0.3, { at: 0.1, g: 0.04 }); },
    win: () => [392, 523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, 1.1, { at: i * 0.13, g: 0.07 })),
  };
  const syncSound = () => { el.sound.setAttribute('aria-pressed', soundOn); $('use', el.sound).setAttribute('href', soundOn ? '#i-sound' : '#i-mute'); el.sound.setAttribute('aria-label', soundOn ? 'إيقاف الصوت' : 'تشغيل الصوت'); };
  el.sound.addEventListener('click', () => { soundOn = !soundOn; localStorage.setItem('minbar-sound', soundOn ? '1' : '0'); syncSound(); if (soundOn) sfx.turn(); });
  syncSound();

  const say = (text, kind = '') => { el.status.textContent = text; el.status.dataset.kind = kind; };
  const unit = () => el.board.getBoundingClientRect().width / W; // screen pixels per picture unit

  /* ---------- pieces ---------- */
  const makePiece = (p) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'pc'; b.dataset.id = p.id; b.style.aspectRatio = `${p.w} / ${p.h}`;
    const clip = p.pts.map(([x, y]) => `${(((x - p.x) / p.w) * 100).toFixed(3)}% ${(((y - p.y) / p.h) * 100).toFixed(3)}%`).join(',');
    const bx = p.w === W ? 0 : (p.x / (W - p.w)) * 100, by = p.h === H ? 0 : (p.y / (H - p.h)) * 100;
    b.innerHTML = `<span class="pc__turn"><span class="pc__img" style="clip-path:polygon(${clip});background-size:${(W / p.w) * 100}% ${(H / p.h) * 100}%;background-position:${bx}% ${by}%"></span></span>`;
    return b;
  };
  const label = (st) => `قطعة ${st.p.name}. ${S.level === 'knights' ? 'انقر لتدويرها، أو اسحبها إلى مكانها.' : 'اسحبها إلى مكانها.'}`;
  const setRot = (st, r) => { st.rot = r; st.node.style.setProperty('--rot', `${r}deg`); };
  const upright = (st) => ((st.rot % 360) + 360) % 360 === 0;
  /* in the tray every piece is scaled to fit its cell */
  const fit = (st) => {
    const cell = st.cell.getBoundingClientRect().width * 0.8, k = cell / Math.max(st.p.w, st.p.h);
    Object.assign(st.node.style, { position: '', left: '', top: '', width: `${st.p.w * k}px`, zIndex: '' });
  };
  const toTray = (st) => { st.node.classList.remove('is-drag'); st.cell.append(st.node); fit(st); };

  const build = () => {
    el.tray.innerHTML = ''; $$('.pc', el.board).forEach((n) => n.remove());
    el.slots.innerHTML = PIECES.map((p) => `<polygon data-id="${p.id}" points="${p.pts.map((q) => q.join(',')).join(' ')}"/>`).join('');
    el.board.classList.remove('is-done');
    S.items = shuffle(PIECES.map((p) => ({ p, rot: 0, misses: 0, placed: false })));
    S.items.forEach((st) => {
      st.cell = document.createElement('div'); st.cell.className = 'mtray__cell'; el.tray.append(st.cell);
      st.node = makePiece(st.p); st.cell.append(st.node);
      setRot(st, S.level === 'knights' ? (1 + rand(3)) * 90 : 0);
      st.node.setAttribute('aria-label', label(st)); fit(st); wire(st);
    });
    el.found.textContent = 0; el.miss.textContent = 0; el.hints.textContent = S.hints; el.hint.disabled = false; el.time.textContent = '0:00';
    el.factWord.textContent = 'هل تعلم؟'; el.fact.textContent = 'أمر نور الدين زنكي بصنع المنبر في حلب، ونقله صلاح الدين إلى المسجد الأقصى بعد تحرير القدس.';
    say(S.level === 'knights' ? 'انقر على القطعة لتدويرها، ثم اسحبها إلى مكانها.' : 'اسحب كل قطعة إلى مكانها على المنبر.');
  };

  /* ---------- moving a piece ---------- */
  const slot = (id) => $(`[data-id="${id}"]`, el.slots);
  const glow = (id, ms = 2600) => { const s = slot(id); s.classList.remove('is-hint'); void s.getBoundingClientRect(); s.classList.add('is-hint'); setTimeout(() => s.classList.remove('is-hint'), ms); };

  const place = (st) => {
    const { p, node } = st; st.placed = true;
    node.classList.remove('is-drag'); node.classList.add('is-placed'); node.disabled = true; node.tabIndex = -1; setRot(st, 0);
    Object.assign(node.style, { position: 'absolute', left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%`, width: `${(p.w / W) * 100}%`, zIndex: '' });
    el.board.append(node); st.cell.classList.add('is-empty'); slot(p.id).classList.add('is-set');
    const n = S.items.filter((x) => x.placed).length; el.found.textContent = n;
    el.factWord.textContent = p.name; el.fact.textContent = p.fact;
    el.factBox.classList.remove('flash'); void el.factBox.offsetWidth; el.factBox.classList.add('flash');
    const left = S.items.length - n;
    say(left ? `أحسنت! ثبتت قطعة «${p.name}». ${left === 1 ? 'بقيت قطعة واحدة' : left === 2 ? 'بقيت قطعتان' : `بقيت ${left} قطع`}.` : 'اكتمل المنبر!', 'good');
    sfx.place(); try { navigator.vibrate?.(18); } catch { /* not allowed before a real tap */ }
    if (!left) win();
  };

  const miss = (st, text) => {
    st.misses++; S.misses++; el.miss.textContent = S.misses; sfx.miss(); say(text, 'bad'); toTray(st);
    if (!reduced) { st.node.classList.remove('is-no'); void st.node.offsetWidth; st.node.classList.add('is-no'); }
    if (st.misses >= 2) { glow(st.p.id); say(`تلميح: مكان «${st.p.name}» يضيء على المنبر${upright(st) ? '.' : '، واجعل القطعة مستقيمة أولا.'}`, 'good'); }
  };

  const drop = (st, x, y) => {
    const b = el.board.getBoundingClientRect(), u = b.width / W, px = (x - b.left) / u, py = (y - b.top) / u;
    const inside = px > -60 && px < W + 60 && py > -60 && py < H + 60;
    if (!inside) { toTray(st); say('أفلت القطعة فوق المنبر.'); return; }
    const near = Math.hypot(px - st.p.cx, py - st.p.cy) < Math.max(120, Math.min(st.p.w, st.p.h) * 0.45);
    if (near && upright(st)) return place(st);
    if (near) return miss(st, 'المكان صحيح، لكن القطعة تحتاج تدويرا. انقر عليها حتى تستقيم.');
    miss(st, 'ليست هنا. قارن شكل القطعة بالفراغات وجرب مكانا آخر.');
  };

  const turn = (st) => { if (S.level !== 'knights') { say(`قطعة «${st.p.name}»: اسحبها إلى مكانها على المنبر.`); return; } setRot(st, st.rot + 90); sfx.turn(); say(upright(st) ? `قطعة «${st.p.name}» مستقيمة الآن. اسحبها إلى مكانها.` : `دورت قطعة «${st.p.name}».`, upright(st) ? 'good' : ''); };

  const wire = (st) => {
    const { node } = st; let d = null;
    node.addEventListener('pointerdown', (e) => {
      if (st.placed || S.over || (e.pointerType === 'mouse' && e.button)) return;
      d = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false }; try { node.setPointerCapture(e.pointerId); } catch { /* synthetic pointers cannot be captured */ }
    });
    node.addEventListener('pointermove', (e) => {
      if (!d || e.pointerId !== d.id) return;
      if (!d.moved) {
        if (Math.hypot(e.clientX - d.x, e.clientY - d.y) < 8) return;
        d.moved = true; sfx.lift(); document.body.append(node); node.classList.add('is-drag');
        Object.assign(node.style, { position: 'fixed', width: `${st.p.w * unit()}px`, zIndex: 60 });
      }
      const r = node.getBoundingClientRect(); // the pointer holds the piece by its middle, a little above the finger on touch
      node.style.left = `${e.clientX - r.width / 2}px`; node.style.top = `${e.clientY - r.height / 2 - (e.pointerType === 'touch' ? 34 : 0)}px`;
      d.px = e.clientX; d.py = e.clientY - (e.pointerType === 'touch' ? 34 : 0);
    });
    const end = (e) => {
      if (!d || e.pointerId !== d.id) return; const g = d; d = null;
      if (e.type === 'pointercancel') { if (g.moved) toTray(st); return; }
      if (!g.moved) return; // a plain tap is handled by click
      st.dropped = performance.now(); // the click that follows a drag must not turn the piece
      drop(st, g.px ?? e.clientX, g.py ?? e.clientY);
    };
    node.addEventListener('pointerup', end); node.addEventListener('pointercancel', end);
    node.addEventListener('click', () => { if (st.placed || S.over || performance.now() - (st.dropped || -1e9) < 350) return; turn(st); });
    // keyboard: Enter turns, Space sets the piece when it is upright
    node.addEventListener('keydown', (e) => {
      if (st.placed || S.over || e.key !== ' ') return; e.preventDefault();
      if (upright(st)) place(st); else say('دور القطعة حتى تستقيم أولا (مفتاح Enter).', 'bad');
    });
  };

  /* ---------- hint, mix, time ---------- */
  el.hint.addEventListener('click', () => {
    if (!S || S.over || S.hints <= 0) return;
    const left = S.items.filter((x) => !x.placed); if (!left.length) return;
    const st = left[0]; S.hints--; S.hintsUsed++; el.hints.textContent = S.hints; el.hint.disabled = S.hints === 0;
    glow(st.p.id, 3600); sfx.hint();
    st.node.classList.remove('is-hint'); void st.node.offsetWidth; st.node.classList.add('is-hint'); setTimeout(() => st.node.classList.remove('is-hint'), 3600);
    say(`مكان قطعة «${st.p.name}» يضيء على المنبر.`, 'good');
  });
  el.mix.addEventListener('click', () => {
    if (!S || S.over) return;
    const left = S.items.filter((x) => !x.placed), cells = shuffle(left.map((x) => x.cell));
    left.forEach((st, i) => { st.cell = cells[i]; if (S.level === 'knights') setRot(st, st.rot + (1 + rand(3)) * 90); toTray(st); });
    say('بعثرت القطع من جديد.'); sfx.turn();
  });
  setInterval(() => { if (!S || S.over) return; S.t++; el.time.textContent = fmt(S.t); }, 1000);
  addEventListener('resize', () => { if (S) S.items.forEach((st) => { if (!st.placed) fit(st); }); });

  /* ---------- endings ---------- */
  const win = () => {
    S.over = true; el.body.dataset.screen = 'win'; el.body.style.setProperty('--dawn', 1); el.board.classList.add('is-done');
    let stars = 3; if (S.misses > 2 || S.hintsUsed >= 2) stars--; if (S.misses > 6 || S.t > (S.level === 'knights' ? 240 : 150)) stars--;
    $('#win-stars').innerHTML = [0, 1, 2].map((k) => `<svg viewBox="0 0 24 24" class="${k < stars ? 'on' : ''}" style="--k:${k}"><use href="#i-star"/></svg>`).join('');
    $('#win-stars').setAttribute('aria-label', `${stars} من 3 نجوم`);
    $('#win-time').textContent = fmt(S.t); $('#win-miss').textContent = S.misses;
    const key = `minbar-best-${S.level}`, prev = +localStorage.getItem(key) || 0, wb = $('#win-best');
    if (!prev || S.t < prev) { localStorage.setItem(key, S.t); wb.hidden = !prev; wb.textContent = 'رقم جديد! هذا أفضل وقت لك في هذا المستوى.'; } else { wb.hidden = false; wb.textContent = `أفضل وقت لك: ${fmt(prev)}`; }
    setTimeout(() => sfx.win(), 400);
    setTimeout(() => { el.dWin.showModal(); el.dWin.scrollTop = 0; }, reduced ? 300 : 1900);
  };
  el.dWin.addEventListener('cancel', (e) => e.preventDefault());

  /* the keepsake card is drawn here, on this device; the name never leaves it */
  const img = (src) => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
  $('#card-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = $('#card-name'), msg = $('#card-msg'), btn = $('button', e.currentTarget), name = input.value.trim().replace(/\s+/g, ' ');
    if ([...name].length < 2) { input.setAttribute('aria-invalid', 'true'); msg.textContent = 'اكتب اسما أو اسما مستعارا من حرفين على الأقل.'; msg.dataset.state = 'error'; input.focus(); return; }
    input.removeAttribute('aria-invalid'); btn.classList.add('is-busy');
    try {
      const [minbar, logo] = await Promise.all([img('img/minbar.webp'), img('../../assets/img/logo-mark.png'), document.fonts.load('800 80px "Baloo Bhaijaan 2"'), document.fonts.load('500 40px Rubik')]);
      const c = document.createElement('canvas'); c.width = 1080; c.height = 1350; const x = c.getContext('2d');
      const g = x.createLinearGradient(0, 0, 0, 1350); g.addColorStop(0, '#0c2530'); g.addColorStop(1, '#174d61'); x.fillStyle = g; x.fillRect(0, 0, 1080, 1350);
      x.fillStyle = '#f3f7f9'; x.beginPath(); x.roundRect(70, 190, 940, 760, 56); x.fill();
      const mw = 820, mh = mw * (H / W); x.drawImage(minbar, 130, 190 + (760 - mh) / 2, mw, mh);
      x.fillStyle = '#fff'; x.beginPath(); x.arc(540, 105, 52, 0, Math.PI * 2); x.fill(); x.drawImage(logo, 496, 61, 88, 88);
      x.direction = 'rtl'; x.textAlign = 'center';
      x.fillStyle = '#f8bdd4'; x.font = '700 44px "Baloo Bhaijaan 2", sans-serif'; x.fillText(`أنا ${name}`, 540, 1030);
      x.fillStyle = '#fff'; x.font = '800 74px "Baloo Bhaijaan 2", sans-serif'; x.fillText('أعدت بناء منبر صلاح الدين', 540, 1125);
      x.fillStyle = '#c9dde4'; x.font = '500 34px Rubik, sans-serif'; x.fillText('قد يحرق الخشب، لكن الذاكرة التي نحفظها لا تحترق.', 540, 1195);
      x.fillStyle = '#f4b740'; x.font = '700 30px "Baloo Bhaijaan 2", sans-serif'; x.fillText('ميثاق العائلة', 540, 1280);
      const blob = await new Promise((ok) => c.toBlob(ok, 'image/png'));
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'minbar-card.png'; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      msg.textContent = 'نزلت بطاقتك. شاركها مع عائلتك.'; msg.dataset.state = 'ok';
    } catch { msg.textContent = 'تعذر تجهيز البطاقة. حاول مرة أخرى.'; msg.dataset.state = 'error'; }
    btn.classList.remove('is-busy');
  });

  /* ---------- flow ---------- */
  const showStart = () => { S = null; el.body.dataset.screen = 'start'; el.body.style.setProperty('--dawn', 0); el.play.hidden = true; el.start.hidden = false; syncSetup(); scrollTo(0, 0); };
  const startGame = (level) => {
    S = { level, t: 0, misses: 0, hints: 3, hintsUsed: 0, over: false, items: [] };
    el.body.dataset.screen = 'play'; el.body.style.setProperty('--dawn', 0); el.start.hidden = true; el.play.hidden = false; scrollTo(0, 0);
    build();
  };
  const syncSetup = () => { const best = +localStorage.getItem(`minbar-best-${el.setup.level.value}`) || 0; el.best.hidden = !best; el.best.textContent = best ? `أفضل وقت لك في هذا المستوى: ${fmt(best)}` : ''; };
  el.setup.addEventListener('change', syncSetup); syncSetup();
  el.setup.addEventListener('submit', (e) => { e.preventDefault(); sfx.turn(); startGame(el.setup.level.value); });
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]'); if (!b) return; const level = S?.level;
    $$('dialog[open]').forEach((d) => d.close());
    if (b.dataset.act === 'restart' && level) startGame(level); else showStart();
  });

  window.__minbar = { get state() { return S; }, pieces: PIECES }; // for testing in the console
})();
