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

  /* ---- the shelf: six real episodes, each with its own picture ---- */
  const shelf = $('[data-shelf]');
  if (shelf) {
    const T = [[2, 'المسجد العمري: لم يبق منه إلا مئذنة'], [4, 'زوارق غزة: كيف يمنع البحر أن يكون بحرا'], [5, 'الأطراف المبتورة: هل نركض بدونها؟'], [7, 'المخيمات أصل الحكاية'], [12, 'جد الزيتون'], [15, 'العلم الفلسطيني']];
    shelf.innerHTML = T.map(([n, t], i) => `<li data-reveal style="--i:${i}"><a class="tale" href="${shelf.dataset.shelf}"><span class="tale__pic"><img src="assets/img/world/tale-${String(n).padStart(2, '0')}.webp" alt="" width="720" height="720" loading="lazy" decoding="async"></span><h3>${t}</h3></a></li>`).join('');
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.15 });
    [...shelf.children].forEach((li) => io.observe(li));
  }
})();
