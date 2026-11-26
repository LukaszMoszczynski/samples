(function () {
  window.DS = window.DS || {};

  const DURATION = 0.3;
  const EASE = 'power1.out';

  function animated() {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    return Boolean(window.gsap) && !reduced;
  }

  let lockedStyle = null;
  function lockScroll() {
    if (lockedStyle) return;
    const root = document.documentElement;
    const scrollbar = window.innerWidth - root.clientWidth;
    lockedStyle = { overflow: root.style.overflow, paddingRight: root.style.paddingRight };
    if (scrollbar > 0) root.style.paddingRight = `${(parseFloat(window.getComputedStyle(root).paddingRight) || 0) + scrollbar}px`;
    root.style.overflow = 'hidden';
  }
  function unlockScroll() {
    if (!lockedStyle) return;
    const root = document.documentElement;
    root.style.overflow = lockedStyle.overflow;
    root.style.paddingRight = lockedStyle.paddingRight;
    lockedStyle = null;
  }

  function initDrawer(drawer) {
    drawer.dataset.dsReady = 'true';
    const scope = drawer.closest('[data-ds-header]') ?? drawer.parentElement ?? drawer;
    const burger = [...scope.querySelectorAll('.ds-nav-burger[aria-controls]')].find((button) => button.getAttribute('aria-controls') === drawer.id);
    if (!burger) return;
    burger.dataset.dsReady = 'true';
    const isOpen = () => burger.getAttribute('aria-expanded') === 'true';

    let inerted = [];
    function holdFocus(on) {
      inerted.forEach((node) => {
        node.inert = false;
      });
      inerted = [];
      if (!on) return;
      for (let node = scope; node?.parentElement && node !== document.body; node = node.parentElement) {
        for (const sibling of node.parentElement.children) {
          if (sibling !== node && !sibling.inert && !/^(SCRIPT|STYLE|LINK)$/.test(sibling.tagName)) {
            sibling.inert = true;
            inerted.push(sibling);
          }
        }
      }
    }

    function setOpen(open) {
      if (open === isOpen()) return;
      burger.setAttribute('aria-expanded', String(open));
      holdFocus(open);
      if (open) lockScroll();
      else unlockScroll();
      if (!animated()) {
        drawer.hidden = !open;
        return;
      }
      window.gsap.killTweensOf?.(drawer);
      if (open) {
        drawer.hidden = false;
        window.gsap.fromTo(drawer, { xPercent: 100 }, { xPercent: 0, duration: DURATION, ease: EASE, clearProps: 'transform' });
      } else {
        window.gsap.to(drawer, {
          xPercent: 100,
          duration: DURATION,
          ease: EASE,
          onComplete: () => {
            if (isOpen()) return; // reopened meanwhile
            drawer.hidden = true;
            window.gsap.set?.(drawer, { clearProps: 'transform' });
          },
        });
      }
    }

    burger.addEventListener('click', () => setOpen(!isOpen()));
    drawer.addEventListener('click', (event) => {
      if (event.target.closest?.('a')) setOpen(false);
    });
    document.addEventListener(
      'keydown',
      (event) => {
        if (event.key !== 'Escape' || event.defaultPrevented || !isOpen()) return;
        if (document.querySelector('dialog[open]')) return; // the dialog above takes this Escape
        event.preventDefault();
        setOpen(false);
        burger.focus();
      },
      true,
    );
    window.matchMedia?.('(min-width: 1025px)').addEventListener?.('change', (event) => {
      if (event.matches) setOpen(false);
    });
  }

  function init(root = document) {
    root.querySelectorAll('[data-ds-mobile-menu]:not([data-ds-ready])').forEach(initDrawer);
  }

  window.DS.mobileMenu = { init };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
  else init();
})();
