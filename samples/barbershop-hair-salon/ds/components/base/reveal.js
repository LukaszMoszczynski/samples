(function () {
  window.DS = window.DS || {};

  function animated() {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    return Boolean(window.gsap && window.ScrollTrigger) && !reduced;
  }

  function rowIndex(element) {
    let order = 0;
    for (let sibling = element.previousElementSibling; sibling; sibling = sibling.previousElementSibling) {
      if (sibling.hasAttribute('data-ds-reveal') && Math.abs(sibling.offsetTop - element.offsetTop) < 4) order += 1;
    }
    return order;
  }

  function reveal(element) {
    if (!animated()) return;
    if (element.getBoundingClientRect().top < window.innerHeight) return; // on screen already: shown as it is
    window.gsap.fromTo(
      element,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power4.out',
        delay: 0.1 + Math.min(rowIndex(element), 4) * 0.1,
        scrollTrigger: { trigger: element, start: 'top bottom', once: true },
      },
    );
  }

  function initElement(element) {
    element.dataset.dsReady = 'true';
    if (element.isConnected) reveal(element);
    else window.requestAnimationFrame(() => element.isConnected && reveal(element));
  }

  function init(root = document) {
    root.querySelectorAll('[data-ds-reveal]:not([data-ds-ready])').forEach(initElement);
  }

  window.DS.reveal = { init };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
  else init();
})();
