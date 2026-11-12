"""The identity guide: «بين يدين» laid out as a brand book — the idea, the assets, the cast, the one
family of marks, colour and type, what is out, and how it moves. Run this one; it runs every other
builder first. Everything shown is an asset of the platform or was drawn for this site."""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE, 'build_guide.py'), encoding='utf-8').read())   # ROOT, shell, glyph, GLYPHS ...

SEAL = '<svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="57" fill="#fff" stroke="#b03a62" stroke-width="2.500"/><circle cx="60" cy="60" r="44" fill="none" stroke="#b03a62" stroke-width="1.200" stroke-dasharray="2 4"/></svg><img src="assets/img/world/seal-mark.webp" alt="" width="360" height="316">'
X = '<svg class="idx" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>'
OK = '<svg class="idx" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.500 4.500 4.500L19 7.500"/></svg>'

CAST = [
    ('jadda', 'الجدة', 'الراوية', 'حجاب رمادي، نظارة سوداء، ثوب أسود، عكاز. تظهر حين يكون في القسم حكاية أو شرح.', ['تضحك', 'تشرح', 'تتأمل', 'تمشي بعكازها']),
    ('raed', 'رائد', 'السائل', 'شعر بني، كوفية على الكتفين، قميص أزرق فاتح وأفرول كحلي. يظهر عند الفعل والتجربة.', ['يركز', 'يفرح', 'يلعب', 'يقرأ']),
    ('yafa', 'يافا', 'المبادرة', 'شعر بني بمشابك، فستان كحلي بحاشية ملونة. تظهر عند المشاركة والعطاء.', ['تندهش', 'تكتب', 'تساعد', 'تعترض']),
]
cast = ''.join('''
      <li class="id-cast">
        <div class="id-cast__who"><img src="assets/img/world/face-%s.webp" alt="" width="200" height="200" loading="lazy"><div><small>%s</small><h3>%s</h3></div></div>
        <p>%s</p>
        <ul class="id-cast__poses">%s</ul>
      </li>''' % (k, role, name, desc, ''.join('<li><img src="assets/img/world/cast-%s-%d.webp" alt="" width="360" height="360" loading="lazy" decoding="async"><span>%s</span></li>' % (k, i + 1, p) for i, p in enumerate(poses))) for k, name, role, desc, poses in CAST)

RULES = [('نسبة الرأس', 'ثلث طول الطفل تقريبا'), ('العيون', 'كبيرة بلمعة واحدة'), ('الخط', 'بلا حد خارجي أسود، تظليل ناعم'), ('الإضاءة', 'دافئة من مصدر داخل المشهد'),
         ('القص', 'لا يقطع وجها ولا يدا'), ('التكرار', 'مشهد واحد = موضع واحد في الصفحة'), ('رائد الواقف', 'في رأس الصفحة فقط'), ('مشاهد جديدة', 'ترسم بيد رسام المنصة، لا تولد')]
rules = ''.join('<li><b>%s</b><span>%s</span></li>' % r for r in RULES)

NAMES = {'book': 'كتب', 'video': 'فيديو', 'podcast': 'بودكاست', 'comic': 'قصص مصورة', 'cards': 'بطاقات', 'article': 'مقالات', 'game': 'قنديل', 'sign': 'توقيع', 'stamp': 'ختم', 'home': 'بيت',
         'people': 'ناس', 'heart': 'قلب', 'globe': 'العالم', 'tree': 'شجرة', 'olive': 'زيتون', 'week': 'الأسبوع', 'chat': 'سؤال', 'play': 'لعب', 'phone': 'هاتف', 'mail': 'رسالة'}
marks = ''.join('<li><span class="id-mark">%s</span><small>%s</small></li>' % (glyph(k), n) for k, n in NAMES.items())

COLORS = [('#10303B', 'حبر', 'العناوين والأزرار الداكنة', '13.6:1', 1), ('#1F6079', 'أزرق عميق', 'الروابط والنصوص الملونة', '7:1', 1), ('#409DB7', 'أزرق الشعار', 'الأيقونات والتأكيد', '', 1),
          ('#B03A62', 'ورد عميق', 'الزر الأساسي', '5.8:1', 1), ('#E087A6', 'ورد الشعار', 'اللمسات فقط', '', 0), ('#F4B740', 'نور', 'نقطة ضوء واحدة', '', 0), ('#F3F7F9', 'ضباب', 'خلفيات الأقسام', '', 0)]
colors = ''.join('<li class="%s" style="--c:%s"><span></span><b>%s</b><code>%s</code><small>%s</small>%s</li>' % ('is-dark' if dark else '', hx, name, hx, use, '<i>%s</i>' % ratio if ratio else '') for hx, name, use, ratio, dark in COLORS)

OUT = ['التطريز والزخارف التراثية', 'الأنماط المتكررة لملء المساحات', 'رسوم عائلات مولدة', 'شخصيات من أشكال هندسية', 'رسوم جاهزة من مكتبات', 'خلفيات بيج أو ورق دافئ']
out = ''.join('<li>%s<span>%s</span></li>' % (X, o) for o in OUT)

sh = shell('دليل الهوية — بين يدين | ميثاق العائلة', 'هوية ميثاق العائلة: اليدان، الوثيقة، الختم، وشخصيات الحكايات.', '')
headpart = sh[:sh.index('<body')]
headpart = re.sub(r'<script\b[^>]*\bsrc=[^>]*></script>\s*', '', headpart)
vv = re.search(r'pages\.css\?v=(\d+)', headpart).group(1)
headpart = headpart.replace('</head>', '<meta name="robots" content="noindex">\n<link rel="stylesheet" href="assets/css/guide.css?v=%s">\n<link rel="stylesheet" href="assets/css/identity.css?v=%s">\n</head>' % (vv, vv))

IDENTITY = headpart + ('''<body class="gd idg">
<a class="skip" href="#main">تخطي إلى المحتوى</a>
<header class="gd-top">
  <div class="gd-in gd-top__in">
    <a class="gd-brand" href="./"><img src="assets/img/logo-mark.png" alt="" width="46" height="46"><span>ميثاق العائلة</span><i>دليل الهوية</i></a>
    <nav class="gd-toc" aria-label="أقسام الدليل"><a href="#assets">الأصول</a><a href="#cast">الشخصيات</a><a href="#marks">الأيقونات</a><a href="#colour">الألوان والخطوط</a><a href="#motion">الحركة</a></nav>
    <a class="btn btn--s" href="./"><span class="stitch"></span>افتحوا الموقع</a>
  </div>
</header>

<main id="main">
  <section class="id-hero">
    <div class="gd-in id-hero__in">
      <div class="id-hero__txt">
        <p class="pj__kick">دليل الهوية</p>
        <h1>بين يدين</h1>
        <p>الهوية مبنية مما تملكه المنصة فعلا، لا مما يمكن اختراعه: يدا شعارها، وثيقة ميثاقها التي تحمل التوقيع والختم، وشخصيات حكاياتها. كل شيء في الموقع إما ورقة عليها توقيع، أو شيء تحمله اليدان.</p>
        <ul class="id-hero__nums"><li><b class="num">3</b><span>أصول: يدان، وثيقة، ختم</span></li><li><b class="num">3</b><span>شخصيات</span></li><li><b class="num">19</b><span>مشهدا</span></li><li><b class="num">20</b><span>أيقونة</span></li></ul>
      </div>
      <div class="id-hero__art" data-tilt aria-hidden="true">
        <img class="id-hand id-hand--rose" src="assets/img/world/hand-rose.webp" alt="" width="900" height="900">
        <img class="id-hand id-hand--teal" src="assets/img/world/hand-teal.webp" alt="" width="900" height="900">
        <div class="id-sheet"><small>نتعهد، نحن عائلة</small><b>النجار</b><i></i><span class="id-sheet__seal">''' + SEAL + '''</span></div>
      </div>
    </div>
  </section>

  <section class="gd-sec" id="assets" aria-labelledby="h-assets">
    <div class="gd-in">
      <div class="gd-sec__head"><h2 id="h-assets">مكتبة الأصول</h2><p>كلها من المنصة نفسها. لم يولد أي أصل بالذكاء الاصطناعي.</p></div>
      <ul class="id-bento">
        <li class="id-b id-b--hands"><figure><img src="assets/img/world/hand-rose.webp" alt="" width="900" height="900" loading="lazy"><img src="assets/img/world/hand-teal.webp" alt="" width="900" height="900" loading="lazy"></figure><div><h3>اليدان</h3><p>مقصوصتان من الشعار كطبقتين. تحملان الوثيقة في رأس الصفحة، وتنفتحان في الختام. لا تستخدمان إطارا لكل صورة.</p></div></li>
        <li class="id-b id-b--sheet"><figure><div class="id-sheet id-sheet--s"><small>نتعهد، نحن عائلة</small><b>عائلتنا</b><i></i></div></figure><div><h3>الوثيقة</h3><p>ورقة بخط توقيع. هي بطل رأس الصفحة، وشكل نموذج التوقيع.</p></div></li>
        <li class="id-b id-b--seal"><figure><span class="id-seal">''' + SEAL + '''</span></figure><div><h3>الختم</h3><p>قلب الشعار داخل دائرة. يطبع عند التوقيع، ويرافق الأرقام والأختام.</p></div></li>
        <li class="id-b id-b--cast"><figure><img src="assets/img/world/face-jadda.webp" alt="" width="200" height="200" loading="lazy"><img src="assets/img/world/face-raed.webp" alt="" width="200" height="200" loading="lazy"><img src="assets/img/world/face-yafa.webp" alt="" width="190" height="190" loading="lazy"></figure><div><h3>الشخصيات</h3><p>الجدة ورائد ويافا من رسوم المنصة كما هي.</p></div></li>
        <li class="id-b id-b--scene"><figure><img src="assets/img/world/tale-12.webp" alt="" width="720" height="719" loading="lazy"></figure><div><h3>المشاهد</h3><p>19 مشهدا من حلقات البودكاست. المشهد الواحد يظهر في موضع واحد من الصفحة.</p></div></li>
        <li class="id-b id-b--marks"><figure>''' + glyph('book') + glyph('game') + glyph('sign') + glyph('stamp') + '''</figure><div><h3>الأيقونات</h3><p>عائلة واحدة مرسومة بألوان الشعار، أشكال مليئة لا خطوط رفيعة.</p></div></li>
      </ul>
    </div>
  </section>

  <section class="gd-sec gd-sec--pages" aria-labelledby="h-dir">
    <div class="gd-in">
      <div class="gd-sec__head"><h2 id="h-dir">ثلاثة اتجاهات، واختيار واحد</h2><p>قورنت على سؤال واحد: أيها يخص ميثاق العائلة وحدها؟</p></div>
      <ul class="id-dirs">
        <li class="is-pick"><span class="id-dirs__tag">''' + OK + '''المختار</span><h3>هوية هجينة حية</h3><p>يدا الشعار مقصوصتان منه وتتحركان، والوثيقة ورقة حقيقية يكتب عليها الزائر اسم عائلته فتختم، ورسوم المنصة الأصلية داخل اليدين. لا شيء مولد.</p></li>
        <li><span class="id-dirs__tag">''' + X + '''استبعد</span><h3>رسم ثنائي الأبعاد فاخر</h3><p>إعادة رسم الشخصيات بنظام جديد. الرسوم الموجودة جيدة ومتسقة في 19 مشهدا، فإعادة رسمها تكلفة بلا مكسب.</p></li>
        <li><span class="id-dirs__tag">''' + X + '''استبعد</span><h3>عالم ثلاثي الأبعاد</h3><p>وثيقة وختم ويدان مجسمة. يحتاج نماذج لا تملكها المنصة ومكتبة ثقيلة، ويبتعد عن رسوم حكاياتها.</p></li>
      </ul>
    </div>
  </section>

  <section class="gd-sec" id="cast" aria-labelledby="h-cast">
    <div class="gd-in">
      <div class="gd-sec__head"><h2 id="h-cast">الشخصيات</h2><p>كل حالة هنا مقصوصة من مشهد حقيقي. لكل شخصية دور، وتظهر حيث يليق دورها.</p></div>
      <ul class="id-casts">%s
      </ul>
      <ul class="id-rules">%s</ul>
    </div>
  </section>

  <section class="gd-sec gd-sec--pages" id="marks" aria-labelledby="h-marks">
    <div class="gd-in">
      <div class="gd-sec__head"><h2 id="h-marks">عائلة واحدة من الأيقونات</h2><p>عشرون رسمة بصندوق واحد، أشكال مليئة، وألوان الشعار الستة.</p></div>
      <ul class="id-marks">%s</ul>
      <div class="gd-two id-do">
        <div class="gd-box gd-box--real"><h3>''' + OK + '''هكذا</h3><p class="id-do__row"><span class="id-mark">''' + glyph('tree') + '''</span><span class="id-mark">''' + glyph('globe') + '''</span><span class="id-mark">''' + glyph('week') + '''</span></p><p>كل مربع فيه أيقونة يأخذ رسمته من العائلة. المربع نفسه بشكل واحد: أبيض أو ضباب.</p></div>
        <div class="gd-box gd-box--ask"><h3>''' + X + '''ليس هكذا</h3><p class="id-do__row id-do__row--no"><span><svg class="ic" viewBox="0 0 24 24"><path d="M12 22V11M12 14c-4 0-6-2.500-6-6 4 0 6 2.500 6 6Zm0-3c0-3.500 2-6 6-6 0 3.500-2 6-6 6Z"/></svg></span><span><svg class="ic" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.500 2.500 3.800 5.500 3.800 9s-1.300 6.500-3.800 9"/></svg></span><span><svg class="ic" viewBox="0 0 24 24"><path d="m5 12.500 4.500 4.500L19 7.500"/></svg></span></p><p>خط رفيع داخل مربع ملون. الخط الرفيع مكانه داخل الأزرار والروابط فقط.</p></div>
      </div>
    </div>
  </section>

  <section class="gd-sec" id="colour" aria-labelledby="h-colour">
    <div class="gd-in">
      <div class="gd-sec__head"><h2 id="h-colour">الألوان والخطوط</h2><p>وردي وأزرق الشعار، حبر، ورمادي بارد. وخط رقعة للتوقيع فقط.</p></div>
      <ul class="id-colors">%s</ul>
      <ul class="id-type">
        <li><small>العناوين · Baloo Bhaijaan 2</small><p class="id-type__d">عهد من بيتك يسند بيتا في فلسطين</p></li>
        <li><small>النص · Rubik</small><p class="id-type__b">ميثاق عهد تلتزم فيه عائلتك بنصرة أهلنا في فلسطين، وحقيبة توعوية تصل بيتك كل شهر.</p></li>
        <li><small>التوقيع · Aref Ruqaa</small><p class="id-type__s">عائلة النجار</p></li>
      </ul>
    </div>
  </section>

  <section class="gd-sec gd-sec--pages" aria-labelledby="h-out">
    <div class="gd-in">
      <div class="gd-sec__head"><h2 id="h-out">ما خرج من الهوية</h2><p>بطلب صريح، ولا يعود.</p></div>
      <ul class="id-out">%s</ul>
    </div>
  </section>

  <section class="gd-sec" id="motion" aria-labelledby="h-motion">
    <div class="gd-in">
      <div class="gd-sec__head"><h2 id="h-motion">الحركة</h2><p>كل حركة لفعل. جربوها هنا.</p></div>
      <ul class="id-motion">
        <li><div class="id-demo id-demo--stamp" data-stamp><div class="id-sheet id-sheet--s"><small>نتعهد، نحن عائلة</small><b>النجار</b><i></i><span class="id-sheet__seal">''' + SEAL + '''</span></div></div><div><h3>الختم يطبع</h3><p>بعد التوقيع فقط.</p><button class="btn btn--s" type="button" data-stamp-go><span class="stitch"></span>اختموا</button></div></li>
        <li><div class="id-demo id-demo--tilt" data-tilt><div class="id-sheet id-sheet--s"><small>نتعهد، نحن عائلة</small><b>عائلتنا</b><i></i></div></div><div><h3>الوثيقة تميل</h3><p>مع حركة المؤشر. حركوا المؤشر فوقها.</p></div></li>
        <li><div class="id-demo id-demo--hands"><img src="assets/img/world/hand-rose.webp" alt="" width="900" height="900" loading="lazy"><img src="assets/img/world/hand-teal.webp" alt="" width="900" height="900" loading="lazy"></div><div><h3>اليدان تنغلقان</h3><p>عند دخول رأس الصفحة، وتنفتحان في الختام.</p></div></li>
      </ul>
      <ul class="id-rules id-rules--motion"><li><b>مدة الاستجابة</b><span dir="ltr">140–260ms</span></li><li><b>تقليل الحركة</b><span>يلغي كل ما سبق</span></li><li><b>اليدان تشدان</b><span>أثناء كتابة الاسم</span></li></ul>
    </div>
  </section>

  <section class="gd-sec gd-sec--pages" aria-labelledby="h-old">
    <div class="gd-in">
      <div class="gd-sec__head"><h2 id="h-old">النسخ السابقة</h2><p>محفوظة كما كانت، كل واحدة موقع كامل.</p></div>
      <ul class="id-old">
        <li><a href="versions/shapes/"><b>الأشكال المتفاعلة</b><span>شخصيات هندسية تلوح وتقفز.</span></a></li>
        <li><a href="versions/painted-layers/"><b>الهيرو بالطبقات</b><span>عائلتان مرسومتان أمام بيتين.</span></a></li>
        <li><a href="versions/cloth/"><b>الثوب</b><span>يدا جدة تطرزان قرية.</span></a></li>
      </ul>
    </div>
  </section>

  <section class="gd-end">
    <div class="gd-in"><h2>الهوية في مكانها</h2><p>شاهدوها تعمل في الموقع نفسه.</p><a class="btn" href="./"><span class="stitch"></span>افتحوا الموقع</a></div>
  </section>
</main>
<script>
(() => {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-tilt]').forEach((box) => {
    if (still) return;
    box.addEventListener('pointermove', (e) => { const r = box.getBoundingClientRect(); box.style.setProperty('--tx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3)); box.style.setProperty('--ty', ((e.clientY - r.top) / r.height - 0.5).toFixed(3)); });
    box.addEventListener('pointerleave', () => { box.style.setProperty('--tx', 0); box.style.setProperty('--ty', 0); });
  });
  const st = document.querySelector('[data-stamp]'), go = document.querySelector('[data-stamp-go]');
  if (st && go) go.addEventListener('click', () => { st.classList.remove('is-on'); void st.offsetWidth; st.classList.add('is-on'); });
})();
</script>
</body>
</html>
''') % (cast, rules, marks, colors, out)

open(ROOT + 'identity.html', 'w', encoding='utf-8', newline='\n').write(IDENTITY)
print('identity.html built')
