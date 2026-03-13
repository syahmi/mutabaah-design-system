// ── Theme toggle ──
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleLabel = document.getElementById('theme-toggle-label');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  const isDark = theme === 'dark';
  themeToggleLabel.textContent = isDark ? 'Light' : 'Dark';
  themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
}

// Sync label with whatever the inline script set on <html>
applyTheme(document.documentElement.getAttribute('data-theme') || 'light');

themeToggleBtn.addEventListener('click', () => {
  applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// ── Version ──
const VERSION = '1.3.1';
const DATE = 'March 2026';
document.querySelectorAll('[data-version]').forEach(el => { el.textContent = el.dataset.version === 'full' ? `Design System v${VERSION} · ${DATE}` : VERSION; });
document.querySelectorAll('[data-date]').forEach(el => { el.textContent = DATE; });

// ── Lucide icons ──
if (window.lucide) lucide.createIcons();

// ── Sticky nav: highlight active section ──
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      });
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) {
        active.classList.add('active');
        active.setAttribute('aria-current', 'true');
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

// ── Aria-live announcement region ──
const copyAnnouncement = document.getElementById('copy-announcement');
function announce(msg) {
  if (copyAnnouncement) {
    copyAnnouncement.textContent = '';
    // Force re-announcement if same message repeated
    requestAnimationFrame(() => { copyAnnouncement.textContent = msg; });
  }
}

// ── Copy CSS variable to clipboard (entire swatch card is the click target) ──
const SWATCH_STRUCTURAL = new Set(['swatch-block', 'swatch-split-top', 'swatch-split-btm']);

function swatchVarName(card) {
  const el = card.querySelector('.swatch-split-top') || card.querySelector('.swatch-block');
  if (!el) return null;
  const cls = [...el.classList].find(c => c.startsWith('swatch-') && !SWATCH_STRUCTURAL.has(c));
  return cls ? `var(--${cls.slice(7)})` : null;
}

document.querySelectorAll('.swatch-card').forEach(card => {
  const hexEl = card.querySelector('.swatch-hex');
  if (!hexEl) return;

  const originalText = hexEl.textContent;
  const copyValue = swatchVarName(card) || originalText.split('/')[0].trim();

  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.title = `Click to copy ${copyValue}`;

  let copying = false;

  function handleCopy() {
    if (copying) return;
    copying = true;

    copyToClipboard(copyValue, () => {
      hexEl.textContent = 'Copied!';
      hexEl.classList.add('swatch-hex--copied');
      announce(`Copied: ${copyValue}`);
      setTimeout(() => {
        hexEl.textContent = originalText;
        hexEl.classList.remove('swatch-hex--copied');
        copying = false;
      }, 1500);
    });
  }

  card.addEventListener('click', handleCopy);
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCopy();
    }
  });
});

// ── Motion live demos ──
function nextFrame(fn) {
  requestAnimationFrame(() => requestAnimationFrame(fn));
}

function playDemo(type) {
  if (type === 'enter') {
    const el = document.getElementById('demo-enter');
    el.classList.remove('demo-anim-enter');
    nextFrame(() => el.classList.add('demo-anim-enter'));

  } else if (type === 'exit') {
    const el = document.getElementById('demo-exit');
    el.classList.remove('demo-anim-exit', 'demo-anim-enter');
    nextFrame(() => {
      el.classList.add('demo-anim-exit');
      setTimeout(() => {
        el.classList.remove('demo-anim-exit');
        nextFrame(() => el.classList.add('demo-anim-enter'));
      }, 500);
    });

  } else if (type === 'complete') {
    const check = document.getElementById('demo-complete-check');
    const text  = document.getElementById('demo-complete-text');
    check.classList.remove('filled');
    text.classList.remove('done');
    nextFrame(() => {
      check.classList.add('filled');
      text.classList.add('done');
    });
  }
}

document.querySelectorAll('.motion-replay-btn').forEach(btn => {
  btn.addEventListener('click', () => playDemo(btn.dataset.demo));
});

// Auto-play once when section scrolls into view
const motionSection = document.getElementById('motion');
if (motionSection) {
  const motionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => playDemo('enter'),   100);
        setTimeout(() => playDemo('exit'),    500);
        setTimeout(() => playDemo('complete'), 900);
        motionObserver.disconnect();
      }
    });
  }, { threshold: 0.25 });
  motionObserver.observe(motionSection);
}

// ── Nav overflow fade (mobile) ──
const navLinksEl = document.querySelector('.nav-links');
const navLinksWrap = document.querySelector('.nav-links-wrap');

function updateNavFade() {
  if (!navLinksEl || !navLinksWrap) return;
  const { scrollLeft, scrollWidth, clientWidth } = navLinksEl;
  navLinksWrap.classList.toggle('fade-left',  scrollLeft > 4);
  navLinksWrap.classList.toggle('fade-right', scrollLeft < scrollWidth - clientWidth - 4);
}

if (navLinksEl) {
  navLinksEl.addEventListener('scroll', updateNavFade, { passive: true });
  window.addEventListener('resize', updateNavFade, { passive: true });
  updateNavFade();
}

// ── Pause gentleFloat when off-screen ──
const illusEls = document.querySelectorAll('.empty-state-illus');
if (illusEls.length) {
  const illusObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('paused', !entry.isIntersecting);
    });
  }, { threshold: 0 });
  illusEls.forEach(el => {
    el.classList.add('paused');
    illusObserver.observe(el);
  });
}

// ── Copy design token (radius, shadow, duration) ──
document.querySelectorAll('[data-token]').forEach(el => {
  const token = el.dataset.token;
  const copyValue = `var(${token})`;
  const originalText = el.textContent;
  el.setAttribute('role', 'button');
  el.setAttribute('tabindex', '0');
  el.title = `Click to copy ${copyValue}`;

  let copying = false;

  function handleTokenCopy() {
    if (copying) return;
    copying = true;
    copyToClipboard(copyValue, () => {
      el.textContent = 'Copied!';
      el.classList.add('token-copyable--copied');
      announce(`Copied: ${copyValue}`);
      setTimeout(() => {
        el.textContent = originalText;
        el.classList.remove('token-copyable--copied');
        copying = false;
      }, 1500);
    });
  }

  el.addEventListener('click', handleTokenCopy);
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTokenCopy();
    }
  });
});

// ── Copy icon name to clipboard ──
document.querySelectorAll('.icon-card').forEach(card => {
  const nameEl = card.querySelector('.icon-card-name');
  if (!nameEl) return;

  card.addEventListener('click', () => {
    const name = nameEl.textContent.trim();

    copyToClipboard(name, () => {
      nameEl.textContent = 'Copied!';
      nameEl.classList.add('icon-card-name--copied');
      announce(`Copied: ${name}`);
      setTimeout(() => {
        nameEl.textContent = name;
        nameEl.classList.remove('icon-card-name--copied');
      }, 1500);
    });
  });
});
