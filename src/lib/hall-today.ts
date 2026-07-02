const checkinBaseUrl =
  import.meta.env.VITE_CHECKIN_URL ?? 'https://kbtk-checkin.vercel.app';

export type PublicHallTodaySession = {
  group_name: string;
  time_label: string;
  active: boolean;
};

export type PublicHallToday = {
  checkins_today: number;
  today_label: string;
  sessions: PublicHallTodaySession[];
  paused_session_count: number;
};

export async function fetchPublicHallToday() {
  const response = await fetch(`${checkinBaseUrl}/api/public/hall-today`);
  const data = (await response.json()) as PublicHallToday & { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? 'Kunde inte ladda hallstatus.');
  }

  return data;
}
