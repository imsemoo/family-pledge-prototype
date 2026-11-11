"""The picture-story reader: the platform's «المقاطعة» set shown as it is, page by page, in a book that turns.
Run this one; it runs the other builders first. The pages are the set's own eight pages, uncut."""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE, 'build_more.py'), encoding='utf-8').read())   # ROOT, shell, bottom, V, relink ...

CHAPTERS = [('من أين بدأت؟', 2), ('كيف تحولت إلى سلاح عالمي؟', 5), ('ما نتائجها؟', 7)]   # name, the page it opens on
# what each page says, for readers who cannot see the picture
ALT = [
    'الغلاف: المقاطعة. من أين بدأت؟ وكيف تحولت إلى سلاح عالمي؟ وما نتائجها؟',
    'لماذا المقاطعة تحديدا؟ هي أداة ضغط سلمية تعتمد على المستهلك والمؤسسة والدولة. لا تحتاج جيشا ولا قرارا من مجلس أمن، وإنما تحتاج وعيا يتحول إلى سلوك.',
    'ليست وليدة اليوم. بدأت المقاطعة العربية مبكرا، منذ نحو 1922، وفي 2 ديسمبر 1945 قرر مجلس جامعة الدول العربية مقاطعة المنتجات والمصنوعات اليهودية في فلسطين.',
    'ثم تراجعت المقاطعة الرسمية. في الثمانينات تعرضت المقاطعة العربية لانتكاسات، وتراجعت دول عربية عن الالتزام بها مع مسارات التسوية والتطبيع.',
    '2005: لحظة التحول. أطلقت أكثر من 170 منظمة ومؤسسة من المجتمع المدني الفلسطيني نداء عالميا للمقاطعة وسحب الاستثمارات وفرض العقوبات.',
    'كيف تعمل؟ لا تقاطع كل شيء بلا تمييز، بل تستهدف شركات تتورط في الاحتلال والاستيطان، ومؤسسات تمول أو تسلح أو تستفيد، ومنتجات لها رمزية وأثر ملموس.',
    'ماذا حققت؟ تقول حركة BDS إن شركات أوروبية، منها فيوليا وأورانج وCRH، انسحبت من السوق الإسرائيلي بعد حملات ضدها.',
    'هل المقاطعة قرار استهلاكي؟ أم موقف أخلاقي يقول: لن أمول ما يستخدم ضدنا؟',
]
N = len(ALT)
PIC = 'assets/img/cards/boycott-p%d.webp'

def face(n, side):
    lazy = ''   # a lazy picture on the back of a leaf never counts as on screen
    return '<div class="face face--%s" data-page="%d"><img src="%s" alt="%s" width="1080" height="1350"%s decoding="sync" draggable="false"></div>' % (side, n, PIC % n, ALT[n - 1], lazy)

leaves = ''.join('\n        <div class="leaf" data-leaf="%d">%s%s</div>' % (i, face(2 * i + 1, 'front'), face(2 * i + 2, 'back')) for i in range(N // 2))
chips = ''.join('<li><button type="button" data-goto="%d"><span class="num">%02d</span><b>%s</b><i aria-hidden="true"></i><span class="num rd__pp">%d</span></button></li>' % (p, j + 1, name, p) for j, (name, p) in enumerate(CHAPTERS))
thumbs = ''.join('<button type="button" class="rd__thumb" data-goto="%d" aria-label="الصفحة %d"><img src="assets/img/cards/boycott-t%d.webp" alt="" width="200" height="250" loading="lazy" decoding="async"><span class="num">%d</span></button>' % (n, n, n, n) for n in range(1, N + 1))
prints = ''.join('<img src="%s" alt="" width="1080" height="1350">' % (PIC % n) for n in range(1, N + 1))

READER = '''<main id="main">
<section class="rd" data-reader data-pages="%d">
  <div class="rd__head">
    <div class="rd__title">
      <p class="crumbs"><a href="./">الرئيسية</a><span aria-hidden="true">/</span><a href="bag.html#cards">في جعبتنا</a><span aria-hidden="true">/</span><span>القصة في صور</span></p>
      <p class="rd__kind"><span class="dots"><i></i><i></i><i></i></span><span>القصة في صور</span></p>
      <h1>المقاطعة</h1>
      <p class="rd__sub">من أين بدأت؟ وكيف تحولت إلى سلاح عالمي؟ وما نتائجها؟</p>
      <ul class="rd__meta">
        <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6.500C10 5 7.500 4.500 4 4.500v13c3.500 0 6 .500 8 2 2-1.500 4.500-2 8-2v-13c-3.500 0-6 .500-8 2Zm0 0v13"/></svg><span class="num">8</span> <span>صفحات</span></li>
        <li><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.500"/><path d="M12 7.500V12l3 2"/></svg><span class="num">3</span> <span>دقائق</span></li>
        <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9V3h10v6M7 17H4v-6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6h-3M7 14h10v7H7z"/></svg><span>قابلة للطباعة</span></li>
      </ul>
    </div>
    <nav class="rd__toc" aria-label="فصول القصة">
      <p>في هذه القصة</p>
      <ol class="rd__chapters">%s</ol>
    </nav>
  </div>

  <div class="rd__view" data-view>
    <div class="rd__stage">
      <button class="rd__nav rd__nav--prev" type="button" data-prev aria-label="الصفحة السابقة"><svg class="ic"><use href="#i-right"/></svg></button>
      <div class="fb" data-book dir="rtl" tabindex="0" role="group" aria-roledescription="كتاب" aria-label="المقاطعة، قصة في صور. استخدموا الأسهم لتقليب الصفحات">%s
      </div>
      <button class="rd__nav rd__nav--next" type="button" data-next aria-label="الصفحة التالية"><svg class="ic"><use href="#i-left"/></svg></button>
    </div>

    <div class="rd__bar">
      <p class="rd__count num" aria-live="polite" data-no-i18n><b data-rd-no>1</b><span>/</span>%d</p>
      <div class="rd__tools">
        <button type="button" class="rd__tool" data-full><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg><span>ملء الشاشة</span></button>
        <button type="button" class="rd__tool" data-print><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9V3h10v6M7 17H4v-6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6h-3M7 14h10v7H7z"/></svg><span>طباعة</span></button>
        <a class="rd__tool" href="assets/doc/boycott.pdf" download="المقاطعة - ميثاق العائلة.pdf"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0-4.500-4.500M12 15l4.500-4.500M4 20h16"/></svg><span>تحميل PDF</span></a>
        <button type="button" class="rd__tool" data-share><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.700 0l3.200-3.200a4 4 0 0 0-5.700-5.700L12 6.300M14 10a4 4 0 0 0-5.700 0l-3.200 3.200a4 4 0 0 0 5.700 5.700l1.200-1.200"/></svg><span>نسخ الرابط</span></button>
      </div>
    </div>

    <div class="rd__thumbs" role="group" aria-label="كل الصفحات" dir="rtl">%s</div>
  </div>

  <div class="wrap rd__foot">
    <p class="rd__hint">اضغطوا على الصفحة لتقليبها، أو استخدموا الأسهم.</p>
    <div class="rd__next"><a class="btn" href="pledge.html"><span class="stitch"></span>توقيع الميثاق</a><a class="btn btn--line" href="bag.html">باقي الجعبة</a></div>
  </div>
  <div class="rd__print" aria-hidden="true">%s</div>
</section>
''' % (N, chips, leaves, N, thumbs, prints)

open(ROOT + 'cards.html', 'w', encoding='utf-8').write(
    relink(shell('المقاطعة — القصة في صور | ميثاق العائلة', 'المقاطعة في ثماني صفحات مصورة: من أين بدأت، وكيف صارت سلاحا عالميا، وما نتائجها.', 'bag.html') + READER + bottom))

# the bag gets a shelf for the picture story, above «باقي الجعبة»
p = ROOT + 'bag.html'; h = open(p, encoding='utf-8').read()
SHELF = '''  <section class="shelf2" aria-labelledby="sh-cards">
    <div class="shelf2__head"><h2 id="sh-cards">القصة في صور</h2><p>تقلب صفحة بعد صفحة مثل كتاب</p></div>
    <ul class="cards">
        <li data-kind="cards" data-access="sub"><a class="item" href="cards.html"><span class="item__pic"><img src="assets/img/cards/boycott-p1.webp" alt="" width="1080" height="1350" loading="lazy" decoding="async"><span class="item__tag item__tag--sub">للمشتركين</span></span><small>القصة في صور · 8 صفحات</small><h3>المقاطعة: من أين بدأت؟ وكيف تحولت إلى سلاح عالمي؟ وما نتائجها؟</h3></a></li>
    </ul>
  </section>

'''
a = '  <section class="shelf2" aria-labelledby="sh-more">'
assert a in h
if 'sh-cards' not in h: h = h.replace(a, SHELF + a)
open(p, 'w', encoding='utf-8').write(h)
print('cards.html built,', N, 'pages')
