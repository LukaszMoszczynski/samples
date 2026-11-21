// The offer for both audiences, used by the home page (grouped topics) and the two audience pages.
// Example content written for the brief. Hrefs are relative to the sample's base.
export const AUDIENCES = {
  firmy: {
    page: 'dla-firm/',
    label: 'Dla firm',
    title: 'Obsługa prawna firm',
    question: 'Prowadzisz firmę?',
    lead: 'Bezpieczne umowy, sprawnie prowadzone spory i stała opieka prawna. Jeden prawnik prowadzący, odpowiedź w ciągu dnia roboczego.',
    cta: 'Przejdź do oferty dla firm',
    services: [
      { name: 'Umowy handlowe', line: 'Przygotowanie, przegląd i negocjacje umów z kontrahentami.', href: 'umowy-handlowe/' },
      { name: 'Spory i windykacja', line: 'Od wezwania do zapłaty po reprezentację przed sądem.', href: 'dla-firm/#kontakt' },
      { name: 'Stała obsługa prawna', line: 'Abonament: jeden opiekun i odpowiedź w 24 godziny.', href: 'dla-firm/#kontakt' },
      { name: 'RODO i compliance', line: 'Polityki, rejestry i audyty dopasowane do firmy.', href: 'dla-firm/#kontakt' },
      { name: 'Prawo pracy', line: 'Umowy, regulaminy, spory z pracownikami.', href: 'dla-firm/#kontakt' },
      { name: 'Zakładanie i zmiany spółek', line: 'Rejestracja, umowy spółek, przekształcenia.', href: 'dla-firm/#kontakt' },
    ],
    box: { title: 'Opiekun Twojej firmy', text: 'Jeden prawnik prowadzący i odpowiedź w ciągu jednego dnia roboczego.', contact: 'firmy@example.com · +48 600 000 001', cta: 'Zapytaj o obsługę firmy' },
    steps: [
      { title: 'Krótki opis sprawy', text: 'Piszesz albo dzwonisz; w ciągu dnia oddzwania prawnik od Twojej branży.' },
      { title: 'Plan i wycena', text: 'Dostajesz zakres, termin i ryczałt albo abonament na piśmie.' },
      { title: 'Stała opieka', text: 'Umowy, pytania i spory prowadzi jedna osoba, która zna Twoją firmę.' },
    ],
    faq: [
      { question: 'Ile kosztuje stała obsługa firmy?', answer: 'Abonament zależy od liczby spraw w miesiącu; zaczyna się od kilku godzin pracy i zawsze jest ustalony z góry.' },
      { question: 'Czy możecie sprawdzić umowę od kontrahenta?', answer: 'Tak. Dostajesz wersję ze zmianami i komentarzem, które zapisy są ryzykowne i co zaproponować w zamian.' },
      { question: 'Czy reprezentujecie firmy w sądzie?', answer: 'Tak, w sporach gospodarczych w całej Polsce, także w postępowaniach elektronicznych.' },
    ],
  },
  klienci: {
    page: 'dla-ciebie/',
    label: 'Dla Ciebie',
    title: 'Sprawy prywatne i rodzinne',
    question: 'Masz sprawę prywatną?',
    lead: 'Rozwód, spadek, mieszkanie czy odszkodowanie: tłumaczymy, co możesz zrobić, i prowadzimy sprawę spokojnie, krok po kroku.',
    cta: 'Przejdź do oferty dla Ciebie',
    services: [
      { name: 'Rozwód i alimenty', line: 'Spokojnie, z dbałością o dzieci i majątek.', href: 'dla-ciebie/#kontakt' },
      { name: 'Spadki i testamenty', line: 'Stwierdzenie nabycia, dział spadku, zachowek.', href: 'dla-ciebie/#kontakt' },
      { name: 'Nieruchomości', line: 'Zakup mieszkania, umowy deweloperskie, najem.', href: 'dla-ciebie/#kontakt' },
      { name: 'Odszkodowania', line: 'Wypadki, błędy medyczne, spory z ubezpieczycielem.', href: 'dla-ciebie/#kontakt' },
      { name: 'Prawa konsumenta', line: 'Reklamacje, umowy z bankami i operatorami.', href: 'dla-ciebie/#kontakt' },
      { name: 'Sprawy karne', line: 'Obrona i pomoc pokrzywdzonym.', href: 'dla-ciebie/#kontakt' },
    ],
    box: { title: 'Pierwsza rozmowa: 15 minut bez opłat', text: 'Opowiesz o sprawie, a my powiemy, czy i jak możemy pomóc, zanim cokolwiek zapłacisz.', contact: 'porady@example.com · +48 600 000 002', cta: 'Umów bezpłatną rozmowę' },
    steps: [
      { title: 'Bezpłatna rozmowa', text: '15 minut przez telefon lub online: mówisz, co się stało, my mówimy, co dalej.' },
      { title: 'Jasny koszt', text: 'Zanim zaczniemy, dostajesz wycenę na piśmie, bez ukrytych opłat.' },
      { title: 'Prowadzimy sprawę', text: 'Informujemy o każdym kroku; Ty nie musisz znać przepisów.' },
    ],
    faq: [
      { question: 'Czy pierwsza rozmowa naprawdę nic nie kosztuje?', answer: 'Tak, pierwsze 15 minut jest bezpłatne. Jeśli zdecydujesz się na dalszą pomoc, dostaniesz wycenę na piśmie.' },
      { question: 'Czy mogę załatwić sprawę bez przychodzenia do biura?', answer: 'Tak. Rozmawiamy online lub telefonicznie, a dokumenty podpisujesz elektronicznie.' },
      { question: 'Ile trwa sprawa spadkowa?', answer: 'Notarialne poświadczenie dziedziczenia to zwykle jedna wizyta; sprawa w sądzie trwa najczęściej kilka miesięcy.' },
    ],
  },
};
