"""The pages that closed the gaps: the four remaining news items, the empowerment centre, a sign-in
screen (a picture of one: it stores and sends nothing) and the not-found page.
News wording is the platform's own (read 12 Nov 2026), tanween removed, long text folded.
Run through build_guide.py."""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE, 'build_bag.py'), encoding='utf-8').read())   # ROOT, shell, bottom, relink, glyph, way, LEFT, CALL, NEWSSET ...

def fact(g, label, value, attr=''):
    return '<li><span class="pj__gl">%s</span><div><small>%s</small><b%s>%s</b></div></li>' % (glyph(g), label, attr, value)

NEWS = {
 'news-bangkok.html': dict(img='news-1.webp', alt='مشهد من فعالية يعرض على الشاشة صورة طفل فلسطيني بين الخيام', date='27 أكتوبر 2026', iso='2026-10-27', place='تايلاند',
   title='ما وراء التبرعات', sub='ميثاق العائلة يرسخ التزاما مستداما تجاه فلسطين.', crumb='ما وراء التبرعات',
   facts=[('globe', 'المكان', 'بانكوك، تايلاند', ''), ('week', 'الموعد', 'من 4 إلى 6 سبتمبر', ''), ('people', 'المنظمون', 'CHNS و Halal Trend', ' dir="auto"'), ('sign', 'الشعار', 'ليس تبرعا، بل عهد والتزام', '')],
   points=[('cast-jadda-2.webp', 'عرض تعريفي', 'قدمته الأخت خديجة نوارات والأخت سونيسا عن المبادرة ورسالتها.'), ('tale-16.webp', 'مواد مرئية', 'استعرضت أنشطة ميثاق العائلة ومشاريعه.'), ('tale-07.webp', 'جسور جديدة', 'تواصل مع المؤسسات والمجتمعات، وتوسيع شبكة الداعمين.')],
   kick='شعار المشاركة', quote='ليس تبرعا، بل عهد والتزام', lead='يسعى ميثاق العائلة إلى ترسيخ التزام مستدام تجاه فلسطين، يتجاوز فكرة التبرع لمرة واحدة ليصبح عهدا متجددا ومسؤولية مشتركة.', pic='tale-09.webp',
   text=['في إطار جهوده المستمرة لنشر الوعي بالقضية الفلسطينية ودعم صمود الأسر الفلسطينية، شارك ميثاق العائلة في فعالية نظمتها منظمتا CHNS وHalal Trend خلال الفترة من 4 إلى 6 سبتمبر في العاصمة التايلاندية بانكوك.',
         'وقد نظم اليوم الأول بالتعاون بين إدارتي شؤون اللاجئين المحليين والشؤون الخارجية في منظمة CHNS، وترأسه نائب وزير الداخلية التايلاندي، فيما استضافت وزارة الخارجية اليوم الختامي للفعالية.',
         'وجاءت مشاركة ميثاق العائلة ضمن البرنامج المخصص للتعريف بالمبادرة ورسالتها، حيث قدمت الأخت خديجة نوارات والأخت سونيسا عرضا تعريفيا بالمبادرة تحت شعار يجسد رسالتها الأساسية: «ميثاق العائلة: ليس تبرعا، بل عهد والتزام».',
         'وسلط العرض الضوء على رسالة ميثاق العائلة في إبقاء القضية الفلسطينية حاضرة في وجدان الأسر والمجتمعات، كما استعرض جهود المبادرة ومشاريعها الهادفة إلى دعم الأسر الفلسطينية، وتمكين النساء، وتعزيز المشاركة المجتمعية المستدامة.',
         'وتأتي هذه المشاركة امتدادا لجهود ميثاق العائلة في بناء جسور التواصل مع المؤسسات والمجتمعات حول العالم، وتعريف المزيد من الأسر برسالته، وتوسيع شبكة الداعمين الملتزمين بقضيته في بانكوك وخارجها.']),
 'news-aqsa-club.html': dict(img='news-3.webp', alt='أطفال يرفعون أيديهم في جلسة لنادي الأقصى', date='16 أكتوبر 2026', iso='2026-10-16', place='كينيا',
   title='«نادي الأقصى» في نيروبي', sub='مسارات ريادية ومبادرات نوعية في المشهد الشبابي الكيني.', crumb='نادي الأقصى',
   facts=[('globe', 'المكان', 'نيروبي، كينيا', ''), ('people', 'الحضور', 'نحو 100 طفل وشاب', ''), ('week', 'في العام', 'ثلاث محطات كبرى', ''), ('book', 'إصدار', 'كتيب «الأقصى صدى تاريخ مقدس»', '')],
   points=[('cast-raed-4.webp', 'يوم السيرة النبوية', 'في 16 مايو.'), ('tale-18.webp', 'يوم الأقصى', 'في 31 مايو.'), ('cast-yafa-3.webp', 'الملتقى الشبابي', 'في 13 أغسطس، بقيادة فريق تطوعي.')],
   kick='شعار النادي', quote='عش مع الأقصى', lead='أعلن «نادي الأقصى»، المبادرة المنبثقة عن ميثاق العائلة بالتعاون مع الائتلاف العالمي للمرأة للقدس وفلسطين، حصاد إنجازاته لعام 2026.', pic='tale-17.webp',
   text=['في محطة استثنائية تعكس عمق الرسالة وحيوية العمل الميداني، أعلن «نادي الأقصى» المبادرة المنبثقة عن «ميثاق العائلة» بالتعاون مع الائتلاف العالمي للمرأة للقدس وفلسطين، عن حصاد إنجازاته لعام 2026 في العاصمة الكينية نيروبي.',
         'نجح النادي في توسيع حضوره المؤسسي عبر استمرار الأنشطة في مدرسة «فتح المنان»، والتحضير للبدء في مدرستي «أترجة» و«نور البيان»، مستقطبا نحو 100 طفل وشاب. وشهد العام تنظيم ثلاث محطات كبرى، شملت يوم السيرة النبوية (16 مايو)، ويوم الأقصى (31 مايو)، والملتقى الشبابي (13 أغسطس)، بقيادة فريق تطوعي ضم حفصة، زينب، ماهره، وسميرة.',
         'وفي ذات السياق، نظمت «منظمة مرشدات» ندوة عطلة المراهقين لأكثر من 60 فتاة تحت شعار «فضائل المسجد الأقصى»، متضمنة عروضا تثقيفية ونقاشات جماعية عززت الارتباط الوجداني بالمقدسات.',
         'وعلى صعيد الابتكار، أصدر النادي كتيبا طلابيا بعنوان «الأقصى صدى تاريخ مقدس» بمعايير تفاعلية قائمة على الأسئلة والأجوبة، مدعوما بأنشطة ترفيهية وتربوية لتبقى شعلة شعار «عش مع الأقصى» حية في نفوس الأجيال الناشئة.']),
 'news-nairobi.html': dict(img='news-4.webp', alt='شابات يجلسن في قاعة أثناء جلسة توعوية', date='16 أكتوبر 2026', iso='2026-10-16', place='كينيا',
   title='أكثر من 60 شابة في جلسة لنادي الأقصى', sub='جلسة توعوية تفاعلية في العاصمة الكينية نيروبي.', crumb='جلسة نادي الأقصى',
   facts=[('globe', 'المكان', 'مسجد «تنزيل»، نيروبي', ''), ('week', 'الموعد', 'الخميس 13 أغسطس 2026', ''), ('people', 'سجلن في المسابقة', '30 فتاة من 10 مدارس', ''), ('heart', 'بالتعاون مع', 'NAMLEF Leaders Forum', ' dir="auto"')],
   points=[('cast-jadda-2.webp', 'عرض تقديمي', '«الأقصى: الماضي، الحاضر، والوعد».'), ('cast-raed-4.webp', 'كتيب نادي الأقصى', 'التعريف الرسمي بالكتيب أداة معرفية للناشئة.'), ('cast-yafa-1.webp', 'ورشة عمل جماعية', 'مجموعات تناقش مبادرات عملية لإبقاء القضية حية.')],
   kick='شعار الجلسة', quote='عش مع الأقصى', lead='أبدت 30 فتاة يمثلن 10 مدارس مختلفة رغبتهن بالانضمام والتسجيل في «مسابقة نادي الأقصى للمدارس».', pic='tale-18.webp',
   text=['في إطار الجهود الشبابية والتثقيفية المستمرة، نظم «نادي الأقصى» بالتعاون مع منتدى القادة المسلمين (NAMLEF Leaders Forum) جلسة توعوية تفاعلية يوم الخميس 13 أغسطس 2026 في مسجد «تنزيل» بالعاصمة الكينية نيروبي، وذلك ضمن فعاليات الملتقى الشبابي الجامع.',
         'وانطلقت الجلسة تحت شعار «عش مع الأقصى» (Live With Al-Aqsa)، بهدف ترسيخ الوعي المعرفي والتاريخي بالمسجد الأقصى المبارك، وتعزيز الارتباط الفكري والوجداني لدى الشابات والقادة الواعدين.',
         'استهل البرنامج بعرض تقديمي مكثف بعنوان «الأقصى: الماضي، الحاضر، والوعد»، استعرض الأهمية التاريخية والروحية للمسجد الأقصى، متناولا واقع التحديات المعاصرة التي تواجه المقدسات. كما شهد العرض التعريف الرسمي بـ«كتيب نادي الأقصى» ليكون أداة معرفية تسهم في بناء الوعي لدى الأجيال الناشئة.',
         'وفي المحور التفاعلي أقيمت ورشة عمل جماعية، وزعت خلالها المشاركات إلى مجموعات نقاشية لمناقشة مبادرات عملية وآليات تفاعلية تهدف إلى إبقاء القضية حية في الوجدان، وتفعيل دور المدارس والشباب في إيصال هذه الرسالة.',
         'شهدت الفعالية إقبالا وتفاعلا لافتا من الحاضرات، حيث أبدت 30 فتاة يمثلن 10 مدارس مختلفة رغبتهن الرسمية بالانضمام والتسجيل في «مسابقة نادي الأقصى للمدارس».']),
 'news-mauritania.html': dict(img='news-5.webp', alt='أطفال يجلسون حول طاولة مع معلمتهم', date='15 أكتوبر 2026', iso='2026-10-15', place='موريتانيا',
   title='الميثاق في مخيمات موريتانيا', sub='تقرير إنجاز نشاطات مجموعة ميثاق العائلة في موريتانيا.', crumb='مخيمات موريتانيا',
   facts=[('globe', 'المكان', 'موريتانيا', ''), ('week', 'المناسبة', 'ثلاثة مخيمات صيفية', ''), ('people', 'في المخيم الثالث', 'أكثر من 100 مشاركة', ''), ('chat', 'المدخل', 'مفهوم المقاطعة', '')],
   points=[('cast-raed-3.webp', 'مخيم «رواد النهضة»', 'للأولاد من تسع إلى ثلاث عشرة سنة، بفقرة عنوانها «أهمية المقاطعة».'), ('cast-yafa-2.webp', 'نشاط الفتيات', 'للفئة العمرية نفسها، بحوالي أربعين فتاة.'), ('tale-19.webp', 'مخيم «الرائدات»', 'للفتيات من الثانية عشرة إلى السادسة عشرة، بورشة عن المقاطعة.')],
   kick='طريقة التقديم', quote='المقاطعة مدخلا إلى الميثاق', lead='استخدم مفهوم المقاطعة مدخلا يسهل فهمه لدى الجميع، ليكون مقدمة لتعريف الميثاق. وفي ختام كل ورشة هدايا من مواد تثقيفية من إنتاج الميثاق.', pic='tale-19.webp',
   text=['في إطار مخيمات صيفية تنظمها بعض المراكز في موريتانيا لفئات عمرية محددة، طلبنا من تلك الجمعيات تخصيص فقرة لعرض فكرة الميثاق بهدف ترسيخها لدى المشاركين ونشرها في مجتمعاتهم. وقد لقي طلبنا استجابة واسعة من المنظمين، فقدمنا الفكرة للمشاركين في ثلاثة مخيمات بطرق مبسطة تسهل عليهم استيعابها.',
         'الأول: مخيم الأولاد للفئة العمرية من تسع إلى ثلاث عشرة سنة، الذي نظمته الجمعية الموريتانية لرعاية الطفولة تحت شعار «رواد النهضة». حاولنا في الفقرة المخصصة لنا، التي حملت عنوان «أهمية المقاطعة»، استخدام مفهوم المقاطعة كمدخل يسهل فهمه لدى الجميع ليكون مقدمة لتعريف الميثاق.',
         'الثاني: نشاط عبر نفس الجمعية ولنفس الفئة العمرية، لكنه خصص للفتيات، حيث بلغ عدد المشاركات حوالي أربعين فتاة.',
         'الثالث: ضمن مخيم «الرائدات» الذي نظمه نادي القائدات للفتيات من سن الثانية عشرة إلى السادسة عشرة. قدمت العرض سفيرات ميثاق العائلة، وقدمنا خلاله آليات تفعيل المشاركة الميسرة في مشاريعه الداعمة لأهلنا في غزة وفلسطين. تجاوز عدد المشاركات مئة مشاركة، وقد شرفتنا الشيخة فاطمة الميداح بحضورها وشرحت للمشاركات فكرة الميثاق.',
         'في ختام كل ورشة حرصنا على تقديم هدايا للمشاركين تضمنت مواد تثقيفية من إنتاج الميثاق.']),
 'news-warda.html': dict(img='news-6.webp', alt='متطوعان بسترة ميثاق العائلة يحملان ماكينة خياطة إلى المركز', date='10 أكتوبر 2026', iso='2026-10-10', place='فلسطين',
   title='افتتاح مركز «وردة» في خان يونس', sub='مركز لتمكين النساء المعيلات، بدعم من ميثاق العائلة في آسيا والمحيط الهادئ.', crumb='مركز وردة',
   facts=[('globe', 'المكان', 'المواصي، خان يونس', ''), ('people', 'شملتهن الدراسة', '200 امرأة معيلة', ''), ('sign', 'المجموعة الأولى', '30 امرأة', ''), ('home', 'في المركز', '5 ماكينات خياطة', '')],
   points=[('tale-13.webp', 'حرفة الخياطة والتفصيل', 'المسار الأول للتدريب، اختير بعد دراسة مسحية.'), ('tale-01.webp', 'قاعة تدريب مجهزة', 'شاشة عرض وسبورة تفاعلية وطاولة تفصيل وقص.'), ('tale-07.webp', 'قصص نجاح', 'سيدات استفدن من برامج التمكين السابقة شاركن تجاربهن.')],
   kick='من كلمة الدكتورة فوزية، ماليزيا', quote='كما تنشر الوردة عبيرها، نأمل أن يمتد أثر هذا المركز', lead='اختيار اسم «وردة» يعبر عن القوة والجمال والأمل. والمركز محطة لتحويل الدعم الإغاثي إلى تمكين تنموي مستدام.', pic='tale-10.webp',
   text=['في خطوة إنسانية تهدف إلى تعزيز الصمود الاقتصادي للأسر الفلسطينية، افتتح في منطقة المواصي بمدينة خان يونس جنوب قطاع غزة مركز «وردة» لتمكين النساء المعيلات، بتمويل كريم من ميثاق العائلة – آسيا والمحيط الهادئ.',
         'ويأتي إطلاق المركز بهدف تزويد النساء اللاتي يتولين إعالة أسرهن بمهارات عملية وتدريبات حرفية تمكنهن من تأسيس مشاريع صغيرة مدرة للدخل، مما يساهم في تحقيق استقلالهن الاقتصادي وحفظ كرامة عائلاتهن في ظل الظروف المعيشية الصعبة التي يمر بها القطاع.',
         'وجاء اختيار مجالات التدريب بناء على دراسة مسحية وتقييم اجتماعي أجرته طواقم ميثاق العائلة وشمل 200 امرأة معيلة في المنطقة لتحديد احتياجاتهن والفرص الأكثر ملاءمة لهن. وأسفرت نتائج التقييم عن اختيار المجموعة الأولى، والتي تضم 30 امرأة، لمسار «حرفة الخياطة والتفصيل» كبداية لبرنامج التدريب.',
         'وقد تم تجهيز المركز بكافة المستلزمات والمعدات الحديثة، والتي شملت 5 ماكينات خياطة متطورة (من بينها ماكينة حبكة/أوفرلوك)، وطاولة تفصيل وقص مجهزة بالكامل، إلى جانب قاعة تدريب مزودة بشاشة عرض وسبورة تفاعلية.',
         'وشهد حفل الافتتاح حضورا لافتا ومشاركة عبر تقنية الاتصال المرئي لشركاء وداعمين من ماليزيا ودول آسيا والمحيط الهادئ.',
         'وتخلل الفعالية استعراض قصص نجاح ملهمة لسيدات استفدن من برامج التمكين السابقة، حيث شاركت المواطنة «ريهام» تجربتها مع الحاضرات، كما تم تسليط الضوء على قصة إحدى المعيلات التي تمكنت من خلال مشروعها الخاص من التحول من مرحلة الاحتياج والاعتماد على المساعدات إلى سيدة منتجة تعيل أسرتها بكرامة.',
         'من جانبها، أعربت الدكتورة فوزية (من ماليزيا) خلال مشاركتها عبر الإنترنت عن سعادتها بالتدشين، مؤكدة أن اختيار اسم «وردة» يحمل دلالات عميقة تعبر عن القوة والجمال والأمل. وأضافت: «كما تنشر الوردة عبيرها، نأمل أن يمتد أثر هذا المركز ليزهر خيرا ونفعا يعم المجتمع المحيط بأكمله».',
         'وأكد القائمون على المبادرة أن مركز «وردة» يمثل رؤية تتجاوز مفهوم التدريب التقليدي؛ فهو محطة لتحويل الدعم الإغاثي إلى تمكين تنموي مستدام يمنح المرأة الفلسطينية القدرة على الإنتاج والاعتماد على الذات، ويجدد الأمل في نفوس أسرها رغم صعوبة الواقع.']),
}
SLUG = {'news-1.webp': 'news-bangkok.html', 'news-2.webp': 'article.html', 'news-3.webp': 'news-aqsa-club.html', 'news-4.webp': 'news-nairobi.html', 'news-5.webp': 'news-mauritania.html', 'news-6.webp': 'news-warda.html'}
SHARE = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.700 0l3.200-3.200a4 4 0 0 0-5.700-5.700L12 6.300M14 10a4 4 0 0 0-5.700 0l-3.200 3.200a4 4 0 0 0 5.700 5.700l1.200-1.200"/></svg>'

def mins(d):
    n = max(1, round(sum(len(x.split()) for x in d['text'] + [d['lead']]) / 180))
    return 'دقيقة قراءة' if n == 1 else 'دقيقتان قراءة' if n == 2 else '<span class="num">%d</span> دقائق قراءة' % n

def news_page(slug, d):
    pts = ''.join('''
        <li><figure><img src="assets/img/world/%s" alt="" width="720" height="720" loading="lazy" decoding="async"><span class="num">%d</span></figure><h3>%s</h3><p>%s</p></li>''' % (im, i + 1, t, x) for i, (im, t, x) in enumerate(d['points']))
    others = [n for n in NEWSSET if SLUG[n[0]] != slug][:3]
    more = ''.join('<li><a href="%s"><img src="assets/img/%s" alt="" width="770" height="770" loading="lazy" decoding="async"><span><time>%s</time><b>%s</b></span></a></li>' % (SLUG[n[0]], n[0], n[2], n[4]) for n in others)
    body = ('''<main id="main">
<article class="pj ar">
  <header class="pj__head">
    <div class="pj__in pj__head-in">
      <div class="pj__title">
        <p class="crumbs"><a href="./">الرئيسية</a><span aria-hidden="true">/</span><a href="news.html">أخبارنا</a><span aria-hidden="true">/</span><span>%s</span></p>
        <p class="rd__kind"><span class="dots"><i></i><i></i><i></i></span><span>الأخبار والأنشطة</span></p>
        <h1>%s</h1>
        <p class="pj__sub">%s</p>
        <ul class="rd__meta">
          <li><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.500" y="5" width="17" height="15.500" rx="3"/><path d="M3.500 10h17M8 3v4M16 3v4"/></svg><time datetime="%s">%s</time></li>
          <li><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.500"/><path d="M12 7.500V12l3 2"/></svg><span>%s</span></li>
        </ul>
        <div class="pj__act"><a class="btn" href="#now"><span class="stitch"></span>ماذا يفعل بيتنا الآن؟</a><button class="btn btn--line" type="button" data-copy-link>''' + SHARE + '''<span>نسخ الرابط</span></button></div>
      </div>
      <div class="pj__stage ar__stage ar__stage--sq">
        <figure class="pj__photo"><img src="assets/img/%s" alt="%s" width="770" height="770"></figure>
        <p class="pj__tag"><span class="pj__ic">''' + glyph('globe') + '''</span><b>%s</b><span>%s</span></p>
      </div>
    </div>
  </header>

  <div class="pj__in">
    <ul class="pj__nums pj__nums--band ar__band" aria-label="الخبر في سطور">%s</ul>

    <section class="pj__blk" aria-labelledby="h-what">
      <div class="pj__blk-head"><h2 id="h-what">في ثلاث نقاط</h2><p>الصور من حكايات الجدة ورائد ويافا.</p></div>
      <ol class="pj__steps pj__steps--pic pj__steps--sq">%s
      </ol>
    </section>

    <section class="pj__quote" aria-labelledby="h-aim">
      <figure class="pj__quote-pic"><img src="assets/img/world/%s" alt="" width="720" height="720" loading="lazy" decoding="async"><figcaption>من حكايات الجدة ورائد ويافا</figcaption></figure>
      <div class="pj__quote-txt">
        <p class="pj__kick">%s</p>
        <h2 id="h-aim">«%s»</h2>
        <p>%s</p>
        <details class="pj__more"><summary><span>اقرؤوا الخبر كاملا</span><svg class="ic"><use href="#i-down"/></svg></summary><div class="pj__text">%s</div></details>
      </div>
    </section>

    <section class="pj__now" id="now" aria-labelledby="h-now">
      <div class="pj__blk-head"><h2 id="h-now">ماذا يفعل بيتنا الآن؟</h2><p>الخطوات نفسها تبدأ من البيت.</p></div>
      <ul class="pj__ways">%s%s%s
      </ul>
    </section>

    <section class="pj__blk" aria-labelledby="h-more">
      <div class="pj__blk-head ar__more-head"><h2 id="h-more">المزيد من الأخبار</h2><a class="fh__more" href="news.html">كل الأخبار%s</a></div>
      <ul class="ar__more">%s</ul>
    </section>
  </div>
</article>
''') % (d['crumb'], d['title'], d['sub'], d['iso'], d['date'], mins(d), d['img'], d['alt'], d['place'], d['date'],
        ''.join(fact(*f) for f in d['facts']), pts, d['pic'], d['kick'], d['quote'], d['lead'], ''.join('<p>%s</p>' % p for p in d['text']),
        way('yafa', 'يافا', 'لعبة من الجعبة', 'قناديل الأقصى: كلمات عن المسجد الأقصى للأطفال.', 'game/qanadeel/', 'ابدؤوا اللعب'),
        way('raed', 'رائد', 'قصة تقرأ معا', 'المقاطعة: ثماني صفحات في ثلاث دقائق.', 'cards.html', 'افتحوا الكتاب'),
        way('jadda', 'الجدة', 'ميثاق باسم العائلة', 'عهد من بيتكم يسند بيتا في فلسطين.', 'pledge.html', 'توقيع الميثاق'),
        LEFT, more)
    open(ROOT + slug, 'w', encoding='utf-8', newline='\n').write(relink(shell(d['title'] + ' | ميثاق العائلة', d['sub'], 'news.html') + body + bottom))

for slug, d in NEWS.items(): news_page(slug, d)
# every news card now opens its own page
p = ROOT + 'news.html'; h = open(p, encoding='utf-8').read()
for img, slug in SLUG.items():
    title = next(n[4] for n in NEWSSET if n[0] == img)
    block = re.search(r'<div class="nw__card">(<figure><img src="assets/img/%s".*?)</div></div></li>' % re.escape(img), h, flags=re.S)
    if block: h = h.replace(block.group(0), '<a class="nw__card" href="%s">%s<span class="nw__go">اقرؤوا الخبر%s</span></div></a></li>' % (slug, block.group(1), LEFT))
open(p, 'w', encoding='utf-8', newline='\n').write(h)
p = ROOT + 'article.html'; h = open(p, encoding='utf-8').read()
for img, slug in SLUG.items(): h = h.replace('<li><a href="news.html"><img src="assets/img/%s"' % img, '<li><a href="%s"><img src="assets/img/%s"' % (slug, img))
open(p, 'w', encoding='utf-8', newline='\n').write(h)
print('news pages built:', len(NEWS))

# ---------------------------------------------------------------- the empowerment centre
WHY8 = [
    ('المساعدات ليست حلا مستداما', 'الاعتماد المستمر على المساعدات الإغاثية يجعل النساء في حالة دائمة من التبعية. يوفر المشروع فرص عمل حقيقية تمكن المرأة من تحقيق دخل مستدام.'),
    ('ارتفاع أعداد النساء المعيلات', 'نتيجة الحروب المتكررة والتحديات الاقتصادية، ازداد عدد الأسر التي تعيلها النساء وحدهن، وتضاعفت الأعباء المعيشية عليهن.'),
    ('المهارات تصير مصدر دخل', 'تمتلك كثير من النساء المعيلات مهارات في الخياطة والطهي والتطريز والتصنيع اليدوي، لكنهن يفتقدن الدعم والتسويق.'),
    ('الأطفال يبقون في مدارسهم', 'مع غياب المعيل يضطر الأطفال إلى ترك مدارسهم والبحث عن عمل. دخل ثابت للأم يسمح للأطفال بمتابعة تعليمهم.'),
    ('رعاية صحية للأطفال', 'يؤدي الفقر إلى عجز الأمهات عن توفير الرعاية الصحية المناسبة. بالمشروع تتمكن الأمهات من تأمين الاحتياجات الطبية لأطفالهن.'),
    ('استدامة لا دعم مؤقت', 'بدلا من تقديم دعم مالي مؤقت، يسعى المشروع إلى خلق فرص عمل مستدامة تمكن النساء من إنتاج وبيع منتجاتهن.'),
    ('عدالة للفئات الأضعف', 'من حق المرأة المعيلة أن تحصل على فرصة متكافئة للعمل والعيش بكرامة، في بيئة آمنة دون تمييز أو استغلال.'),
    ('مجتمع أكثر استقرارا', 'تمكين النساء اقتصاديا ينعكس إيجابيا على استقرار الأسرة وصحة الأطفال النفسية.'),
]
why8 = ''.join('<details class="ct__q"><summary><span class="pr__n num">%d</span><b>%s</b><svg class="ic"><use href="#i-down"/></svg></summary><p>%s</p></details>' % (i + 1, q, a) for i, (q, a) in enumerate(WHY8))
GOALS = ['فرص عمل مستدامة للنساء المعيلات في مجالات إنتاجية مختلفة.', 'رأس مال يمكنهن من الانخراط في سوق العمل.', 'استقلال مالي يوفر حياة كريمة للأطفال دون مساعدات مستمرة.', 'دعم مشاريع ريادية صغيرة تخلق فرصا اقتصادية جديدة.', 'تخفيف الأعباء عن المؤسسات الإغاثية.']
goals = ''.join('<li><span class="pr__n num">%d</span><span>%s</span></li>' % (i + 1, g) for i, g in enumerate(GOALS))
LINES = [('tale-13.webp', 'الخياطة والتطريز والكروشيه', 'لإنتاج الملابس والمشغولات اليدوية.'), ('tale-10.webp', 'الأغذية المنزلية والمخبوزات', 'بمواصفات تسويقية تنافسية.'), ('tale-01.webp', 'قاعة عمل', 'بإنترنت وكهرباء، للمصممين والعاملين عن بعد.')]
lines = ''.join('''
        <li><figure><img src="assets/img/world/%s" alt="" width="720" height="720" loading="lazy" decoding="async"><span class="num">%d</span></figure><h3>%s</h3><p>%s</p></li>''' % (im, i + 1, t, x) for i, (im, t, x) in enumerate(LINES))

CENTER = ('''<main id="main">
<div class="pj ab pr">
  <header class="ab__hero">
    <img class="ab__photo" src="assets/img/proj-center.webp" alt="سيدة تعمل داخل مركز الميثاق لتمكين المرأة المعيلة" width="1600" height="1067">
    <div class="pj__in ab__hero-in">
      <p class="crumbs"><a href="./">الرئيسية</a><span aria-hidden="true">/</span><a href="projects.html">مشاريعنا</a><span aria-hidden="true">/</span><span>مركز التمكين</span></p>
      <p class="pj__kick">تنموي · اقتصادي · اجتماعي · مستدام</p>
      <h1>مركز الميثاق لتمكين المرأة المعيلة للأسرة</h1>
      <p class="ab__lead">ينقل النساء من تلقي المساعدات إلى الإنتاج المستدام.</p>
      <div class="pj__act"><a class="btn" href="#now"><span class="stitch"></span>شاركوا في المشروع</a><a class="btn btn--line" href="#lines">خطوط الإنتاج</a></div>
    </div>
  </header>

  <div class="pj__in">
    <ul class="pj__nums pj__nums--band ab__band" aria-label="من الميدان: مركز «وردة» في خان يونس">
      <li><span class="pj__gl">''' + glyph('people') + '''</span><div><b class="num">200</b><span>امرأة معيلة شملتها الدراسة المسحية</span></div></li>
      <li><span class="pj__gl">''' + glyph('sign') + '''</span><div><b class="num">30</b><span>امرأة في المجموعة الأولى للتدريب</span></div></li>
      <li><span class="pj__gl">''' + glyph('home') + '''</span><div><b class="num">5</b><span>ماكينات خياطة في المركز</span></div></li>
    </ul>
    <p class="pr__src">الأرقام من خبر افتتاح مركز «وردة» لتمكين النساء المعيلات في خان يونس، 6 أكتوبر 2026. <a href="news-warda.html">اقرؤوا الخبر</a></p>

    <section class="pj__blk" id="lines" aria-labelledby="h-lines">
      <div class="pj__blk-head"><h2 id="h-lines">خطوط الإنتاج</h2><p>ثلاثة مسارات للعمل. الصور من حكايات الجدة ورائد ويافا.</p></div>
      <ol class="pj__steps pj__steps--pic pj__steps--sq">%s
      </ol>
    </section>

    <section class="pj__quote" aria-labelledby="h-shift">
      <figure class="pj__quote-pic"><img src="assets/img/project/step-3.webp" alt="سيدة تعمل في برنامج الميثاق للتمكين الاقتصادي للمرأة" width="800" height="600" loading="lazy" decoding="async"></figure>
      <div class="pj__quote-txt">
        <p class="pj__kick">نقطة التحول</p>
        <h2 id="h-shift">حياة كريمة تعتمد على العمل، لا على الإغاثة</h2>
        <p>مع تزايد معدلات البطالة والفقر، تواجه المرأة المعيلة خيارات محدودة وفرص عمل تكاد تكون معدومة. يأتي المركز ليوفر فرص عمل حقيقية، ودعما لإنشاء مشاريعهن الخاصة.</p>
      </div>
    </section>

    <div class="pj__two pr__two">
      <section class="pj__blk" aria-labelledby="h-goals">
        <div class="pj__blk-head"><h2 id="h-goals">أهداف المشروع</h2></div>
        <ol class="pr__goals">%s</ol>
      </section>
      <section class="pj__blk" aria-labelledby="h-keep">
        <div class="pj__blk-head"><h2 id="h-keep">كيف يستمر</h2></div>
        <ul class="pr__keep">
          <li><span class="pj__ic">''' + glyph('tree') + '''</span><span>خط إنتاج متكامل لبيع المنتجات يمول المركز.</span></li>
          <li><span class="pj__ic">''' + glyph('people') + '''</span><span>شراكات مع المؤسسات المحلية.</span></li>
          <li><span class="pj__ic">''' + glyph('globe') + '''</span><span>تسويق المنتجات عبر الشركاء.</span></li>
          <li><span class="pj__ic">''' + glyph('week') + '''</span><span>أنشطة جديدة وفق احتياجات السوق.</span></li>
        </ul>
      </section>
    </div>

    <section class="pj__blk" aria-labelledby="h-why">
      <div class="pj__blk-head"><h2 id="h-why">مبررات المشروع</h2><p>ثمانية أسباب من ورقة المشروع. اضغطوا لقراءة كل سبب.</p></div>
      <div class="ct__faq">%s</div>
    </section>

    <section class="pj__now" id="now" aria-labelledby="h-now">
      <div class="pj__blk-head"><h2 id="h-now">ماذا يفعل بيتنا الآن؟</h2><p>ثلاث طرق، من الأقرب إلى الأبعد.</p></div>
      <ul class="pj__ways">%s%s%s
      </ul>
    </section>

    <div class="pj__pair">
      <a class="pj__card" href="project.html"><img src="assets/img/proj-tree.webp" alt="" width="1600" height="1066" loading="lazy" decoding="async"><span><small>مشروع آخر</small><b>اغرس باسمي شجرة</b><i>افتحوا المشروع%s</i></span></a>
      <a class="pj__card" href="news-warda.html"><img src="assets/img/news-6.webp" alt="" width="770" height="770" loading="lazy" decoding="async"><span><small>من الأخبار</small><b>افتتاح مركز «وردة» في خان يونس</b><i>اقرؤوا الخبر%s</i></span></a>
    </div>
  </div>
</div>
''') % (lines, goals, why8,
        way('jadda', 'الجدة', 'ميثاق باسم العائلة', 'الاشتراك بتبرع يدعم مشاريع الميثاق.', 'pledge.html', 'توقيع الميثاق'),
        way('raed', 'رائد', 'شراكة مع مؤسستكم', 'تسويق المنتجات يحتاج شركاء.', 'contact.html', 'تواصلوا مع الفريق'),
        way('yafa', 'يافا', 'بيت آخر يعرف', 'أرسلوا المشروع إلى بيت تعرفونه.', 'family.html#invite', 'ادعوا بيتا'),
        LEFT, LEFT) + CALL + '\n'
open(ROOT + 'center.html', 'w', encoding='utf-8', newline='\n').write(
    relink(shell('مركز التمكين | ميثاق العائلة', 'مركز الميثاق لتمكين المرأة المعيلة: من تلقي المساعدات إلى الإنتاج المستدام.', 'projects.html') + CENTER + bottom))
p = ROOT + 'projects.html'; h = open(p, encoding='utf-8').read()
a = '<ul class="pr__lines" aria-label="خطوط الإنتاج"><li>الخياطة والتطريز والكروشيه</li><li>الأغذية المنزلية والمخبوزات</li><li>قاعة عمل بإنترنت وكهرباء</li></ul>'
if a in h and 'href="center.html"' not in h:
    h = h.replace(a, a + '\n          <a class="btn" href="center.html"><span class="stitch"></span>افتحوا المشروع</a>')
    open(p, 'w', encoding='utf-8', newline='\n').write(h)
h = open(ROOT + 'project.html', encoding='utf-8').read()
open(ROOT + 'project.html', 'w', encoding='utf-8', newline='\n').write(h.replace('<a class="pj__card" href="projects.html"><img src="assets/img/proj-center.webp"', '<a class="pj__card" href="center.html"><img src="assets/img/proj-center.webp"'))
print('center.html built')

# ---------------------------------------------------------------- sign in (a picture of the screen; nothing is stored or sent)
SEAL2 = '<svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="57" fill="#fff" stroke="#b03a62" stroke-width="2.500"/><circle cx="60" cy="60" r="44" fill="none" stroke="#b03a62" stroke-width="1.200" stroke-dasharray="2 4"/></svg><img src="assets/img/world/seal-mark.webp" alt="" width="360" height="316">'
LOGIN = '''<main id="main">
<div class="lg">
  <div class="lg__art" aria-hidden="true">
    <img class="id-hand id-hand--rose" src="assets/img/world/hand-rose.webp" alt="" width="900" height="900">
    <img class="id-hand id-hand--teal" src="assets/img/world/hand-teal.webp" alt="" width="900" height="900">
    <div class="id-sheet"><small>أهلا بعودتكم</small><b>عائلتنا</b><i></i><span class="id-sheet__seal">''' + SEAL2 + '''</span></div>
  </div>
  <div class="lg__panel">
    <p class="rd__kind"><span class="dots"><i></i><i></i><i></i></span><span>بيت العائلة</span></p>
    <h1>ادخلوا بيتكم</h1>
    <p class="lg__sub">ميثاقكم، وعهد الأسبوع، ودفتر الأختام في انتظاركم.</p>
    <div class="lg__tabs" role="tablist"><button type="button" role="tab" aria-selected="true" data-lg-tab="in">دخول</button><button type="button" role="tab" aria-selected="false" data-lg-tab="up">حساب جديد</button></div>
    <form class="lg__form" data-lg novalidate>
      <div class="fld" data-lg-only="up" hidden><label for="lg-fam">اسم العائلة</label><input class="input" id="lg-fam" type="text" maxlength="30" autocomplete="off" placeholder="مثال: النجار"></div>
      <div class="fld" data-lg-field="mail"><div class="lg__lab"><label for="lg-mail">البريد الإلكتروني</label><button type="button" class="lg__swap" data-lg-by="tel">استخدموا رقم الهاتف</button></div><input class="input" id="lg-mail" type="email" inputmode="email" autocomplete="off" dir="ltr" placeholder="name@example.com"></div>
      <div class="fld" data-lg-field="tel" hidden><div class="lg__lab"><label for="lg-tel">رقم الهاتف</label><button type="button" class="lg__swap" data-lg-by="mail">استخدموا البريد الإلكتروني</button></div><input class="input" id="lg-tel" type="tel" inputmode="tel" autocomplete="off" dir="ltr" placeholder="+90 500 000 00 00"></div>
      <div class="fld"><label for="lg-pass">كلمة المرور</label><input class="input" id="lg-pass" type="password" autocomplete="off" dir="ltr"></div>
      <label class="lg__keep"><input type="checkbox" name="keep"><span>تذكروني على هذا الجهاز</span></label>
      <button class="btn" type="submit"><span class="stitch"></span><span data-lg-cta>دخول</span></button>
    </form>
    <div class="lg__or"><span>أو</span></div>
    <div class="lg__ways">
      <button class="btn btn--line lg__google" type="button" data-lg-demo><svg viewBox="0 0 24 24" aria-hidden="true" class="lg__g"><path fill="#4285F4" d="M23.500 12.300c0-.800-.100-1.600-.200-2.300H12v4.400h6.500a5.600 5.600 0 0 1-2.400 3.600v3h3.900c2.300-2.100 3.500-5.200 3.500-8.700z"/><path fill="#34A853" d="M12 24c3.200 0 6-1.100 8-2.900l-3.900-3c-1.100.700-2.500 1.200-4.100 1.200-3.100 0-5.800-2.100-6.700-5H1.300v3.100A12 12 0 0 0 12 24z"/><path fill="#FBBC05" d="M5.300 14.300a7.200 7.200 0 0 1 0-4.600V6.600H1.300a12 12 0 0 0 0 10.800l4-3.100z"/><path fill="#EA4335" d="M12 4.800c1.800 0 3.300.600 4.600 1.800l3.400-3.400A12 12 0 0 0 1.300 6.600l4 3.100c.900-2.900 3.600-4.900 6.700-4.900z"/></svg><span>المتابعة باستخدام Google</span></button>
      <a class="btn btn--line lg__demo" href="family.html?demo=1">''' + glyph('home') + '''<span>شاهدوا بيتا مثالا</span></a>
    </div>
    <p class="demo-note lg__note"><b>شاشة للعرض</b>لا يحفظ ما تكتبونه هنا ولا يرسل. الدخول الحقيقي يربط بحسابات المنصة.</p>
    <p class="lg__new">لم تشاركوا بعد؟ <a href="pledge.html">توقيع الميثاق</a></p>
  </div>
</div>
'''
open(ROOT + 'login.html', 'w', encoding='utf-8', newline='\n').write(
    relink(shell('دخول | ميثاق العائلة', 'ادخلوا بيت عائلتكم في ميثاق العائلة.', 'family.html') + LOGIN + bottom))

# ---------------------------------------------------------------- not found
NOTFOUND = '''<main id="main">
<div class="nf">
  <img class="nf__raed" src="assets/img/world/raed.webp" alt="" width="307" height="900">
  <div class="nf__txt">
    <p class="nf__no num" aria-hidden="true">404</p>
    <h1>هذه الصفحة ليست في الجعبة</h1>
    <p>ربما تغير عنوانها. رائد يدلكم على الطريق.</p>
    <ul class="nf__links">
      <li><a href="./">''' + glyph('home') + '''<span>الرئيسية</span></a></li>
      <li><a href="bag.html">''' + glyph('book') + '''<span>في جعبتنا</span></a></li>
      <li><a href="games.html">''' + glyph('play') + '''<span>الألعاب</span></a></li>
      <li><a href="pledge.html">''' + glyph('sign') + '''<span>توقيع الميثاق</span></a></li>
    </ul>
  </div>
</div>
'''
nf = relink(shell('الصفحة غير موجودة | ميثاق العائلة', 'هذه الصفحة غير موجودة.', '') + NOTFOUND + bottom)
# a not-found page can be served from any depth, so its own addresses start from the site's root
base = '<base href="/family-pledge-prototype/">'
open(ROOT + '404.html', 'w', encoding='utf-8', newline='\n').write(nf.replace('<head>', '<head>\n' + base, 1))
print('login.html and 404.html built')

# ---------------------------------------------------------------- search: one index of every page, news item and bag item, filtered in the browser
import json, glob
FIND = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.800-3.800"/></svg>'
SX = [
    ('صفحة', 'توقيع الميثاق', 'pledge.html', 'sign', '', 'اشتراك تبرع عهد انضمام'),
    ('صفحة', 'بيت العائلة', 'family.html', 'home', '', 'حساب عائلتي تقدم'),
    ('صفحة', 'دفتر الأختام', 'stamps.html', 'stamp', '', 'جواز اختام انجازات'),
    ('صفحة', 'تعرف على الميثاق', 'about.html', 'heart', '', 'من نحن عن الفكرة الاهداف'),
    ('صفحة', 'المشاركون', 'participants.html', 'people', '', 'اصوات عائلات شهادات'),
    ('صفحة', 'في جعبتنا', 'bag.html', 'all', '', 'محتوى مكتبة مواد'),
    ('صفحة', 'ألعاب الميثاق', 'games.html', 'play', '', 'العاب لعب اطفال'),
    ('صفحة', 'مشاريعنا', 'projects.html', 'tree', '', 'مشاريع'),
    ('صفحة', 'أخبارنا', 'news.html', 'article', '', 'اخبار انشطة'),
    ('صفحة', 'تواصل معنا', 'contact.html', 'chat', '', 'اتصال بريد هاتف اسئلة شائعة'),
    ('صفحة', 'الدخول', 'login.html', 'home', '', 'تسجيل حساب جديد'),
    ('صفحة', 'الملف التعريفي', 'profile.html', 'book', 'assets/img/profile/t1.webp', 'ملف تعريفي pdf تنزيل طباعة من نحن'),
    ('مشروع', 'اغرس باسمي شجرة', 'project.html', 'tree', 'assets/img/proj-tree-640.webp', 'زيتون شجرة غزة زراعة'),
    ('مشروع', 'مركز الميثاق لتمكين المرأة المعيلة للأسرة', 'center.html', 'people', 'assets/img/proj-center-640.webp', 'تمكين نساء خياطة وردة خان يونس'),
    ('لعبة', 'قناديل الأقصى', 'game/qanadeel/', 'game', 'assets/img/guide/qanadeel.webp', 'كلمات بحث'),
    ('لعبة', 'منبر صلاح الدين', 'game/minbar/', 'game', 'assets/img/guide/minbar.webp', 'تركيب'),
    ('لعبة', 'صورة وحكاية', 'game/album/', 'game', 'assets/img/guide/album.webp', 'ذاكرة'),
    ('القصة في صور', 'المقاطعة', 'cards.html', 'cards', 'assets/img/cards/boycott-t1.webp', 'كتاب قصة مقاطعة'),
]
for n in NEWSSET: SX.append(('خبر', n[4], SLUG[n[0]], 'article', 'assets/img/' + n[0], n[2]))
for k in ORDER:
    for i, (t, f, free) in enumerate(ITEMS[k], 1):
        if (k, i) in OPEN and k != 'cards': continue
        SX.append((KIND[k], t, OPEN.get((k, i), 'item.html?id=%s-%d' % (k, i)), GL[k], 'assets/img/bag/%s-%d.webp' % (k, i), 'مجاني' if free else ''))
sx_data = json.dumps([dict(k=a, t=b, h=c, g=d, i=e, x=f) for a, b, c, d, e, f in SX], ensure_ascii=False).replace('</', '<\\/')
sx_gl = ''.join('<template data-sx-g="%s">%s</template>' % (g, glyph(g)) for g in sorted(set(s[3] for s in SX)))
SEARCH = ('''<main id="main">
<div class="pj sx" data-sx>
  <header class="pj__head sx__head">
    <div class="pj__in sx__head-in">
      <p class="crumbs"><a href="./">الرئيسية</a><span aria-hidden="true">/</span><span>بحث</span></p>
      <h1>ابحثوا في الميثاق</h1>
      <label class="bg__search sx__box">''' + FIND + '''<span class="sr-only">ابحثوا في الموقع</span><input type="search" placeholder="كتاب، لعبة، خبر، مشروع..." autocomplete="off" autofocus data-sx-q></label>
      <div class="sx__try" aria-label="جربوا"><small>جربوا</small><button type="button" data-sx-try>القدس</button><button type="button" data-sx-try>المقاطعة</button><button type="button" data-sx-try>الأقصى</button><button type="button" data-sx-try>شجرة</button><button type="button" data-sx-try>ألعاب</button></div>
    </div>
  </header>
  <div class="pj__in">
    <p class="bg__found sx__n" data-sx-n hidden><span>النتائج</span><b class="num" data-sx-count>0</b></p>
    <div class="sx__none" data-sx-none hidden><img src="assets/img/world/raed.webp" alt="" width="307" height="900"><div><b>لا شيء بهذا الاسم</b><p>جربوا كلمة أقصر، أو افتحوا الجعبة كلها.</p><a class="btn" href="bag.html"><span class="stitch"></span>في جعبتنا</a></div></div>
    <ul class="sx__list" data-sx-list aria-live="polite"></ul>
  </div>
  <script type="application/json" data-sx-data>%s</script>%s
</div>
''') % (sx_data, sx_gl)
open(ROOT + 'search.html', 'w', encoding='utf-8', newline='\n').write(
    relink(shell('بحث | ميثاق العائلة', 'ابحثوا في صفحات ميثاق العائلة وأخباره وجعبته.', '') + SEARCH + bottom))
print('search.html built,', len(SX), 'entries')
exec(open(os.path.join(HERE, 'build_plus.py'), encoding='utf-8').read())
