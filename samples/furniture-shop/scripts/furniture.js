// Behaviour and motion for the furniture-shop sample (GSAP + ScrollTrigger). Content is complete without JS; motion
// runs only when the visitor has not asked for reduced motion. The shop parts are demos: nothing is charged or sent.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { enhanceForms } from './forms.js';
import { addToCart, initCart } from './cart.js';
import { bookcaseSvg, estimate, woods } from './bookcase.js';

gsap.registerPlugin(ScrollTrigger);

// Entrance targets are hidden by CSS from the first paint while <html data-motion> is set; tell the page we are here.
document.documentElement.setAttribute('data-motion-ready', '');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const money = (value) => `${Math.round(value).toLocaleString('pl-PL')} zł`;

enhanceForms();
initCart();

// --- Header: solid once the page scrolls; the phone menu overlay ---------------------------------------------------

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
  document.documentElement.classList.toggle('ds-locked', open);
  const items = drawer.querySelectorAll('li, .ds-site-header__drawer-cta');
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

// --- Collection filters: fade out, swap, rise back in place --------------------------------------------------------

const filters = document.querySelector('[data-filters]');
const grid = document.querySelector('[data-product-grid]');
if (filters && grid) {
  const items = [...grid.querySelectorAll('[data-product]')];
  const countText = document.querySelector('[data-result-count]');
  const empty = document.querySelector('[data-listing-empty]');
  const sort = document.querySelector('[data-sort]');
  const output = filters.querySelector('[data-price-output]');
  const activeBadge = filters.querySelector('[data-filters-active]');
  const panel = filters.querySelector('[data-filters-panel]');
  const range = filters.querySelector('input[name="price"]');
  if (window.matchMedia('(max-width: 899px)').matches) panel.open = false;

  const plural = (count) => {
    if (count === 1) return 'produkt';
    const lastDigit = count % 10;
    const lastTwo = count % 100;
    return lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 12 || lastTwo > 14) ? 'produkty' : 'produktów';
  };

  const readState = () => {
    const data = new FormData(filters);
    return {
      category: data.get('category') ?? 'all',
      materials: data.getAll('material'),
      colours: data.getAll('colour'),
      price: Number(data.get('price') ?? range.max),
      sort: sort?.value ?? 'featured',
    };
  };

  const matches = (item, state) => (state.category === 'all' || item.dataset.category === state.category)
    && (state.materials.length === 0 || state.materials.some((material) => item.dataset.materials.split(' ').includes(material)))
    && (state.colours.length === 0 || state.colours.includes(item.dataset.colour))
    && Number(item.dataset.price) <= state.price;

  const sorters = {
    featured: (first, second) => Number(first.dataset.order) - Number(second.dataset.order),
    'price-asc': (first, second) => Number(first.dataset.price) - Number(second.dataset.price),
    'price-desc': (first, second) => Number(second.dataset.price) - Number(first.dataset.price),
    name: (first, second) => first.dataset.name.localeCompare(second.dataset.name, 'pl'),
  };

  let running = null;
  const apply = () => {
    const state = readState();
    output.textContent = money(state.price);
    const active = (state.category === 'all' ? 0 : 1) + state.materials.length + state.colours.length + (state.price < Number(range.max) ? 1 : 0);
    activeBadge.hidden = active === 0;
    activeBadge.textContent = String(active);
    const shown = items.filter((item) => matches(item, state)).sort(sorters[state.sort] ?? sorters.featured);
    const swap = () => {
      items.forEach((item) => { item.hidden = !shown.includes(item); });
      shown.forEach((item) => grid.append(item));
      ScrollTrigger.refresh();
      countText.textContent = `${shown.length} ${plural(shown.length)}`;
      empty.hidden = shown.length > 0;
    };
    if (reduceMotion) return swap();
    running?.kill();
    gsap.killTweensOf(items);
    const visible = items.filter((item) => !item.hidden);
    running = gsap.to(visible, {
      opacity: 0,
      duration: 0.18,
      ease: 'power1.in',
      onComplete: () => {
        swap();
        running = gsap.fromTo(shown, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.04, ease: 'power3.out' });
        gsap.fromTo(empty, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      },
    });
  };

  let rangeTimer = 0;
  filters.addEventListener('change', apply);
  range.addEventListener('input', () => {
    output.textContent = money(Number(range.value));
    clearTimeout(rangeTimer);
    rangeTimer = setTimeout(apply, 140);
  });
  sort?.addEventListener('change', apply);
  filters.addEventListener('reset', () => setTimeout(apply, 0));
  document.querySelector('[data-filters-clear]')?.addEventListener('click', () => filters.reset());

  // A category tile sets the category filter, then the anchor scrolls to the collection.
  document.querySelectorAll('[data-category-link]').forEach((link) => link.addEventListener('click', () => {
    const radio = filters.querySelector(`input[name="category"][value="${link.dataset.categoryLink}"]`);
    if (radio) {
      radio.checked = true;
      apply();
    }
  }));
}

// --- Made-to-measure configurator ----------------------------------------------------------------------------------

const configurator = document.querySelector('[data-configurator]');
if (configurator) {
  const widthInput = configurator.querySelector('[data-config-width]');
  const heightInput = configurator.querySelector('[data-config-height]');
  const drawing = configurator.querySelector('[data-config-drawing]');
  const shape = configurator.querySelector('[data-config-shape]');
  const widthLabel = configurator.querySelector('[data-config-width-label]');
  const heightLabel = configurator.querySelector('[data-config-height-label]');
  const estimateText = configurator.querySelector('[data-config-estimate]');
  const target = document.querySelector('[data-config-target]');
  let shownPrice = estimate(Number(widthInput.value), Number(heightInput.value), 'dab');

  const update = () => {
    const width = Number(widthInput.value);
    const height = Number(heightInput.value);
    const woodInput = configurator.querySelector('[data-config-wood]:checked');
    const wood = woodInput?.value ?? 'dab';
    configurator.style.setProperty('--custom-wood', woodInput?.dataset.tone ?? '');
    const result = bookcaseSvg(width, height);
    shape.innerHTML = result.svg;
    widthLabel.setAttribute('x', String(result.labelX));
    widthLabel.setAttribute('y', String(result.labelY));
    widthLabel.textContent = `${width} cm`;
    heightLabel.setAttribute('x', String(result.sideX));
    heightLabel.setAttribute('y', String(result.sideY));
    heightLabel.setAttribute('transform', `rotate(-90 ${result.sideX} ${result.sideY})`);
    heightLabel.textContent = `${height} cm`;
    configurator.querySelector('[data-config-width-out]').textContent = `${width} cm`;
    configurator.querySelector('[data-config-height-out]').textContent = `${height} cm`;
    drawing.setAttribute('aria-label', `Rysunek regału ${width} na ${height} cm`);
    if (target) target.value = `${width} × ${height} cm, ${woods[wood].name}`;
    const price = estimate(width, height, wood);
    if (reduceMotion) {
      estimateText.textContent = money(price);
    } else {
      const counter = { value: shownPrice };
      gsap.to(counter, { value: price, duration: 0.5, ease: 'power2.out', overwrite: true, onUpdate: () => { estimateText.textContent = money(Math.round(counter.value / 10) * 10); } });
    }
    shownPrice = price;
  };
  configurator.addEventListener('input', update);
  configurator.addEventListener('change', update);
}

// --- Product page: swatches recolour the drawing, size changes width and price, delivery date ---------------------

const detailForm = document.querySelector('[data-detail-form]');
if (detailForm) {
  const art = document.querySelector('[data-detail-art]');
  const artBox = art?.closest('[data-fly-source]');
  const weave = document.querySelector('[data-detail-weave]');
  const leg = document.querySelector('[data-detail-leg]');
  const priceText = detailForm.querySelector('[data-detail-price]');
  const quantity = detailForm.querySelector('[data-detail-qty]');
  let shownPrice = Number(detailForm.querySelector('input[name="size"]:checked').dataset.price);
  const dateFormat = new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'long' });

  const eta = (weeksText) => {
    const weeks = (weeksText.match(/\d+/g) ?? []).map(Number);
    if (weeks.length === 0) return '';
    const day = (count) => { const date = new Date(); date.setDate(date.getDate() + count * 7); return dateFormat.format(date); };
    return ` (dostawa ok. ${day(weeks[0])} – ${day(weeks.at(-1) + 1)})`;
  };

  const pulse = () => {
    if (!reduceMotion && artBox) gsap.fromTo(artBox, { scale: 0.97 }, { scale: 1, duration: 0.6, ease: 'back.out(2)' });
  };

  const update = (changed) => {
    const fabric = detailForm.querySelector('input[name="fabric"]:checked');
    const wood = detailForm.querySelector('input[name="wood"]:checked');
    const size = detailForm.querySelector('input[name="size"]:checked');
    art.style.setProperty('--art-fabric', fabric.dataset.fabric);
    art.style.setProperty('--art-wood', wood.dataset.wood);
    art.style.setProperty('--art-scale', size.dataset.scale);
    weave?.style.setProperty('--weave', fabric.dataset.fabric);
    leg?.style.setProperty('--leg', wood.dataset.wood);
    detailForm.querySelector('[data-detail-fabric-name]').textContent = fabric.dataset.name;
    detailForm.querySelector('[data-detail-wood-name]').textContent = wood.dataset.name;
    detailForm.querySelector('[data-detail-delivery]').textContent = fabric.dataset.delivery;
    detailForm.querySelector('[data-detail-eta]').textContent = eta(fabric.dataset.delivery);
    document.querySelector('[data-detail-width]').textContent = `${size.dataset.width} cm`;
    const price = Number(size.dataset.price);
    if (reduceMotion || price === shownPrice) {
      priceText.textContent = money(price);
    } else {
      const counter = { value: shownPrice };
      gsap.to(counter, { value: price, duration: 0.6, ease: 'power2.out', overwrite: true, onUpdate: () => { priceText.textContent = money(Math.round(counter.value / 10) * 10); } });
    }
    shownPrice = price;
    if (changed) pulse();
  };
  detailForm.addEventListener('change', (event) => { if (event.target.name !== 'quantity') update(true); });
  update(false);

  const setQuantity = (value) => { quantity.value = String(Math.min(9, Math.max(1, value || 1))); };
  detailForm.querySelector('[data-detail-minus]').addEventListener('click', () => setQuantity(Number(quantity.value) - 1));
  detailForm.querySelector('[data-detail-plus]').addEventListener('click', () => setQuantity(Number(quantity.value) + 1));
  quantity.addEventListener('change', () => setQuantity(Number(quantity.value)));

  detailForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const fabric = detailForm.querySelector('input[name="fabric"]:checked');
    const wood = detailForm.querySelector('input[name="wood"]:checked');
    const size = detailForm.querySelector('input[name="size"]:checked');
    addToCart({
      id: detailForm.dataset.productId,
      variant: `${size.dataset.name}, ${fabric.dataset.name}, nogi: ${wood.dataset.name.toLowerCase()}`,
      price: Number(size.dataset.price),
      quantity: Number(quantity.value) || 1,
      source: artBox,
      from: detailForm.querySelector('[type="submit"]'),
    });
  });
}

// --- Forms with a thank-you (the forms kit validates first; nothing is sent) --------------------------------------

[['[data-custom-form]', '[data-custom-thanks]'], ['[data-booking-form]', '[data-booking-thanks]'], ['[data-newsletter-form]', '[data-newsletter-thanks]']].forEach(([formSelector, thanksSelector]) => {
  const form = document.querySelector(formSelector);
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const thanks = form.querySelector(thanksSelector);
    thanks.hidden = false;
    if (!reduceMotion) gsap.fromTo(thanks, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' });
  });
});

// --- Motion -------------------------------------------------------------------------------------------------------

const motion = gsap.matchMedia();
motion.add('(prefers-reduced-motion: no-preference)', () => {
  // Hero: copy rises in; the room's pieces slide into place; the floorboards' grain draws.
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro.fromTo('[data-hero-item]', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.09 });
  const offsets = { left: { x: -90, y: 0 }, right: { x: 90, y: 0 }, top: { x: 0, y: -70 }, bottom: { x: 0, y: 50 } };
  gsap.utils.toArray('[data-room-piece]').forEach((piece, index) => {
    const offset = offsets[piece.dataset.from] ?? offsets.bottom;
    intro.fromTo(piece, { opacity: 0, x: offset.x, y: offset.y }, { opacity: 1, x: 0, y: 0, duration: 0.9, ease: 'power3.out' }, 0.15 + index * 0.1);
  });
  intro.fromTo('.ds-room-hero [data-draw]', { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 1.4, stagger: 0.15, ease: 'power2.inOut' }, 0.5);
  const sofa = document.querySelector('[data-room-hero]');
  if (sofa) intro.fromTo(sofa, { rotation: 0 }, { rotation: -1.2, duration: 0.18, yoyo: true, repeat: 1, svgOrigin: '250 480', ease: 'sine.inOut' }, '>-0.2');

  // Sections: rise in as they enter.
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: (elements) => gsap.fromTo(elements, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' }),
  });

  // Line drawings outside the hero (wood grain, delivery line, the newsletter lamp) draw once as they enter.
  const drawn = new Set();
  gsap.utils.toArray('[data-draw]').filter((path) => !path.closest('.ds-room-hero')).forEach((path) => drawn.add(path.closest('svg')));
  drawn.forEach((svg) => {
    gsap.fromTo(svg.querySelectorAll('[data-draw]'), { strokeDashoffset: 1000 }, {
      strokeDashoffset: 0,
      duration: svg.closest('[data-delivery-track]') ? 1.8 : 1.4,
      stagger: 0.12,
      ease: 'power2.inOut',
      scrollTrigger: { trigger: svg, start: 'top 85%', once: true },
    });
  });

  // Product page details: panels slide open and closed (native details without motion).
  gsap.utils.toArray('.ds-detail__panel').forEach((item) => {
    const summary = item.querySelector('summary');
    const body = item.querySelector('.ds-detail__panel-body');
    summary.addEventListener('click', (event) => {
      event.preventDefault();
      if (item.dataset.animating) return;
      item.dataset.animating = 'true';
      const done = () => { delete item.dataset.animating; gsap.set(body, { clearProps: 'height,opacity,overflow' }); };
      if (item.open) {
        gsap.to(body, { height: 0, opacity: 0, overflow: 'hidden', duration: 0.35, ease: 'power2.inOut', onComplete: () => { item.open = false; done(); } });
      } else {
        item.open = true;
        gsap.from(body, { height: 0, opacity: 0, overflow: 'hidden', duration: 0.45, ease: 'power2.out', onComplete: done });
      }
    });
  });
});
