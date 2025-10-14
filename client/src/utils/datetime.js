// Shared date/time formatting utilities
// Always render from ISO strings to ensure consistency across views.

const DEFAULT_LOCALE = undefined; // use browser locale
const DEFAULT_TZ = undefined; // use browser time zone, or set e.g. 'America/Santiago'

export function formatDateTime(iso, opts = {}) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const {
    style = 'card', // 'card' | 'detail'
    locale = DEFAULT_LOCALE,
    timeZone = DEFAULT_TZ,
  } = opts;

  if (style === 'detail') {
    // Example: 13/10/2025, 19:30
    return new Intl.DateTimeFormat(locale, {
      timeZone,
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: false,
    }).format(d);
  }

  // card style: 13 oct • 19:30
  const datePart = new Intl.DateTimeFormat(locale, {
    timeZone,
    day: '2-digit', month: 'short'
  }).format(d);
  const timePart = new Intl.DateTimeFormat(locale, {
    timeZone,
    hour: '2-digit', minute: '2-digit', hour12: false
  }).format(d);
  return `${datePart} • ${timePart}`;
}

export function isSameDay(isoA, isoB, { locale = DEFAULT_LOCALE, timeZone = DEFAULT_TZ } = {}) {
  if (!isoA || !isoB) return false;
  const a = new Date(isoA);
  const b = new Date(isoB);
  if (Number.isNaN(a) || Number.isNaN(b)) return false;
  // Compare by y/m/d in the given time zone
  const parts = (d) => new Intl.DateTimeFormat(locale, { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(d)
    .reduce((acc, p) => (p.type !== 'literal' ? { ...acc, [p.type]: p.value } : acc), {});
  const pa = parts(a);
  const pb = parts(b);
  return pa.year === pb.year && pa.month === pb.month && pa.day === pb.day;
}

export function formatDate(iso, { locale = DEFAULT_LOCALE, timeZone = DEFAULT_TZ } = {}) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat(locale, { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

export function formatTime(iso, { locale = DEFAULT_LOCALE, timeZone = DEFAULT_TZ } = {}) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat(locale, { timeZone, hour: '2-digit', minute: '2-digit', hour12: false }).format(d);
}
