// Behaviour and motion for the building cleaning sample (GSAP + ScrollTrigger).
// Content is complete without JS; motion runs only when the visitor has not asked for reduced motion.
// Every demo answers in the page and sends nothing.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { enhanceForms } from './forms.js';
import { BUILDING_TYPES, FREQUENCIES, SERVICES, estimate, formatZl } from './estimate.js';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
// Entrance targets are hidden by CSS from the first paint while <html data-motion> is set; tell the page we are here.
root.setAttribute('data-motion-ready', '');
const motionOn = root.hasAttribute('data-motion') && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Forms: animated dropdowns, the date picker and the validation demo (see forms.js).
enhanceForms();

// --- Header and phone menu ---------------------------------------------------------------------------------------

const header = document.querySelector('[data-site-header]');
const burger = document.querySelector('[data-site-burger]');
const drawer = document.querySelector('[data-site-drawer]');
const setScrolled = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
setScrolled();
window.addEventListener('scroll', setScrolled, { passive: true });

const setDrawer = (open) => {
  if (!burger || !drawer) return;
  if ((burger.getAttribute('aria-expanded') === 'true') === open) return;
  burger.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
  const items = drawer.querySelectorAll('.ds-site-header__drawer-menu li, .ds-site-header__drawer-foot');
  gsap.killTweensOf([drawer, ...items]);
  if (open) {
    drawer.hidden = false;
    if (!motionOn) return;
    // The panel wipes down from under the header, then the links rise in one after another.
    gsap.fromTo(drawer, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.5, ease: 'power3.out' });
    gsap.fromTo(items, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.05, delay: 0.12, ease: 'power3.out' });
  } else if (!motionOn) {
    drawer.hidden = true;
  } else {
    gsap.to(drawer, {
      clipPath: 'inset(0 0 100% 0)', duration: 0.35, ease: 'power2.in',
      onComplete: () => { drawer.hidden = true; gsap.set(drawer, { clearProps: 'clipPath' }); },
    });
  }
};
window.matchMedia('(min-width: 1100px)').addEventListener('change', (event) => { if (event.matches) setDrawer(false); });
burger?.addEventListener('click', () => setDrawer(burger.getAttribute('aria-expanded') !== 'true'));
drawer?.addEventListener('click', (event) => { if (event.target.closest('a')) setDrawer(false); });
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && burger?.getAttribute('aria-expanded') === 'true') {
    setDrawer(false);
    burger.focus();
  }
});

// --- Tabs (report demo and season calendar) ------------------------------------------------------------------------
// The tab list is hidden in the HTML (without JS every panel shows); here it appears and panels switch in place:
// the old one fades out, the new one fades and rises inside the same box.

function setupTabs({ list, tabs, panels, parts, onShow }) {
  if (!list || !tabs.length) return;
  list.hidden = false;
  let current = 0;
  panels.forEach((panel, index) => { panel.hidden = index !== 0; });
  const show = (next, focus) => {
    if (next === current) return;
    const previous = panels[current];
    tabs.forEach((tab, index) => {
      tab.setAttribute('aria-selected', String(index === next));
      tab.tabIndex = index === next ? 0 : -1;
    });
    if (focus) tabs[next].focus();
    current = next;
    const reveal = () => {
      previous.hidden = true;
      panels[next].hidden = false;
      if (motionOn) {
        const targets = parts ? panels[next].querySelectorAll(parts) : [panels[next]];
        gsap.fromTo(targets, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.05, ease: 'power3.out' });
      }
      onShow?.(panels[next]);
    };
    if (motionOn) {
      gsap.killTweensOf(previous);
      gsap.to(previous, { opacity: 0, duration: 0.15, ease: 'power1.in', onComplete: () => { gsap.set(previous, { clearProps: 'opacity' }); reveal(); } });
    } else {
      reveal();
    }
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => show(index, false));
    tab.addEventListener('keydown', (event) => {
      const moves = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      let next = null;
      if (event.key in moves) next = (current + moves[event.key] + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === null) return;
      event.preventDefault();
      show(next, true);
    });
  });
}

// Report demo: ticks draw in one after another, the progress bar fills and the counter climbs.
const playedSheets = new WeakSet();
function playSheet(sheet) {
  if (!motionOn || !sheet) return;
  playedSheets.add(sheet);
  const ticks = sheet.querySelectorAll('[data-report-tick]');
  const rows = sheet.querySelectorAll('[data-report-task]');
  const done = sheet.querySelector('[data-report-done]');
  const counter = { value: 0 };
  const step = 0.16;
  gsap.timeline()
    .fromTo(sheet.querySelector('[data-report-bar]'), { scaleX: 0 }, { scaleX: 1, duration: ticks.length * step + 0.3, ease: 'power1.inOut' }, 0)
    .fromTo(rows, { opacity: 0.35 }, { opacity: 1, duration: 0.3, stagger: step }, 0)
    .fromTo(ticks, { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 0.35, stagger: step, ease: 'power2.out' }, 0.1)
    .fromTo(counter, { value: 0 }, {
      value: ticks.length, duration: ticks.length * step + 0.2, ease: 'none',
      onUpdate: () => { if (done) done.textContent = String(Math.round(counter.value)); },
    }, 0.1);
}

const report = document.querySelector('[data-report]');
if (report) {
  const sheets = [...report.querySelectorAll('[data-report-sheet]')];
  setupTabs({
    list: report.querySelector('[data-report-tabs]'),
    tabs: [...report.querySelectorAll('[data-report-tab]')],
    panels: sheets,
    onShow: (sheet) => playSheet(sheet),
  });
  if (motionOn) {
    sheets.forEach((sheet) => { const done = sheet.querySelector('[data-report-done]'); if (done) done.textContent = '0'; });
    ScrollTrigger.create({
      trigger: report, start: 'top 70%', once: true,
      onEnter: () => { const visible = sheets.find((sheet) => !sheet.hidden); if (!playedSheets.has(visible)) playSheet(visible); },
    });
  }
  report.querySelectorAll('[data-report-pdf]').forEach((button) => {
    button.addEventListener('click', () => {
      const status = button.closest('[data-report-sheet]').querySelector('[data-report-status]');
      status.textContent = 'To podgląd: w gotowym panelu pobierzesz tu raport PDF ze zdjęciami. Nic nie zostało pobrane.';
      if (motionOn) gsap.fromTo(status, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.35 });
    });
  });
}

const seasons = document.querySelector('[data-seasons]');
if (seasons) {
  setupTabs({
    list: seasons.querySelector('[data-season-tabs]'),
    tabs: [...seasons.querySelectorAll('[data-season-tab]')],
    panels: [...seasons.querySelectorAll('[data-season-panel]')],
    parts: '[data-season-part]',
    onShow: (panel) => {
      if (!motionOn) return;
      const icon = panel.querySelector('.ds-seasons__icon path');
      gsap.fromTo(icon, { strokeDasharray: 1000, strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.out' });
    },
  });
}

// --- Estimator demo ---------------------------------------------------------------------------------------------

const estimator = document.querySelector('[data-estimator]');
const estimateLow = document.querySelector('[data-estimate-low]');
const estimateHigh = document.querySelector('[data-estimate-high]');
const estimateLines = document.querySelector('[data-estimate-lines]');
const shown = { low: 0, high: 0 };

function readEstimator() {
  const data = new FormData(estimator);
  return {
    type: data.get('type'),
    staircases: Number(data.get('staircases')),
    floors: Number(data.get('floors')),
    green: Number(data.get('green')),
    frequency: data.get('frequency'),
    services: ['stairs', ...data.getAll('services')],
  };
}

function updateEstimator(animate) {
  const values = readEstimator();
  estimator.querySelectorAll('input[type="range"]').forEach((range) => {
    const share = ((Number(range.value) - Number(range.min)) / (Number(range.max) - Number(range.min))) * 100;
    range.style.setProperty('--fill', `${share}%`);
    const output = estimator.querySelector(`[data-output="${range.name}"]`);
    if (output) output.textContent = `${Number(range.value).toLocaleString('pl-PL')}${range.dataset.unit ?? ''}`;
  });
  const result = estimate(values);
  estimateLines.innerHTML = result.lines
    .map((line) => `<li class="ds-estimator__line"><span>${line.label}</span><span class="ds-estimator__line-amount">${formatZl(line.amount)}</span></li>`)
    .join('');
  const write = () => {
    estimateLow.textContent = formatZl(Math.round(shown.low / 10) * 10);
    estimateHigh.textContent = formatZl(Math.round(shown.high / 10) * 10);
  };
  gsap.killTweensOf(shown);
  if (animate && motionOn) {
    gsap.to(shown, { low: result.low, high: result.high, duration: 0.6, ease: 'power2.out', onUpdate: write });
    gsap.fromTo(estimateLines.children, { opacity: 0.4 }, { opacity: 1, duration: 0.4, stagger: 0.03 });
  } else {
    Object.assign(shown, { low: result.low, high: result.high });
    write();
  }
  return { values, result };
}

if (estimator) {
  updateEstimator(false);
  estimator.addEventListener('input', () => updateEstimator(true));
  estimator.addEventListener('change', () => updateEstimator(true));
  estimator.addEventListener('submit', (event) => event.preventDefault());
  // "Przenieś dane do formularza": the contact form gets a short summary of the estimate (nothing is sent).
  document.querySelector('[data-estimate-send]')?.addEventListener('click', () => {
    const { values, result } = updateEstimator(false);
    const type = BUILDING_TYPES.find((item) => item.key === values.type)?.label ?? '';
    const frequency = FREQUENCIES.find((item) => item.key === values.frequency)?.label ?? '';
    const chosen = SERVICES.filter((service) => values.services.includes(service.key)).map((service) => service.label.toLowerCase());
    const message = document.querySelector('[data-contact-message]');
    const staircases = document.getElementById('contact-staircases');
    if (message) {
      message.value = `Z kalkulatora: ${type.toLowerCase()}, ${values.staircases} klatek, ${values.floors} kondygnacji, teren ${values.green.toLocaleString('pl-PL')} m². `
        + `Usługi: ${chosen.join(', ')}. Klatki: ${frequency.toLowerCase()}. Orientacyjnie ${formatZl(result.low)}–${formatZl(result.high)} netto miesięcznie.`;
    }
    if (staircases) staircases.value = String(values.staircases);
  });
}

// --- Contact form: sample only, nothing is sent ----------------------------------------------------------------------

const contactForm = document.querySelector('[data-contact-form]');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const thanks = contactForm.querySelector('[data-contact-thanks]');
  thanks.hidden = false;
  if (motionOn) gsap.fromTo(thanks, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' });
});

// --- FAQ: the answer slides open and closed (native details without motion) ------------------------------------------

if (motionOn) {
  document.querySelectorAll('.ds-faq__item').forEach((item) => {
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
        gsap.fromTo(panel, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.45, ease: 'power2.out', onComplete: done });
      }
    });
  });
}

// --- Motion ---------------------------------------------------------------------------------------------------------

if (motionOn) {
  // Hero: copy rises in, the blocks of flats draw line by line, a squeegee wipes the haze off from left to right and
  // the windows light up clean one by one as the blade passes them; then the chips arrive.
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro.fromTo('[data-hero-item]', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.09 });
  const art = document.querySelector('[data-hero-art]');
  if (art) {
    const lines = art.querySelectorAll('.ds-blueprint__lines [data-draw], .ds-blueprint__dimension [data-draw]');
    const frames = art.querySelectorAll('.ds-blueprint__frame');
    intro
      .fromTo(lines, { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 1.1, stagger: 0.07, ease: 'power2.inOut' }, 0.15)
      .fromTo(frames, { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 0.5, stagger: 0.012, ease: 'power1.out' }, 0.6);
    const wipe = art.querySelector('[data-wipe]');
    const haze = art.querySelector('[data-wipe-haze]');
    const blade = art.querySelector('[data-wipe-blade]');
    const wipeStart = 1.6;
    const wipeLength = 1.5;
    const sweep = { progress: 0 };
    intro.to(sweep, {
      progress: 1, duration: wipeLength, ease: 'none',
      onUpdate: () => {
        haze.style.clipPath = `inset(0 0 0 ${sweep.progress * 100}%)`;
        blade.style.transform = `translateX(${sweep.progress * art.clientWidth}px)`;
      },
      onComplete: () => { wipe.hidden = true; },
    }, wipeStart);
    const viewWidth = 560;
    art.querySelectorAll('[data-window-pane]').forEach((pane) => {
      const share = (Number(pane.getAttribute('x')) + 16) / viewWidth;
      const at = wipeStart + wipeLength * share + gsap.utils.random(0.05, 0.35);
      const glint = pane.nextElementSibling;
      intro
        .fromTo(pane, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power1.out' }, at)
        .fromTo(glint, { opacity: 0, scale: 0.4, transformOrigin: 'center' }, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(3)' }, at + 0.15);
    });
    intro.fromTo('[data-hero-chip]', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.2 }, wipeStart + wipeLength + 0.2);
  }

  // Sections: rise in as they enter.
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: (elements) => gsap.fromTo(elements, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' }),
  });

  // Figures count up (from 0; the final value is in the HTML).
  document.querySelectorAll('[data-count-to]').forEach((element) => {
    const target = Number(element.dataset.countTo);
    const counter = { value: 0 };
    element.textContent = '0';
    gsap.to(counter, {
      value: target, duration: 1.6, ease: 'power2.out',
      scrollTrigger: { trigger: element, start: 'top 92%', once: true },
      onUpdate: () => { element.textContent = Math.round(counter.value).toLocaleString('pl-PL'); },
    });
  });

  // Process: the dimension line draws once on enter, the nodes pop in step with it, the cards rise.
  const process = document.querySelector('[data-process]');
  if (process) {
    const vertical = window.matchMedia('(max-width: 899px)').matches;
    gsap.timeline({ scrollTrigger: { trigger: process, start: 'top 78%', once: true } })
      .fromTo('[data-process-line]', vertical ? { scaleY: 0 } : { scaleX: 0 }, { ...(vertical ? { scaleY: 1 } : { scaleX: 1 }), duration: 1.4, ease: 'power2.inOut' })
      .fromTo('[data-process-node]', { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.45, stagger: 0.24, ease: 'back.out(2.2)' }, 0.1)
      .fromTo('[data-process-step]', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.24 }, 0.2);
  }

  // Coverage: river, roads and rings draw, then the buildings and the base pop in.
  const map = document.querySelector('[data-coverage-map]');
  if (map) {
    gsap.timeline({ scrollTrigger: { trigger: map, start: 'top 75%', once: true } })
      .fromTo(map.querySelectorAll('[data-draw]'), { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 1.2, stagger: 0.08, ease: 'power2.inOut' }, 0.2)
      .fromTo(map.querySelectorAll('[data-map-pin]'), { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: 'back.out(2.4)' }, 0.9);
  }
}
