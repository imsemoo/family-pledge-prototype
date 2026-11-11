/* ميثاق العائلة — the drawn-in-code pieces of the world: «غرزة» the stitch with a face,
   and a few props built from the same rounded diamond. The people are painted
   illustrations (assets/img/hero, assets/img/scenes), not code. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Cast = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const INK = '#10303b';

  const n = (v) => Math.round(v * 10) / 10;
  const dia = (cx, cy, a, fill, extra) => `<rect x="${n(cx - a / 2)}" y="${n(cy - a / 2)}" width="${n(a)}" height="${n(a)}" rx="${n(a * 0.27)}" transform="rotate(45 ${n(cx)} ${n(cy)})" fill="${fill}"${extra ? ' ' + extra : ''}/>`;

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

  return { sprite, props: P, dia };
});
