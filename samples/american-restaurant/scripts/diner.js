// Behaviour and motion for the diner sample (GSAP + ScrollTrigger).
// Content is complete without JS; motion runs only when the visitor has not asked for reduced motion.
// The forms and the takeaway order are demos: they check the fields, then show a thank-you and send nothing.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { enhanceForms } from './forms.js';
import { setupOrder } from './order.js';

gsap.registerPlugin(ScrollTrigger);

// Entrance targets are hidden by CSS from the first paint while <html data-motion> is set; tell the page we are here.
document.documentElement.setAttribute('data-motion-ready', '');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

enhanceForms();
setupOrder();

// --- Hours, today's rows and happy hour ------------------------------------------------------------------------------

// Opening hours by weekday, Sunday first (the same as in the Visit section); 24 = midnight.
const opening = [[9, 21], [12, 22], [12, 22], [12, 22], [12, 22], [12, 24], [9, 24]];
const hourText = (hour) => (hour === 24 ? 'północy' : `${hour}:00`);
const dayNames = ['w niedzielę', 'w poniedziałek', 'we wtorek', 'w środę', 'w czwartek', 'w piątek', 'w sobotę'];
const now = new Date();
const today = now.getDay();

function updateOpenStatus() {
  const time = new Date();
  const hour = time.getHours() + time.getMinutes() / 60;
  const [opens, closes] = opening[time.getDay()];
  const open = hour >= opens && hour < closes;
  const status = document.querySelector('[data-open-status]');
  if (status) {
    status.textContent = hour < opens
      ? `Dziś otwieramy o ${hourText(opens)}`
      : open ? `Teraz otwarte, do ${hourText(closes)}` : `Już zamknięte, jutro od ${hourText(opening[(time.getDay() + 1) % 7][0])}`;
  }
  const sign = document.querySelector('[data-sign-open]');
  if (sign) sign.textContent = open ? 'OTWARTE' : 'ZAMKNIĘTE';
}
updateOpenStatus();

// Letter board and opening hours: today's row lights up.
document.querySelectorAll('[data-board-row], [data-weekdays]').forEach((row) => {
  const days = (row.dataset.weekdays ?? row.dataset.weekday).split(',').map(Number);
  if (!days.includes(today)) return;
  row.classList.add('is-today');
  const label = row.querySelector('[data-today-label]');
  if (label) label.hidden = false;
});

// Happy hour: a live line and a bar of the time left.
const happy = document.querySelector('[data-happy]');
function updateHappyHour(animate) {
  if (!happy) return;
  const time = new Date();
  const start = Number(happy.dataset.start);
  const end = Number(happy.dataset.end);
  const weekdays = happy.dataset.weekdays.split(',').map(Number);
  const minutes = time.getHours() * 60 + time.getMinutes();
  const isDay = weekdays.includes(time.getDay());
  const span = (total) => (total >= 60 ? `${Math.floor(total / 60)} h ${total % 60} min` : `${total} min`);
  let text;
  let left = 0;
  if (isDay && minutes >= start * 60 && minutes < end * 60) {
    const remaining = end * 60 - minutes;
    text = `Trwa teraz: jeszcze ${span(remaining)}.`;
    left = remaining / ((end - start) * 60);
  } else if (isDay && minutes < start * 60) {
    text = `Dziś od ${start}:00, za ${span(start * 60 - minutes)}.`;
  } else {
    let next = (time.getDay() + 1) % 7;
    while (!weekdays.includes(next)) next = (next + 1) % 7;
    text = next === (time.getDay() + 1) % 7 ? `Wraca jutro o ${start}:00.` : `Wraca ${dayNames[next]} o ${start}:00.`;
  }
  happy.querySelector('[data-happy-status]').textContent = text;
  const bar = happy.querySelector('[data-happy-bar]');
  if (animate && !reduceMotion) {
    gsap.fromTo(bar, { width: '0%' }, { width: `${left * 100}%`, duration: 1.4, ease: 'power2.out', scrollTrigger: { trigger: happy, start: 'top 85%', once: true } });
  } else {
    gsap.set(bar, { width: `${left * 100}%` });
  }
}
updateHappyHour(true);
setInterval(() => { updateOpenStatus(); updateHappyHour(false); }, 30000);

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
// Category pills; the chosen groups fade and rise in place, the plate beside the card shows the category's drawing.

const filters = document.querySelector('[data-menu-filters]');
const groups = [...document.querySelectorAll('[data-menu-group]')];
const arts = [...document.querySelectorAll('[data-menu-art]')];
const asideName = document.querySelector('[data-menu-aside-name]');
const asideNote = document.querySelector('[data-menu-aside-note]');
const menuStatus = document.querySelector('[data-menu-status]');
const allNote = asideNote?.textContent ?? '';
const positions = (count) => {
  if (count === 1) return 'pozycja';
  const lastDigit = count % 10;
  const lastTwo = count % 100;
  return lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 12 || lastTwo > 14) ? 'pozycje' : 'pozycji';
};

function applyMenu(category) {
  const shown = groups.filter((group) => {
    const match = category === 'all' || group.dataset.menuGroup === category;
    group.hidden = !match;
    return match;
  });
  const chosen = category === 'all' ? null : groups.find((group) => group.dataset.menuGroup === category);
  const artId = chosen ? category : groups[0].dataset.menuGroup;
  let shownArt = null;
  arts.forEach((art) => {
    const match = art.dataset.menuArt === artId;
    art.hidden = !match;
    if (match) shownArt = art;
  });
  asideName.textContent = chosen ? chosen.dataset.name : 'Cała karta';
  asideNote.textContent = chosen ? chosen.dataset.note : allNote;
  const count = shown.reduce((sum, group) => sum + group.querySelectorAll('li').length, 0);
  menuStatus.textContent = `Pokazujemy: ${chosen ? chosen.dataset.name : 'całą kartę'}, ${count} ${positions(count)}.`;
  if (!reduceMotion) {
    gsap.killTweensOf(shown);
    gsap.fromTo(shown, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out' });
    if (shownArt) gsap.fromTo(shownArt, { scale: 0.6, rotation: -20, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.8)' });
  }
  ScrollTrigger.refresh();
}

if (filters && groups.length) {
  filters.hidden = false;
  filters.querySelectorAll('[data-menu-filter]').forEach((pill) => {
    pill.addEventListener('click', () => {
      filters.querySelectorAll('[data-menu-filter]').forEach((other) => other.setAttribute('aria-pressed', String(other === pill)));
      applyMenu(pill.dataset.menuFilter);
    });
  });
}

// --- Shake bar -------------------------------------------------------------------------------------------------------
// A new flavour drains the glass, changes the colour and fills it again; the cream puffs up and the cherry drops.

const glass = document.querySelector('[data-shake-glass]');
const liquid = glass?.querySelector('[data-shake-liquid]');
const cream = glass?.querySelector('[data-shake-top]');
const cherry = glass?.querySelector('[data-shake-cherry]');
const shakeAdd = document.querySelector('[data-shake-add]');
const EMPTY = 220; // SVG units: the liquid sits below the glass

function topping(delay = 0) {
  const timeline = gsap.timeline({ delay });
  timeline.fromTo(cream, { opacity: 0, scale: 0.4, transformOrigin: '50% 100%' }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' });
  timeline.fromTo(cherry, { opacity: 0, y: -120 }, { opacity: 1, y: 0, duration: 0.8, ease: 'bounce.out' }, '-=0.25');
  return timeline;
}

function fill(delay = 0) {
  gsap.set(liquid, { opacity: 1 });
  return gsap.fromTo(liquid, { y: EMPTY }, { y: 0, duration: 1.2, delay, ease: 'power2.out' });
}

document.querySelectorAll('[data-shake-option]').forEach((option) => {
  option.addEventListener('change', () => {
    if (!option.checked || !glass) return;
    const shakeName = `Shake ${option.dataset.name.toLowerCase()}`;
    document.querySelector('[data-shake-name]').textContent = option.dataset.name;
    document.querySelector('[data-shake-text]').textContent = option.dataset.text;
    if (shakeAdd) {
      shakeAdd.dataset.addDish = option.value;
      shakeAdd.dataset.name = shakeName;
      shakeAdd.dataset.price = option.dataset.price;
      shakeAdd.setAttribute("aria-label", `Dodaj do zamówienia: ${shakeName.toLowerCase()}`);
    }
    if (reduceMotion) {
      glass.dataset.flavor = option.value;
      return;
    }
    gsap.killTweensOf([liquid, cream, cherry]);
    gsap.timeline()
      .to(cherry, { y: -40, opacity: 0, duration: 0.25, ease: 'power2.in' }, 0)
      .to(cream, { scale: 0.5, opacity: 0, transformOrigin: '50% 100%', duration: 0.25, ease: 'power2.in' }, 0)
      .to(liquid, { y: EMPTY, duration: 0.45, ease: 'power2.in' }, 0)
      .add(() => { glass.dataset.flavor = option.value; })
      .add(fill())
      .add(topping(), '-=0.35');
  });
});

// --- Motion ----------------------------------------------------------------------------------------------------------

const linesOf = (svg) => [...svg.querySelectorAll('.ds-art__lines > *')];

// Smoke: each curl draws upwards, then erases from the bottom, over and over, a little out of step with the others.
function startSmoke(group) {
  gsap.set(group, { opacity: 1 });
  group.querySelectorAll('path').forEach((curl, index) => {
    gsap.timeline({ repeat: -1, delay: index * 0.7 })
      .fromTo(curl, { strokeDasharray: 1000, strokeDashoffset: 1000, opacity: 0, y: 10 }, { strokeDashoffset: 0, opacity: 0.9, y: 0, duration: 1.8, ease: 'sine.out' })
      .to(curl, { strokeDashoffset: -1000, opacity: 0, y: -16, duration: 1.6, ease: 'sine.in' });
  });
}

// A drawing draws its ink lines, then its colours fill in.
function drawIn(svg, { duration = 1.1, stagger = 0.06, delay = 0 } = {}) {
  const timeline = gsap.timeline({ delay });
  timeline.fromTo(linesOf(svg), { strokeDasharray: 1000, strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration, stagger, ease: 'power2.inOut' });
  const fills = svg.querySelectorAll('[data-fill]');
  if (fills.length) timeline.fromTo(fills, { fillOpacity: 0 }, { fillOpacity: 1, duration: 0.5, ease: 'power1.out' }, '-=0.5');
  return timeline;
}

// Neon flicker: a few uneven blinks, then steady.
const flickerOn = (element) => gsap.to(element, {
  keyframes: [
    { opacity: 1, duration: 0.05 }, { opacity: 0.25, duration: 0.08 }, { opacity: 1, duration: 0.05 },
    { opacity: 0.45, duration: 0.12 }, { opacity: 1, duration: 0.06 },
  ],
});

const motion = gsap.matchMedia();
motion.add('(prefers-reduced-motion: no-preference)', () => {
  // Hero: copy rises in while the sign's tube draws, the letters flicker on one by one, the bulbs start to chase and
  // the N keeps buzzing now and then.
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro.fromTo('[data-hero-item]', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, stagger: 0.1 });
  const tube = document.querySelector('[data-sign-tube]');
  if (tube) {
    intro.fromTo(tube, { strokeDasharray: 1000, strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, 0.2);
    intro.add(flickerOn('[data-sign-script]'), 1.3);
    document.querySelectorAll('[data-sign-letter]').forEach((letter, index) => intro.add(flickerOn(letter), 1.6 + index * 0.16));
    intro.add(flickerOn('[data-sign-open-box]'), 2.5);
    intro.add(flickerOn('[data-sign-open]'), 2.6);
    const bulbs = [...document.querySelectorAll('[data-bulb]')];
    intro.call(() => {
      const chase = gsap.timeline({ repeat: -1 });
      [0, 1, 2].forEach((step) => {
        chase.add(() => bulbs.forEach((bulb, index) => gsap.set(bulb, { opacity: index % 3 === step ? 1 : 0.35 })), step * 0.22);
      });
      chase.to({}, { duration: 0.22 }, 0.44);
    }, [], 2.4);
    const buzz = document.querySelector('[data-buzz]');
    if (buzz) {
      intro.call(() => {
        gsap.timeline({ repeat: -1, repeatDelay: 4 })
          .to(buzz, { opacity: 0.2, duration: 0.05 })
          .to(buzz, { opacity: 1, duration: 0.05 })
          .to(buzz, { opacity: 0.35, duration: 0.09 })
          .to(buzz, { opacity: 1, duration: 0.06 });
      }, [], 4);
    }
  }

  // Ticker: the band slides left without end (two copies of the list, so -50% is one copy).
  const ticker = document.querySelector('[data-ticker]');
  if (ticker) gsap.to(ticker, { xPercent: -50, duration: 32, ease: 'none', repeat: -1 });

  // Counters start at zero while their block is still hidden (it rises in), then count up on entering.
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

  // Sections and cards rise in as they enter.
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: (elements) => gsap.fromTo(elements, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.08, ease: 'power3.out' }),
  });

  // Every drawing draws once as it comes into view; the smoker then starts smoking.
  gsap.utils.toArray('[data-draw]').forEach((svg) => {
    const big = svg.dataset.art === 'smoker';
    ScrollTrigger.create({
      trigger: svg,
      start: big ? 'top 80%' : 'top 92%',
      once: true,
      onEnter: () => {
        drawIn(svg, big ? { duration: 1.6, stagger: 0.07 } : { delay: 0.15 });
        const smoke = svg.querySelector('[data-smoke]');
        if (smoke) gsap.delayedCall(1.4, () => startSmoke(smoke));
      },
    });
  });
  // The menu plate's other drawings are hidden until chosen: show them drawn already.
  document.querySelectorAll('[data-menu-art] [data-draw]').forEach((svg) => {
    if (svg.closest('[data-menu-art]').hidden) {
      gsap.set(linesOf(svg), { strokeDashoffset: 0 });
      gsap.set(svg.querySelectorAll('[data-fill]'), { fillOpacity: 1 });
    }
  });

  // Smokehouse dial: the ring fills while the hand spins twelve turns and the hours count up.
  const ring = document.querySelector('[data-timer-ring]');
  if (ring) {
    const hours = document.querySelector('[data-timer-hours]');
    const target = Number(hours.textContent);
    const clock = { value: 0 };
    hours.textContent = '0';
    gsap.timeline({ scrollTrigger: { trigger: ring.closest('svg'), start: 'top 85%', once: true }, delay: 0.3 })
      .fromTo(ring, { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 3, ease: 'power1.inOut' }, 0)
      .fromTo('[data-timer-hand]', { rotation: 0, svgOrigin: '100 100' }, { rotation: 360 * target, svgOrigin: '100 100', duration: 3, ease: 'power1.inOut' }, 0)
      .to(clock, { value: target, duration: 3, ease: 'power1.inOut', onUpdate: () => { hours.textContent = String(Math.floor(clock.value)); } }, 0);
  }

  // Shake: the glass fills once when it comes into view.
  if (glass) {
    gsap.set(liquid, { y: EMPTY, opacity: 1 });
    ScrollTrigger.create({
      trigger: glass,
      start: 'top 80%',
      once: true,
      onEnter: () => { fill(0.2); topping(1.1); },
    });
  }

  // Letter board: rows slide in one after another, like letters pressed into the felt.
  const rows = gsap.utils.toArray('[data-board-row]');
  if (rows.length) {
    gsap.fromTo(rows, { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: rows[0].closest('ul'), start: 'top 85%', once: true } });
  }

  // Map: the roads draw in, the centre lines appear, then the pin drops with a bounce.
  const map = document.querySelector('[data-map]');
  if (map) {
    gsap.timeline({ scrollTrigger: { trigger: map, start: 'top 75%', once: true } })
      .fromTo(map.querySelectorAll('[data-map-lines] path'), { strokeDasharray: 1000, strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 1.2, stagger: 0.15, ease: 'power2.inOut' })
      .fromTo(map.querySelector('[data-map-center]'), { opacity: 0 }, { opacity: 1, duration: 0.4 })
      .fromTo('[data-map-pin]', { opacity: 0, y: -80 }, { opacity: 1, y: 0, duration: 0.8, ease: 'bounce.out' }, '-=0.2');
  }

  // Event tickets tilt toward the pointer; the pointer is read on the steady slot, the card tilts.
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-tilt]').forEach((slot) => {
      const card = slot.querySelector('[data-tilt-card]');
      slot.addEventListener('pointermove', (event) => {
        const box = slot.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width;
        const y = (event.clientY - box.top) / box.height;
        gsap.to(card, { rotationY: (x - 0.5) * 12, rotationX: (0.5 - y) * 10, duration: 0.4, ease: 'power2.out' });
        card.style.setProperty('--shine-x', `${x * 100}%`);
        card.style.setProperty('--shine-y', `${y * 100}%`);
      });
      slot.addEventListener('pointerleave', () => gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.6, ease: 'power3.out' }));
    });
  }
});

// Reduced motion: the glass is simply full.
if (reduceMotion && liquid) gsap.set([liquid, cream, cherry], { opacity: 1 });

// --- Booking (demo) --------------------------------------------------------------------------------------------------

const peopleText = (count) => (count === 1 ? '1 osoby' : `${count} osób`);
const bookingForm = document.querySelector('[data-booking-form]');
bookingForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(bookingForm);
  const name = String(data.get('name') ?? '').trim().split(/\s+/)[0];
  const date = String(data.get('date') ?? '');
  const shownDate = date
    ? new Intl.DateTimeFormat('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(`${date}T12:00`))
    : 'wybrany dzień';
  const seat = String(data.get('seat') ?? '');
  const summary = bookingForm.querySelector('[data-booking-summary]');
  summary.textContent = `Dziękujemy${name ? `, ${name}` : ''}! Stolik dla ${peopleText(Number(data.get('guests')))}, ${shownDate}, godz. ${data.get('time')}${seat && seat !== 'Bez znaczenia' ? `, ${seat.toLowerCase()}` : ''}. To przykładowa strona: rezerwacja nie została wysłana.`;
  const thanks = bookingForm.querySelector('[data-booking-thanks]');
  thanks.hidden = false;
  if (!reduceMotion) gsap.fromTo(thanks, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
  ScrollTrigger.refresh();
});
