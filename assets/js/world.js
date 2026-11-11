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
    });
  }

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
})();
