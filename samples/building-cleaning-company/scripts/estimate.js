// Estimator demo: an illustrative monthly cost range from a few facts about the property. Used by the page at build
// time (the starting result is in the HTML) and in the browser (osiedle.js). The rates are example values, not a
// price list; nothing is sent anywhere.

export const BUILDING_TYPES = [
  { key: 'blok', label: 'Blok mieszkalny', factor: 1 },
  { key: 'kamienica', label: 'Kamienica', factor: 1.15 },
  { key: 'apartamentowiec', label: 'Apartamentowiec z garażem', factor: 1.25 },
];

export const FREQUENCIES = [
  { key: '1', label: '1× w tygodniu', visits: 1 },
  { key: '2', label: '2× w tygodniu', visits: 2 },
  { key: '3', label: '3× w tygodniu', visits: 3 },
  { key: '5', label: 'Codziennie (pn–pt)', visits: 5 },
];

export const SERVICES = [
  { key: 'stairs', label: 'Sprzątanie klatek', locked: true },
  { key: 'windows', label: 'Mycie okien i elewacji' },
  { key: 'green', label: 'Tereny zielone' },
  { key: 'snow', label: 'Odśnieżanie' },
  { key: 'bins', label: 'Wiaty śmietnikowe' },
  { key: 'repair', label: 'Drobne naprawy' },
  { key: 'spray', label: 'Dezynfekcja' },
];

export const DEFAULTS = { type: 'blok', staircases: 8, floors: 5, green: 3000, frequency: '1', services: ['stairs', 'windows', 'green'] };

const WEEKS_PER_MONTH = 4.33;
const roundTo = (value, step) => Math.round(value / step) * step;

export function estimate({ type, staircases, floors, green, frequency, services }) {
  const factor = BUILDING_TYPES.find((item) => item.key === type)?.factor ?? 1;
  const visits = FREQUENCIES.find((item) => item.key === frequency)?.visits ?? 1;
  const chosen = new Set(services);
  const lines = [];
  const add = (key, amount) => { if (chosen.has(key) || key === 'stairs') lines.push({ key, label: SERVICES.find((item) => item.key === key).label, amount: roundTo(amount, 10) }); };
  add('stairs', staircases * (30 + floors * 6) * visits * WEEKS_PER_MONTH * factor);
  add('windows', staircases * (40 + floors * 8) * factor);
  add('green', green * 0.32);
  add('snow', green * 0.1 + staircases * 20);
  add('bins', staircases * 28);
  add('repair', staircases * 45 * factor);
  add('spray', staircases * floors * 4);
  const total = lines.reduce((sum, line) => sum + line.amount, 0);
  return { lines, low: roundTo(total * 0.9, 50), high: roundTo(total * 1.12, 50) };
}

export const formatZl = (amount) => `${amount.toLocaleString('pl-PL', { useGrouping: true })} zł`;
