// Behaviour and motion for the barbershop sample (GSAP + ScrollTrigger).
// Content is complete without JS; motion runs only when the visitor has not asked for reduced motion. The booking demo
// works either way and sends nothing.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { enhanceForms } from './forms.js';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const motionOff = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Entrance targets are hidden by CSS from the first paint while <html data-motion> is set; tell the page we are here.
root.setAttribute('data-motion-ready', '');

// Forms: styled calendar for the day field and the validation demo (see forms.js).
enhanceForms();

// --- Header: solid once the page scrolls; full-screen overlay menu on phones ---------------------------------------

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
  const items = drawer.querySelectorAll('li, .ds-site-header__drawer-cta');
  gsap.killTweensOf([drawer, ...items]);
  if (open) {
    drawer.hidden = false;
    if (motionOff) return;
    // The panel wipes down from under the header, then the links rise in one after another.
    gsap.fromTo(drawer, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.5, ease: 'power3.out' });
    gsap.fromTo(items, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.05, delay: 0.12, ease: 'power3.out' });
  } else if (motionOff) {
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

// --- Booking demo ---------------------------------------------------------------------------------------------------

const longDate = new Intl.DateTimeFormat('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });
const toMinutes = (time) => { const [hours, minutes] = time.split(':').map(Number); return hours * 60 + minutes; };
const fromIso = (value) => { const [year, month, day] = value.split('-').map(Number); return new Date(year, month - 1, day); };
// A steady pseudo-random number per day and stylist, so the same day always shows the same taken hours.
const seeded = (text) => {
  let hash = 2166136261;
  for (const character of text) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  return () => { hash = Math.imul(hash ^ (hash >>> 15), 2246822507) ^ Math.imul(hash ^ (hash >>> 13), 3266489909); return ((hash >>> 0) % 1000) / 1000; };
};

function setupBooking(form) {
  const steps = [...form.querySelectorAll('[data-booking-step]')];
  const last = steps.length - 1;
  const progress = form.querySelector('[data-booking-progress]');
  const progressSteps = [...form.querySelectorAll('[data-progress-step]')];
  const stage = form.querySelector('[data-booking-stage]');
  const back = form.querySelector('[data-booking-back]');
  const next = form.querySelector('[data-booking-next]');
  const submit = form.querySelector('[data-booking-submit]');
  const error = form.querySelector('[data-booking-error]');
  const nav = form.querySelector('.ds-booking__nav');
  const thanks = form.querySelector('[data-booking-thanks]');
  const dayInput = form.querySelector('#booking-day');
  const slots = form.querySelector('[data-booking-slots]');
  const slotsNote = form.querySelector('[data-booking-slots-note]');
  const summary = Object.fromEntries([...document.querySelectorAll('[data-summary]')].map((element) => [element.dataset.summary, element]));
  let current = 0;
  let busy = false;

  const chosen = (name) => form.querySelector(`input[name="${name}"]:checked`);

  const updateSummary = () => {
    const service = chosen('service');
    const stylist = chosen('stylist');
    const time = chosen('time');
    const values = {
      service: service?.value,
      stylist: stylist?.value,
      day: dayInput.value ? longDate.format(fromIso(dayInput.value)) : '',
      time: time?.value,
      price: service ? `${service.dataset.minutes} min · ${service.dataset.price}` : '',
    };
    Object.entries(values).forEach(([key, value]) => {
      summary[key].textContent = value || 'nie wybrano';
      summary[key].classList.toggle('is-empty', !value);
    });
  };

  // Hour slots for the chosen day: every half hour from opening to the last start, some taken, none in the past.
  const fillSlots = () => {
    const previous = chosen('time')?.value;
    slots.innerHTML = '';
    if (!dayInput.value) { slotsNote.textContent = 'Najpierw wybierz dzień w poprzednim kroku.'; return; }
    const date = fromIso(dayInput.value);
    const weekday = date.getDay();
    if (weekday === 0) { slotsNote.textContent = 'W niedzielę jesteśmy zamknięci. Wróć i wybierz inny dzień.'; return; }
    const lastStart = weekday === 6 ? toMinutes('15:00') : toMinutes('19:00');
    const random = seeded(`${dayInput.value}|${chosen('stylist')?.value ?? ''}`);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    let free = 0;
    for (let minutes = toMinutes('9:00'); minutes <= lastStart; minutes += 30) {
      const time = `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;
      const taken = random() < 0.38 || (isToday && minutes <= nowMinutes + 30);
      const label = document.createElement('label');
      label.className = 'ds-booking__slot';
      label.innerHTML = `<input type="radio" name="time" value="${time}"${taken ? ' disabled' : ''}${!taken && time === previous ? ' checked' : ''}><span>${time}</span>${taken ? '<span class="ds-visually-hidden"> (zajęte)</span>' : ''}`;
      slots.append(label);
      if (!taken) free += 1;
    }
    slotsNote.textContent = free
      ? `${longDate.format(date)}: ${free} wolnych godzin. Przekreślone są już zajęte.`
      : `${longDate.format(date)}: wszystko zajęte. Wróć i wybierz inny dzień.`;
    if (!motionOff) gsap.fromTo(slots.children, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.02, ease: 'power2.out', clearProps: 'opacity,transform' });
  };

  const problem = (index) => {
    if (index === 0 && !chosen('service')) return 'Wybierz usługę, żeby przejść dalej.';
    if (index === 1 && !chosen('stylist')) return 'Wybierz fryzjera albo „Bez znaczenia”.';
    if (index === 2 && !dayInput.value) return 'Wybierz dzień wizyty.';
    if (index === 2 && fromIso(dayInput.value).getDay() === 0) return 'W niedzielę jesteśmy zamknięci, wybierz inny dzień.';
    if (index === 3 && !chosen('time')) return slots.querySelector('input:not(:disabled)') ? 'Wybierz wolną godzinę.' : 'Ten dzień jest pełny, wróć i wybierz inny.';
    return '';
  };

  const render = () => {
    steps.forEach((step, index) => { step.hidden = index !== current; });
    progressSteps.forEach((step, index) => {
      step.classList.toggle('is-done', index < current);
      if (index === current) step.setAttribute('aria-current', 'step'); else step.removeAttribute('aria-current');
    });
    back.hidden = current === 0;
    next.hidden = current === last;
    submit.hidden = current !== last;
  };

  const goTo = (target) => {
    if (busy || target === current) return;
    const direction = Math.sign(target - current);
    const leaving = steps[current];
    const entering = steps[target];
    error.textContent = '';
    if (target === 3) fillSlots();
    const swap = () => {
      const startHeight = stage.offsetHeight;
      current = target;
      render();
      entering.focus({ preventScroll: true });
      const card = form.getBoundingClientRect();
      if (card.top < 0) form.scrollIntoView({ block: 'start', behavior: motionOff ? 'auto' : 'smooth' });
      if (motionOff) return;
      const endHeight = stage.offsetHeight;
      stage.style.overflow = 'clip';
      gsap.fromTo(stage, { height: startHeight }, { height: endHeight, duration: 0.4, ease: 'power2.out', onComplete: () => { stage.style.overflow = ''; gsap.set(stage, { clearProps: 'height' }); } });
      gsap.fromTo(entering, { x: 36 * direction, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: 'power3.out', clearProps: 'transform,opacity', onComplete: () => { busy = false; } });
    };
    if (motionOff) { swap(); return; }
    busy = true;
    // The step leaves sideways inside the stage (which clips sideways only), then the next one slides in.
    gsap.to(leaving, { x: -28 * direction, opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: () => { gsap.set(leaving, { clearProps: 'transform,opacity' }); swap(); } });
  };

  const tryNext = () => {
    const message = problem(current);
    if (message) {
      error.textContent = message;
      if (!motionOff) gsap.fromTo(error, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      return;
    }
    goTo(current + 1);
  };

  progress.hidden = false;
  render();
  updateSummary();

  next.addEventListener('click', tryNext);
  back.addEventListener('click', () => goTo(current - 1));
  form.addEventListener('change', (event) => {
    if (event.target === dayInput || event.target.name === 'stylist') fillSlots();
    if (error.textContent && !problem(current)) error.textContent = '';
    updateSummary();
  });
  // Enter in an early step moves on instead of sending the form.
  form.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' || current === last || event.target.closest('button')) return;
    event.preventDefault();
    tryNext();
  });

  // Runs after the forms kit has checked the contact fields and shown its short "sending" moment.
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const firstProblem = steps.findIndex((_step, index) => index < last && problem(index));
    if (firstProblem !== -1) { goTo(firstProblem); return; }
    const name = form.elements.name.value.trim();
    const stylist = chosen('stylist').value;
    const who = stylist === 'Pierwszy wolny' ? 'pierwszy wolny' : stylist;
    form.querySelector('[data-booking-thanks-title]').textContent = `Gotowe, ${name}!`;
    form.querySelector('[data-booking-thanks-text]').textContent = `Czekamy na Ciebie: ${longDate.format(fromIso(dayInput.value))}, godz. ${chosen('time').value}. ${chosen('service').value}, fryzjer: ${who}.`;
    [progress, stage, nav, error].forEach((element) => { element.hidden = true; });
    thanks.hidden = false;
    thanks.focus({ preventScroll: true });
    if (form.getBoundingClientRect().top < 0) form.scrollIntoView({ block: 'start', behavior: motionOff ? 'auto' : 'smooth' });
    if (!motionOff) {
      gsap.fromTo(thanks, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', clearProps: 'transform,opacity' });
      gsap.fromTo(thanks.querySelectorAll('[data-thanks-draw]'), { strokeDasharray: 1000, strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 0.7, stagger: 0.25, ease: 'power2.out', delay: 0.15 });
    }
  });

  form.querySelector('[data-booking-again]').addEventListener('click', () => {
    form.reset();
    delete form.dataset.checked;
    dayInput.dispatchEvent(new Event('change', { bubbles: true }));
    [progress, stage, nav, error].forEach((element) => { element.hidden = false; });
    error.textContent = '';
    thanks.hidden = true;
    current = 0;
    render();
    updateSummary();
    steps[0].focus({ preventScroll: true });
  });
}

const bookingForm = document.querySelector('[data-booking-form]');
if (bookingForm) setupBooking(bookingForm);

// --- Opening hours: today marked, open-now status ------------------------------------------------------------------

const hoursRows = [...document.querySelectorAll('[data-weekday]')];
const status = document.querySelector('[data-open-status]');
if (hoursRows.length && status) {
  const now = new Date();
  const today = now.getDay();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const dayAt = (weekday) => hoursRows.find((row) => Number(row.dataset.weekday) === weekday);
  const todayRow = dayAt(today);
  todayRow.classList.add('is-today');
  todayRow.querySelector('th').insertAdjacentHTML('beforeend', '<span class="ds-visually-hidden"> (dziś)</span>');
  const inDay = { 0: 'w niedzielę', 1: 'w poniedziałek', 2: 'we wtorek', 3: 'w środę', 4: 'w czwartek', 5: 'w piątek', 6: 'w sobotę' };
  const { open, close } = todayRow.dataset;
  let text;
  if (open && nowMinutes >= toMinutes(open) && nowMinutes < toMinutes(close)) {
    text = `Teraz otwarte, do ${close}`;
    status.classList.add('is-open');
  } else if (open && nowMinutes < toMinutes(open)) {
    text = `Teraz zamknięte. Otwieramy dziś o ${open}`;
  } else {
    let ahead = 1;
    while (ahead < 7 && !dayAt((today + ahead) % 7).dataset.open) ahead += 1;
    const nextDay = (today + ahead) % 7;
    text = `Teraz zamknięte. Otwieramy ${ahead === 1 ? 'jutro' : inDay[nextDay]} o ${dayAt(nextDay).dataset.open}`;
  }
  status.querySelector('[data-open-status-text]').textContent = text;
  status.hidden = false;
}

// --- Motion ---------------------------------------------------------------------------------------------------------

const motion = gsap.matchMedia();
motion.add('(prefers-reduced-motion: no-preference)', () => {
  const draw = (targets, options = {}) => gsap.fromTo(targets, { strokeDasharray: 1000, strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 1.2, stagger: 0.12, ease: 'power2.inOut', ...options });

  // Hero: copy rises in line by line, the mirror frame and the tools draw themselves, the pole keeps turning.
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro.fromTo('[data-hero-item]', { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.09, clearProps: 'transform' });
  const heroDraws = gsap.utils.toArray('.ds-hero [data-draw]');
  intro.add(draw(heroDraws, { duration: 1.4, stagger: 0.14 }), 0.25);
  gsap.to('[data-pole-stripes]', { y: 60, duration: 2.6, ease: 'none', repeat: -1 });

  // Pole stripes between sections slide sideways by one tile, endlessly.
  gsap.utils.toArray('[data-pole-stripe]').forEach((stripe) => {
    const tile = parseFloat(getComputedStyle(stripe).backgroundSize) || 48;
    gsap.fromTo(stripe, { backgroundPosition: '0px 0px' }, { backgroundPosition: `${tile}px 0px`, duration: 1.8, ease: 'none', repeat: -1 });
  });

  // Sections rise in as they enter.
  const rise = (selector, stagger = 0.08) => ScrollTrigger.batch(selector, {
    start: 'top 88%',
    once: true,
    onEnter: (elements) => gsap.fromTo(elements, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger, ease: 'power3.out', clearProps: 'transform' }),
  });
  rise('[data-reveal]');
  rise('[data-team-card]', 0.12);
  rise('[data-review]', 0.14);

  // Price board: rows rise, a copper rule sweeps under each one, prices count up from zero.
  const counters = gsap.utils.toArray('[data-count-to]');
  counters.forEach((counter) => { counter.textContent = '0'; });
  ScrollTrigger.batch('[data-service-row]', {
    start: 'top 90%',
    once: true,
    onEnter: (rows) => {
      gsap.fromTo(rows, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.07, ease: 'power3.out', clearProps: 'transform' });
      rows.forEach((row, index) => {
        const rule = row.querySelector('[data-service-rule]');
        gsap.timeline({ delay: 0.15 + index * 0.07, onComplete: () => gsap.set(rule, { clearProps: 'transform,transformOrigin' }) })
          .fromTo(rule, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' })
          .set(rule, { transformOrigin: 'right center' })
          .to(rule, { scaleX: 0, duration: 0.45, ease: 'power2.inOut' }, '+=0.1');
        const counter = row.querySelector('[data-count-to]');
        const value = { current: 0 };
        gsap.to(value, {
          current: Number(counter.dataset.countTo),
          duration: 1.1,
          delay: 0.1 + index * 0.07,
          ease: 'power2.out',
          onUpdate: () => { counter.textContent = String(Math.round(value.current)); },
        });
      });
    },
  });

  // Drawings outside the hero (portraits, haircuts, the map) draw themselves when they enter, then fill.
  gsap.utils.toArray('svg').filter((svg) => !svg.closest('.ds-hero') && svg.querySelector('[data-draw]')).forEach((svg) => {
    const timeline = gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top 88%', once: true } });
    timeline.add(draw(svg.querySelectorAll('[data-draw]'), { duration: 1.1, stagger: 0.1 }));
    const mass = svg.querySelectorAll('[data-art-mass]');
    if (mass.length) timeline.fromTo(mass, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power1.out' }, 0.6);
    const pin = svg.querySelector('[data-visit-pin]');
    if (pin) timeline.fromTo(pin, { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'bounce.out' }, 0.9);
  });

  // Voucher: the card swings in and settles at its slight tilt.
  const voucher = document.querySelector('[data-voucher-card]');
  if (voucher) {
    gsap.timeline({ scrollTrigger: { trigger: voucher.parentElement, start: 'top 85%', once: true } })
      .fromTo(voucher, { rotation: -16, y: 60, opacity: 0 }, { rotation: -3, y: 0, opacity: 1, duration: 1, ease: 'back.out(1.4)', clearProps: 'transform' });
  }

  // Open-now dot breathes.
  gsap.to('.ds-visit__status.is-open .ds-visit__status-dot', { scale: 1.35, duration: 0.9, ease: 'sine.inOut', repeat: -1, yoyo: true });

  // Team cards tilt toward the pointer, read on the steady host (never the tilting card).
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    gsap.utils.toArray('[data-tilt-host]').forEach((host) => {
      const card = host.querySelector('[data-tilt]');
      const glare = host.querySelector('[data-tilt-glare]');
      const rotateX = gsap.quickTo(card, 'rotationX', { duration: 0.4, ease: 'power2.out' });
      const rotateY = gsap.quickTo(card, 'rotationY', { duration: 0.4, ease: 'power2.out' });
      host.addEventListener('pointermove', (event) => {
        const box = host.getBoundingClientRect();
        const across = (event.clientX - box.left) / box.width - 0.5;
        const down = (event.clientY - box.top) / box.height - 0.5;
        rotateY(across * 10);
        rotateX(down * -10);
        glare.style.setProperty('--glare-x', `${(across + 0.5) * 100}%`);
        glare.style.setProperty('--glare-y', `${(down + 0.5) * 100}%`);
      });
      host.addEventListener('pointerleave', () => { rotateX(0); rotateY(0); });
    });
  }

  // Layout can shift once the web fonts arrive; recompute trigger positions then.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
});
