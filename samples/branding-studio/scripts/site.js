// Behaviour and motion for the branding-studio sample (GSAP + ScrollTrigger). Content is complete without JS; motion
// runs only without a reduced-motion preference. Brand brief: "subdued: hero as a film, circles as the motion motif,
// a cursor ribbon of circles in rose and plum, soft entrances; classy, not too much, nothing bounces".
// The audit and the contact form are demos: nothing is saved or sent.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { enhanceForms } from './forms.js';

gsap.registerPlugin(ScrollTrigger);
document.documentElement.setAttribute('data-motion-ready', '');
enhanceForms();
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const soft = 'power3.out';

// --- Header: a hairline once scrolled; the current section's link marked; the phone drawer -------------------------

const header = document.querySelector('[data-site-header]');
const setScrolled = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
setScrolled();
window.addEventListener('scroll', setScrolled, { passive: true });

document.querySelectorAll('.ds-site-header__nav .ds-site-header__link').forEach((link) => {
  const section = document.querySelector(link.getAttribute('href'));
  if (!section) return;
  ScrollTrigger.create({
    trigger: section,
    start: 'top 45%',
    end: 'bottom 45%',
    onToggle: (self) => (self.isActive ? link.setAttribute('aria-current', 'true') : link.removeAttribute('aria-current')),
  });
});

const burger = document.querySelector('[data-site-burger]');
const drawer = document.getElementById('site-drawer');
function setDrawer(open) {
  if (!burger || !drawer) return;
  if ((burger.getAttribute('aria-expanded') === 'true') === open) return;
  burger.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
  const items = drawer.querySelectorAll('li, .ds-cta');
  gsap.killTweensOf([drawer, ...items]);
  if (open) {
    drawer.hidden = false;
    if (reduceMotion) return;
    gsap.fromTo(drawer, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.5, ease: soft });
    gsap.fromTo(items, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.05, delay: 0.12, ease: soft });
  } else if (reduceMotion) {
    drawer.hidden = true;
  } else {
    gsap.to(drawer, { clipPath: 'inset(0 0 100% 0)', duration: 0.35, ease: 'power2.in', onComplete: () => { drawer.hidden = true; gsap.set(drawer, { clearProps: 'clipPath' }); } });
  }
}
burger?.addEventListener('click', () => setDrawer(burger.getAttribute('aria-expanded') !== 'true'));
drawer?.addEventListener('click', (event) => event.target.closest('a') && setDrawer(false));
window.matchMedia('(min-width: 1024px)').addEventListener('change', (event) => { if (event.matches) setDrawer(false); });
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && burger?.getAttribute('aria-expanded') === 'true') {
    setDrawer(false);
    burger.focus();
  }
});

// --- Hero as a film: bars close in and open, the title arrives line by line, the portrait opens from a circle, the
// --- balls roll into the frame; the header logo's "o" rolls in and the "!" drops into place -------------------------

if (!reduceMotion) {
  const film = gsap.timeline({ defaults: { ease: soft } });
  film
    .set('[data-hero-bar]', { yPercent: 0 })
    .to('.ds-hero__bar--top', { yPercent: -100, duration: 1.1, ease: 'power3.inOut' }, 0.35)
    .to('.ds-hero__bar--bottom', { yPercent: 100, duration: 1.1, ease: 'power3.inOut' }, 0.35)
    .fromTo('[data-hero-line]', { yPercent: 110, opacity: 1 }, { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.14 }, 0.5)
    .fromTo('[data-hero-fade]', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, 0.95)
    .fromTo('[data-hero-sun]', { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.6 }, 0.6)
    .fromTo('[data-hero-frame]', { clipPath: 'circle(0% at 50% 45%)', opacity: 1 }, { clipPath: 'circle(75% at 50% 45%)', opacity: 1, duration: 1.6, ease: 'power2.inOut' }, 0.7)
    .fromTo('.ds-hero__photo', { scale: 1.15 }, { scale: 1, duration: 2.2 }, 0.7)
    .fromTo('[data-hero-ring]', { rotation: -90, opacity: 0 }, { rotation: 0, opacity: 1, duration: 1.4 }, 1.1)
    .fromTo('.ds-hero__ball--rose', { x: -160, rotation: -200, opacity: 0 }, { x: 0, rotation: 0, opacity: 0.92, duration: 1.5 }, 1.2)
    .fromTo('.ds-hero__ball--lemon', { x: 140, rotation: 220, opacity: 0 }, { x: 0, rotation: 0, opacity: 1, duration: 1.4 }, 1.4)
    .fromTo('.ds-hero__ball--small', { scale: 0, opacity: 1 }, { scale: 1, opacity: 1, duration: 0.8 }, 1.8);

  const logo = document.querySelector('.ds-site-header .ds-logo');
  if (logo) {
    gsap.timeline({ defaults: { ease: soft }, delay: 0.2 })
      .fromTo(logo.querySelector('[data-logo-part="o"]'), { x: -60, rotation: -300, opacity: 0 }, { x: 0, rotation: 0, opacity: 1, duration: 1.2 })
      .fromTo(logo.querySelectorAll('[data-logo-part="h"], [data-logo-part="design"]'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, 0.3)
      .fromTo(logo.querySelector('[data-logo-part="bang"]'), { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }, 0.75);
  }

  // Afterwards the hero's balls drift a little with the scroll (scale of the scene, not a bounce).
  gsap.to('.ds-hero__ball--rose', { yPercent: -40, ease: 'none', scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.ds-hero__ball--lemon', { yPercent: 80, ease: 'none', scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true } });
}

// --- Sections rise in as they arrive; strikes draw through the old words ------------------------------------------

if (!reduceMotion) {
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 86%',
    once: true,
    onEnter: (elements) => gsap.fromTo(elements, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: soft, overwrite: true }),
  });

  document.querySelectorAll('.ds-manifesto [data-strike]').forEach((strike) => {
    gsap.fromTo(strike, { '--ds-strike': '0%' }, { '--ds-strike': '100%', duration: 0.9, ease: 'power2.inOut', scrollTrigger: { trigger: strike, start: 'top 80%', once: true } });
  });

  document.querySelectorAll('[data-case]').forEach((card, index) => {
    const after = card.querySelector('[data-case-after]');
    gsap.set(after, { opacity: 0, y: 16 });
    gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 80%', once: true }, delay: index * 0.15 })
      .fromTo(card.querySelector('[data-strike]'), { '--ds-strike': '0%' }, { '--ds-strike': '100%', duration: 0.8, ease: 'power2.inOut' }, 0.5)
      .to(after, { opacity: 1, y: 0, duration: 0.8, ease: soft }, 1.1);
  });

  // About: the rose circle grows a little as the section passes (the change of scale from the brief).
  gsap.fromTo('[data-about-circle]', { scale: 0.86 }, { scale: 1.04, ease: 'none', scrollTrigger: { trigger: '.ds-about', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('.ds-about__ball--lemon', { y: 40 }, { y: -40, ease: 'none', scrollTrigger: { trigger: '.ds-about', start: 'top bottom', end: 'bottom top', scrub: true } });
}

// --- Service cards: a small tilt toward the pointer, read on the steady parent ----------------------------------------

if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('[data-tilt-host]').forEach((host) => {
    const card = host.querySelector('[data-tilt]');
    const rotateX = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: soft });
    const rotateY = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: soft });
    const lift = gsap.quickTo(card, 'y', { duration: 0.6, ease: soft });
    host.addEventListener('pointermove', (event) => {
      const box = host.getBoundingClientRect();
      rotateY(((event.clientX - box.left) / box.width - 0.5) * 8);
      rotateX(((event.clientY - box.top) / box.height - 0.5) * -8);
      lift(-6);
    });
    host.addEventListener('pointerleave', () => { rotateX(0); rotateY(0); lift(0); });
  });
}

// --- Process: the track draws once and a ball rolls along it, filling each step's circle as it passes -------------

const board = document.querySelector('[data-process]');
if (board && !reduceMotion) {
  const steps = [...board.querySelectorAll('[data-process-step]')];
  const fill = board.querySelector('[data-process-fill]');
  const roller = board.querySelector('.ds-process__roller');
  steps.forEach((step) => step.classList.add('is-waiting'));
  gsap.set(fill, { scaleX: 0, scaleY: 0 });
  const play = () => {
    const vertical = window.matchMedia('(max-width: 1023px)').matches;
    const origin = board.getBoundingClientRect();
    const first = steps[0].querySelector('.ds-process__dot').getBoundingClientRect();
    const stops = steps.map((step) => {
      const dot = step.querySelector('.ds-process__dot').getBoundingClientRect();
      return vertical ? dot.top - first.top : dot.left - first.left;
    });
    const length = vertical ? origin.bottom - first.top - first.height / 2 : origin.right - first.left - first.width / 2;
    const radius = roller.getBoundingClientRect().width / 2 || 10;
    const axis = vertical ? 'y' : 'x';
    gsap.set(fill, vertical ? { scaleX: 1 } : { scaleY: 1 });
    const roll = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    roll.to(roller, { opacity: 1, duration: 0.3 });
    let previous = 0;
    stops.forEach((stop, index) => {
      const distance = stop - previous;
      roll
        .to(roller, { [axis]: stop, rotation: `+=${(distance / radius) * (180 / Math.PI)}`, duration: index ? 0.9 : 0.01 })
        .to(fill, { [vertical ? 'scaleY' : 'scaleX']: Math.max(stop, 1) / length, duration: index ? 0.9 : 0.01 }, '<')
        .add(() => steps[index].classList.remove('is-waiting'));
      previous = stop;
    });
    roll
      .to(fill, { [vertical ? 'scaleY' : 'scaleX']: 1, duration: 0.6, ease: soft })
      .to(roller, { opacity: 0, scale: 0.4, duration: 0.4 }, '<');
  };
  ScrollTrigger.create({ trigger: board, start: 'top 70%', once: true, onEnter: play });
}

// --- Mini-audit: every "Tak" rolls a ball into the meter; the verdict follows the count ---------------------------

const auditForm = document.querySelector('[data-audit]');
if (auditForm) {
  const verdicts = JSON.parse(auditForm.dataset.verdicts || '[]');
  const dots = [...auditForm.querySelectorAll('[data-audit-dot]')];
  const verdict = auditForm.querySelector('[data-audit-verdict]');
  const total = auditForm.querySelectorAll('fieldset').length;
  auditForm.addEventListener('submit', (event) => event.preventDefault());
  auditForm.addEventListener('change', () => {
    const answers = [...auditForm.querySelectorAll('input:checked')];
    const yes = answers.filter((input) => input.value === 'yes').length;
    dots.forEach((dot, index) => {
      const on = index < yes;
      if (on === dot.classList.contains('is-on')) return;
      dot.classList.toggle('is-on', on);
      if (reduceMotion) return;
      if (on) gsap.fromTo(dot, { scale: 0, x: -24, rotation: -180 }, { scale: 1, x: 0, rotation: 0, duration: 0.7, ease: soft });
      else gsap.to(dot, { scale: 0, duration: 0.35, ease: 'power2.in' });
    });
    const left = total - answers.length;
    const next = left > 0
      ? `Jeszcze ${left} ${left === 1 ? 'pytanie' : 'pytania'}. Na razie ${yes} na ${answers.length}.`
      : verdicts[yes] ?? '';
    if (verdict.textContent === next) return;
    if (reduceMotion) { verdict.textContent = next; return; }
    gsap.to(verdict, { opacity: 0, y: -8, duration: 0.2, ease: 'power2.in', onComplete: () => {
      verdict.textContent = next;
      gsap.fromTo(verdict, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: soft });
    } });
  });
}

// --- Contact: after the forms kit's check and "sending" pause, the thank-you (nothing is sent) -----------------------

const contactForm = document.querySelector('[data-contact-form]');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const thanks = contactForm.querySelector('[data-contact-thanks]');
  thanks.hidden = false;
  contactForm.reset();
  delete contactForm.dataset.checked;
  contactForm.querySelectorAll('select').forEach((select) => select.dispatchEvent(new Event('change', { bubbles: true })));
  if (!reduceMotion) gsap.fromTo(thanks, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: soft });
});

// --- Cursor ribbon: balls in rose and plum follow a mouse pointer, each a little later and smaller ----------------

const ribbon = document.querySelector('[data-cursor-ribbon]');
if (ribbon && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
  ribbon.hidden = false;
  const dots = [...ribbon.children];
  const points = dots.map(() => ({ x: -100, y: -100 }));
  const pointer = { x: -100, y: -100 };
  let idle = null;
  dots.forEach((dot, index) => gsap.set(dot, { scale: 1 - index * 0.09 }));
  window.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    gsap.to(dots, { opacity: 0.85, duration: 0.3, overwrite: 'auto' });
    clearTimeout(idle);
    idle = setTimeout(() => gsap.to(dots, { opacity: 0, duration: 0.8, stagger: 0.04 }), 700);
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => gsap.to(dots, { opacity: 0, duration: 0.4 }));
  gsap.ticker.add(() => {
    points.forEach((point, index) => {
      const target = index === 0 ? pointer : points[index - 1];
      point.x += (target.x - point.x) * 0.35;
      point.y += (target.y - point.y) * 0.35;
      gsap.set(dots[index], { x: point.x + 14, y: point.y + 18 });
    });
  });
}
