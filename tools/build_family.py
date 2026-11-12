"""The family's home: what a signed family sees when it comes back — its pledge, this week's promise,
where it stopped, and the book of stamps. Run this one; it runs every other builder first.
Progress is read from this browser only (the games' own records, the reader's last page)."""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE, 'build_reader.py'), encoding='utf-8').read())   # ROOT, shell, bottom, relink ...

SEAL = '<svg class="st__ring" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="56"/><circle cx="60" cy="60" r="44"/></svg>'
# key, name, icon, how to earn it, where
STAMPS = [
    ('pledge', 'توقيع الميثاق', 'i-pen', 'ختم البداية', 'pledge.html'),
    ('story', 'قصة المقاطعة', 'i-book', 'اقرؤوا القصة حتى آخر صفحة', 'cards.html'),
    ('qanadeel', 'قناديل الأقصى', 'i-light', 'أضيئوا القناديل كلها', 'game/qanadeel/'),
    ('minbar', 'منبر صلاح الدين', 'i-home', 'أعيدوا بناء المنبر', 'game/minbar/'),
    ('album', 'صورة وحكاية', 'i-image', 'طابقوا كل صورة بحكايتها', 'game/album/'),
    ('week', 'عهد الأسبوع', 'i-check', 'أتموا مهام الأسبوع الثلاث', '#week'),
    ('invite', 'دعوة بيت', 'i-heart', 'ادعوا بيتا آخر إلى الميثاق', '#invite'),
]
stamps = ''.join('''
        <li class="st" data-stamp="%s"><a href="%s"><span class="st__seal">%s<svg class="ic"><use href="#%s"/></svg></span><b>%s</b><small>%s</small></a></li>''' % (k, href, SEAL, ic, name, how) for k, name, ic, how, href in STAMPS)

def task(key, kind, ic, title, note, href, cta):
    return '''
        <li class="tk" data-task="%s">
          <span class="tk__ic"><svg class="ic"><use href="#%s"/></svg></span>
          <p class="tk__kind">%s</p>
          <h3>%s</h3>
          <p class="tk__note">%s</p>
          %s
          <span class="tk__done"><svg class="ic"><use href="#i-check"/></svg><span>تم</span></span>
        </li>''' % (key, ic, kind, title, note, cta % href if href else cta)

tasks = (task('read', 'اقرؤوا', 'i-book', 'المقاطعة: القصة في صور', 'ثماني صفحات تقرأ معا في ثلاث دقائق.', 'cards.html', '<a class="btn btn--s" href="%s"><span class="stitch"></span>افتحوا القصة</a>')
         + task('play', 'العبوا', 'i-light', 'قناديل الأقصى', 'عشرون كلمة مخبأة، وكل كلمة تضيء قنديلا.', 'game/qanadeel/', '<a class="btn btn--s" href="%s"><span class="stitch"></span>ابدؤوا اللعب</a>')
         + task('ask', 'اسألوا', 'i-chat', 'هل المقاطعة قرار استهلاكي، أم موقف أخلاقي؟', 'سؤال من آخر صفحة في القصة، لجلسة العشاء.', None, '<button class="btn btn--s btn--line" type="button" data-ask>تحدثنا عنه</button>'))

FAMILY = '''<main id="main">
<section class="fh" data-family>
  <div class="fh__in">
    <header class="fh__head">
      <div class="fh__hello">
        <p class="crumbs"><a href="./">الرئيسية</a><span aria-hidden="true">/</span><span>بيت العائلة</span></p>
        <p class="rd__kind"><span class="dots"><i></i><i></i><i></i></span><span>بيت العائلة</span></p>
        <h1 data-fam-hello>أهلا بكم في بيتكم</h1>
        <p class="fh__sub">هنا ميثاقكم، وما قرأتموه ولعبتموه، وعهد هذا الأسبوع.</p>
        <ul class="fh__chips">
          <li><svg class="ic"><use href="#i-check"/></svg><span>وقعتم الميثاق</span></li>
          <li class="is-tier"><span>مشارك بدون تبرع</span><a href="pledge.html">ترقية الاشتراك</a></li>
        </ul>
        <form class="fh__name" data-fam-form novalidate>
          <label for="fam-name">اسم العائلة</label>
          <div><input id="fam-name" type="text" maxlength="30" autocomplete="off" placeholder="اكتبوا اسم عائلتكم"><button class="btn btn--s" type="submit">حفظ</button></div>
          <small>يحفظ على هذا الجهاز فقط، ولا يرسل إلى أي مكان.</small>
        </form>
      </div>
      <div class="fh__deed">
        <figure class="cert is-sealed">
          <img src="assets/img/certificate.webp" alt="وثيقة ميثاق العائلة" width="1600" height="1135">
          <span class="cert__fill cert__fill--name is-empty" data-fam-fill aria-hidden="true">اسم عائلتكم</span>
          <span class="cert__seal" aria-hidden="true"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="57" fill="#fff" stroke="#b03a62" stroke-width="2.500"/><circle cx="60" cy="60" r="44" fill="none" stroke="#b03a62" stroke-width="1.200" stroke-dasharray="2 4"/></svg><img src="assets/img/world/seal-mark.webp" alt="" width="360" height="316"></span>
        </figure>
        <a class="fh__open" href="pledge.html">افتحوا ميثاقكم<svg class="ic"><use href="#i-left"/></svg></a>
      </div>
    </header>

    <ul class="fh__stats" aria-label="تقدم العائلة">
      <li><span class="fh__stat-ic"><svg class="ic"><use href="#i-pen"/></svg></span><b class="num"><span data-n-stamps>1</span><i>/ 7</i></b><span>أختام</span></li>
      <li><span class="fh__stat-ic"><svg class="ic"><use href="#i-book"/></svg></span><b class="num"><span data-n-pages>0</span><i>/ 8</i></b><span>صفحات مقروءة</span></li>
      <li><span class="fh__stat-ic"><svg class="ic"><use href="#i-game"/></svg></span><b class="num"><span data-n-games>0</span><i>/ 3</i></b><span>ألعاب منجزة</span></li>
      <li><span class="fh__stat-ic"><svg class="ic"><use href="#i-check"/></svg></span><b class="num"><span data-n-week>0</span><i>/ 3</i></b><span>من عهد الأسبوع</span></li>
    </ul>

    <section class="fh__blk" id="week" aria-labelledby="h-week">
      <div class="fh__blk-head"><h2 id="h-week">عهد هذا الأسبوع</h2><p>ثلاث خطوات صغيرة للبيت كله.</p><span class="fh__bar" aria-hidden="true"><i data-week-bar></i></span></div>
      <ol class="fh__tasks">%s
      </ol>
    </section>

    <div class="fh__two">
      <section class="fh__blk fh__go" aria-labelledby="h-go">
        <div class="fh__blk-head"><h2 id="h-go">كملوا من هنا</h2></div>
        <a class="go" href="cards.html" data-go>
          <img src="assets/img/cards/boycott-t1.webp" alt="" width="200" height="250" data-go-pic>
          <span class="go__txt"><small>القصة في صور</small><b>المقاطعة</b><span data-go-line>لم تبدؤوا القصة بعد.</span><span class="fh__bar" aria-hidden="true"><i data-go-bar></i></span></span>
          <span class="go__cta"><span data-go-cta>ابدؤوا القراءة</span><svg class="ic"><use href="#i-left"/></svg></span>
        </a>
      </section>
      <section class="fh__blk fh__inv" id="invite" aria-labelledby="h-inv">
        <div class="fh__blk-head"><h2 id="h-inv">ادعوا بيتا آخر</h2><p>كل بيت يدعو بيتا، فتطول السلسلة.</p></div>
        <a class="btn" href="pledge.html" data-invite target="_blank" rel="noopener"><span class="stitch"></span>أرسلوا الدعوة على واتساب</a>
      </section>
    </div>

    <section class="fh__blk" aria-labelledby="h-st">
      <div class="fh__blk-head"><h2 id="h-st">دفتر الأختام</h2><p>كل قصة تقرأ وكل لعبة تنجز تترك ختما في دفتركم.</p></div>
      <ul class="fh__stamps">%s
      </ul>
    </section>

    <p class="fh__demo"><span>عرض تجريبي: التقدم يحفظ على هذا الجهاز فقط.</span><button type="button" data-fam-reset>ابدؤوا من جديد</button></p>
  </div>
</section>
''' % (tasks, stamps)

open(ROOT + 'family.html', 'w', encoding='utf-8').write(
    relink(shell('بيت العائلة | ميثاق العائلة', 'بيت عائلتكم في الميثاق: وثيقتكم، عهد هذا الأسبوع، ودفتر الأختام.', 'family.html') + FAMILY + bottom).replace('<a class="acct" href="family.html"', '<a class="acct" href="family.html" aria-current="page"'))
print('family.html built')
