// Behaviour and motion for the law-firm sample (GSAP + ScrollTrigger).
// Two audiences, two pages (dla-firm, dla-ciebie); the home page groups both and sends visitors down the right path.
// Content is complete without JS; motion runs only without a reduced-motion preference.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Entrance targets are hidden by CSS from the first paint while <html data-motion> is set; tell the page we are here.
document.documentElement.setAttribute('data-motion-ready', '');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Header: hairline once scrolled; drawer on narrow screens.
const header = document.querySelector('[data-law-header]');
const setScrolled = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
setScrolled();
window.addEventListener('scroll', setScrolled, { passive: true });
const burger = document.querySelector('[data-law-burger]');
const drawer = document.getElementById('law-drawer');
const setDrawer = (open) => {
  if (!burger || !drawer) return;
  burger.setAttribute('aria-expanded', String(open));
  drawer.hidden = !open;
};
burger?.addEventListener('click', () => setDrawer(burger.getAttribute('aria-expanded') !== 'true'));
drawer?.addEventListener('click', (event) => event.target.closest('a') && setDrawer(false));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && burger?.getAttribute('aria-expanded') === 'true') {
    setDrawer(false);
    burger.focus();
  }
});

// Contact: the facts beside the form follow the chosen option (firm or private matter).
document.querySelectorAll('[data-contact-choice]').forEach((choice) => choice.addEventListener('change', () => {
  document.querySelectorAll('[data-contact-fact]').forEach((fact) => { fact.hidden = fact.dataset.contactFact !== choice.value; });
}));

// Contact form: sample only.
const contactForm = document.querySelector('[data-contact-form]');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  contactForm.querySelector('[data-contact-thanks]').hidden = false;
});

// Table of contents on service pages: mark the section in view.
const tocLinks = [...document.querySelectorAll('[data-toc-link]')];
if (tocLinks.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.filter((entry) => entry.isIntersecting).forEach((entry) => {
      tocLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-12% 0px -80% 0px' });
  tocLinks.forEach((link) => link.addEventListener('click', () => tocLinks.forEach((other) => other.classList.toggle('is-active', other === link))));
  document.querySelectorAll('[data-toc-section]').forEach((section) => observer.observe(section));
}

// FAQ: answers slide open and closed (native details under reduced motion).
if (!reduceMotion) {
  document.querySelectorAll('[data-faq-item]').forEach((item) => {
    const panel = item.querySelector('[data-faq-panel]');
    item.querySelector('summary').addEventListener('click', (event) => {
      event.preventDefault();
      if (item.dataset.animating) return;
      item.dataset.animating = 'true';
      const done = () => { delete item.dataset.animating; gsap.set(panel, { clearProps: 'height,opacity' }); };
      if (item.open) {
        gsap.to(panel, { height: 0, opacity: 0, duration: 0.4, ease: 'power2.inOut', onComplete: () => { item.open = false; done(); } });
      } else {
        item.open = true;
        gsap.from(panel, { height: 0, opacity: 0, duration: 0.5, ease: 'power2.out', onComplete: done });
      }
    });
  });
}

const motion = gsap.matchMedia();
motion.add('(prefers-reduced-motion: no-preference)', () => {
  // Hero: words rise in one by one, the rest fades up, the doors follow; the § draws itself, the seal turns.
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .fromTo('[data-hero-word]', { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.12 })
    .fromTo('[data-hero-fade]', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 }, 0.15)
    .fromTo('[data-hero-door]', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.12 }, 0.45);
  const sign = document.querySelector('[data-seal-sign]');
  if (sign) gsap.fromTo(sign, { strokeDasharray: 420, strokeDashoffset: 420 }, { strokeDashoffset: 0, duration: 2.4, ease: 'power2.inOut', delay: 0.4 });
  gsap.to('[data-seal-ring]', { rotation: 360, svgOrigin: '80 80', duration: 40, ease: 'none', repeat: -1 });

  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 85%',
    once: true,
    onEnter: (elements) => gsap.fromTo(elements, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }),
  });

  gsap.utils.toArray('[data-monogram-ring]').forEach((ring) => {
    gsap.fromTo(ring, { strokeDasharray: 1000, strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', scrollTrigger: { trigger: ring, start: 'top 85%', once: true } });
  });

  const rules = gsap.utils.toArray('[data-step-rule]');
  if (rules.length) {
    gsap.timeline({ scrollTrigger: { trigger: rules[0], start: 'top 80%', once: true } })
      .from(rules, { scaleX: 0, duration: 0.9, stagger: 0.2, ease: 'power3.inOut' })
      .from('[data-step]', { y: 24, opacity: 0, duration: 0.6, stagger: 0.2 }, 0.2);
  }
});
