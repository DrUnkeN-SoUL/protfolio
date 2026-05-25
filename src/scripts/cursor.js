export function initCursor() {
  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return;

  const isTouchDevice = () => window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (isTouchDevice()) return;

  const hoverTargets = 'a, button, input, textarea, select, label, [role="button"], .nav-link, .filter-btn, .theme-btn, .copy-btn, .social-btn';

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });

  document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
  document.addEventListener('mouseup',   () => cursor.classList.remove('clicking'));

  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('hovering');
    } else {
      cursor.classList.remove('hovering');
    }
  });

  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
}
