// Demo shop for the furniture sample: add to cart (the drawing flies into the cart icon, then the drawer slides in),
// quantities and totals, a free-delivery bar, a short checkout step and a thank-you, plus the quick view. Sample only:
// nothing is charged or sent. The cart survives a move between the two pages (sessionStorage, when available).
import { gsap } from 'gsap';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const money = (value) => `${Math.round(value).toLocaleString('pl-PL')} zł`;
const STORE_KEY = 'furniture-sample-cart';

const dialog = document.querySelector('[data-cart]');
const cartButton = document.querySelector('[data-cart-open]');
const countBadge = document.querySelector('[data-cart-count]');
const catalog = JSON.parse(document.querySelector('[data-catalog]')?.textContent ?? '{}');
const freeFrom = Number(dialog?.dataset.freeFrom ?? 3000);

let cart = [];
try {
  cart = JSON.parse(sessionStorage.getItem(STORE_KEY) ?? '[]');
} catch {
  cart = [];
}
let opener = null;

const save = () => {
  try {
    sessionStorage.setItem(STORE_KEY, JSON.stringify(cart));
  } catch { /* storage blocked: the cart still works on this page */ }
};
const subtotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
const itemCount = () => cart.reduce((sum, item) => sum + item.quantity, 0);

// A copy of the drawing that is safe to repeat on the page: decorative, no ids.
function artCopy(svg) {
  if (!svg) return '';
  const copy = svg.cloneNode(true);
  copy.removeAttribute('role');
  copy.removeAttribute('aria-label');
  copy.removeAttribute('data-detail-art');
  copy.setAttribute('aria-hidden', 'true');
  copy.style.removeProperty('--art-scale');
  return copy.outerHTML;
}

// --- Totals and the list ----------------------------------------------------------------------------------------------

function deliveryPrice() {
  const choice = dialog.querySelector('input[name="delivery"]:checked');
  if (!choice) return 0;
  if (choice.value === 'assembly' && subtotal() >= freeFrom) return 0;
  return Number(choice.dataset.deliveryPrice ?? 0);
}

function renderTotals() {
  const sum = subtotal();
  dialog.querySelectorAll('[data-cart-subtotal]').forEach((element) => { element.textContent = money(sum); });
  const delivery = deliveryPrice();
  dialog.querySelector('[data-cart-delivery]').textContent = delivery === 0 ? 'gratis' : money(delivery);
  dialog.querySelector('[data-cart-total]').textContent = money(sum + delivery);
  const free = dialog.querySelector('[data-cart-free]');
  free.hidden = cart.length === 0;
  dialog.querySelector('[data-cart-free-text]').textContent = sum >= freeFrom
    ? 'Masz darmową dostawę z wniesieniem i montażem.'
    : `Do darmowej dostawy z wniesieniem brakuje ${money(freeFrom - sum)}.`;
  dialog.querySelector('[data-cart-free-bar]').style.setProperty('--progress', String(Math.min(1, sum / freeFrom)));
  const count = itemCount();
  countBadge.textContent = String(count);
  countBadge.hidden = count === 0;
  cartButton.setAttribute('aria-label', `Koszyk, produktów: ${count}`);
}

function renderCart() {
  const list = dialog.querySelector('[data-cart-items]');
  list.replaceChildren(...cart.map((item) => {
    const row = document.createElement('li');
    row.className = 'ds-cart-item';
    row.dataset.key = item.key;
    row.innerHTML = `
      <div class="ds-cart-item__art">${item.art}</div>
      <p class="ds-cart-item__name"></p>
      <p class="ds-cart-item__line" data-line></p>
      <div class="ds-cart-item__controls">
        <div class="ds-qty">
          <button class="ds-qty__button" type="button" data-qty="-1">−</button>
          <span class="ds-qty__value" data-qty-value></span>
          <button class="ds-qty__button" type="button" data-qty="1">+</button>
        </div>
        <button class="ds-cart-item__remove" type="button" data-remove>Usuń</button>
      </div>`;
    const name = row.querySelector('.ds-cart-item__name');
    name.textContent = item.name;
    const variant = document.createElement('span');
    variant.className = 'ds-cart-item__variant';
    variant.textContent = item.variant ? `${item.variant} · ${money(item.price)} / szt.` : `${money(item.price)} / szt.`;
    name.append(variant);
    row.querySelector('[data-qty="-1"]').setAttribute('aria-label', `Mniej: ${item.name}`);
    row.querySelector('[data-qty="1"]').setAttribute('aria-label', `Więcej: ${item.name}`);
    row.querySelector('[data-remove]').setAttribute('aria-label', `Usuń z koszyka: ${item.name}`);
    updateRow(row, item);
    return row;
  }));
  const empty = cart.length === 0;
  dialog.querySelector('[data-cart-empty]').hidden = !empty;
  dialog.querySelector('[data-cart-summary]').hidden = empty;
  dialog.querySelector('[data-cart-checkout]').hidden = empty;
  renderTotals();
}

function updateRow(row, item) {
  row.querySelector('[data-qty-value]').textContent = String(item.quantity);
  row.querySelector('[data-line]').textContent = money(item.price * item.quantity);
  row.querySelector('[data-qty="-1"]').disabled = item.quantity <= 1;
  row.querySelector('[data-qty="1"]').disabled = item.quantity >= 9;
}

function changeQuantity(row, step) {
  const item = cart.find((entry) => entry.key === row.dataset.key);
  if (!item) return;
  item.quantity = Math.min(9, Math.max(1, item.quantity + step));
  updateRow(row, item);
  renderTotals();
  save();
  if (!reduceMotion) {
    gsap.fromTo(row.querySelector('[data-qty-value]'), { y: step > 0 ? 8 : -8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' });
    gsap.fromTo(row.querySelector('[data-line]'), { opacity: 0.4 }, { opacity: 1, duration: 0.4 });
  }
}

function removeItem(row) {
  const done = () => {
    cart = cart.filter((entry) => entry.key !== row.dataset.key);
    save();
    renderCart();
    dialog.querySelector('[data-cart-close]')?.focus();
  };
  if (reduceMotion) return done();
  gsap.to(row, { opacity: 0, x: 24, duration: 0.25, ease: 'power2.in', onComplete: done });
}

// --- Steps --------------------------------------------------------------------------------------------------------

const steps = dialog ? [...dialog.querySelectorAll('[data-cart-step]')] : [];
const order = ['list', 'checkout', 'thanks'];

function showStep(name) {
  steps.forEach((step) => { step.hidden = step.dataset.cartStep !== name; });
  dialog.querySelectorAll('[data-step-mark]').forEach((mark) => {
    const position = order.indexOf(mark.dataset.stepMark);
    mark.classList.toggle('is-done', position < order.indexOf(name));
    if (mark.dataset.stepMark === name) mark.setAttribute('aria-current', 'step');
    else mark.removeAttribute('aria-current');
  });
  const shown = steps.find((step) => step.dataset.cartStep === name);
  if (!reduceMotion) gsap.fromTo(shown, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', clearProps: 'transform' });
  if (name === 'thanks' && !reduceMotion) {
    gsap.fromTo(shown.querySelectorAll('[data-thanks-ring], [data-thanks-tick]'), { strokeDasharray: 1000, strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 0.8, stagger: 0.35, ease: 'power2.out' });
  }
  dialog.querySelector('[data-cart-panel]').scrollTop = 0;
}

// --- Open and close -----------------------------------------------------------------------------------------------

export function openCart(from) {
  if (!dialog || dialog.open) return;
  opener = from ?? cartButton;
  document.documentElement.classList.add('ds-locked');
  dialog.showModal();
  if (reduceMotion) return;
  gsap.fromTo(dialog, { xPercent: 100 }, { xPercent: 0, duration: 0.55, ease: 'power3.out' });
  gsap.fromTo(dialog.querySelectorAll('.ds-cart-item, .ds-cart__free, .ds-cart__summary, .ds-cart__empty'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, delay: 0.2, ease: 'power3.out' });
}

function closeCart() {
  if (!dialog?.open) return;
  const finish = () => {
    dialog.close();
    gsap.set(dialog, { clearProps: 'transform' });
    document.documentElement.classList.remove('ds-locked');
    if (dialog.querySelector('[data-cart-step="thanks"]').hidden === false) showStep('list');
    opener?.focus();
  };
  if (reduceMotion) return finish();
  gsap.to(dialog, { xPercent: 100, duration: 0.4, ease: 'power2.in', onComplete: finish });
}

// --- Adding: the drawing flies into the cart icon -----------------------------------------------------------------

function flyToCart(source, then) {
  const art = source?.querySelector('svg');
  const icon = cartButton;
  if (reduceMotion || !art || !icon) return then();
  const from = art.getBoundingClientRect();
  const to = icon.getBoundingClientRect();
  const clone = art.cloneNode(true);
  clone.removeAttribute('role');
  clone.removeAttribute('aria-label');
  clone.setAttribute('aria-hidden', 'true');
  clone.classList.add('ds-fly');
  Object.assign(clone.style, { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px` });
  document.body.append(clone);
  const deltaX = to.left + to.width / 2 - (from.left + from.width / 2);
  const deltaY = to.top + to.height / 2 - (from.top + from.height / 2);
  const scale = Math.max(0.08, (to.width * 0.9) / from.width);
  gsap.timeline({ onComplete: () => { clone.remove(); then(); } })
    .to(clone, { scale: 1.06, duration: 0.15, ease: 'power1.out' })
    .to(clone, { x: deltaX, duration: 0.75, ease: 'power1.inOut' }, 0.15)
    .to(clone, { y: deltaY, duration: 0.75, ease: 'back.in(1.6)' }, 0.15)
    .to(clone, { scale, rotation: -14, duration: 0.75, ease: 'power2.in' }, 0.15)
    .to(clone, { opacity: 0.2, duration: 0.2 }, 0.75)
    .fromTo(icon, { scale: 1 }, { scale: 1.22, duration: 0.16, yoyo: true, repeat: 1, ease: 'power2.out' }, 0.86);
}

export function addToCart({ id, variant = '', price, quantity = 1, source, from }) {
  const product = catalog[id];
  if (!product || !dialog) return;
  const key = `${id}|${variant}`;
  const art = artCopy(source?.querySelector('svg'));
  const existing = cart.find((item) => item.key === key);
  if (existing) existing.quantity = Math.min(9, existing.quantity + quantity);
  else cart.push({ key, id, name: `${product.type} ${product.name}`, variant, price: price ?? product.price, quantity, art });
  save();
  flyToCart(source, () => {
    renderCart();
    showStep('list');
    openCart(from);
  });
}

// --- Quick view ---------------------------------------------------------------------------------------------------

const quick = document.querySelector('[data-quick]');
let quickId = '';
let quickOpener = null;

function openQuick(button) {
  const id = button.dataset.quickView;
  const product = catalog[id];
  if (!quick || !product) return;
  quickId = id;
  quickOpener = button;
  const card = button.closest('[data-product-card]');
  quick.querySelector('[data-quick-art]').innerHTML = artCopy(card?.querySelector('[data-fly-source] svg'));
  quick.querySelector('[data-quick-type]').textContent = product.type;
  quick.querySelector('[data-quick-name]').textContent = product.name;
  quick.querySelector('[data-quick-price]').textContent = money(product.price);
  quick.querySelector('[data-quick-text]').textContent = product.text;
  quick.querySelector('[data-quick-delivery]').textContent = `Wysyłka: ${product.delivery}`;
  quick.querySelector('[data-quick-more]').hidden = !product.page;
  document.documentElement.classList.add('ds-locked');
  quick.showModal();
  if (!reduceMotion) {
    gsap.fromTo(quick, { opacity: 0, y: 24, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power3.out', clearProps: 'transform' });
    gsap.fromTo(quick.querySelector('[data-quick-art] svg'), { scale: 0.9, rotation: -3 }, { scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.6)' });
  }
}

function closeQuick(returnFocus = true) {
  if (!quick?.open) return;
  const finish = () => {
    quick.close();
    gsap.set(quick, { clearProps: 'opacity,transform' });
    document.documentElement.classList.remove('ds-locked');
    if (returnFocus) quickOpener?.focus();
  };
  if (reduceMotion || !returnFocus) return finish();
  gsap.to(quick, { opacity: 0, y: 16, duration: 0.25, ease: 'power2.in', onComplete: finish });
}

// --- Wiring -------------------------------------------------------------------------------------------------------

export function initCart() {
  if (!dialog || !cartButton) return;
  renderCart();
  cartButton.addEventListener('click', () => { showStep('list'); openCart(cartButton); });
  dialog.querySelectorAll('[data-cart-close]').forEach((button) => button.addEventListener('click', closeCart));
  dialog.addEventListener('click', (event) => { if (event.target === dialog) closeCart(); });
  dialog.addEventListener('cancel', (event) => { event.preventDefault(); closeCart(); });
  dialog.querySelector('[data-cart-items]').addEventListener('click', (event) => {
    const row = event.target.closest('.ds-cart-item');
    if (!row) return;
    const qty = event.target.closest('[data-qty]');
    if (qty) changeQuantity(row, Number(qty.dataset.qty));
    if (event.target.closest('[data-remove]')) removeItem(row);
  });
  dialog.querySelector('[data-cart-checkout]').addEventListener('click', () => { showStep('checkout'); dialog.querySelector('input[name="delivery"]:checked')?.focus(); });
  dialog.querySelector('[data-cart-back]').addEventListener('click', () => showStep('list'));
  dialog.querySelectorAll('input[name="delivery"]').forEach((input) => input.addEventListener('change', renderTotals));
  const checkout = dialog.querySelector('[data-checkout-form]');
  checkout.addEventListener('submit', (event) => {
    event.preventDefault();
    cart = [];
    save();
    renderCart();
    checkout.reset();
    delete checkout.dataset.checked;
    showStep('thanks');
    dialog.querySelector('[data-cart-step="thanks"] [data-cart-close]')?.focus();
  });

  document.querySelectorAll('[data-cart-add]').forEach((button) => button.addEventListener('click', () => {
    const card = button.closest('[data-product-card]');
    addToCart({ id: button.dataset.cartAdd, source: card?.querySelector('[data-fly-source]'), from: button });
  }));
  document.querySelectorAll('[data-quick-view]').forEach((button) => button.addEventListener('click', () => openQuick(button)));
  quick?.querySelector('[data-quick-close]').addEventListener('click', () => closeQuick());
  quick?.addEventListener('click', (event) => { if (event.target === quick) closeQuick(); });
  quick?.addEventListener('cancel', (event) => { event.preventDefault(); closeQuick(); });
  quick?.querySelector('[data-quick-add]').addEventListener('click', () => {
    const opener = quickOpener;
    closeQuick(false);
    const card = opener?.closest('[data-product-card]');
    addToCart({ id: quickId, source: card?.querySelector('[data-fly-source]'), from: opener });
  });
}
