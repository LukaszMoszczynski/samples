// Example menu written for the sample: dishes, descriptions and prices (zł, VAT included) are placeholders.
import type { Drawing } from '../components/molecules/diner-art/DinerArt.astro';

export interface Category { id: string; name: string; note: string; drawing: Drawing }
export interface Dish {
  id: string; category: string; name: string; text: string; price: number;
  tags?: ('hit' | 'ostre' | 'wege' | 'weekend')[];
}

export const categories: Category[] = [
  { id: 'burgery', name: 'Burgery', note: 'Wołowina 180 g mielona codziennie, bułka maślana z naszego pieca.', drawing: 'burger' },
  { id: 'bbq', name: 'BBQ', note: 'Prosto z wędzarni: 12 godzin na drewnie bukowym i dębowym.', drawing: 'ribs' },
  { id: 'skrzydelka', name: 'Skrzydełka', note: '8 sztuk w koszyku, z selerem naciowym i dipem.', drawing: 'wings' },
  { id: 'dodatki', name: 'Dodatki', note: 'Do burgera, do żeberek albo po prostu do ręki.', drawing: 'fries' },
  { id: 'shakes', name: 'Shake’i', note: 'Gęste, na lodach kręconych na miejscu, z bitą śmietaną.', drawing: 'shake' },
  { id: 'brunch', name: 'Brunch', note: 'Tylko w soboty i niedziele, 9:00–13:00.', drawing: 'pancakes' },
];

export const dishes: Dish[] = [
  { id: 'classic', category: 'burgery', name: 'Classic Cheeseburger', text: 'Wołowina 180 g, cheddar, pikle, cebula, sałata, sos domowy.', price: 36 },
  { id: 'smash', category: 'burgery', name: 'Smash Double', text: 'Dwa cienkie kotlety z chrupiącą skórką, podwójny cheddar, karmelizowana cebula.', price: 42, tags: ['hit'] },
  { id: 'bacon', category: 'burgery', name: 'BBQ Bacon', text: 'Wołowina, boczek z naszej wędzarni, krążek cebulowy, sos BBQ.', price: 44 },
  { id: 'jalapeno', category: 'burgery', name: 'Jalapeño Heat', text: 'Pepper jack, świeże jalapeño, majonez chipotle, sałata.', price: 41, tags: ['ostre'] },
  { id: 'garden', category: 'burgery', name: 'Garden Burger', text: 'Kotlet z buraka i czarnej fasoli, awokado, rukola, majonez ziołowy.', price: 34, tags: ['wege'] },
  { id: 'ribs', category: 'bbq', name: 'Żeberka wieprzowe', text: 'Pół rack, wędzone 12 h, glazura BBQ, coleslaw i ogórki z beczki.', price: 69, tags: ['hit'] },
  { id: 'brisket', category: 'bbq', name: 'Brisket', text: 'Mostek wołowy wędzony 12 h, krojony przy Tobie, pikle, chleb maślany.', price: 74 },
  { id: 'pulled', category: 'bbq', name: 'Pulled pork sandwich', text: 'Szarpana łopatka, coleslaw, sos musztardowy, bułka maślana.', price: 38 },
  { id: 'pitmaster', category: 'bbq', name: 'Talerz pitmastera dla 2', text: 'Żeberka, brisket, pulled pork i trzy dodatki do wyboru.', price: 159 },
  { id: 'buffalo', category: 'skrzydelka', name: 'Buffalo', text: 'Klasyczny ostry sos maślany, dip blue cheese.', price: 32, tags: ['ostre'] },
  { id: 'honey', category: 'skrzydelka', name: 'Honey BBQ', text: 'Miód, nasz sos BBQ, prażony sezam.', price: 32 },
  { id: 'garlic', category: 'skrzydelka', name: 'Garlic Parmesan', text: 'Masło czosnkowe, parmezan, natka pietruszki.', price: 33 },
  { id: 'nashville', category: 'skrzydelka', name: 'Nashville Hot', text: 'Pikantne jak w Tennessee: cayenne, brązowy cukier, pikle.', price: 34, tags: ['ostre'] },
  { id: 'fries', category: 'dodatki', name: 'Frytki ze skórką', text: 'Krojone na miejscu, sól morska, ketchup albo majonez.', price: 12, tags: ['wege'] },
  { id: 'rings', category: 'dodatki', name: 'Krążki cebulowe', text: 'W cieście piwnym, sos ranch.', price: 15, tags: ['wege'] },
  { id: 'mac', category: 'dodatki', name: 'Mac & cheese', text: 'Zapiekany z trzema serami i chrupiącą posypką.', price: 18, tags: ['wege'] },
  { id: 'slaw', category: 'dodatki', name: 'Coleslaw', text: 'Kapusta, marchew, kremowy dressing z jabłkiem.', price: 10, tags: ['wege'] },
  { id: 'corn', category: 'dodatki', name: 'Kukurydza z masłem', text: 'Grillowana kolba, masło z chili i limonką.', price: 14, tags: ['wege'] },
  { id: 'vanilla', category: 'shakes', name: 'Waniliowy', text: 'Lody waniliowe, mleko, bita śmietana, wisienka.', price: 19, tags: ['wege'] },
  { id: 'chocolate', category: 'shakes', name: 'Czekoladowy', text: 'Belgijska czekolada, kakao, wiórki czekoladowe.', price: 19, tags: ['wege'] },
  { id: 'strawberry', category: 'shakes', name: 'Truskawkowy', text: 'Truskawki, lody śmietankowe, sos truskawkowy.', price: 19, tags: ['wege', 'hit'] },
  { id: 'mint', category: 'shakes', name: 'Miętowy z czekoladą', text: 'Lody miętowe, kawałki gorzkiej czekolady.', price: 21, tags: ['wege'] },
  { id: 'stack', category: 'brunch', name: 'Pancakes z syropem klonowym', text: 'Stos trzech puszystych placków, masło, prawdziwy syrop klonowy.', price: 29, tags: ['weekend', 'wege'] },
  { id: 'bacon-stack', category: 'brunch', name: 'Pancakes z boczkiem i jajkiem', text: 'Placki, chrupiący boczek, jajko sadzone, syrop.', price: 34, tags: ['weekend', 'hit'] },
  { id: 'benedict', category: 'brunch', name: 'Jajka po benedyktyńsku', text: 'Muffin, szynka wędzona u nas, jajka w koszulce, sos holenderski.', price: 33, tags: ['weekend'] },
  { id: 'waffles', category: 'brunch', name: 'Chicken & waffles', text: 'Chrupiący kurczak na gofrze, masło miodowe, ostry syrop.', price: 39, tags: ['weekend'] },
];
