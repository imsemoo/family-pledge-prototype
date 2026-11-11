/* ميثاق العائلة — languages. Arabic is the source; a dictionary per language maps each Arabic string to its
   translation. The page is translated in place (text, a few attributes, the title), the direction flips for
   Latin scripts, and anything the scripts add later is translated as it appears. */
(() => {
  'use strict';
  const LANGS = { ar: { name: 'العربية', dir: 'rtl' }, en: { name: 'English', dir: 'ltr' }, tr: { name: 'Türkçe', dir: 'ltr' }, id: { name: 'Indonesia', dir: 'ltr' } };
  const AR = /[؀-ۿ]/, ATTRS = ['placeholder', 'aria-label', 'alt', 'title'];
  const store = { get: () => { try { return localStorage.getItem('fp-lang'); } catch { return null; } }, set: (v) => { try { localStorage.setItem('fp-lang', v); } catch { /* private mode */ } } };

  const asked = new URLSearchParams(location.search).get('lang');
  let lang = asked && LANGS[asked] ? asked : store.get() || 'ar';
  if (!LANGS[lang]) lang = 'ar';
  if (asked && LANGS[asked]) { store.set(asked); history.replaceState(null, '', location.pathname + location.hash); }

  const root = document.documentElement;
  // pages without the loader (the games) stay hidden for the moment the dictionary takes to arrive
  if (lang !== 'ar' && !document.querySelector('.loader')) { root.style.visibility = 'hidden'; setTimeout(() => (root.style.visibility = ''), 1500); }
  const base = (document.currentScript?.src || '').replace(/js\/i18n\.js.*$/, '');
  let dict = null, patterns = [];
  const norm = (s) => s.replace(/\s+/g, ' ').trim();

  const t = (s) => {
    if (!dict || !s || !AR.test(s)) return s;
    const key = norm(s); let out = dict[key];
    if (out === undefined) {
      for (const [re, tpl] of patterns) { const m = key.match(re); if (m) { let i = 0; out = tpl.replace(/\{0\}/g, () => t(m[++i])); break; } }
    }
    if (out === undefined) return s;
    return s.match(/^\s*/)[0] + out + s.match(/\s*$/)[0];
  };

  const skip = (el) => !el || el.closest('script, style, [data-no-i18n], .cert__fill:not(.is-empty)');
  const node = (n) => { if (!AR.test(n.nodeValue) || skip(n.parentElement)) return; const v = t(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; };
  const attrs = (el) => ATTRS.forEach((a) => { const v = el.getAttribute?.(a); if (v && AR.test(v)) { const o = t(v); if (o !== v) el.setAttribute(a, o); } });
  const walk = (el) => {
    if (el.nodeType === 3) return node(el);
    if (el.nodeType !== 1 || skip(el)) return;
    attrs(el); el.querySelectorAll('[placeholder], [aria-label], [alt], [title]').forEach(attrs);
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) node(n);
  };

  const menu = () => {
    document.querySelectorAll('.lang').forEach((box) => {
      const label = box.querySelector('button span'); if (label) { label.textContent = LANGS[lang].name; label.setAttribute('data-no-i18n', ''); }
      box.querySelectorAll('[data-lang]').forEach((a) => {
        a.setAttribute('data-no-i18n', '');
        if (a.dataset.lang === lang) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        a.addEventListener('click', (e) => {
          e.preventDefault(); if (a.dataset.lang === lang) return;
          store.set(a.dataset.lang);
          const url = location.pathname + location.hash;
          if (window.FP?.leave) window.FP.leave(url); else location.reload();
          if (window.FP?.leave && location.hash) setTimeout(() => location.reload(), 520); // a hash-only change does not reload on its own
        });
      });
    });
  };

  const apply = () => {
    root.lang = lang; root.dir = LANGS[lang].dir; root.classList.toggle('is-ltr', LANGS[lang].dir === 'ltr');
    if (dict) {
      document.title = t(document.title);
      const d = document.querySelector('meta[name="description"]'); if (d) d.content = t(d.content);
      walk(document.body);
      new MutationObserver((list) => list.forEach((m) => {
        if (m.type === 'characterData') node(m.target);
        else if (m.type === 'attributes') attrs(m.target);
        else m.addedNodes.forEach(walk);
      })).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    }
    menu(); root.style.visibility = '';
  };

  const whenDom = new Promise((ok) => (document.readyState === 'loading' ? addEventListener('DOMContentLoaded', ok, { once: true }) : ok()));
  const load = lang === 'ar' ? Promise.resolve() : fetch(`${base}i18n/${lang}.json`).then((r) => (r.ok ? r.json() : null)).then((j) => {
    if (!j) { lang = 'ar'; return; }
    dict = j;
    // the most specific template first: «قطعة «{0}» مستقيمة الآن…» must win over the looser «قطعة {0}. …»
    const fixed = (k) => k.replace(/\{0\}/g, '').length;
    patterns = Object.keys(j).filter((k) => k.includes('{0}')).sort((a, b) => fixed(b) - fixed(a)).map((k) => [new RegExp('^' + k.replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace(/\\?\{0\\?\}/g, '(.+?)') + '$'), j[k]]);
  }).catch(() => { lang = 'ar'; });

  const ready = Promise.all([load, whenDom]).then(apply);
  window.FPI18N = { t, ready, get lang() { return lang; } };
  if (window.FP) window.FP.t = t;
})();
