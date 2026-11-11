/* ميثاق العائلة — identity guide: the moods of «غرزة», drawn by the same code the site uses. */
(() => {
  const C = window.Cast, el = document.querySelector('#cast-sprite');
  if (!el) return;
  el.innerHTML = [['calm', 'هادئة', '#f4b740'], ['happy', 'فرحة', '#e087a6'], ['wow', 'مندهشة', '#409db7'], ['sad', 'حاول ثانية', '#9fd0de'], ['sleep', 'استراحة', '#f4b740']]
    .map(([mood, label, fill]) => `<figure class="castcard">${C.sprite({ mood, fill, tail: false })}<figcaption><b>${label}</b></figcaption></figure>`).join('');
})();
