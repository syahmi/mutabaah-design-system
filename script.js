// ── Sticky nav: highlight active section ──
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-20% 0px -75% 0px' });

document.querySelectorAll('section[id]').forEach(section => observer.observe(section));

// ── Copy hex to clipboard ──
document.querySelectorAll('.swatch-hex').forEach(el => {
  el.title = 'Click to copy';

  el.addEventListener('click', () => {
    const hex = el.textContent.split('/')[0].trim();

    navigator.clipboard.writeText(hex).then(() => {
      const original = el.textContent;
      el.textContent = 'Copied!';
      el.classList.add('swatch-hex--copied');

      setTimeout(() => {
        el.textContent = original;
        el.classList.remove('swatch-hex--copied');
      }, 1500);
    });
  });
});
