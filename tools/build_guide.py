"""The prototype's guide: one page that tells the client what every page is for, how a family moves
between them, what is real and what is a demonstration. Run this one; it runs every other builder first.
Its pictures are captures of the pages themselves (assets/img/guide)."""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE, 'build_family.py'), encoding='utf-8').read())   # ROOT, shell ...

LIVE, DEMO = ('يعمل كاملا', 'live'), ('عرض تجريبي', 'demo')
# group, [ (file, picture, name, what it is for, [what the visitor does], status) ]
GROUPS = [
    ('face', 'الواجهة', 'أول ما يراه الزائر: من أنتم، ولماذا التوقيع.', [
        ('./', 'home', 'الرئيسية', 'تقنع الزائر بالتوقيع من أول شاشة، ثم تريه ما سيناله.', ['يكتب اسم عائلته فيرى توقيعه على الورقة', 'يختار نشاط الليلة للبيت', 'يرى كيف تكبر سلسلة الدعوات'], LIVE),
        ('about.html', 'about', 'تعرف على الميثاق', 'تجيب عن سؤال واحد: ما هذا الميثاق، ومن وراءه؟', ['يقرأ الفكرة في دقيقة', 'يصل إلى التوقيع من أي نقطة'], LIVE),
        ('participants.html', 'participants', 'المشاركون', 'ثقة: شخصيات وعائلات سبقته إلى الميثاق.', ['يقرأ شهادات المشاركين', 'يرى أن غيره سبقه'], LIVE),
        ('projects.html', 'projects', 'مشاريعنا', 'أين يذهب الدعم: مشاريع الميثاق للمرأة المعيلة.', ['يتصفح المشاريع', 'يفهم أثر مشاركته'], LIVE),
        ('news.html', 'news', 'أخبارنا', 'الميثاق حي: نشاطات المجموعات في البلدان.', ['يقرأ آخر الأخبار', 'يتابع نشاط بلده'], LIVE),
        ('contact.html', 'contact', 'تواصل', 'طريق قصير للسؤال: واتساب وبريد ونموذج.', ['يختار وسيلة التواصل', 'يكتب رسالته'], DEMO),
    ]),
    ('sign', 'التوقيع', 'اللحظة التي يصير فيها الزائر عائلة في الميثاق.', [
        ('pledge.html', 'pledge', 'توقيع الميثاق', 'ثلاث خطوات قصيرة تنتهي بوثيقة باسم العائلة.', ['يكتب الاسم والدولة فتمتلئ الوثيقة أمامه', 'يختار نوع الاشتراك', 'يختم الوثيقة وينزلها صورة'], DEMO),
    ]),
    ('home', 'بيت العائلة', 'السبب الذي يعيد العائلة إلى الموقع كل أسبوع.', [
        ('family.html', 'family', 'بيت العائلة', 'لوحة العائلة بعد التوقيع: وثيقتها، وتقدمها، وما عليها هذا الأسبوع.', ['يرى وثيقته مختومة باسمه', 'يتم عهد الأسبوع: اقرؤوا، العبوا، اسألوا', 'يجمع الأختام في دفتره', 'يكمل القصة من حيث توقف'], DEMO),
    ]),
    ('bag', 'الجعبة', 'المحتوى الذي يجعل الأطفال أصحاب قضية.', [
        ('bag.html', 'bag', 'في جعبتنا', 'كل المحتوى في مكان واحد، يصفى بالنوع وبالاشتراك.', ['يختار النوع: كتب، قصص، ألعاب', 'يبحث بالاسم', 'يميز المجاني من الخاص بالمشتركين'], LIVE),
        ('cards.html', 'cards', 'القصة في صور', 'صفحات المنصة كما هي، في كتاب يتقلب.', ['يقلب الصفحات كالكتاب', 'يطبع أو ينزل PDF', 'يقرأ بملء الشاشة مع أولاده'], LIVE),
    ]),
    ('play', 'الألعاب', 'ثلاث ألعاب جديدة مبنية من رسوم المنصة نفسها.', [
        ('game/qanadeel/', 'qanadeel', 'قناديل الأقصى', 'بحث عن الكلمات: كل كلمة تضيء قنديلا.', ['ثلاثة مستويات', 'تلميحات ووقت ونجوم'], LIVE),
        ('game/minbar/', 'minbar', 'منبر صلاح الدين', 'تركيب صورة المنبر قطعة قطعة، ثم بطاقة تذكارية.', ['يدير القطع ويضعها', 'ينزل بطاقة باسمه'], LIVE),
        ('game/album/', 'album', 'صورة وحكاية', 'لعبة ذاكرة: كل صورة تطابق عنوان حكايتها.', ['يقلب البطاقات', 'يحفظ أسماء الحكايات'], LIVE),
    ]),
]
n_pages = sum(len(g[3]) for g in GROUPS)

IC = {
 'eye': '<path d="M2 12s3.600-7 10-7 10 7 10 7-3.600 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
 'pen': '<path d="M12 20h9M16.500 3.500a2.100 2.100 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
 'home': '<path d="m3 10.500 9-7 9 7V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z"/>',
 'book': '<path d="M12 6.500C10 5 7.500 4.500 4 4.500v13c3.500 0 6 .500 8 2 2-1.500 4.500-2 8-2v-13c-3.500 0-6 .500-8 2Zm0 0v13"/>',
 'heart': '<path d="M12 20s-7-4.400-7-10a4 4 0 0 1 7-2.600A4 4 0 0 1 19 10c0 5.600-7 10-7 10Z"/>',
 'check': '<path d="m5 12.500 4.500 4.500L19 7.500"/>',
 'flask': '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.700 3h10.600a2 2 0 0 0 1.700-3l-5-9V3M7.500 15h9"/>',
 'left': '<path d="m14 6-6 6 6 6"/>',
 'globe': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.500 2.500 3.800 5.500 3.800 9s-1.300 6.500-3.800 9c-2.500-2.500-3.800-5.500-3.800-9S9.500 5.500 12 3Z"/>',
 'game': '<rect x="2.500" y="7" width="19" height="11" rx="5.500"/><path d="M7.500 11v3M6 12.500h3M15.500 11.500h.010M18 13.500h.010"/>',
 'print': '<path d="M7 9V3h10v6M7 17H4v-6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6h-3M7 14h10v7H7z"/>',
 'star': '<path d="m12 3 2.700 5.600 6.100.900-4.400 4.300 1 6.100L12 17l-5.400 2.900 1-6.100L3.200 9.500l6.100-.900Z"/>',
}
ic = lambda k: '<svg class="gi" viewBox="0 0 24 24" aria-hidden="true">%s</svg>' % IC[k]

STEPS = [
    ('eye', 'الزيارة', 'الفكرة تفهم من أول شاشة.', './', 'الرئيسية'),
    ('pen', 'التوقيع', 'ثلاث خطوات، ووثيقة باسم العائلة.', 'pledge.html', 'صفحة التوقيع'),
    ('home', 'بيت العائلة', 'الوثيقة، وعهد الأسبوع.', 'family.html', 'افتحوا البيت'),
    ('book', 'القراءة واللعب', 'كل قصة وكل لعبة تترك ختما.', 'bag.html', 'في جعبتنا'),
    ('heart', 'الدعوة', 'فتطول السلسلة بيتا بعد بيت.', 'family.html#invite', 'زر الدعوة'),
]
steps = ''.join('''
      <li><span class="gd-step__n num">%d</span><span class="gd-step__ic">%s</span><h3>%s</h3><p>%s</p><a href="%s">%s%s</a></li>''' % (i + 1, ic(k), t, p, href, name, ic('left')) for i, (k, t, p, href, name) in enumerate(STEPS))

def card(f, pic, name, why, does, st):
    return '''
        <li class="gd-pg">
          <a class="gd-pg__shot" href="%s" aria-label="افتحوا صفحة %s"><span class="gd-pg__bar" aria-hidden="true"><i></i><i></i><i></i></span><img src="assets/img/guide/%s.webp" alt="" width="800" height="500" loading="lazy" decoding="async"></a>
          <div class="gd-pg__txt">
            <p class="gd-pg__top"><b>%s</b><span class="gd-tag gd-tag--%s">%s</span></p>
            <p class="gd-pg__why">%s</p>
            <ul>%s</ul>
            <a class="gd-pg__open" href="%s">افتحوا الصفحة%s</a>
          </div>
        </li>''' % (f, name, pic, name, st[1], st[0], why, ''.join('<li>%s%s</li>' % (ic('check'), d) for d in does), f, ic('left'))

groups = ''.join('''
    <section class="gd-grp" id="g-%s" aria-labelledby="h-%s">
      <div class="gd-grp__head"><span class="num">%02d</span><h3 id="h-%s">%s</h3><p>%s</p></div>
      <ul class="gd-pgs%s">%s
      </ul>
    </section>''' % (k, k, i + 1, k, name, note, ' gd-pgs--one' if len(pages) == 1 else '', ''.join(card(*p) for p in pages)) for i, (k, name, note, pages) in enumerate(GROUPS))
toc = ''.join('<a href="#g-%s">%s</a>' % (k, name) for k, name, _, _ in GROUPS)

def rows(items): return ''.join('<li>%s<span>%s</span></li>' % (ic(k), t) for k, t in items)
NEW = rows([
    ('home', 'بيت للعائلة فيه تقدمها وعهد الأسبوع ودفتر الأختام. لوحة التحكم الحالية تعرض الوثيقة وأحدث المحتوى فقط.'),
    ('book', 'كتاب يتقلب بدل عارض الملفات: الصفحات نفسها من غير أي تغيير.'),
    ('print', 'طباعة وتنزيل وملء الشاشة لكل قصة.'),
    ('game', 'ثلاث ألعاب جديدة من رسوم المنصة: قناديل الأقصى، منبر صلاح الدين، صورة وحكاية.'),
    ('globe', 'أربع لغات من أي صفحة: العربية والإنجليزية والتركية والإندونيسية.'),
    ('star', 'هوية واحدة في كل شيء: اليدان، وورقة الميثاق، والختم.'),
])
REAL = rows([
    ('check', 'نصوص الميثاق والوثيقة والشعار.'),
    ('check', 'صفحات قصة المقاطعة، كما هي على المنصة.'),
    ('check', 'رسوم الجدة ورائد ويافا وحكاياتهم.'),
    ('check', 'شهادات المشاركين وأسماء المشاريع والأخبار.'),
    ('check', 'نوعا الاشتراك: بدون تبرع، وبتبرع.'),
])
DEMOS = rows([
    ('flask', 'لا يوجد تسجيل دخول: بيت العائلة يفترض أن الزائر أتم التوقيع.'),
    ('flask', 'التقدم والأختام واسم العائلة تحفظ في متصفح الزائر فقط.'),
    ('flask', 'لا دفع ولا إرسال: نموذج التواصل والاشتراك بتبرع للعرض.'),
    ('flask', 'عهد الأسبوع ثابت على قصة المقاطعة، ولا يتغير كل أسبوع بعد.'),
    ('flask', 'الترجمة التركية والإندونيسية تحتاج مراجعة من أهل اللغة.'),
])
NEXT = rows([
    ('left', 'صفحة لكل خبر ولكل مشروع، تنتهي بما يفعله البيت الآن.'),
    ('left', 'الكتاب المتقلب لباقي الجعبة: القصص المصورة والكتب.'),
    ('left', 'ربط بيت العائلة بحسابات المنصة الحقيقية.'),
    ('left', 'عهد جديد كل أسبوع، ومسار بحسب عمر الطفل.'),
    ('left', 'خريطة الميثاق: البيوت المشاركة بحسب الدولة.'),
])
ASK = rows([
    ('left', 'الأرقام المعتمدة: عدد العائلات والدول والأطفال والتواقيع.'),
    ('left', 'أي مجموعات «القصة في صور» تدخل أولا.'),
    ('left', 'هل يبقى تنزيل الملفات مفتوحا، أم للمشتركين فقط؟'),
])

sh = shell('دليل النموذج | ميثاق العائلة', 'ما الغرض من كل صفحة في النموذج، وكيف تمشي العائلة بينها.', '')
headpart = sh[:sh.index('<body')]
headpart = re.sub(r'<script\b[^>]*\bsrc=[^>]*></script>\s*', '', headpart)
vv = re.search(r'pages\.css\?v=(\d+)', headpart).group(1)
headpart = headpart.replace('</head>', '<meta name="robots" content="noindex">\n<link rel="stylesheet" href="assets/css/guide.css?v=%s">\n</head>' % vv)

GUIDE = headpart + '''<body class="gd">
<a class="skip" href="#main">تخطي إلى المحتوى</a>
<header class="gd-top">
  <div class="gd-in gd-top__in">
    <a class="gd-brand" href="./"><img src="assets/img/logo-mark.png" alt="" width="46" height="46"><span>ميثاق العائلة</span><i>دليل النموذج</i></a>
    <nav class="gd-toc" aria-label="أقسام الدليل"><a href="#journey">الرحلة</a><a href="#pages">الصفحات</a><a href="#new">الجديد</a><a href="#real">الحقيقي والتجريبي</a><a href="#next">التالي</a></nav>
    <a class="btn btn--s" href="./"><span class="stitch"></span>افتحوا الموقع</a>
  </div>
</header>

<main id="main">
  <section class="gd-hero">
    <div class="gd-in">
      <p class="gd-kick">دليل النموذج</p>
      <h1>كل صفحة، ولماذا وجدت</h1>
      <p class="gd-lead">هذا الدليل يمشي بكم في النموذج: الغرض من كل صفحة، وما يفعله الزائر فيها، وكيف تنتقل العائلة من زيارة أولى إلى بيت تعود إليه كل أسبوع.</p>
      <ul class="gd-nums">
        <li>%s<b class="num">%d</b><span>صفحة</span></li>
        <li>%s<b class="num">3</b><span>ألعاب</span></li>
        <li>%s<b class="num">4</b><span>لغات</span></li>
        <li>%s<b class="num">7</b><span>أختام</span></li>
      </ul>
    </div>
  </section>

  <section class="gd-sec" id="journey" aria-labelledby="h-journey">
    <div class="gd-in">
      <div class="gd-sec__head"><h2 id="h-journey">رحلة العائلة</h2><p>خمس محطات، وكل محطة تسلم إلى التي بعدها.</p></div>
      <ol class="gd-steps">%s
      </ol>
    </div>
  </section>

  <section class="gd-sec gd-sec--pages" id="pages" aria-labelledby="h-pages">
    <div class="gd-in">
      <div class="gd-sec__head"><h2 id="h-pages">الصفحات</h2><p>اضغطوا على أي صورة لفتح الصفحة نفسها.</p><nav class="gd-chips" aria-label="مجموعات الصفحات">%s</nav></div>%s
    </div>
  </section>

  <section class="gd-sec" id="new" aria-labelledby="h-new">
    <div class="gd-in">
      <div class="gd-sec__head"><h2 id="h-new">ما الجديد عن المنصة الحالية</h2></div>
      <ul class="gd-list gd-list--grid">%s</ul>
    </div>
  </section>

  <section class="gd-sec" id="real" aria-labelledby="h-real">
    <div class="gd-in gd-two">
      <div class="gd-box gd-box--real"><h2 id="h-real">حقيقي من منصتكم</h2><ul class="gd-list">%s</ul></div>
      <div class="gd-box gd-box--demo"><h2>تجريبي في هذا النموذج</h2><ul class="gd-list">%s</ul></div>
    </div>
  </section>

  <section class="gd-sec" id="next" aria-labelledby="h-next">
    <div class="gd-in gd-two">
      <div class="gd-box"><h2 id="h-next">الخطوة التالية</h2><ul class="gd-list">%s</ul></div>
      <div class="gd-box gd-box--ask"><h2>نحتاج منكم</h2><ul class="gd-list">%s</ul></div>
    </div>
  </section>

  <section class="gd-end">
    <div class="gd-in"><h2>ابدؤوا من الرئيسية</h2><p>وامشوا الرحلة كما ستمشيها أي عائلة.</p><a class="btn" href="./"><span class="stitch"></span>افتحوا الموقع</a></div>
  </section>
</main>
</body>
</html>
''' % (ic('eye'), n_pages, ic('game'), ic('globe'), ic('star'), steps, toc, groups, NEW, REAL, DEMOS, NEXT, ASK)

open(ROOT + 'guide.html', 'w', encoding='utf-8', newline='\n').write(GUIDE)
print('guide.html built,', n_pages, 'pages listed')
