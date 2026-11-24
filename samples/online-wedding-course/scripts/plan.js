// Behaviour and motion for the course sample (GSAP + ScrollTrigger). Content is complete without JS; motion runs only
// without a reduced-motion preference. "Classy, not too much": one drawing intro, calm rises, the clover that marks
// where you are. The shop, the panel and the forms are demos: nothing is saved, charged or sent.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { enhanceForms } from './forms.js';

gsap.registerPlugin(ScrollTrigger);
document.documentElement.setAttribute('data-motion-ready', '');
enhanceForms();
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const money = (value) => `${value.toLocaleString('pl-PL')} zł`;

// --- Header: a hairline once scrolled; the current section's link underlined; the phone drawer ---------------------

const header = document.querySelector('[data-plan-header]');
const setScrolled = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
setScrolled();
window.addEventListener('scroll', setScrolled, { passive: true });

const headerLinks = [...document.querySelectorAll('.ds-plan-header__nav .ds-plan-header__link')];
headerLinks.forEach((link) => {
  const section = document.querySelector(link.getAttribute('href'));
  if (!section) return;
  ScrollTrigger.create({
    trigger: section,
    start: 'top 45%',
    end: 'bottom 45%',
    onToggle: (self) => {
      if (self.isActive) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    },
  });
});

const burger = document.querySelector('[data-plan-burger]');
const drawer = document.getElementById('plan-drawer');
function setDrawer(open) {
  if (!burger || !drawer) return;
  if ((burger.getAttribute('aria-expanded') === 'true') === open) return;
  burger.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
  const items = drawer.querySelectorAll('li, .ds-pill-button');
  gsap.killTweensOf([drawer, ...items]);
  if (open) {
    drawer.hidden = false;
    if (reduceMotion) return;
    // The panel wipes down from under the header, then the links rise in one after another.
    gsap.fromTo(drawer, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.5, ease: 'power3.out' });
    gsap.fromTo(items, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.05, delay: 0.12, ease: 'power3.out' });
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

// --- Hero: the clover's gold outline draws, the hearts fill, the letters and the copy rise in -----------------------

if (!reduceMotion) {
  const hearts = document.querySelectorAll('.ds-plan-hero__clover .ds-clover__heart');
  const letters = document.querySelectorAll('.ds-plan-hero__clover .ds-clover__letter');
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro
    .fromTo('[data-hero-fade]', { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0)
    .fromTo(hearts, { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 1.6, stagger: 0.25, ease: 'power2.inOut' }, 0.2)
    .fromTo(hearts, { fillOpacity: 0 }, { fillOpacity: 1, duration: 0.9, stagger: 0.25 }, 1.1)
    .fromTo(letters, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 }, 1.6);
  // Afterwards the clover breathes: a slow, small sway.
  gsap.to('.ds-plan-hero__clover', { rotation: 3, duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.6, transformOrigin: '50% 50%' });
}

// --- Modules: the sticky clover lights the heart of the module in view -------------------------------------------------

const guideParts = [...document.querySelectorAll('.ds-modules__clover [data-clover-part]')];
const guideLinks = [...document.querySelectorAll('[data-module-link]')];
function setModule(index) {
  guideParts.forEach((part, partIndex) => part.classList.toggle('is-active', partIndex === index));
  guideLinks.forEach((link, linkIndex) => {
    if (linkIndex === index) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
  if (!reduceMotion && guideParts[index]) {
    gsap.fromTo(guideParts[index], { scale: 0.92, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.6, ease: 'back.out(2)' });
  }
}
document.querySelectorAll('[data-module]').forEach((item) => {
  const index = Number(item.dataset.module);
  ScrollTrigger.create({ trigger: item, start: 'top 55%', end: 'bottom 55%', onToggle: (self) => self.isActive && setModule(index) });
});

// --- Entrances: sections rise in as they arrive; the steps' gold line draws with the scroll -----------------------

if (!reduceMotion) {
  gsap.utils.toArray('[data-reveal]').forEach((element) => {
    gsap.fromTo(element, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } });
  });
  const line = document.querySelector('[data-steps-line]');
  if (line) {
    gsap.fromTo(line, { strokeDashoffset: 1000 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.ds-steps__track', start: 'top 80%', end: 'top 35%', scrub: 0.6 } });
  }
} else {
  document.querySelectorAll('[data-draw]').forEach((path) => { path.style.strokeDashoffset = '0'; });
}

// --- Course panel demo: ticking tasks moves the progress and fills the module's heart ------------------------------

const tasks = [...document.querySelectorAll('[data-panel-task]')];
const panelFill = document.querySelector('[data-panel-fill]');
const panelCount = document.querySelector('[data-panel-count]');
const panelDone = document.querySelector('[data-panel-done]');
const panelHeart = document.querySelector('.ds-course-panel__clover .is-active .ds-clover__heart');
function updatePanel() {
  const done = tasks.filter((task) => task.checked).length;
  const ratio = tasks.length ? done / tasks.length : 0;
  if (panelFill) panelFill.style.width = `${ratio * 100}%`;
  if (panelCount) panelCount.textContent = `${done} z ${tasks.length} gotowe`;
  if (panelHeart) panelHeart.style.fillOpacity = String(0.25 + ratio * 0.75);
  if (panelDone) {
    const show = done === tasks.length;
    if (show && panelDone.hidden && !reduceMotion) gsap.fromTo(panelDone, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    panelDone.hidden = !show;
  }
}
tasks.forEach((task) => task.addEventListener('change', updatePanel));
updatePanel();

// --- Demo shop: add to cart, the cart panel, a checkout step and a thank-you ----------------------------------------

const cart = [];
const dialog = document.querySelector('[data-cart]');
const count = document.querySelector('[data-cart-count]');
const cartButton = document.querySelector('[data-cart-open]');
const steps = dialog ? [...dialog.querySelectorAll('[data-cart-step]')] : [];
function showStep(name) {
  steps.forEach((step) => { step.hidden = step.dataset.cartStep !== name; });
  const shown = steps.find((step) => step.dataset.cartStep === name);
  if (shown && !reduceMotion) gsap.fromTo(shown, { opacity: 0, x: 16 }, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' });
}
function renderCart() {
  const list = dialog.querySelector('[data-cart-items]');
  list.replaceChildren(...cart.map((item, index) => {
    const row = document.createElement('li');
    row.className = 'ds-cart__item';
    const name = document.createElement('span');
    name.textContent = item.name;
    const price = document.createElement('span');
    price.textContent = money(item.price);
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'ds-cart__remove';
    remove.textContent = 'Usuń';
    remove.setAttribute('aria-label', `Usuń ${item.name}`);
    remove.addEventListener('click', () => { cart.splice(index, 1); renderCart(); });
    row.append(name, price, remove);
    return row;
  }));
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  dialog.querySelectorAll('[data-cart-total]').forEach((element) => { element.textContent = money(total); });
  dialog.querySelector('[data-cart-empty]').hidden = cart.length > 0;
  dialog.querySelector('[data-cart-total-row]').hidden = cart.length === 0;
  dialog.querySelector('[data-cart-checkout]').hidden = cart.length === 0;
  count.textContent = String(cart.length);
  count.hidden = cart.length === 0;
  cartButton.setAttribute('aria-label', `Koszyk, produktów: ${cart.length}`);
}
function openCart() {
  showStep('list');
  dialog.showModal();
  if (!reduceMotion) gsap.fromTo(dialog, { xPercent: 100 }, { xPercent: 0, duration: 0.5, ease: 'power3.out' });
}
function closeCart() {
  if (reduceMotion) { dialog.close(); return; }
  gsap.to(dialog, { xPercent: 100, duration: 0.35, ease: 'power2.in', onComplete: () => { dialog.close(); gsap.set(dialog, { clearProps: 'transform' }); } });
}
if (dialog) {
  document.querySelectorAll('[data-cart-add]').forEach((button) => button.addEventListener('click', () => {
    if (!cart.some((item) => item.id === button.dataset.cartAdd)) {
      cart.push({ id: button.dataset.cartAdd, name: button.dataset.name, price: Number(button.dataset.price) });
    }
    renderCart();
    if (!reduceMotion) gsap.fromTo(count, { scale: 0.4 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' });
    openCart();
  }));
  cartButton.addEventListener('click', openCart);
  dialog.querySelector('[data-cart-close]').addEventListener('click', closeCart);
  dialog.addEventListener('click', (event) => { if (event.target === dialog) closeCart(); });
  dialog.addEventListener('cancel', (event) => { event.preventDefault(); closeCart(); });
  dialog.querySelector('[data-cart-checkout]').addEventListener('click', () => showStep('checkout'));
  dialog.querySelector('[data-cart-back]').addEventListener('click', () => showStep('list'));
  dialog.querySelector('[data-checkout-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    cart.splice(0, cart.length);
    renderCart();
    showStep('thanks');
  });
  renderCart();
}

// --- Opinions: a slight tilt toward the pointer, read on the card's steady parent -------------------------------------

if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.ds-opinions__item').forEach((item) => {
    const card = item.querySelector('.ds-opinion');
    item.addEventListener('pointermove', (event) => {
      const box = item.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      gsap.to(card, { rotationY: x * 6, rotationX: y * -6, y: -4, duration: 0.5, ease: 'power2.out' });
    });
    item.addEventListener('pointerleave', () => gsap.to(card, { rotationY: 0, rotationX: 0, y: 0, duration: 0.6, ease: 'power2.out' }));
  });
}

// --- Questions: the answer rises in when a question opens ----------------------------------------------------------------

document.querySelectorAll('[data-faq]').forEach((item) => item.addEventListener('toggle', () => {
  if (item.open && !reduceMotion) gsap.fromTo(item.querySelector('.ds-plan-faq__answer'), { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
}));

// --- Sign-up: after the forms kit's check, the clover's hearts light one by one, then the thank-you -----------------

const signup = document.querySelector('[data-signup-form]');
signup?.addEventListener('submit', (event) => {
  event.preventDefault();
  const parts = [...signup.querySelectorAll('.ds-signup__clover [data-clover-part]')];
  const thanks = signup.querySelector('[data-signup-thanks]');
  if (reduceMotion) {
    parts.forEach((part) => part.classList.add('is-lit'));
    thanks.hidden = false;
    return;
  }
  parts.forEach((part, index) => setTimeout(() => {
    part.classList.add('is-lit');
    gsap.fromTo(part, { scale: 0.85, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.5, ease: 'back.out(2.5)' });
  }, index * 180));
  setTimeout(() => {
    thanks.hidden = false;
    gsap.fromTo(thanks, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
  }, parts.length * 180 + 150);
});
