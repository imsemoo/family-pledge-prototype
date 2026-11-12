"""What the old site had and the new one lacked: the project's profile as a document that can be read, downloaded and
printed; a page for every item of the bag; and the map of where the Pledge has reached (the names are the client's
own, from page 10 of that profile). Run at the end of build_extra.py."""
import json

DL = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m0 0-4.500-4.500M12 15l4.500-4.500M5 19.500h14"/></svg>'
ZOOM = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.800-3.800M11 8v6M8 11h6"/></svg>'
PR = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8V4h10v4M7 17H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M7 14h10v6H7z"/></svg>'

# ---------------------------------------------------------------- the profile: seventeen pages, shown whole
PAGES = ['الغلاف', 'من نحن', 'رؤيتنا ورسالتنا وقيمنا', 'ما هو ميثاق العائلة', 'مواثيقنا', 'لماذا ميثاق العائلة', 'الأهداف العامة', 'ما الذي يميز الميثاق',
         'الفئات المستهدفة والمستفيدون', 'أين وصلنا', 'من المشاريع التي نفذها الميثاق', 'المشاريع الاستراتيجية', 'شركاؤنا', 'أنشطتنا التوعوية', 'منتجاتنا وبرامجنا التوعوية',
         'مبادرة اغرس باسمي شجرة', 'تواصل معنا']
NP = len(PAGES)
dthumbs = ''.join('<button type="button" class="dv__thumb" data-dv-go="%d" aria-label="الصفحة %d: %s"%s><img src="assets/img/profile/t%d.webp" alt="" width="180" height="255" loading="lazy" decoding="async"><span class="num">%d</span></button>'
                  % (i, i, t, ' aria-current="true"' if i == 1 else '', i, i) for i, t in enumerate(PAGES, 1))
PROFILE = ('''<main id="main">
<div class="pj dv" data-dv data-dv-n="%d" data-dv-titles="%s">
  <header class="pj__head dv__head">
    <div class="pj__in dv__head-in">
      <div>
        <p class="crumbs"><a href="./">الرئيسية</a><span aria-hidden="true">/</span><a href="about.html">تعرف على الميثاق</a><span aria-hidden="true">/</span><span>الملف التعريفي</span></p>
        <p class="rd__kind"><span class="dots"><i></i><i></i><i></i></span><span>الملف التعريفي</span></p>
        <h1>ميثاق العائلة في سبع عشرة صفحة</h1>
        <p class="pj__sub">من نحن، ومواثيقنا، ومشاريعنا، وأين وصلنا.</p>
      </div>
      <div class="dv__tools">
        <a class="btn" href="assets/doc/family-pledge-profile.pdf" download="ميثاق العائلة - الملف التعريفي.pdf"><span class="stitch"></span>تنزيل الملف''' + DL + '''</a>
        <button class="btn btn--line" type="button" data-dv-print>''' + PR + '''<span>طباعة</span></button>
      </div>
    </div>
  </header>
  <div class="pj__in">
    <div class="dv__stage">
      <button class="dv__nav dv__nav--prev" type="button" data-dv-prev aria-label="الصفحة السابقة"><svg class="ic"><use href="#i-right"/></svg></button>
      <figure class="dv__page"><div class="dv__sheet" data-dv-sheet><img src="assets/img/profile/p1.webp" alt="الصفحة 1: الغلاف" width="1100" height="1556" data-dv-img></div><figcaption><b data-dv-title>الغلاف</b><button type="button" class="dv__zoom" data-dv-zoom aria-pressed="false">''' + ZOOM + '''<span data-dv-zoom-t>تكبير</span></button><span><i class="num" data-dv-cur>1</i> / <i class="num">%d</i></span></figcaption></figure>
      <button class="dv__nav dv__nav--next" type="button" data-dv-next aria-label="الصفحة التالية"><svg class="ic"><use href="#i-left"/></svg></button>
    </div>
    <div class="dv__strip" data-dv-strip aria-label="صفحات الملف">%s</div>
    <div class="dv__print" data-dv-sheets aria-hidden="true"></div>
  </div>
</div>
''') % (NP, '|'.join(PAGES), NP, dthumbs) + CALL + '\n'
open(ROOT + 'profile.html', 'w', encoding='utf-8', newline='\n').write(
    relink(shell('الملف التعريفي | ميثاق العائلة', 'الملف التعريفي لميثاق العائلة: من نحن، ومواثيقنا، ومشاريعنا، وأين وصلنا.', 'about.html') + PROFILE + bottom))
p = ROOT + 'about.html'; h = open(p, encoding='utf-8').read()
a = '<a class="btn btn--line" href="#what">ما الميثاق؟</a></div>'
if a in h: open(p, 'w', encoding='utf-8', newline='\n').write(h.replace(a, '<a class="btn btn--line" href="#what">ما الميثاق؟</a><a class="btn btn--line" href="profile.html">الملف التعريفي</a></div>', 1))
print('profile.html built,', NP, 'pages')

# ---------------------------------------------------------------- a page for every item of the bag
items = {}
for k in ORDER:
    for i, (t, f, free) in enumerate(ITEMS[k], 1):
        w, hh = size(k, i)
        items['%s-%d' % (k, i)] = dict(k=k, n=KIND[k], t=t, f=int(bool(free)), w=w, h=hh, o=OPEN.get((k, i), ''))
it_gl = ''.join('<template data-it-g="%s">%s</template>' % (k, glyph(GL[k])) for k in ORDER)
ITEM = ('''<main id="main">
<div class="pj it" data-it>
  <div class="pj__in it__in">
    <p class="crumbs"><a href="./">الرئيسية</a><span aria-hidden="true">/</span><a href="bag.html">في جعبتنا</a><span aria-hidden="true">/</span><span data-it-crumb>مادة</span></p>
    <div class="it__grid">
      <figure class="it__cover"><img alt="" data-it-img></figure>
      <div class="it__txt">
        <p class="it__kind"><span class="pj__ic" data-it-glyph></span><span data-it-kind></span></p>
        <h1 data-it-title>من جعبة الميثاق</h1>
        <p class="it__badge" data-it-badge></p>
        <p class="it__line" data-it-line></p>
        <div class="pj__act it__act"><a class="btn" href="pledge.html" data-it-main><span class="stitch"></span><span data-it-cta>توقيع الميثاق</span></a><a class="btn btn--line" href="login.html" data-it-login>لديكم حساب؟ ادخلوا</a></div>
        <div class="it__share"><button class="btn btn--line btn--s" type="button" data-copy-link>''' + SHARE + '''<span>نسخ الرابط</span></button></div>
      </div>
    </div>
    <section class="pj__blk it__more" aria-labelledby="h-same">
      <div class="bg__shelf-head it__shelf-head"><span class="pj__ic" data-it-glyph2></span><div><h2 id="h-same">من الرف نفسه</h2><p><span class="num" data-it-count>0</span> <span>مادة أخرى</span></p></div><a class="fh__more" href="bag.html" data-it-back2>كل الرف''' + LEFT + '''</a></div>
      <div class="bg__rail-wrap" data-it-wrap><ul class="bg__rail" data-rail data-it-rail tabindex="0" aria-label="من الرف نفسه"></ul>
        <button class="bg__arrow bg__arrow--prev" type="button" data-rail-prev aria-label="السابق"><svg class="ic"><use href="#i-right"/></svg></button>
        <button class="bg__arrow bg__arrow--next" type="button" data-rail-next aria-label="التالي"><svg class="ic"><use href="#i-left"/></svg></button></div>
    </section>
  </div>
  <script type="application/json" data-it-data>%s</script>%s
</div>
''') % (json.dumps(items, ensure_ascii=False).replace('</', '<\\/'), it_gl) + CALL + '\n'
open(ROOT + 'item.html', 'w', encoding='utf-8', newline='\n').write(
    relink(shell('من جعبة الميثاق | ميثاق العائلة', 'مادة من جعبة ميثاق العائلة.', 'bag.html') + ITEM + bottom))
print('item.html built,', len(items), 'items')

# ---------------------------------------------------------------- where the Pledge has reached
L0, T0, SC = -30, 65, 5
REACH = [('السودان', 30, 15), ('جزر القمر', 43.3, -11.7), ('ساحل العاج', -5.5, 7.5), ('ألمانيا', 10.4, 51), ('ليبيا', 17, 27), ('البوسنة', 17.8, 44), ('الجزائر', 3, 28),
         ('غامبيا', -16.6, 13.4), ('السنغال', -14.5, 15.2), ('العراق', 44.4, 32.5), ('الأردن', 36.5, 30.8), ('تونس', 9.5, 34), ('إندونيسيا', 110, -7), ('موريتانيا', -10.5, 20),
         ('جيبوتي', 42.6, 11.6), ('ماليزيا', 102, 4), ('البحرين', 50.5, 26), ('تنزانيا', 35, -6), ('تركيا', 34, 39), ('المغرب', -6, 32), ('لبنان', 35.8, 34.2),
         ('فرنسا', 2.5, 46.5), ('كينيا', 38, 0.5), ('كردستان العراق', 44, 36.4)]
pins = ''.join('<button type="button" class="wm__pin" data-wm="%d" style="--x:%.2f%%;--y:%.2f%%" aria-label="%s"></button>' % (i, (lo - L0) * SC / 9.0, (T0 - la) * SC / 5.0, n) for i, (n, lo, la) in enumerate(REACH))
names = ''.join('<li><button type="button" data-wm="%d">%s</button></li>' % (i, n) for i, (n, lo, la) in enumerate(REACH))
MAP = ('''
    <section class="pj__blk wm" data-wmap aria-labelledby="h-wm">
      <div class="pj__blk-head wm__head"><div><h2 id="h-wm">أين وصل الميثاق</h2><p>اضغطوا على اسم بلد لتروه على الخريطة.</p></div>
        <p class="wm__fig"><span class="pj__ic">''' + glyph('globe') + '''</span><b class="num">%d</b><span>بلدا</span></p></div>
      <div class="wm__grid">
        <div class="wm__map">
          <svg viewBox="0 0 900 500" aria-hidden="true"><path d="%s"/></svg>
          %s
          <span class="wm__tip" data-wm-tip hidden></span>
        </div>
        <ul class="wm__list">%s</ul>
      </div>
      <p class="pr__src">الأسماء من الملف التعريفي للميثاق (صفحة «أين وصلنا»، حتى يناير 2024). <a href="profile.html">افتحوا الملف</a></p>
    </section>
''') % (len(REACH), open(os.path.join(HERE, 'world_dots.txt')).read(), pins, names)
p = ROOT + 'participants.html'; h = open(p, encoding='utf-8').read()
a = h.rfind('</main>')
if a > 0 and 'data-wmap' not in h:
    b = h.rfind('</div>\n</div>', 0, a)   # the end of the page's inner column
    assert b > 0
    open(p, 'w', encoding='utf-8', newline='\n').write(h[:b] + MAP + h[b:])
print('map added,', len(REACH), 'places')
