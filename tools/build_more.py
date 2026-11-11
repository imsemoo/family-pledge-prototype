"""Second pass: the five remaining pages, and no link left pointing at the old site."""
import re, io, os
HERE = os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE, 'build_pages.py'), encoding='utf-8').read())   # gives ROOT, idx, top, bottom, shell, V

def sec(sid=None, cls=None):
    """One <section> of the homepage, by id or by class."""
    pat = r'<section[^>]*\bid="%s"[^>]*>' % sid if sid else r'<section[^>]*class="[^"]*\b%s\b[^"]*"[^>]*>' % cls
    m = re.search(pat, idx); assert m, (sid, cls)
    return idx[m.start():idx.index('</section>', m.start()) + len('</section>')]

def head(crumb, h1, lead):
    return '''<section class="pg-head">
  <div class="wrap">
    <p class="crumbs"><a href="./">الرئيسية</a><span aria-hidden="true">/</span><span>%s</span></p>
    <h1>%s</h1>
    <p class="pg-lead">%s</p>
  </div>
</section>
''' % (crumb, h1, lead)

GOALS, PROJECTS, NUMBERS, VOICES, NEWS, CALL, CHAIN = sec('goals'), sec('projects'), sec('numbers'), sec('voices'), sec('news'), sec(cls='call'), sec('chain')

ABOUT = '<main id="main">\n' + head('من نحن', 'من نحن', 'ميثاق عهد تشارك فيه العائلات تعهدا والتزاما بنصرة أهلنا في فلسطين، مع التعهد بالدعم والتبرع بمبلغ يقدر بعشرة دولارات شهريا لمدة عام، والحصول على حقيبة توعوية للأسرة ومواد توعوية شهرية عن القضية الفلسطينية.') + '''
<section class="section">
  <div class="wrap who">
    <div class="who__lead" data-reveal>
      <p class="eyebrow"><span class="dots"><i></i><i></i><i></i></span>الرؤية</p>
      <h2>لكل من يقف مع الحق</h2>
      <p>يستهدف مشروع ميثاق العائلة كافة الفئات الداعمة للقضية، من الناشئة الذين يشكلون جيل المستقبل، إلى العائلات المناصرة التي تغرس القيم في أبنائها، وصولا إلى أحرار العالم المناصرين الذين يؤمنون بعدالة القضية ويقفون إلى جانب الحق.</p>
      <p class="who__count"><b class="num">+20,000</b><span>شاركوا وانضموا إلى الميثاق</span></p>
    </div>
    <ol class="who__list" data-stagger>
      <li data-reveal><img src="assets/img/world/cast-raed-2.webp" alt="" width="360" height="360" loading="lazy"><div><h3>الناشئة</h3><p>الأطفال واليافعون الذين يشكلون جيل المستقبل.</p></div></li>
      <li data-reveal><img src="assets/img/world/cast-jadda-1.webp" alt="" width="360" height="360" loading="lazy"><div><h3>العائلات المناصرة</h3><p>العائلات التي تغرس القيم في أبنائها.</p></div></li>
      <li data-reveal><img src="assets/img/world/cast-yafa-1.webp" alt="" width="360" height="360" loading="lazy"><div><h3>أحرار العالم</h3><p>المناصرون الذين يؤمنون بعدالة القضية ويقفون إلى جانب الحق.</p></div></li>
    </ol>
  </div>
</section>
''' + GOALS + '\n' + NUMBERS + '\n' + CALL + '\n'

PEOPLE = '<main id="main" class="pg-voices">\n' + head('المشاركون', 'المشاركون', 'انضموا إلى الميثاق، ثم دعوا غيرهم إليه. هذه كلماتهم.') + VOICES + '\n' + NUMBERS + '\n' + CHAIN.replace('class="section chain"', 'class="section chain chain--page"') + '\n'

PROJ = '<main id="main">\n' + head('مشاريعنا', 'المرأة المعيلة.. نبض الصمود وأمل الغد', 'إنها المرأة الفلسطينية التي تنسج طريق الحياة بخيوط من صبر. تنبثق مشاريعنا لتكون يدا ممدودة لهذه الأم المعيلة: ترميم بيت يفتقد الأمان، رعاية صحية تحفظ ابتسامة طفل، كفالة تعليم تبني مستقبلا، وفرص اقتصادية تعيد لها الاستقلال والكرامة.') + PROJECTS.replace('section--mist', '') + '\n' + CALL + '\n'

NEWSP = '<main id="main">\n' + head('أخبارنا', 'أخبار الميثاق', 'ما يجري في ميثاق العائلة ومشاريعه، خبرا بعد خبر.') + NEWS.replace('section--mist', '') + '\n' + CALL + '\n'

CONTACT = '<main id="main">\n' + head('تواصل', 'التواصل المباشر', 'يمكنكم التواصل معنا للاستفسار عن كل ما يدور في خاطركم.') + '''
<section class="section">
  <div class="wrap reach">
    <div class="reach__side">
      <ul class="reach__cards" data-stagger>
        <li data-reveal><span class="reach__ic"><svg class="ic"><use href="#i-phone"/></svg></span><div><h3>أرقام التواصل</h3><a class="num" href="tel:00905465276557" dir="ltr">+90 546 527 65 57</a></div></li>
        <li data-reveal><span class="reach__ic"><svg class="ic"><use href="#i-mail"/></svg></span><div><h3>تواصل عبر الإيميل</h3><a href="mailto:info@familypledge.com" dir="ltr">info@familypledge.com</a></div></li>
        <li data-reveal><span class="reach__ic"><svg class="ic"><use href="#i-home"/></svg></span><div><h3>مكتبنا</h3><p dir="ltr">YeniBosna, Istanbul, Türkiye</p></div></li>
      </ul>
      <div class="reach__rep" data-reveal>
        <img src="assets/img/world/cast-yafa-2.webp" alt="" width="360" height="360" loading="lazy">
        <div><h3>هل تود أن تكون مندوبا لمشروع ميثاق العائلة في منطقتك؟</h3><p>نحن بانتظارك. لا تتردد في التواصل معنا، فدورك قد يصنع فرقا حقيقيا.</p></div>
      </div>
    </div>
    <form class="reach__form" data-contact novalidate data-reveal aria-labelledby="c-h">
      <h2 id="c-h">اكتبوا لنا</h2>
      <p class="demo-note"><b>نموذج تجريبي</b>الرسالة لا ترسل من هذه الصفحة.</p>
      <div class="fld"><label for="c-name">الاسم</label><input class="input" id="c-name" type="text" maxlength="40" autocomplete="off" aria-describedby="c-msg"></div>
      <div class="fld"><label for="c-mail">البريد الإلكتروني</label><input class="input" id="c-mail" type="email" inputmode="email" autocomplete="off" dir="ltr" placeholder="name@example.com" aria-describedby="c-msg"></div>
      <div class="fld"><label for="c-text">رسالتكم</label><textarea class="input" id="c-text" rows="5" maxlength="600" aria-describedby="c-msg"></textarea></div>
      <p class="fld__msg" id="c-msg" role="alert"></p>
      <button class="btn" type="submit"><span class="stitch"></span>أرسلوا الرسالة</button>
    </form>
  </div>
</section>
'''

PAGES = {
    'about.html': ('من نحن — ميثاق العائلة', 'تعرف على ميثاق العائلة: الرؤية والأهداف والفئات التي يتوجه إليها.', ABOUT),
    'participants.html': ('المشاركون — ميثاق العائلة', 'كلمات من انضموا إلى ميثاق العائلة ودعوا غيرهم إليه.', PEOPLE),
    'projects.html': ('مشاريعنا — ميثاق العائلة', 'مشاريع ميثاق العائلة لدعم المرأة الفلسطينية المعيلة وأسرتها.', PROJ),
    'news.html': ('أخبارنا — ميثاق العائلة', 'أحدث أخبار ميثاق العائلة ومشاريعه.', NEWSP),
    'contact.html': ('تواصل — ميثاق العائلة', 'تواصلوا مع ميثاق العائلة بالهاتف أو البريد، أو كونوا مندوبا للمشروع في منطقتكم.', CONTACT),
}
for name, (title, desc, body) in PAGES.items():
    open(ROOT + name, 'w', encoding='utf-8').write(shell(title, desc, name) + body + bottom)

# ---------- every link stays inside the new theme ----------
BAGKIND = {'0365A4D4-331F-4413-8425-46404BDC7E52': 'book', '9B9ADEDA-D1C1-42F5-B54E-0431583C9DA7': 'video', 'E4BD7361-27D6-4E74-BD48-109342E804C6': 'podcast',
           'A4F98A1A-BC7D-4CC7-BB35-E11887B54A46': 'comic', '5A2B2E83-4B3C-4736-9ECC-AFD58BC483AF': 'cards', '9E7EA6E5-BE27-4FE5-90D8-865FF315D93C': 'article'}
NEWSID = ['114D76E4', '28E56246', '2D177F82', '4AEB2609', '7B17D5E6']

def relink(s, up=''):
    O = 'https://familypledge.org/'
    for a, b in (('Aboutus', 'about.html'), ('whoshare', 'participants.html'), ('Projects', 'projects.html'), ('News', 'news.html'), ('Contactus', 'contact.html'),
                 ('ReadPledge', 'pledge.html'), ('SharePledge', 'pledge.html'), ('Ourbag', 'bag.html')):
        s = s.replace('"%s%s"' % (O, a), '"%s%s"' % (up, b)).replace("'%s%s'" % (O, a), "'%s%s'" % (up, b))
    s = re.sub(re.escape(O) + r'Bagdetails/([0-9A-F-]+)(#\w+)?', lambda m: '%sbag.html#%s' % (up, BAGKIND.get(m.group(1), 'all')), s)
    s = re.sub(re.escape(O) + r'Games/[0-9A-F-]+(#\w+)?', '%sbag.html#game' % up, s)
    s = re.sub(re.escape(O) + r'project/[0-9A-F-]+', '%sprojects.html' % up, s)
    s = re.sub(re.escape(O) + r'details/[0-9A-F-]+', '%snews.html' % up, s)
    # links that used to open the old site in a new tab now stay in this tab
    s = re.sub(r'(href="(?:\.\./\.\./)?[a-z]+\.html(?:#\w+)?")\s+target="_blank"\s+rel="noopener"', r'\1', s)
    return s

FILES = [('index.html', ''), ('pledge.html', ''), ('bag.html', ''), ('about.html', ''), ('participants.html', ''), ('projects.html', ''), ('news.html', ''), ('contact.html', ''),
         ('assets\\js\\world.js', ''), ('assets\\js\\pages.js', ''), ('game\\qanadeel\\index.html', '../../'), ('game\\minbar\\index.html', '../../'), ('game\\album\\index.html', '../../'), ('game\\album\\album.js', '../../')]
left = {}
for f, up in FILES:
    p = ROOT + f; s = open(p, encoding='utf-8').read(); t = relink(s, up)
    # the language menu no longer leaves the site: it switches the page in place
    t = re.sub(r'<li><a href="https://familypledge\.org/" lang="(\w+)" dir="ltr">', r'<li><a href="?lang=\1" data-lang="\1" lang="\1" dir="ltr">', t)
    t = t.replace('<li><a href="./" aria-current="true" lang="ar">', '<li><a href="?lang=ar" data-lang="ar" aria-current="true" lang="ar">')
    if t != s: open(p, 'w', encoding='utf-8').write(t)
    n = len(re.findall(r'familypledge\.org', t))
    if n: left[f] = re.findall(r'.{0,40}familypledge\.org.{0,30}', t)
print('pages:', ', '.join(PAGES)); print('old-site links left:', left or 'none')
