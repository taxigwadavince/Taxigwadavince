// Règles de saisie partagées par les formulaires (navigateur) et par /api/reservation (serveur).
import { guadeloupeDate } from "./guadeloupe-time";

// Réservations et estimations acceptées jusqu'à un an à l'avance.
const MAX_DAYS_AHEAD = 365;

export const LIMITS = { name: 80, phone: 20, email: 120, flight: 40, note: 800, place: 120 };

export function dateBounds(now = new Date()) {
  return { min: guadeloupeDate(now), max: guadeloupeDate(new Date(now.getTime() + MAX_DAYS_AHEAD * 86400000)) };
}

const DATE_RE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

// Année sur 4 chiffres et jour réel du calendrier (rejette 2026-02-31).
export function isValidDate(v: string) {
  if (!DATE_RE.test(v)) return false;
  const [y, m, d] = v.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

export const isValidTime = (v: string) => TIME_RE.test(v);

export function dateError(v: string, now = new Date()): string | null {
  if (!v) return "Indiquez la date.";
  if (!isValidDate(v)) return "Date invalide : jour, mois et année sur 4 chiffres.";
  const { min, max } = dateBounds(now);
  if (v < min) return "Cette date est déjà passée.";
  if (v > max) return "Choisissez une date dans les 12 prochains mois.";
  return null;
}

// Téléphone : un + facultatif en tête, chiffres, espaces, points, tirets, parenthèses ; de 9 à 15 chiffres (norme E.164).
export const sanitizePhone = (v: string) => v.replace(/[^\d+\s().-]/g, "").replace(/(?!^)\+/g, "").slice(0, LIMITS.phone);

export function isValidPhone(v: string) {
  const t = v.trim();
  const digits = t.replace(/\D/g, "").length;
  return /^\+?[\d\s().-]+$/.test(t) && digits >= 9 && digits <= 15;
}

export const isValidEmail = (v: string) => v.trim().length <= LIMITS.email && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

// Au moins deux lettres (accents compris) : refuse « 12 » ou « -- ».
export function isValidName(v: string) {
  const t = v.trim();
  return t.length >= 2 && t.length <= LIMITS.name && (t.match(/\p{L}/gu)?.length ?? 0) >= 2;
}

export function clampInt(v: unknown, min: number, max: number, fallback: number) {
  const n = typeof v === "number" ? v : Number.parseInt(String(v ?? ""), 10);
  return Number.isInteger(n) ? Math.min(max, Math.max(min, n)) : fallback;
}

// Paramètres d'adresse (liens partagés, estimateur vers réservation) : on ignore ce qui n'est pas valable.
export const paramDate = (v: string | null) => (v && !dateError(v) ? v : "");
export const paramTime = (v: string | null, fallback = "") => (v && isValidTime(v) ? v : fallback);
