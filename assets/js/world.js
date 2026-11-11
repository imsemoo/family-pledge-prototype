/* ميثاق العائلة — scenes built from the cast and props, and how they react.
   Needs cast.js. Each [data-scene] element is filled with one SVG scene. */
(() => {
  'use strict';
  const C = window.Cast, P = C.props, sprite = C.sprite, dia = C.dia;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const S = {};

  /* ---- hero: a stitch of light travels the grandmother's thread, and the cloth drifts with the pointer ---- */
  const heroEl = document.querySelector('.hero'), thread = document.querySelector('#hero-thread');
  if (heroEl && thread && !reduced) {
    const run = heroEl.querySelector('.hero__run'), len = thread.getTotalLength();
    run.innerHTML = [0, 1].map(() => dia(0, 0, 11, '#f4b740')).join('');
    const dots = [...run.children]; let on = false, raf = 0;
    const tick = (now) => {
      dots.forEach((d, i) => { const t = (now / 7000 + i / 2) % 1, p = thread.getPointAtLength(len * t); d.setAttribute('transform', `translate(${p.x.toFixed(1)} ${(p.y - 3).toFixed(1)}) rotate(45)`); d.setAttribute('opacity', (Math.sin(t * Math.PI) * 0.95).toFixed(2)); });
      if (on) raf = requestAnimationFrame(tick);
    };
    new IntersectionObserver((es) => { on = es[0].isIntersecting; cancelAnimationFrame(raf); if (on) raf = requestAnimationFrame(tick); }).observe(heroEl);
    if (matchMedia('(hover: hover)').matches) {
      let tx = 0, cur = 0, raf2 = 0;
      const step = () => { cur += (tx - cur) * 0.07; heroEl.style.setProperty('--px', cur.toFixed(4)); raf2 = Math.abs(tx - cur) > 0.002 ? requestAnimationFrame(step) : 0; };
      heroEl.addEventListener('pointermove', (e) => { tx = e.clientX / innerWidth - 0.5; if (!raf2) raf2 = requestAnimationFrame(step); });
    }
  }

  /* ---- painted scenes: one picture each, sitting on the identity's own thread ---- */
  const pic = (name, alt, w, h, cls = '') => `<img class="pic ${cls}" src="assets/img/scenes/${name}.webp" alt="${alt}" width="${w}" height="${h}" loading="lazy" decoding="async">`;
  const onThread = (inner) => `<span class="pic-stage">${inner}<i class="pic-thread"></i></span>`;
  S.step1 = (el) => { el.innerHTML = onThread(pic('step-sign', 'أب وأم يوقعان ورقة على طاولة، وابنهما الصغير يقف على أطراف أصابعه ليرى', 386, 520)); };
  S.step2 = (el) => { el.innerHTML = onThread(pic('step-frame', 'جدة وحفيدتها تنظران بفخر إلى وثيقة معلقة في إطار، والحفيدة تشير إليها', 322, 520)); };
  S.step3 = (el) => { el.innerHTML = onThread(pic('step-bag', 'طفلة وأخوها الصغير يفتحان حقيبة قماشية فيها كتب وبطاقات وقنديل', 467, 399)); };
  S.bag = (el) => { el.innerHTML = `<span class="bag-art">${pic('bag', 'حقيبة قماشية مفتوحة تتطاير منها كتب وبطاقات وسماعات وميكروفون وقنديل', 544, 760, 'float-slow')}</span>`; };
  S.goal1 = (el) => { el.innerHTML = pic('vow-lantern', 'قنديل مضاء معلق فوق كتابين مفتوحين', 191, 480); };
  S.goal2 = (el) => { el.innerHTML = pic('vow-embrace', 'أم تحتضن صغيرها وهما يبتسمان', 310, 480); };
  S.goal3 = (el) => { el.innerHTML = pic('vow-dome', 'قبة الصخرة وبجانبها شجرة زيتون معمرة', 449, 480); };
  S.sewer = (el) => { el.innerHTML = pic('sewer', '', 407, 560); };

  /* ---- the game's night, as a teaser ---- */
  S.night = (el) => {
    const lan = [[60, 62, 0.9, 1], [150, 84, 1.1, 0], [250, 58, 0.85, 1], [338, 90, 1.05, 1]];
    el.innerHTML = `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
      <path d="M-10 22Q200 58 410 22" fill="none" stroke="#7fc4d8" stroke-width="2.4" stroke-dasharray="8 7" stroke-linecap="round" opacity=".8"/>
      ${lan.map(([x, yy, s, lit], i) => `<g class="lan-swing" style="--i:${i};transform-origin:${x}px ${yy - 34 * s}px"><path d="M${x} 30V${yy - 30 * s}" stroke="#5fa9bf" stroke-width="1.6"/>${P.lantern(x, yy, s, !!lit)}</g>`).join('')}</svg>` +
      pic('lantern-kids', 'طفلة وأخوها يرفعان قنديلين مضاءين', 350, 560, 'night-kids');
  };

  S.guide = (el) => { el.innerHTML = sprite({ mood: el.dataset.mood || 'happy', fill: el.dataset.fill || '#f4b740', tail: el.dataset.tail !== 'no' }); };

  /* ---- the closing scene: the logo, alive ---- */
  S.call = (el) => {
    el.innerHTML = `<svg class="call__arcs" viewBox="0 0 400 400" aria-hidden="true"><g class="arcs"><path d="M96 62A170 170 0 0 1 368 214" fill="none" stroke="#f2aec7" stroke-width="22" stroke-linecap="round"/><path d="M304 338A170 170 0 0 1 32 186" fill="none" stroke="#409db7" stroke-width="22" stroke-linecap="round"/></g></svg><img class="call__people" src="assets/img/hero/family-a.webp" alt="العائلة مجتمعة تلوح، داخل قوسي الشعار" width="644" height="660" loading="lazy" decoding="async">`;
  };

  const mount = (el) => S[el.dataset.scene]?.(el);
  $$('[data-scene]').forEach(mount);

  /* «غرزة» pops when tapped */
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
