export const GUADELOUPE_TIME_ZONE = "America/Guadeloupe";

const calendar = new Intl.DateTimeFormat("en-CA", {
  timeZone: GUADELOUPE_TIME_ZONE,
  year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hourCycle: "h23",
});

export function guadeloupeParts(date: Date) {
  const parts = Object.fromEntries(calendar.formatToParts(date).map(({ type, value }) => [type, value]));
  return { year: Number(parts.year), month: Number(parts.month), day: Number(parts.day), hour: Number(parts.hour) };
}

export function guadeloupeDate(date = new Date()) {
  const { year, month, day } = guadeloupeParts(date);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// La Guadeloupe est à UTC−4 toute l'année, sans changement d'heure.
export function parseGuadeloupeDate(date: string, time: string) {
  return new Date(`${date}T${time}:00-04:00`);
}

export function formatGuadeloupeDate(date: Date) {
  return date.toLocaleDateString("fr-FR", { timeZone: GUADELOUPE_TIME_ZONE, weekday: "long", day: "numeric", month: "long" });
}

// Fêtes légales nationales + abolition de l'esclavage le 27 mai en Guadeloupe.
// Source : https://www.service-public.gouv.fr/particuliers/vosdroits/F2405 (vérifié le 06/11/2026).
export function isGuadeloupeHoliday(year: number, month: number, day: number) {
  const fixed = ["1-1", "5-1", "5-8", "5-27", "7-14", "8-15", "11-1", "11-11", "12-25"];
  if (fixed.includes(`${month}-${day}`)) return true;

  // Calcul grégorien de Pâques ; les calculs UTC ne dépendent pas du navigateur.
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const easterMonth = Math.floor((h + l - 7 * m + 114) / 31);
  const easterDay = (h + l - 7 * m + 114) % 31 + 1;
  const easter = Date.UTC(year, easterMonth - 1, easterDay);
  return [1, 39, 50].some((offset) => {
    const holiday = new Date(easter + offset * 86400000);
    return holiday.getUTCMonth() + 1 === month && holiday.getUTCDate() === day;
  });
}
