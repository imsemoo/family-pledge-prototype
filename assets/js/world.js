/* ميثاق العائلة — scenes built from the cast and props, and how they react.
   Needs cast.js. Each [data-scene] element is filled with one SVG scene. */
(() => {
  'use strict';
  const C = window.Cast, P = C.props, person = C.person, sprite = C.sprite, dia = C.dia;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const H = 150, K = H / 160; // figure height in scene units, and its scale
  /* a figure standing on `ground`, centred on cx; returns markup and where its hands are */
  const stand = (id, cx, ground, o = {}) => {
    const h = o.h || H, k = h / 160, x = cx - 60 * k, y = ground - 151 * k;
    const at = (side, deg) => { const p = C.hand(C.PEOPLE[id].size, side, deg); return [x + p.x * k, y + p.y * k]; };
    return { svg: person(id, { ...o, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, h }), at };
  };

  const S = {};

  /* ---- hero: one thread between two homes ---- */
  S.hero = (el) => {
    const narrow = el.clientWidth < 760, G = 300;
    const L = narrow
      ? { hb: 352, ha: 690, hw: 150, kidB: 520, kidA: 680, far: 600 }
      : { hb: 62, ha: 986, hw: 168, far: 600 };
    const B = narrow ? [stand('nour', L.kidB, G, { pose: 'up-r', mood: 'happy' })]
      : [stand('widad', 262, G, { pose: 'wave-l' }), stand('maryam', 338, G, {}), stand('nour', 418, G, { pose: 'up-r', mood: 'happy' })];
    const A = narrow ? [stand('yafa', L.kidA, G, { pose: 'up-l', mood: 'happy' })]
      : [stand('yafa', 782, G, { pose: 'up-l', mood: 'happy' }), stand('salma', 862, G, {}), stand('amin', 936, G, {}), stand('raed', 1004, G, { pose: 'wave' })];
    const from = A[0].at('l', 150), to = B[B.length - 1].at('r', -150);
    const sag = narrow ? 34 : 92, mx = (from[0] + to[0]) / 2, my = Math.max(from[1], to[1]) + sag;
    const line = `M${from[0].toFixed(1)} ${from[1].toFixed(1)}Q${mx.toFixed(1)} ${my.toFixed(1)} ${to[0].toFixed(1)} ${to[1].toFixed(1)}`;

    el.innerHTML = `<svg viewBox="0 0 1200 340" preserveAspectRatio="xMidYMax slice" role="img" aria-label="عائلتان أمام بيتين، يمسك طفلاهما خيطا واحدا تعلقت عليه الغرز">
      <g data-depth="0.25">
        <circle cx="${L.far}" cy="212" r="96" fill="#fdf1f6"/>
        <path d="M0 300C140 214 300 236 430 256S700 178 860 240S1090 210 1200 252V300Z" fill="#eef7f9"/>
        <path d="M0 300C200 262 380 280 560 268S900 262 1200 284V300Z" fill="#dceef3"/>
        ${P.cypress(L.far - 62, 262, 0.62, '#9fd0de')}${P.cypress(L.far - 46, 264, 0.48, '#bfe0ea')}${P.dome(L.far, 268, 0.95)}${P.cypress(L.far + 56, 264, 0.56, '#9fd0de')}
      </g>
      <g data-depth="0.55">
        ${P.tree(narrow ? L.hb - 6 : 248, G, 1.12)}
        ${P.house(L.hb, G, L.hw, 168, { roof: '#b03a62', door: '#8c2b4d', line: '#f2aec7', glass: '#fdf1f6', mend: true, doorAt: 0.56 })}
        ${P.house(L.ha, G, L.hw, 168, { roof: '#2a7896', door: '#1f6079' })}
        ${P.cypress(narrow ? L.ha + L.hw + 8 : 1172, G, 1.05)}
      </g>
      <path d="M0 300H1200" stroke="#409db7" stroke-width="3" stroke-dasharray="11 9" stroke-linecap="round" opacity=".7"/>
      <g data-depth="1">
        <path class="hero-line" d="${line}" fill="none" stroke="#c94f78" stroke-width="2.6" stroke-linecap="round"/>
        <g class="hero-flags"></g><g class="hero-run"></g>
        ${B.map((p) => p.svg).join('')}${A.map((p) => p.svg).join('')}
      </g></svg>`;

    const svg = el.firstElementChild, path = svg.querySelector('.hero-line'), len = path.getTotalLength();
    const flags = svg.querySelector('.hero-flags'), tones = ['#e087a6', '#409db7', '#f4b740', '#f8bdd4', '#2a7896'], count = narrow ? 3 : 9;
    let out = '';
    for (let i = 0; i < count; i++) {
      const t = (i + 1) / (count + 1), p = path.getPointAtLength(len * t), mid = !narrow && i === 4;
      out += mid
        ? `<g class="flag flag--big" style="--i:${i};transform-origin:${p.x}px ${p.y}px">${sprite({ x: p.x - 23, y: p.y + 4, s: 46, mood: 'happy', tail: false })}</g>`
        : `<g class="flag" style="--i:${i};transform-origin:${p.x}px ${p.y}px"><path d="M${p.x} ${p.y}v9" stroke="#c94f78" stroke-width="1.6"/>${dia(p.x, p.y + 19, 15, tones[i % tones.length])}</g>`;
    }
    flags.innerHTML = out;

    /* stitches travelling from the signing home to the standing one */
    const run = svg.querySelector('.hero-run');
    if (!reduced) {
      run.innerHTML = [0, 1, 2].map(() => dia(0, 0, 9, '#f4b740')).join('');
      const dots = [...run.children]; let on = false, raf = 0;
      const tick = (now) => {
        dots.forEach((d, i) => { const t = ((now / 5200 + i / 3) % 1), p = path.getPointAtLength(len * t); d.setAttribute('transform', `translate(${p.x} ${p.y - 1}) rotate(45)`); d.setAttribute('opacity', Math.sin(t * Math.PI).toFixed(2)); });
        if (on) raf = requestAnimationFrame(tick);
      };
      new IntersectionObserver((es) => { on = es[0].isIntersecting; cancelAnimationFrame(raf); if (on) raf = requestAnimationFrame(tick); }).observe(el);
    }

    /* depth: layers drift a little with the pointer */
    if (!reduced && matchMedia('(hover: hover)').matches) {
      const layers = $$('[data-depth]', svg); let tx = 0, cur = 0, raf = 0;
      const step = () => { cur += (tx - cur) * 0.08; layers.forEach((g) => g.setAttribute('transform', `translate(${(cur * 16 * +g.dataset.depth).toFixed(2)} 0)`)); raf = Math.abs(tx - cur) > 0.002 ? requestAnimationFrame(step) : 0; };
      el.closest('.hero').addEventListener('pointermove', (e) => { tx = e.clientX / innerWidth - 0.5; if (!raf) raf = requestAnimationFrame(step); });
    }
    return narrow;
  };

  /* ---- the three steps ---- */
  const vignette = (label, inner) => `<svg viewBox="0 0 320 200" role="img" aria-label="${label}"><ellipse cx="160" cy="176" rx="140" ry="16" fill="#fff"/><path d="M24 176H296" stroke="#409db7" stroke-width="2.6" stroke-dasharray="9 8" stroke-linecap="round" opacity=".6"/>${inner}</svg>`;
  S.step1 = (el) => {
    const a = stand('amin', 70, 176, { h: 150, pose: 'reach-r' }), s = stand('salma', 252, 176, { h: 150, pose: 'reach-l', mood: 'happy' }), r = stand('raed', 196, 176, { h: 132, mood: 'wow' });
    el.innerHTML = vignette('الأب والأم وابنهما يوقعون وثيقة الميثاق', `${P.doc(150, 92, 1.5, -5)}${a.svg}${r.svg}${s.svg}${sprite({ x: 132, y: 6, s: 34, mood: 'happy', tail: false, fill: '#e087a6' })}`);
  };
  S.step2 = (el) => {
    const y = stand('yafa', 86, 176, { h: 138, pose: 'cheer' }), w = stand('widad', 236, 176, { h: 150, pose: 'wave-l', mood: 'happy' });
    el.innerHTML = vignette('يافا وجدتها أمام وثيقة الميثاق معلقة على الجدار', `<path d="M160 14v20" stroke="#c94f78" stroke-width="2.4" stroke-dasharray="5 5" stroke-linecap="round"/>${dia(160, 12, 10, '#f4b740')}<rect x="118" y="32" width="84" height="104" rx="14" fill="#1f6079"/>${P.doc(160, 84, 1.12, 0)}${y.svg}${w.svg}`);
  };
  S.step3 = (el) => {
    const r = stand('raed', 66, 176, { h: 132, pose: 'open', mood: 'wow' }), y = stand('yafa', 258, 176, { h: 132, pose: 'up-l', mood: 'happy' });
    el.innerHTML = vignette('رائد ويافا يفتحان حقيبة الميثاق فتخرج منها الكتب والقناديل', `<g class="float" style="--i:0">${P.book(112, 62, 0.9, '#e087a6', -14)}</g><g class="float" style="--i:1">${P.lantern(162, 44, 0.9, true)}</g><g class="float" style="--i:2">${P.book(208, 66, 0.8, '#409db7', 12)}</g>${P.bag(160, 176, 0.86)}${r.svg}${y.svg}`);
  };

  /* ---- the bag ---- */
  S.bag = (el) => {
    const r = stand('raed', 96, 300, { h: 170, pose: 'cheer' }), y = stand('yafa', 388, 300, { h: 170, pose: 'wave-l', mood: 'happy' }), n = stand('nour', 312, 300, { h: 150, mood: 'wow' });
    el.innerHTML = `<svg viewBox="0 0 480 330" role="img" aria-label="ثلاثة أطفال حول حقيبة الميثاق، تتطاير منها الكتب والقناديل والبطاقات">
      <circle cx="240" cy="160" r="150" fill="#eef7f9"/><path d="M40 300H440" stroke="#409db7" stroke-width="2.8" stroke-dasharray="10 9" stroke-linecap="round" opacity=".6"/>
      <g class="float" style="--i:0">${P.book(150, 78, 1.1, '#e087a6', -16)}</g><g class="float" style="--i:2">${P.lantern(238, 52, 1.15, true)}</g><g class="float" style="--i:1">${P.book(322, 86, 1, '#2a7896', 14)}</g>
      <g class="float" style="--i:3">${P.doc(92, 140, 0.62, -20)}</g><g class="float" style="--i:4">${sprite({ x: 366, y: 130, s: 40, mood: 'happy', fill: '#e087a6', tail: false })}</g>
      ${P.bag(214, 300, 1.5)}${r.svg}${n.svg}${y.svg}</svg>`;
  };

  /* ---- the three vows, as medallions ---- */
  const medal = (label, inner) => `<svg viewBox="0 0 200 200" role="img" aria-label="${label}">${inner}</svg>`;
  S.goal1 = (el) => { el.innerHTML = medal('قنديل مضاء في بيت', `<g class="float" style="--i:0">${P.lantern(100, 86, 2, true)}</g>${sprite({ x: 132, y: 128, s: 46, mood: 'wow', tail: false, fill: '#e087a6' })}${dia(44, 132, 12, '#409db7')}${dia(58, 150, 8, '#bfe0ea')}`); };
  S.goal2 = (el) => { const m = stand('maryam', 88, 186, { h: 168, pose: 'open', mood: 'happy' }), n = stand('nour', 138, 186, { h: 138, pose: 'wave' }); el.innerHTML = medal('أم تضم صغيرها', m.svg + n.svg); };
  S.goal3 = (el) => { el.innerHTML = medal('قبة الصخرة وشجرة زيتون', `${P.cypress(42, 168, 0.9, '#9fd0de')}${P.dome(104, 168, 1.5)}${P.tree(166, 168, 1.05)}<path d="M20 168H180" stroke="#409db7" stroke-width="2.6" stroke-dasharray="9 8" stroke-linecap="round" opacity=".6"/>`); };

  /* ---- the game's night, as a teaser ---- */
  S.night = (el) => {
    const y = stand('yafa', 86, 282, { h: 120, pose: 'up-l', mood: 'happy' }), r = stand('raed', 150, 282, { h: 120, pose: 'cheer' });
    const lan = [[52, 66, 1, 1], [122, 92, 1.25, 1], [200, 60, 0.95, 0], [272, 98, 1.15, 1], [346, 70, 0.9, 0]];
    el.innerHTML = `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      <path d="M-10 22Q200 58 410 22" fill="none" stroke="#7fc4d8" stroke-width="2.4" stroke-dasharray="8 7" stroke-linecap="round" opacity=".8"/>
      ${lan.map(([x, yy, s, lit], i) => `<g class="lan-swing" style="--i:${i};transform-origin:${x}px ${yy - 34 * s}px"><path d="M${x} ${24 + Math.abs(200 - x) * -0.03 + 10}V${yy - 30 * s}" stroke="#5fa9bf" stroke-width="1.6"/>${P.lantern(x, yy, s, !!lit)}</g>`).join('')}
      <path d="M0 282H400" stroke="#7fc4d8" stroke-width="2.4" stroke-dasharray="9 8" stroke-linecap="round" opacity=".5"/>
      ${P.cypress(236, 282, 0.9, '#174d61')}${P.dome(300, 282, 1.5, { base: '#1f6079', drum: '#174d61' })}${P.cypress(366, 282, 1.1, '#174d61')}${y.svg}${r.svg}</svg>`;
  };

  /* ---- small companions ---- */
  S.sower = (el) => { el.innerHTML = person('nour', { pose: 'up-r', mood: 'happy' }); };
  S.maker = (el) => { el.innerHTML = person('maryam', { pose: 'wave', mood: 'happy' }); };
  S.sewer = (el) => { el.innerHTML = person('widad', { pose: 'reach-l', mood: 'happy', hold: { l: P.needle(-4, 18, 0.62, -18) } }); };
  S.guide = (el) => { el.innerHTML = sprite({ mood: el.dataset.mood || 'happy', fill: el.dataset.fill || '#f4b740', tail: el.dataset.tail !== 'no' }); };

  /* ---- the closing scene: the logo, alive ---- */
  S.call = (el) => {
    const ps = [stand('yafa', 96, 232, { h: 150, pose: 'cheer' }), stand('salma', 168, 232, { h: 186 }), stand('amin', 238, 232, { h: 186, pose: 'wave' }), stand('raed', 308, 232, { h: 144, pose: 'cheer' })];
    el.innerHTML = `<svg viewBox="0 0 400 260" role="img" aria-label="العائلة مجتمعة داخل قوسي الشعار">
      <g class="arcs"><path d="M82 44A150 150 0 0 1 350 150" fill="none" stroke="#f2aec7" stroke-width="20" stroke-linecap="round"/><path d="M318 226A150 150 0 0 1 50 110" fill="none" stroke="#409db7" stroke-width="20" stroke-linecap="round"/></g>
      <path d="M60 232H340" stroke="#c94f78" stroke-width="2.8" stroke-dasharray="10 9" stroke-linecap="round" opacity=".7"/>${ps.map((p) => p.svg).join('')}</svg>`;
  };

  const mount = (el) => S[el.dataset.scene]?.(el);
  $$('[data-scene]').forEach(mount);

  /* the hero has two layouts; rebuild it when the width crosses over */
  const hero = document.querySelector('[data-scene="hero"]');
  if (hero) { let was = hero.clientWidth < 760; new ResizeObserver(() => { const now = hero.clientWidth < 760; if (now !== was) { was = now; S.hero(hero); } }).observe(hero); }

  /* say hello: any figure greets a pointer or a tap */
  const hi = (c) => { if (c.classList.contains('is-hi')) return; c.classList.add('is-hi'); setTimeout(() => c.classList.remove('is-hi'), 1700); };
  document.addEventListener('pointerover', (e) => { const c = e.target.closest?.('.cast'); if (c) hi(c); });
  document.addEventListener('click', (e) => { const g = e.target.closest?.('.ghurza'); if (g) { g.classList.remove('is-pop'); void g.getBoundingClientRect(); g.classList.add('is-pop'); } });

  /* ---- the needle that sews its way down the page ---- */
  const main = document.querySelector('main[data-sew]');
  if (main && !reduced) {
    const NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'sew'); svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = `<defs><mask id="sew-m" maskUnits="userSpaceOnUse"><path class="sew__mask" fill="none" stroke="#fff" stroke-width="10"/></mask></defs><path class="sew__thread" fill="none" mask="url(#sew-m)"/><g class="sew__needle">${P.needle(0, 0, 0.7, 0)}</g>`;
    main.append(svg);
    const thread = svg.querySelector('.sew__thread'), mask = svg.querySelector('.sew__mask'), needle = svg.querySelector('.sew__needle');
    let len = 0, ok = false, raf = 0;
    const layout = () => {
      const w = main.clientWidth, h = main.scrollHeight, gut = main.querySelector('.wrap').getBoundingClientRect().left;
      ok = w >= 1240 && gut >= 34; svg.style.display = ok ? '' : 'none'; if (!ok) return;
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`); svg.style.height = h + 'px';
      const xr = w - gut / 2, xl = gut / 2, secs = $$(':scope > section', main).slice(1).map((s) => s.offsetTop), r = 26;
      let d = `M${xr} ${secs[0] - 120}`, side = 1;
      secs.forEach((y) => { const x0 = side ? xr : xl, x1 = side ? xl : xr, dir = side ? -1 : 1; d += `V${y - r}Q${x0} ${y} ${x0 + dir * r} ${y}H${x1 - dir * r}Q${x1} ${y} ${x1} ${y + r}`; side ^= 1; });
      d += `V${h - 40}`;
      thread.setAttribute('d', d); mask.setAttribute('d', d); len = thread.getTotalLength();
      mask.style.strokeDasharray = len; update();
    };
    const lenAtY = (y) => { let lo = 0, hi = len; for (let i = 0; i < 18; i++) { const m = (lo + hi) / 2; if (thread.getPointAtLength(m).y < y) lo = m; else hi = m; } return lo; };
    const update = () => {
      raf = 0; if (!ok || !len) return;
      const y = scrollY - main.offsetTop + innerHeight * 0.62, l = Math.max(0, Math.min(len, lenAtY(y)));
      mask.style.strokeDashoffset = len - l;
      const p = thread.getPointAtLength(l), q = thread.getPointAtLength(Math.min(len, l + 2)), ang = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI - 90;
      needle.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${ang})`);
    };
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
    new ResizeObserver(layout).observe(main); layout();
  }
})();
