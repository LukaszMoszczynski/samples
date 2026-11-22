// Forms kit for samples: animated custom dropdowns (built over the native <select>, which stays the source of truth)
// and a validation demo (required, e-mail, consent) with inline messages, a shake, focus on the first problem, and a
// short "sending" pause before the form's own thank-you handler runs. Without JS the native controls and the browser's
// own validation still work.
import { gsap } from 'gsap';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const MESSAGES = {
  pl: { required: 'To pole jest wymagane.', email: 'Wpisz poprawny adres e-mail, np. imie@example.com.', consent: 'Zaznacz zgodę, żeby wysłać formularz.' },
  en: { required: 'This field is required.', email: 'Enter a valid e-mail address, e.g. name@example.com.', consent: 'Tick the consent box to send the form.' },
};
const text = MESSAGES[document.documentElement.lang] ?? MESSAGES.en;
const chevron = '<svg class="ds-select__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
const tick = '<svg class="ds-select__tick" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m5 12 4 4 10-10"/></svg>';
let uid = 0;

// --- Dropdowns -------------------------------------------------------------------------------------------------------

function enhanceSelect(select) {
  const id = `ds-select-${(uid += 1)}`;
  const label = document.querySelector(`label[for="${select.id}"]`);
  const wrapper = document.createElement('div');
  wrapper.className = 'ds-select';
  select.parentNode.insertBefore(wrapper, select);
  wrapper.appendChild(select);
  select.classList.add('ds-select__native');
  select.tabIndex = -1;
  select.setAttribute('aria-hidden', 'true');

  const button = document.createElement('button');
  button.type = 'button';
  button.className = `${select.className.replace('ds-select__native', '').trim()} ds-select__button`;
  button.id = `${id}-button`;
  button.setAttribute('aria-haspopup', 'listbox');
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', `${id}-list`);
  if (label) {
    label.id ||= `${id}-label`;
    label.setAttribute('for', button.id);
    button.setAttribute('aria-labelledby', `${label.id} ${button.id}`);
  }
  const value = document.createElement('span');
  value.className = 'ds-select__value';
  button.append(value);
  button.insertAdjacentHTML('beforeend', chevron);

  const list = document.createElement('ul');
  list.className = 'ds-select__list';
  list.id = `${id}-list`;
  list.setAttribute('role', 'listbox');
  list.tabIndex = -1;
  if (label) list.setAttribute('aria-labelledby', label.id);
  list.hidden = true;
  const options = [...select.options].map((option, index) => {
    const item = document.createElement('li');
    item.className = 'ds-select__option';
    item.id = `${id}-option-${index}`;
    item.setAttribute('role', 'option');
    item.innerHTML = `<span>${option.textContent}</span>${tick}`;
    item.addEventListener('click', () => { choose(index); close(true); });
    item.addEventListener('pointermove', () => highlight(index));
    list.append(item);
    return item;
  });
  wrapper.append(button, list);

  let active = select.selectedIndex;
  const sync = () => {
    value.textContent = select.options[select.selectedIndex]?.textContent ?? '';
    options.forEach((item, index) => item.setAttribute('aria-selected', String(index === select.selectedIndex)));
  };
  const highlight = (index) => {
    active = Math.max(0, Math.min(options.length - 1, index));
    options.forEach((item, itemIndex) => item.classList.toggle('is-active', itemIndex === active));
    list.setAttribute('aria-activedescendant', options[active].id);
    options[active].scrollIntoView({ block: 'nearest' });
  };
  const choose = (index) => {
    select.selectedIndex = index;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    sync();
  };
  const open = () => {
    if (!list.hidden) return;
    document.dispatchEvent(new CustomEvent('ds-select-open', { detail: list }));
    list.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    wrapper.classList.add('is-open');
    highlight(select.selectedIndex);
    list.focus();
    if (reduceMotion) return;
    gsap.fromTo(list, { opacity: 0, y: -8, scaleY: 0.92, transformOrigin: 'top center' }, { opacity: 1, y: 0, scaleY: 1, duration: 0.28, ease: 'power3.out' });
    gsap.fromTo(options, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.25, stagger: 0.03, delay: 0.05, ease: 'power2.out' });
  };
  const close = (focusButton) => {
    if (list.hidden) return;
    button.setAttribute('aria-expanded', 'false');
    wrapper.classList.remove('is-open');
    const done = () => { list.hidden = true; gsap.set(list, { clearProps: 'opacity,transform' }); };
    if (reduceMotion) done();
    else gsap.to(list, { opacity: 0, y: -6, duration: 0.18, ease: 'power2.in', onComplete: done });
    if (focusButton) button.focus();
  };

  button.addEventListener('click', () => (list.hidden ? open() : close(true)));
  button.addEventListener('keydown', (event) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) { event.preventDefault(); open(); }
  });
  list.addEventListener('keydown', (event) => {
    const moves = { ArrowDown: active + 1, ArrowUp: active - 1, Home: 0, End: options.length - 1 };
    if (event.key in moves) { event.preventDefault(); highlight(moves[event.key]); return; }
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(active); close(true); return; }
    if (event.key === 'Escape') { event.preventDefault(); close(true); return; }
    if (event.key === 'Tab') { choose(active); close(false); return; }
    if (event.key.length === 1) {
      const start = (active + 1) % options.length;
      const order = [...options.keys()].map((step) => (start + step) % options.length);
      const match = order.find((index) => options[index].textContent.trim().toLowerCase().startsWith(event.key.toLowerCase()));
      if (match !== undefined) highlight(match);
    }
  });
  document.addEventListener('pointerdown', (event) => { if (!wrapper.contains(event.target)) close(false); });
  document.addEventListener('ds-select-open', (event) => { if (event.detail !== list) close(false); });
  select.addEventListener('change', sync);
  sync();
}

// --- Validation demo -------------------------------------------------------------------------------------------------

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

function problemFor(field) {
  if (field.type === 'checkbox') return field.required && !field.checked ? text.consent : '';
  const value = field.value.trim();
  if (field.required && !value) return text.required;
  if (field.type === 'email' && value && !isEmail(value)) return text.email;
  return '';
}

function anchorFor(field) {
  if (field.type === 'checkbox' || field.type === 'radio') return field.closest('label') ?? field;
  return field.closest('.ds-select') ?? field;
}

function showProblem(field, message, animate) {
  const anchor = anchorFor(field);
  const visual = field.closest('.ds-select')?.querySelector('.ds-select__button') ?? field;
  let note = document.getElementById(`${field.id || field.name}-error`);
  if (!message) {
    field.removeAttribute('aria-invalid');
    visual.removeAttribute('aria-invalid');
    if (note) {
      if (reduceMotion) note.remove();
      else gsap.to(note, { opacity: 0, height: 0, marginTop: 0, duration: 0.2, onComplete: () => note.remove() });
    }
    return;
  }
  field.setAttribute('aria-invalid', 'true');
  visual.setAttribute('aria-invalid', 'true');
  if (!note) {
    note = document.createElement('p');
    note.className = 'ds-field-error';
    note.id = `${field.id || field.name}-error`;
    anchor.insertAdjacentElement('afterend', note);
    const describedBy = new Set((field.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean));
    describedBy.add(note.id);
    field.setAttribute('aria-describedby', [...describedBy].join(' '));
    if (!reduceMotion) gsap.fromTo(note, { opacity: 0, y: -4 }, { opacity: 1, y: 0, duration: 0.25 });
  }
  note.textContent = message;
  if (animate && !reduceMotion) gsap.fromTo(anchor, { x: 0 }, { keyframes: { x: [0, -8, 8, -6, 6, -3, 0] }, duration: 0.45, ease: 'none' });
}

function validate(form, animate) {
  const fields = [...form.querySelectorAll('input, select, textarea')].filter((field) => !field.disabled && field.type !== 'hidden' && field.type !== 'submit' && (field.required || field.type === 'email'));
  let first = null;
  fields.forEach((field) => {
    const message = problemFor(field);
    showProblem(field, message, animate);
    if (message && !first) first = field;
  });
  return first;
}

export function enhanceForms(root = document) {
  root.querySelectorAll('select').forEach(enhanceSelect);
  root.querySelectorAll('form').forEach((form) => {
    if (!form.querySelector('[required], [type="email"]')) return;
    form.noValidate = true;
    form.addEventListener('input', (event) => { if (form.dataset.checked) showProblem(event.target, problemFor(event.target), false); });
    form.addEventListener('change', (event) => { if (form.dataset.checked && event.target.type === 'checkbox') showProblem(event.target, problemFor(event.target), false); });
  });
  // Runs before each form's own submit handler: stops the submit when something is missing, otherwise shows a short
  // "sending" moment and then lets the form's thank-you handler run.
  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!form.noValidate || form.dataset.sending === 'done') { delete form.dataset.sending; return; }
    event.preventDefault();
    event.stopPropagation();
    form.dataset.checked = 'true';
    const first = validate(form, true);
    if (first) {
      const target = first.closest('.ds-select')?.querySelector('.ds-select__button') ?? first;
      target.focus({ preventScroll: true });
      target.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      return;
    }
    const button = form.querySelector('[type="submit"]');
    button?.setAttribute('aria-busy', 'true');
    if (button && !reduceMotion) gsap.to(button, { scale: 0.96, duration: 0.25, repeat: 3, yoyo: true, ease: 'sine.inOut' });
    setTimeout(() => {
      button?.removeAttribute('aria-busy');
      form.dataset.sending = 'done';
      form.requestSubmit(button ?? undefined);
    }, reduceMotion ? 0 : 900);
  }, true);
}
