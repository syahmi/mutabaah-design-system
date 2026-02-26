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
