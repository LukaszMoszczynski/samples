// Behaviour and motion for the cultural centre sample (GSAP + ScrollTrigger), shared by every page.
// Content is complete without JS; motion runs only when the visitor has not asked for reduced motion. Every demo
// (tickets, the editor panel, the forms) answers on the page and sends nothing.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { enhanceForms } from './forms.js';

gsap.registerPlugin(ScrollTrigger);

// Entrance targets are hidden by CSS from the first paint while <html data-motion> is set; tell the page we are here.
const root = document.documentElement;
root.setAttribute('data-motion-ready', '');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pad = (number) => String(number).padStart(2, '0');

// --- Links that preselect a class or a room (set before the forms kit draws its dropdowns, and again on click) -------
const setSelect = (select, value) => {
  if (!select || ![...select.options].some((option) => option.value === value)) return;
  select.value = value;
  select.dispatchEvent(new Event('change', { bubbles: true }));
};
const enrolSelect = document.querySelector('[data-enrol-class]');
const roomSelect = document.querySelector('[data-hire-room]');

// Forms: animated dropdowns, the calendar and the validation demo (see forms.js).
enhanceForms();

document.querySelectorAll('[data-enrol]').forEach((link) => link.addEventListener('click', () => setSelect(enrolSelect, link.dataset.enrol)));
document.querySelectorAll('[data-room]').forEach((link) => link.addEventListener('click', () => setSelect(roomSelect, link.dataset.room)));

// --- Access bar: text size and high contrast, remembered when storage is allowed ------------------------------------
const remember = (key, value) => {
  try {
    if (value) localStorage.setItem(key, value); else localStorage.removeItem(key);
  } catch { /* storage blocked: the choice lasts for this page only */ }
};
const sizeButtons = [...document.querySelectorAll('[data-text-size]')].filter((element) => element.tagName === 'BUTTON');
sizeButtons.forEach((button) => button.addEventListener('click', () => {
  const size = button.dataset.textSize;
  if (size === '0') root.removeAttribute('data-text-size'); else root.setAttribute('data-text-size', size);
  sizeButtons.forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
  remember('tdk-text-size', size === '0' ? '' : size);
  ScrollTrigger.refresh();
}));
const contrastButton = document.querySelector('[data-contrast-toggle]');
contrastButton?.addEventListener('click', () => {
  const on = root.getAttribute('data-contrast') !== 'high';
  if (on) root.setAttribute('data-contrast', 'high'); else root.removeAttribute('data-contrast');
  contrastButton.setAttribute('aria-pressed', String(on));
  remember('tdk-contrast', on ? 'high' : '');
});

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
    // The drawer starts right under the header bar, wherever the access bar has pushed it.
    drawer.style.top = `${Math.max(0, header.getBoundingClientRect().bottom)}px`;
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

// --- Demo toast: ticket links say where they would go ---------------------------------------------------------------
const toast = document.querySelector('[data-demo-toast-card]');
let toastTimer = 0;
const hideToast = () => {
  if (!toast || toast.hidden) return;
  if (reduceMotion) { toast.hidden = true; return; }
  gsap.to(toast, { y: 16, opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: () => { toast.hidden = true; } });
};
const showToast = (title, text) => {
  if (!toast) return;
  toast.querySelector('[data-demo-toast-title]').textContent = title;
  toast.querySelector('[data-demo-toast-text]').textContent = text;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 9000);
  if (!reduceMotion) gsap.fromTo(toast, { y: 24, opacity: 0, rotation: -2 }, { y: 0, opacity: 1, rotation: 0, duration: 0.45, ease: 'back.out(1.6)' });
};
toast?.querySelector('[data-demo-toast-close]').addEventListener('click', hideToast);
document.querySelectorAll('[data-ticket]').forEach((link) => link.addEventListener('click', (event) => {
  event.preventDefault();
  showToast('Bilety: demo', `„${link.dataset.ticket}”: w gotowej stronie ten przycisk otworzy serwis biletowy w nowej karcie, z wybranym wydarzeniem. Tu nic nie zostało kupione.`);
}));

// --- Programme filters: matching posters fade and rise in place ------------------------------------------------------
const filters = document.querySelector('[data-programme-filters]');
const programmeItems = [...document.querySelectorAll('[data-programme-item]')];
if (filters && programmeItems.length) {
  filters.hidden = false;
  const state = { category: 'all', month: 'all', free: false };
  const months = [...document.querySelectorAll('[data-programme-month]')];
  const count = filters.querySelector('[data-programme-count]');
  const empty = document.querySelector('[data-programme-empty]');
  const plural = (number) => (number === 1 ? 'wydarzenie' : number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 12 || number % 100 > 14) ? 'wydarzenia' : 'wydarzeń');
  const apply = () => {
    const shown = [];
    programmeItems.forEach((item) => {
      const month = item.closest('[data-programme-month]').dataset.programmeMonth;
      const match = (state.category === 'all' || item.dataset.category === state.category)
        && (state.month === 'all' || month === state.month)
        && (!state.free || item.dataset.free === 'true');
      item.hidden = !match;
      item.dataset.revealed = 'true';
      if (match) shown.push(item);
    });
    months.forEach((month) => { month.hidden = !month.querySelector('[data-programme-item]:not([hidden])'); });
    empty.hidden = shown.length > 0;
    count.textContent = shown.length === programmeItems.length
      ? `Pokazujemy wszystkie wydarzenia: ${shown.length}.`
      : `Pokazujemy ${shown.length} ${plural(shown.length)} z ${programmeItems.length}.`;
    gsap.killTweensOf(programmeItems);
    if (reduceMotion) { gsap.set(shown, { opacity: 1, y: 0 }); }
    else gsap.fromTo(shown, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.04, ease: 'power2.out' });
    ScrollTrigger.refresh();
  };
  const group = (attribute, key) => {
    const buttons = [...filters.querySelectorAll(`[${attribute}]`)];
    buttons.forEach((button) => button.addEventListener('click', () => {
      state[key] = button.getAttribute(attribute);
      buttons.forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
      apply();
    }));
  };
  group('data-filter-category', 'category');
  group('data-filter-month', 'month');
  filters.querySelector('[data-filter-free]').addEventListener('change', (event) => { state.free = event.target.checked; apply(); });
}

// --- Editor demo: the poster follows the fields; "Opublikuj" adds the event to the list -----------------------------
const editor = document.querySelector('[data-editor-form]');
if (editor) {
  const poster = document.querySelector('[data-editor-poster]');
  const out = (name) => poster.querySelector(`[data-editor-out="${name}"]`);
  const field = (name) => editor.querySelector(`[data-editor-${name}]`);
  const shortDate = new Intl.DateTimeFormat('pl-PL', { weekday: 'short', day: 'numeric', month: 'short' });
  const dateText = () => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(field('date').value);
    if (!match) return '';
    return shortDate.format(new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))).replaceAll('.', '');
  };
  let lastCategory = field('category').value;
  const update = () => {
    const category = field('category');
    const option = category.selectedOptions[0];
    out('title').textContent = field('title').value.trim() || 'Tytuł wydarzenia';
    out('category').textContent = option.textContent;
    out('place').textContent = field('place').value;
    out('price').textContent = field('price').value.trim() || 'cena';
    out('when').textContent = dateText() ? `${dateText()}, ${field('time').value}` : `dzień, ${field('time').value}`;
    if (category.value !== lastCategory) {
      lastCategory = category.value;
      const ink = ['koncert', 'wystawa', 'dzieci'].includes(category.value) ? 'blue' : 'green';
      poster.dataset.ink = ink;
      poster.querySelectorAll('[data-editor-shape]').forEach((shape) => { shape.hidden = shape.dataset.editorShape !== category.value; });
      const shown = poster.querySelector(`[data-editor-shape="${category.value}"]`);
      if (!reduceMotion && shown) gsap.fromTo(shown, { scale: 0.6, rotation: -25, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.8)' });
    }
  };
  editor.addEventListener('input', update);
  editor.addEventListener('change', update);
  update();

  const list = document.querySelector('[data-editor-list]');
  const status = document.querySelector('[data-editor-status]');
  editor.addEventListener('submit', (event) => {
    event.preventDefault();
    const row = document.createElement('li');
    row.className = 'ds-editor-demo__row is-new';
    const when = document.createElement('span');
    when.className = 'ds-editor-demo__row-date';
    when.textContent = `${dateText()}, ${field('time').value} · ${field('place').value}`;
    const title = document.createElement('span');
    title.className = 'ds-editor-demo__row-title';
    title.textContent = field('title').value.trim();
    row.append(when, title);
    list.querySelectorAll('.is-new').forEach((older) => older.classList.remove('is-new'));
    list.prepend(row);
    status.textContent = `Opublikowano w podglądzie: „${title.textContent}”. To demo: nic nie zostało wysłane ani zapisane.`;
    if (reduceMotion) return;
    // The new row fades and rises in place; the poster gets a small "stamped" press.
    gsap.fromTo(row, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    gsap.fromTo(poster, { scale: 1 }, { scale: 0.97, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.inOut' });
  });
}

// --- Forms with a local thank-you (after the forms kit's check and "sending" pause) ----------------------------------
const thank = (form, thanksSelector, text) => {
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const thanks = form.querySelector(thanksSelector);
    thanks.querySelector('p:last-child').textContent = text(new FormData(form));
    thanks.hidden = false;
    if (!reduceMotion) gsap.fromTo(thanks, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
  });
};
thank(document.querySelector('[data-newsletter-form]'), '[data-newsletter-thanks]', (data) => `Na ${data.get('email')} wyślemy link potwierdzający zapis. To przykładowa strona: nic nie zostało wysłane.`);
thank(document.querySelector('[data-enrol-form]'), '[data-enrol-thanks]', () => {
  const label = enrolSelect.selectedOptions[0]?.textContent ?? '';
  return `${label}. Oddzwonimy w ciągu 2 dni roboczych. To przykładowa strona: zgłoszenie nie zostało wysłane.`;
});
thank(document.querySelector('[data-hire-form]'), '[data-hire-thanks]', (data) => {
  const date = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(data.get('date')));
  const shown = date ? `${Number(date[3])}.${date[2]}.${date[1]}` : '';
  return `${roomSelect.selectedOptions[0]?.textContent ?? ''}, ${shown}, ${data.get('from')}–${data.get('to')}. Odpiszemy na ${data.get('email')} z wyceną. To przykładowa strona: nic nie zostało wysłane.`;
});

// Hire form: "to" is always later than "from".
const hireFrom = document.querySelector('[data-hire-from]');
const hireTo = document.querySelector('[data-hire-to]');
hireFrom?.addEventListener('change', () => {
  const start = Number(hireFrom.value.split(':')[0]);
  const end = Number(hireTo.value.split(':')[0]);
  if (end <= start) setSelect(hireTo, `${Math.min(start + 1, 22)}:00`);
});

// --- Contact: today's opening hours ---------------------------------------------------------------------------------
const todayNumber = new Date().getDay();
document.querySelectorAll('[data-weekdays]').forEach((row) => {
  const today = row.dataset.weekdays.split(',').map(Number).includes(todayNumber);
  row.classList.toggle('is-today', today);
  row.querySelector('[data-today-label]').hidden = !today;
});

// --- Motion ------------------------------------------------------------------------------------------------------------
const drawOnce = (path, options = {}) => gsap.fromTo(path, { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut', ...options });

if (!reduceMotion) {
  // Hero intro: copy rises in; on the home page the stage plays its opening.
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro.fromTo('[data-hero-item]', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.09 });
  const scribble = document.querySelector('[data-hero-scribble]');
  if (scribble) intro.add(drawOnce(scribble, { duration: 0.9 }), 0.45);

  const stage = document.querySelector('[data-stage]');
  if (stage) {
    const drapes = stage.querySelectorAll('[data-drape]');
    intro.fromTo(stage, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 0.1);
    intro.add(drawOnce(stage.querySelectorAll('[data-arch]'), { duration: 1.1 }), 0.15);
    // The curtain parts to both sides, then goes away; the gathered drapes stay.
    intro.fromTo(drapes[0], { x: 0 }, { x: -240, duration: 1.3, ease: 'power2.inOut' }, 0.7);
    intro.fromTo(drapes[1], { x: 0 }, { x: 240, duration: 1.3, ease: 'power2.inOut', onComplete: () => gsap.set(drapes, { visibility: 'hidden' }) }, 0.7);
    intro.fromTo(stage.querySelector('[data-beam]'), { opacity: 0, rotation: -16, svgOrigin: '280 66' }, { opacity: 0.55, rotation: 0, svgOrigin: '280 66', duration: 1.2, ease: 'power2.out' }, 1.2);
    intro.fromTo(stage.querySelector('[data-pool]'), { opacity: 0, scaleX: 0.3, transformOrigin: '50% 50%' }, { opacity: 0.7, scaleX: 1, duration: 0.9 }, 1.5);
    // Posters slide up from below the stage and stack, one on top of another.
    intro.fromTo(stage.querySelectorAll('[data-poster-inner]'), { y: 320, rotation: (index) => [-14, 12, -6][index] ?? 0, transformOrigin: '50% 100%' }, { y: 0, rotation: 0, duration: 0.9, stagger: 0.22, ease: 'back.out(1.3)' }, 1.4);
    const floats = stage.querySelectorAll('.ds-stage-hero__float');
    intro.fromTo(floats, { opacity: 0, scale: 0.4, rotation: -30 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.7, stagger: 0.1, ease: 'back.out(1.8)' }, 1.9);
    // Afterwards the cut shapes drift slowly, like paper in a draught (calm, never fast).
    intro.add(() => floats.forEach((shape, index) => {
      gsap.to(shape, { y: index % 2 ? 10 : -10, rotation: index % 2 ? -7 : 7, duration: 5 + index, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }));
  }

  // Inner pages: the three sheets are pinned up one after another.
  const sheets = [...document.querySelectorAll('[data-pile-sheet]')];
  if (sheets.length) {
    const angles = sheets.map((sheet) => gsap.getProperty(sheet, 'rotation'));
    intro.fromTo(sheets, { opacity: 0, y: -60, rotation: (index) => angles[index] - 14 }, { opacity: 1, y: 0, rotation: (index) => angles[index], duration: 0.8, stagger: 0.16, ease: 'back.out(1.5)' }, 0.25);
  }

  // Sections rise in as they arrive (in batches, so a row of cards follows one after another).
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => {
      const fresh = batch.filter((element) => element.dataset.revealed !== 'true');
      fresh.forEach((element) => { element.dataset.revealed = 'true'; });
      gsap.fromTo(fresh, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.75, stagger: 0.08, ease: 'power3.out' });
    },
  });

  // Counters count up once.
  document.querySelectorAll('[data-count]').forEach((number) => {
    const target = Number(number.dataset.count);
    const value = { current: 0 };
    ScrollTrigger.create({
      trigger: number,
      start: 'top 90%',
      once: true,
      onEnter: () => gsap.fromTo(value, { current: 0 }, { current: target, duration: 1.6, ease: 'power2.out', onUpdate: () => { number.textContent = Math.round(value.current).toLocaleString('pl-PL'); } }),
    });
  });

  // The footer garland: the string draws, then the flags swing down into place.
  const garland = document.querySelector('[data-garland]');
  if (garland) {
    const flags = garland.querySelectorAll('[data-flag]');
    gsap.set(flags, { opacity: 0 });
    ScrollTrigger.create({
      trigger: garland,
      start: 'top 95%',
      once: true,
      onEnter: () => {
        drawOnce(garland.querySelector('[data-draw]'), { duration: 1.4 });
        gsap.fromTo(flags, { opacity: 0, rotation: -40 }, { opacity: 1, rotation: 0, duration: 0.8, stagger: 0.05, delay: 0.3, ease: 'back.out(2)' });
      },
    });
  }

  // The map: the walk from the bus stop draws itself, then the door pops.
  const route = document.querySelector('[data-map-route]');
  if (route) {
    const door = document.querySelector('[data-map-door]');
    gsap.set(door, { opacity: 0 });
    ScrollTrigger.create({
      trigger: route.closest('svg'),
      start: 'top 85%',
      once: true,
      onEnter: () => {
        drawOnce(route, { duration: 1.6 });
        gsap.fromTo(door, { opacity: 0, scale: 0, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.5, delay: 1.5, ease: 'back.out(3)' });
      },
    });
  }

  // Any other line still waiting to draw (none expected) is drawn when it arrives.
  document.querySelectorAll('[data-draw]').forEach((path) => {
    if (path.matches('[data-hero-scribble], [data-arch], [data-map-route]') || path.closest('[data-garland]')) return;
    ScrollTrigger.create({ trigger: path, start: 'top 90%', once: true, onEnter: () => drawOnce(path) });
  });
}
