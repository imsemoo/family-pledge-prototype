"""Connect the three games to the language system."""
import os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + os.sep
def edit(path, pairs):
    p = ROOT + path; s = open(p, encoding='utf-8').read(); n = 0
    for a, b in pairs:
        if a in s and b not in s: s = s.replace(a, b); n += 1
    open(p, 'w', encoding='utf-8').write(s); print(path, n, 'edits')

# 1. load the translator before each game's own script
for g, js in (('qanadeel', 'game.js'), ('minbar', 'minbar.js'), ('album', 'album.js')):
    p = ROOT + 'game/%s/index.html' % g; h = open(p, encoding='utf-8').read()
    if 'i18n.js' not in h:
        m = re.search(r'<script src="%s\?v=\d+" defer></script>' % re.escape(js), h); assert m, g
        h = h.replace(m.group(0), '<script src="../../assets/js/i18n.js?v=1" defer></script>\n' + m.group(0))
    h = re.sub(r'\?v=\d+"', lambda m: '?v=%d"' % (int(m.group(0)[3:-1]) + 1), h)
    open(p, 'w', encoding='utf-8').write(h)

# 2. a page without the loader must not flash Arabic before it is translated
edit('assets/js/i18n.js', [(
    "  const root = document.documentElement, base =",
    "  const root = document.documentElement;\n  // pages without the loader (the games) stay hidden for the moment the dictionary takes to arrive\n  if (lang !== 'ar' && !document.querySelector('.loader')) { root.style.visibility = 'hidden'; setTimeout(() => (root.style.visibility = ''), 1500); }\n  const base ="),
    ("    menu();\n  };", "    menu(); root.style.visibility = '';\n  };"),
])
p = ROOT + 'assets/js/i18n.js'; s = open(p, encoding='utf-8').read()
s = s.replace("  const root = document.documentElement;\n  // pages", "  const root = document.documentElement;\n  // pages") ; open(p, 'w', encoding='utf-8').write(s)

# 3. text drawn on canvas or handed to the share sheet never reaches the DOM, so it is translated by hand
edit('game/minbar/minbar.js', [
    ("      x.direction = 'rtl'; x.textAlign = 'center';", "      const tr = window.FPI18N?.t || ((v) => v); x.direction = document.documentElement.dir || 'rtl'; x.textAlign = 'center';"),
    ("x.fillText(`أنا ${name}`, 540, 1030);", "x.fillText(tr('أنا {0}').replace('{0}', name), 540, 1030);"),
    ("x.fillText('أعدت بناء منبر صلاح الدين', 540, 1125);", "x.fillText(tr('أعدت بناء منبر صلاح الدين'), 540, 1125, 960);"),
    ("x.fillText('قد يحرق الخشب، لكن الذاكرة التي نحفظها لا تحترق.', 540, 1195);", "x.fillText(tr('قد يحرق الخشب، لكن الذاكرة التي نحفظها لا تحترق.'), 540, 1195, 960);"),
    ("x.fillText('ميثاق العائلة', 540, 1280);", "x.fillText(tr('ميثاق العائلة'), 540, 1280);"),
])
edit('game/qanadeel/game.js', [
    ("navigator.share({ title: 'قناديل الأقصى', text: `أضأت قناديل الأقصى كلها في ${fmt(S.t)}. جرب أنت وعائلتك!`, url: location.href })",
     "navigator.share({ title: (window.FPI18N?.t || ((v) => v))('قناديل الأقصى'), text: (window.FPI18N?.t || ((v) => v))('أضأت قناديل الأقصى كلها في {0}. جرب أنت وعائلتك!').replace('{0}', fmt(S.t)), url: location.href })"),
])
# 4. arrow keys follow the direction the cards are laid out in
edit('game/album/album.js', [
    ("const step = { ArrowLeft: 1, ArrowRight: -1, ArrowDown: cols, ArrowUp: -cols }[e.key];",
     "const fwd = getComputedStyle(el.board).direction === 'rtl' ? 1 : -1; const step = { ArrowLeft: fwd, ArrowRight: -fwd, ArrowDown: cols, ArrowUp: -cols }[e.key];"),
])
# 5. left-to-right details inside the games
CSS = '''
/* ---------- games in left-to-right languages ---------- */
html[dir="ltr"] .words li, html[dir="ltr"] .secret, html[dir="ltr"] .win__phrase { direction: rtl; }
html[dir="ltr"] .words { direction: ltr; }
html[dir="ltr"] .start h1 { line-height: 1.2; }
html[dir="ltr"] .ac__sheet b { font-size: 0.92em; line-height: 1.3; }
html[dir="ltr"] .pick small, html[dir="ltr"] .how li { line-height: 1.45; }
'''
p = ROOT + 'game/qanadeel/game.css'; c = open(p, encoding='utf-8').read()
if 'games in left-to-right languages' not in c: open(p, 'a', encoding='utf-8').write(CSS)
print('wired')
