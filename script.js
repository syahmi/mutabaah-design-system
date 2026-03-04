// ── Lucide icons ──
window.addEventListener('load', () => {
  if (window.lucide) lucide.createIcons();
});

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

// ── Copy hex to clipboard (entire swatch card is the click target) ──
document.querySelectorAll('.swatch-card').forEach(card => {
  const hexEl = card.querySelector('.swatch-hex');
  if (!hexEl) return;

  const originalText = hexEl.textContent;
  const hexValue = originalText.split('/')[0].trim();

  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.title = `Click to copy ${hexValue}`;

  let copying = false;

  function handleCopy() {
    if (copying) return;
    copying = true;

    copyToClipboard(hexValue, () => {
      hexEl.textContent = 'Copied!';
      hexEl.classList.add('swatch-hex--copied');
      announce(`Copied: ${hexValue}`);
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
function playDemo(type) {
  if (type === 'enter') {
    const el = document.getElementById('demo-enter');
    el.classList.remove('demo-anim-enter');
    void el.offsetWidth;
    el.classList.add('demo-anim-enter');

  } else if (type === 'exit') {
    const el = document.getElementById('demo-exit');
    el.classList.remove('demo-anim-exit', 'demo-anim-enter');
    void el.offsetWidth;
    el.classList.add('demo-anim-exit');
    setTimeout(() => {
      el.classList.remove('demo-anim-exit');
      void el.offsetWidth;
      el.classList.add('demo-anim-enter');
    }, 500);

  } else if (type === 'complete') {
    const check = document.getElementById('demo-complete-check');
    const text  = document.getElementById('demo-complete-text');
    check.classList.remove('filled');
    text.classList.remove('done');
    void check.offsetWidth;
    setTimeout(() => {
      check.classList.add('filled');
      text.classList.add('done');
    }, 80);
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
