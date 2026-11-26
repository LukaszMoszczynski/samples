// Behaviour and motion for the physiotherapy sample (GSAP + ScrollTrigger).
// Content is complete without JS; motion runs only when the visitor has not asked for reduced motion.
// The booking demo sends nothing: free hours are made up from the date, the thank-you is local.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { enhanceForms } from './forms.js';

gsap.registerPlugin(ScrollTrigger);

// Entrance targets are hidden by CSS from the first paint while <html data-motion> is set; tell the page we are here.
document.documentElement.setAttribute('data-motion-ready', '');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- Booking demo: the day starts on the next open day (set before the forms kit draws the calendar) --------------
const pad = (number) => String(number).padStart(2, '0');
const toIso = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const fromIso = (value) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '');
  return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null;
};
const bookingForm = document.querySelector('[data-booking-form]');
const dateInput = document.querySelector('[data-booking-date]');
if (dateInput && !dateInput.value) {
  const day = new Date();
  day.setDate(day.getDate() + 1);
  while (day.getDay() === 0) day.setDate(day.getDate() + 1);
  dateInput.value = toIso(day);
}

// Forms: animated dropdowns, the calendar and the validation demo (see forms.js).
enhanceForms();

// --- Header: frosted once the page scrolls; drawer on phones --------------------------------------------------------
const header = document.querySelector('[data-site-header]');
const burger = document.querySelector('[data-site-burger]');
const drawer = document.getElementById('site-drawer');
const setScrolled = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
setScrolled();
window.addEventListener('scroll', setScrolled, { passive: true });

const setDrawer = (open) => {
  if (!burger || !drawer) return;
  if ((burger.getAttribute('aria-expanded') === 'true') === open) return;
  burger.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
  const items = drawer.querySelectorAll('li, .ds-site-header__drawer-foot');
  gsap.killTweensOf([drawer, ...items]);
  if (open) {
    drawer.hidden = false;
    if (reduceMotion) return;
    // The panel wipes down from under the header, then the links rise in one after another.
    gsap.fromTo(drawer, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.55, ease: 'power3.out' });
    gsap.fromTo(items, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, delay: 0.12, ease: 'power3.out' });
  } else if (reduceMotion) {
    drawer.hidden = true;
  } else {
    gsap.to(drawer, { clipPath: 'inset(0 0 100% 0)', duration: 0.35, ease: 'power2.in', onComplete: () => { drawer.hidden = true; gsap.set(drawer, { clearProps: 'clipPath' }); } });
  }
};
window.matchMedia('(min-width: 1024px)').addEventListener('change', (event) => { if (event.matches) setDrawer(false); });
burger?.addEventListener('click', () => setDrawer(burger.getAttribute('aria-expanded') !== 'true'));
drawer?.addEventListener('click', (event) => { if (event.target.closest('a')) setDrawer(false); });
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && burger?.getAttribute('aria-expanded') === 'true') {
    setDrawer(false);
    burger.focus();
  }
});

// --- Body map: one area at a time; its spot pulses ------------------------------------------------------------------
const areaButtons = [...document.querySelectorAll('[data-body-area]')];
const panels = [...document.querySelectorAll('[data-body-panel]')];
const spots = [...document.querySelectorAll('[data-body-spot]')];
let pulse = null;
const chooseArea = (id, animate) => {
  areaButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.bodyArea === id)));
  spots.forEach((spot) => spot.classList.toggle('is-active', spot.dataset.bodySpot === id));
  panels.forEach((panel) => { panel.hidden = panel.dataset.bodyPanel !== id; });
  const panel = panels.find((item) => item.dataset.bodyPanel === id);
  const halo = spots.find((spot) => spot.dataset.bodySpot === id)?.querySelector('[data-body-halo]');
  pulse?.kill();
  if (reduceMotion || !halo) return;
  // A soft pulse that breathes out from the chosen spot.
  pulse = gsap.fromTo(halo, { scale: 0.6, opacity: 0.55 }, { scale: 1.9, opacity: 0, duration: 1.6, ease: 'sine.out', repeat: -1 });
  // The answer fades and rises inside its own box (nothing moves outside it).
  if (animate && panel) gsap.fromTo(panel.children, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power2.out' });
};
if (areaButtons.length) {
  areaButtons.forEach((button) => button.addEventListener('click', () => chooseArea(button.dataset.bodyArea, true)));
  spots.forEach((spot) => spot.addEventListener('click', () => {
    const button = areaButtons.find((item) => item.dataset.bodyArea === spot.dataset.bodySpot);
    button?.click();
    button?.focus({ preventScroll: true });
  }));
  chooseArea(areaButtons[0].dataset.bodyArea, false);
}

// --- Booking demo: free hours, summary, links that preselect a service or a therapist ---------------------------------
const serviceSelect = document.querySelector('[data-booking-service]');
const therapistSelect = document.querySelector('[data-booking-therapist]');
const slotInputs = [...document.querySelectorAll('[data-booking-slots] input')];
const hint = document.querySelector('[data-booking-hint]');
const summary = (name) => document.querySelector(`[data-summary="${name}"]`);
const dayName = new Intl.DateTimeFormat('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });

// A small stable hash, so the same day and therapist always show the same taken hours.
const hashOf = (text) => [...text].reduce((total, character) => (total * 31 + character.charCodeAt(0)) % 9973, 7);

const setSelect = (select, value) => {
  if (!select || ![...select.options].some((option) => option.value === value)) return;
  select.value = value;
  select.dispatchEvent(new Event('change', { bubbles: true }));
};

const updateSummary = () => {
  if (!bookingForm) return;
  const option = serviceSelect.selectedOptions[0];
  summary('service').textContent = option.value;
  summary('duration').textContent = option.dataset.duration;
  summary('price').textContent = option.dataset.price;
  summary('therapist').textContent = therapistSelect.value === 'Dowolna osoba' ? 'Pierwszy wolny' : therapistSelect.value;
  const day = fromIso(dateInput.value);
  const slot = slotInputs.find((input) => input.checked && !input.disabled);
  summary('when').textContent = day && slot ? `${dayName.format(day)}, ${slot.value}` : 'wybierz dzień i godzinę';
};

const updateSlots = () => {
  if (!bookingForm) return;
  const day = fromIso(dateInput.value);
  const weekday = day?.getDay();
  const changed = [];
  slotInputs.forEach((input, index) => {
    const hour = Number(input.value.slice(0, 2));
    let free = Boolean(day);
    if (weekday === 0) free = false;
    if (weekday === 6 && (hour < 9 || hour > 13)) free = false;
    if (free && day) free = (hashOf(`${dateInput.value}-${therapistSelect.value}`) + index * 7) % 5 > 1;
    if (input.disabled === free) changed.push(input);
    input.disabled = !free;
  });
  // Keep a free hour chosen: the one already picked if still free, otherwise the first free one.
  const chosen = slotInputs.find((input) => input.checked && !input.disabled) ?? slotInputs.find((input) => !input.disabled);
  slotInputs.forEach((input) => { input.checked = input === chosen; });
  const freeCount = slotInputs.filter((input) => !input.disabled).length;
  if (!day) hint.textContent = 'Wolne godziny pokażą się po wyborze dnia.';
  else if (weekday === 0) hint.textContent = 'W niedzielę gabinet jest nieczynny. Wybierz inny dzień.';
  else hint.textContent = `Wolne godziny w ${dayName.format(day)}: ${freeCount}.`;
  if (!reduceMotion && changed.length) {
    gsap.fromTo(changed.map((input) => input.nextElementSibling), { scale: 0.9, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.35, stagger: 0.02, ease: 'power2.out', clearProps: 'transform,opacity' });
  }
  updateSummary();
};

if (bookingForm) {
  serviceSelect.addEventListener('change', updateSummary);
  therapistSelect.addEventListener('change', updateSlots);
  dateInput.addEventListener('change', updateSlots);
  slotInputs.forEach((input) => input.addEventListener('change', updateSummary));
  updateSlots();

  document.querySelectorAll('[data-book-service]').forEach((link) => link.addEventListener('click', () => setSelect(serviceSelect, link.dataset.bookService)));
  document.querySelectorAll('[data-book-therapist]').forEach((link) => link.addEventListener('click', () => setSelect(therapistSelect, link.dataset.bookTherapist)));

  // Runs after the forms kit's check and "sending" pause: a local thank-you with the chosen visit, nothing sent.
  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const thanks = bookingForm.querySelector('[data-booking-thanks]');
    const slot = slotInputs.find((input) => input.checked && !input.disabled);
    if (!slot) {
      hint.textContent = 'Wybierz dzień z wolną godziną.';
      slotInputs[0]?.closest('fieldset')?.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      return;
    }
    thanks.querySelector('[data-booking-thanks-text]').textContent = `${serviceSelect.value}, ${summary('when').textContent}. To przykład: w gotowej stronie dostaniesz SMS i e-mail z potwierdzeniem, a termin trafi do kalendarza gabinetu.`;
    thanks.hidden = false;
    if (!reduceMotion) gsap.fromTo(thanks, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
  });
}

// --- Contact: today's opening hours ---------------------------------------------------------------------------------
const todayNumber = new Date().getDay();
document.querySelectorAll('[data-weekdays]').forEach((row) => {
  const today = row.dataset.weekdays.split(',').map(Number).includes(todayNumber);
  row.classList.toggle('is-today', today);
  row.querySelector('[data-today-label]').hidden = !today;
});

// --- Exercise figures: a pose is a set of named points; the path is rebuilt from it on every frame ------------------
const exercises = [...document.querySelectorAll('[data-exercise]')].map((svg) => {
  const template = svg.dataset.exerciseTemplate;
  const headName = svg.dataset.exerciseHead;
  const from = JSON.parse(svg.dataset.exerciseFrom);
  const to = JSON.parse(svg.dataset.exerciseTo);
  const path = svg.querySelector('[data-exercise-path]');
  const head = svg.querySelector('[data-exercise-head-circle]');
  const state = { progress: 0 };
  const render = () => {
    const point = (name) => from[name].map((value, axis) => value + (to[name][axis] - value) * state.progress);
    path.setAttribute('d', template.replace(/\{(\w+)\}/g, (_match, name) => point(name).map((value) => value.toFixed(1)).join(' ')));
    const [x, y] = point(headName);
    head.setAttribute('cx', x.toFixed(1));
    head.setAttribute('cy', y.toFixed(1));
  };
  return { svg, state, render };
});

const motion = gsap.matchMedia();
motion.add('(prefers-reduced-motion: no-preference)', () => {
  // Hero: copy rises in, the figure draws itself in one continuous line, the disc breathes, the sun rises.
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro
    .fromTo('[data-hero-item]', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.1 })
    .fromTo('[data-hero-art]', { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 0.1)
    .fromTo('[data-hero-line]', { strokeDasharray: 1000, strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 3, ease: 'power1.inOut' }, 0.35)
    .fromTo('[data-hero-sun]', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2, ease: 'sine.out' }, 2.2);
  gsap.to('[data-hero-disc]', { scale: 1.04, rotate: 6, duration: 5, ease: 'sine.inOut', yoyo: true, repeat: -1 });

  // Sections rise in as they enter.
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: (elements) => gsap.fromTo(elements, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out' }),
  });

  // First visit: the wave draws once as the steps come in, the numbers follow it.
  const track = document.querySelector('[data-visit-track]');
  if (track) {
    gsap.timeline({ scrollTrigger: { trigger: track, start: 'top 80%', once: true } })
      .fromTo('[data-visit-line]', { strokeDasharray: 1000, strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' })
      .fromTo('[data-visit-step]', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.2, ease: 'power3.out' }, 0.1);
  }

  // Exercise figures move gently between their two poses while on screen.
  exercises.forEach(({ svg, state, render }) => {
    const loop = gsap.to(state, { progress: 1, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1, repeatDelay: 0.5, paused: true, onUpdate: render });
    ScrollTrigger.create({ trigger: svg, start: 'top bottom', end: 'bottom top', onToggle: (self) => (self.isActive ? loop.play() : loop.pause()) });
  });

  // Breathing ring: in for 4 s (grows), out for 6 s (shrinks); the word follows.
  const ring = document.querySelector('[data-breath-ring]');
  const word = document.querySelector('[data-breath-word]');
  if (ring && word) {
    const breath = gsap.timeline({ repeat: -1, paused: true })
      .call(() => { word.textContent = 'Wdech'; })
      .fromTo(ring, { scale: 0.86 }, { scale: 1.12, duration: 4, ease: 'sine.inOut' })
      .call(() => { word.textContent = 'Wydech'; })
      .to(ring, { scale: 0.86, duration: 6, ease: 'sine.inOut' });
    ScrollTrigger.create({ trigger: ring, start: 'top bottom', end: 'bottom top', onToggle: (self) => (self.isActive ? breath.play() : breath.pause()) });
  }

  // Contact map: the route draws to the practice, then the pin drops in; the route settles into a dashed line.
  const route = document.querySelector('[data-map-route]');
  if (route) {
    gsap.timeline({ scrollTrigger: { trigger: route.closest('svg'), start: 'top 80%', once: true } })
      .fromTo(route, { strokeDasharray: 1000, strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' })
      .set(route, { strokeDasharray: '40 50', strokeDashoffset: 0 })
      .fromTo('[data-map-pin]', { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' }, 1.2);
  }

  // FAQ: the answer slides open and closed (native details without motion).
  gsap.utils.toArray('.ds-faq__item').forEach((item) => {
    const summaryRow = item.querySelector('summary');
    const panel = item.querySelector('.ds-faq__panel');
    summaryRow.addEventListener('click', (event) => {
      event.preventDefault();
      if (item.dataset.animating) return;
      item.dataset.animating = 'true';
      const done = () => { delete item.dataset.animating; gsap.set(panel, { clearProps: 'height,opacity' }); };
      if (item.open) {
        gsap.to(panel, { height: 0, opacity: 0, duration: 0.35, ease: 'power2.inOut', onComplete: () => { item.open = false; done(); } });
      } else {
        item.open = true;
        gsap.fromTo(panel, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.45, ease: 'power2.out', onComplete: done });
      }
    });
  });
});
