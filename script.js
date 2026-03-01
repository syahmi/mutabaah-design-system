// ── Lucide icons ──
window.addEventListener('load', () => {
  if (window.lucide) lucide.createIcons();
});

// ── Sticky nav: highlight active section ──
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) {
        active.classList.add('active');
        active.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
      }
    }
  });
}, { rootMargin: '-20% 0px -75% 0px' });

document.querySelectorAll('section[id]').forEach(section => observer.observe(section));

// ── Shared clipboard copy utility ──
function copyToClipboard(text, onSuccess) {
  navigator.clipboard.writeText(text).then(onSuccess).catch(() => {});
}

// ── Copy hex to clipboard ──
document.querySelectorAll('.swatch-hex').forEach(el => {
  el.title = 'Click to copy';

  el.addEventListener('click', () => {
    const hex = el.textContent.split('/')[0].trim();
    const original = el.textContent;

    copyToClipboard(hex, () => {
      el.textContent = 'Copied!';
      el.classList.add('swatch-hex--copied');
      setTimeout(() => {
        el.textContent = original;
        el.classList.remove('swatch-hex--copied');
      }, 1500);
    });
  });
});

// ── Copy icon name to clipboard ──
document.querySelectorAll('.icon-card').forEach(card => {
  const nameEl = card.querySelector('.icon-card-name');
  if (!nameEl) return;

  card.title = 'Click to copy';

  card.addEventListener('click', () => {
    const name = nameEl.textContent.trim();

    copyToClipboard(name, () => {
      nameEl.textContent = 'Copied!';
      nameEl.classList.add('icon-card-name--copied');
      setTimeout(() => {
        nameEl.textContent = name;
        nameEl.classList.remove('icon-card-name--copied');
      }, 1500);
    });
  });
});
