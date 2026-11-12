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

  /* ================= the bag: one bar filters everything on the page ================= */
  const bag = $('[data-bag]');
  if (bag) {
    const kinds = $$('.kinds button', bag), access = $$('.seg2 button', bag), find = $('#bag-find'), items = $$('[data-kind]', $('.baglist')), shelves = $$('.shelf2'), empty = $('.bag-empty');
    const state = { kind: 'all', access: 'all', q: '' };
    const norm = (s) => s.toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').trim();
    const apply = () => {
      let shown = 0;
      items.forEach((li) => {
        const okKind = state.kind === 'all' || li.dataset.kind === state.kind;
        const okAccess = state.access === 'all' || li.dataset.access === 'both' || li.dataset.access === state.access;
        const okText = !state.q || norm(li.textContent).includes(state.q);
        const on = okKind && okAccess && okText; li.hidden = !on; if (on) shown++;
      });
      shelves.forEach((s) => (s.hidden = !$$('[data-kind]', s).some((li) => !li.hidden)));
      empty.hidden = shown > 0; $('[data-count]').textContent = shown;
    };
    kinds.forEach((b) => b.addEventListener('click', () => { state.kind = b.dataset.kind; kinds.forEach((x) => { const on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on); }); apply(); }));
    access.forEach((b) => b.addEventListener('click', () => { state.access = b.dataset.access; access.forEach((x) => { const on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on); }); apply(); }));
    find.addEventListener('input', () => { state.q = norm(find.value); apply(); });
    $('[data-reset]')?.addEventListener('click', () => { find.value = ''; state.q = ''; kinds[0].click(); access[0].click(); });
    // a kind can be opened from the address, e.g. bag.html#podcast
    const want = location.hash.slice(1), hit = kinds.find((b) => b.dataset.kind === want); if (hit) hit.click(); else apply();
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

/* the family's home: everything on it is read from this browser — the games' own records, the reader's
   last page, and the two things the family ticks here. Nothing leaves the device. */
(() => {
  const fh = document.querySelector('[data-family]'); if (!fh) return;
  const $ = (s) => fh.querySelector(s), PAGES = 8;
  const ls = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
    keys: () => { try { return Object.keys(localStorage); } catch { return []; } },
    del: (k) => { try { localStorage.removeItem(k); } catch { /* private mode */ } },
  };
  const played = (g) => ls.keys().some((k) => k.startsWith(`${g}-best-`));
  let before = null;

  const render = () => {
    const name = (ls.get('fp-family') || '').trim();
    $('[data-fam-hello]').textContent = name ? `أهلا بعائلة ${name}` : 'أهلا بكم في بيتكم';
    const fill = $('[data-fam-fill]'); fill.textContent = name || 'اسم عائلتكم'; fill.classList.toggle('is-empty', !name);
    const input = $('#fam-name'); if (document.activeElement !== input) input.value = name;

    const page = Math.min(PAGES, +ls.get('fp-story-boycott') || 0);
    const games = ['qanadeel', 'minbar', 'album'].filter(played);
    const week = { read: page >= PAGES, play: played('qanadeel'), ask: ls.get('fp-ask-week') === '1' };
    const weekN = Object.values(week).filter(Boolean).length;
    const got = { pledge: true, story: page >= PAGES, qanadeel: played('qanadeel'), minbar: played('minbar'), album: played('album'), week: weekN === 3, invite: ls.get('fp-invited') === '1' };

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
    ls.keys().filter((k) => /^(fp-(family|story-|ask-|invited)|(qanadeel|minbar|album)-best-)/.test(k)).forEach(ls.del);
    before = null; render(); window.FP?.toast?.('عاد الدفتر إلى أوله');
  });
  addEventListener('pageshow', render); addEventListener('storage', render);
  render();
})();
