/* ميثاق العائلة — identity guide: draws the cast sheet from the same rig the site uses. */
(() => {
  const C = window.Cast, P = C.props, $ = (s) => document.querySelector(s);
  const card = (svg, name, note) => `<figure class="castcard">${svg}<figcaption><b>${name}</b>${note ? `<span>${note}</span>` : ''}</figcaption></figure>`;
  const box = (inner, vb) => `<svg viewBox="${vb || '-50 -70 100 100'}" overflow="visible">${inner}</svg>`;

  $('#rig-b').innerHTML = C.person('salma').replace('role="img"', 'role="img" style="filter:saturate(0.9)"') + '<span>ذراعان ووجه وثوب</span>';
  $('#rig-c').innerHTML = C.person('salma', { pose: 'wave', mood: 'happy' }) + '<span>تتحرك وتحيي</span>';

  $('#cast-sheet').innerHTML = Object.entries(C.PEOPLE).map(([id, p]) => card(C.person(id), p.name, p.role)).join('');
  $('#cast-poses').innerHTML = [['idle', 'واقف'], ['wave', 'ترحيب'], ['cheer', 'احتفال'], ['open', 'احتضان'], ['reach-r', 'مشاركة'], ['up-r', 'يمسك الخيط']]
    .map(([pose, label]) => card(C.person('raed', { pose }), label)).join('');
  $('#cast-sprite').innerHTML = [['calm', 'هادئة', '#f4b740'], ['happy', 'فرحة', '#e087a6'], ['wow', 'مندهشة', '#409db7'], ['sad', 'حاول ثانية', '#9fd0de'], ['sleep', 'استراحة', '#f4b740']]
    .map(([mood, label, fill]) => card(C.sprite({ mood, fill, tail: false }), label)).join('');
  $('#prop-sheet').innerHTML = [
    [box(P.house(-42, 26, 84, 78, { mend: true, roof: '#b03a62', door: '#8c2b4d', line: '#f2aec7' })), 'بيت يرمم بالغرز'],
    [box(P.tree(0, 26, 1.5)), 'زيتونة'],
    [box(P.cypress(0, 26, 1.3)), 'سروة'],
    [box(P.dome(0, 22, 1.25)), 'القبة'],
    [box(P.bag(0, 26, 0.72)), 'الجعبة'],
    [box(P.doc(0, -18, 1.1, -6)), 'الوثيقة'],
    [box(P.lantern(0, -10, 1.6, true)), 'القنديل'],
    [box(P.book(-14, -18, 1, '#e087a6', -10) + P.needle(26, -18, 1, 24)), 'كتاب وإبرة'],
  ].map(([svg, label]) => card(svg, label)).join('');
})();
