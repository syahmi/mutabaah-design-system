// ── Accessibility Helpers ──
function trapFocus(element, e) {
  if (e.key !== 'Tab') return;
  const focusableElements = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusableElements.length === 0) return;
  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === firstFocusableElement) {
      lastFocusableElement.focus();
      e.preventDefault();
    }
  } else {
    if (document.activeElement === lastFocusableElement) {
      firstFocusableElement.focus();
      e.preventDefault();
    }
  }
}

// ── Theme toggle ──
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleLabel = document.getElementById('theme-toggle-label');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  const isDark = theme === 'dark';
  themeToggleLabel.textContent = isDark ? 'Light' : 'Dark';
  themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  themeToggleBtn.setAttribute('aria-pressed', isDark);
}

// Sync label with whatever the inline script set on <html>
applyTheme(document.documentElement.getAttribute('data-theme') || 'light');

themeToggleBtn.addEventListener('click', () => {
  applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// ── Version ──
const VERSION = '1.6.0';
const DATE = 'April 2026';
document.querySelectorAll('[data-version]').forEach(el => { el.textContent = el.dataset.version === 'full' ? `Design System v${VERSION} · ${DATE}` : VERSION; });
document.querySelectorAll('[data-date]').forEach(el => { el.textContent = DATE; });

// ── Lucide icons ──
if (window.lucide) lucide.createIcons();

// ── Megamenu ──
const megamenuToggle = document.getElementById('megamenu-toggle');
const megamenuPanel  = document.getElementById('megamenu-panel');
const megamenuActiveLabel = document.getElementById('megamenu-active-label');

const SECTION_LABELS = {
  typography: 'Typography', colors: 'Colors', spacing: 'Spacing',
  iconography: 'Iconography', components: 'Components',
  'form-controls': 'Form Controls', tasks: 'Tasks', navigation: 'Navigation',
  'empty-states': 'Empty States', motion: 'Motion', avatar: 'Avatar',
  overlays: 'Overlays', breadcrumb: 'Breadcrumb',
};

function openMegamenu() {
  megamenuToggle.setAttribute('aria-expanded', 'true');
  megamenuPanel.classList.add('open');
  megamenuPanel.setAttribute('aria-hidden', 'false');
  const firstLink = megamenuPanel.querySelector('.megamenu-link');
  if (firstLink) requestAnimationFrame(() => firstLink.focus());
}
function closeMegamenu() {
  megamenuToggle.setAttribute('aria-expanded', 'false');
  megamenuPanel.classList.remove('open');
  megamenuPanel.setAttribute('aria-hidden', 'true');
}

if (megamenuToggle) {
  megamenuToggle.addEventListener('click', () => {
    megamenuPanel.classList.contains('open') ? closeMegamenu() : openMegamenu();
  });
}

// Close on outside click
document.addEventListener('click', e => {
  if (megamenuPanel && megamenuPanel.classList.contains('open') &&
      !megamenuPanel.contains(e.target) && !megamenuToggle.contains(e.target)) {
    closeMegamenu();
  }
});

// Megamenu keyboard navigation
if (megamenuPanel) {
  megamenuPanel.addEventListener('keydown', e => {
    trapFocus(megamenuPanel, e);

    if (['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(e.key)) {
      const links = Array.from(megamenuPanel.querySelectorAll('.megamenu-link'));
      const currentIndex = links.indexOf(document.activeElement);
      if (currentIndex === -1) return;

      e.preventDefault();
      let nextIndex;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        nextIndex = (currentIndex + 1) % links.length;
      } else {
        nextIndex = (currentIndex - 1 + links.length) % links.length;
      }
      links[nextIndex].focus();
    }
  });
}

// Close on Escape (megamenu takes priority; modal handled separately)
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && megamenuPanel && megamenuPanel.classList.contains('open')) {
    closeMegamenu();
    megamenuToggle.focus();
  }
});

// Close when a link inside the panel is clicked
megamenuPanel && megamenuPanel.querySelectorAll('.megamenu-link').forEach(link => {
  link.addEventListener('click', closeMegamenu);
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
      }
      // Update toggle button label and accent state
      if (megamenuActiveLabel) {
        const label = SECTION_LABELS[entry.target.id];
        megamenuActiveLabel.textContent = label || 'Sections';
        if (megamenuToggle) megamenuToggle.classList.toggle('has-active', !!label);
      }
    }
  });
}, { rootMargin: '-20% 0px -75% 0px' });

document.querySelectorAll('section[id]').forEach(section => observer.observe(section));

// ── Search Index ──
let searchIndex = [];

function buildSearchIndex() {
  const index = [];

  // 1. Sections from SECTION_LABELS (for consistency with megamenu)
  Object.entries(SECTION_LABELS).forEach(([id, label]) => {
    index.push({
      id,
      label,
      type: 'Section',
      category: 'Foundation'
    });
  });

  // 2. Components/Sub-labels
  document.querySelectorAll('section').forEach(section => {
    const sectionTitle = section.querySelector('.section-title')?.textContent || '';
    section.querySelectorAll('.sub-label').forEach(subLabel => {
      const labelText = subLabel.textContent.trim();
      if (labelText && !Object.values(SECTION_LABELS).includes(labelText)) {
        index.push({
          id: section.id,
          label: labelText,
          type: 'Component',
          category: sectionTitle
        });
      }
    });
  });

  // 3. Icons
  document.querySelectorAll('.icon-card').forEach(card => {
    const name = card.querySelector('.icon-card-name')?.textContent.trim();
    if (name) {
      index.push({
        id: 'iconography',
        label: name,
        type: 'Icon',
        category: 'Iconography'
      });
    }
  });

  searchIndex = index;
}

// ── Search Logic ──
function getSearchScore(item, query) {
  const label = item.label.toLowerCase();
  const type = item.type.toLowerCase();
  const cat = (item.category || '').toLowerCase();
  const q = query.toLowerCase();

  // 1. Exact match (Highest priority)
  if (label === q) return 1000;
  
  // 2. Starts with query
  if (label.startsWith(q)) return 800;
  
  // 3. Word starts with query (e.g. "Form Controls" matched by "Controls")
  if (label.split(' ').some(word => word.startsWith(q))) return 600;

  // 4. Contains query
  if (label.includes(q)) return 400;

  // 5. Type or Category match
  if (type.startsWith(q) || cat.startsWith(q)) return 200;

  // 6. Fuzzy character sequence match (Lowest priority)
  // Checks if characters of query appear in order in the label
  let score = 0;
  let labelIdx = 0;
  let queryIdx = 0;
  let matches = 0;
  let consecutive = 0;

  while (labelIdx < label.length && queryIdx < q.length) {
    if (label[labelIdx] === q[queryIdx]) {
      matches++;
      queryIdx++;
      consecutive++;
      score += 10 + (consecutive * 2); // Bonus for consecutive matches
    } else {
      consecutive = 0;
    }
    labelIdx++;
  }

  if (matches === q.length) return score;

  return 0;
}

// ── Search ──
function setupSearch(inputEl, resultsEl) {
  if (!inputEl || !resultsEl) return;

  inputEl.addEventListener('input', () => {
    const query = inputEl.value.toLowerCase().trim();
    if (!query) {
      resultsEl.classList.remove('open');
      resultsEl.setAttribute('aria-hidden', 'true');
      return;
    }

    // Filter and score
    const scoredMatches = searchIndex
      .map(item => ({ item, score: getSearchScore(item, query) }))
      .filter(m => m.score > 0)
      .sort((a, b) => b.score - a.score) // Sort by highest score
      .slice(0, 8);

    renderSearchResults(scoredMatches.map(m => m.item), resultsEl, inputEl);
  });

  function renderSearchResults(matches, container, input) {
    container.innerHTML = '';
    if (matches.length === 0) {
      container.innerHTML = '<div class="nav-search-no-results">No matches found</div>';
    } else {
      matches.forEach(item => {
        const resultItem = document.createElement('a');
        resultItem.href = `#${item.id}`;
        resultItem.className = 'nav-search-item';
        if (item.type === 'Icon') resultItem.classList.add('nav-search-item--icon');
        
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'nav-search-item-content';

        if (item.type === 'Icon') {
          const iconPreview = document.createElement('div');
          iconPreview.className = 'nav-search-item-preview';
          // Find the source icon in the DOM to clone it
          const sourceCard = Array.from(document.querySelectorAll('.icon-card')).find(c => 
            c.querySelector('.icon-card-name')?.textContent.trim() === item.label
          );
          if (sourceCard) {
            const svg = sourceCard.querySelector('svg');
            if (svg) iconPreview.appendChild(svg.cloneNode(true));
          }
          resultItem.appendChild(iconPreview);
        }
        
        const labelWrapper = document.createElement('div');
        labelWrapper.className = 'nav-search-item-label-wrap';
        
        const labelText = document.createElement('span');
        labelText.className = 'nav-search-item-label';
        labelText.textContent = item.label;
        
        const typeBadge = document.createElement('span');
        typeBadge.className = `nav-search-badge nav-search-badge--${item.type.toLowerCase()}`;
        typeBadge.textContent = item.type;
        
        labelWrapper.appendChild(labelText);
        labelWrapper.appendChild(typeBadge);
        
        const categoryText = document.createElement('div');
        categoryText.className = 'nav-search-item-category';
        categoryText.textContent = item.category;
        
        contentWrapper.appendChild(labelWrapper);
        contentWrapper.appendChild(categoryText);
        resultItem.appendChild(contentWrapper);

        resultItem.addEventListener('click', () => {
          container.classList.remove('open');
          container.setAttribute('aria-hidden', 'true');
          input.value = '';
          if (megamenuPanel && megamenuPanel.classList.contains('open')) {
            closeMegamenu();
          }
        });
        container.appendChild(resultItem);
      });
    }
    container.classList.add('open');
    container.setAttribute('aria-hidden', 'false');
  }

  // Keyboard navigation for search
  inputEl.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' && resultsEl.classList.contains('open')) {
      const firstItem = resultsEl.querySelector('.nav-search-item');
      if (firstItem) {
        e.preventDefault();
        firstItem.focus();
      }
    }
    if (e.key === 'Escape') {
      resultsEl.classList.remove('open');
      resultsEl.setAttribute('aria-hidden', 'true');
      inputEl.blur();
    }
  });

  resultsEl.addEventListener('keydown', e => {
    const items = Array.from(resultsEl.querySelectorAll('.nav-search-item'));
    const currentIndex = items.indexOf(document.activeElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(currentIndex + 1) % items.length].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentIndex === 0) {
        inputEl.focus();
      } else {
        items[(currentIndex - 1 + items.length) % items.length].focus();
      }
    } else if (e.key === 'Escape') {
      resultsEl.classList.remove('open');
      resultsEl.setAttribute('aria-hidden', 'true');
      inputEl.focus();
    }
  });
}

// Initialize both search bars
setupSearch(document.getElementById('nav-search-input'), document.getElementById('nav-search-results'));
setupSearch(document.getElementById('mobile-search-input'), document.getElementById('mobile-search-results'));

// Close search results on outside click
document.addEventListener('click', e => {
  const sInput = document.getElementById('nav-search-input');
  const sResults = document.getElementById('nav-search-results');
  const mInput = document.getElementById('mobile-search-input');
  const mResults = document.getElementById('mobile-search-results');

  if (sInput && sResults && !sInput.contains(e.target) && !sResults.contains(e.target)) {
    sResults.classList.remove('open');
    sResults.setAttribute('aria-hidden', 'true');
  }
  if (mInput && mResults && !mInput.contains(e.target) && !mResults.contains(e.target)) {
    mResults.classList.remove('open');
    mResults.setAttribute('aria-hidden', 'true');
  }
});

// ── Shared clipboard copy utility ──
function copyToClipboard(text, onSuccess) {
  navigator.clipboard.writeText(text).then(onSuccess).catch(() => { announce('Copy failed. Try selecting and copying manually.'); });
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

// ── Modal demos ──
function openModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.setAttribute('aria-hidden', 'false');
  overlay.removeAttribute('inert');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  const focusable = overlay.querySelector('button, input, textarea, [tabindex="0"]');
  if (focusable) requestAnimationFrame(() => focusable.focus());

  // Trap focus while modal is open
  overlay._trapFocusHandler = (e) => trapFocus(overlay, e);
  overlay.addEventListener('keydown', overlay._trapFocusHandler);
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.setAttribute('aria-hidden', 'true');
  overlay.setAttribute('inert', '');
  overlay.classList.remove('open');
  document.body.style.overflow = '';

  // Remove focus trap
  if (overlay._trapFocusHandler) {
    overlay.removeEventListener('keydown', overlay._trapFocusHandler);
    delete overlay._trapFocusHandler;
  }

  // Return focus to the trigger
  const openFormBtn = document.getElementById('open-modal-form');
  const openConfirmBtn = document.getElementById('open-modal-confirm');
  if (id === 'modal-form' && openFormBtn) openFormBtn.focus();
  if (id === 'modal-confirm' && openConfirmBtn) openConfirmBtn.focus();
}

const openFormBtn = document.getElementById('open-modal-form');
if (openFormBtn) openFormBtn.addEventListener('click', () => openModal('modal-form'));

const openConfirmBtn = document.getElementById('open-modal-confirm');
if (openConfirmBtn) openConfirmBtn.addEventListener('click', () => openModal('modal-confirm'));

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  // Close on backdrop click
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(overlay.id); });
  // Close buttons inside modal
  overlay.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(overlay.id));
  });
});

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const open = document.querySelector('.modal-overlay.open');
    if (open) closeModal(open.id);
  }
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

// ── Copy component code to clipboard ──
document.querySelectorAll('.copy-code-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation(); // Don't trigger any parent click handlers
    const wrapper = btn.closest('.example-wrapper');
    if (!wrapper) return;

    // Use a specific target if provided via data attribute, otherwise take first child that isn't the button or feedback
    const targetSelector = btn.dataset.copyTarget;
    let target = targetSelector ? wrapper.querySelector(targetSelector) : null;
    if (!target) {
      target = Array.from(wrapper.children).find(el => !el.classList.contains('copy-code-btn') && !el.classList.contains('copy-code-feedback'));
    }
    if (!target) return;

    // Clone target to clean it up before copying
    const clone = target.cloneNode(true);

    // Remove design-system specific demo classes
    clone.classList.remove('state-hover');
    clone.querySelectorAll('.state-hover').forEach(el => el.classList.remove('state-hover'));
    
    // Remove inline styles if they are just for demo (like margins)
    // clone.removeAttribute('style'); // Maybe too aggressive, let's keep it for now but remove specific demo hacks

    let html = clone.outerHTML;

    // Optional: Clean up whitespace and format slightly?
    // For now, let's just trim and ensure it's readable.
    html = html.trim();

    copyToClipboard(html, () => {
      btn.classList.add('copy-code-btn--copied');
      // Change icon to checkmark temporarily
      const originalIcon = btn.innerHTML;
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      
      announce('Component code copied to clipboard');
      
      setTimeout(() => {
        btn.classList.remove('copy-code-btn--copied');
        btn.innerHTML = originalIcon;
      }, 2000);
    });
  });
});

// ── Grid Spacing Explorer ──
const explorerGrid = document.getElementById('explorer-grid');
const gapControls  = document.getElementById('gap-controls');
const padControls  = document.getElementById('pad-controls');

if (explorerGrid && gapControls && padControls) {
  function setupControls(parent, property) {
    parent.querySelectorAll('.control-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active state
        parent.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Apply value
        explorerGrid.style[property] = btn.dataset.val;
      });
    });
  }

  setupControls(gapControls, 'gap');
  setupControls(padControls, 'padding');
}

// ── Initialize Search Index ──
buildSearchIndex();
