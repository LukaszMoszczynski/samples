// Behaviour and motion for the logistics sample (GSAP + ScrollTrigger + MotionPath).
// Content is complete without JS; motion runs only when the visitor has not asked for reduced motion.
import { gsap } from 'gsap';
import { enhanceForms } from './forms.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// Entrance targets are hidden by CSS from the first paint while <html data-motion> is set; tell the page we are here.
document.documentElement.setAttribute('data-motion-ready', '');

// Forms: animated dropdowns and the validation demo (see forms.js).
enhanceForms();

// Header: solid once the page scrolls; drawer on phones.
const header = document.querySelector('[data-site-header]');
const burger = document.querySelector('[data-site-burger]');
const drawer = document.getElementById('site-drawer');
const setScrolled = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
setScrolled();
window.addEventListener('scroll', setScrolled, { passive: true });

const menuMotionOff = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const setDrawer = (open) => {
  if (!burger || !drawer) return;
  if ((burger.getAttribute('aria-expanded') === 'true') === open) return;
  burger.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
  const items = drawer.querySelectorAll('li, :scope > a');
  gsap.killTweensOf([drawer, ...items]);
  if (open) {
    drawer.hidden = false;
    if (menuMotionOff) return;
    // The panel wipes down from under the header, then the links rise in one after another.
    gsap.fromTo(drawer, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.5, ease: 'power3.out' });
    gsap.fromTo(items, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.05, delay: 0.12, ease: 'power3.out' });
  } else if (menuMotionOff) {
    drawer.hidden = true;
  } else {
    gsap.to(drawer, { clipPath: 'inset(0 0 100% 0)', duration: 0.35, ease: 'power2.in', onComplete: () => { drawer.hidden = true; gsap.set(drawer, { clearProps: 'clipPath' }); } });
  }
};
// Close it when the screen grows past the phone menu, and on Escape (focus back to the burger).
window.matchMedia('(min-width: 1024px)').addEventListener('change', (event) => { if (event.matches) setDrawer(false); });
burger?.addEventListener('click', () => setDrawer(burger.getAttribute('aria-expanded') !== 'true'));
drawer?.addEventListener('click', (event) => {
  if (event.target.closest('a')) setDrawer(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && burger?.getAttribute('aria-expanded') === 'true') {
    setDrawer(false);
    burger.focus();
  }
});

// Tracking field in the hero: a demo answer.
const trackForm = document.querySelector('[data-track-form]');
trackForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const number = new FormData(trackForm).get('number').toString().trim().toUpperCase();
  const result = trackForm.querySelector('[data-track-result]');
  result.textContent = number === 'TL-48213' || number === ''
    ? 'TL-48213: w drodze, za Wrocławiem. Planowany rozładunek w Pradze o 14:20.'
    : `${number}: w przykładzie działa numer TL-48213.`;
});

// Quote form: sample only, nothing is sent.
const quoteForm = document.querySelector('[data-quote-form]');
quoteForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  quoteForm.querySelector('[data-quote-thanks]').hidden = false;
});

const motion = gsap.matchMedia();
motion.add('(prefers-reduced-motion: no-preference)', () => {
  // Hero: copy rises in, the route draws itself, cities pop, the vehicle drives the route, the chip slides in.
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro.fromTo('[data-hero-item]', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.09 });
  const line = document.querySelector('[data-route-line]');
  if (line) {
        intro
      .fromTo('[data-route-city]', { opacity: 0, scale: 0.4, transformOrigin: 'center' }, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05 }, 0.2)
      .fromTo(line, { strokeDasharray: 1000, strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, 0.5)
      .fromTo('[data-route-chip]', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 1.6);
    gsap.to('[data-route-truck]', {
      motionPath: { path: line, align: line, alignOrigin: [0.5, 0.5] },
      duration: 7,
      ease: 'none',
      repeat: -1,
      delay: 1.2,
      repeatDelay: 0.8,
    });
  }

  // Sections: rise in as they enter.
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 85%',
    once: true,
    onEnter: (elements) => gsap.fromTo(elements, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' }),
  });

  // Figures count up.
  gsap.utils.toArray('[data-count-to]').forEach((element) => {
    const target = Number(element.dataset.countTo);
    const counter = { value: 0 };
    gsap.to(counter, {
      value: target,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: element, start: 'top 90%', once: true },
      onUpdate: () => { element.textContent = Math.round(counter.value).toLocaleString('pl-PL'); },
    });
  });

  // Tracking panel: progress bar fills, steps light up one after another.
  const card = document.querySelector('[data-tracking-card]');
  if (card) {
    gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 75%', once: true } })
      .from('[data-tracking-bar]', { scaleX: 0, duration: 1.2, ease: 'power2.inOut' })
      .from('[data-tracking-step]', { x: -16, opacity: 0, duration: 0.45, stagger: 0.18 }, 0.2);
  }

  // Process: the line fills as you scroll past, steps follow.
  const processLine = document.querySelector('[data-process-line]');
  if (processLine) {
    const vertical = window.matchMedia('(max-width: 899px)').matches;
    gsap.fromTo(processLine, vertical ? { scaleY: 0 } : { scaleX: 0 }, {
      ...(vertical ? { scaleY: 1 } : { scaleX: 1 }),
      ease: 'none',
      scrollTrigger: { trigger: processLine.closest('.ds-process__track'), start: 'top 75%', end: 'bottom 55%', scrub: 0.6 },
    });
    gsap.from('[data-process-step]', {
      y: 24, opacity: 0, duration: 0.6, stagger: 0.15,
      scrollTrigger: { trigger: processLine.closest('.ds-process__track'), start: 'top 80%', once: true },
    });
  }

  // FAQ: the answer slides open and closed (native details without motion).
  gsap.utils.toArray('.ds-faq__item').forEach((item) => {
    const summary = item.querySelector('summary');
    const panel = item.querySelector('.ds-faq__panel');
    summary.addEventListener('click', (event) => {
      event.preventDefault();
      if (item.dataset.animating) return;
      item.dataset.animating = 'true';
      const done = () => { delete item.dataset.animating; gsap.set(panel, { clearProps: 'height,opacity' }); };
      if (item.open) {
        gsap.to(panel, { height: 0, opacity: 0, duration: 0.35, ease: 'power2.inOut', onComplete: () => { item.open = false; done(); } });
      } else {
        item.open = true;
        gsap.from(panel, { height: 0, opacity: 0, duration: 0.45, ease: 'power2.out', onComplete: done });
      }
    });
  });

  // Coverage: arcs draw out from the hub, then the destination dots pop.
  const map = document.querySelector('[data-coverage-map]');
  if (map) {
    const arcs = gsap.utils.toArray('[data-coverage-arc]');
    arcs.forEach((arc) => gsap.set(arc, { strokeDasharray: arc.getTotalLength(), strokeDashoffset: arc.getTotalLength() }));
    gsap.timeline({ scrollTrigger: { trigger: map, start: 'top 75%', once: true } })
      .from('[data-coverage-dot]', { scale: 0, transformOrigin: 'center', duration: 0.4, stagger: 0.06, ease: 'back.out(2)' })
      .to(arcs, { strokeDashoffset: 0, duration: 0.9, stagger: 0.08, ease: 'power2.out' }, 0.2);
  }
});
