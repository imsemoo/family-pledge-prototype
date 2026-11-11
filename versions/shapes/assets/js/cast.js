/* ميثاق العائلة — «أهل الغرزة»: the cast.
   Every figure is the logo's centre brought to life: a dot for a head, a rounded
   diamond for a body. One rig draws them all, so they stay one family.
   Works in the browser (window.Cast) and in Node (module.exports) for exporting SVG files. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Cast = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const INK = '#10303b';
  let uid = 0;

  const PEOPLE = {
    amin:  { name: 'أمين', role: 'الأب', size: 'adult', skin: '#c98f6b', body: '#2a7896', dark: '#1f6079', head: 'hair', hair: INK, beard: true, legs: INK, mark: 'collar' },
    salma: { name: 'سلمى', role: 'الأم', size: 'adult', skin: '#f0c7a3', body: '#e087a6', dark: '#c94f78', head: 'hijab', veil: '#1f6079', dress: true, mark: 'panel', panel: '#ffffff' },
    yafa:  { name: 'يافا', role: 'الابنة', size: 'child', skin: '#e8b995', body: '#f8bdd4', dark: '#e087a6', head: 'braids', hair: '#3a2a22', legs: '#2a7896', mark: 'flower', panel: '#b03a62' },
    raed:  { name: 'رائد', role: 'الابن', size: 'child', skin: '#c98f6b', body: '#409db7', dark: '#2a7896', head: 'tuft', hair: INK, legs: INK, mark: 'stitch', panel: '#f4b740' },
    widad: { name: 'وداد', role: 'الجدة', size: 'adult', skin: '#e8b995', body: '#10303b', dark: '#0a2029', head: 'hijab', veil: '#dfeaee', glasses: true, dress: true, mark: 'panel', panel: '#e087a6' },
    maryam:{ name: 'مريم', role: 'الأم المعيلة', size: 'adult', skin: '#d9a07a', body: '#b03a62', dark: '#8c2b4d', head: 'hijab', veil: '#f8bdd4', dress: true, mark: 'panel', panel: '#f4b740' },
    nour:  { name: 'نور', role: 'الصغير', size: 'child', skin: '#d9a07a', body: '#f4b740', dark: '#d99a1f', head: 'tuft', hair: '#3a2a22', legs: '#1f6079', mark: 'stitch', panel: '#b03a62' },
  };
  const DIMS = { adult: { hr: 17, hy: 33, a: 60, by: 84 }, child: { hr: 15, hy: 72, a: 42, by: 110 } };

  const n = (v) => Math.round(v * 10) / 10;
  const dia = (cx, cy, a, fill, extra) => `<rect x="${n(cx - a / 2)}" y="${n(cy - a / 2)}" width="${n(a)}" height="${n(a)}" rx="${n(a * 0.27)}" transform="rotate(45 ${n(cx)} ${n(cy)})" fill="${fill}"${extra ? ' ' + extra : ''}/>`;
  const half = (a) => a * 0.707 - a * 0.27 * 0.414;

  /* where a hand ends up, in the figure's own 120×160 box, for a given arm angle */
  function hand(size, side, deg) {
    const d = DIMS[size], h = half(d.a), s = side === 'r' ? 1 : -1;
    const sx = 60 + s * h * 0.55, sy = d.by - h * 0.45, len = d.a * 0.2, drop = d.a * 0.57;
    const t = (deg * Math.PI) / 180, x = s * len, y = drop;
    return { sx, sy, x: sx + x * Math.cos(t) - y * Math.sin(t), y: sy + x * Math.sin(t) + y * Math.cos(t), ix: sx + x, iy: sy + y };
  }

  function person(id, o) {
    o = o || {};
    const c = PEOPLE[id], d = DIMS[c.size], h = half(d.a), g = 'cg' + ++uid, kid = c.size === 'child';
    const fy = d.hy + (c.head === 'hijab' ? 2 : 1), ex = d.hr * 0.36;
    const pose = o.pose || 'idle', mood = o.mood || 'calm';
    const pos = o.x != null ? ` x="${o.x}" y="${o.y}" width="${n((o.h || 160) * 0.75)}" height="${o.h || 160}"` : '';

    const arm = (side) => {
      const p = hand(c.size, side, 0), s = side === 'r' ? 1 : -1, held = o.hold && o.hold[side];
      return `<g class="arm arm--${side}" style="transform-origin:${n(p.sx)}px ${n(p.sy)}px">` +
        `<path d="M${n(p.sx)} ${n(p.sy)}Q${n(p.sx + s * 9)} ${n(p.sy + (p.iy - p.sy) * 0.5)} ${n(p.ix)} ${n(p.iy)}" fill="none" stroke="${c.dark}" stroke-width="${kid ? 8 : 10}" stroke-linecap="round"/>` +
        (held ? `<g transform="translate(${n(p.ix)} ${n(p.iy)})">${held}</g>` : '') +
        `<circle cx="${n(p.ix)}" cy="${n(p.iy)}" r="${kid ? 4.6 : 5.6}" fill="${c.skin}"/></g>`;
    };

    let low;
    if (c.dress) {
      const top = d.by + 4;
      low = `<rect x="43" y="${top}" width="34" height="${145 - top}" rx="10" fill="${c.dark}"/><ellipse cx="53" cy="148" rx="6" ry="3.4" fill="${INK}"/><ellipse cx="67" cy="148" rx="6" ry="3.4" fill="${INK}"/>`;
    } else {
      const lx = kid ? 6.5 : 8.5, top = d.by + h * 0.5;
      low = `<path d="M${60 - lx} ${n(top)}V146M${60 + lx} ${n(top)}V146" stroke="${c.legs}" stroke-width="${kid ? 7.5 : 9.5}" stroke-linecap="round"/><ellipse cx="${60 - lx - 1.5}" cy="148.5" rx="${kid ? 5.5 : 6.5}" ry="3.4" fill="${INK}"/><ellipse cx="${60 + lx + 1.5}" cy="148.5" rx="${kid ? 5.5 : 6.5}" ry="3.4" fill="${INK}"/>`;
    }

    const m = (dx, dy, a, fill) => dia(60 + dx, d.by + dy, a, fill);
    let mark = '';
    if (c.mark === 'panel') mark = m(0, -7, 5.4, c.panel) + m(-7.5, -7, 5.4, c.panel) + m(7.5, -7, 5.4, c.panel) + m(0, -14.5, 5.4, c.panel) + m(0, 0.5, 5.4, c.panel) + m(0, 13, 4, c.panel) + m(-15, -7, 3.4, c.panel) + m(15, -7, 3.4, c.panel);
    if (c.mark === 'flower') mark = m(0, -8, 4.6, c.panel) + m(-5.5, -2.5, 4.6, c.panel) + m(5.5, -2.5, 4.6, c.panel) + m(0, 3, 4.6, c.panel);
    if (c.mark === 'stitch') mark = m(0, -2, 9, c.panel);
    if (c.mark === 'collar') mark = `<path d="M51 ${n(d.by - h + 11)}L60 ${n(d.by - h + 21)}L69 ${n(d.by - h + 11)}" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>` + m(0, 6, 4.4, '#bfe0ea') + m(0, 17, 4.4, '#bfe0ea');

    let headBack = '', headTop = '';
    const hr = d.hr, hy = d.hy;
    const cap = `<path d="M${60 - hr} ${hy + 1}A${hr} ${hr} 0 0 1 ${60 + hr} ${hy + 1}Q${60 + hr - 2} ${hy - 8} ${65} ${hy - 9}Q${52} ${hy - 10} ${60 - hr} ${hy + 1}Z" fill="${c.hair}"/>`;
    let face = `<circle cx="60" cy="${hy}" r="${hr}" fill="${c.skin}"/>`;
    if (c.head === 'hijab') {
      headBack = `<ellipse cx="60" cy="${hy + hr + 2}" rx="${hr + 7}" ry="9.5" fill="${c.veil}"/><circle cx="60" cy="${hy}" r="${hr + 4}" fill="${c.veil}"/>`;
      face = `<circle cx="60" cy="${hy + 2}" r="${hr - 3}" fill="${c.skin}"/>`;
    } else if (c.head === 'hair') headTop = cap;
    else if (c.head === 'braids') {
      headBack = `<circle cx="${60 - hr - 3}" cy="${hy + 9}" r="6" fill="${c.hair}"/><circle cx="${60 + hr + 3}" cy="${hy + 9}" r="6" fill="${c.hair}"/>`;
      headTop = cap + dia(60 - hr - 1, hy + 3, 4.4, '#b03a62') + dia(60 + hr + 1, hy + 3, 4.4, '#b03a62');
    } else if (c.head === 'tuft') headTop = cap + `<path d="M59 ${hy - hr + 1}q3 -8 9 -3" fill="none" stroke="${c.hair}" stroke-width="3.4" stroke-linecap="round"/>`;
    const beard = c.beard ? `<path d="M${60 - hr + 1} ${hy + 3}A${hr - 0.5} ${hr - 0.5} 0 0 0 ${60 + hr - 1} ${hy + 3}Q${60 + hr - 6} ${hy + 5.5} 60 ${hy + 5}Q${60 - hr + 6} ${hy + 5.5} ${60 - hr + 1} ${hy + 3}Z" fill="${c.hair}"/>` : '';
    const lip = c.beard ? '#f6dccb' : INK, my = fy + (c.beard ? 8.5 : 6.2);
    const eyes =
      `<g class="eye-dot"><ellipse cx="${n(60 - ex)}" cy="${fy}" rx="1.9" ry="2.2" fill="${INK}"/><ellipse cx="${n(60 + ex)}" cy="${fy}" rx="1.9" ry="2.2" fill="${INK}"/></g>` +
      `<g class="eye-arc" fill="none" stroke="${INK}" stroke-width="1.7" stroke-linecap="round"><path d="M${n(60 - ex - 2.6)} ${fy + 0.8}q2.6 -3.2 5.2 0"/><path d="M${n(60 + ex - 2.6)} ${fy + 0.8}q2.6 -3.2 5.2 0"/></g>`;
    const mouth =
      `<path class="mouth-smile" d="M${55.6} ${n(my)}q4.4 4.2 8.8 0" fill="none" stroke="${lip}" stroke-width="1.7" stroke-linecap="round"/>` +
      `<path class="mouth-open" d="M${55.2} ${n(my - 0.6)}h9.6a4.8 4.8 0 0 1 -9.6 0z" fill="${c.beard ? '#f6dccb' : '#8c2b4d'}"/>`;
    const cheeks = c.beard ? '' : `<circle cx="${n(60 - hr * 0.6)}" cy="${fy + 5.4}" r="2.7" fill="#e087a6" opacity=".5"/><circle cx="${n(60 + hr * 0.6)}" cy="${fy + 5.4}" r="2.7" fill="#e087a6" opacity=".5"/>`;
    const glasses = c.glasses ? `<g fill="#fff" fill-opacity=".35" stroke="${INK}" stroke-width="1.3"><circle cx="${n(60 - ex)}" cy="${fy}" r="4.7"/><circle cx="${n(60 + ex)}" cy="${fy}" r="4.7"/><path d="M${n(60 - ex + 4.7)} ${fy}h${n(ex * 2 - 9.4)}" fill="none"/></g>` : '';

    return `<svg class="cast cast--${id} pose-${pose} mood-${mood}" data-cast="${id}" viewBox="0 0 120 160" overflow="visible"${pos}${o.x == null ? ' xmlns="http://www.w3.org/2000/svg"' : ''} role="img" aria-label="${c.name}، ${c.role}">` +
      `<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset=".35" stop-color="${c.body}"/><stop offset="1" stop-color="${c.dark}"/></linearGradient></defs>` +
      `<rect class="cast__hit" x="14" y="10" width="92" height="142" fill="#fff" fill-opacity="0"/>` +
      `<ellipse class="cast__shadow" cx="60" cy="151" rx="${kid ? 20 : 27}" ry="3.6" fill="${INK}" opacity=".12"/>` +
      `<g class="cast__all" style="--dl:${(uid * 0.61) % 4}s">${low}${arm('l')}${arm('r')}` +
      dia(60, d.by, d.a, `url(#${g})`) + mark +
      `<g class="cast__head">${headBack}${face}${beard}${headTop}${cheeks}${eyes}${glasses}${mouth}</g></g></svg>`;
  }

  /* «غرزة»: a single stitch with a face. The guide, the loader, the cheer. */
  function sprite(o) {
    o = o || {};
    const fill = o.fill || '#f4b740', mood = o.mood || 'calm';
    const pos = o.x != null ? ` x="${o.x}" y="${o.y}" width="${o.s || 60}" height="${o.s || 60}"` : ' xmlns="http://www.w3.org/2000/svg"';
    return `<svg class="ghurza mood-${mood}" viewBox="0 0 60 60" overflow="visible"${pos} role="img" aria-label="غرزة">` +
      (o.tail === false ? '' : `<path class="ghurza__tail" d="M30 52q-10 6 -4 12t-8 9" fill="none" stroke="${o.thread || '#c94f78'}" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="5 5"/>`) +
      `<g class="ghurza__body">` + dia(30, 30, 36, fill) +
      `<path d="M21 19q4 -5 9 -6" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2.4" stroke-linecap="round"/>` +
      `<g class="eye-dot"><ellipse cx="24" cy="29" rx="2.1" ry="2.5" fill="${INK}"/><ellipse cx="36" cy="29" rx="2.1" ry="2.5" fill="${INK}"/></g>` +
      `<g class="eye-arc" fill="none" stroke="${INK}" stroke-width="1.9" stroke-linecap="round"><path d="M21.2 30q2.8 -3.4 5.600 0"/><path d="M33.2 30q2.8 -3.4 5.600 0"/></g>` +
      `<path class="mouth-smile" d="M26 35.500q4 3.800 8 0" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>` +
      `<path class="mouth-open" d="M25.600 34.800h8.800a4.400 4.400 0 0 1 -8.800 0z" fill="#8c2b4d"/>` +
      `<circle cx="19.500" cy="34" r="2.400" fill="#e087a6" opacity=".55"/><circle cx="40.500" cy="34" r="2.400" fill="#e087a6" opacity=".55"/></g></svg>`;
  }

  /* ---------- props: the same geometry, as things ---------- */
  const P = {
    dia,
    /* a stone house with an arched door; `mend` draws a crack sewn shut */
    house(x, y, w, h, o) {
      o = o || {};
      const wall = o.wall || '#ffffff', roof = o.roof || '#2a7896', door = o.door || '#1f6079', line = o.line || '#bfe0ea';
      const dw = w * 0.26, dh = h * 0.42, dx = x + w * (o.doorAt || 0.5) - dw / 2;
      const win = (wx) => `<path d="M${n(wx)} ${n(y - h * 0.5)}v${n(-h * 0.14)}a${n(w * 0.07)} ${n(w * 0.07)} 0 0 1 ${n(w * 0.14)} 0v${n(h * 0.14)}z" fill="${o.glass || '#dceef3'}" stroke="${line}" stroke-width="2"/>`;
      let s = `<circle cx="${n(x + w / 2)}" cy="${n(y - h)}" r="${n(w * 0.2)}" fill="${roof}"/>` +
        `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" rx="12" fill="${wall}" stroke="${line}" stroke-width="2"/>` +
        `<rect x="${x - 7}" y="${y - h - 9}" width="${w + 14}" height="17" rx="8.5" fill="${roof}"/>` +
        `<path d="M${x + 10} ${n(y - h * 0.7)}h${w - 20}M${x + 10} ${n(y - h * 0.26)}h${w - 20}" stroke="${line}" stroke-width="2.4" stroke-dasharray="9 8" stroke-linecap="round"/>` +
        `<path d="M${n(dx)} ${y}v${n(-dh + dw / 2)}a${n(dw / 2)} ${n(dw / 2)} 0 0 1 ${n(dw)} 0v${n(dh - dw / 2)}z" fill="${door}"/>` +
        dia(dx + dw * 0.76, y - dh * 0.45, 5, '#f4b740') + win(x + w * 0.14) + win(x + w * 0.72);
      if (o.mend) {
        const cx = x + w * 0.3, top = y - h + 14;
        s += `<path d="M${n(cx)} ${top}l7 16l-9 15l8 17l-7 14" fill="none" stroke="#5b7480" stroke-width="1.6" stroke-linejoin="round"/>` +
          `<path class="mend" d="M${n(cx - 7)} ${top + 8}l14 4M${n(cx - 6)} ${top + 23}l13 -3M${n(cx - 8)} ${top + 39}l14 3M${n(cx - 6)} ${top + 54}l13 -3" stroke="#c94f78" stroke-width="2.6" stroke-linecap="round"/>` +
          dia(x + w * 0.82, y - h * 0.82, 13, '#f4b740') + dia(x + w * 0.9, y - h * 0.74, 9, '#e087a6') + dia(x + w * 0.16, y - h * 0.18, 10, '#409db7');
      }
      return s;
    },
    /* an olive tree: a trunk and a crown of stitches */
    tree(x, y, s, tone) {
      const t = tone || ['#2a7896', '#409db7', '#1f6079'], k = s || 1, d = (dx, dy, a, i) => dia(x + dx * k, y + dy * k, a * k, t[i]);
      return `<path d="M${x} ${y}q${-3 * k} ${-16 * k} ${2 * k} ${-30 * k}M${x + k} ${y - 18 * k}q${9 * k} ${-4 * k} ${12 * k} ${-12 * k}" fill="none" stroke="#5b4636" stroke-width="${n(4.5 * k)}" stroke-linecap="round"/>` +
        d(-14, -40, 22, 0) + d(14, -42, 24, 2) + d(0, -54, 26, 1) + d(-4, -36, 18, 2) + d(18, -30, 14, 1) + dia(x - 6 * k, y - 48 * k, 4 * k, '#f4b740');
    },
    cypress(x, y, s, fill) {
      const k = s || 1;
      return `<path d="M${x} ${y}v${-8 * k}" stroke="#5b4636" stroke-width="${3 * k}" stroke-linecap="round"/><path d="M${x} ${y - 6 * k}c${-11 * k} ${-18 * k} ${-6 * k} ${-52 * k} 0 ${-66 * k}c${6 * k} ${14 * k} ${11 * k} ${48 * k} 0 ${66 * k}z" fill="${fill || '#1f6079'}"/>`;
    },
    /* the Dome of the Rock, reduced to a dome and a drum */
    dome(x, y, s, o) {
      o = o || {}; const k = s || 1;
      return `<rect x="${n(x - 30 * k)}" y="${n(y - 26 * k)}" width="${60 * k}" height="${26 * k}" rx="${3 * k}" fill="${o.base || '#409db7'}"/>` +
        `<path d="M${n(x - 30 * k)} ${n(y - 15 * k)}h${60 * k}" stroke="#fff" stroke-opacity=".6" stroke-width="${2 * k}" stroke-dasharray="${5 * k} ${4 * k}"/>` +
        `<rect x="${n(x - 17 * k)}" y="${n(y - 38 * k)}" width="${34 * k}" height="${13 * k}" fill="${o.drum || '#2a7896'}"/>` +
        `<path d="M${n(x - 19 * k)} ${n(y - 37 * k)}c0 ${-30 * k} ${38 * k} ${-30 * k} ${38 * k} 0z" fill="${o.gold || '#f4b740'}"/><path d="M${x} ${n(y - 60 * k)}v${-9 * k}" stroke="${o.gold || '#f4b740'}" stroke-width="${2.2 * k}" stroke-linecap="round"/>`;
    },
    /* the satchel: «الجعبة» */
    bag(x, y, s) {
      const k = s || 1;
      return `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-46 -78c0 -44 92 -44 92 0" fill="none" stroke="#1f6079" stroke-width="9" stroke-linecap="round"/>` +
        `<rect x="-62" y="-84" width="124" height="84" rx="22" fill="#2a7896"/><path d="M-62 -62a22 22 0 0 1 22 -22h80a22 22 0 0 1 22 22v8c-40 34 -84 34 -124 0z" fill="#409db7"/>` +
        `<path d="M-50 -18h100" stroke="#bfe0ea" stroke-width="3" stroke-dasharray="9 8" stroke-linecap="round"/>` + dia(0, -40, 20, '#f4b740') + dia(0, -40, 8, '#b03a62') + `</g>`;
    },
    /* the pledge document, sealed with a stitch */
    doc(x, y, s, rot) {
      const k = s || 1;
      return `<g transform="translate(${x} ${y}) rotate(${rot || 0}) scale(${k})"><rect x="-26" y="-36" width="52" height="72" rx="8" fill="#fff" stroke="#bfe0ea" stroke-width="2"/>` +
        `<path d="M-15 -22h30M-15 -11h30M-15 0h20" stroke="#bfe0ea" stroke-width="3.4" stroke-linecap="round"/><path d="M-15 17q7 -9 12 0t12 -2" fill="none" stroke="#b03a62" stroke-width="2.4" stroke-linecap="round"/>` + dia(15, 22, 11, '#e087a6') + `</g>`;
    },
    needle(x, y, s, rot) {
      const k = s || 1;
      return `<g transform="translate(${x} ${y}) rotate(${rot || 0}) scale(${k})"><path d="M0 -30c3 6 3 44 0 60c-3 -16 -3 -54 0 -60z" fill="#5b7480"/><ellipse cx="0" cy="-20" rx="1.300" ry="4.500" fill="#fff"/></g>`;
    },
    lantern(x, y, s, lit) {
      const k = s || 1;
      return `<g transform="translate(${x} ${y}) scale(${k})"><path d="M0 -34v12" stroke="#5fa9bf" stroke-width="2"/><rect x="-5" y="-24" width="10" height="6" rx="2" fill="#9fd0de"/>` +
        (lit ? `<circle r="26" fill="#f4b740" opacity=".22"/>` : '') + dia(0, 0, 26, lit ? '#f4b740' : 'none', lit ? '' : 'stroke="#5fa9bf" stroke-width="2.5"') + (lit ? dia(0, 1, 9, '#fff5d6') : '') + `</g>`;
    },
    book(x, y, s, fill, rot) {
      const k = s || 1;
      return `<g transform="translate(${x} ${y}) rotate(${rot || 0}) scale(${k})"><rect x="-20" y="-26" width="40" height="52" rx="7" fill="${fill || '#e087a6'}"/><rect x="-20" y="-26" width="9" height="52" rx="4" fill="#10303b" opacity=".18"/>` + dia(3, -4, 13, '#fff') + `</g>`;
    },
  };

  return { PEOPLE, person, sprite, hand, props: P, dia };
});
