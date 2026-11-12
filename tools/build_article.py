"""One news item, told in pictures: «خطوات صغيرة نحو الأقصى». The wording is the platform's own
(its news page, read 12 Nov 2026), with tanween removed; the full text sits folded under the summary.
Pictures: the item's own photo, and the platform's tale art. Run through build_guide.py."""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE, 'build_project.py'), encoding='utf-8').read())   # ROOT, shell, bottom, relink, LEFT, glyph, way ...

MORE = [
    ('news-1.webp', '27 أكتوبر 2026', 'ما وراء التبرعات: ميثاق العائلة يرسخ التزاما مستداما تجاه فلسطين'),
    ('news-3.webp', '16 أكتوبر 2026', 'مسارات ريادية ومبادرات نوعية.. «نادي الأقصى» يسطر قصة نجاح في المشهد الشبابي الكيني'),
    ('news-4.webp', '16 أكتوبر 2026', 'أكثر من 60 شابة يشاركن في جلسة توعوية لنادي الأقصى بالعاصمة الكينية نيروبي'),
]
more = ''.join('<li><a href="news.html"><img src="assets/img/%s" alt="" width="770" height="770" loading="lazy" decoding="async"><span><time>%s</time><b>%s</b></span></a></li>' % m for m in MORE)

def astep(n, alt, title, text):
    return '''
        <li><figure><img src="assets/img/article/step-%d.webp" alt="%s" width="800" height="600" loading="lazy" decoding="async"><span class="num">%d</span></figure><h3>%s</h3><p>%s</p></li>''' % (n, alt, n, title, text)

def fact(g, label, value, attr=''):
    return '<li><span class="pj__gl">%s</span><div><small>%s</small><b%s>%s</b></div></li>' % (glyph(g), label, attr, value)

SHARE = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.700 0l3.200-3.200a4 4 0 0 0-5.700-5.700L12 6.300M14 10a4 4 0 0 0-5.700 0l-3.200 3.200a4 4 0 0 0 5.700 5.700l1.200-1.200"/></svg>'

ARTICLE = ('''<main id="main">
<article class="pj ar">
  <header class="pj__head">
    <div class="pj__in pj__head-in">
      <div class="pj__title">
        <p class="crumbs"><a href="./">الرئيسية</a><span aria-hidden="true">/</span><a href="news.html">أخبارنا</a><span aria-hidden="true">/</span><span>خطوات صغيرة نحو الأقصى</span></p>
        <p class="rd__kind"><span class="dots"><i></i><i></i><i></i></span><span>الأخبار والأنشطة</span></p>
        <h1>«خطوات صغيرة نحو الأقصى»</h1>
        <p class="pj__sub">رسالة نصرة وأخوة بين أطفال إندونيسيا وفلسطين.</p>
        <ul class="rd__meta">
          <li><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.500" y="5" width="17" height="15.500" rx="3"/><path d="M3.500 10h17M8 3v4M16 3v4"/></svg><time datetime="2026-10-26">26 أكتوبر 2026</time></li>
          <li><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.500"/><path d="M12 7.500V12l3 2"/></svg><span>دقيقة قراءة</span></li>
        </ul>
        <div class="pj__act"><a class="btn" href="#now"><span class="stitch"></span>ماذا يفعل بيتنا الآن؟</a><button class="btn btn--line" type="button" data-copy-link>''' + SHARE + '''<span>نسخ الرابط</span></button></div>
      </div>
      <div class="pj__stage ar__stage">
        <figure class="pj__photo"><img src="assets/img/news-2.webp" alt="أطفال ومعلمات يحملون رسوماتهم في لقاء لنصرة الأقصى" width="770" height="770"></figure>
        <p class="pj__tag"><span class="pj__ic">''' + glyph('globe') + '''</span><b>إندونيسيا</b><span>أطفال من البلدين في قاعة واحدة</span></p>
        <span class="ar__faces" aria-hidden="true"><img src="assets/img/world/face-yafa.webp" alt="" width="190" height="190"><img src="assets/img/world/face-raed.webp" alt="" width="200" height="200"></span>
      </div>
    </div>
  </header>

  <div class="pj__in">
    <ul class="pj__nums pj__nums--band ar__band" aria-label="الخبر في سطور">
      ''' + fact('people', 'المشاركون', 'أطفال من إندونيسيا وفلسطين') + '''
      ''' + fact('heart', 'ضيوف الشرف', 'مؤسسة Ranger Bumi', ' dir="auto"') + '''
      ''' + fact('game', 'الموضوع', 'المسجد الأقصى') + '''
      ''' + fact('play', 'الأنشطة', 'توعية ومسابقات وألعاب') + '''
    </ul>

    <section class="pj__blk" aria-labelledby="h-what">
      <div class="pj__blk-head"><h2 id="h-what">ماذا جرى في الفعالية</h2><p>ثلاث محطات في يوم واحد.</p></div>
      <ol class="pj__steps pj__steps--pic">%s%s%s
      </ol>
    </section>

    <section class="pj__quote" aria-labelledby="h-aim">
      <figure class="pj__quote-pic"><img src="assets/img/world/tale-18.webp" alt="الجدة ورائد ويافا، ويافا تحمل قنديلا، وفوقهم صورة المسجد الأقصى" width="720" height="592" loading="lazy" decoding="async"><figcaption>من حكايات الجدة ورائد ويافا</figcaption></figure>
      <div class="pj__quote-txt">
        <p class="pj__kick">هدف الفعالية</p>
        <h2 id="h-aim">الأقصى في وجدان الناشئة</h2>
        <p>استهدفت الفعالية ترسيخ مكانة المسجد الأقصى المبارك في وجدان الناشئة والأجيال الصاعدة، ومد جسور الأخوة بين الطفل الإندونيسي ونظيره الفلسطيني.</p>
        <details class="pj__more">
          <summary><span>اقرؤوا الخبر كاملا</span><svg class="ic"><use href="#i-down"/></svg></summary>
          <div class="pj__text">
            <p>في إطار ترسيخ القضية الفلسطينية وتجسيد عمق الارتباط الروحي والتاريخي بها، أقيمت الفعالية التعليمية والتفاعلية «خطوات صغيرة نحو الأقصى»، بمشاركة واسعة من الأطفال الإندونيسيين وإخوانهم الفلسطينيين، وبحضور ممثلي مؤسسة Ranger Bumi كضيوف شرف الفعالية.</p>
            <p>استهدفت الفعالية بالدرجة الأولى ترسيخ مكانة المسجد الأقصى المبارك في وجدان الناشئة والأجيال الصاعدة، وتزويدهم بالمعارف والوسائل المبسطة والعملية التي تمكنهم من دعم القضية الفلسطينية والدفاع عنها. كما ركزت على مد جسور التكافل والأخوة وتعميق الاندماج الحي بين الطفل الإندونيسي ونظيره الفلسطيني عبر مساحات تفاعلية مشتركة.</p>
            <p>وشهد البرنامج تنفيذ حزمة متكاملة من الأنشطة، تضمنت فقرة توعوية تثقيفية قدمت محتوى مبسطا وموجها يناسب الفئات العمرية للأطفال حول الأهمية الدينية والتاريخية للمسجد الأقصى وواجب حمايته. تلا ذلك إطلاق مسابقات حركية وألعاب ثقافية مبتكرة مستوحاة من الهوية والتاريخ الفلسطيني، مما أضفى أجواء مفعمة بالبهجة والترابط الإنساني، وبمشاركة ميدانية من فريق مؤسسة Ranger Bumi.</p>
            <p>وأثمرت الفعالية عن مخرجات إيجابية ملموسة، تجسدت في التفاعل اللافت للأطفال واستيعابهم العميق لمفهوم نصرة فلسطين وحماية المقدسات، إلى جانب توطيد أواصر الصداقة بين المشاركين، وتأسيس شراكات وتواصل مستقبلي واعد مع المؤسسات المشاركة.</p>
          </div>
        </details>
      </div>
    </section>

    <section class="pj__now" id="now" aria-labelledby="h-now">
      <div class="pj__blk-head"><h2 id="h-now">ماذا يفعل بيتنا الآن؟</h2><p>الخطوات نفسها تبدأ من البيت.</p></div>
      <ul class="pj__ways">%s%s%s
      </ul>
    </section>

    <div class="pj__pair">
      <a class="pj__card pj__card--wide" href="game/qanadeel/"><img src="assets/img/guide/qanadeel.webp" alt="شاشة لعبة قناديل الأقصى" width="800" height="500" loading="lazy" decoding="async"><span><small>لعبة من الجعبة</small><b>قناديل الأقصى</b><i>ابدؤوا اللعب%s</i></span></a>
      <a class="pj__card" href="cards.html"><img src="assets/img/cards/boycott-p1.webp" alt="" width="1080" height="1350" loading="lazy" decoding="async"><span><small>من الجعبة: القصة في صور</small><b>المقاطعة</b><i>اقرؤوها مع أطفالكم%s</i></span></a>
    </div>

    <section class="pj__blk" aria-labelledby="h-more">
      <div class="pj__blk-head ar__more-head"><h2 id="h-more">المزيد من الأخبار</h2><a class="fh__more" href="news.html">كل الأخبار%s</a></div>
      <ul class="ar__more">%s</ul>
    </section>
  </div>
</article>
''') % (
    astep(1, 'رسم من حكايات الجدة: الجدة تحكي لرائد ويافا عن القدس', 'فقرة توعوية', 'محتوى مبسط يناسب أعمار الأطفال عن أهمية المسجد الأقصى وواجب حمايته.'),
    astep(2, 'رسم من حكايات الجدة: يافا في ملعب يرفرف فيه علم فلسطين', 'مسابقات وألعاب', 'مسابقات حركية وألعاب ثقافية مستوحاة من الهوية والتاريخ الفلسطيني.'),
    astep(3, 'أطفال الفعالية يحملون رسوماتهم', 'صداقات تبقى', 'توطيد أواصر الصداقة بين المشاركين، وتواصل مستقبلي مع المؤسسات المشاركة.'),
    way('yafa', 'يافا', 'قناديل الأقصى', 'لعبة كلمات عن المسجد الأقصى، يلعبها الأطفال في دقائق.', 'game/qanadeel/', 'ابدؤوا اللعب'),
    way('raed', 'رائد', 'حكاية من الجعبة', 'قصص وكتب وبطاقات تقرأ مع الأطفال.', 'bag.html', 'افتحوا الجعبة'),
    way('jadda', 'الجدة', 'ميثاق باسم العائلة', 'عهد من بيتكم يسند بيتا في فلسطين.', 'pledge.html', 'توقيع الميثاق'),
    LEFT, LEFT, LEFT, more)

open(ROOT + 'article.html', 'w', encoding='utf-8', newline='\n').write(
    relink(shell('خطوات صغيرة نحو الأقصى | ميثاق العائلة', 'فعالية تعليمية جمعت أطفال إندونيسيا وفلسطين حول المسجد الأقصى.', 'news.html') + ARTICLE + bottom))

# the item's card, wherever it appears, now opens its own page
for name in ('news.html', 'index.html'):
    p = ROOT + name; h = open(p, encoding='utf-8').read()
    h2 = re.sub(r'href="news\.html"(>\s*<img src="assets/img/news-2\.webp")', r'href="article.html"\1', h)
    if h2 != h: open(p, 'w', encoding='utf-8', newline='\n').write(h2)
print('article.html built')
