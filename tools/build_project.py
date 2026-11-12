"""One project, told in full and in pictures: «اغرس باسمي شجرة». The wording and the figures are the
platform's own (its project page, read 12 Nov 2026); nothing here is estimated. The pictures are the
project's photo, the women's centre photo, and the platform's own tale art (the grandmother, Raed, Yafa).
Run through build_guide.py."""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE, 'build_family.py'), encoding='utf-8').read())   # ROOT, shell, bottom, relink ...

# place, trees counted (None when the platform gives no figure), what it says, how many saplings to draw
PLACES = [
    ('الأردن', 300, 'شجرة زيتون', 'بالتعاون مع الجمعية العربية لحماية الطبيعة.', 30),
    ('البحرين', 200, 'شجرة', 'أضيفت إلى ما زرع في الأردن.', 20),
    ('ليبيا', None, 'عشرات الأشجار', 'في الساحات الجامعية والمدرسية.', 5),
    ('موريتانيا', None, 'حضور واسع', 'برلماني وشعبي، يوم الزراعة.', 3),
    ('الجزائر', None, 'وصلتها المبادرة', '', 1),
    ('إندونيسيا', None, 'وصلتها المبادرة', '', 1),
    ('تركيا', None, 'وصلتها المبادرة', '', 1),
    ('أوروبا', None, 'وصلتها المبادرة', '', 1),
    ('غرب أفريقيا', None, 'وصلتها المبادرة', '', 1),
    ('جيبوتي', None, 'وصلتها المبادرة', '', 1),
]
SPROUT = glyph('tree')   # the list's small mark is the same tree as the figures
places = ''.join('<li><button type="button" data-place data-n="%s" data-what="%s" data-note="%s" data-trees="%d" aria-pressed="%s">%s<b>%s</b>%s</button></li>' % (
    n or '', what, note, trees, 'true' if i == 0 else 'false', SPROUT, name, '<i class="num">%d</i>' % n if n else '') for i, (name, n, what, note, trees) in enumerate(PLACES))
LEFT = '<svg class="ic"><use href="#i-left"/></svg>'

def step(n, pic, alt, title, text):
    return '''
        <li><figure><img src="assets/img/project/step-%d.webp" alt="%s" width="800" height="600" loading="lazy" decoding="async"><span class="num">%d</span></figure><h3>%s</h3><p>%s</p></li>''' % (pic, alt, n, title, text)

def way(face, who, title, text, href, cta):
    return '''
        <li><span class="pj__who"><img src="assets/img/world/face-%s.webp" alt="" width="200" height="200" loading="lazy" decoding="async"><small>%s</small></span><h3>%s</h3><p>%s</p><a href="%s">%s%s</a></li>''' % (face, who, title, text, href, cta, LEFT)

PROJECT = '''<main id="main">
<article class="pj">
  <header class="pj__head">
    <div class="pj__in pj__head-in">
      <div class="pj__title">
        <p class="crumbs"><a href="./">الرئيسية</a><span aria-hidden="true">/</span><a href="projects.html">مشاريعنا</a><span aria-hidden="true">/</span><span>اغرس باسمي شجرة</span></p>
        <p class="rd__kind"><span class="dots"><i></i><i></i><i></i></span><span>مشاريع الميثاق</span></p>
        <h1>اغرس باسمي شجرة</h1>
        <p class="pj__sub">تخليد اسم طفل شهيد، ودعم لطفل ناج.</p>
        <div class="pj__act"><a class="btn" href="#now"><span class="stitch"></span>شاركوا في المشروع</a><a class="btn btn--line" href="#how">كيف تعمل المبادرة</a></div>
      </div>
      <div class="pj__stage">
        <figure class="pj__photo"><img src="assets/img/proj-tree.webp" alt="طفلة تقف بجانب شتلة مغروسة في حديقة، وعند الشتلة لوحة تحمل اسما" width="1600" height="1066"></figure>
        <img class="pj__raed" src="assets/img/world/raed.webp" alt="" width="307" height="900">
        <p class="pj__tag"><span class="pj__ic">%s</span><b class="num">300</b><span>شجرة زيتون في الأردن</span></p>
      </div>
    </div>
  </header>

  <div class="pj__in">
    <ul class="pj__nums pj__nums--band" aria-label="المشروع بالأرقام">
      <li><span class="pj__gl">%s</span><div><b class="num">300</b><span>شجرة زيتون في الأردن</span></div></li>
      <li><span class="pj__gl">%s</span><div><b class="num">200</b><span>شجرة في البحرين</span></div></li>
      <li><span class="pj__gl">%s</span><div><b class="num">10</b><span>بلدان ومناطق وصلتها المبادرة</span></div></li>
    </ul>

    <section class="pj__blk" id="how" aria-labelledby="h-how">
      <div class="pj__blk-head"><h2 id="h-how">كيف تعمل المبادرة</h2><p>الشجرة تحمل الاسم، وريعها يسند بيتا في غزة.</p></div>
      <ol class="pj__steps pj__steps--pic">%s%s%s
      </ol>
    </section>

    <section class="pj__quote" aria-labelledby="h-story">
      <figure class="pj__quote-pic"><img src="assets/img/world/tale-12.webp" alt="الجدة تحكي لرائد ويافا عن موسم قطف الزيتون" width="720" height="719" loading="lazy" decoding="async"><figcaption>من حكايات الجدة: «جد الزيتون»</figcaption></figure>
      <div class="pj__quote-txt">
        <p class="pj__kick">حكاية المبادرة</p>
        <h2 id="h-story">«الاسم لا يموت حين يزرع»</h2>
        <p>بزغت مبادرة «اغرس باسمي شجرة» من رحم الفقد، وأطلقتها ميثاق العائلة كنداء إنساني؛ لتكتب أسماء الشهداء على جذوع الشجر لا على ألواح القبور.</p>
        <details class="pj__more">
          <summary><span>اقرؤوا الحكاية كاملة</span><svg class="ic"><use href="#i-down"/></svg></summary>
          <div class="pj__text">
            <p>مع كل عدوان وقصف يستشهد طفل، ومع كل ركام يرفع، تنكشف حكاية حلم لم يكتمل. تغرس هذه الأشجار في مواقع متعددة حول العالم، لتتحول إلى شواهد حية على قصص الطفولة المنتهكة، تروي للعالم أن هؤلاء الأطفال لم يكونوا مجرد أرقام في نشرات الأخبار، بل أحلاما نابضة.</p>
            <h3>كيف انتشرت المبادرة</h3>
            <p>شكلت فرق محلية في عدد من الدول، وأعدت المواد التعريفية بالمشروع وترجمت إلى لغات مختلفة. وبدأت حملات الزراعة المجتمعية بمشاركة مؤسسات ومدارس ونشطاء ومواطنين.</p>
            <h3>قصص من الميدان</h3>
            <p>زرعت 300 شجرة زيتون في الأردن بالتعاون مع الجمعية العربية لحماية الطبيعة، وأضيفت 200 شجرة في البحرين، وغرست عشرات الأشجار في الساحات الجامعية والمدرسية بليبيا. أما في موريتانيا فقد شهدت المبادرة حضورا برلمانيا وشعبيا واسعا.</p>
          </div>
        </details>
      </div>
    </section>

    <section class="pj__blk grove" data-grove aria-labelledby="h-where">
      <svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="tree" viewBox="0 0 64 64"><rect x="28.500" y="32" width="7" height="27" rx="3.500" fill="#10303b"/><circle cx="20" cy="29" r="13" fill="var(--c2, #409db7)"/><circle cx="44" cy="28" r="14" fill="var(--c2, #409db7)"/><circle cx="32" cy="18" r="14" fill="var(--c1, #2a7896)"/><circle cx="22" cy="31" r="3.200" fill="#f4b740"/><circle cx="43" cy="24" r="3.200" fill="#c94f78"/></symbol></svg>
      <div class="pj__blk-head grove__head"><div><h2 id="h-where">أين زرعت</h2><p>اختاروا بلدا لتروا ما زرع فيه.</p></div><p class="grove__total"><b class="num">10</b><span>بلدان ومناطق</span></p></div>
      <div class="grove__in">
        <ul class="grove__list" aria-label="البلدان والمناطق">%s</ul>
        <div class="grove__stage" aria-live="polite">
          <p class="grove__name" data-grove-name></p>
          <p class="grove__big"><b class="num" data-grove-n></b><span data-grove-what></span></p>
          <p class="grove__note" data-grove-note></p>
          <div class="grove__field" data-grove-field aria-hidden="true"></div>
          <p class="grove__key" data-grove-key><svg class="grove__tree"><use href="#tree"/></svg><span>كل شجرة هنا تساوي عشر أشجار</span></p>
        </div>
      </div>
    </section>

    <section class="pj__blk pj__vision pj__vision--wide" aria-labelledby="h-vision">
      <img class="pj__vision-pic" src="assets/img/world/scene-study.webp" alt="" width="1200" height="895" loading="lazy" decoding="async">
      <div><p class="pj__kick">الرؤية</p>
      <h2 id="h-vision">حديقة تصير متحفا</h2>
      <p>تحويل حديقة شهداء أطفال غزة إلى متحف بيئي تفاعلي، تتكامل فيه الأشجار مع الشاشات والوسائط، فتروي قصص الأطفال بلغة تصل إلى الأجيال الجديدة.</p></div>
    </section>

    <section class="pj__now" id="now" aria-labelledby="h-now">
      <div class="pj__blk-head"><h2 id="h-now">ماذا يفعل بيتنا الآن؟</h2><p>ثلاث طرق، من الأقرب إلى الأبعد.</p></div>
      <ul class="pj__ways">%s%s%s
      </ul>
    </section>

    <div class="pj__pair">
      <a class="pj__card" href="cards.html"><img src="assets/img/cards/boycott-p1.webp" alt="" width="1080" height="1350" loading="lazy" decoding="async"><span><small>من الجعبة: القصة في صور</small><b>المقاطعة</b><i>اقرؤوها مع أطفالكم%s</i></span></a>
      <a class="pj__card" href="projects.html"><img src="assets/img/proj-center.webp" alt="" width="1600" height="1067" loading="lazy" decoding="async"><span><small>مشروع آخر</small><b>مركز الميثاق لتمكين المرأة المعيلة للأسرة</b><i>كل المشاريع%s</i></span></a>
    </div>
  </div>
</article>
''' % (glyph('tree'), glyph('olive'), glyph('tree'), glyph('globe'),
       step(1, 1, 'شتلة مغروسة وبجانبها لوحة تحمل اسما', 'شجرة باسم كل طفل', 'تزرع شجرة باسم طفل شهيد في غزة، ومعها حلمه الذي لم يتح له أن يتحقق.'),
       step(2, 2, 'رسم من حكايات الجدة: موسم قطف الزيتون', 'الشجرة تثمر', 'يستثمر ريعها المالي، بعد خصم تكاليف الرعاية.'),
       step(3, 3, 'سيدة تعمل في برنامج الميثاق للتمكين الاقتصادي للمرأة', 'الريع يصل إلى غزة', 'دعما للنساء المعيلات وأطفالهن.'),
       places,
       way('jadda', 'الجدة', 'ميثاق باسم العائلة', 'الاشتراك بتبرع يدعم مشاريع الميثاق.', 'pledge.html', 'توقيع الميثاق'),
       way('raed', 'رائد', 'حملة زراعة في بلدكم', 'المبادرة تتوسع إلى بلدان جديدة. تواصلوا مع الفريق.', 'contact.html', 'تواصلوا مع الفريق'),
       way('yafa', 'يافا', 'بيت آخر يعرف', 'أرسلوا المشروع إلى بيت تعرفونه.', 'family.html#invite', 'ادعوا بيتا'),
       LEFT, LEFT)

open(ROOT + 'project.html', 'w', encoding='utf-8', newline='\n').write(
    relink(shell('اغرس باسمي شجرة | ميثاق العائلة', 'شجرة باسم كل طفل شهيد في غزة، وريعها يدعم النساء المعيلات وأطفالهن.', 'projects.html') + PROJECT + bottom))

# the project's card, wherever it appears, now opens its own page
CARD = '<a class="work" data-reveal href="projects.html">\n        <div class="work__photo"><img src="assets/img/proj-tree.webp"'
for name in ('projects.html', 'index.html'):
    p = ROOT + name; h = open(p, encoding='utf-8').read()
    if CARD in h: open(p, 'w', encoding='utf-8', newline='\n').write(h.replace(CARD, CARD.replace('href="projects.html"', 'href="project.html"')))
print('project.html built')
