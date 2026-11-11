/* ميثاق العائلة — home page only */
(() => {
  const $ = (s, r = document) => r.querySelector(s);

  /* sign card: what each kind of signature includes */
  const form = $('.sign');
  if (form) {
    const paid = form.querySelectorAll('[data-paid]');
    const sync = () => { const free = form.plan.value === 'free'; paid.forEach((li) => (li.hidden = free)); };
    form.addEventListener('change', sync); sync();
    form.addEventListener('submit', () => $('button[type=submit]', form).classList.add('is-busy'));
    addEventListener('pageshow', () => $('button[type=submit]', form).classList.remove('is-busy'));
  }

})();
