// Behaviour and motion for the noir party story (GSAP + ScrollTrigger).
// Content is complete without JS: photos show in CSS greyscale until the canvas grade is ready.
// The grade keeps only red and gold in colour; the lights switch brings every photo back to full colour.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
root.setAttribute('data-motion-ready', '');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- Film grain ------------------------------------------------------------------------------------------------------

const grain = document.querySelector('[data-grain]');
if (grain) {
  const context = grain.getContext('2d');
  grain.width = 160;
  grain.height = 160;
  const drawGrain = () => {
    const frame = context.createImageData(160, 160);
    for (let index = 0; index < frame.data.length; index += 4) {
      const level = Math.random() * 255;
      frame.data[index] = frame.data[index + 1] = frame.data[index + 2] = level;
      frame.data[index + 3] = 255;
    }
    context.putImageData(frame, 0, 0);
  };
  drawGrain();
  if (!reduceMotion) setInterval(drawGrain, 110);
}

// --- Noir grade: crushed blacks, hot whites, only red and gold keep their colour ---------------------------------------

const curve = new Uint8ClampedArray(256);
const sigmoid = (value) => 1 / (1 + Math.exp(-(value - 0.5) * 9));
const low = sigmoid(0);
const high = sigmoid(1);
for (let level = 0; level < 256; level += 1) curve[level] = ((sigmoid(level / 255) - low) / (high - low)) * 255;
const smooth = (edge0, edge1, value) => {
  const step = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return step * step * (3 - 2 * step);
};

function grade(image) {
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  if (!width || image.dataset.graded) return;
  image.dataset.graded = 'true';
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.className = 'ds-panel__noir';
  canvas.setAttribute('aria-hidden', 'true');
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.drawImage(image, 0, 0);
  let pixels;
  try {
    pixels = context.getImageData(0, 0, width, height);
  } catch {
    return; // a tainted canvas: the CSS greyscale stays
  }
  const data = pixels.data;
  for (let index = 0; index < data.length; index += 4) {
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    const max = Math.max(red, green, blue);
    const chroma = max - Math.min(red, green, blue);
    const value = max / 255;
    const saturation = max ? chroma / max : 0;
    let hue = 0;
    if (chroma) {
      if (max === red) hue = 60 * (((green - blue) / chroma) % 6);
      else if (max === green) hue = 60 * ((blue - red) / chroma + 2);
      else hue = 60 * ((red - green) / chroma + 4);
      if (hue < 0) hue += 360;
    }
    const redDistance = Math.min(Math.abs(hue - 357), 360 - Math.abs(hue - 357));
    const keepRed = smooth(16, 6, redDistance) * smooth(0.55, 0.75, saturation) * smooth(0.18, 0.32, value);
    const keepGold = smooth(14, 6, Math.abs(hue - 47)) * smooth(0.6, 0.8, saturation) * smooth(0.5, 0.68, value);
    const keep = Math.max(keepRed, keepGold);
    const luma = 0.299 * red + 0.587 * green + 0.114 * blue;
    const gray = curve[luma | 0];
    if (keep > 0.01) {
      data[index] = gray + (luma + (red - luma) * 1.35 - gray) * keep;
      data[index + 1] = gray + (luma + (green - luma) * 1.35 - gray) * keep;
      data[index + 2] = gray + (luma + (blue - luma) * 1.35 - gray) * keep;
    } else {
      data[index] = data[index + 1] = data[index + 2] = gray;
    }
  }
  context.putImageData(pixels, 0, 0);
  if (image.style.objectPosition) canvas.style.objectPosition = image.style.objectPosition;
  image.after(canvas);
}

document.querySelectorAll('img[data-noir]').forEach((image) => {
  if (image.complete && image.naturalWidth) setTimeout(() => grade(image), 0);
  else image.addEventListener('load', () => grade(image), { once: true });
});

// --- Lights switch ---------------------------------------------------------------------------------------------------

const lights = document.querySelector('[data-lights]');
lights?.addEventListener('click', () => {
  const lit = !root.hasAttribute('data-lit');
  root.toggleAttribute('data-lit', lit);
  lights.setAttribute('aria-pressed', String(lit));
  lights.textContent = lit ? 'Back to the dark' : 'Turn on the lights';
});

// --- Counters in the evidence log ------------------------------------------------------------------------------------

function runCounter(cell) {
  const target = Number(cell.dataset.count);
  const decimals = Number(cell.dataset.decimals || 0);
  const suffix = cell.textContent.replace(/^[\d.]+/, '');
  const state = { value: 0 };
  gsap.to(state, {
    value: target,
    duration: 1.4,
    ease: 'power2.out',
    onUpdate: () => { cell.textContent = `${state.value.toFixed(decimals)}${suffix}`; },
  });
}

// --- Motion ----------------------------------------------------------------------------------------------------------

if (!reduceMotion) {
  // Rain falls without end behind the hero.
  gsap.to('.ds-noir-hero__rain', { backgroundPosition: '-40px 192px, -50px 256px', duration: 0.55, ease: 'none', repeat: -1 });

  // Hero: kicker, then the two title lines slam down, the red one flickers like a bad sign, then lede and switch.
  const [kicker, lineWhite, lineRed, ...rest] = document.querySelectorAll('[data-hero-item]');
  const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
  intro
    .fromTo(kicker, { opacity: 0 }, { opacity: 1, duration: 0.5 })
    .fromTo(lineWhite, { opacity: 0, scale: 1.4 }, { opacity: 1, scale: 1, duration: 0.45 }, '-=0.1')
    .fromTo(lineRed, { opacity: 0, scale: 1.4 }, { opacity: 1, scale: 1, duration: 0.45 }, '+=0.1')
    .to(lineRed, { keyframes: [{ opacity: 0.2, duration: 0.06 }, { opacity: 1, duration: 0.05 }, { opacity: 0.4, duration: 0.08 }, { opacity: 1, duration: 0.06 }] }, '+=0.15')
    .fromTo(rest, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 }, '-=0.35');

  // Panels wipe open from the top like a page turning, then their captions drop in.
  document.querySelectorAll('.ds-panel[data-reveal]').forEach((panel) => {
    const captions = panel.querySelectorAll('[data-cap]');
    const timeline = gsap.timeline({ scrollTrigger: { trigger: panel, start: 'top 85%', once: true } });
    timeline.fromTo(panel, { opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' }, { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power3.inOut' });
    if (captions.length) {
      timeline.fromTo(captions, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.25, ease: 'power2.out' }, '-=0.2');
    }
  });

  // Other blocks rise in; the evidence log counts up as it arrives.
  document.querySelectorAll('[data-reveal]:not(.ds-panel)').forEach((block) => {
    gsap.fromTo(block, { opacity: 0, y: 28 }, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: block, start: 'top 97%', once: true },
      onStart: () => block.querySelectorAll('[data-count]').forEach(runCounter),
    });
  });
}
