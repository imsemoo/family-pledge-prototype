"""The bag and the games page, second pass, built on the platform's real catalogue (tools/bag_data.py)
and its real covers (assets/img/bag). Covers are shown whole on shelves, never cut.
Run through build_guide.py."""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE, 'build_lists.py'), encoding='utf-8').read())   # ROOT, shell, bottom, relink, glyph, LEFT, CALL ...
exec(open(os.path.join(HERE, 'bag_data.py'), encoding='utf-8').read())      # TOTAL, KIND, ITEMS
from PIL import Image

ORDER = ['cards', 'book', 'comic', 'podcast', 'video', 'game']
GL = {'book': 'book', 'video': 'video', 'podcast': 'podcast', 'comic': 'comic', 'cards': 'cards', 'game': 'game'}
ALL = sum(TOTAL.values())
# items that open something real in this prototype
OPEN = {('cards', 1): 'cards.html', ('game', 6): 'game/minbar/', ('game', 7): 'game/qanadeel/'}

def size(kind, i):
    w, h = Image.open(ROOT + 'assets/img/bag/%s-%d.webp' % (kind, i)).size
    return w, h

def item(kind, i, title, free):
    w, h = size(kind, i); href = OPEN.get((kind, i))
    tag = '<span class="bk__tag bk__tag--%s">%s</span>' % (('free', 'مجاني') if free else ('sub', 'للمشتركين'))
    inner = '<span class="bk__cover" style="--r:%.4f"><img src="assets/img/bag/%s-%d.webp" alt="" width="%d" height="%d" loading="lazy" decoding="async">%s</span><b>%s</b>' % (w / h, kind, i, w, h, tag, title)
    attrs = 'class="bk" data-title="%s" data-kind-name="%s" data-free="%d"' % (title, KIND[kind], free)
    return '<li data-item data-access="%s">%s</li>' % ('free' if free else 'sub',
        '<a %s href="%s">%s</a>' % (attrs, href, inner) if href else '<button type="button" %s data-peek>%s</button>' % (attrs, inner))

def shelf(kind):
    items = ''.join(item(kind, i, t, free) for i, (t, f, free) in enumerate(ITEMS[kind], 1))
    more = '<a class="fh__more" href="games.html">كل الألعاب%s</a>' % LEFT if kind == 'game' else '<span class="bg__of"><b class="num" data-shown>%d</b> من <b class="num">%d</b></span>' % (len(ITEMS[kind]), TOTAL[kind])
    return '''
    <section class="pj__blk bg__shelf" data-shelf="%s" id="%s" aria-labelledby="h-%s">
      <div class="bg__shelf-head"><span class="pj__ic">%s</span><div><h2 id="h-%s">%s</h2><p><span class="num">%d</span> مادة على المنصة</p></div>%s</div>
      <div class="bg__rail-wrap"><ul class="bg__rail" data-rail tabindex="0" aria-label="%s">%s</ul>
        <button class="bg__arrow bg__arrow--prev" type="button" data-rail-prev aria-label="السابق"><svg class="ic"><use href="#i-right"/></svg></button>
        <button class="bg__arrow bg__arrow--next" type="button" data-rail-next aria-label="التالي"><svg class="ic"><use href="#i-left"/></svg></button></div>
    </section>''' % (kind, kind, kind, glyph(GL[kind]), kind, KIND[kind], TOTAL[kind], more, KIND[kind], items)

def tab(k, name, n, g, on=False):
    return '<button type="button" data-kind-f="%s" aria-pressed="%s"><span class="bg__tab-ic">%s<i class="num">%d</i></span><b>%s</b></button>' % (k, 'true' if on else 'false', glyph(g), n, name)
kinds = tab('', 'الكل', ALL, 'all', True) + ''.join(tab(k, KIND[k], TOTAL[k], GL[k]) for k in ORDER)
mosaic = ''.join('<img src="assets/img/bag/%s-%d.webp" alt="" width="%d" height="%d">' % ((k, i) + size(k, i)) for k, i in (('cards', 1), ('comic', 2), ('podcast', 2), ('cards', 4), ('comic', 4), ('podcast', 4)))

BAG2 = ('''<main id="main">
<div class="pj bg">
  <header class="pj__head">
    <div class="pj__in pj__head-in">
      <div class="pj__title">
        <p class="crumbs"><a href="./">الرئيسية</a><span aria-hidden="true">/</span><span>في جعبتنا</span></p>
        <p class="rd__kind"><span class="dots"><i></i><i></i><i></i></span><span>في جعبتنا</span></p>
        <h1>نجعل أطفالكم أصحاب قضية</h1>
        <p class="pj__sub">قصص أبطال، وحكايات فلسطينية تزرع حب القدس في قلوب أطفالكم.</p>
        <label class="bg__search"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.800-3.800"/></svg><span class="sr-only">ابحثوا في الجعبة</span><input type="search" placeholder="ابحثوا في الجعبة" autocomplete="off" data-bag-q></label>
      </div>
      <div class="pj__stage bg__stage">
        <div class="bg__mosaic">%s</div>
        <p class="pj__tag"><span class="pj__ic">''' + glyph('cards') + '''</span><b class="num">%d</b><span>مادة في الجعبة</span></p>
      </div>
    </div>
  </header>

  <div class="bg__bar" data-bag>
    <div class="pj__in bg__bar-in">
      <div class="bg__kinds" role="group" aria-label="نوع المحتوى">%s</div>
      <div class="bg__access" role="group" aria-label="الاشتراك"><small>الاشتراك</small><button type="button" data-access-f="" aria-pressed="true">الكل</button><button type="button" data-access-f="free" aria-pressed="false">مجاني</button><button type="button" data-access-f="sub" aria-pressed="false">للمشتركين</button></div>
    </div>
  </div>

  <div class="pj__in">
    <section class="pj__quote bg__feat" aria-labelledby="h-feat">
      <figure class="pj__quote-pic"><img src="assets/img/cards/boycott-p1.webp" alt="غلاف «المقاطعة»" width="1080" height="1350" loading="lazy" decoding="async"></figure>
      <div class="pj__quote-txt">
        <p class="pj__kick">ابدؤوا من هنا</p>
        <h2 id="h-feat">المقاطعة: القصة في صور</h2>
        <p>ثماني صفحات تقلب مثل كتاب، وتقرأ مع الأطفال في ثلاث دقائق.</p>
        <a class="btn" href="cards.html"><span class="stitch"></span>افتحوا الكتاب</a>
      </div>
    </section>
    <p class="bg__found" data-bag-found hidden><span>النتائج</span><b class="num" data-bag-n>0</b><button type="button" data-bag-clear>عرض الكل</button></p>
    <p class="bg__none" data-bag-none hidden>لا شيء بهذا الاسم. جربوا كلمة أخرى.</p>
    <div class="bg__shelves" data-shelves>%s
    </div>
  </div>

  <dialog class="peek" data-peek-dialog aria-labelledby="peek-t">
    <button class="peek__x" type="button" data-peek-x aria-label="إغلاق"><svg class="ic"><use href="#i-x"/></svg></button>
    <img alt="" data-peek-img>
    <div><small data-peek-kind></small><h2 id="peek-t" data-peek-title></h2><p data-peek-line></p><a class="btn" href="pledge.html"><span class="stitch"></span>توقيع الميثاق</a></div>
  </dialog>
</div>
''') % (mosaic, ALL, kinds, ''.join(shelf(k) for k in ORDER)) + CALL + '\n'

open(ROOT + 'bag.html', 'w', encoding='utf-8', newline='\n').write(
    relink(shell('في جعبتنا — ميثاق العائلة', 'كتب وفيديوهات وبودكاست وقصص وبطاقات وألعاب تجعل أطفالكم أصحاب قضية.', 'bag.html') + BAG2 + bottom))
print('bag.html built,', ALL, 'items on the platform')

# ---------------------------------------------------------------- games
NEW = [
    ('game/qanadeel/', 'qanadeel', 'قناديل الأقصى', 'بحث عن الكلمات: كل كلمة تضيء قنديلا.', 'ثلاثة مستويات'),
    ('game/minbar/', 'minbar', 'منبر صلاح الدين', 'ركبوا المنبر قطعة قطعة، ثم خذوا بطاقة باسمكم.', 'بطاقة تذكارية'),
    ('game/album/', 'album', 'صورة وحكاية', 'لعبة ذاكرة: كل صورة تطابق عنوان حكايتها.', '18 بطاقة'),
]
new = ''.join('''
        <li><a class="gm__card" href="%s"><figure><img src="assets/img/guide/%s.webp" alt="شاشة لعبة %s" width="800" height="500" loading="lazy" decoding="async"><span class="gm__play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.500v13a1 1 0 0 0 1.500.860l11-6.500a1 1 0 0 0 0-1.720l-11-6.500A1 1 0 0 0 8 5.500z"/></svg></span></figure><div><small>%s</small><h3>%s</h3><p>%s</p><span class="gm__go">العبوا الآن%s</span></div></a></li>''' % (h, pic, t, chip, t, line, LEFT) for h, pic, t, line, chip in NEW)

def gcard(i, title):
    w, h = size('game', i); href = OPEN.get(('game', i))
    inner = '<figure><img src="assets/img/bag/game-%d.webp" alt="" width="%d" height="%d" loading="lazy" decoding="async">%s</figure><b>%s</b>' % (i, w, h, '<span class="gm__new">نسخة جديدة</span>' if href else '', title)
    return '<li>%s</li>' % ('<a class="gm__tile" href="%s">%s</a>' % (href, inner) if href else '<div class="gm__tile">%s</div>' % inner)
grid = ''.join(gcard(i, t) for i, (t, f, free) in enumerate(ITEMS['game'], 1))

GAMES = ('''<main id="main">
<div class="pj gm">
  <header class="gm__hero">
    <div class="pj__in gm__hero-in">
      <div class="gm__hero-txt">
        <p class="crumbs"><a href="./">الرئيسية</a><span aria-hidden="true">/</span><a href="bag.html">في جعبتنا</a><span aria-hidden="true">/</span><span>ألعاب</span></p>
        <p class="pj__kick">ألعاب الميثاق</p>
        <h1>يلعبون، فيعرفون القدس</h1>
        <p>ألعاب للعائلة كلها عن القدس والأقصى وفلسطين.</p>
        <ul class="gm__nums"><li><span class="pj__ic">''' + glyph('play') + '''</span><b class="num">12</b><span>لعبة على المنصة</span></li><li><span class="pj__ic">''' + glyph('game') + '''</span><b class="num">3</b><span>جاهزة في التصميم الجديد</span></li></ul>
      </div>
      <img class="gm__raed" src="assets/img/world/raed.webp" alt="" width="307" height="900">
    </div>
  </header>

  <div class="pj__in">
    <section aria-labelledby="h-new">
      <div class="pj__blk-head gm__head"><h2 id="h-new">العبوا الآن</h2><p>ثلاث ألعاب بالتصميم الجديد، تعمل على الجوال والحاسوب.</p></div>
      <ul class="gm__new-list">%s
      </ul>
    </section>

    <section class="pj__blk" aria-labelledby="h-all">
      <div class="pj__blk-head"><h2 id="h-all">كل ألعاب المنصة</h2><p>الاثنتا عشرة لعبة كما هي على المنصة. ما عليه «نسخة جديدة» يفتح هنا.</p></div>
      <ul class="gm__grid">%s</ul>
    </section>
  </div>
</div>
''') % (new, grid) + CALL + '\n'

open(ROOT + 'games.html', 'w', encoding='utf-8', newline='\n').write(
    relink(shell('ألعاب — ميثاق العائلة', 'ألعاب للعائلة كلها عن القدس والأقصى وفلسطين.', 'bag.html') + GAMES + bottom))
print('games.html built')
