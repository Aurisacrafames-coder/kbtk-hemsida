const checkinBaseUrl =
  import.meta.env.VITE_CHECKIN_URL ?? 'https://kbtk-checkin.vercel.app';

export type PublicCompetitionSummary = {
  slug: string;
  title: string;
  organizer: string | null;
  event_date: string | null;
  registration_deadline: string | null;
  description: string | null;
  class_count: number;
};

export type PublicCompetitionClass = {
  id: string;
  label: string;
  fee_sek: number;
};

export type PublicCompetition = {
  slug: string;
  title: string;
  organizer: string | null;
  event_date: string | null;
  registration_deadline: string | null;
  description: string | null;
  classes: PublicCompetitionClass[];
};

export async function fetchPublishedCompetitions() {
  const response = await fetch(`${checkinBaseUrl}/api/public/competitions`);
  const data = (await response.json()) as {
    competitions?: PublicCompetitionSummary[];
    error?: string;
  };
  if (!response.ok) {
    throw new Error(data.error ?? 'Kunde inte ladda tävlingar.');
  }
  return data.competitions ?? [];
}

export async function fetchPublishedCompetition(slug: string) {
  const response = await fetch(`${checkinBaseUrl}/api/public/competitions/${encodeURIComponent(slug)}`);
  const data = (await response.json()) as {
    competition?: PublicCompetition;
    error?: string;
  };
  if (!response.ok || !data.competition) {
    throw new Error(data.error ?? 'Tävlingen hittades inte.');
  }
  return data.competition;
}

export function formatCompetitionDate(value: string | null) {
  if (!value) return null;
  return new Date(`${value}T12:00:00`).toLocaleDateString('sv-SE', {
    dateStyle: 'medium',
  });
}
