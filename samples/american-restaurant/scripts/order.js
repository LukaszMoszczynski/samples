// Takeaway order demo: "Dodaj" buttons in the menu and the shake bar put dishes on the guest check, quantity buttons
// change them, the header bag shows the count. Sending checks the order is not empty, then the forms kit runs its
// check and the thank-you shows the summary. Nothing is sent and nothing is paid.
import { gsap } from 'gsap';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const order = new Map(); // dish id → { name, price, quantity }

const list = document.querySelector('[data-cart-list]');
const empty = document.querySelector('[data-cart-empty]');
const totalRow = document.querySelector('[data-cart-total-row]');
const total = document.querySelector('[data-cart-total]');
const problem = document.querySelector('[data-cart-problem]');
const status = document.querySelector('[data-cart-status]');
const check = document.querySelector('[data-cart]');
const count = document.querySelector('[data-cart-count]');
const bag = document.querySelector('[data-cart-link]');
const form = document.querySelector('[data-order-form]');

const money = (value) => `${value} zł`;
const itemsWord = (amount) => {
  if (amount === 1) return 'pozycja';
  const lastDigit = amount % 10;
  const lastTwo = amount % 100;
  return lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 12 || lastTwo > 14) ? 'pozycje' : 'pozycji';
};
const totals = () => {
  let quantity = 0;
  let sum = 0;
  order.forEach((line) => { quantity += line.quantity; sum += line.quantity * line.price; });
  return { quantity, sum };
};

const icon = (path) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="${path}"/></svg>`;

function render() {
  const { quantity, sum } = totals();
  list.replaceChildren(...[...order.entries()].map(([id, line]) => {
    const row = document.createElement('li');
    row.className = 'ds-takeaway__line';
    row.innerHTML = `
      <span class="ds-takeaway__line-name"></span>
      <span class="ds-takeaway__qty">
        <button class="ds-takeaway__qty-button" type="button" data-change="-1">${icon('M5 12h14')}</button>
        <span class="ds-takeaway__qty-value">${line.quantity}</span>
        <button class="ds-takeaway__qty-button" type="button" data-change="1">${icon('M12 5v14M5 12h14')}</button>
      </span>
      <span class="ds-takeaway__line-price">${money(line.quantity * line.price)}</span>`;
    row.querySelector('.ds-takeaway__line-name').textContent = line.name;
    row.querySelector('[data-change="-1"]').setAttribute('aria-label', `Usuń jedną porcję: ${line.name}`);
    row.querySelector('[data-change="1"]').setAttribute('aria-label', `Dodaj jeszcze jedną porcję: ${line.name}`);
    row.dataset.id = id;
    return row;
  }));
  empty.hidden = quantity > 0;
  totalRow.hidden = quantity === 0;
  total.textContent = money(sum);
  count.hidden = quantity === 0;
  count.textContent = String(quantity);
  bag.setAttribute('aria-label', quantity ? `Na wynos: ${quantity} ${itemsWord(quantity)}, ${money(sum)}` : 'Na wynos: zamówienie puste');
  if (quantity) problem.hidden = true;
}

function change(id, by, name, price) {
  const line = order.get(id) ?? { name, price, quantity: 0 };
  line.quantity += by;
  if (line.quantity <= 0) order.delete(id);
  else order.set(id, line);
  render();
  const { quantity, sum } = totals();
  status.textContent = `${by > 0 ? 'Dodano' : 'Usunięto'}: ${line.name}. W zamówieniu ${quantity} ${itemsWord(quantity)}, razem ${money(sum)}.`;
}

// A cherry dot flies from the button to the bag in the header, then the count pops.
function fly(from) {
  if (reduceMotion || !bag) return;
  const start = from.getBoundingClientRect();
  const end = bag.getBoundingClientRect();
  const dot = document.createElement('span');
  dot.className = 'ds-fly-dot';
  dot.setAttribute('aria-hidden', 'true');
  document.body.append(dot);
  const size = dot.offsetWidth;
  gsap.set(dot, { x: start.left + start.width / 2 - size / 2, y: start.top + start.height / 2 - size / 2 });
  gsap.timeline({ onComplete: () => dot.remove() })
    .to(dot, { x: end.left + end.width / 2 - size / 2, duration: 0.7, ease: 'power1.inOut' }, 0)
    .to(dot, { y: end.top + end.height / 2 - size / 2, duration: 0.7, ease: 'back.in(1.4)' }, 0)
    .to(dot, { scale: 0.4, opacity: 0.6, duration: 0.2 }, 0.5)
    .add(() => gsap.fromTo(bag, { scale: 1.15 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' }));
}

export function setupOrder() {
  if (!list || !form) return;
  document.querySelectorAll('[data-add-dish]').forEach((button) => {
    button.hidden = false;
    const label = button.querySelector('[data-add-label]');
    const restingText = label?.textContent ?? '';
    let timer;
    button.addEventListener('click', () => {
      change(button.dataset.addDish, 1, button.dataset.name, Number(button.dataset.price));
      fly(button);
      button.classList.add('is-added');
      if (label) label.textContent = 'Dodano';
      clearTimeout(timer);
      timer = setTimeout(() => {
        button.classList.remove('is-added');
        if (label) label.textContent = restingText;
      }, 1400);
    });
  });
  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-change]');
    if (!button) return;
    const row = button.closest('li');
    const id = row.dataset.id;
    change(id, Number(button.dataset.change));
    // Keep the keyboard on the same row's button when the row is still there.
    list.querySelector(`li[data-id="${id}"] [data-change="${button.dataset.change}"]`)?.focus();
  });

  // Before the forms kit (window capture runs first): an empty order shows its own message and stops the send.
  window.addEventListener('submit', (event) => {
    if (event.target !== form || form.dataset.sending === 'done' || totals().quantity > 0) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    problem.hidden = false;
    check.focus({ preventScroll: true });
    check.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    if (!reduceMotion) gsap.fromTo(problem, { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
  }, true);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim().split(/\s+/)[0];
    const { quantity, sum } = totals();
    const time = String(data.get('time') ?? '').replace(/^Na /, 'na ');
    const summary = form.querySelector('[data-order-summary]');
    summary.textContent = `Dziękujemy${name ? `, ${name}` : ''}! Zamówienie: ${quantity} ${itemsWord(quantity)}, razem ${money(sum)}, odbiór ${time.startsWith('Jak') ? 'jak najszybciej' : time}. To przykładowa strona: nic nie zostało wysłane ani opłacone.`;
    const thanks = form.querySelector('[data-order-thanks]');
    thanks.hidden = false;
    if (!reduceMotion) gsap.fromTo(thanks, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
  });
  render();
}
