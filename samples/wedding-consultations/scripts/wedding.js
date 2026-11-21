// Behaviour and motion for the wedding sample (GSAP + ScrollTrigger + Draggable).
// Content is complete without JS; motion runs only without a reduced-motion preference.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(ScrollTrigger, Draggable);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Header: soft shadow once scrolled; drawer on narrow screens.
const header = document.querySelector('[data-wed-header]');
const setScrolled = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
setScrolled();
window.addEventListener('scroll', setScrolled, { passive: true });
const burger = document.querySelector('[data-wed-burger]');
const drawer = document.getElementById('wed-drawer');
const setDrawer = (open) => {
  if (!burger || !drawer) return;
  burger.setAttribute('aria-expanded', String(open));
  drawer.hidden = !open;
};
burger?.addEventListener('click', () => setDrawer(burger.getAttribute('aria-expanded') !== 'true'));
drawer?.addEventListener('click', (event) => event.target.closest('a') && setDrawer(false));

// Planner: choose a moment, show its panel, move the gold progress line, fill the heart.
const steps = [...document.querySelectorAll('[data-planner-step]')];
const progress = document.querySelector('[data-planner-progress]');
function choose(index, animate = true) {
  steps.forEach((step, stepIndex) => {
    step.setAttribute('aria-pressed', String(stepIndex === index));
    step.classList.toggle('is-done', stepIndex < index);
  });
  document.querySelectorAll('[data-planner-panel]').forEach((panel) => {
    const show = Number(panel.dataset.plannerPanel) === index;
    panel.hidden = !show;
    if (show && animate && !reduceMotion) {
      gsap.from(panel, { y: 16, opacity: 0, duration: 0.45, ease: 'power2.out' });
      gsap.from(panel.querySelectorAll('[data-planner-task]'), { x: -12, opacity: 0, duration: 0.4, stagger: 0.07, delay: 0.1 });
      const fill = panel.querySelector('[data-planner-fill]');
      if (fill) gsap.from(fill, { attr: { y: 24 }, duration: 0.9, ease: 'power2.out' });
    }
  });
  if (progress && steps.length > 1) {
    const width = `calc((100% - 100% / ${steps.length}) * ${index / (steps.length - 1)})`;
    if (animate && !reduceMotion) gsap.to(progress, { width, duration: 0.6, ease: 'power2.out' });
    else progress.style.width = width;
  }
}
steps.forEach((step, index) => step.addEventListener('click', () => choose(index)));
if (steps.length) choose(0, false);

// Gallery: filters (fade out, switch, rise in) and lightbox.
const items = [...document.querySelectorAll('[data-gallery-item]')];
const grid = document.querySelector('[data-gallery-grid]');
document.querySelectorAll('[data-gallery-filter]').forEach((filter) => filter.addEventListener('click', () => {
  const value = filter.dataset.galleryFilter;
  document.querySelectorAll('[data-gallery-filter]').forEach((other) => other.setAttribute('aria-pressed', String(other === filter)));
  const apply = () => items.forEach((item) => { item.hidden = value !== 'all' && item.dataset.category !== value; });
  if (reduceMotion) { apply(); return; }
  // Fade the grid out, switch, then let the chosen moments rise back in: nothing leaves the grid's box.
  gsap.to(grid, { opacity: 0, y: 12, duration: 0.2, ease: 'power1.in', onComplete: () => {
    apply();
    gsap.set(grid, { opacity: 1, y: 0 });
    gsap.fromTo(items.filter((item) => !item.hidden), { opacity: 0, y: 24, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out' });
  } });
}));

const lightbox = document.querySelector('[data-lightbox]');
const stage = lightbox?.querySelector('[data-lightbox-stage]');
let current = 0;
const visible = () => items.filter((item) => !item.hidden);
function show(index) {
  const list = visible();
  current = (index + list.length) % list.length;
  const item = list[current];
  stage.replaceChildren(item.querySelector('svg.ds-art').cloneNode(true));
  lightbox.querySelector('[data-lightbox-caption]').textContent = item.querySelector('.ds-gallery__caption').textContent;
  lightbox.querySelector('[data-lightbox-count]').textContent = `${current + 1} / ${list.length}`;
  if (!reduceMotion) gsap.from(stage.firstChild, { opacity: 0, scale: 1.04, duration: 0.4, ease: 'power2.out' });
}
document.querySelectorAll('[data-gallery-open]').forEach((button) => button.addEventListener('click', () => {
  show(visible().indexOf(button.closest('[data-gallery-item]')));
  lightbox.showModal();
  if (!reduceMotion) gsap.from(lightbox, { opacity: 0, y: 24, duration: 0.35, ease: 'power2.out' });
}));
lightbox?.querySelector('[data-lightbox-prev]').addEventListener('click', () => show(current - 1));
lightbox?.querySelector('[data-lightbox-next]').addEventListener('click', () => show(current + 1));
lightbox?.querySelector('[data-lightbox-close]').addEventListener('click', () => lightbox.close());
lightbox?.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });
lightbox?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') show(current + 1);
  if (event.key === 'ArrowLeft') show(current - 1);
});

// Stories: a deck of cards. Drag the top card aside, or Previous / Next, or the arrow keys on the deck.
const stories = document.querySelector('[data-stories]');
const deck = stories?.querySelector('[data-story-deck]');
if (deck) {
  stories.classList.add('is-deck');
  const cards = [...deck.querySelectorAll('[data-story]')];
  const order = [...cards];
  const total = order.length;
  const announce = stories.querySelector('[data-story-announce]');
  const tilts = [0, 3, -3, 4];
  const pose = (index) => ({ x: index * 10, y: index * 14, rotation: tilts[index] ?? 0, scale: 1 - index * 0.04, opacity: index > 2 ? 0 : 1, zIndex: total - index });
  const layout = (animate) => {
    order.forEach((card, index) => {
      card.setAttribute('aria-hidden', String(index !== 0));
      if (animate && !reduceMotion) gsap.to(card, { ...pose(index), duration: 0.55, ease: 'power3.out' });
      else gsap.set(card, pose(index));
    });
    if (announce) announce.textContent = 'Rekomendacja ' + (cards.indexOf(order[0]) + 1) + ' z ' + total;
  };
  const next = (direction = 1) => {
    const top = order[0];
    const finish = () => { order.push(order.shift()); gsap.set(top, { x: 0, rotation: 0 }); layout(true); };
    if (reduceMotion) { finish(); return; }
    gsap.to(top, { x: direction * 520, rotation: direction * 18, opacity: 0, duration: 0.45, ease: 'power2.in', onComplete: finish });
  };
  const previous = () => {
    order.unshift(order.pop());
    if (!reduceMotion) gsap.set(order[0], { x: -520, rotation: -18, opacity: 0, zIndex: total + 1 });
    layout(true);
  };
  layout(false);
  stories.querySelector('[data-story-next]').addEventListener('click', () => next(1));
  stories.querySelector('[data-story-prev]').addEventListener('click', previous);
  deck.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); next(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); previous(); }
  });
  Draggable.create(cards, {
    type: 'x',
    onPress() { if (this.target !== order[0]) this.endDrag(); },
    onDrag() { gsap.set(this.target, { rotation: this.x / 24 }); },
    onRelease() {
      if (Math.abs(this.x) > 110) next(Math.sign(this.x));
      else gsap.to(this.target, { x: 0, rotation: 0, duration: 0.5, ease: 'back.out(2)' });
    },
  });
}

// Tilt: cards and gallery tiles lean toward the cursor (mouse only, not with reduced motion).
if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('[data-tilt]').forEach((element) => {
    gsap.set(element, { transformPerspective: 900 });
    const turnX = gsap.quickTo(element, 'rotationX', { duration: 0.5, ease: 'power3' });
    const turnY = gsap.quickTo(element, 'rotationY', { duration: 0.5, ease: 'power3' });
    const lift = gsap.quickTo(element, 'y', { duration: 0.5, ease: 'power3' });
    element.addEventListener('pointermove', (event) => {
      const box = element.getBoundingClientRect();
      turnY(((event.clientX - box.left) / box.width - 0.5) * 10);
      turnX(-((event.clientY - box.top) / box.height - 0.5) * 10);
      lift(-8);
    });
    element.addEventListener('pointerleave', () => { turnX(0); turnY(0); lift(0); });
  });
}

// Forms: sample only. The booking form bursts hearts from its button.
const booking = document.querySelector('[data-booking-form]');
booking?.addEventListener('submit', (event) => {
  event.preventDefault();
  booking.querySelector('[data-booking-thanks]').hidden = false;
  if (reduceMotion) return;
  booking.querySelectorAll('[data-burst]').forEach((heart, index) => {
    const angle = (index / 10) * Math.PI * 2;
    gsap.fromTo(heart, { x: 0, y: 0, opacity: 1, scale: 0.6 }, { x: Math.cos(angle) * 110, y: Math.sin(angle) * 70 - 40, opacity: 0, scale: 1.3, rotation: gsap.utils.random(-40, 40), duration: 1.2, ease: 'power2.out' });
  });
});
const news = document.querySelector('[data-news-form]');
news?.addEventListener('submit', (event) => {
  event.preventDefault();
  news.querySelector('[data-news-thanks]').hidden = false;
});

// FAQ: answers slide open and closed.
if (!reduceMotion) {
  document.querySelectorAll('[data-faq-item]').forEach((item) => {
    const panel = item.querySelector('[data-faq-panel]');
    item.querySelector('summary').addEventListener('click', (event) => {
      event.preventDefault();
      if (item.dataset.animating) return;
      item.dataset.animating = 'true';
      const done = () => { delete item.dataset.animating; gsap.set(panel, { clearProps: 'height,opacity' }); };
      if (item.open) {
        gsap.to(panel, { height: 0, opacity: 0, duration: 0.4, ease: 'power2.inOut', onComplete: () => { item.open = false; done(); } });
      } else {
        item.open = true;
        gsap.from(panel, { height: 0, opacity: 0, duration: 0.5, ease: 'power2.out', onComplete: done });
      }
    });
  });
}

const motion = gsap.matchMedia();
motion.add('(prefers-reduced-motion: no-preference)', () => {
  // Hero: the headline softly un-blurs in, the accent word floats up; the heart draws itself in one gold line,
  // the rings link, the small heart beats, and hearts drift up the background.
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('[data-hero-title]', { opacity: 0, y: 30, filter: 'blur(8px)', duration: 1.1 })
    .from('[data-hero-accent]', { y: 20, opacity: 0, duration: 0.8 }, 0.35)
    .from('[data-hero-fade]', { y: 20, opacity: 0, duration: 0.7, stagger: 0.1 }, 0.3)
    .fromTo('[data-hero-heart]', { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut' }, 0.2)
    .fromTo('[data-hero-heart-inner]', { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, 0.8)
    .fromTo('[data-hero-ring]', { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.3, stagger: 0.3, ease: 'power2.inOut' }, 1)
    .from('[data-hero-stone]', { scale: 0, transformOrigin: 'center', duration: 0.5, ease: 'back.out(3)' }, 2.1)
    .from('[data-hero-small-heart]', { scale: 0, transformOrigin: 'center', duration: 0.6, ease: 'back.out(3)' }, 2.3);
  gsap.to('[data-hero-small-heart]', { scale: 1.12, transformOrigin: 'center', duration: 0.6, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 3 });
  gsap.to('[data-hero-rings]', { rotation: 3, svgOrigin: '200 185', duration: 4, ease: 'sine.inOut', repeat: -1, yoyo: true });
  gsap.utils.toArray('[data-drift-heart]').forEach((heart, index) => {
    const scale = Number(heart.dataset.scale) || 1;
    const duration = gsap.utils.random(9, 16);
    gsap.set(heart, { scale, opacity: 0 });
    gsap.timeline({ repeat: -1, delay: index * 0.9 })
      .fromTo(heart, { y: 0, x: 0, rotation: gsap.utils.random(-20, 20) }, { y: () => -(heart.parentElement.offsetHeight + 80), x: gsap.utils.random(-40, 40), rotation: gsap.utils.random(-40, 40), duration, ease: 'none' })
      .to(heart, { opacity: 0.35, duration: duration * 0.2 }, 0)
      .to(heart, { opacity: 0, duration: duration * 0.2 }, duration * 0.8);
  });

  // Counters.
  gsap.utils.toArray('[data-count-to]').forEach((element) => {
    const counter = { value: 0 };
    gsap.to(counter, {
      value: Number(element.dataset.countTo),
      duration: 2,
      ease: 'power2.out',
      delay: 0.6,
      onUpdate: () => { element.textContent = Math.round(counter.value).toLocaleString('pl-PL'); },
    });
  });

  // Sections rise in.
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 85%',
    once: true,
    onEnter: (elements) => gsap.from(elements, { y: 34, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' }),
  });

  // About: the arch draws, the monogram fades up, the heart beats.
  gsap.timeline({ scrollTrigger: { trigger: '.ds-about', start: 'top 70%', once: true } })
    .fromTo('.ds-about [data-draw]', { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' })
    .from('.ds-about [data-monogram]', { y: 20, opacity: 0, duration: 1 }, 0.5)
    .from('.ds-about [data-beat]', { scale: 0, transformOrigin: 'center', duration: 0.6, ease: 'back.out(3)' }, 1.2);

  // Know list: lines slide in, their hearts pop from outline to gold.
  gsap.utils.toArray('[data-know-item]').forEach((item, index) => {
    gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 88%', once: true }, delay: (index % 2) * 0.1 })
      .from(item, { x: -20, opacity: 0, duration: 0.6, ease: 'power2.out' })
      .from(item.querySelector('[data-know-heart]'), { scale: 0, transformOrigin: 'center', duration: 0.5, ease: 'back.out(3)' }, 0.2);
  });

  // Gallery tiles: rise in with a small stagger.
  ScrollTrigger.batch('[data-gallery-item]', {
    start: 'top 90%',
    once: true,
    onEnter: (elements) => gsap.from(elements, { y: 40, opacity: 0, scale: 0.96, duration: 0.8, stagger: 0.08, ease: 'power3.out' }),
  });
});
