// Forms kit for samples: animated custom dropdowns and a date picker (built over the native <select>, which stays the source of truth)
// and a validation demo (required, e-mail, consent) with inline messages, a glow, focus on the first problem, and a
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

// --- Date picker -----------------------------------------------------------------------------------------------------
// A calendar popup over the native <input type="date"> (which keeps the value, YYYY-MM-DD). Mon–Sun weeks, the
// chosen day in the brand colour, today ringed, days before the field's min disabled (data-min="today" sets min to
// today). Keyboard: arrows by day / week, PageUp / PageDown by month (Shift: year), Home / End to the week's ends,
// Enter or Space picks, Escape closes.

const LANG = document.documentElement.lang === 'pl' ? 'pl' : 'en';
const DATE_TEXT = {
  pl: { placeholder: 'dd.mm.rrrr', weekdays: ['pon', 'wt', 'śr', 'czw', 'pt', 'sob', 'nd'], previous: 'Poprzedni miesiąc', next: 'Następny miesiąc', clear: 'Wyczyść', today: 'Dzisiaj', choose: 'Wybierz datę' },
  en: { placeholder: 'dd/mm/yyyy', weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], previous: 'Previous month', next: 'Next month', clear: 'Clear', today: 'Today', choose: 'Choose a date' },
}[LANG];
const pad = (number) => String(number).padStart(2, '0');
const toIso = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const fromIso = (value) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '');
  return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null;
};
const sameDay = (first, second) => Boolean(first && second) && toIso(first) === toIso(second);
const addDays = (date, days) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const addMonths = (date, months) => {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), last));
};
const shown = (date) => (LANG === 'pl' ? `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}` : `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`);
const monthName = new Intl.DateTimeFormat(document.documentElement.lang || 'en', { month: 'long', year: 'numeric' });
const fullDate = new Intl.DateTimeFormat(document.documentElement.lang || 'en', { dateStyle: 'full' });
const calendarIcon = '<svg class="ds-date__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/></svg>';
const arrow = (path) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="${path}"/></svg>`;

function enhanceDate(input) {
  const id = `ds-date-${(uid += 1)}`;
  const today = new Date();
  if (input.dataset.min === 'today') input.min = toIso(today);
  const min = fromIso(input.min);
  const label = document.querySelector(`label[for="${input.id}"]`);

  const wrapper = document.createElement('div');
  wrapper.className = 'ds-date';
  input.parentNode.insertBefore(wrapper, input);
  wrapper.appendChild(input);
  input.classList.add('ds-date__native');
  input.tabIndex = -1;
  input.setAttribute('aria-hidden', 'true');

  const button = document.createElement('button');
  button.type = 'button';
  button.className = `${input.className.replace('ds-date__native', '').trim()} ds-date__button`;
  button.id = `${id}-button`;
  button.setAttribute('aria-haspopup', 'dialog');
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', `${id}-popup`);
  const value = document.createElement('span');
  value.className = 'ds-date__value';
  button.append(value);
  button.insertAdjacentHTML('beforeend', calendarIcon);
  if (label) {
    label.id ||= `${id}-label`;
    label.setAttribute('for', button.id);
    button.setAttribute('aria-labelledby', `${label.id} ${button.id}`);
  }

  const popup = document.createElement('div');
  popup.className = 'ds-date__popup';
  popup.id = `${id}-popup`;
  popup.setAttribute('role', 'dialog');
  popup.setAttribute('aria-label', label ? `${label.textContent.trim()}: ${DATE_TEXT.choose.toLowerCase()}` : DATE_TEXT.choose);
  popup.hidden = true;
  popup.innerHTML = `
    <div class="ds-date__head">
      <button type="button" class="ds-date__nav" data-date-move="-1" aria-label="${DATE_TEXT.previous}">${arrow('m15 6-6 6 6 6')}</button>
      <p class="ds-date__month" id="${id}-month" aria-live="polite"></p>
      <button type="button" class="ds-date__nav" data-date-move="1" aria-label="${DATE_TEXT.next}">${arrow('m9 6 6 6-6 6')}</button>
    </div>
    <table class="ds-date__grid" role="grid" aria-labelledby="${id}-month">
      <thead><tr>${DATE_TEXT.weekdays.map((day) => `<th scope="col" class="ds-date__weekday">${day}</th>`).join('')}</tr></thead>
      <tbody></tbody>
    </table>
    <div class="ds-date__foot">
      <button type="button" class="ds-date__action" data-date-clear>${DATE_TEXT.clear}</button>
      <button type="button" class="ds-date__action" data-date-today>${DATE_TEXT.today}</button>
    </div>`;
  wrapper.append(button, popup);
  const body = popup.querySelector('tbody');
  const month = popup.querySelector('.ds-date__month');

  let focus = fromIso(input.value) ?? (min && min > today ? min : today);
  const disabled = (date) => Boolean(min) && date < min;

  const render = (direction = 0) => {
    const selected = fromIso(input.value);
    const first = new Date(focus.getFullYear(), focus.getMonth(), 1);
    const start = addDays(first, -((first.getDay() + 6) % 7));
    month.textContent = monthName.format(first);
    body.innerHTML = '';
    for (let week = 0; week < 6; week += 1) {
      const row = document.createElement('tr');
      for (let day = 0; day < 7; day += 1) {
        const date = addDays(start, week * 7 + day);
        const cell = document.createElement('td');
        cell.setAttribute('role', 'gridcell');
        const outside = date.getMonth() !== first.getMonth();
        cell.setAttribute('aria-selected', String(sameDay(date, selected)));
        const dayButton = document.createElement('button');
        dayButton.type = 'button';
        dayButton.className = `ds-date__day${outside ? ' is-outside' : ''}`;
        dayButton.textContent = String(date.getDate());
        dayButton.dataset.date = toIso(date);
        dayButton.tabIndex = sameDay(date, focus) ? 0 : -1;
        dayButton.setAttribute('aria-label', fullDate.format(date));
        if (sameDay(date, today)) dayButton.setAttribute('aria-current', 'date');
        if (disabled(date)) dayButton.disabled = true;
        cell.append(dayButton);
        row.append(cell);
      }
      body.append(row);
    }
    popup.querySelector('[data-date-today]').disabled = disabled(today);
    if (direction && !reduceMotion) gsap.fromTo(body, { x: direction * 18, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' });
  };
  const focusDay = () => popup.querySelector(`[data-date="${toIso(focus)}"]`)?.focus();
  const moveTo = (date) => {
    if (disabled(date)) date = min;
    const direction = date.getFullYear() * 12 + date.getMonth() - (focus.getFullYear() * 12 + focus.getMonth());
    focus = date;
    render(Math.sign(direction));
    focusDay();
  };
  const sync = () => {
    const selected = fromIso(input.value);
    value.textContent = selected ? shown(selected) : DATE_TEXT.placeholder;
    button.classList.toggle('is-empty', !selected);
  };
  const choose = (date) => {
    input.value = date ? toIso(date) : '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    sync();
  };
  const open = () => {
    if (!popup.hidden) return;
    document.dispatchEvent(new CustomEvent('ds-select-open', { detail: popup }));
    focus = fromIso(input.value) ?? (min && min > today ? min : today);
    render();
    popup.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    wrapper.classList.add('is-open');
    focusDay();
    if (!reduceMotion) gsap.fromTo(popup, { opacity: 0, y: -8, scale: 0.97, transformOrigin: 'top left' }, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power3.out' });
  };
  const close = (focusButton) => {
    if (popup.hidden) return;
    button.setAttribute('aria-expanded', 'false');
    wrapper.classList.remove('is-open');
    const done = () => { popup.hidden = true; gsap.set(popup, { clearProps: 'opacity,transform' }); };
    if (reduceMotion) done();
    else gsap.to(popup, { opacity: 0, y: -6, duration: 0.18, ease: 'power2.in', onComplete: done });
    if (focusButton) button.focus();
  };

  button.addEventListener('click', () => (popup.hidden ? open() : close(true)));
  button.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); }
  });
  popup.addEventListener('click', (event) => {
    const target = event.target.closest('button');
    if (!target || target.disabled) return;
    if (target.dataset.date) { choose(fromIso(target.dataset.date)); close(true); }
    else if (target.dataset.dateMove) moveTo(addMonths(focus, Number(target.dataset.dateMove)));
    else if ('dateClear' in target.dataset) { choose(null); close(true); }
    else if ('dateToday' in target.dataset) { choose(today); close(true); }
  });
  popup.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { event.preventDefault(); close(true); return; }
    if (!event.target.dataset.date) return;
    const weekday = (focus.getDay() + 6) % 7;
    const moves = {
      ArrowLeft: () => addDays(focus, -1),
      ArrowRight: () => addDays(focus, 1),
      ArrowUp: () => addDays(focus, -7),
      ArrowDown: () => addDays(focus, 7),
      Home: () => addDays(focus, -weekday),
      End: () => addDays(focus, 6 - weekday),
      PageUp: () => addMonths(focus, event.shiftKey ? -12 : -1),
      PageDown: () => addMonths(focus, event.shiftKey ? 12 : 1),
    };
    if (event.key in moves) { event.preventDefault(); moveTo(moves[event.key]()); }
  });
  // Moving rebuilds the days (the focused one leaves the DOM), so check where focus really went before closing.
  popup.addEventListener('focusout', () => setTimeout(() => { if (!wrapper.contains(document.activeElement)) close(false); }, 0));
  document.addEventListener('pointerdown', (event) => { if (!wrapper.contains(event.target)) close(false); });
  document.addEventListener('ds-select-open', (event) => { if (event.detail !== popup) close(false); });
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

// The box the message hangs under: the consent label for checkboxes, otherwise the field's own container. The message
// is absolutely placed below it, in the gap, so showing it never moves anything on the page.
function boxFor(field) {
  if (field.type === 'checkbox' || field.type === 'radio') return field.closest('label') ?? field.parentElement;
  return (field.closest('.ds-select') ?? field).parentElement;
}

const errorColour = () => getComputedStyle(document.documentElement).getPropertyValue('--color-state-error').trim() || '#b3261e';

function showProblem(field, message, animate) {
  const box = boxFor(field);
  const visual = field.closest('.ds-select')?.querySelector('.ds-select__button') ?? field;
  let note = document.getElementById(`${field.id || field.name}-error`);
  if (!message) {
    field.removeAttribute('aria-invalid');
    visual.removeAttribute('aria-invalid');
    if (note) {
      if (reduceMotion) note.remove();
      else gsap.to(note, { opacity: 0, duration: 0.2, onComplete: () => note.remove() });
    }
    return;
  }
  field.setAttribute('aria-invalid', 'true');
  visual.setAttribute('aria-invalid', 'true');
  if (!note) {
    note = document.createElement('p');
    note.className = 'ds-field-error';
    note.id = `${field.id || field.name}-error`;
    if (getComputedStyle(box).position === 'static') box.style.position = 'relative';
    box.append(note);
    const describedBy = new Set((field.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean));
    describedBy.add(note.id);
    field.setAttribute('aria-describedby', [...describedBy].join(' '));
    if (!reduceMotion) gsap.fromTo(note, { opacity: 0 }, { opacity: 1, duration: 0.25 });
  }
  note.textContent = message;
  // A soft red glow that settles into the error outline: draws the eye, moves nothing.
  if (animate && !reduceMotion) {
    const colour = errorColour();
    gsap.fromTo(visual, { boxShadow: `0 0 0 6px ${colour}55` }, { boxShadow: `0 0 0 1px ${colour}`, duration: 0.6, ease: 'power2.out', clearProps: 'boxShadow' });
  }
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
  root.querySelectorAll('input[type="date"]').forEach(enhanceDate);
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
