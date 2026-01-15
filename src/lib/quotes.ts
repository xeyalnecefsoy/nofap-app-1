export type Quote = {
  id: number;
  text: { en: string; az: string };
  author: { en: string; az: string };
};

export const QUOTES: Quote[] = [
  {
    id: 1,
    text: { en: "He who conquers himself is the mightiest warrior.", az: "Özünə qalib gələn ən qüdrətli döyüşçüdür." },
    author: { en: "Confucius", az: "Konfutsi" }
  },
  {
    id: 2,
    text: { en: "Strength does not come from physical capacity. It comes from an indomitable will.", az: "Güc fiziki qabiliyyətdən gəlmir. O, sarsılmaz iradədən gəlir." },
    author: { en: "Mahatma Gandhi", az: "Mahatma Qandi" }
  },
  {
    id: 3,
    text: { en: "Discipline is choosing between what you want now and what you want most.", az: "İntizam, indi istədiyinlə ən çox istədiyin arasında seçim etməkdir." },
    author: { en: "Abraham Lincoln", az: "Avraam Linkoln" }
  },
  {
    id: 4,
    text: { en: "The only easy day was yesterday.", az: "Yeganə asan gün dünən idi." },
    author: { en: "Navy SEALs", az: "ABŞ Dəniz Piyadaları" }
  },
  {
    id: 5,
    text: { en: "Pain is temporary. Quitting lasts forever.", az: "Ağrı müvəqqətidir. Təslim olmaq isə əbədi." },
    author: { en: "Lance Armstrong", az: "Lens Armstronq" }
  },
  {
    id: 6,
    text: { en: "We must all suffer from one of two pains: the pain of discipline or the pain of regret.", az: "İki ağrıdan birini seçməlisən: ya intizam əziyyəti, ya da peşmançılıq acısı." },
    author: { en: "Jim Rohn", az: "Cim Ron" }
  },
  {
    id: 7,
    text: { en: "You are what you do, not what you say you'll do.", az: "Sən dediklərin yox, etdiklərinsən." },
    author: { en: "Carl Jung", az: "Karl Yunq" }
  },
  {
    id: 8,
    text: { en: "Mastering others is strength. Mastering yourself is true power.", az: "Başqalarına qalib gəlmək qüvvədir. Özünə qalib gəlmək isə əsl gücdür." },
    author: { en: "Lao Tzu", az: "Lao Tszi" }
  },
  {
    id: 9,
    text: { en: "Do not pray for an easy life, pray for the strength to endure a difficult one.", az: "Asan həyat üçün dua etmə, çətinliyə dözəcək güc üçün dua et." },
    author: { en: "Bruce Lee", az: "Brus Li" }
  },
  {
    id: 10,
    text: { en: "A man who is a master of patience is master of everything else.", az: "Səbrin ustası olan insan, hər şeyin ustasıdır." },
    author: { en: "George Savile", az: "Corc Savil" }
  }
];

export function getRandomQuote(): Quote {
  // Use day of year to consistenty show same quote for 24h
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  return QUOTES[dayOfYear % QUOTES.length];
}
