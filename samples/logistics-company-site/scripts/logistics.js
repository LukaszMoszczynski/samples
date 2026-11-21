// Behaviour and motion for the logistics sample (GSAP + ScrollTrigger + MotionPath).
// Content is complete without JS; motion runs only when the visitor has not asked for reduced motion.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// Header: solid once the page scrolls; drawer on phones.
const header = document.querySelector('[data-site-header]');
const burger = document.querySelector('[data-site-burger]');
const drawer = document.getElementById('site-drawer');
const setScrolled = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
setScrolled();
window.addEventListener('scroll', setScrolled, { passive: true });

function setDrawer(open) {
  if (!burger || !drawer) return;
  burger.setAttribute('aria-expanded', String(open));
  drawer.hidden = !open;
}
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
  intro.from('[data-hero-item]', { y: 28, opacity: 0, duration: 0.8, stagger: 0.09 });
  const line = document.querySelector('[data-route-line]');
  if (line) {
    const length = line.getTotalLength();
    intro
      .from('[data-route-city]', { opacity: 0, scale: 0.4, transformOrigin: 'center', duration: 0.4, stagger: 0.05 }, 0.2)
      .fromTo(line, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, 0.5)
      .from('[data-route-chip]', { y: 20, opacity: 0, duration: 0.6 }, 1.6);
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
    onEnter: (elements) => gsap.from(elements, { y: 32, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' }),
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
