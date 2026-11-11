"""List the Arabic strings of the three games that the dictionaries do not hold yet."""
import re, json, os
from html.parser import HTMLParser
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + os.sep
PAGES = ['game/qanadeel/index.html', 'game/minbar/index.html', 'game/album/index.html']
JS = ['game/qanadeel/game.js', 'game/minbar/minbar.js', 'game/album/album.js']
AR = re.compile(r'[؀-ۿ]')
norm = lambda s: re.sub(r'\s+', ' ', s).strip()

class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True); self.out = []; self.skip = 0
    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style'): self.skip += 1
        for k, v in attrs:
            if v and k in ('placeholder', 'aria-label', 'alt', 'title', 'content') and AR.search(v): self.out.append(norm(v))
    def handle_endtag(self, tag):
        if tag in ('script', 'style'): self.skip -= 1
    def handle_data(self, data):
        if not self.skip and AR.search(data): self.out.append(norm(data))

seen, order = set(), []
def add(s):
    if s and s not in seen: seen.add(s); order.append(s)
for f in PAGES:
    p = P(); p.feed(open(ROOT + f, encoding='utf-8').read()); [add(s) for s in p.out]
for f in JS:
    s = open(ROOT + f, encoding='utf-8').read()
    s = re.sub(r'/\*.*?\*/', '', s, flags=re.S); s = re.sub(r'(?m)^\s*//.*$', '', s); s = re.sub(r'\s//\s[^\n]*', '', s)
    for m in re.finditer(r"'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\]|\\.)*)`|\"((?:[^\"\\\n]|\\.)*)\"", s):
        t = m.group(1) or m.group(2) or m.group(3) or ''
        if not AR.search(t): continue
        for part in (re.split(r'<[^>]*>', t) if '<' in t else [t]):
            if AR.search(part): add(norm(re.sub(r'\$\{[^}]*\}', '{0}', part)))
have = json.load(open(ROOT + 'assets/i18n/en.json', encoding='utf-8'))
new = [s for s in order if s not in have and len(s) > 1]
json.dump(new, open(ROOT + 'tools/game_new.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
for i, s in enumerate(new): print(i, s, sep='|')
