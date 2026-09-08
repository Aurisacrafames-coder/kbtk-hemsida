const checkinBaseUrl =
  import.meta.env.VITE_CHECKIN_URL ?? 'https://kbtk-checkin.vercel.app';

export type HallBookingAvailableDate = {
  date: string;
  weekday: 'friday' | 'saturday' | 'sunday';
  time_slot: string;
  label: string;
  note: string | null;
};

export type HallBookingAvailability = {
  horizon_months: number;
  windows: {
    friday: { start: string; end: string };
    saturday: { start: string; end: string };
    sunday: { start: string; end: string };
  };
  dates: HallBookingAvailableDate[];
};

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

  return {
    horizon_months: data.horizon_months ?? 3,
    windows: data.windows ?? {
      friday: { start: '17:00', end: '21:00' },
      saturday: { start: '13:00', end: '21:00' },
      sunday: { start: '11:00', end: '15:00' },
    },
    dates: Array.isArray(data.dates) ? data.dates : [],
  };
}

export function formatHallBookingOptionLabel(item: HallBookingAvailableDate) {
  const dateLabel = new Intl.DateTimeFormat('sv-SE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date(`${item.date}T12:00:00`));
  return `${dateLabel} · ${item.label}${item.note ? ` (${item.note})` : ''}`;
}
