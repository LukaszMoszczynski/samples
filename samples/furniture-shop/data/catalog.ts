// Example catalogue for the furniture-shop sample. In the finished site this comes from WooCommerce (products,
// attributes for material and colour, variations for fabric, wood and size). Names and prices are placeholders.

export type ArtKind = 'sofa' | 'armchair' | 'table-round' | 'table-long' | 'coffee-table' | 'chair' | 'chair-soft' | 'shelf' | 'sideboard' | 'bed';

// Colours are design-system tokens, so the drawings follow the brand values.
export const colours = {
  len: { name: 'Len naturalny', value: 'var(--palette-secondary-100)' },
  grafit: { name: 'Grafit', value: 'var(--palette-secondary-600)' },
  musztarda: { name: 'Musztarda', value: 'var(--palette-accent-400)' },
  dab: { name: 'Dąb', value: 'var(--palette-primary-400)' },
  orzech: { name: 'Orzech', value: 'var(--palette-primary-600)' },
} as const;
export type ColourId = keyof typeof colours;

export const materials = {
  drewno: 'Lite drewno',
  tkanina: 'Tkanina',
  plecionka: 'Plecionka',
} as const;
export type MaterialId = keyof typeof materials;

export const categories = [
  { id: 'sofy', name: 'Sofy i fotele', art: 'sofa', count: 3, text: 'Głębokie siedziska, zdejmowane pokrowce.' },
  { id: 'stoly', name: 'Stoły', art: 'table-long', count: 3, text: 'Lity dąb i orzech, także rozkładane.' },
  { id: 'krzesla', name: 'Krzesła', art: 'chair', count: 2, text: 'Drewniane i tapicerowane, do kompletu.' },
  { id: 'regaly', name: 'Regały i komody', art: 'shelf', count: 2, text: 'Moduły, które rosną z biblioteczką.' },
  { id: 'lozka', name: 'Łóżka', art: 'bed', count: 2, text: 'Ramy z drewna, wezgłowia z tkaniny.' },
] as const;
export type CategoryId = (typeof categories)[number]['id'];

export interface Product {
  id: string;
  name: string;
  type: string;
  category: CategoryId;
  materials: MaterialId[];
  colour: ColourId;
  price: number;
  art: ArtKind;
  fabric: string;
  wood: string;
  block: 'oak' | 'linen' | 'ochre' | 'stone';
  badge?: string;
  delivery: string;
  text: string;
  page?: boolean;
}

const tone = (colour: ColourId) => colours[colour].value;

export const products: Product[] = [
  { id: 'sofa-fala', name: 'Fala', type: 'Sofa 3-osobowa', category: 'sofy', materials: ['tkanina', 'drewno'], colour: 'len', price: 3490, art: 'sofa', fabric: tone('len'), wood: tone('dab'), block: 'oak', badge: 'Bestseller', delivery: '3–4 tygodnie', text: 'Głęboka sofa z poduchami z pianki i pierza, na nogach z litego dębu. Pokrowce zdejmiesz i wypierzesz.', page: true },
  { id: 'sofa-ostoja', name: 'Ostoja', type: 'Narożnik', category: 'sofy', materials: ['tkanina', 'drewno'], colour: 'grafit', price: 5290, art: 'sofa', fabric: tone('grafit'), wood: tone('orzech'), block: 'stone', delivery: '5–6 tygodni', text: 'Narożnik do dużego salonu: szerokie siedzisko, mocny stelaż z drewna bukowego.' },
  { id: 'fotel-kokon', name: 'Kokon', type: 'Fotel', category: 'sofy', materials: ['tkanina', 'drewno'], colour: 'musztarda', price: 1690, art: 'armchair', fabric: tone('musztarda'), wood: tone('dab'), block: 'linen', badge: 'Nowość', delivery: '2–3 tygodnie', text: 'Fotel z wysokim oparciem, otula jak koc. Dobrze czuje się przy oknie i przy kominku.' },
  { id: 'stol-krag', name: 'Krąg', type: 'Stół okrągły ø 120', category: 'stoly', materials: ['drewno'], colour: 'dab', price: 2790, art: 'table-round', fabric: tone('len'), wood: tone('dab'), block: 'ochre', delivery: '2–3 tygodnie', text: 'Okrągły stół z litego dębu na jednej nodze: przy nim nikt nie trafia kolanem w nogę stołu.' },
  { id: 'stol-biesiada', name: 'Biesiada', type: 'Stół rozkładany 180–260', category: 'stoly', materials: ['drewno'], colour: 'orzech', price: 3990, art: 'table-long', fabric: tone('len'), wood: tone('orzech'), block: 'oak', badge: 'Na wymiar', delivery: '4–5 tygodni', text: 'Stół z orzecha amerykańskiego, rozkłada się do 260 cm. Długość blatu dobierzesz do jadalni.' },
  { id: 'stolik-okrag', name: 'Okrąg', type: 'Stolik kawowy', category: 'stoly', materials: ['drewno'], colour: 'orzech', price: 990, art: 'coffee-table', fabric: tone('len'), wood: tone('orzech'), block: 'linen', delivery: 'od ręki', text: 'Niski stolik z orzecha, z półką na książki i pilota pod blatem.' },
  { id: 'krzeslo-oparcie', name: 'Oparcie', type: 'Krzesło drewniane', category: 'krzesla', materials: ['drewno', 'plecionka'], colour: 'dab', price: 590, art: 'chair', fabric: tone('len'), wood: tone('dab'), block: 'stone', delivery: 'od ręki', text: 'Krzesło z dębu z siedziskiem z plecionki papierowej. Lekkie, a wytrzyma lata.' },
  { id: 'krzeslo-miekkie', name: 'Miękkie', type: 'Krzesło tapicerowane', category: 'krzesla', materials: ['tkanina', 'drewno'], colour: 'musztarda', price: 690, art: 'chair-soft', fabric: tone('musztarda'), wood: tone('orzech'), block: 'oak', delivery: '2–3 tygodnie', text: 'Tapicerowane siedzisko i oparcie, nogi z orzecha. Tkaninę wybierzesz z ośmiu kolorów.' },
  { id: 'regal-polka', name: 'Półka', type: 'Regał modułowy', category: 'regaly', materials: ['drewno'], colour: 'dab', price: 1890, art: 'shelf', fabric: tone('musztarda'), wood: tone('dab'), block: 'linen', delivery: '1–2 tygodnie', text: 'Regał z modułów 60 cm: dokładasz kolejne, kiedy przybywa książek.' },
  { id: 'komoda-niska', name: 'Niska', type: 'Komoda RTV', category: 'regaly', materials: ['drewno'], colour: 'grafit', price: 2190, art: 'sideboard', fabric: tone('len'), wood: tone('grafit'), block: 'ochre', delivery: '3–4 tygodnie', text: 'Niska komoda pod telewizor, fronty z dębu barwionego na grafit, ciche domykanie.' },
  { id: 'lozko-sen', name: 'Sen', type: 'Łóżko tapicerowane 160', category: 'lozka', materials: ['tkanina', 'drewno'], colour: 'len', price: 3290, art: 'bed', fabric: tone('len'), wood: tone('dab'), block: 'stone', delivery: '3–4 tygodnie', text: 'Miękkie wezgłowie, rama z pojemnikiem na pościel, stelaż z listew brzozowych.' },
  { id: 'lozko-rama', name: 'Rama', type: 'Łóżko z litego orzecha 180', category: 'lozka', materials: ['drewno'], colour: 'orzech', price: 4490, art: 'bed', fabric: tone('musztarda'), wood: tone('orzech'), block: 'oak', badge: 'Lite drewno', delivery: '4–6 tygodni', text: 'Łóżko z litego orzecha łączone na czopy, bez metalowych okuć na widoku.' },
];

export const money = (value: number) => `${value.toLocaleString('pl-PL')} zł`;
export const priceCap = 6000;
