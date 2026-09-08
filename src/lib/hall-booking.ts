const checkinBaseUrl =
  import.meta.env.VITE_CHECKIN_URL ?? 'https://kbtk-checkin.vercel.app';

export type HallBookingHourRange = {
  start: string;
  end: string;
};

export type HallBookingAvailableDate = {
  date: string;
  weekday: 'friday' | 'saturday' | 'sunday';
  open: HallBookingHourRange;
  available_ranges: HallBookingHourRange[];
  label: string;
  note: string | null;
};

export type HallBookingAvailability = {
  horizon_months: number;
  windows: {
    friday: HallBookingHourRange;
    saturday: HallBookingHourRange;
    sunday: HallBookingHourRange;
  };
  dates: HallBookingAvailableDate[];
};

function parseHour(value: string) {
  const match = /^(\d{1,2}):00$/.exec(value.trim());
  if (!match) return null;
  const hour = Number(match[1]);
  if (!Number.isInteger(hour) || hour < 0 || hour > 24) return null;
  return hour;
}

function formatHour(hour: number) {
  return `${String(hour).padStart(2, '0')}:00`;
}

export async function fetchHallBookingAvailability(): Promise<HallBookingAvailability> {
  const response = await fetch(`${checkinBaseUrl}/api/public/hall-booking`);
  const data = (await response.json().catch(() => ({}))) as {
    error?: string;
    horizon_months?: number;
    windows?: HallBookingAvailability['windows'];
    dates?: HallBookingAvailableDate[];
  };

  if (!response.ok) {
    throw new Error(data.error ?? 'Kunde inte ladda bokningsschema.');
  }

  const dates = Array.isArray(data.dates)
    ? data.dates.filter(
        (item) =>
          item &&
          typeof item.date === 'string' &&
          Array.isArray(item.available_ranges) &&
          item.available_ranges.length > 0,
      )
    : [];

  return {
    horizon_months: data.horizon_months ?? 3,
    windows: data.windows ?? {
      friday: { start: '17:00', end: '21:00' },
      saturday: { start: '13:00', end: '21:00' },
      sunday: { start: '11:00', end: '15:00' },
    },
    dates,
  };
}

export function formatHallBookingDateLabel(item: HallBookingAvailableDate) {
  const dateLabel = new Intl.DateTimeFormat('sv-SE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date(`${item.date}T12:00:00`));
  const ranges = item.available_ranges
    .map((range) => `${range.start}–${range.end}`)
    .join(', ');
  return `${dateLabel} · ledig ${ranges}${item.note ? ` (${item.note})` : ''}`;
}

/** Start hours that can begin a booking inside free ranges. */
export function startHourOptions(item: HallBookingAvailableDate) {
  const hours: number[] = [];
  for (const range of item.available_ranges) {
    const start = parseHour(range.start);
    const end = parseHour(range.end);
    if (start == null || end == null) continue;
    for (let hour = start; hour < end; hour += 1) {
      hours.push(hour);
    }
  }
  return hours.map(formatHour);
}

/** End hours reachable from start within the same contiguous free range. */
export function endHourOptions(item: HallBookingAvailableDate, startTime: string) {
  const startHour = parseHour(startTime);
  if (startHour == null) return [];

  for (const range of item.available_ranges) {
    const rangeStart = parseHour(range.start);
    const rangeEnd = parseHour(range.end);
    if (rangeStart == null || rangeEnd == null) continue;
    if (startHour < rangeStart || startHour >= rangeEnd) continue;

    const ends: string[] = [];
    for (let hour = startHour + 1; hour <= rangeEnd; hour += 1) {
      ends.push(formatHour(hour));
    }
    return ends;
  }

  return [];
}
