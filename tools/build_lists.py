"""The projects page and the news page, second pass. Projects opens on the women's centre photograph
and tells both projects in pictures (the centre's reasons and production lines are the platform's own
text, shortened). News leads with the newest item and can be narrowed by place.
Run through build_guide.py."""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE, 'build_about.py'), encoding='utf-8').read())   # ROOT, shell, bottom, relink, glyph, way, LEFT, CALL ...

def fact4(g, label, value):
    return '<li><span class="pj__gl">%s</span><div><small>%s</small><b>%s</b></div></li>' % (glyph(g), label, value)

WHY = [
    ('المساعدات ليست حلا مستداما', 'الاعتماد المستمر على المساعدات الإغاثية يجعل النساء في حالة دائمة من التبعية. يوفر المشروع فرص عمل حقيقية تمكن المرأة من تحقيق دخل مستدام.'),
    ('المهارات تصير مصدر دخل', 'تمتلك كثير من النساء المعيلات مهارات في الخياطة والطهي والتطريز والتصنيع اليدوي، لكنهن يفتقدن الدعم والتسويق.'),
    ('الأطفال يبقون في مدارسهم', 'مع غياب المعيل يضطر الأطفال إلى ترك مدارسهم والبحث عن عمل. دخل ثابت للأم يسمح للأطفال بمتابعة تعليمهم.'),
    ('رعاية صحية للأطفال', 'يؤدي الفقر إلى عجز الأمهات عن توفير الرعاية الصحية المناسبة. بالمشروع تتمكن الأمهات من تأمين الاحتياجات الطبية لأطفالهن.'),
]
why = ''.join('<details class="ct__q"><summary><span class="pr__n num">%d</span><b>%s</b><svg class="ic"><use href="#i-down"/></svg></summary><p>%s</p></details>' % (i + 1, q, a) for i, (q, a) in enumerate(WHY))

PROJECTS2 = ('''<main id="main">
<div class="pj ab pr">
  <header class="ab__hero">
    <img class="ab__photo" src="assets/img/proj-center.webp" alt="سيدة تعمل داخل مركز الميثاق لتمكين المرأة المعيلة" width="1600" height="1067">
    <div class="pj__in ab__hero-in">
      <p class="crumbs"><a href="./">الرئيسية</a><span aria-hidden="true">/</span><span>مشاريعنا</span></p>
      <p class="pj__kick">مشاريع الميثاق</p>
      <h1>المرأة المعيلة.. نبض الصمود وأمل الغد</h1>
      <p class="ab__lead">مشاريعنا يد ممدودة للأم المعيلة: تفتح لها أبواب التمكين، وتحمي أطفالها من الانكسار.</p>
      <div class="pj__act"><a class="btn" href="#projects"><span class="stitch"></span>شاهدوا المشاريع</a><a class="btn btn--line" href="pledge.html">توقيع الميثاق</a></div>
    </div>
  </header>

  <div class="pj__in">
    <ul class="pj__nums pj__nums--band ar__band ab__band" aria-label="أين يذهب الدعم">
      ''' + fact4('home', 'ترميم', 'بيت يفتقد الأمان') + '''
      ''' + fact4('heart', 'رعاية صحية', 'تحفظ ابتسامة طفل') + '''
      ''' + fact4('book', 'كفالة تعليم', 'تبني مستقبلا') + '''
      ''' + fact4('tree', 'فرص اقتصادية', 'تعيد الاستقلال والكرامة') + '''
    </ul>

    <section class="pr__list" id="projects" aria-label="المشاريع">
      <article class="pr__card">
        <a class="pr__pic" href="project.html"><img src="assets/img/proj-tree.webp" alt="طفلة تقف بجانب شتلة مغروسة في حديقة" width="1600" height="1066" loading="lazy" decoding="async"><span class="pr__no num">01</span></a>
        <div class="pr__txt">
          <p class="rd__kind"><span class="dots"><i></i><i></i><i></i></span><span>تخليد ودعم</span></p>
          <h2>اغرس باسمي شجرة</h2>
          <p>شجرة باسم كل طفل شهيد في غزة، وريعها يدعم النساء المعيلات وأطفالهن.</p>
          <ul class="pr__facts"><li><span class="pj__ic">''' + glyph('olive') + '''</span><b class="num">300</b><small>زيتونة في الأردن</small></li><li><span class="pj__ic">''' + glyph('tree') + '''</span><b class="num">200</b><small>شجرة في البحرين</small></li><li><span class="pj__ic">''' + glyph('globe') + '''</span><b class="num">10</b><small>بلدان ومناطق</small></li></ul>
          <a class="btn" href="project.html"><span class="stitch"></span>افتحوا المشروع</a>
        </div>
      </article>

      <article class="pr__card pr__card--flip" id="center">
        <div class="pr__pic"><img src="assets/img/project/step-3.webp" alt="سيدة تعمل في برنامج الميثاق للتمكين الاقتصادي للمرأة" width="800" height="600" loading="lazy" decoding="async"><span class="pr__no num">02</span></div>
        <div class="pr__txt">
          <p class="rd__kind"><span class="dots"><i></i><i></i><i></i></span><span>تنموي · اقتصادي · اجتماعي · مستدام</span></p>
          <h2>مركز الميثاق لتمكين المرأة المعيلة للأسرة</h2>
          <p>ينقل النساء من تلقي المساعدات إلى الإنتاج المستدام: فرص عمل حقيقية، ودعم لإنشاء مشاريعهن الخاصة.</p>
          <ul class="pr__lines" aria-label="خطوط الإنتاج"><li>الخياطة والتطريز والكروشيه</li><li>الأغذية المنزلية والمخبوزات</li><li>قاعة عمل بإنترنت وكهرباء</li></ul>
        </div>
      </article>
    </section>

    <section class="pj__blk" aria-labelledby="h-why">
      <div class="pj__blk-head"><h2 id="h-why">لماذا مركز التمكين؟</h2><p>أربعة أسباب من ورقة المشروع. اضغطوا لقراءة كل سبب.</p></div>
      <div class="ct__faq">%s</div>
    </section>

    <section class="pj__now" id="now" aria-labelledby="h-now">
      <div class="pj__blk-head"><h2 id="h-now">ماذا يفعل بيتنا الآن؟</h2><p>ثلاث طرق، من الأقرب إلى الأبعد.</p></div>
      <ul class="pj__ways">%s%s%s
      </ul>
    </section>
  </div>
</div>
''') % (why,
        way('jadda', 'الجدة', 'ميثاق باسم العائلة', 'الاشتراك بتبرع يدعم مشاريع الميثاق.', 'pledge.html', 'توقيع الميثاق'),
        way('raed', 'رائد', 'شراكة مع مؤسستكم', 'مدرسة أو مسجد أو جمعية تحمل مشروعا معنا.', 'contact.html', 'تواصلوا مع الفريق'),
        way('yafa', 'يافا', 'بيت آخر يعرف', 'أرسلوا المشاريع إلى بيت تعرفونه.', 'family.html#invite', 'ادعوا بيتا')) + CALL + '\n'

open(ROOT + 'projects.html', 'w', encoding='utf-8', newline='\n').write(
    relink(shell('مشاريعنا — ميثاق العائلة', 'مشاريع ميثاق العائلة لدعم المرأة الفلسطينية المعيلة وأسرتها.', 'projects.html') + PROJECTS2 + bottom))
print('projects.html built')

# ---------------------------------------------------------------- news
NEWSSET = [
    ('news-1.webp', 'مشهد من فعالية يعرض على الشاشة صورة طفل فلسطيني بين الخيام', '27 أكتوبر 2026', 'تايلاند', 'ما وراء التبرعات: ميثاق العائلة يرسخ التزاما مستداما تجاه فلسطين', ''),
    ('news-2.webp', 'أطفال ومعلمات يحملون رسوماتهم في لقاء لنصرة الأقصى', '26 أكتوبر 2026', 'إندونيسيا', '«خطوات صغيرة نحو الأقصى».. رسالة نصرة وأخوة بين أطفال إندونيسيا وفلسطين', 'article.html'),
    ('news-3.webp', 'أطفال يرفعون أيديهم في جلسة لنادي الأقصى', '16 أكتوبر 2026', 'كينيا', 'مسارات ريادية ومبادرات نوعية.. «نادي الأقصى» يسطر قصة نجاح في المشهد الشبابي الكيني', ''),
    ('news-4.webp', 'شابات يجلسن في قاعة أثناء جلسة توعوية', '16 أكتوبر 2026', 'كينيا', 'أكثر من 60 شابة يشاركن في جلسة توعوية لنادي الأقصى بالعاصمة الكينية نيروبي', ''),
    ('news-5.webp', 'أطفال يجلسون حول طاولة مع معلمتهم', '15 أكتوبر 2026', 'موريتانيا', 'تقرير إنجاز نشاطات مجموعة ميثاق العائلة في موريتانيا', ''),
    ('news-6.webp', 'متطوعان بسترة ميثاق العائلة يحملان ماكينة خياطة إلى المركز', '10 أكتوبر 2026', 'فلسطين', 'افتتاح مركز «وردة» لتمكين النساء المعيلات في خان يونس', ''),
]
PLACES2 = ['فلسطين', 'إندونيسيا', 'كينيا', 'موريتانيا', 'تايلاند']
chips = '<button type="button" data-place-f="" aria-pressed="true">الكل<i class="num">%d</i></button>' % len(NEWSSET) + ''.join(
    '<button type="button" data-place-f="%s" aria-pressed="false">%s<i class="num">%d</i></button>' % (p, p, sum(1 for n in NEWSSET if n[3] == p)) for p in PLACES2)

def ncard(img, alt, date, place, title, href):
    tag = '<span class="nw__place">%s%s</span>' % (glyph('globe'), place) if place else ''
    inner = '<figure><img src="assets/img/%s" alt="%s" width="770" height="770" loading="lazy" decoding="async">%s</figure><div><time>%s</time><h3>%s</h3>%s</div>' % (
        img, alt, tag, date, title, '<span class="nw__go">اقرؤوا الخبر%s</span>' % LEFT if href else '')
    return '<li data-place="%s">%s</li>' % (place, ('<a class="nw__card" href="%s">%s</a>' % (href, inner)) if href else '<div class="nw__card">%s</div>' % inner)

lead = NEWSSET[0]
NEWS2 = ('''<main id="main">
<div class="pj nw">
  <header class="pj__head">
    <div class="pj__in pj__head-in nw__head">
      <div class="pj__title">
        <p class="crumbs"><a href="./">الرئيسية</a><span aria-hidden="true">/</span><span>أخبارنا</span></p>
        <p class="rd__kind"><span class="dots"><i></i><i></i><i></i></span><span>الأخبار والأنشطة</span></p>
        <h1>أخبار الميثاق</h1>
        <p class="pj__sub">ما يجري في ميثاق العائلة ومشاريعه، خبرا بعد خبر.</p>
        <div class="nw__latest"><span class="nw__flag">الخبر الأحدث</span><time>%s</time><h2>%s</h2></div>
      </div>
      <div class="pj__stage nw__stage">
        <div class="nw__mosaic">%s</div>
        <p class="pj__tag"><span class="pj__ic">''' + glyph('article') + '''</span><b class="num">%d</b><span>أخبار في هذه الصفحة</span></p>
      </div>
    </div>
  </header>

  <div class="pj__in">
    <section class="pj__blk" data-news aria-labelledby="h-all">
      <div class="pj__blk-head nw__bar"><div><h2 id="h-all">كل الأخبار</h2><p aria-live="polite" data-news-count></p></div><div class="nw__chips" role="group" aria-label="البلد">%s</div></div>
      <ul class="nw__grid">%s</ul>
    </section>
  </div>
</div>
''') % (lead[2], lead[4], ''.join('<img src="assets/img/%s" alt="%s" width="770" height="770">' % (n[0], n[1]) for n in NEWSSET[1:5]), len(NEWSSET), chips, ''.join(ncard(*n) for n in NEWSSET)) + CALL + '\n'

open(ROOT + 'news.html', 'w', encoding='utf-8', newline='\n').write(
    relink(shell('أخبارنا — ميثاق العائلة', 'أحدث أخبار ميثاق العائلة ومشاريعه.', 'news.html') + NEWS2 + bottom))
print('news.html built')
