"""Build pledge.html and bag.html from the homepage shell, and point the homepage at them."""
import re
ROOT = 'D:\\MY work\\TakTek\\2026\\family-pledge\\'
idx = open(ROOT + 'index.html', encoding='utf-8').read()
V = int(re.search(r'world\.css\?v=(\d+)', idx).group(1)) + 1

# ---------- homepage: signing and bag links stay inside the prototype ----------
idx = idx.replace('href="https://familypledge.org/SharePledge"', 'href="pledge.html"')
idx = idx.replace('action="https://familypledge.org/SharePledge"', 'action="pledge.html"')
idx = idx.replace('href="https://familypledge.org/Ourbag"', 'href="bag.html"')
idx = re.sub(r'\?v=\d+"', '?v=%d"' % V, idx)
open(ROOT + 'index.html', 'w', encoding='utf-8').write(idx)

top = idx[:idx.index('<main id="main">')]
bottom = idx[idx.index('</main>'):]
# the certificate dialog and the home script belong to the homepage only
bottom = re.sub(r'<dialog class="modal" id="doc".*?</dialog>\s*', '', bottom, flags=re.S)
bottom = re.sub(r'<script defer src="assets/js/home\.js[^>]*></script>\s*', '', bottom)
bottom = bottom.replace('</body>', '<script src="assets/js/pages.js?v=%d" defer></script>\n</body>' % V)
top = top.replace('<link rel="stylesheet" href="assets/css/world.css?v=%d">' % V, '<link rel="stylesheet" href="assets/css/world.css?v=%d">\n<link rel="stylesheet" href="assets/css/pages.css?v=%d">' % (V, V))
assert 'pages.css' in top, 'world.css link not found'

def shell(title, desc, current):
    t = re.sub(r'<title>.*?</title>', '<title>%s</title>' % title, top, flags=re.S)
    t = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="%s">' % desc, t)
    t = t.replace(' aria-current="page"', '')
    if current:
        t = t.replace('<a href="%s">' % current, '<a href="%s" aria-current="page">' % current)
        t = t.replace('<a href="%s" style' % current, '<a href="%s" aria-current="page" style' % current)
    return t

CHECK = '<svg class="ic"><use href="#i-check"/></svg>'
SEAL = ('<span class="cert__seal" aria-hidden="true"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="57" fill="#fff" stroke="#b03a62" stroke-width="2.500"/>'
        '<circle cx="60" cy="60" r="44" fill="none" stroke="#b03a62" stroke-width="1.200" stroke-dasharray="2 4"/></svg>'
        '<img src="assets/img/world/seal-mark.webp" alt="" width="360" height="316"></span>')

PLEDGE = '''<main id="main">
<div class="sign2" data-sign2>
  <form class="flow__form sign2__form" data-flow novalidate aria-label="توقيع الميثاق">
    <p class="crumbs"><a href="./">الرئيسية</a><span aria-hidden="true">/</span><span>توقيع الميثاق</span></p>
    <ol class="steps" aria-label="خطوات التوقيع">
      <li><span>عائلتكم</span></li>
      <li><span>مشاركتكم</span></li>
      <li><span>العهد</span></li>
    </ol>

    <fieldset class="pane">
      <legend>باسم من يكتب الميثاق؟</legend>
      <p class="hint">اكتبوا اسم عائلتكم وشاهدوه على وثيقتكم وأنتم تكتبون.</p>
      <div class="fld">
        <label for="f-name">اسم العائلة</label>
        <input class="input" id="f-name" type="text" maxlength="24" autocomplete="off" placeholder="مثال: النجار" aria-describedby="m-name">
        <p class="fld__msg" id="m-name" role="alert"></p>
      </div>
      <div class="fld">
        <label for="f-country">الدولة</label>
        <input class="input" id="f-country" type="text" maxlength="22" autocomplete="off" list="countries" placeholder="مثال: مصر" aria-describedby="m-country">
        <datalist id="countries"><option value="مصر"><option value="الأردن"><option value="السعودية"><option value="الكويت"><option value="قطر"><option value="الإمارات"><option value="تركيا"><option value="المغرب"><option value="الجزائر"><option value="تونس"><option value="العراق"><option value="لبنان"><option value="ماليزيا"><option value="إندونيسيا"><option value="ألمانيا"><option value="بريطانيا"><option value="البرازيل"><option value="ألبانيا"><option value="أستراليا"></datalist>
        <p class="fld__msg" id="m-country" role="alert"></p>
      </div>
      <div class="pane__nav"><button class="btn" type="button" data-step="next"><span class="stitch"></span>التالي: نوع المشاركة</button></div>
    </fieldset>

    <fieldset class="pane" hidden>
      <legend>كيف تشاركون؟</legend>
      <p class="hint">الوثيقة تصلكم في الحالتين.</p>
      <div class="plans" role="radiogroup" aria-label="نوع المشاركة">
        <label class="plan"><input type="radio" name="plan" value="donate" checked>
          <span class="plan__top"><strong class="num">$10</strong><small>شهريا لمدة عام</small></span>
          <ul class="gets"><li>''' + CHECK + '''وثيقة ميثاق العائلة باسم عائلتكم</li><li>''' + CHECK + '''المحتوى المجاني: كتب وقصص وفيديوهات مختارة</li><li>''' + CHECK + '''وصول كامل للمساقات والبطاقات والمواد الحصرية</li><li>''' + CHECK + '''دعم مباشر لصمود المرأة المعيلة وعائلتها</li></ul>
        </label>
        <label class="plan"><input type="radio" name="plan" value="free">
          <span class="plan__top"><strong>مجانا</strong><small>توقيع بلا تبرع</small></span>
          <ul class="gets"><li>''' + CHECK + '''وثيقة ميثاق العائلة باسم عائلتكم</li><li>''' + CHECK + '''المحتوى المجاني: كتب وقصص وفيديوهات مختارة</li></ul>
        </label>
      </div>
      <div class="pane__nav"><button class="btn" type="button" data-step="next"><span class="stitch"></span>التالي: العهد</button><button class="btn btn--line" type="button" data-step="back">رجوع</button></div>
    </fieldset>

    <fieldset class="pane" hidden>
      <legend>على ماذا نتعاهد؟</legend>
      <p class="hint">اقرؤوا البنود معا، وضعوا علامة على كل بند.</p>
      <div class="vowcheck">
        <label><input type="checkbox"><img src="assets/img/world/cast-raed-1.webp" alt="" width="360" height="360"><b>التوعية بالقضية الفلسطينية</b><small>أن تبقى القضية الفلسطينية حاضرة في بيتنا.</small><span class="box">''' + CHECK + '''</span></label>
        <label><input type="checkbox"><img src="assets/img/world/cast-jadda-1.webp" alt="" width="360" height="360"><b>دعم المرأة الفلسطينية</b><small>دعم وتعزيز صمود المرأة الفلسطينية والعائلة الفلسطينية.</small><span class="box">''' + CHECK + '''</span></label>
        <label><input type="checkbox"><img src="assets/img/world/cast-yafa-1.webp" alt="" width="360" height="360"><b>تعزيز الثقافة الفلسطينية</b><small>ربط أسرتنا عقائديا وعاطفيا بالقدس والأقصى المبارك.</small><span class="box">''' + CHECK + '''</span></label>
      </div>
      <p class="fld__msg" id="m-vows" role="alert"></p>
      <div class="pane__nav"><button class="btn" type="button" data-step="next"><span class="stitch"></span>اختموا الميثاق</button><button class="btn btn--line" type="button" data-step="back">رجوع</button></div>
    </fieldset>

    <div class="done" data-done hidden>
      <p class="done__no">التوقيع رقم <b class="num">25,048</b></p>
      <h2 tabindex="-1">ميثاق عائلة <span data-done-name></span> مختوم</h2>
      <p data-done-plan></p>
      <ul class="after">
        <li><a href="bag.html"><svg class="ic"><use href="#i-book"/></svg><b>افتحوا الجعبة</b><small>حكايات وألعاب للعائلة</small></a></li>
        <li><button type="button" data-download><svg class="ic"><use href="#i-down-load"/></svg><b>نزلوا الوثيقة</b><small>صورة باسم عائلتكم</small></button></li>
        <li><a data-wa href="https://wa.me/" target="_blank" rel="noopener"><svg class="ic"><use href="#i-chat"/></svg><b>ادعوا بيتا</b><small>رسالة جاهزة على واتساب</small></a></li>
      </ul>
      <button class="link" type="button" data-again>البدء من جديد</button>
    </div>

    <p class="demo-note"><b>نموذج تجريبي</b>لا يحفظ ما تكتبونه هنا ولا يرسل. التسجيل والدفع يتمان على المنصة.</p>
  </form>

  <aside class="sign2__stage" aria-label="وثيقة الميثاق">
    <span class="sign2__rings" aria-hidden="true"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="59" fill="none" stroke="#fff" stroke-width="0.400"/><circle cx="60" cy="60" r="53" fill="none" stroke="#fff" stroke-width="0.400" stroke-dasharray="1 2.600"/><circle cx="60" cy="60" r="47" fill="none" stroke="#fff" stroke-width="0.400"/></svg></span>
    <div class="sign2__hold">
      <img class="sign2__hand" src="assets/img/world/hand-rose.webp" alt="" width="900" height="900">
      <img class="sign2__hand" src="assets/img/world/hand-teal.webp" alt="" width="900" height="900">
      <figure class="cert">
        <img src="assets/img/certificate.webp" alt="وثيقة ميثاق العائلة: نص العهد وتحته خانتان لاسم العائلة والدولة" width="1600" height="1135">
        <span class="cert__fill cert__fill--name is-empty" data-fill="name" aria-hidden="true">اسم عائلتكم</span>
        <span class="cert__fill cert__fill--country is-empty" data-fill="country" aria-hidden="true">دولتكم</span>
        ''' + SEAL + '''
      </figure>
    </div>
    <p class="cap">هذه وثيقتكم كما ستظهر. تكتب أمامكم وأنتم تملؤون الخانات.</p>
  </aside>
</div>
'''

# ---------- the bag ----------
m = re.search(r'<ul class="bag"[^>]*>(.*?)</ul>', idx, flags=re.S)
glyphs = re.findall(r'(<svg class="glyph".*?</svg>)\s*([^<]+)</a>', m.group(1), flags=re.S)
assert len(glyphs) == 7, len(glyphs)
KEYS = ['book', 'video', 'podcast', 'comic', 'cards', 'article', 'game']
G = {k: g for k, (g, _) in zip(KEYS, glyphs)}
NAME = {k: n.strip() for k, (_, n) in zip(KEYS, glyphs)}
URL = {'book': '0365A4D4-331F-4413-8425-46404BDC7E52', 'video': '9B9ADEDA-D1C1-42F5-B54E-0431583C9DA7', 'podcast': 'E4BD7361-27D6-4E74-BD48-109342E804C6',
       'comic': 'A4F98A1A-BC7D-4CC7-BB35-E11887B54A46', 'cards': '5A2B2E83-4B3C-4736-9ECC-AFD58BC483AF', 'article': '9E7EA6E5-BE27-4FE5-90D8-865FF315D93C'}
BASE = 'https://familypledge.org/Bagdetails/'

kinds = '<button type="button" class="is-on" data-kind="all" aria-pressed="true">الكل</button>' + ''.join(
    '<button type="button" data-kind="%s" aria-pressed="false">%s%s</button>' % (k, G[k], NAME[k]) for k in KEYS)

EPS = [('02', 'المسجد العمري: لم يبق منه إلا مئذنة'), ('04', 'زوارق غزة: كيف يمنع البحر أن يكون بحرا'), ('05', 'الأطراف المبتورة: هل نركض بدونها؟'),
       ('07', 'المخيمات أصل الحكاية'), ('12', 'جد الزيتون'), ('15', 'العلم الفلسطيني')]
eps = ''.join('''
        <li data-kind="podcast" data-access="sub"><a class="item" href="%s%s#premium" target="_blank" rel="noopener"><span class="item__pic"><img src="assets/img/world/tale-%s.webp" alt="" width="720" height="720" loading="lazy" decoding="async"><span class="item__tag item__tag--sub">للمشتركين</span></span><small>بودكاست · الحلقة %02d</small><h3>%s</h3></a></li>''' % (BASE, URL['podcast'], n, i + 1, t) for i, (n, t) in enumerate(EPS))

GAMES = [('game/qanadeel/', '', 'assets/img/world/scene-lantern.webp', 'قناديل الأقصى', 'ابحثوا عن كلمات من رحاب الأقصى، وكل كلمة تضيء قنديلا.'),
         ('game/minbar/', ' is-contain', 'game/minbar/img/minbar.webp', 'منبر صلاح الدين', 'أعيدوا بناء المنبر قطعة بعد قطعة.'),
         ('game/album/', '', 'assets/img/world/tale-12.webp', 'صورة وحكاية', 'طابقوا كل صورة بعنوان حكايتها.')]
games = ''.join('''
        <li data-kind="game" data-access="free"><a class="item" href="%s"><span class="item__pic%s"><img src="%s" alt="" loading="lazy" decoding="async"><span class="item__tag">العبوا الآن</span></span><small>لعبة</small><h3>%s</h3><p>%s</p></a></li>''' % g for g in GAMES)

tiles = ''.join('''
        <li data-kind="%s" data-access="both"><a class="tile" href="%s%s" target="_blank" rel="noopener">%s<h3>%s</h3><ul><li><b>مجانا:</b> مواد مختارة</li><li><b>للمشتركين:</b> مواد حصرية وتحديثات مستمرة</li></ul><span class="link">تصفحوا %s<svg class="ic"><use href="#i-left"/></svg></span></a></li>''' % (k, BASE, URL[k], G[k], NAME[k], NAME[k]) for k in ['book', 'video', 'comic', 'cards', 'article'])

BAG = '''<main id="main" data-bag>
<section class="pg-head">
  <div class="wrap">
    <p class="crumbs"><a href="./">الرئيسية</a><span aria-hidden="true">/</span><span>في جعبتنا</span></p>
    <h1>في جعبتنا</h1>
    <p class="pg-lead">نجعل أطفالكم أصحاب قضية. هنا قصص أبطال يحتذى بهم، وحكايا فلسطينية تزرع حب القدس في قلوبهم، وجولة في مدن فلسطين بين حاراتها وأزقتها العريقة.</p>
    <div class="bagfind">
      <label class="sr-only" for="bag-find">ابحث في الجعبة</label>
      <input class="input" id="bag-find" type="search" placeholder="ابحث في الجعبة" autocomplete="off">
      <div class="seg2" role="group" aria-label="نوع الوصول">
        <button type="button" class="is-on" data-access="all" aria-pressed="true">الكل</button>
        <button type="button" data-access="free" aria-pressed="false">مجاني</button>
        <button type="button" data-access="sub" aria-pressed="false">للمشتركين</button>
      </div>
    </div>
  </div>
</section>

<div class="bagbar">
  <div class="wrap">
    <div class="kinds" role="group" aria-label="نوع المحتوى">''' + kinds + '''</div>
  </div>
</div>

<div class="wrap baglist">
  <p class="sr-only" role="status" aria-live="polite"><span data-count>14</span> عنصرا</p>

  <section class="shelf2" aria-labelledby="sh-pod">
    <div class="shelf2__head"><h2 id="sh-pod">حكايات الجدة</h2><p>بودكاست يقدمه رائد ويافا</p></div>
    <ul class="cards">''' + eps + '''
    </ul>
  </section>

  <section class="shelf2" aria-labelledby="sh-games">
    <div class="shelf2__head"><h2 id="sh-games">ألعاب العائلة</h2><p>تلعب على الجوال والحاسوب</p></div>
    <ul class="cards">''' + games + '''
    </ul>
  </section>

  <section class="shelf2" aria-labelledby="sh-more">
    <div class="shelf2__head"><h2 id="sh-more">باقي الجعبة</h2><p>تفتح على المنصة</p></div>
    <ul class="tiles">''' + tiles + '''
    </ul>
  </section>

  <div class="bag-empty" hidden><b>لا شيء بهذا الوصف في الجعبة</b>جربوا كلمة أخرى، أو <button class="link" type="button" data-reset>اعرضوا كل شيء</button>.</div>

  <div class="bag-cta" data-reveal>
    <div><h2>الجعبة كلها تفتح بتوقيع الميثاق</h2><p>مواد حصرية وتحديثات مستمرة للمشتركين، ومحتوى مختار مجانا لكل بيت.</p></div>
    <a class="btn" href="pledge.html"><span class="stitch"></span>توقيع الميثاق</a>
  </div>
</div>
'''

open(ROOT + 'pledge.html', 'w', encoding='utf-8').write(
    shell('توقيع ميثاق العائلة', 'توقيع ميثاق العائلة في ثلاث خطوات، مع اسم عائلتكم على الوثيقة.', None) + PLEDGE + bottom)
open(ROOT + 'bag.html', 'w', encoding='utf-8').write(
    shell('في جعبتنا — ميثاق العائلة', 'كتب وفيديوهات وبودكاست وقصص وبطاقات ومقالات وألعاب تجعل أطفالكم أصحاب قضية.', 'bag.html') + BAG + bottom)
print('built v', V, '| glyphs', len(G))
