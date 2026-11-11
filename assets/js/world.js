/* ميثاق العائلة — «بين يدين»: the hero's signing moment and the stories list. No dependencies. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- hero: the hands close around the deed; the visitor signs it ---- */
  const stage = $('.stage');
  if (stage) {
    const deed = $('.deed', stage), input = $('input', deed), msg = $('.deed__msg', deed), btn = $('button', deed), hero = stage.closest('.hero');
    requestAnimationFrame(() => stage.classList.add('is-in'));

    if (!reduced && matchMedia('(hover: hover)').matches) {
      let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
      const step = () => { cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08; hero.style.setProperty('--px', cx.toFixed(4)); hero.style.setProperty('--py', cy.toFixed(4)); raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.003 ? requestAnimationFrame(step) : 0; };
      hero.addEventListener('pointermove', (e) => { const r = hero.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - 0.5; ty = (e.clientY - r.top) / r.height - 0.5; if (!raf) raf = requestAnimationFrame(step); });
      hero.addEventListener('pointerleave', () => { tx = ty = 0; if (!raf) raf = requestAnimationFrame(step); });
    }

    /* the hands tighten while the name is being written */
    input.addEventListener('focus', () => stage.classList.add('is-held'));
    input.addEventListener('blur', () => stage.classList.remove('is-held'));
    input.addEventListener('input', () => { if (input.getAttribute('aria-invalid')) { input.removeAttribute('aria-invalid'); msg.textContent = ''; } });

    deed.addEventListener('submit', (e) => {
      if (stage.classList.contains('is-signed')) return; // second press goes on to the real pledge page
      e.preventDefault();
      const name = input.value.trim();
      if (name.length < 2) { input.setAttribute('aria-invalid', 'true'); msg.textContent = 'اكتب اسم عائلتك أولا.'; input.focus(); return; }
      input.readOnly = true; input.blur();
      stage.classList.add('is-signed', 'is-held');
      setTimeout(() => stage.classList.remove('is-held'), 1500);
      btn.innerHTML = '<span class="stitch"></span>أكمل في صفحة الميثاق';
      msg.style.color = 'var(--ok)'; msg.textContent = 'اسم العائلة يبقى هنا فقط، ولا يرسل مع الانتقال.';
      window.FP?.toast?.(`ميثاق عائلة ${name} جاهز للتوقيع`);
      const next = $('[data-next]'); if (next) { next.textContent = `عائلة ${name}`; next.closest('li').classList.add('is-signed'); }
    });
  }

  /* ---- single signatures on the hero's sheets and register: the gesture only, never a name ---- */
  const oneSig = (seed) => {
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647; rnd();
    const n = 3 + Math.floor(rnd() * 2); let x = 95, d = `M${x} ${18 + rnd() * 8}`;
    for (let k = 0; k < n; k++) { const w = 15 + rnd() * 11, up = -10 + rnd() * 12, dn = 36 + rnd() * 12; d += `C${(x + w * 0.1).toFixed(1)} ${up.toFixed(1)} ${(x - w * 0.9).toFixed(1)} ${dn.toFixed(1)} ${(x - w).toFixed(1)} ${(14 + rnd() * 10).toFixed(1)}`; x -= w; }
    return `<path d="${d}M${(x + 14).toFixed(1)} 39H${Math.max(5, x - 6 - rnd() * 10).toFixed(1)}"/>`;
  };
  document.querySelectorAll('svg[data-sig]').forEach((el) => { el.innerHTML = oneSig(+el.dataset.sig * 91); });

  /* ---- the register: a wall of signatures. No names, only the gesture of signing ---- */
  const wall = $('[data-wall]');
  if (wall) {
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const sig = (i) => {
      const n = 3 + Math.floor(rnd() * 2); let x = 95, d = `M${x} ${18 + rnd() * 8}`;
      for (let k = 0; k < n; k++) { const w = 15 + rnd() * 11, up = -10 + rnd() * 12, dn = 36 + rnd() * 12; d += `C${(x + w * 0.1).toFixed(1)} ${up.toFixed(1)} ${(x - w * 0.9).toFixed(1)} ${dn.toFixed(1)} ${(x - w).toFixed(1)} ${(14 + rnd() * 10).toFixed(1)}`; x -= w; }
      d += `M${(x + 14).toFixed(1)} 39H${Math.max(5, x - 6 - rnd() * 10).toFixed(1)}`;
      return `<svg viewBox="0 0 100 42" style="--i:${i}"><path d="${d}"/></svg>`;
    };
    const fill = () => { const cols = wall.clientWidth < 380 ? 3 : wall.clientWidth < 560 ? 4 : 5; wall.style.setProperty('--cols', cols); seed = 7; wall.innerHTML = Array.from({ length: cols * 3 }, (_, i) => sig(i)).join(''); };
    let lastW = 0; new ResizeObserver(() => { if (Math.abs(wall.clientWidth - lastW) > 40) { lastW = wall.clientWidth; fill(); } }).observe(wall); fill();
  }

  /* ---- the reel: one episode on stage, six on the strip. It moves on by itself and waits while you look. ---- */
  const reel = $('[data-reel]');
  if (reel) {
    const T = [[2, 'المسجد العمري: لم يبق منه إلا مئذنة'], [4, 'زوارق غزة: كيف يمنع البحر أن يكون بحرا'], [5, 'الأطراف المبتورة: هل نركض بدونها؟'], [7, 'المخيمات أصل الحكاية'], [12, 'جد الزيتون'], [15, 'العلم الفلسطيني']];
    const two = (n) => String(n).padStart(2, '0'), src = (n) => `assets/img/world/tale-${two(n)}.webp`, href = reel.dataset.reel;
    reel.innerHTML = `
      <div class="reel__stage">
        <a class="reel__pic" href="${href}" aria-label="استمع إلى الحلقة">${T.map(([n], i) => `<img src="${src(n)}" alt="" width="720" height="720" ${i ? 'loading="lazy"' : ''} decoding="async" draggable="false">`).join('')}</a>
        <div class="reel__info">
          <p class="reel__kicker"><svg class="ic"><use href="#i-mic"/></svg>من حلقات البودكاست</p>
          <p class="reel__no num" aria-hidden="true"><b data-no>01</b><span>/ ${two(T.length)}</span></p>
          <h3 class="reel__name" data-name aria-live="polite"></h3>
          <div class="reel__act">
            <a class="btn" href="${href}"><span class="stitch"></span>استمع إلى الحلقة</a>
            <div class="arrows">
              <button type="button" data-prev aria-label="الحلقة السابقة"><svg class="ic"><use href="#i-right"/></svg></button>
              <button type="button" data-next aria-label="الحلقة التالية"><svg class="ic"><use href="#i-left"/></svg></button>
            </div>
          </div>
        </div>
      </div>
      <ol class="reel__strip">${T.map(([n, t], i) => `<li><button type="button" class="reel__thumb" data-i="${i}" aria-label="الحلقة ${i + 1}: ${t}"><span class="reel__bar"><i></i></span><img src="${src(n)}" alt="" width="720" height="720" loading="lazy" decoding="async"><span class="reel__t"><small class="num">${two(i + 1)}</small>${t}</span></button></li>`).join('')}</ol>`;

    const pics = [...reel.querySelectorAll('.reel__pic img')], thumbs = [...reel.querySelectorAll('.reel__thumb')], no = $('[data-no]', reel), name = $('[data-name]', reel), info = $('.reel__info', reel), strip = $('.reel__strip', reel);
    let at = -1;
    const show = (i, byUser) => {
      i = (i + T.length) % T.length; if (i === at) return; at = i;
      pics.forEach((p, k) => p.classList.toggle('on', k === i));
      thumbs.forEach((b, k) => { b.classList.toggle('on', k === i); b.setAttribute('aria-current', k === i); });
      no.textContent = two(i + 1); name.textContent = T[i][1];
      if (!reduced) { info.classList.remove('swap'); void info.offsetWidth; info.classList.add('swap'); }
      // keep the active thumb in view on a phone, without moving the page
      const b = thumbs[i], s = strip.getBoundingClientRect(), r = b.getBoundingClientRect();
      if (r.left < s.left || r.right > s.right) strip.scrollBy({ left: r.left - s.left - (s.width - r.width) / 2, behavior: reduced || !byUser ? 'auto' : 'smooth' });
    };
    $('[data-prev]', reel).addEventListener('click', () => show(at - 1, true));
    $('[data-next]', reel).addEventListener('click', () => show(at + 1, true));
    thumbs.forEach((b) => b.addEventListener('click', () => show(+b.dataset.i, true)));
    reel.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') show(at + 1, true); else if (e.key === 'ArrowRight') show(at - 1, true); });
    // the active thumb's line fills in six seconds; when it ends the next episode comes on. CSS pauses it on hover and focus.
    reel.addEventListener('animationend', (e) => { if (e.animationName === 'reel-fill') show(at + 1); });
    new IntersectionObserver((es) => es.forEach((e) => reel.classList.toggle('is-live', e.isIntersecting)), { threshold: 0.35 }).observe(reel);
    let sx = null; // a swipe on the picture
    const pic = $('.reel__pic', reel);
    pic.addEventListener('pointerdown', (e) => { sx = e.clientX; });
    pic.addEventListener('pointerup', (e) => { if (sx === null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) < 40) return; show(at + (dx > 0 ? 1 : -1), true); pic.addEventListener('click', (c) => c.preventDefault(), { once: true }); });
    show(0);
  }
  /* ---- tonight: one suggestion for the evening, from what the bag already holds ---- */
  const tonight = $('[data-tonight]');
  if (tonight) {
    const BAG = 'bag.html#podcast';
    const ep = (n, title) => ({ kicker: 'حلقة بودكاست', title, text: 'حكاية تحكيها الجدة لرائد ويافا. استمعوا إليها معا ثم تحدثوا عنها.', img: `assets/img/world/tale-${n}.webp`, href: BAG, cta: 'استمعوا الآن' });
    const q = (title) => ({ kicker: 'سؤال الليلة', title, text: 'اطرحوا السؤال على المائدة، واتركوا كل واحد يجيب بطريقته.', img: 'assets/img/world/cast-jadda-2.webp', href: 'bag.html', cta: 'حكايات تساعدكم' });
    const SETS = {
      play: [
        { kicker: 'لعبة', title: 'قناديل الأقصى', text: 'ابحثوا عن كلمات من رحاب الأقصى، وكل كلمة تضيء قنديلا.', img: 'assets/img/world/scene-lantern.webp', href: 'game/qanadeel/', cta: 'العبوا الآن' },
        { kicker: 'لعبة', title: 'منبر صلاح الدين', text: 'أعيدوا بناء المنبر قطعة بعد قطعة، وتعرفوا على أجزائه.', img: 'game/minbar/img/minbar.webp', contain: true, href: 'game/minbar/', cta: 'ابدؤوا البناء' },
        { kicker: 'لعبة', title: 'صورة وحكاية', text: 'اقلبوا البطاقات وأعيدوا كل صورة إلى عنوان حكايتها.', img: 'assets/img/world/tale-12.webp', href: 'game/album/', cta: 'افتحوا الألبوم' },
      ],
      listen: [ep('02', 'المسجد العمري: لم يبق منه إلا مئذنة'), ep('04', 'زوارق غزة: كيف يمنع البحر أن يكون بحرا'), ep('05', 'الأطراف المبتورة: هل نركض بدونها؟'), ep('07', 'المخيمات أصل الحكاية'), ep('12', 'جد الزيتون'), ep('15', 'العلم الفلسطيني')],
      ask: [q('ما أول صورة تخطر لكم عند سماع كلمة القدس؟'), q('لو زرنا المسجد الأقصى، ماذا نريد أن نرى أولا؟'), q('ماذا نعرف عن شجرة الزيتون في فلسطين؟'), q('ما معنى ألوان العلم الفلسطيني؟'), q('كيف يقضي طفل في المخيم يومه؟'), q('ماذا يستطيع بيتنا أن يفعل هذا الشهر من أجل فلسطين؟')],
    };
    const root = tonight.closest('.tonight'), modes = [...root.querySelectorAll('[data-mode]')], at = { play: 0, listen: 0, ask: 0 }; let mode = 'play';
    const T = (k) => $(`[data-t-${k}]`, tonight), pic = $('.tonight__pic', tonight);
    const show = (animate) => {
      const it = SETS[mode][at[mode]];
      T('kicker').textContent = it.kicker; T('title').textContent = it.title; T('text').textContent = it.text; T('cta').textContent = it.cta;
      T('link').href = it.href; if (/^https/.test(it.href)) { T('link').target = '_blank'; T('link').rel = 'noopener'; } else { T('link').removeAttribute('target'); T('link').removeAttribute('rel'); }
      T('img').src = it.img; pic.classList.toggle('is-contain', !!it.contain);
      if (animate && !reduced) { tonight.classList.remove('is-swap'); void tonight.offsetWidth; tonight.classList.add('is-swap'); }
    };
    modes.forEach((b) => b.addEventListener('click', () => { mode = b.dataset.mode; modes.forEach((x) => { const on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on); }); show(true); }));
    $('[data-t-next]', tonight).addEventListener('click', () => { at[mode] = (at[mode] + 1) % SETS[mode].length; show(true); });
    show(false);
  }

  /* ---- the chain: if every home invites n homes, how far does the pledge travel in three rounds ---- */
  const rounds = $('[data-rounds]');
  if (rounds) {
    const root = rounds.closest('.chain'), picks = [...root.querySelectorAll('[data-n]')], total = $('[data-total]', root), LINK = new URL('pledge.html', document.baseURI).href;
    const NAMES = ['بيتك', 'الجولة الأولى', 'الجولة الثانية', 'الجولة الثالثة'], SHOW = 30;
    const draw = (n) => {
      const counts = [1, n, n * n, n * n * n];
      rounds.innerHTML = counts.map((c, r) => `<li><small>${NAMES[r]}</small><span class="chain__homes" aria-hidden="true">${Array.from({ length: Math.min(c, SHOW) }, (_, k) => `<i style="--k:${k}"></i>`).join('')}${c > SHOW ? `<em>+${c - SHOW}</em>` : ''}</span><b class="num">${c}</b></li>`).join('');
      total.textContent = counts.reduce((a, b) => a + b, 0);
    };
    picks.forEach((b) => b.addEventListener('click', () => { picks.forEach((x) => { const on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on); }); draw(+b.dataset.n); }));
    draw(3);
    const share = $('[data-share]', root); const say = window.FPI18N?.t || ((x) => x);
    Promise.resolve(window.FPI18N?.ready).then(() => { share.href = 'https://wa.me/?text=' + encodeURIComponent(say('عائلتنا في ميثاق العائلة، عهد لنصرة أهلنا في فلسطين. انضموا معنا:') + ' ' + LINK); });
    $('[data-copy]', root).addEventListener('click', async (e) => {
      try { await navigator.clipboard.writeText(LINK); window.FP?.toast?.('نسخ رابط الميثاق'); } catch { window.FP?.toast?.(LINK); }
      e.currentTarget.blur();
    });
  }
})();
