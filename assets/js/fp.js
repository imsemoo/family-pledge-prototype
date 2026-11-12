/* ميثاق العائلة — shared behaviour. No dependencies. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FP = (window.FP = { reduced });

  /* ---- loader: it covers the page while the next one is fetched, then lifts ---- */
  const loader = $('.loader');
  const still = new URLSearchParams(location.search).has('noloader');   // for captures: no loader, nothing waiting to be scrolled to
  if (loader && still) loader.remove();
  if (still) addEventListener('load', () => document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('in')));
  else if (loader) {
    const t0 = performance.now(), first = !sessionStorage.getItem('fp-seen');
    let opened = false;
    const open = () => {
      if (opened) return; opened = true;
      const wait = Math.max(0, (first ? 950 : 420) - (performance.now() - t0));
      // the cover lifts only once the page is in the visitor's language
      Promise.resolve(window.FPI18N?.ready).then(() => setTimeout(() => { loader.classList.remove('leaving'); loader.classList.add('done'); sessionStorage.setItem('fp-seen', '1'); }, wait));
    };
    if (document.readyState !== 'loading') open(); else addEventListener('DOMContentLoaded', open, { once: true });
    setTimeout(open, 2600);
    // coming back with the browser's Back button: the page is restored as it was left, so lift the cover
    addEventListener('pageshow', (e) => { if (e.persisted) { loader.classList.remove('leaving'); loader.classList.add('done'); } });
    FP.leave = (url) => { loader.classList.remove('done'); loader.classList.add('leaving'); setTimeout(() => { location.href = url; }, reduced ? 0 : 470); };
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target === '_blank' || a.hasAttribute('download') || a.dataset.lang) return;
      const u = new URL(a.href, location.href);
      if (u.origin !== location.origin || !/^https?:$/.test(u.protocol)) return;
      if (u.pathname === location.pathname && u.search === location.search) return; // a jump inside this page
      e.preventDefault(); FP.leave(a.href);
    });
  }

  /* ---- reveal on scroll ---- */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  $$('[data-reveal]').forEach((el) => io.observe(el));
  $$('[data-stagger]').forEach((g) => [...g.children].forEach((c, i) => c.style.setProperty('--i', i)));

  /* ---- header ---- */
  const header = $('.header'), toTop = $('.to-top');
  const onScroll = () => { header?.classList.toggle('scrolled', scrollY > 8); toTop?.classList.toggle('show', scrollY > 900); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  toTop?.addEventListener('click', () => scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));

  const sheet = $('.sheet'), menuBtn = $('.menu-btn');
  if (sheet && menuBtn) {
    const set = (open) => {
      sheet.classList.toggle('open', open); menuBtn.setAttribute('aria-expanded', open);
      document.documentElement.style.overflow = open ? 'hidden' : '';
      sheet.inert = !open;
      if (open) $('.sheet__close', sheet).focus(); else menuBtn.focus();
    };
    sheet.inert = true;
    menuBtn.addEventListener('click', () => set(true));
    $('.sheet__close', sheet).addEventListener('click', () => set(false));
    sheet.addEventListener('click', (e) => { if (e.target.closest('nav a')) set(false); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && sheet.classList.contains('open')) set(false); });
  }

  $$('.lang').forEach((l) => {
    const b = $('button', l);
    const set = (o) => { l.classList.toggle('open', o); b.setAttribute('aria-expanded', o); };
    b.addEventListener('click', (e) => { e.stopPropagation(); set(!l.classList.contains('open')); });
    document.addEventListener('click', () => set(false));
    l.addEventListener('keydown', (e) => { if (e.key === 'Escape') { set(false); b.focus(); } });
  });

  /* ---- toast ---- */
  FP.toast = (msg, kind = 'ok', ms = 3600) => {
    let box = $('.toasts');
    if (!box) { box = document.createElement('div'); box.className = 'toasts'; box.setAttribute('role', 'status'); box.setAttribute('aria-live', 'polite'); document.body.append(box); }
    const t = document.createElement('div'); t.className = 'toast'; t.dataset.kind = kind;
    t.innerHTML = '<span class="stitch"></span><span></span>'; t.lastChild.textContent = msg; box.append(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, ms);
  };

  /* ---- counters ---- */
  const nf = new Intl.NumberFormat('en-US');
  const cio = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, to = +el.dataset.count;
    if (reduced) { el.textContent = nf.format(to); return; }
    const t0 = performance.now(), dur = 1400;
    const step = (t) => { const p = Math.min(1, (t - t0) / dur), v = 1 - Math.pow(1 - p, 4); el.textContent = nf.format(Math.round(to * v)); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: 0.6 });
  $$('[data-count]').forEach((el) => { el.textContent = '0'; cio.observe(el); });

  /* ---- carousel (scroll-snap; buttons are RTL-aware) ---- */
  $$('[data-carousel]').forEach((c) => {
    const track = $('[data-track]', c), prev = $('[data-prev]', c), next = $('[data-next]', c);
    const rtl = getComputedStyle(track).direction === 'rtl';
    const stepBy = (dir) => { const card = track.firstElementChild; const w = card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0); track.scrollBy({ left: dir * w * (rtl ? -1 : 1), behavior: reduced ? 'auto' : 'smooth' }); };
    const sync = () => { const max = track.scrollWidth - track.clientWidth - 2, x = Math.abs(track.scrollLeft); prev.disabled = x <= 2; next.disabled = x >= max; };
    prev.addEventListener('click', () => stepBy(-1)); next.addEventListener('click', () => stepBy(1));
    track.addEventListener('scroll', sync, { passive: true }); addEventListener('resize', sync); sync();
  });

  /* ---- clamp toggles ---- */
  $$('[data-more]').forEach((b) => {
    const p = b.previousElementSibling;
    requestAnimationFrame(() => { if (p.scrollHeight <= p.clientHeight + 2) b.hidden = true; });
    b.addEventListener('click', () => { const open = p.classList.toggle('open'); b.textContent = open ? 'عرض أقل' : 'اقرأ المزيد'; b.setAttribute('aria-expanded', open); });
  });

  /* ---- dialogs ---- */
  $$('[data-open]').forEach((b) => b.addEventListener('click', () => $('#' + b.dataset.open)?.showModal()));
  $$('dialog.modal').forEach((d) => {
    d.addEventListener('click', (e) => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
  });

  /* ---- newsletter: validates, and says plainly that the prototype sends nothing ---- */
  $$('form[data-newsletter]').forEach((f) => {
    const input = $('input', f), msg = $('.field__msg', f.parentElement), btn = $('button', f);
    const say = (text, state) => { msg.textContent = text; msg.dataset.state = state; };
    input.addEventListener('input', () => { if (input.getAttribute('aria-invalid')) { input.removeAttribute('aria-invalid'); say('', ''); } });
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = input.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { input.setAttribute('aria-invalid', 'true'); say('اكتب بريدا صحيحا، مثل name@example.com', 'error'); input.focus(); return; }
      btn.classList.add('is-busy');
      setTimeout(() => { btn.classList.remove('is-busy'); say('البريد صحيح. هذه نسخة عرض، والاشتراك الفعلي يتم بعد ربطها بالموقع.', 'ok'); FP.toast('نسخة عرض: لم يرسل شيء بعد.'); f.reset(); }, 700);
    });
  });

  /* ---- the cloth: a tatreez band drawn from the logo's rounded diamond ----
     opts.unsewn: columns left open at the far end; the first open stitch is "yours". */
  const C = { rose: '#e087a6', rose7: '#b03a62', roseL: '#f8bdd4', teal: '#409db7', teal7: '#1f6079', ink: '#10303b', light: '#f4b740' };
  const motif = (x, y, rows) => {
    const mid = (rows - 1) / 2, P = 16, tx = ((x % P) + P) % P, dx = Math.abs(tx - 8), dy = Math.abs(y - mid), d = dx + dy, m = Math.max(dx, dy);
    if (y === 0 || y === rows - 1) return 'teal7';
    if (y === 1 || y === rows - 2) return x % 2 ? null : 'rose';
    if (dy > mid - 2) return null;
    if (d === 0) return 'light';
    if (d <= 1) return 'rose7';
    if (d === 3) return 'teal';
    if (dx === dy && dx >= 2 && dx <= 3) return 'rose';
    if (d === 5 && m >= 4) return 'teal7';
    if (d === 4 && m === 4) return 'rose7';
    if (tx === 0) return dy % 2 ? 'roseL' : 'teal';
    return null;
  };
  FP.band = (canvas, opts = {}) => {
    const ctx = canvas.getContext('2d'), dark = opts.dark, unsewn = opts.unsewn || 0;
    let w, h, s, cols, rows, dpr, t0 = 0, sewn = false, pointer = null, raf = 0, visible = true;
    const palette = dark ? { ...C, ink: '#ffffff', teal7: '#7fc4d8', rose7: '#f2aec7', empty: 'rgba(255,255,255,.07)' } : { ...C, empty: '#e6eef1' };
    const size = () => {
      const r = canvas.getBoundingClientRect(); dpr = Math.min(devicePixelRatio || 1, 2);
      w = r.width; h = r.height; rows = opts.rows || 13; s = h / rows; cols = Math.ceil(w / s) + 1;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); draw(performance.now());
    };
    const diamond = (cx, cy, a, fill, alpha = 1) => {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.PI / 4); ctx.globalAlpha = alpha; ctx.fillStyle = fill;
      ctx.beginPath(); ctx.roundRect(-a / 2, -a / 2, a, a, a * 0.28); ctx.fill(); ctx.restore();
    };
    const draw = (now) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
      const a0 = s * 0.64, el = sewn ? Infinity : t0 ? now - t0 : 0, per = 9; // ms per column
      let busy = false;
      for (let c = 0; c < cols; c++) {
        const cx = w - (c + 0.5) * s, open = c >= cols - 1 - unsewn;
        for (let r = 0; r < rows; r++) {
          const cy = (r + 0.5) * s, key = motif(c, r, rows);
          let k = 1;
          if (!sewn) { const d = el - (c * per + r * 14); k = d <= 0 ? 0 : d >= 320 ? 1 : 1 - Math.pow(1 - d / 320, 3); if (k < 1) busy = true; }
          let a = a0, boost = 0;
          if (pointer) { const dist = Math.hypot(pointer.x - cx, pointer.y - cy); if (dist < 70) { boost = 1 - dist / 70; a = a0 * (1 + boost * 0.35); } }
          if (open || !key) { diamond(cx, cy, a0 * 0.42, palette.empty, 1); if (!open && boost > 0.1) diamond(cx, cy, a * 0.5, palette.teal, boost * 0.5); continue; }
          if (k > 0) diamond(cx, cy, a * (0.4 + 0.6 * k), palette[key], k);
          else diamond(cx, cy, a0 * 0.42, palette.empty, 1);
        }
      }
      if (unsewn) { // the next stitch, waiting
        const c = cols - 1 - unsewn, r = Math.floor(rows / 2), cx = w - (c + 0.5) * s, cy = (r + 0.5) * s, p = FP.reduced ? 1 : 0.5 + 0.5 * Math.sin(now / 420);
        diamond(cx, cy, a0 * (1.5 + p * 0.5), palette.light, 0.25); diamond(cx, cy, a0 * 1.15, palette.light, 1);
        canvas.dispatchEvent(new CustomEvent('fp:yours', { detail: { x: cx, y: cy } }));
        busy = busy || !FP.reduced;
      }
      if ((busy || pointer) && visible) raf = requestAnimationFrame(draw); else { raf = 0; if (!sewn && t0) sewn = true; }
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(draw); };
    new ResizeObserver(size).observe(canvas);
    new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible) kick(); }).observe(canvas);
    if (FP.reduced) sewn = true;
    else new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { t0 = performance.now(); o.disconnect(); kick(); } }, { threshold: 0.3 }).observe(canvas);
    if (opts.interactive && matchMedia('(hover: hover)').matches) {
      canvas.addEventListener('pointermove', (e) => { const r = canvas.getBoundingClientRect(); pointer = { x: e.clientX - r.left, y: e.clientY - r.top }; kick(); });
      canvas.addEventListener('pointerleave', () => { pointer = null; kick(); });
    }
  };
  $$('canvas[data-band]').forEach((c) => FP.band(c, { rows: +c.dataset.rows || 13, dark: c.dataset.band === 'dark', unsewn: +c.dataset.unsewn || 0, interactive: c.hasAttribute('data-interactive') }));
})();

/* the closing call: a family that already gave its name sees it on the sheet (read from this browser only) */
(() => {
  const el = document.querySelector('[data-call-name]'); if (!el) return;
  let n = ''; try { n = (localStorage.getItem('fp-family') || '').trim(); } catch { /* private mode */ }
  if (n) { el.textContent = n.slice(0, 14); el.setAttribute('data-no-i18n', ''); }
})();
