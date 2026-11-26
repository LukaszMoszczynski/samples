// Behaviour and motion for the restaurant sample (GSAP + ScrollTrigger).
// Content is complete without JS; motion runs only when the visitor has not asked for reduced motion.
// The forms are demos: they check the fields, then show a thank-you and send nothing.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { enhanceForms } from './forms.js';

gsap.registerPlugin(ScrollTrigger);

// Entrance targets are hidden by CSS from the first paint while <html data-motion> is set; tell the page we are here.
document.documentElement.setAttribute('data-motion-ready', '');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- Dates and hours -------------------------------------------------------------------------------------------------

const now = new Date();
const today = now.getDay(); // 0 = Sunday
// Opening hours by weekday (Sunday first), the same as in the Visit section.
const opening = [[12, 20], [12, 22], [12, 22], [12, 22], [12, 22], [12, 23], [12, 23]];

// Forms: animated dropdowns, the calendar and the validation demo (see forms.js).
enhanceForms();

// Hero: "open now" line from today's hours.
const status = document.querySelector('[data-open-status]');
if (status) {
  const [opens, closes] = opening[today];
  const hour = now.getHours() + now.getMinutes() / 60;
  const tomorrowOpens = opening[(today + 1) % 7][0];
  status.textContent = hour < opens
    ? `Dziś otwieramy o ${opens}:00`
    : hour < closes ? `Teraz otwarte, do ${closes}:00` : `Dziś już po kolacji, jutro od ${tomorrowOpens}:00`;
}

// Lunch board: today's set (at the weekend: Monday's, the next one served).
const lunchDay = today === 0 || today === 6 ? 1 : today;
document.querySelectorAll('[data-weekday]').forEach((row) => {
  if (Number(row.dataset.weekday) !== lunchDay) return;
  row.classList.add('is-today');
  const label = row.querySelector('[data-today-label]');
  if (label) {
    label.textContent = lunchDay === today ? 'dziś' : 'najbliższy';
    label.hidden = false;
  }
});

// Visit: today's opening hours row.
document.querySelectorAll('[data-weekdays]').forEach((row) => {
  if (!row.dataset.weekdays.split(',').map(Number).includes(today)) return;
  row.classList.add('is-today');
  const label = row.querySelector('[data-today-label]');
  if (label) label.hidden = false;
});

// --- Header ----------------------------------------------------------------------------------------------------------

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
    gsap.fromTo(drawer, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.5, ease: 'power3.out' });
    gsap.fromTo(items, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, delay: 0.12, ease: 'power3.out' });
  } else if (reduceMotion) {
    drawer.hidden = true;
  } else {
    gsap.to(drawer, { clipPath: 'inset(0 0 100% 0)', duration: 0.35, ease: 'power2.in', onComplete: () => { drawer.hidden = true; gsap.set(drawer, { clearProps: 'clipPath' }); } });
  }
};
// Closes on a wider screen, on a link and on Escape (focus back to the burger).
window.matchMedia('(min-width: 1024px)').addEventListener('change', (event) => { if (event.matches) setDrawer(false); });
burger?.addEventListener('click', () => setDrawer(burger.getAttribute('aria-expanded') !== 'true'));
drawer?.addEventListener('click', (event) => { if (event.target.closest('a')) setDrawer(false); });
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && burger?.getAttribute('aria-expanded') === 'true') {
    setDrawer(false);
    burger.focus();
  }
});

// --- Menu filter -----------------------------------------------------------------------------------------------------
// Course tabs and a "vegetarian only" switch. Matching dishes fade and rise in place; nothing moves outside its box.

const filters = document.querySelector('[data-menu-filters]');
const cells = [...document.querySelectorAll('[data-menu-cell]')];
const menuStatus = document.querySelector('[data-menu-status]');
const menuEmpty = document.querySelector('[data-menu-empty]');
const vegeSwitch = document.querySelector('[data-vege-filter]');
const dishWord = (count) => {
  if (count === 1) return 'danie';
  const lastDigit = count % 10;
  const lastTwo = count % 100;
  return lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 12 || lastTwo > 14) ? 'dania' : 'dań';
};
const menuState = { course: 'all', vege: false };

const applyMenu = (animate) => {
  const shown = cells.filter((cell) => {
    const courseMatches = menuState.course === 'all' || cell.dataset.course === menuState.course;
    const vegeMatches = !menuState.vege || cell.dataset.vege === 'true';
    const match = courseMatches && vegeMatches;
    cell.hidden = !match;
    return match;
  });
  if (menuEmpty) menuEmpty.hidden = shown.length > 0;
  if (menuStatus) menuStatus.textContent = `Pokazujemy ${shown.length} ${dishWord(shown.length)}.`;
  if (animate && !reduceMotion) {
    gsap.killTweensOf(shown);
    gsap.fromTo(shown, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.045, ease: 'power3.out' });
  } else {
    gsap.set(shown, { clearProps: 'transform' });
  }
  ScrollTrigger.refresh();
};

if (filters && cells.length) {
  filters.hidden = false;
  filters.querySelectorAll('[data-course-filter]').forEach((tab) => {
    tab.addEventListener('click', () => {
      menuState.course = tab.dataset.courseFilter;
      filters.querySelectorAll('[data-course-filter]').forEach((other) => other.setAttribute('aria-pressed', String(other === tab)));
      applyMenu(true);
    });
  });
  vegeSwitch?.addEventListener('click', () => {
    menuState.vege = vegeSwitch.getAttribute('aria-checked') !== 'true';
    vegeSwitch.setAttribute('aria-checked', String(menuState.vege));
    applyMenu(true);
  });
}

// --- Forms (demo) ----------------------------------------------------------------------------------------------------

const guestsText = (count) => (count === 1 ? '1 osoby' : `${count} osób`);
const bookingForm = document.querySelector('[data-booking-form]');
bookingForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(bookingForm);
  const name = String(data.get('name') ?? '').trim().split(/\s+/)[0];
  const date = String(data.get('date') ?? '');
  const shownDate = date
    ? new Intl.DateTimeFormat('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(`${date}T12:00`))
    : 'wybrany dzień';
  const summary = bookingForm.querySelector('[data-booking-summary]');
  summary.textContent = `Dziękujemy${name ? `, ${name}` : ''}! Stolik dla ${guestsText(Number(data.get('guests')))}, ${shownDate}, godz. ${data.get('time')}. To przykładowa strona: rezerwacja nie została wysłana.`;
  showThanks(bookingForm.querySelector('[data-booking-thanks]'));
});

const eventForm = document.querySelector('[data-event-form]');
eventForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  showThanks(eventForm.querySelector('[data-event-thanks]'));
});

function showThanks(note) {
  if (!note) return;
  note.hidden = false;
  if (!reduceMotion) gsap.fromTo(note, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
  ScrollTrigger.refresh();
}

// --- Motion ----------------------------------------------------------------------------------------------------------

const linesOf = (svg) => [...svg.querySelectorAll('path, circle, ellipse, line, polyline')].filter((line) => !line.closest('[data-steam]'));

// Steam: each line draws upwards, then erases from the bottom, over and over, a little out of step with the others.
function startSteam(group) {
  gsap.set(group, { opacity: 1 });
  group.querySelectorAll('path').forEach((line, index) => {
    gsap.timeline({ repeat: -1, delay: index * 0.55 })
      .fromTo(line, { strokeDasharray: 1000, strokeDashoffset: 1000, opacity: 0, y: 10 }, { strokeDashoffset: 0, opacity: 0.9, y: 0, duration: 1.5, ease: 'sine.out' })
      .to(line, { strokeDashoffset: -1000, opacity: 0, y: -12, duration: 1.4, ease: 'sine.in' });
  });
}

// A drawing draws its lines, then its tomato, basil and cream shapes fill in.
function drawIn(svg, { duration = 1.1, stagger = 0.05, delay = 0 } = {}) {
  const timeline = gsap.timeline({ delay });
  timeline.fromTo(linesOf(svg), { strokeDasharray: 1000, strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration, stagger, ease: 'power2.inOut' });
  const fills = svg.querySelectorAll('[data-fill]');
  if (fills.length) timeline.fromTo(fills, { fillOpacity: 0 }, { fillOpacity: 1, duration: 0.5, stagger: 0.06, ease: 'power1.out' }, '-=0.5');
  return timeline;
}

const motion = gsap.matchMedia();
motion.add('(prefers-reduced-motion: no-preference)', () => {
  // Counters start at zero while their band is still hidden (it rises in), then count up on entering.
  gsap.utils.toArray('[data-count-to]').forEach((element) => {
    const target = Number(element.dataset.countTo);
    const counter = { value: 0 };
    element.textContent = '0';
    gsap.to(counter, {
      value: target,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: element, start: 'top 90%', once: true },
      onUpdate: () => { element.textContent = String(Math.round(counter.value)); },
    });
  });

  // Hero: copy rises in, the plate draws itself, the fills settle, then the steam starts rising; the stamp turns.
  const heroDish = document.querySelector('.ds-hero__dish');
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro.fromTo('.ds-hero__copy [data-hero-item]', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, stagger: 0.1 });
  if (heroDish) {
    intro.add(drawIn(heroDish, { duration: 1.4, stagger: 0.06 }), 0.25);
    intro.fromTo('.ds-hero__note', { y: 24, opacity: 0, rotation: 6 }, { y: 0, opacity: 1, rotation: -4, duration: 0.7, ease: 'back.out(1.6)' }, 1.5);
    const heroSteam = heroDish.querySelector('[data-steam]');
    if (heroSteam) intro.call(() => startSteam(heroSteam), [], 1.6);
  }
  gsap.to('[data-stamp]', { rotation: 360, transformOrigin: '50% 50%', duration: 40, ease: 'none', repeat: -1 });

  // Sections and cards rise in as they enter.
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: (elements) => gsap.fromTo(elements, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.08, ease: 'power3.out' }),
  });

  // Every other drawing draws once as it comes into view (the kitchen board slowly, line by line).
  gsap.utils.toArray('[data-draw]').forEach((svg) => {
    if (svg.closest('.ds-hero')) return;
    const big = svg.dataset.dish === 'board';
    ScrollTrigger.create({
      trigger: svg,
      start: big ? 'top 75%' : 'top 88%',
      once: true,
      onEnter: () => {
        drawIn(svg, big ? { duration: 1.6, stagger: 0.09 } : { delay: 0.2 });
        const steam = svg.querySelector('[data-steam]');
        if (steam) gsap.delayedCall(1.2, () => startSteam(steam));
      },
    });
  });

  // Map: streets and the river draw in, then the pin drops with a small bounce.
  const map = document.querySelector('[data-map]');
  if (map) {
    const lines = map.querySelectorAll('[data-map-lines] path');
    gsap.set(lines, { strokeDasharray: 1000, strokeDashoffset: 1000 });
    gsap.set('[data-map-pin]', { opacity: 0 });
    gsap.timeline({ scrollTrigger: { trigger: map, start: 'top 75%', once: true } })
      .to(lines, { strokeDashoffset: 0, duration: 1.2, stagger: 0.08, ease: 'power2.inOut' })
      .fromTo('[data-map-pin]', { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: 0.8, ease: 'bounce.out' }, '-=0.3');
  }
});

applyMenu(false);
