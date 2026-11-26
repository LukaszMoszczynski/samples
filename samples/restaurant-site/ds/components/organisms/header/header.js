(function () {
  window.DS = window.DS || {};

  const DURATION = 0.3;
  const SHADOW_DURATION = 0.2;
  const EASE = 'power1.out';
  const HOVER_CLOSE_DELAY = 200;

  function animated() {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    return Boolean(window.gsap) && !reduced;
  }

  function initHeader(header) {
    header.dataset.dsReady = 'true';
    const bar = header.querySelector('.ds-header__bar');
    const toggle = header.querySelector('[data-ds-mega-toggle]');
    const mega = toggle ? [...header.querySelectorAll('[data-ds-mega]')].find((panel) => panel.id === toggle.getAttribute('aria-controls')) : null;

    let scrolled = header.classList.contains('is-scrolled');
    function onScroll() {
      const now = window.scrollY > 0;
      if (now === scrolled) return;
      scrolled = now;
      const before = bar && animated() ? window.getComputedStyle(bar).boxShadow : null;
      header.classList.toggle('is-scrolled', now);
      if (before === null) return;
      const after = window.getComputedStyle(bar).boxShadow;
      window.gsap.killTweensOf?.(bar);
      window.gsap.fromTo(bar, { boxShadow: before }, { boxShadow: after, duration: SHADOW_DURATION, ease: EASE, clearProps: 'boxShadow' });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    if (!scrolled) onScroll();

    if (!toggle || !mega) return;
    const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';
    let hoverOpened = false;
    let closeTimer = null;
    const hoverable = window.matchMedia?.('(hover: hover) and (min-width: 1025px)');

    function setOpen(open) {
      if (open === isOpen()) return;
      toggle.setAttribute('aria-expanded', String(open));
      if (!animated()) {
        mega.hidden = !open;
        return;
      }
      window.gsap.killTweensOf?.(mega);
      if (open) {
        mega.hidden = false;
        window.gsap.fromTo(mega, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: DURATION, ease: EASE, clearProps: 'opacity,transform' });
      } else {
        window.gsap.to(mega, {
          opacity: 0,
          y: -8,
          duration: SHADOW_DURATION,
          ease: EASE,
          onComplete: () => {
            if (isOpen()) return; // reopened meanwhile
            mega.hidden = true;
            window.gsap.set?.(mega, { clearProps: 'opacity,transform' });
          },
        });
      }
    }

    toggle.addEventListener('click', () => {
      if (hoverOpened) {
        hoverOpened = false;
        return;
      }
      setOpen(!isOpen());
    });

    const item = toggle.closest('.ds-header__item');
    function onEnter() {
      if (!hoverable?.matches) return;
      clearTimeout(closeTimer);
      if (!isOpen()) {
        hoverOpened = true;
        setOpen(true);
      }
    }
    function onLeave() {
      if (!hoverable?.matches || !hoverOpened) return;
      closeTimer = setTimeout(() => {
        hoverOpened = false;
        setOpen(false);
      }, HOVER_CLOSE_DELAY);
    }
    [item, mega].forEach((element) => {
      element?.addEventListener('mouseenter', onEnter);
      element?.addEventListener('mouseleave', onLeave);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || event.defaultPrevented || !isOpen()) return;
      if (document.querySelector('dialog[open]')) return; // the dialog above takes this Escape
      event.preventDefault();
      hoverOpened = false;
      setOpen(false);
      toggle.focus();
    });
    document.addEventListener('click', (event) => {
      if (isOpen() && !header.contains(event.target)) {
        hoverOpened = false;
        setOpen(false);
      }
    });
    header.addEventListener('focusout', (event) => {
      if (isOpen() && event.relatedTarget && !header.contains(event.relatedTarget)) {
        hoverOpened = false;
        setOpen(false);
      }
    });
  }

  function init(root = document) {
    root.querySelectorAll('[data-ds-header]:not([data-ds-ready])').forEach(initHeader);
  }

  window.DS.header = { init };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
  else init();
})();
