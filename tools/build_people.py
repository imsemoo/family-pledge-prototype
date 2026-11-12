"""The participants page, second pass: the six voices on one stage, a face at a time, with the
portraits leading. Names, roles, words and portraits are the ones already on the homepage (the
platform's own). Run through build_guide.py."""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE, 'build_contact.py'), encoding='utf-8').read())   # ROOT, idx, shell, bottom, relink, glyph, NUMBERS, CHAIN ...

_v = idx[idx.index('id="voices"'):]; _v = _v[:_v.index('</section>')]
VOICESET = re.findall(r'<blockquote class="voice__q">(.*?)</blockquote>.*?<img src="([^"]+)"[^>]*>\s*<div><b>(.*?)</b><span>(.*?)</span>', _v, flags=re.S)
assert len(VOICESET) == 6, len(VOICESET)

def size(q): return 'is-long' if len(q) > 260 else 'is-mid' if len(q) > 150 else ''
voices = ''.join('''
          <li class="vc %s" data-voice="%d"%s>
            <img class="vc__face" src="%s" alt="" width="300" height="300"%s>
            <figure><blockquote>%s</blockquote><figcaption><b>%s</b><span>%s</span></figcaption></figure>
          </li>''' % (size(q), i, '' if i == 0 else ' hidden', img, '' if i == 0 else ' loading="lazy" decoding="async"', q.strip(), name, role) for i, (q, img, name, role) in enumerate(VOICESET))
picks = ''.join('<button type="button" data-pick="%d" aria-pressed="%s" aria-label="%s"><img src="%s" alt="" width="300" height="300" loading="lazy" decoding="async"><i></i></button>' % (i, 'true' if i == 0 else 'false', name, img) for i, (q, img, name, role) in enumerate(VOICESET))
mosaic = ''.join('<img src="%s" alt="%s" width="300" height="300">' % (img, name) for q, img, name, role in VOICESET)
roster = ''.join('<li><button type="button" data-pick="%d"><img src="%s" alt="" width="300" height="300" loading="lazy" decoding="async"><span><b>%s</b><small>%s</small></span></button></li>' % (i, img, name, role) for i, (q, img, name, role) in enumerate(VOICESET))

PEOPLE2 = ('''<main id="main" class="pg-voices">
<div class="pj pp">
  <header class="pj__head">
    <div class="pj__in pj__head-in">
      <div class="pj__title">
        <p class="crumbs"><a href="./">الرئيسية</a><span aria-hidden="true">/</span><span>المشاركون</span></p>
        <p class="rd__kind"><span class="dots"><i></i><i></i><i></i></span><span>مجتمع الميثاق</span></p>
        <h1>المشاركون</h1>
        <p class="pj__sub">انضموا إلى الميثاق، ثم دعوا غيرهم إليه. هذه كلماتهم.</p>
        <div class="pj__act"><a class="btn" href="pledge.html"><span class="stitch"></span>انضموا إليهم</a><a class="btn btn--line" href="#voices">اقرؤوا كلماتهم</a></div>
      </div>
      <div class="pj__stage pp__stage">
        <div class="pp__mosaic">%s</div>
        <p class="pj__tag"><span class="pj__ic">''' + glyph('people') + '''</span><b class="num" dir="ltr">+20,000</b><span>شاركوا وانضموا إلى الميثاق</span></p>
      </div>
    </div>
  </header>

  <div class="pj__in">
    <section class="vs" id="voices" data-voices aria-labelledby="h-voices" aria-roledescription="عرض كلمات المشاركين">
      <div class="vs__top"><p class="pj__kick">كلمة من مشارك</p><h2 id="h-voices" class="vs__h">انضموا، ثم دعوا غيرهم</h2>
        <div class="vs__nav"><button type="button" data-vs-prev aria-label="السابق"><svg class="ic"><use href="#i-right"/></svg></button><span class="num" aria-live="polite"><b data-vs-no>1</b> / 6</span><button type="button" data-vs-next aria-label="التالي"><svg class="ic"><use href="#i-left"/></svg></button></div>
      </div>
      <ul class="vs__stage">%s
      </ul>
      <div class="vs__picks" role="group" aria-label="اختاروا مشاركا">%s</div>
    </section>

    <section class="pj__blk" aria-labelledby="h-roster">
      <div class="pj__blk-head"><h2 id="h-roster">من هم</h2><p>اضغطوا على أي اسم لقراءة كلمته.</p></div>
      <ul class="pp__roster">%s</ul>
    </section>
  </div>
</div>
''') % (mosaic, voices, picks, roster) + NUMBERS + '\n' + CHAIN.replace('class="section chain"', 'class="section chain chain--page"') + '\n'

open(ROOT + 'participants.html', 'w', encoding='utf-8', newline='\n').write(
    relink(shell('المشاركون — ميثاق العائلة', 'كلمات من انضموا إلى ميثاق العائلة ودعوا غيرهم إليه.', 'participants.html') + PEOPLE2 + bottom))
print('participants.html built')
