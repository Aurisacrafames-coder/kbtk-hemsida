const checkinBaseUrl =
  import.meta.env.VITE_CHECKIN_URL ?? 'https://kbtk-checkin.vercel.app';

export type PublicCheckinCounts = {
  today: number;
  last7Days: number;
  last30Days: number;
  last6Months: number;
};

export async function fetchPublicCheckinStats() {
  const response = await fetch(`${checkinBaseUrl}/api/public/checkin-stats`);
  const data = (await response.json()) as {
    counts?: PublicCheckinCounts;
    error?: string;
  };

  if (!response.ok || !data.counts) {
    throw new Error(data.error ?? 'Kunde inte ladda incheckningsstatistik.');
  }

  return data.counts;
}
