// Shared copy for both pages: menu, footer, fonts. Contact details are placeholders.
export const home = `${import.meta.env.BASE_URL}furniture-shop/`;
export const productHref = `${home}produkt/`;
export const fonts = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400;1,9..144,500&family=Figtree:wght@400;500;600;700&display=swap';
export const freeDeliveryFrom = 3000;

export const nav = [
  { text: 'Kolekcja', href: `${home}#kolekcja` },
  { text: 'Na wymiar', href: `${home}#na-wymiar` },
  { text: 'Materiały', href: `${home}#materialy` },
  { text: 'Dostawa i zwroty', href: `${home}#dostawa` },
  { text: 'Salon', href: `${home}#salon` },
];
export const cta = { text: 'Umów wizytę', href: `${home}#salon` };

export const footer = {
  about: 'Sofy, stoły, krzesła, regały i łóżka z litego drewna i naturalnych tkanin. Sklep online i salon z meblami do przetestowania.',
  columns: [
    { title: 'Sklep', links: [{ text: 'Sofy i fotele', href: `${home}#kolekcja` }, { text: 'Stoły i krzesła', href: `${home}#kolekcja` }, { text: 'Regały i komody', href: `${home}#kolekcja` }, { text: 'Łóżka', href: `${home}#kolekcja` }, { text: 'Meble na wymiar', href: `${home}#na-wymiar` }] },
    { title: 'Pomoc', links: [{ text: 'Dostawa i montaż', href: `${home}#dostawa` }, { text: 'Zwroty i gwarancja', href: `${home}#zwroty` }, { text: 'Pielęgnacja mebli', href: `${home}#materialy` }, { text: 'Wizyta w salonie', href: `${home}#salon` }] },
  ],
  contact: { title: 'Salon', lines: ['ul. Przykładowa 8, Warszawa', 'pon.–pt. 10–19, sob. 10–16', '+48 600 000 000', 'salon@example.com'] },
  copyright: '© 2026 Twoje Meble. Przykładowa strona: ceny, terminy i opinie są poglądowe.',
  legal: [{ text: 'Regulamin', href: '#' }, { text: 'Polityka prywatności', href: '#' }],
};
