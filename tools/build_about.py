"""The about page, second pass: it opens on the platform's own photograph, says what the pledge is
beside the real certificate, and lets the visitor find themselves among the three audiences.
Every sentence of fact is the platform's (its «من نحن» page). Run through build_guide.py."""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE, 'build_people.py'), encoding='utf-8').read())   # ROOT, shell, bottom, relink, glyph, NUMBERS, CALL ...

# face, (unused), title, line, a whole square scene from the tales (shown uncut), what it shows
AUD = [
    ('raed', '', 'الناشئة', 'الأطفال واليافعون الذين يشكلون جيل المستقبل.', 'tale-01.webp', 'رائد أمام الشاشة، ومعه يافا والجدة'),
    ('jadda', '', 'العائلات المناصرة', 'العائلات التي تغرس القيم في أبنائها.', 'tale-15.webp', 'الجدة تحيك وتحكي لرائد ويافا في غرفة الجلوس'),
    ('yafa', '', 'أحرار العالم', 'المناصرون الذين يؤمنون بعدالة القضية ويقفون إلى جانب الحق.', 'tale-07.webp', 'الجدة ورائد ويافا يمشون في زقاق المخيم تحت العلم'),
]
aud_btn = ''.join('<button type="button" data-aud="%d" aria-pressed="%s"><img src="assets/img/world/face-%s.webp" alt="" width="200" height="200" loading="lazy"><b>%s</b></button>' % (i, 'true' if i == 0 else 'false', f, t) for i, (f, c, t, d, pic, alt) in enumerate(AUD))
aud_pan = ''.join('<li data-aud-pane="%d"%s><figure><img src="assets/img/world/%s" alt="%s" width="720" height="720" loading="lazy" decoding="async"><figcaption>من حكايات الجدة</figcaption></figure><div><small class="num">%d / 3</small><h3>%s</h3><p>%s</p><a href="pledge.html">انضموا إلى الميثاق<svg class="ic"><use href="#i-left"/></svg></a></div></li>' % (i, '' if i == 0 else ' hidden', pic, alt, i + 1, t, d) for i, (f, c, t, d, pic, alt) in enumerate(AUD))

def vow(n, img, alt, g, title, text):
    return '''
        <li><figure><img src="%s" alt="%s" width="800" height="600" loading="lazy" decoding="async"><span class="pj__ic">%s</span></figure><h3>%s</h3><p>%s</p></li>''' % (img, alt, glyph(g), title, text)

ABOUT2 = ('''<main id="main">
<div class="pj ab">
  <header class="ab__hero">
    <img class="ab__photo" src="assets/img/hero.webp" alt="عائلة فلسطينية تجتمع على مائدة بين ركام البيوت" width="1440" height="600">
    <div class="pj__in ab__hero-in">
      <p class="crumbs"><a href="./">الرئيسية</a><span aria-hidden="true">/</span><span>تعرف على الميثاق</span></p>
      <p class="pj__kick">من نحن</p>
      <h1>عهد من بيتك، يسند بيتا في فلسطين</h1>
      <p class="ab__lead">ميثاق عهد تشارك فيه العائلات تعهدا والتزاما بنصرة أهلنا في فلسطين.</p>
      <div class="pj__act"><a class="btn" href="pledge.html"><span class="stitch"></span>توقيع الميثاق</a><a class="btn btn--line" href="#what">ما الميثاق؟</a></div>
    </div>
  </header>

  <div class="pj__in">
    <ul class="pj__nums pj__nums--band ab__band" aria-label="الميثاق في ثلاثة أرقام">
      <li><span class="pj__gl">''' + glyph('heart') + '''</span><div><b class="num" dir="ltr">$10</b><span>تبرع شهري يقدر بعشرة دولارات</span></div></li>
      <li><span class="pj__gl">''' + glyph('week') + '''</span><div><b class="num">12</b><span>شهرا: عام كامل من الالتزام</span></div></li>
      <li><span class="pj__gl">''' + glyph('people') + '''</span><div><b class="num" dir="ltr">+20,000</b><span>شاركوا وانضموا إلى الميثاق</span></div></li>
    </ul>

    <section class="ab__what" id="what" aria-labelledby="h-what">
      <figure class="ab__cert"><img src="assets/img/certificate.webp" alt="وثيقة ميثاق العائلة: نص العهد وتحته خانتان لاسم العائلة والدولة" width="1600" height="1135" loading="lazy" decoding="async"></figure>
      <div class="ab__what-txt">
        <p class="rd__kind"><span class="dots"><i></i><i></i><i></i></span><span>ما الميثاق؟</span></p>
        <h2 id="h-what">وثيقة تحمل اسم عائلتكم</h2>
        <p>تتعهد العائلة بالدعم والتبرع بمبلغ يقدر بعشرة دولارات شهريا لمدة عام، وتحصل على حقيبة توعوية للأسرة، ومواد توعوية شهرية عن القضية الفلسطينية.</p>
        <ul class="ab__gets">
          <li><span class="pj__ic">''' + glyph('sign') + '''</span><div><b>عهد موقع</b><small>وثيقة باسم العائلة ودولتها.</small></div></li>
          <li><span class="pj__ic">''' + glyph('heart') + '''</span><div><b>دعم شهري</b><small>يسند المرأة الفلسطينية المعيلة.</small></div></li>
          <li><span class="pj__ic">''' + glyph('book') + '''</span><div><b>حقيبة توعوية</b><small>تصل البيت، ومعها مواد كل شهر.</small></div></li>
        </ul>
      </div>
    </section>

    <section class="pj__blk ab__aud" data-auds aria-labelledby="h-aud">
      <div class="pj__blk-head"><h2 id="h-aud">لكل من يقف مع الحق</h2><p>أين تجدون أنفسكم؟ اختاروا.</p></div>
      <div class="ab__aud-in">
        <div class="ab__aud-pick" role="group" aria-label="الفئات">%s</div>
        <ul class="ab__aud-stage">%s</ul>
      </div>
    </section>

    <section class="pj__blk" aria-labelledby="h-vows">
      <div class="pj__blk-head"><h2 id="h-vows">القيم والأهداف</h2><p>أربعة يحملها كل توقيع.</p></div>
      <ol class="pj__steps pj__steps--pic ab__vows">%s%s%s%s
      </ol>
    </section>

    <section class="pj__quote ab__video" aria-labelledby="h-video">
      <div class="ab__yt" data-yt="FBhZSTvALNQ">
        <img src="assets/img/world/scene-lantern.webp" alt="" width="1081" height="667" loading="lazy" decoding="async">
        <button type="button" aria-label="شغلوا الفيديو: كيف تحصل على ميثاق العائلة"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.500v13a1 1 0 0 0 1.500.860l11-6.500a1 1 0 0 0 0-1.720l-11-6.500A1 1 0 0 0 8 5.500z"/></svg></button>
      </div>
      <div class="pj__quote-txt">
        <p class="pj__kick">فيديو</p>
        <h2 id="h-video">كيف تحصل على ميثاق العائلة</h2>
        <p>كيفية الانضمام إلى الميثاق والحصول على حقيبة ميثاق العائلة.</p>
        <a class="btn" href="pledge.html"><span class="stitch"></span>أو ابدؤوا التوقيع الآن</a>
      </div>
    </section>
  </div>
</div>
''') % (aud_btn, aud_pan,
        vow(1, 'assets/img/article/step-1.webp', 'رسم من حكايات الجدة: الجدة تحكي عن القدس', 'game', 'التوعية بالقضية', 'إبقاء القضية الفلسطينية حاضرة في كل بيت حول العالم وإحياؤها.'),
        vow(2, 'assets/img/project/step-3.webp', 'سيدة تعمل في برنامج الميثاق للتمكين الاقتصادي للمرأة', 'heart', 'دعم المرأة الفلسطينية', 'دعم وتعزيز صمود المرأة الفلسطينية في بيتها.'),
        vow(3, 'assets/img/world/tale-13.webp', 'رسم من حكايات الجدة: رائد ويافا في دكان الأثواب', 'home', 'ربط الأسرة بالقدس', 'ربط الأسرة فكريا وعاطفيا بالقدس والأقصى المبارك.'),
        vow(4, 'assets/img/news-4.webp', 'شابات في قاعة أثناء جلسة توعوية', 'globe', 'حشد المؤسسات', 'حشد المنظمات والمؤسسات للعمل وتبني قضية فلسطين.'),
        ) + NUMBERS + '\n' + CALL + '\n'

open(ROOT + 'about.html', 'w', encoding='utf-8', newline='\n').write(
    relink(shell('من نحن — ميثاق العائلة', 'تعرف على ميثاق العائلة: الرؤية والأهداف والفئات التي يتوجه إليها.', 'about.html') + ABOUT2 + bottom))
print('about.html built')
