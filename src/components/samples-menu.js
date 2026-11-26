// Samples menu behaviour: the burger opens a full-screen menu that grows as a circle from the button (shrinks back
// into it on close), the rows rise in; Escape or the button closes it, focus stays inside while open. Every samples
// row on the page (menu and index) gets the pointer-following preview and tints the menu in its colour.
import { gsap } from 'gsap';

export function initSamplesMenu() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const button = document.querySelector('[data-sm-open]');
  const menu = document.querySelector('[data-sm-menu]');
  const follow = document.querySelector('[data-sm-follow]');
  if (!button || !menu) return;
  const label = button.querySelector('.sm-burger__label');
  const closedLabel = label.textContent;
  let open = false;

  const centre = () => {
    const box = button.getBoundingClientRect();
    return `${Math.round(box.left + box.width / 2)}px ${Math.round(box.top + box.height / 2)}px`;
  };
  const reach = () => Math.ceil(Math.hypot(window.innerWidth, window.innerHeight));
  const parts = () => menu.querySelectorAll('.sm-menu__kicker, .sm-row, .sm-menu__foot > *');

  function setOpen(next) {
    if (next === open) return;
    open = next;
    button.setAttribute('aria-expanded', String(open));
    label.textContent = open ? 'Zamknij' : closedLabel;
    document.documentElement.classList.toggle('sm-locked', open);
    gsap.killTweensOf([menu, ...parts()]);
    if (open) {
      menu.hidden = false;
      menu.scrollTop = 0;
      if (!reduceMotion) {
        gsap.fromTo(menu, { clipPath: `circle(0px at ${centre()})` }, { clipPath: `circle(${reach()}px at ${centre()})`, duration: 0.9, ease: 'power3.inOut', onComplete: () => gsap.set(menu, { clearProps: 'clipPath' }) });
        gsap.fromTo(parts(), { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.06, delay: 0.3, ease: 'power3.out' });
      }
      menu.querySelector('a')?.focus({ preventScroll: true });
    } else {
      hidePreview();
      const done = () => { menu.hidden = true; gsap.set(menu, { clearProps: 'clipPath' }); };
      if (reduceMotion) done();
      else gsap.fromTo(menu, { clipPath: `circle(${reach()}px at ${centre()})` }, { clipPath: `circle(0px at ${centre()})`, duration: 0.6, ease: 'power3.in', onComplete: done });
      button.focus({ preventScroll: true });
    }
  }

  // The floating button steps aside while the visitor scrolls down (so it never covers a price or a label for long)
  // and comes back on scrolling up, near the top or the bottom of the page, and whenever it has focus or the menu is open.
  if (button.classList.contains('sm-burger--floating')) {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const nearEdge = y < 160 || window.innerHeight + y > document.documentElement.scrollHeight - 160;
      const tucked = !open && !button.matches(':focus-visible') && !nearEdge && y > lastY + 4;
      if (Math.abs(y - lastY) > 4 || nearEdge) {
        button.classList.toggle('sm-burger--tucked', tucked);
        lastY = y;
      }
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    button.addEventListener('focus', () => button.classList.remove('sm-burger--tucked'));
  }

  button.addEventListener('click', () => setOpen(!open));
  menu.addEventListener('click', (event) => { if (event.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (event) => {
    if (!open) return;
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false); return; }
    if (event.key !== 'Tab') return;
    const stops = [button, ...menu.querySelectorAll('a')];
    const index = stops.indexOf(document.activeElement);
    if (event.shiftKey && index <= 0) { event.preventDefault(); stops.at(-1).focus(); }
    else if (!event.shiftKey && index === stops.length - 1) { event.preventDefault(); stops[0].focus(); }
  });

  // Pointer-following preview, tilted by the pointer's speed; only for a mouse and without reduced motion.
  const canFollow = follow && !reduceMotion && window.matchMedia('(pointer: fine)').matches;
  let moveX; let moveY; let tilt; let lastX = 0;
  if (canFollow) {
    moveX = gsap.quickTo(follow, 'x', { duration: 0.5, ease: 'power3.out' });
    moveY = gsap.quickTo(follow, 'y', { duration: 0.5, ease: 'power3.out' });
    tilt = gsap.quickTo(follow, 'rotation', { duration: 0.6, ease: 'power3.out' });
    window.addEventListener('pointermove', (event) => {
      moveX(event.clientX + 28);
      moveY(event.clientY - follow.offsetHeight / 2);
      tilt(gsap.utils.clamp(-10, 10, (event.clientX - lastX) * 0.6));
      lastX = event.clientX;
    }, { passive: true });
  }
  function showPreview(row) {
    if (!canFollow || !row.dataset.preview) return;
    if (follow.getAttribute('src') !== row.dataset.preview) follow.src = row.dataset.preview;
    follow.hidden = false;
    gsap.to(follow, { opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
  }
  function hidePreview() {
    if (!canFollow) return;
    gsap.to(follow, { opacity: 0, scale: 0.85, duration: 0.25, ease: 'power2.in', overwrite: 'auto' });
  }
  document.querySelectorAll('[data-sm-row]').forEach((row) => {
    const colour = getComputedStyle(row.parentElement).getPropertyValue('--sm-primary').trim();
    row.addEventListener('pointerenter', () => {
      showPreview(row);
      if (menu.contains(row) && colour) menu.style.setProperty('--sm-tint', colour);
    });
    row.addEventListener('pointerleave', hidePreview);
  });
}
