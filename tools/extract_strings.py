"""Collect every Arabic string a visitor can see on the site pages: text nodes, a few attributes, and strings built in JS."""
import re, json, os
from html.parser import HTMLParser
ROOT = 'D:\\MY work\\TakTek\\2026\\family-pledge\\'
HERE = os.path.dirname(os.path.abspath(__file__))
PAGES = ['index.html', 'pledge.html', 'bag.html', 'about.html', 'participants.html', 'projects.html', 'news.html', 'contact.html']
JS = ['assets\\js\\world.js', 'assets\\js\\pages.js', 'assets\\js\\fp.js', 'assets\\js\\home.js']
AR = re.compile(r'[\u0600-\u06FF]')
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
def add(s, src):
    if s and s not in seen: seen.add(s); order.append((s, src))

for f in PAGES:
    p = P(); p.feed(open(ROOT + f, encoding='utf-8').read())
    for s in p.out: add(s, f)
for f in JS:
    s = open(ROOT + f, encoding='utf-8').read()
    s = re.sub(r'/\*.*?\*/', '', s, flags=re.S); s = re.sub(r'(?m)^\s*//.*$', '', s); s = re.sub(r'\s//\s[^\n]*', '', s)
    for m in re.finditer(r"'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\]|\\.)*)`|\"((?:[^\"\\\n]|\\.)*)\"", s):
        t = m.group(1) or m.group(2) or m.group(3) or ''
        if not AR.search(t): continue
        if '<' in t:   # a template with markup: take its text parts
            for part in re.split(r'<[^>]*>', t):
                if AR.search(part): add(norm(re.sub(r'\$\{[^}]*\}', '{0}', part)), f)
        else:
            add(norm(re.sub(r'\$\{[^}]*\}', '{0}', t)), f)

json.dump([s for s, _ in order], open(os.path.join(HERE, 'strings.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print(len(order), 'strings;', sum(len(s) for s, _ in order), 'chars')
