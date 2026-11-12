/* ميثاق العائلة — inner pages. Nothing typed on these pages is stored or sent anywhere. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const toast = (t) => window.FP?.toast?.(t);

  /* ================= signing page: three steps, and the certificate fills in as you type ================= */
  const flow = $('[data-flow]');
  if (flow) {
    const panes = $$('.pane', flow), steps = $$('.steps li', flow), cert = $('.cert'), done = $('[data-done]', flow);
    const name = $('#f-name'), country = $('#f-country'), fillName = $('[data-fill="name"]'), fillCountry = $('[data-fill="country"]');
    let at = 0;
    const clean = (v) => v.trim().replace(/\s+/g, ' ');
    const fill = (el, value, placeholder) => {
      const v = clean(value); el.textContent = v || placeholder; el.classList.toggle('is-empty', !v);
      if (v && !reduced) { el.classList.remove('is-pop'); void el.offsetWidth; el.classList.add('is-pop'); }
    };
    name.addEventListener('input', () => { fill(fillName, name.value, 'اسم عائلتكم'); name.removeAttribute('aria-invalid'); $('#m-name').textContent = ''; });
    country.addEventListener('input', () => { fill(fillCountry, country.value, 'دولتكم'); country.removeAttribute('aria-invalid'); $('#m-country').textContent = ''; });

    const go = (i) => {
      at = i; panes.forEach((p, k) => (p.hidden = k !== i));
      steps.forEach((s, k) => { s.classList.toggle('is-now', k === i); s.classList.toggle('is-done', k < i); if (k === i) s.setAttribute('aria-current', 'step'); else s.removeAttribute('aria-current'); });
      const first = $('input, button', panes[i]); if (first) first.focus({ preventScroll: true });
      if (matchMedia('(max-width: 900px)').matches) flow.scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' });
    };
    const bad = (input, msg, text) => { input.setAttribute('aria-invalid', 'true'); msg.textContent = text; input.focus(); return false; };
    const valid = [
      () => {
        if ([...clean(name.value)].length < 2) return bad(name, $('#m-name'), 'اكتبوا اسم العائلة، حرفان على الأقل.');
        if ([...clean(country.value)].length < 2) return bad(country, $('#m-country'), 'اكتبوا اسم الدولة.');
        return true;
      },
      () => true,
      () => { const all = $$('.vowcheck input', flow).every((c) => c.checked); if (!all) { $('#m-vows').textContent = 'ضعوا علامة على البنود الثلاثة لتختموا الميثاق.'; } return all; },
    ];
    flow.addEventListener('click', (e) => {
      const b = e.target.closest('[data-step]'); if (!b) return;
      const dir = b.dataset.step;
      if (dir === 'back') return go(Math.max(0, at - 1));
      if (!valid[at]()) return;
      if (at < panes.length - 1) return go(at + 1);
      seal();
    });
    flow.addEventListener('submit', (e) => e.preventDefault());
    flow.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.matches('input[type=text]')) { e.preventDefault(); $('[data-step="next"]', panes[at])?.click(); } });
    $$('.vowcheck input', flow).forEach((c) => c.addEventListener('change', () => ($('#m-vows').textContent = '')));

    /* what each kind of signature includes */
    const sync = () => { const free = $('input[name="plan"]:checked', flow).value === 'free'; $$('[data-paid]', flow).forEach((li) => (li.hidden = free)); };
    $$('input[name="plan"]', flow).forEach((r) => r.addEventListener('change', sync)); sync();

    const seal = () => {
      panes.forEach((p) => (p.hidden = true)); steps.forEach((s) => { s.classList.add('is-done'); s.classList.remove('is-now'); });
      done.hidden = false; cert.classList.add('is-sealed');
      $('[data-done-name]', done).textContent = clean(name.value);
      const paid = $('input[name="plan"]:checked', flow).value !== 'free';
      $('[data-done-plan]', done).textContent = paid ? 'اخترتم التوقيع مع تعهد بعشرة دولارات شهريا لمدة عام. الدفع يتم في صفحة الميثاق على المنصة.' : 'اخترتم التوقيع المجاني. يكتمل تسجيله في صفحة الميثاق على المنصة.';
      $('[data-wa]', done).href = 'https://wa.me/?text=' + encodeURIComponent((window.FPI18N?.t || ((x) => x))('عائلتنا في ميثاق العائلة، عهد لنصرة أهلنا في فلسطين. انضموا معنا:') + ' ' + new URL('pledge.html', document.baseURI).href);
      toast(`ختم ميثاق عائلة ${clean(name.value)}`); $('h2', done).focus?.();
    };

    /* the keepsake: the same document, drawn on this device */
    const img = (src) => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
    $('[data-download]', done).addEventListener('click', async (e) => {
      const btn = e.currentTarget; btn.classList.add('is-busy');
      try {
        const [doc, mark] = await Promise.all([img('assets/img/certificate.webp'), img('assets/img/world/seal-mark.webp'), document.fonts.load('700 60px "Aref Ruqaa"')]);
        const c = document.createElement('canvas'); c.width = doc.naturalWidth; c.height = doc.naturalHeight; const x = c.getContext('2d'), W = c.width, H = c.height;
        x.drawImage(doc, 0, 0); x.direction = 'rtl'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#1f6079'; x.font = `700 ${Math.round(W * 0.036)}px "Aref Ruqaa", serif`;
        const cx = W * (0.126 + 0.618 / 2);
        x.fillText(clean(name.value), cx, H * (0.704 + 0.028), W * 0.58); x.fillText(clean(country.value), cx, H * (0.779 + 0.028), W * 0.58);
        const s = W * 0.15, sx = W * 0.82 + s / 2, sy = H * 0.67 + s / 2;
        x.save(); x.translate(sx, sy); x.rotate(-0.21); x.fillStyle = '#fff'; x.strokeStyle = '#b03a62'; x.lineWidth = s * 0.022; x.beginPath(); x.arc(0, 0, s * 0.48, 0, Math.PI * 2); x.fill(); x.stroke();
        const mw = s * 0.5, mh = mw * (mark.naturalHeight / mark.naturalWidth); x.drawImage(mark, -mw / 2, -mh / 2, mw, mh); x.restore();
        const blob = await new Promise((ok) => c.toBlob(ok, 'image/png'));
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'family-pledge.png'; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
        toast('نزلت الوثيقة على جهازكم');
      } catch { toast('تعذر تجهيز الوثيقة. حاولوا مرة أخرى.'); }
      btn.classList.remove('is-busy');
    });
    $('[data-again]', done).addEventListener('click', () => { done.hidden = true; cert.classList.remove('is-sealed'); go(0); });
    go(0); window.scrollTo(0, 0);
  }
})();

/* contact form: a demo, the message is not sent from this page */
(() => {
  const f = document.querySelector('[data-contact]'); if (!f) return;
  const msg = f.querySelector('#c-msg'), name = f.querySelector('#c-name'), mail = f.querySelector('#c-mail'), text = f.querySelector('#c-text');
  [name, mail, text].forEach((el) => el.addEventListener('input', () => { el.removeAttribute('aria-invalid'); msg.textContent = ''; }));
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    const bad = (el, t) => { el.setAttribute('aria-invalid', 'true'); msg.textContent = t; el.focus(); };
    if (name.value.trim().length < 2) return bad(name, 'اكتبوا اسمكم.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail.value.trim())) return bad(mail, 'اكتبوا بريدا صحيحا، مثل name@example.com');
    if (text.value.trim().length < 10) return bad(text, 'اكتبوا رسالتكم، عشرة أحرف على الأقل.');
    window.FP?.toast?.('نموذج تجريبي: الرسالة لم ترسل. راسلونا على info@familypledge.com');
  });
})();

/* the picture story: a book of leaves on a wide screen, a row of pages that snaps on a narrow one.
   Arrows, thumbnails, chapters, keys and a press on the page all go through go(page). */
(() => {
  const rd = document.querySelector('[data-reader]'); if (!rd) return;
  const book = rd.querySelector('[data-book]'), view = rd.querySelector('[data-view]');
  const leaves = [...book.querySelectorAll('.leaf')], faces = [...book.querySelectorAll('.face')];
  const thumbs = [...rd.querySelectorAll('.rd__thumb')], chips = [...rd.querySelectorAll('.rd__chapters button')];
  const prev = rd.querySelector('[data-prev]'), next = rd.querySelector('[data-next]'), no = rd.querySelector('[data-rd-no]');
  const N = faces.length, L = leaves.length, narrow = matchMedia('(max-width: 820px)');
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  let page = 0, turned = -1;

  const settle = () => leaves.forEach((l, i) => { l.style.zIndex = l.classList.contains('is-turned') ? i + 1 : L - i; });
  /* which pages lie open: one on the covers, two inside */
  const open = () => (narrow.matches ? [page] : turned === 0 ? [1] : turned === L ? [N] : [2 * turned, 2 * turned + 1]);
  const paint = () => {
    const on = open();
    no.textContent = on.join(' – ');
    thumbs.forEach((t, i) => { const is = on.includes(i + 1); t.classList.toggle('is-on', is); if (is) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current'); });
    const from = chips.map((c) => +c.dataset.goto), top = on[on.length - 1];
    chips.forEach((c, k) => c.classList.toggle('is-on', top >= from[k] && (k === chips.length - 1 || top < from[k + 1])));
    const first = on[0] === 1, last = on[on.length - 1] === N;
    prev.disabled = first; next.disabled = last;
    const tOn = thumbs.find((t) => t.classList.contains('is-on')), strip = tOn?.parentElement;
    if (tOn && strip.scrollWidth > strip.clientWidth) strip.scrollTo({ left: tOn.offsetLeft - (strip.clientWidth - tOn.offsetWidth) / 2, behavior: 'smooth' });
    try { const far = Math.max(+localStorage.getItem('fp-story-boycott') || 0, on[on.length - 1]); localStorage.setItem('fp-story-boycott', far); } catch { /* private mode */ }
    try { history.replaceState(null, '', on[0] > 1 ? `#${on[0]}` : location.pathname + location.search); } catch { /* opened from a file */ }
  };
  const turnTo = (t, quick) => {
    t = clamp(t, 0, L); const was = turned < 0 ? 0 : turned; turned = t;
    book.dataset.turned = t; book.toggleAttribute('data-end', t === L);
    const dir = t > was ? 1 : -1, list = [];
    for (let i = dir > 0 ? was : was - 1; dir > 0 ? i < t : i >= t; i += dir) list.push(i);
    if (quick || !list.length) { leaves.forEach((l, i) => l.classList.toggle('is-turned', i < t)); return settle(); }
    list.forEach((i, k) => setTimeout(() => {
      const l = leaves[i]; l.style.zIndex = 40 + k; l.classList.toggle('is-turned', dir > 0);
      setTimeout(settle, 980);
    }, k * 130));
  };
  const go = (p, quick) => {
    page = clamp(p, 1, N);
    if (narrow.matches) { const f = faces[page - 1]; book.scrollTo({ left: f.offsetLeft - (book.clientWidth - f.offsetWidth) / 2, behavior: quick ? 'auto' : 'smooth' }); }
    else turnTo(Math.floor(page / 2), quick);
    paint();
  };
  const step = (d) => {
    if (narrow.matches) return go(page + d);
    const t = clamp(turned + d, 0, L); go(t === 0 ? 1 : t === L ? N : 2 * t);
  };

  prev.addEventListener('click', () => step(-1)); next.addEventListener('click', () => step(1));
  rd.addEventListener('click', (e) => { const b = e.target.closest('[data-goto]'); if (b) { go(+b.dataset.goto); book.focus({ preventScroll: true }); } });
  book.addEventListener('click', (e) => { if (narrow.matches) return; const l = e.target.closest('.leaf'); if (l) step(l.classList.contains('is-turned') ? -1 : 1); });
  book.addEventListener('keydown', (e) => {
    const k = { ArrowLeft: 1, PageDown: 1, ' ': 1, ArrowRight: -1, PageUp: -1 }[e.key];
    if (k) { e.preventDefault(); step(k); } else if (e.key === 'Home') { e.preventDefault(); go(1); } else if (e.key === 'End') { e.preventDefault(); go(N); }
  });
  /* on a narrow screen the finger moves the row; the page nearest the middle is the one being read */
  let tick = 0;
  book.addEventListener('scroll', () => {
    if (!narrow.matches || tick) return;
    tick = setTimeout(() => {
      tick = 0; const mid = book.getBoundingClientRect().left + book.clientWidth / 2; let best = page, gap = Infinity;
      faces.forEach((f, i) => { const r = f.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - mid); if (d < gap) { gap = d; best = i + 1; } });
      if (best !== page) { page = best; paint(); }
    }, 70);
  }, { passive: true });
  narrow.addEventListener('change', () => { const p = page; turned = -1; leaves.forEach((l) => { l.style.zIndex = ''; }); go(p, true); });

  /* tools */
  const full = rd.querySelector('[data-full]');
  if (!view.requestFullscreen) full.hidden = true;
  full.addEventListener('click', () => (document.fullscreenElement ? document.exitFullscreen() : view.requestFullscreen().catch(() => {})));
  rd.querySelector('[data-print]').addEventListener('click', async () => {
    await Promise.all([...rd.querySelectorAll('.rd__print img')].map((im) => im.decode().catch(() => {})));
    window.print();
  });
  rd.querySelector('[data-share]').addEventListener('click', async () => {
    const url = location.origin + location.pathname;
    try { await navigator.clipboard.writeText(url); window.FP?.toast?.('تم نسخ الرابط'); } catch { window.FP?.toast?.(url); }
  });

  const start = parseInt(location.hash.slice(1), 10);
  go(start > 0 ? start : 1, true);
})();

/* what this family has done, worked out in one place from this browser only: the games' own records,
   the reader's furthest page, and what the family ticked. The home and the stamp book both read it. */
window.FPHome = (() => {
  const PAGES = 8, ORDER = ['pledge', 'story', 'qanadeel', 'minbar', 'album', 'week', 'invite'];
  const ls = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
    keys: () => { try { return Object.keys(localStorage); } catch { return []; } },
    del: (k) => { try { localStorage.removeItem(k); } catch { /* private mode */ } },
  };
  const played = (g) => ls.keys().some((k) => k.startsWith(`${g}-best-`));
  const state = () => {
    const page = Math.min(PAGES, +ls.get('fp-story-boycott') || 0);
    const games = ['qanadeel', 'minbar', 'album'].filter(played);
    const week = { read: page >= PAGES, play: played('qanadeel'), ask: ls.get('fp-ask-week') === '1' };
    const weekN = Object.values(week).filter(Boolean).length;
    const got = { pledge: true, story: page >= PAGES, qanadeel: played('qanadeel'), minbar: played('minbar'), album: played('album'), week: weekN === 3, invite: ls.get('fp-invited') === '1' };
    /* the day each stamp was first seen, so the book can date it */
    let dates = {}; try { dates = JSON.parse(ls.get('fp-stamps') || '{}') || {}; } catch { dates = {}; }
    const today = new Date().toISOString().slice(0, 10); let changed = false;
    ORDER.forEach((k) => { if (got[k] && !dates[k]) { dates[k] = today; changed = true; } if (!got[k] && dates[k]) { delete dates[k]; changed = true; } });
    if (changed) ls.set('fp-stamps', JSON.stringify(dates));
    return { name: (ls.get('fp-family') || '').trim(), page, games, week, weekN, got, dates, count: ORDER.filter((k) => got[k]).length, total: ORDER.length, next: ORDER.find((k) => !got[k]) || null };
  };
  /* an example family, for a visitor with no progress of their own; real progress is never lowered */
  const example = () => {
    if (!ls.get('fp-family')) ls.set('fp-family', 'الخطيب');
    ls.set('fp-story-boycott', Math.max(5, +ls.get('fp-story-boycott') || 0));
    ['qanadeel', 'album'].forEach((g) => { if (!played(g)) ls.set(`${g}-best-example`, '1'); });
    window.FP?.toast?.('هذا مثال للعرض: بيت عائلة في منتصف الطريق');
  };
  const reset = () => ls.keys().filter((k) => /^(fp-(family|story-|ask-|invited|stamps)|(qanadeel|minbar|album)-best-)/.test(k)).forEach(ls.del);
  return { PAGES, ORDER, ls, played, state, example, reset };
})();

/* the family's home: everything on it is read from this browser — the games' own records, the reader's
   last page, and the two things the family ticks here. Nothing leaves the device. */
(() => {
  const fh = document.querySelector('[data-family]'); if (!fh) return;
  const $ = (s) => fh.querySelector(s), PAGES = 8;
  const { ls, played, state } = window.FPHome;
  let before = null;

  const render = () => {
    const name = (ls.get('fp-family') || '').trim();
    $('[data-fam-hello]').textContent = name ? `أهلا بعائلة ${name}` : 'أهلا بكم في بيتكم';
    const fill = $('[data-fam-fill]'); fill.textContent = name || 'اسم عائلتكم'; fill.classList.toggle('is-empty', !name);
    const input = $('#fam-name'); if (document.activeElement !== input) input.value = name;

    const { page, games, week, weekN, got } = state();

    fh.querySelectorAll('[data-task]').forEach((t) => t.classList.toggle('is-done', week[t.dataset.task]));
    const ask = $('[data-ask]'); ask.textContent = week.ask ? 'تراجع' : 'تحدثنا عنه'; ask.setAttribute('aria-pressed', week.ask);
    $('[data-week-bar]').style.width = `${(weekN / 3) * 100}%`;
    fh.querySelectorAll('[data-stamp]').forEach((s) => {
      const on = got[s.dataset.stamp]; s.classList.toggle('is-on', on);
      s.classList.toggle('is-new', !!before && on && !before[s.dataset.stamp]);
      const small = s.querySelector('small'); if (!small.dataset.how) small.dataset.how = small.textContent;
      small.textContent = on ? 'نلتم الختم' : small.dataset.how;
    });
    before = got;
    $('[data-n-stamps]').textContent = Object.values(got).filter(Boolean).length;
    $('[data-n-pages]').textContent = page; $('[data-n-games]').textContent = games.length; $('[data-n-week]').textContent = weekN;

    const go = $('[data-go]'), next = page >= PAGES ? 1 : Math.max(1, page);
    $('[data-go-pic]').src = `assets/img/cards/boycott-t${page >= PAGES ? PAGES : next}.webp`;
    $('[data-go-bar]').style.width = `${(page / PAGES) * 100}%`;
    $('[data-go-line]').textContent = !page ? 'لم تبدؤوا القصة بعد.' : page >= PAGES ? 'أتممتم القصة كلها.' : `وصلتم إلى الصفحة ${page} من ${PAGES}`;
    $('[data-go-cta]').textContent = !page ? 'ابدؤوا القراءة' : page >= PAGES ? 'اقرؤوها من جديد' : 'كملوا القراءة';
    go.href = `cards.html${page > 1 && page < PAGES ? `#${page}` : ''}`;
  };

  $('[data-fam-form]').addEventListener('submit', (e) => {
    e.preventDefault(); const v = $('#fam-name').value.replace(/[<>]/g, '').trim().slice(0, 30);
    if (v) ls.set('fp-family', v); else ls.del('fp-family');
    $('#fam-name').blur(); render(); window.FP?.toast?.(v ? 'تم حفظ الاسم على هذا الجهاز' : 'تم حذف الاسم');
  });
  $('[data-ask]').addEventListener('click', () => { if (ls.get('fp-ask-week') === '1') ls.del('fp-ask-week'); else ls.set('fp-ask-week', '1'); render(); });
  const inv = $('[data-invite]');
  const t = window.FPI18N?.t || ((v) => v);
  inv.addEventListener('click', () => {
    inv.href = `https://wa.me/?text=${encodeURIComponent(`${t('وقعنا ميثاق العائلة، وندعوكم لتوقيعه معنا:')} ${new URL('pledge.html', document.baseURI).href}`)}`;
    ls.set('fp-invited', '1'); setTimeout(render, 400);
  });
  $('[data-fam-reset]').addEventListener('click', () => {
    window.FPHome.reset();
    before = null; render(); window.FP?.toast?.('عاد الدفتر إلى أوله');
  });
  const example = () => { window.FPHome.example(); before = before || {}; render(); };
  $('[data-fam-demo]').addEventListener('click', example);
  if (new URLSearchParams(location.search).has('demo')) example();
  addEventListener('pageshow', render); addEventListener('storage', render);
  render();
})();

/* the stamp book: the same seven stamps, each on its own place in a passport the family can print */
(() => {
  const sb = document.querySelector('[data-stamps]'); if (!sb) return;
  const $ = (s) => sb.querySelector(s), H = window.FPHome, C = 2 * Math.PI * 52;
  const day = (iso) => { try { return new Date(`${iso}T12:00:00`).toLocaleDateString(document.documentElement.lang || 'ar', { day: 'numeric', month: 'long', year: 'numeric' }); } catch { return iso; } };
  let before = null;
  const render = () => {
    const st = H.state();
    $('[data-sb-title]').textContent = st.name ? `دفتر أختام عائلة ${st.name}` : 'دفتر الأختام';
    const who = $('[data-sb-name]'); who.textContent = st.name ? `عائلة ${st.name}` : 'اسم العائلة'; who.classList.toggle('is-empty', !st.name);
    $('[data-sb-n]').textContent = st.count; $('[data-sb-ring]').style.strokeDashoffset = C * (1 - st.count / st.total);
    sb.querySelectorAll('[data-stamp]').forEach((el) => {
      const k = el.dataset.stamp, on = st.got[k], small = el.querySelector('small');
      if (!small.dataset.how) small.dataset.how = small.textContent;
      el.classList.toggle('is-on', on); el.classList.toggle('is-next', k === st.next);
      el.classList.toggle('is-new', !!before && on && !before[k]);
      small.textContent = on ? `نلتموه في ${day(st.dates[k])}` : small.dataset.how;
    });
    before = st.got;
    const nx = $('[data-sb-next]'), src = st.next && sb.querySelector(`[data-stamp="${st.next}"]`);
    nx.classList.toggle('is-done', !st.next);
    $('[data-sb-next-name]').textContent = src ? src.querySelector('b').textContent : 'اكتمل الدفتر';
    $('[data-sb-next-how]').textContent = src ? src.querySelector('small').dataset.how : 'نلتم الأختام السبعة كلها.';
    const go = $('[data-sb-next-go]'); go.hidden = !src; if (src) go.href = src.querySelector('a').href;
  };
  $('[data-sb-print]').addEventListener('click', () => window.print());
  $('[data-sb-demo]').addEventListener('click', () => { H.example(); render(); });
  $('[data-sb-reset]').addEventListener('click', () => { H.reset(); before = null; render(); window.FP?.toast?.('عاد الدفتر إلى أوله'); });
  if (new URLSearchParams(location.search).has('demo')) H.example();
  addEventListener('pageshow', render); addEventListener('storage', render);
  render();
})();

/* sharing a page: the link is copied, or handed to WhatsApp; nothing else is sent */
(() => {
  const url = () => location.origin + location.pathname;
  document.querySelectorAll('[data-copy-link]').forEach((b) => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(url()); window.FP?.toast?.('تم نسخ الرابط'); } catch { window.FP?.toast?.(url()); }
  }));
  document.querySelectorAll('[data-share-wa]').forEach((a) => a.addEventListener('click', () => {
    a.href = `https://wa.me/?text=${encodeURIComponent(`${document.querySelector('h1')?.textContent.trim() || document.title} ${url()}`)}`;
  }));
})();

/* the grove: choosing a place grows its trees; the numbers on the page count up once when they are first seen */
(() => {
  const g = document.querySelector('[data-grove]'); if (!g) return;
  const $ = (s) => g.querySelector(s), btns = [...g.querySelectorAll('[data-place]')], field = $('[data-grove-field]');
  const show = (b) => {
    btns.forEach((x) => x.setAttribute('aria-pressed', x === b));
    const n = +b.dataset.n || 0, trees = +b.dataset.trees || 1;
    $('[data-grove-name]').textContent = b.querySelector('b').textContent;
    $('[data-grove-n]').textContent = n || ''; $('[data-grove-what]').textContent = b.dataset.what; $('[data-grove-note]').textContent = b.dataset.note;
    $('[data-grove-key]').hidden = !n;
    field.classList.toggle('is-few', trees <= 5);
    field.innerHTML = Array.from({ length: trees }, (_, i) => `<svg class="grove__tree" style="--i:${i}"><use href="#tree"/></svg>`).join('');
  };
  btns.forEach((b, i) => {
    b.addEventListener('click', () => show(b));
    b.addEventListener('keydown', (e) => {
      const d = { ArrowDown: 2, ArrowUp: -2, ArrowLeft: 1, ArrowRight: -1 }[e.key]; if (!d) return;
      const t = btns[i + (getComputedStyle(g).direction === 'rtl' || Math.abs(d) === 2 ? d : -d)]; if (t) { e.preventDefault(); t.focus(); show(t); }
    });
  });
  show(btns[0]);
})();
(() => {
  const nums = [...document.querySelectorAll('.pj__nums b.num')]; if (!nums.length || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((list) => list.forEach((en) => {
    if (!en.isIntersecting) return; io.unobserve(en.target);
    const el = en.target, to = +el.textContent, t0 = performance.now(), dur = 1100;
    const tick = (t) => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); if (k < 1) { el.textContent = Math.round(to * e); requestAnimationFrame(tick); } else el.textContent = to; };
    requestAnimationFrame(tick);
    setTimeout(() => { el.textContent = to; }, dur + 300);   // a tab in the background stops drawing; the true figure still lands
  }), { threshold: 0.6 });
  nums.forEach((n) => io.observe(n));
})();

/* contact: the topic the visitor picks decides the suggested way, and opens the message for them */
(() => {
  const ct = document.querySelector('.ct'); if (!ct) return;
  const $ = (s) => ct.querySelector(s), btns = [...ct.querySelectorAll('[data-topic]')];
  const WAYS = { wa: 'واتساب', mail: 'البريد الإلكتروني' };
  const pick = (b) => {
    btns.forEach((x) => x.setAttribute('aria-pressed', x === b));
    const way = b.dataset.way, open = b.dataset.opener, title = b.querySelector('b').textContent;
    ct.querySelectorAll('[data-way-card]').forEach((c) => c.classList.toggle('is-best', c.dataset.wayCard === way));
    $('[data-ct-hint]').textContent = `الأقصر لهذا الطلب: ${WAYS[way]}.`;
    $('[data-ct-topic]').textContent = title; $('#c-text').placeholder = open;
    ct.querySelectorAll('[data-ct-wa]').forEach((a) => { a.href = `https://wa.me/905465276557?text=${encodeURIComponent(open + ' ')}`; });
    $('[data-ct-mail]').href = `mailto:info@familypledge.com?subject=${encodeURIComponent(title)}`;
  };
  btns.forEach((b) => b.addEventListener('click', () => pick(b)));
  $('[data-ct-rep]').addEventListener('click', () => { const b = btns.find((x) => x.dataset.topic === 'rep'); pick(b); ct.querySelector('.ct__pick').scrollIntoView({ behavior: 'smooth', block: 'center' }); b.focus({ preventScroll: true }); });
  pick(btns[0]);
})();

/* the companion: one small card that tells the family its next step, on every inner page */
(() => {
  const H = window.FPHome; if (!H || document.querySelector('[data-family], [data-stamps], .sign2, [data-reader]')) return;
  const NEXT = { story: ['قصة المقاطعة', 'cards.html'], qanadeel: ['قناديل الأقصى', 'game/qanadeel/'], minbar: ['منبر صلاح الدين', 'game/minbar/'], album: ['صورة وحكاية', 'game/album/'], week: ['عهد الأسبوع', 'family.html#week'], invite: ['دعوة بيت', 'family.html#invite'] };
  let off = false; try { off = sessionStorage.getItem('fp-jb-off') === '1'; } catch { /* private mode */ }
  if (off) return;
  const st = H.state(), fresh = !st.name && st.count <= 1;
  const [name, href] = fresh ? ['توقيع الميثاق', 'pledge.html'] : st.next ? NEXT[st.next] : ['دفتركم اكتمل', 'stamps.html'];
  if (location.pathname.endsWith('/' + href.split('#')[0])) return;
  const el = document.createElement('aside'); el.className = 'jb'; el.setAttribute('aria-label', 'الخطوة التالية');
  const left = '<svg class="ic"><use href="#i-left"/></svg>';
  el.innerHTML = `<span class="jb__who"><img src="assets/img/world/face-${fresh ? 'jadda' : 'yafa'}.webp" alt="" width="200" height="200"><svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15.900"/><circle cx="18" cy="18" r="15.900" pathLength="100"/></svg></span>
    <span class="jb__txt"><small></small><b></b></span><a class="jb__go" href="${href}"><span></span>${left}</a><button class="jb__x" type="button" aria-label="إخفاء"><svg class="ic"><use href="#i-x"/></svg></button>`;
  el.querySelector('small').textContent = fresh ? 'عائلة جديدة؟' : st.name ? `عائلة ${st.name} · الختم التالي` : 'الختم التالي';
  el.querySelector('b').textContent = name;
  el.querySelector('.jb__go span').textContent = fresh ? 'ابدؤوا' : 'اذهبوا';
  el.querySelector('.jb__x').addEventListener('click', () => { el.classList.remove('is-in'); document.body.classList.remove('has-jb'); try { sessionStorage.setItem('fp-jb-off', '1'); } catch { /* private mode */ } setTimeout(() => el.remove(), 700); });
  document.body.append(el);
  setTimeout(() => { el.classList.add('is-in'); document.body.classList.add('has-jb');   /* the back-to-top button steps up out of the way */ el.querySelector('circle:last-child').style.strokeDashoffset = 100 - (st.count / st.total) * 100; }, 1400);
})();

/* the voices: one on stage; the faces, the arrows, the names and the keys all call show(i) */
(() => {
  const vs = document.querySelector('[data-voices]'); if (!vs) return;
  const cards = [...vs.querySelectorAll('[data-voice]')], picks = [...vs.querySelectorAll('.vs__picks [data-pick]')], no = vs.querySelector('[data-vs-no]');
  let at = 0, timer = 0;
  const show = (i, user) => {
    at = (i + cards.length) % cards.length;
    cards.forEach((c, k) => { c.hidden = k !== at; });
    picks.forEach((p, k) => p.setAttribute('aria-pressed', k === at));
    no.textContent = at + 1;
    if (user) { clearInterval(timer); timer = 0; }
  };
  document.querySelectorAll('[data-pick]').forEach((b) => b.addEventListener('click', () => {
    show(+b.dataset.pick, true);
    if (!b.closest('.vs')) vs.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }));
  vs.querySelector('[data-vs-prev]').addEventListener('click', () => show(at - 1, true));
  vs.querySelector('[data-vs-next]').addEventListener('click', () => show(at + 1, true));
  vs.addEventListener('keydown', (e) => { const d = { ArrowLeft: 1, ArrowRight: -1 }[e.key]; if (d) { e.preventDefault(); show(at + d, true); } });
  /* it moves on by itself until the visitor takes over, and never when motion is unwelcome */
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    timer = setInterval(() => { if (!vs.matches(':hover, :focus-within')) show(at + 1); }, 7000);
  }
})();

/* about: the audience the visitor picks takes the stage; the video loads only when asked for */
(() => {
  const box = document.querySelector('[data-auds]');
  if (box) {
    const btns = [...box.querySelectorAll('[data-aud]')], panes = [...box.querySelectorAll('[data-aud-pane]')];
    const show = (i) => { btns.forEach((b, k) => b.setAttribute('aria-pressed', k === i)); panes.forEach((p, k) => { p.hidden = k !== i; }); };
    btns.forEach((b, i) => { b.addEventListener('click', () => show(i)); b.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') show(i); }); });
  }
  document.querySelectorAll('[data-yt]').forEach((yt) => yt.querySelector('button').addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${yt.dataset.yt}?autoplay=1&rel=0`; f.title = yt.querySelector('button').getAttribute('aria-label');
    f.allow = 'autoplay; encrypted-media; picture-in-picture'; f.allowFullscreen = true;
    yt.replaceChildren(f);
  }));
})();

/* news: the place chosen narrows the list; the count says how many are showing */
(() => {
  const box = document.querySelector('[data-news]'); if (!box) return;
  const chips = [...box.querySelectorAll('[data-place-f]')], items = [...box.querySelectorAll('[data-place]')], count = box.querySelector('[data-news-count]');
  const show = (place) => {
    chips.forEach((c) => c.setAttribute('aria-pressed', c.dataset.placeF === place));
    let n = 0; items.forEach((li) => { const on = !place || li.dataset.place === place; li.hidden = !on; if (on) n++; });
    count.textContent = place ? `${n} من ${place}` : `${n} أخبار`;
  };
  chips.forEach((c) => c.addEventListener('click', () => show(c.dataset.placeF)));
  show('');
})();

/* the bag: kind, access and the search all narrow the same shelves; a cover without a page opens a small card */
(() => {
  const bar = document.querySelector('[data-bag]'); if (!bar) return;
  const root = bar.closest('.bg'), shelves = [...root.querySelectorAll('[data-shelf]')], q = root.querySelector('[data-bag-q]');
  const kinds = [...root.querySelectorAll('[data-kind-f]')], accs = [...root.querySelectorAll('[data-access-f]')], none = root.querySelector('[data-bag-none]'), feat = root.querySelector('.bg__feat');
  const norm = (s) => s.toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/[ً-ْ]/g, '').trim();
  let kind = '', acc = '';
  const apply = () => {
    const term = norm(q.value); let any = false, found = 0;
    shelves.forEach((sh) => {
      let n = 0;
      sh.querySelectorAll('[data-item]').forEach((li) => {
        const on = (!acc || li.dataset.access === acc) && (!term || norm(li.querySelector('.bk').dataset.title).includes(term));
        li.hidden = !on; if (on) n++;
      });
      const show = (!kind || sh.dataset.shelf === kind) && n > 0; sh.hidden = !show; if (show) { any = true; found += n; }
      const shown = sh.querySelector('[data-shown]'); if (shown) shown.textContent = n;
      sh.querySelector('[data-rail]')?.dispatchEvent(new Event('scroll'));
    });
    none.hidden = any; feat.hidden = !!(term || acc || (kind && kind !== 'cards'));
    /* a narrowed bag is a short list, not six wide shelves: the shelves shrink to what they hold and sit side by side */
    const narrowed = !!(term || acc); root.classList.toggle('is-results', narrowed && found <= 12);
    const fl = root.querySelector('[data-bag-found]'); fl.hidden = !narrowed || !any; root.querySelector('[data-bag-n]').textContent = found;
  };
  kinds.forEach((b) => b.addEventListener('click', () => { kind = b.dataset.kindF; kinds.forEach((x) => x.setAttribute('aria-pressed', x === b)); apply(); }));
  accs.forEach((b) => b.addEventListener('click', () => { acc = b.dataset.accessF; accs.forEach((x) => x.setAttribute('aria-pressed', x === b)); apply(); }));
  q.addEventListener('input', apply);
  root.querySelector('[data-bag-clear]').addEventListener('click', () => { q.value = ''; acc = ''; accs.forEach((x, i) => x.setAttribute('aria-pressed', i === 0)); apply(); });
  /* shelves: the arrows move by most of a screen and hide at the ends */
  root.querySelectorAll('.bg__rail-wrap').forEach((w) => {
    const rail = w.querySelector('[data-rail]'), prev = w.querySelector('[data-rail-prev]'), next = w.querySelector('[data-rail-next]');
    const rtl = () => getComputedStyle(rail).direction === 'rtl';
    const sync = () => { const max = rail.scrollWidth - rail.clientWidth - 2, x = Math.abs(rail.scrollLeft); prev.disabled = x <= 2; next.disabled = x >= max; };
    const go = (d) => rail.scrollBy({ left: d * rail.clientWidth * 0.8 * (rtl() ? -1 : 1), behavior: 'smooth' });
    prev.addEventListener('click', () => go(-1)); next.addEventListener('click', () => go(1));
    rail.addEventListener('scroll', sync, { passive: true }); addEventListener('resize', sync); sync();
  });
  /* a cover with no page of its own yet opens a card that says what it is */
  const dlg = root.querySelector('[data-peek-dialog]');
  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-peek]'); if (!b) return;
    dlg.querySelector('[data-peek-img]').src = b.querySelector('img').src;
    dlg.querySelector('[data-peek-kind]').textContent = b.dataset.kindName;
    dlg.querySelector('[data-peek-title]').textContent = b.dataset.title;
    dlg.querySelector('[data-peek-more]').href = 'item.html?id=' + encodeURIComponent(b.dataset.id);
    dlg.querySelector('[data-peek-line]').textContent = b.dataset.free === '1' ? 'محتوى مجاني لكل من يشارك في الميثاق.' : 'محتوى خاص بالمشتركين. يفتح بعد الاشتراك في الميثاق.';
    dlg.showModal();
  });
  dlg.querySelector('[data-peek-x]').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  const want = location.hash.slice(1); const k0 = kinds.find((b) => b.dataset.kindF === want); if (k0) k0.click();
})();

/* sign in: a picture of the screen. The tabs switch what is asked; submitting stores and sends nothing */
(() => {
  const f = document.querySelector('[data-lg]'); if (!f) return;
  const tabs = [...document.querySelectorAll('[data-lg-tab]')], cta = f.querySelector('[data-lg-cta]');
  tabs.forEach((t) => t.addEventListener('click', () => {
    const up = t.dataset.lgTab === 'up'; tabs.forEach((x) => x.setAttribute('aria-selected', x === t));
    f.querySelectorAll('[data-lg-only="up"]').forEach((e) => { e.hidden = !up; });
    cta.textContent = up ? 'إنشاء الحساب' : 'دخول';
  }));
  f.addEventListener('submit', (e) => { e.preventDefault(); f.reset(); window.FP?.toast?.('شاشة للعرض: لم يحفظ شيء ولم يرسل. شاهدوا بيتا مثالا.'); });
})();

/* search: one index built with the site, filtered here. Nothing typed leaves the page */
(() => {
  const root = document.querySelector('[data-sx]'); if (!root) return;
  const data = JSON.parse(root.querySelector('[data-sx-data]').textContent);
  const q = root.querySelector('[data-sx-q]'), list = root.querySelector('[data-sx-list]'), none = root.querySelector('[data-sx-none]');
  const nEl = root.querySelector('[data-sx-n]'), count = root.querySelector('[data-sx-count]');
  const norm = (s) => s.toLowerCase().replace(/[\u064B-\u0652\u0640]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').trim();
  data.forEach((d) => { d.n = norm(d.t + ' ' + d.k + ' ' + d.x); });
  const gl = (g) => root.querySelector('[data-sx-g="' + g + '"]').content.cloneNode(true);
  const row = (d) => {
    const li = document.createElement('li'), a = document.createElement('a'), pic = document.createElement('span'), txt = document.createElement('span');
    a.className = 'sx__hit'; a.href = d.h; pic.className = 'sx__pic';
    if (d.i) { const im = new Image(); im.src = d.i; im.alt = ''; im.width = 72; im.height = 72; im.loading = 'lazy'; im.decoding = 'async'; pic.append(im); } else pic.append(gl(d.g));
    const k = document.createElement('small'), t = document.createElement('b'); k.textContent = d.k; t.textContent = d.t; txt.append(k, t);
    a.append(pic, txt); li.append(a); return li;
  };
  const apply = () => {
    const words = norm(q.value).split(/\s+/).filter(Boolean);
    const hits = words.length ? data.filter((d) => words.every((w) => d.n.includes(w))) : data.filter((d) => d.k === 'صفحة' || d.k === 'مشروع');
    list.replaceChildren(...hits.slice(0, 60).map(row));
    none.hidden = hits.length > 0; nEl.hidden = !words.length || !hits.length; count.textContent = hits.length;
  };
  let t; q.addEventListener('input', () => { clearTimeout(t); t = setTimeout(apply, 120); });
  root.querySelectorAll('[data-sx-try]').forEach((b) => b.addEventListener('click', () => { q.value = b.textContent; apply(); q.focus(); }));
  apply();
  (window.FPI18N?.ready || Promise.resolve()).then(() => { const T = window.FPI18N?.t; if (!T || window.FPI18N.lang === 'ar') return; data.forEach((d) => { d.n += ' ' + norm(T(d.t) + ' ' + T(d.k)); }); });
})();

/* sign in, second pass: by mail or by phone; the Google button is a picture of one */
(() => {
  const f = document.querySelector('[data-lg]'); if (!f) return;
  const by = [...f.querySelectorAll('[data-lg-by]')];
  by.forEach((b) => b.addEventListener('click', () => {
    by.forEach((x) => x.setAttribute('aria-pressed', x === b));
    f.querySelectorAll('[data-lg-field]').forEach((e) => { e.hidden = e.dataset.lgField !== b.dataset.lgBy; });
  }));
  document.querySelectorAll('[data-lg-demo]').forEach((b) => b.addEventListener('click', () => window.FP?.toast?.('شاشة للعرض: لم يحفظ شيء ولم يرسل. شاهدوا بيتا مثالا.')));
})();

/* the profile: one page on the stage, the rest wait in the strip; arrows and the keyboard turn it */
(() => {
  const root = document.querySelector('[data-dv]'); if (!root) return;
  const n = +root.dataset.dvN, titles = root.dataset.dvTitles.split('|');
  const img = root.querySelector('[data-dv-img]'), cur = root.querySelector('[data-dv-cur]'), title = root.querySelector('[data-dv-title]');
  const strip = root.querySelector('[data-dv-strip]'), thumbs = [...root.querySelectorAll('[data-dv-go]')];
  const prev = root.querySelector('[data-dv-prev]'), next = root.querySelector('[data-dv-next]');
  const T = (s) => (window.FPI18N?.t ? window.FPI18N.t(s) : s);
  let at = 1;
  const go = (k) => {
    at = Math.min(n, Math.max(1, k));
    img.src = 'assets/img/profile/p' + at + '.webp'; img.alt = T('الصفحة') + ' ' + at + ': ' + T(titles[at - 1]);
    cur.textContent = at; title.textContent = titles[at - 1];
    prev.disabled = at === 1; next.disabled = at === n;
    thumbs.forEach((t, i) => { if (i === at - 1) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current'); });
    const t = thumbs[at - 1], r = t.getBoundingClientRect(), s = strip.getBoundingClientRect();
    strip.scrollTo({ left: strip.scrollLeft + (r.left + r.width / 2) - (s.left + s.width / 2), behavior: 'smooth' });
    if (at < n) { const pre = new Image(); pre.src = 'assets/img/profile/p' + (at + 1) + '.webp'; }
  };
  prev.addEventListener('click', () => go(at - 1)); next.addEventListener('click', () => go(at + 1));
  thumbs.forEach((t) => t.addEventListener('click', () => go(+t.dataset.dvGo)));
  root.querySelector('.dv__page').addEventListener('click', () => go(at + 1));
  document.addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea, select')) return;
    const rtl = document.documentElement.dir !== 'ltr';
    if (e.key === 'ArrowLeft') go(at + (rtl ? 1 : -1)); else if (e.key === 'ArrowRight') go(at + (rtl ? -1 : 1));
  });
  root.querySelector('[data-dv-print]').addEventListener('click', () => {
    const box = root.querySelector('[data-dv-sheets]');
    if (!box.children.length) for (let i = 1; i <= n; i++) { const im = new Image(); im.src = 'assets/img/profile/p' + i + '.webp'; im.alt = ''; box.append(im); }
    Promise.all([...box.children].map((im) => (im.complete ? 1 : new Promise((ok) => { im.onload = im.onerror = ok; })))).then(() => window.print());
  });
  go(1);
})();

/* one item of the bag, drawn from the catalogue built with the site */
(() => {
  const root = document.querySelector('[data-it]'); if (!root) return;
  const data = JSON.parse(root.querySelector('[data-it-data]').textContent);
  const id = new URLSearchParams(location.search).get('id'), d = data[id];
  if (!d) { location.replace('bag.html'); return; }
  const $ = (s) => root.querySelector(s), src = (k) => 'assets/img/bag/' + k + '.webp';
  const im = $('[data-it-img]'); im.src = src(id); im.width = d.w; im.height = d.h; im.alt = d.t;
  $('.it__cover').style.setProperty('--r', d.w / d.h);
  $('[data-it-title]').textContent = d.t; $('[data-it-crumb]').textContent = d.n; $('[data-it-kind]').textContent = d.n;
  $('[data-it-glyph]').append(root.querySelector('[data-it-g="' + d.k + '"]').content.cloneNode(true));
  const badge = $('[data-it-badge]'); badge.textContent = d.f ? 'مجاني' : 'للمشتركين'; badge.classList.add(d.f ? 'is-free' : 'is-sub');
  $('[data-it-line]').textContent = d.f ? 'محتوى مجاني لكل من يشارك في الميثاق.' : 'محتوى خاص بالمشتركين. يفتح بعد الاشتراك في الميثاق.';
  $('[data-it-back]').href = 'bag.html#' + d.k;
  if (d.o) { $('[data-it-main]').href = d.o; $('[data-it-cta]').textContent = 'افتحوا المادة'; $('[data-it-login]').hidden = true; }
  document.title = d.t + ' | ' + document.title.split('|').pop().trim();
  const rail = $('[data-it-rail]');
  Object.keys(data).filter((k) => data[k].k === d.k && k !== id).slice(0, 8).forEach((k) => {
    const li = document.createElement('li'), a = document.createElement('a'), p = new Image(), b = document.createElement('b');
    a.href = data[k].o || 'item.html?id=' + encodeURIComponent(k); p.src = src(k); p.alt = ''; p.loading = 'lazy'; p.width = data[k].w; p.height = data[k].h;
    b.textContent = data[k].t; a.append(p, b); li.append(a); rail.append(li);
  });
  if (!rail.children.length) root.querySelector('.it__more').hidden = true;
})();

/* the map: a name and its pin light together */
(() => {
  const root = document.querySelector('[data-wmap]'); if (!root) return;
  const pins = [...root.querySelectorAll('.wm__pin')], names = [...root.querySelectorAll('.wm__list button')], tip = root.querySelector('[data-wm-tip]');
  const on = (i, keep) => {
    pins.forEach((p, k) => p.classList.toggle('is-on', k === i)); names.forEach((b, k) => b.classList.toggle('is-on', k === i));
    if (i < 0) { tip.hidden = true; return; }
    tip.textContent = names[i].textContent; tip.style.setProperty('--x', pins[i].style.getPropertyValue('--x')); tip.style.setProperty('--y', pins[i].style.getPropertyValue('--y')); tip.hidden = false;
    if (keep) root.dataset.kept = i;
  };
  const rest = () => on(root.dataset.kept === undefined ? -1 : +root.dataset.kept);
  [...pins, ...names].forEach((b) => {
    const i = +b.dataset.wm;
    b.addEventListener('mouseenter', () => on(i)); b.addEventListener('mouseleave', rest);
    b.addEventListener('focus', () => on(i)); b.addEventListener('click', () => on(i, true));
  });
})();
