// Example content for the cultural centre sample: programme, classes, rooms and news. Written for the brief; names,
// dates, prices and places are placeholders. In production these come from the CMS (Payload collections).

export const centre = {
  name: 'Twój Dom Kultury',
  address: ['ul. Przykładowa 12', '00-000 Miasto'],
  phone: '+48 22 000 00 00',
  email: 'sekretariat@example.com',
  tickets: '+48 22 000 00 01',
};

export const categories = [
  { id: 'koncert', label: 'Koncerty', single: 'Koncert', shape: 'circle', ink: 'blue' },
  { id: 'kino', label: 'Kino', single: 'Klub filmowy', shape: 'frame', ink: 'green' },
  { id: 'wystawa', label: 'Wystawy', single: 'Wystawa', shape: 'arch', ink: 'blue' },
  { id: 'teatr', label: 'Teatr', single: 'Teatr', shape: 'half', ink: 'green' },
  { id: 'dzieci', label: 'Dla dzieci', single: 'Dla dzieci', shape: 'star', ink: 'blue' },
  { id: 'warsztaty', label: 'Warsztaty', single: 'Warsztaty', shape: 'zigzag', ink: 'green' },
];

export const categoryOf = (id) => categories.find((category) => category.id === id);

// Dates are fixed for the sample (the week after 26 November 2026).
export const events = [
  { id: 'jazz-foyer', date: '2026-11-27', time: '19:00', category: 'koncert', title: 'Wieczór jazzowy w foyer', place: 'Foyer', price: '30 zł', ticket: true, text: 'Trio fortepianowe gra standardy przy stolikach. Kawa i herbata z kawiarni na parterze.', access: ['Pętla indukcyjna'] },
  { id: 'teatrzyk-kot', date: '2026-11-28', time: '11:00', category: 'dzieci', title: 'Teatrzyk na dywanie: O kocie, który zgubił buty', place: 'Sala kameralna', price: '15 zł', ticket: true, text: 'Spektakl lalkowy dla dzieci od 3 lat. Siedzimy na poduchach, a po spektaklu można poznać lalki.', access: ['Dla dzieci od 3 lat'] },
  { id: 'klub-filmowy-polnoc', date: '2026-11-28', time: '18:00', category: 'kino', title: 'Klub filmowy: kino z Północy', place: 'Sala widowiskowa', price: '12 zł', ticket: true, text: 'Film z napisami, a po seansie krótka rozmowa z prowadzącą klub. Herbata w przerwie.', access: ['Napisy', 'Pętla indukcyjna'] },
  { id: 'wernisaz-linoryt', date: '2026-11-29', time: '16:00', category: 'wystawa', title: 'Wernisaż: Miasto w linorycie', place: 'Galeria', price: 'Wstęp wolny', ticket: false, text: 'Odbitki uczestników pracowni grafiki: ulice, podwórka i dachy naszego miasta.', access: ['Bez schodów'] },
  { id: 'kartki-linoryt', date: '2026-12-01', time: '17:30', category: 'warsztaty', title: 'Kartki świąteczne techniką linorytu', place: 'Pracownia plastyczna', price: '20 zł', ticket: false, text: 'Dwie godziny, materiały na miejscu, każdy wychodzi z pięcioma kartkami. Zapisy w sekretariacie.', access: ['Od 12 lat'] },
  { id: 'wesele-pokolenia', date: '2026-12-04', time: '19:00', category: 'teatr', title: 'Premiera: Wesele na cztery pokolenia', place: 'Sala widowiskowa', price: '25 zł', ticket: true, text: 'Komedia w wykonaniu naszego teatru amatorskiego: na scenie grają razem nastolatki i seniorzy.', access: ['Pętla indukcyjna', 'Miejsca dla wózków'] },
  { id: 'mikolajki', date: '2026-12-06', time: '12:00', category: 'dzieci', title: 'Mikołajki w domu kultury', place: 'Cały budynek', price: 'Wstęp wolny', ticket: false, text: 'Warsztaty pierniczkowe, zabawy taneczne i spotkanie z Mikołajem. Bez zapisów.', access: ['Bez schodów'] },
  { id: 'kino-seniora', date: '2026-12-10', time: '13:00', category: 'kino', title: 'Kino seniora: komedia z lat 60.', place: 'Sala widowiskowa', price: '8 zł', ticket: true, text: 'Seans w południe, przy jaśniejszym świetle na widowni. Po filmie kawa i rozmowa.', access: ['Napisy', 'Pętla indukcyjna'] },
  { id: 'koledy', date: '2026-12-12', time: '18:00', category: 'koncert', title: 'Kolędy: chór i orkiestra dęta', place: 'Sala widowiskowa', price: 'Wejściówki', ticket: true, text: 'Koncert zespołów domu kultury. Bezpłatne wejściówki do odbioru w kasie od 1 grudnia.', access: ['Pętla indukcyjna', 'Miejsca dla wózków'] },
  { id: 'jarmark', date: '2026-12-13', time: '10:00', category: 'warsztaty', title: 'Jarmark świąteczny i warsztaty rodzinne', place: 'Foyer i pracownie', price: 'Wstęp wolny', ticket: false, text: 'Rękodzieło lokalnych twórców, ozdoby choinkowe do zrobienia na miejscu i ciepła zupa.', access: ['Bez schodów'] },
  { id: 'piosenki-filmowe', date: '2026-12-19', time: '19:00', category: 'koncert', title: 'Koncert świąteczny: piosenki z filmów', place: 'Sala widowiskowa', price: '35 zł', ticket: true, text: 'Studio wokalne i zespół instrumentalny w znanych melodiach z kina familijnego.', access: ['Pętla indukcyjna', 'Miejsca dla wózków'] },
  { id: 'wystawa-zima', date: '2027-01-09', time: '17:00', category: 'wystawa', title: 'Wystawa pracowni plastycznej: Zima', place: 'Galeria', price: 'Wstęp wolny', ticket: false, text: 'Prace dzieci i dorosłych z pracowni plastycznej i ceramiki. Wystawa do 6 lutego.', access: ['Bez schodów'] },
  { id: 'monodram', date: '2027-01-15', time: '19:00', category: 'teatr', title: 'Monodram: Listy z podróży', place: 'Sala kameralna', price: '30 zł', ticket: true, text: 'Jedna aktorka, walizka i listy pisane przez sto lat. Spektakl dla dorosłych, 70 minut.', access: ['Pętla indukcyjna'] },
  { id: 'krotkie-metraze', date: '2027-01-23', time: '18:00', category: 'kino', title: 'Klub filmowy: wieczór krótkich metraży', place: 'Sala kameralna', price: '10 zł', ticket: true, text: 'Sześć krótkich filmów młodych twórców, a potem głosowanie publiczności.', access: ['Napisy'] },
  { id: 'dzien-babci', date: '2027-01-24', time: '16:00', category: 'koncert', title: 'Dla Babci i Dziadka: koncert ogniska muzycznego', place: 'Sala widowiskowa', price: 'Wstęp wolny', ticket: false, text: 'Dzieci z ogniska muzycznego grają i śpiewają dla dziadków. Po koncercie tort.', access: ['Pętla indukcyjna', 'Miejsca dla wózków'] },
];

export const months = [
  { id: '2026-11', label: 'Listopad' },
  { id: '2026-12', label: 'Grudzień' },
  { id: '2027-01', label: 'Styczeń' },
];

export const audiences = [
  { id: 'dzieci', label: 'Dzieci', age: '4–12 lat', shape: 'star', ink: 'blue', lead: 'Ruch, muzyka i plastyka w małych grupach. Pierwsze zajęcia są bezpłatne, żeby dziecko mogło spróbować.' },
  { id: 'mlodziez', label: 'Młodzież', age: '13–18 lat', shape: 'zigzag', ink: 'green', lead: 'Scena, studio i własne projekty. Próby po lekcjach i w soboty, występy kilka razy w roku.' },
  { id: 'dorosli', label: 'Dorośli', age: 'od 18 lat', shape: 'circle', ink: 'blue', lead: 'Zajęcia po pracy: taniec, śpiew, ceramika, fotografia i rozmowy po angielsku.' },
  { id: 'seniorzy', label: 'Seniorzy', age: 'od 60 lat', shape: 'arch', ink: 'green', lead: 'Spokojne tempo, małe grupy i zajęcia przed południem. Wiele zajęć jest bezpłatnych.' },
];

export const classes = [
  { id: 'rytmika', audience: 'dzieci', name: 'Rytmika dla przedszkolaków', age: '4–6 lat', when: 'wtorek 16:30–17:15', room: 'Sala taneczna', lead: 'Pani Ola', price: '90 zł / miesiąc', places: 4 },
  { id: 'balet', audience: 'dzieci', name: 'Balet i taniec klasyczny', age: '6–9 lat', when: 'poniedziałek i środa 17:00–17:45', room: 'Sala taneczna', lead: 'Pani Ewa', price: '140 zł / miesiąc', places: 2 },
  { id: 'mali-artysci', audience: 'dzieci', name: 'Pracownia plastyczna: Mali artyści', age: '7–12 lat', when: 'czwartek 16:00–17:30', room: 'Pracownia plastyczna', lead: 'Pan Marek', price: '110 zł / miesiąc', places: 6 },
  { id: 'ognisko', audience: 'dzieci', name: 'Ognisko muzyczne: pianino i gitara', age: '7–12 lat', when: 'lekcje indywidualne, 30 min w tygodniu', room: 'Sale muzyczne', lead: 'Zespół ogniska', price: '160 zł / miesiąc', places: 0 },
  { id: 'teatrzyk', audience: 'dzieci', name: 'Teatrzyk dziecięcy', age: '8–12 lat', when: 'sobota 10:00–11:30', room: 'Sala kameralna', lead: 'Pani Kasia', price: '90 zł / miesiąc', places: 5 },
  { id: 'hip-hop', audience: 'mlodziez', name: 'Taniec współczesny i hip-hop', age: '13–18 lat', when: 'wtorek i czwartek 18:00–19:30', room: 'Sala taneczna', lead: 'Pan Kuba', price: '120 zł / miesiąc', places: 7 },
  { id: 'studio-wokalne', audience: 'mlodziez', name: 'Studio wokalne', age: '13–18 lat', when: 'środa 17:00–19:00', room: 'Sala kameralna', lead: 'Pani Magda', price: '130 zł / miesiąc', places: 3 },
  { id: 'teatr-mlodziezowy', audience: 'mlodziez', name: 'Teatr młodzieżowy', age: '14–18 lat', when: 'piątek 17:00–19:30', room: 'Sala widowiskowa', lead: 'Pani Kasia', price: 'bezpłatne', places: 6 },
  { id: 'komiks', audience: 'mlodziez', name: 'Komiks i ilustracja cyfrowa', age: '13–18 lat', when: 'poniedziałek 17:00–18:30', room: 'Pracownia komputerowa', lead: 'Pan Marek', price: '100 zł / miesiąc', places: 4 },
  { id: 'zespol-rockowy', audience: 'mlodziez', name: 'Próby zespołów w studiu', age: '15–18 lat', when: 'według grafiku, 2 godziny w tygodniu', room: 'Studio prób', lead: 'Pan Tomek', price: '60 zł / miesiąc', places: 2 },
  { id: 'taniec-towarzyski', audience: 'dorosli', name: 'Taniec towarzyski dla par', age: 'od 18 lat', when: 'środa 19:30–21:00', room: 'Sala taneczna', lead: 'Pani Ewa i Pan Kuba', price: '200 zł / para / miesiąc', places: 3 },
  { id: 'chor', audience: 'dorosli', name: 'Chór mieszany', age: 'od 18 lat', when: 'poniedziałek 18:30–20:30', room: 'Sala kameralna', lead: 'Pani Magda', price: 'bezpłatne', places: 9 },
  { id: 'ceramika', audience: 'dorosli', name: 'Ceramika: toczenie i lepienie', age: 'od 16 lat', when: 'wtorek 18:00–20:30', room: 'Pracownia plastyczna', lead: 'Pani Ania', price: '180 zł / miesiąc', places: 1 },
  { id: 'fotografia', audience: 'dorosli', name: 'Fotografia telefonem i aparatem', age: 'od 16 lat', when: 'czwartek 18:00–19:30', room: 'Sala kameralna', lead: 'Pan Paweł', price: '120 zł / miesiąc', places: 8 },
  { id: 'angielski-rozmowy', audience: 'dorosli', name: 'Angielski: rozmowy przy kawie (B1)', age: 'od 18 lat', when: 'piątek 17:30–19:00', room: 'Klubokawiarnia', lead: 'Pani Joanna', price: '150 zł / miesiąc', places: 5 },
  { id: 'komputer-senior', audience: 'seniorzy', name: 'Komputer i smartfon bez stresu', age: 'od 60 lat', when: 'poniedziałek i środa 10:00–11:30', room: 'Pracownia komputerowa', lead: 'Pan Paweł', price: 'bezpłatne', places: 3 },
  { id: 'gimnastyka-senior', audience: 'seniorzy', name: 'Gimnastyka i taniec w kręgu', age: 'od 60 lat', when: 'wtorek i czwartek 10:00–11:00', room: 'Sala taneczna', lead: 'Pani Ola', price: '40 zł / miesiąc', places: 6 },
  { id: 'angielski-senior', audience: 'seniorzy', name: 'Angielski od podstaw', age: 'od 60 lat', when: 'środa 12:00–13:30', room: 'Sala kameralna', lead: 'Pani Joanna', price: '60 zł / miesiąc', places: 4 },
  { id: 'spiew-senior', audience: 'seniorzy', name: 'Zespół śpiewaczy', age: 'od 60 lat', when: 'piątek 11:00–12:30', room: 'Sala kameralna', lead: 'Pani Magda', price: 'bezpłatne', places: 10 },
  { id: 'rekodzielo-senior', audience: 'seniorzy', name: 'Rękodzieło i klub seniora', age: 'od 60 lat', when: 'czwartek 12:00–14:00', room: 'Pracownia plastyczna', lead: 'Pani Ania', price: 'bezpłatne', places: 5 },
];

export const rooms = [
  { id: 'widowiskowa', name: 'Sala widowiskowa', capacity: '220 miejsc', area: 'scena 10 × 7 m', price: 'od 300 zł / godz.', shape: 'half', ink: 'green', features: ['nagłośnienie i oświetlenie sceniczne', 'projektor i ekran 6 m', 'garderoby za sceną', 'pętla indukcyjna, miejsca dla wózków'], good: 'koncerty, spektakle, gale szkolne, konferencje' },
  { id: 'kameralna', name: 'Sala kameralna', capacity: '60 miejsc', area: '90 m²', price: 'od 120 zł / godz.', shape: 'circle', ink: 'blue', features: ['pianino cyfrowe', 'rzutnik i ekran', 'krzesła lub układ stołów', 'parter, bez schodów'], good: 'spotkania, szkolenia, recitale, zebrania' },
  { id: 'taneczna', name: 'Sala taneczna', capacity: 'do 30 osób', area: '80 m², lustra', price: 'od 80 zł / godz.', shape: 'zigzag', ink: 'green', features: ['parkiet sprężynujący', 'lustra i drążki', 'nagłośnienie z Bluetooth', 'szatnia z prysznicem'], good: 'próby, zajęcia ruchowe, warsztaty taneczne' },
  { id: 'pracownia', name: 'Pracownia plastyczna', capacity: '16 stanowisk', area: '60 m²', price: 'od 90 zł / godz.', shape: 'star', ink: 'blue', features: ['sztalugi i stoły', 'piec ceramiczny (po uzgodnieniu)', 'zlewy i fartuchy', 'dużo dziennego światła'], good: 'warsztaty, urodziny dla dzieci, team building' },
  { id: 'foyer', name: 'Foyer i galeria', capacity: 'do 100 osób', area: '140 m²', price: 'od 150 zł / godz.', shape: 'arch', ink: 'green', features: ['ściany ekspozycyjne z oświetleniem', 'stoliki koktajlowe', 'zaplecze kawiarni', 'wejście bez schodów'], good: 'wernisaże, jarmarki, spotkania autorskie, bankiety' },
];

export const news = [
  { id: 'zapisy-luty', date: '2026-11-24', title: 'Zapisy na zajęcia od lutego ruszają 12 stycznia', text: 'Formularz online będzie otwarty od 8:00. Seniorzy mogą też zapisać się osobiście w sekretariacie, bez kolejki.', tag: 'Zajęcia' },
  { id: 'winda', date: '2026-11-18', title: 'Nowa winda i pętla indukcyjna w sali widowiskowej', text: 'Na wszystkie piętra dojedziesz już windą, a osoby z aparatami słuchowymi usłyszą scenę bez szumów.', tag: 'Dostępność' },
  { id: 'konkurs-plakat', date: '2026-11-10', title: 'Konkurs na plakat „Mój dom kultury”', text: 'Czekamy na prace w trzech grupach wiekowych do 15 grudnia. Zwycięskie plakaty zawisną w foyer.', tag: 'Konkurs' },
];

// Polish dates shown on the page, from ISO dates (no time zone shifts: built from the parts).
const parts = (iso) => iso.split('-').map(Number);
const toDate = (iso) => { const [year, month, day] = parts(iso); return new Date(Date.UTC(year, month - 1, day)); };
export const weekday = (iso) => new Intl.DateTimeFormat('pl-PL', { weekday: 'long', timeZone: 'UTC' }).format(toDate(iso));
export const weekdayShort = (iso) => new Intl.DateTimeFormat('pl-PL', { weekday: 'short', timeZone: 'UTC' }).format(toDate(iso)).replace('.', '');
export const dayMonth = (iso) => new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(toDate(iso));
export const monthShort = (iso) => new Intl.DateTimeFormat('pl-PL', { month: 'short', timeZone: 'UTC' }).format(toDate(iso)).replace('.', '');
export const dayNumber = (iso) => String(parts(iso)[2]);
export const fullDate = (iso) => new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(toDate(iso));
