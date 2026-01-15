export type Rank = {
  id: string;
  label: { en: string; az: string };
  minDays: number;
  color: string;
};

export const RANKS: Rank[] = [
  { id: "weak", label: { en: "Weak Will", az: "Zəif İradə" }, minDays: 0, color: "text-muted-foreground" },
  { id: "awakening", label: { en: "Awakening", az: "Oyanış" }, minDays: 3, color: "text-blue-400" },
  { id: "fighter", label: { en: "Fighter", az: "Mübariz" }, minDays: 7, color: "text-green-500" },
  { id: "warrior", label: { en: "Warrior", az: "Döyüşçü" }, minDays: 14, color: "text-yellow-500" },
  { id: "wolf", label: { en: "Wolf", az: "Qurd" }, minDays: 30, color: "text-orange-500" },
  { id: "commander", label: { en: "Commander", az: "Sərkərdə" }, minDays: 60, color: "text-red-500" },
  { id: "khagan", label: { en: "Khagan", az: "Xaqan" }, minDays: 90, color: "text-purple-500" },
];

export function getRank(days: number): Rank {
  return RANKS.slice().reverse().find(r => days >= r.minDays) || RANKS[0];
}
