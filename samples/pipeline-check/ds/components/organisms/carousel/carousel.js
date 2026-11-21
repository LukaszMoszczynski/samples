(function () {
  window.DS = window.DS || {};

  const SPEED = 450; // the site's carousel speed (assets/js/carousel.js)
  const FOCUSABLE = 'a, button, input, select, textarea, [tabindex]';
  let trackCount = 0;

  function reducedMotion() {
    return Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  }

  function slideGap(element) {
    return parseFloat(window.getComputedStyle(element).getPropertyValue('--carousel-slide-gap')) || 0;
  }

  function ensureId(track) {
    if (track.id) return track.id;
    let id;
    do {
      trackCount += 1;
      id = `ds-carousel-track-${trackCount}`;
    } while (document.getElementById(id));
    track.id = id;
    return id;
  }

  function setTabbable(slide, on) {
    slide.querySelectorAll(FOCUSABLE).forEach((node) => {
      if (!on && !('dsUntab' in node.dataset)) {
        node.dataset.dsUntab = node.getAttribute('tabindex') ?? '';
        node.setAttribute('tabindex', '-1');
      } else if (on && 'dsUntab' in node.dataset) {
        if (node.dataset.dsUntab === '') node.removeAttribute('tabindex');
        else node.setAttribute('tabindex', node.dataset.dsUntab);
        delete node.dataset.dsUntab;
      }
    });
  }

  function initCarousel(element) {
    const viewport = element.querySelector('.ds-carousel__viewport');
    const track = element.querySelector('.ds-carousel__track');
    if (!viewport || !track) return;
    element.dataset.dsReady = 'true';

    const slides = [...track.children];
    const count = slides.length;
    const items = Math.min(4, Math.max(2, Number(element.dataset.dsItems) || 3));
    const prev = element.querySelector('[data-ds-carousel-prev]');
    const next = element.querySelector('[data-ds-carousel-next]');
    const usesCounter = element.dataset.dsPagination === 'counter';
    const dots = usesCounter ? null : element.querySelector('[data-ds-carousel-dots]');
    const counter = usesCounter ? element.querySelector('.ds-carousel-controls__counter') : null;
    const centered = 'dsCentered' in element.dataset;
    const centering = centered && count > items;
    const breakpoints = {
      782: { slidesPerView: Math.min(2, items) + 0.15 },
      1025: { slidesPerView: centered ? items : Math.min(2, items) },
      1200: { slidesPerView: items },
    };
    const mostInView = Math.max(1, ...Object.values(breakpoints).map((breakpoint) => Math.ceil(breakpoint.slidesPerView)));
    const loop = count >= mostInView * 2;

    const trackId = ensureId(track);
    [prev, next].forEach((button) => button?.setAttribute('aria-controls', trackId));

    function syncPagination(swiper) {
      const active = count ? swiper.realIndex % count : 0;
      dots?.querySelectorAll('[data-ds-dot]').forEach((dot, index) => {
        if (index === active) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
      if (counter) counter.textContent = `${active + 1} / ${count}`;
      syncActive(swiper);
    }

    function syncActive(swiper) {
      if (!centered || !count) return;
      const active = swiper.isLocked ? Math.floor((count - 1) / 2) : swiper.realIndex % count;
      slides.forEach((slide, index) => {
        slide.classList.toggle('is-active', index === active);
        slide.firstElementChild?.classList.toggle('is-active', index === active);
      });
    }

    function syncSlides(swiper) {
      const box = viewport.getBoundingClientRect();
      const inside = (slide) => {
        const rect = slide.getBoundingClientRect();
        return rect.width > 0 && rect.left >= box.left - 1 && rect.right <= box.right + 1;
      };
      const shown = slides.map(inside);
      if (!shown.some(Boolean) && count) shown[swiper.realIndex % count] = true;
      slides.forEach((slide, index) => {
        slide.setAttribute('aria-label', `${index + 1} z ${count}`);
        setTabbable(slide, shown[index]);
        if (shown[index]) slide.removeAttribute('aria-hidden');
        else slide.setAttribute('aria-hidden', 'true');
      });
    }

    function sync(swiper) {
      syncPagination(swiper);
      syncSlides(swiper);
    }

    const swiper = new window.Swiper(viewport, {
      wrapperClass: 'ds-carousel__track',
      slideClass: 'ds-carousel__slide',
      loop,
      rewind: !loop,
      speed: reducedMotion() ? 0 : SPEED,
      slidesPerView: 1,
      spaceBetween: slideGap(element),
      watchOverflow: true,
      watchSlidesProgress: true,
      centeredSlides: centering,
      initialSlide: centering && window.innerWidth >= 1200 ? 1 : 0,
      breakpoints,
      navigation: { prevEl: prev, nextEl: next, disabledClass: 'is-disabled', lockClass: 'is-locked', hiddenClass: 'is-hidden' },
      a11y: {
        prevSlideMessage: prev?.getAttribute('aria-label') || 'Poprzednie',
        nextSlideMessage: next?.getAttribute('aria-label') || 'Następne',
        slideLabelMessage: '{{index}} z {{slidesLength}}',
        slideRole: null, // the slides are <li> items of the track's list
      },
      on: {
        afterInit: sync,
        slideChange: syncPagination,
        transitionEnd: syncSlides,
        resize: syncSlides,
        beforeResize: (instance) => {
          instance.params.spaceBetween = slideGap(element);
        },
        lock: (instance) => {
          element.classList.add('is-static');
          syncActive(instance);
        },
        unlock: (instance) => {
          element.classList.remove('is-static');
          syncActive(instance);
        },
      },
    });

    dots?.addEventListener('click', (event) => {
      const dot = event.target.closest?.('[data-ds-dot]');
      if (dot) swiper.slideToLoop(Number(dot.dataset.dsDot));
    });
    element.classList.add('is-ready');
  }

  function initWhenConnected(element) {
    if (element.isConnected) initCarousel(element);
    else window.requestAnimationFrame(() => {
      if (element.isConnected && !element.dataset.dsReady) initCarousel(element);
    });
  }

  function init(root = document) {
    if (!window.Swiper) return; // stays a scrollable row; init again once Swiper is there
    root.querySelectorAll('.ds-carousel[data-ds-carousel]:not([data-ds-ready])').forEach(initWhenConnected);
  }

  window.DS.carousel = { init };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
  else init();
})();
