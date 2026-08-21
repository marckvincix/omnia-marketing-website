// Logica pura di calcolo periodi/date, senza dipendenze server-only: importabile sia da
// ga4.ts (server) sia dal filtro periodo (client component) per generare le opzioni del menu.

export interface Ga4DateRange {
  startDate: string;
  endDate: string;
}

export interface Ga4ResolvedPeriod {
  current: Ga4DateRange;
  previous: Ga4DateRange;
  /** Testo per "confrontato con ...", es. "7 giorni precedenti", "luglio 2026". */
  comparisonLabel: string;
  /** Testo per il periodo corrente, es. "Oggi", "Ultimi 7 giorni", "Agosto 2026". */
  currentLabel: string;
}

const MONTH_RE = /^\d{4}-\d{2}$/;

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function isoDate(d: Date) {
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
}

function addDays(d: Date, days: number) {
  const r = new Date(d);
  r.setUTCDate(r.getUTCDate() + days);
  return r;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function monthYearLabel(d: Date) {
  return capitalize(new Intl.DateTimeFormat("it-IT", { month: "long", year: "numeric" }).format(d));
}

export function resolvePeriod(period: string): Ga4ResolvedPeriod {
  const today = new Date();
  const todayIso = isoDate(today);

  if (period === "today") {
    const yesterdayIso = isoDate(addDays(today, -1));
    return {
      current: { startDate: todayIso, endDate: todayIso },
      previous: { startDate: yesterdayIso, endDate: yesterdayIso },
      comparisonLabel: "ieri",
      currentLabel: "Oggi",
    };
  }

  if (period === "7d" || period === "15d" || period === "30d") {
    const days = period === "7d" ? 7 : period === "15d" ? 15 : 30;
    const currentStart = isoDate(addDays(today, -(days - 1)));
    const previousEnd = isoDate(addDays(today, -days));
    const previousStart = isoDate(addDays(today, -(days * 2 - 1)));
    return {
      current: { startDate: currentStart, endDate: todayIso },
      previous: { startDate: previousStart, endDate: previousEnd },
      comparisonLabel: `${days} giorni precedenti`,
      currentLabel: `Ultimi ${days} giorni`,
    };
  }

  if (MONTH_RE.test(period)) {
    const [y, m] = period.split("-").map(Number);
    const firstOfMonth = new Date(Date.UTC(y, m - 1, 1));
    const firstOfNextMonth = new Date(Date.UTC(y, m, 1));
    const lastOfMonth = addDays(firstOfNextMonth, -1);
    // Non si supera mai oggi: se il mese selezionato è quello in corso, il periodo si ferma a oggi.
    const endDate = lastOfMonth.getTime() > today.getTime() ? todayIso : isoDate(lastOfMonth);

    const firstOfPrevMonth = new Date(Date.UTC(y, m - 2, 1));
    const lastOfPrevMonth = addDays(firstOfMonth, -1);

    return {
      current: { startDate: isoDate(firstOfMonth), endDate },
      previous: { startDate: isoDate(firstOfPrevMonth), endDate: isoDate(lastOfPrevMonth) },
      comparisonLabel: monthYearLabel(firstOfPrevMonth),
      currentLabel: monthYearLabel(firstOfMonth),
    };
  }

  return resolvePeriod("30d");
}

export interface Ga4PeriodOption {
  value: string;
  label: string;
}

export const GA4_PRESET_OPTIONS: Ga4PeriodOption[] = [
  { value: "today", label: "Oggi" },
  { value: "7d", label: "7 giorni" },
  { value: "15d", label: "15 giorni" },
  { value: "30d", label: "30 giorni" },
];

/** Gli ultimi 12 mesi (mese corrente incluso), dal più recente al più vecchio. */
export function getGa4MonthOptions(): Ga4PeriodOption[] {
  const today = new Date();
  const months: Ga4PeriodOption[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - i, 1));
    const value = `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}`;
    months.push({ value, label: monthYearLabel(d) });
  }
  return months;
}

export function isValidGa4Period(period: string | undefined): period is string {
  if (!period) return false;
  return period === "today" || period === "7d" || period === "15d" || period === "30d" || MONTH_RE.test(period);
}
