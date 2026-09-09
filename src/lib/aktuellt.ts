const checkinBaseUrl =
  import.meta.env.VITE_CHECKIN_URL ?? 'https://kbtk-checkin.vercel.app';

export type AktuelltItem = {
  slug?: string;
  title: string;
  text: string;
  body?: string;
  link?: {
    label: string;
    href: string;
  };
  startDate?: string | null;
  endDate?: string | null;
  isCurrent?: boolean;
};

export function newsArticlePath(slug: string) {
  return `/nyhet/${encodeURIComponent(slug)}`;
}

export async function fetchAktuelltHomepage(): Promise<AktuelltItem[]> {
  const response = await fetch(`${checkinBaseUrl}/api/public/aktuellt`);
  if (!response.ok) {
    throw new Error('Kunde inte ladda aktuellt.');
  }
  const data = (await response.json()) as { items?: AktuelltItem[] };
  return Array.isArray(data.items) ? data.items : [];
}

export async function fetchAktuelltArchive(): Promise<{
  current: AktuelltItem[];
  past: AktuelltItem[];
}> {
  const response = await fetch(`${checkinBaseUrl}/api/public/aktuellt/archive`);
  if (!response.ok) {
    throw new Error('Kunde inte ladda nyheter.');
  }
  const data = (await response.json()) as {
    current?: AktuelltItem[];
    past?: AktuelltItem[];
  };
  return {
    current: Array.isArray(data.current) ? data.current : [],
    past: Array.isArray(data.past) ? data.past : [],
  };
}

export async function fetchAktuelltArticle(slug: string): Promise<AktuelltItem> {
  const response = await fetch(
    `${checkinBaseUrl}/api/public/aktuellt/${encodeURIComponent(slug)}`,
  );
  const data = (await response.json().catch(() => ({}))) as {
    item?: AktuelltItem;
    error?: string;
  };
  if (!response.ok || !data.item) {
    throw new Error(data.error ?? 'Nyheten hittades inte.');
  }
  return data.item;
}

export function formatNewsDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('sv-SE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
