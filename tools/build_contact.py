"""The contact page, second pass: the visitor says what they want first, and the page answers with
the right way to reach the team. Numbers, addresses and the facts in the answers are the platform's own.
Run through build_guide.py."""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE, 'build_article.py'), encoding='utf-8').read())   # ROOT, shell, bottom, relink, LEFT, glyph ...

WA = '<svg class="ic"><use href="#i-chat"/></svg>'
# key, glyph, title, line, the channel it points to, the first words of the message
TOPICS = [
    ('ask', 'sign', 'سؤال عن الميثاق', 'عن التوقيع أو الاشتراك أو الحقيبة.', 'wa', 'عندي سؤال عن ميثاق العائلة:'),
    ('rep', 'people', 'أريد أن أكون مندوبا', 'للمشروع في منطقتي.', 'wa', 'أود أن أكون مندوبا لميثاق العائلة في منطقتي:'),
    ('org', 'globe', 'شراكة مع مؤسسة', 'مدرسة، مسجد، جمعية.', 'mail', 'نود الشراكة مع ميثاق العائلة:'),
    ('fix', 'chat', 'مشكلة في الموقع', 'شيء لا يعمل كما يجب.', 'mail', 'واجهتني مشكلة في الموقع:'),
]
topics = ''.join('''
        <li><button type="button" data-topic="%s" data-way="%s" data-opener="%s" aria-pressed="%s"><span class="pj__gl">%s</span><b>%s</b><small>%s</small></button></li>''' % (k, wayk, opener, 'true' if i == 0 else 'false', glyph(g), t, line) for i, (k, g, t, line, wayk, opener) in enumerate(TOPICS))

FAQ = [
    ('sign', 'ما ميثاق العائلة؟', 'ميثاق عهد تشارك فيه العائلات تعهدا والتزاما بنصرة أهلنا في فلسطين.'),
    ('heart', 'كم قيمة المشاركة؟', 'الاشتراك بتبرع يقدر بعشرة دولارات شهريا لمدة عام. وتوجد مشاركة بدون تبرع.'),
    ('book', 'ماذا يصل بيتي؟', 'حقيبة توعوية للأسرة، ومواد توعوية شهرية عن القضية الفلسطينية.'),
    ('people', 'كيف أصير مندوبا؟', 'اختاروا «أريد أن أكون مندوبا» في أعلى هذه الصفحة، ثم راسلونا.'),
]
faq = ''.join('<details class="ct__q"><summary><span class="pj__ic">%s</span><b>%s</b><svg class="ic"><use href="#i-down"/></svg></summary><p>%s</p></details>' % (glyph(g), q, a) for g, q, a in FAQ)

CONTACT2 = ('''<main id="main">
<div class="pj ct">
  <header class="pj__head">
    <div class="pj__in pj__head-in">
      <div class="pj__title">
        <p class="crumbs"><a href="./">الرئيسية</a><span aria-hidden="true">/</span><span>تواصل</span></p>
        <p class="rd__kind"><span class="dots"><i></i><i></i><i></i></span><span>تواصل</span></p>
        <h1>التواصل المباشر</h1>
        <p class="pj__sub">قولوا لنا ما تريدون، ونختار لكم أقصر طريق.</p>
        <div class="pj__act"><a class="btn" href="https://wa.me/905465276557" target="_blank" rel="noopener" data-ct-wa>''' + WA + '''<span>راسلونا على واتساب</span></a><a class="btn btn--line" href="#faq">أسئلة تتكرر</a></div>
      </div>
      <div class="pj__stage ct__stage">
        <figure class="pj__photo"><img src="assets/img/world/tale-09.webp" alt="الجدة تجلس مع رائد ويافا على الأريكة" width="720" height="720"></figure>
        <p class="pj__tag"><span class="pj__ic">''' + glyph('phone') + '''</span><b class="num" dir="ltr">+90 546 527 65 57</b><span>هاتف وواتساب</span></p>
      </div>
    </div>
  </header>

  <div class="pj__in">
    <section class="pj__blk ct__pick" aria-labelledby="h-topic">
      <div class="pj__blk-head"><h2 id="h-topic">ماذا تريدون؟</h2><p>اختاروا، فتتغير الطريق والرسالة.</p></div>
      <ul class="ct__topics" data-topics>%s
      </ul>
    </section>

    <div class="pj__two ct__two">
      <section class="pj__blk" aria-labelledby="h-ways">
        <div class="pj__blk-head"><h2 id="h-ways">طرق التواصل</h2><p data-ct-hint>الأقصر لهذا الطلب: واتساب.</p></div>
        <ul class="ct__ways">
          <li data-way-card="wa"><span class="pj__gl">''' + glyph('phone') + '''</span><div><small>هاتف وواتساب</small><b class="num" dir="ltr">+90 546 527 65 57</b></div><a class="btn btn--s" href="https://wa.me/905465276557" target="_blank" rel="noopener" data-ct-wa>''' + WA + '''<span>واتساب</span></a><i class="ct__best">الأقصر</i></li>
          <li data-way-card="mail"><span class="pj__gl">''' + glyph('mail') + '''</span><div><small>البريد الإلكتروني</small><b dir="ltr">info@familypledge.com</b></div><a class="btn btn--s btn--line" href="mailto:info@familypledge.com" data-ct-mail><svg class="ic"><use href="#i-mail"/></svg><span>راسلونا</span></a><i class="ct__best">الأقصر</i></li>
          <li><span class="pj__gl">''' + glyph('home') + '''</span><div><small>مكتبنا</small><b dir="ltr">YeniBosna, Istanbul, Türkiye</b></div></li>
        </ul>
        <p class="ct__social"><span>تابعونا</span><a href="https://x.com/familypledge2" target="_blank" rel="noopener" aria-label="X"><svg class="ic" viewBox="0 0 24 24"><path d="M4 4l16 16M20 4 4 20"/></svg></a><a href="https://facebook.com/familypledge2" target="_blank" rel="noopener" aria-label="Facebook"><svg class="ic" viewBox="0 0 24 24"><path d="M14 8h2.500V4.500H14A3.500 3.500 0 0 0 10.500 8v2.500H8V14h2.500v6H14v-6h2.500l.500-3.500H14V8.500a.500.500 0 0 1 .500-.500z"/></svg></a><a href="https://www.instagram.com/family_pledge" target="_blank" rel="noopener" aria-label="Instagram"><svg class="ic"><use href="#i-insta"/></svg></a></p>
      </section>

      <form class="pj__blk reach__form ct__form" data-contact novalidate aria-labelledby="c-h">
        <h2 id="c-h">اكتبوا لنا</h2>
        <p class="ct__chip"><span>الطلب</span><b data-ct-topic>سؤال عن الميثاق</b></p>
        <div class="fld"><label for="c-name">الاسم</label><input class="input" id="c-name" type="text" maxlength="40" autocomplete="off" aria-describedby="c-msg"></div>
        <div class="fld"><label for="c-mail">البريد الإلكتروني</label><input class="input" id="c-mail" type="email" inputmode="email" autocomplete="off" dir="ltr" placeholder="name@example.com" aria-describedby="c-msg"></div>
        <div class="fld"><label for="c-text">رسالتكم</label><textarea class="input" id="c-text" rows="5" maxlength="600" aria-describedby="c-msg" placeholder="عندي سؤال عن ميثاق العائلة:"></textarea></div>
        <p class="fld__msg" id="c-msg" role="alert"></p>
        <button class="btn" type="submit"><span class="stitch"></span>أرسلوا الرسالة</button>
        <p class="demo-note"><b>نموذج تجريبي</b>الرسالة لا ترسل من هذه الصفحة.</p>
      </form>
    </div>

    <section class="pj__quote ct__rep">
      <figure class="pj__quote-pic"><img src="assets/img/world/tale-13.webp" alt="رائد ويافا مع الجدة في دكان الأثواب" width="720" height="720" loading="lazy" decoding="async"></figure>
      <div class="pj__quote-txt">
        <p class="pj__kick">مندوبو الميثاق</p>
        <h2>هل تود أن تكون مندوبا لمشروع ميثاق العائلة في منطقتك؟</h2>
        <p>نحن بانتظارك. لا تتردد في التواصل معنا، فدورك قد يصنع فرقا حقيقيا.</p>
        <button class="btn" type="button" data-ct-rep><span class="stitch"></span>أريد أن أكون مندوبا</button>
      </div>
    </section>

    <section class="pj__blk" id="faq" aria-labelledby="h-faq">
      <div class="pj__blk-head"><h2 id="h-faq">أسئلة تتكرر</h2><p>قد تجدون الجواب قبل أن تكتبوا.</p></div>
      <div class="ct__faq">%s</div>
    </section>
  </div>
</div>
''') % (topics, faq)

open(ROOT + 'contact.html', 'w', encoding='utf-8', newline='\n').write(
    relink(shell('تواصل — ميثاق العائلة', 'تواصلوا مع ميثاق العائلة بالهاتف أو البريد، أو كونوا مندوبا للمشروع في منطقتكم.', 'contact.html') + CONTACT2 + bottom))
print('contact.html built')
