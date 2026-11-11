/* Writes every character, mood and prop as a standalone SVG file, from the same
   rig the site draws with. Run: node tools/export-assets.cjs */
const fs = require('fs');
const path = require('path');
const C = require('../assets/js/cast.js');
const P = C.props;
const out = path.join(__dirname, '..', 'assets', 'illustrations');
const save = (dir, name, svg) => {
  fs.mkdirSync(path.join(out, dir), { recursive: true });
  fs.writeFileSync(path.join(out, dir, name + '.svg'), svg.replace(/ class="[^"]*"/g, '').replace(/ style="[^"]*"/g, '') + '\n');
};
const wrap = (inner, vb) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${inner}</svg>`;
const POSES = { idle: [0, 0], wave: [-128, 0], cheer: [-138, 138], open: [-42, 42] };
/* standalone files cannot rely on the site's CSS, so the pose is baked into the arms */
const posed = (id, pose, mood) => {
  let svg = C.person(id, { pose, mood });
  const [r, l] = POSES[pose];
  for (const [side, deg] of [['r', r], ['l', l]]) {
    const h = C.hand(C.PEOPLE[id].size, side, 0);
    svg = svg.replace(`<g class="arm arm--${side}" style="transform-origin:${Math.round(h.sx * 10) / 10}px ${Math.round(h.sy * 10) / 10}px">`, `<g transform="rotate(${deg} ${h.sx.toFixed(1)} ${h.sy.toFixed(1)})">`);
  }
  const happy = mood === 'happy';
  return svg.replace(/<g class="eye-(dot|arc)"[^>]*>.*?<\/g>/g, (m, k) => ((k === 'arc') === happy ? m : ''))
    .replace(/<path class="mouth-(smile|open)"[^>]*\/>/g, (m, k) => ((k === 'open') === happy ? m : ''))
    .replace(/<rect class="cast__hit"[^>]*\/>/, '');
};
let n = 0;
for (const id of Object.keys(C.PEOPLE)) for (const pose of Object.keys(POSES)) { save('cast', `${id}-${pose}`, posed(id, pose, pose === 'idle' ? 'calm' : 'happy')); n++; }
for (const [mood, fill] of [['calm', '#f4b740'], ['happy', '#e087a6']]) {
  const happy = mood === 'happy';
  save('cast', `ghurza-${mood}`, C.sprite({ mood, fill, tail: false }).replace(/<g class="eye-(dot|arc)"[^>]*>.*?<\/g>/g, (m, k) => ((k === 'arc') === happy ? m : '')).replace(/<path class="mouth-(smile|open)"[^>]*\/>/g, (m, k) => ((k === 'open') === happy ? m : ''))); n++;
}
const props = {
  'house': wrap(P.house(8, 110, 100, 92), '0 0 116 116'),
  'house-mended': wrap(P.house(8, 110, 100, 92, { mend: true, roof: '#b03a62', door: '#8c2b4d', line: '#f2aec7' }), '0 0 116 116'),
  'olive-tree': wrap(P.tree(40, 76, 1.2), '0 0 80 80'),
  'cypress': wrap(P.cypress(20, 96, 1.2), '0 0 40 100'),
  'dome': wrap(P.dome(40, 76, 1.1), '0 0 80 80'),
  'bag': wrap(P.bag(70, 116, 1), '0 0 140 122'),
  'document': wrap(P.doc(34, 42, 1, 0), '0 0 68 84'),
  'lantern-lit': wrap(P.lantern(30, 40, 1, true), '0 0 60 70'),
  'lantern': wrap(P.lantern(30, 40, 1, false), '0 0 60 70'),
  'book': wrap(P.book(24, 30, 1), '0 0 48 60'),
  'needle': wrap(P.needle(8, 34, 1, 0), '0 0 16 68'),
};
for (const [name, svg] of Object.entries(props)) { save('props', name, svg); n++; }
console.log(`${n} files written to assets/illustrations`);
