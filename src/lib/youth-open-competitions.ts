const checkinBaseUrl =
  import.meta.env.VITE_CHECKIN_URL ?? 'https://kbtk-checkin.vercel.app';

export type YouthOpenCompetition = {
  id: string;
  title: string;
  date: string;
  place: string;
  audience: string;
  summary: string;
  signupUrl: string;
  invitationPdf: string;
  feeNote: string;
  deadlineNote: string;
  highlights: string[];
};

/** Lokal fallback om check-in API:t inte svarar (t.ex. före migration). */
export const YOUTH_OPEN_COMPETITIONS_FALLBACK: YouthOpenCompetition[] = [
  {
    id: 'lilla-gbg-smashen-2026-09-20',
    title: 'Lilla GBG-Smashen',
    date: '2026-09-20',
    place: 'Exercishuset, Parkgatan 35, Göteborg',
    audience: 'Ungdomar födda 2015–2019',
    summary:
      'Barntävling arrangerad av Göteborgs Bordtennisförbund. Anmäl dig själv via länken — avgiften betalas med Swish på plats.',
    signupUrl: 'https://forms.gle/LXiVV7jXvWY7NpgU8',
    invitationPdf: '/tavlingar/Inbjudan-Gbg-Smashen-20-sept-2026.pdf',
    feeNote: '175 kr, betalas med Swish på tävlingsdagen',
    deadlineNote: 'Anmälan senast kl. 18.00 dagen före tävlingen',
    highlights: [
      'Förmiddag: start 09:00 (anmälan i sekretariatet senast 08:20)',
      'Eftermiddag: start 13:00 (anmälan i sekretariatet senast 12:20)',
      'Minst B-licens krävs (ordnas via klubben)',
      'Alla deltagare får pris',
    ],
  },
];

function todayLocalIso() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getUpcomingYouthOpenCompetitions(
  items: YouthOpenCompetition[] = YOUTH_OPEN_COMPETITIONS_FALLBACK,
  today = todayLocalIso(),
) {
  return items
    .filter((item) => item.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function formatYouthCompetitionDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return value;
  }

  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.toLocaleDateString('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function mapApiCompetition(raw: Record<string, unknown>): YouthOpenCompetition | null {
  const id = String(raw.id ?? '').trim();
  const title = String(raw.title ?? '').trim();
  const date = String(raw.date ?? '').trim();
  const signupUrl = String(raw.signupUrl ?? '').trim();
  if (!id || !title || !date || !signupUrl) {
    return null;
  }

  return {
    id,
    title,
    date,
    place: String(raw.place ?? ''),
    audience: String(raw.audience ?? ''),
    summary: String(raw.summary ?? ''),
    signupUrl,
    invitationPdf: String(raw.invitationPdf ?? ''),
    feeNote: String(raw.feeNote ?? ''),
    deadlineNote: String(raw.deadlineNote ?? ''),
    highlights: Array.isArray(raw.highlights)
      ? raw.highlights.map((item) => String(item)).filter(Boolean)
      : [],
  };
}

export async function fetchYouthOpenCompetitions(): Promise<YouthOpenCompetition[]> {
  try {
    const response = await fetch(`${checkinBaseUrl}/api/public/youth-competitions`);
    if (!response.ok) {
      throw new Error('Kunde inte ladda ungdomstävlingar');
    }
    const data = (await response.json()) as { competitions?: unknown };
    if (!Array.isArray(data.competitions)) {
      throw new Error('Ogiltigt svar');
    }
    const mapped = data.competitions
      .map((item) =>
        item && typeof item === 'object'
          ? mapApiCompetition(item as Record<string, unknown>)
          : null,
      )
      .filter((item): item is YouthOpenCompetition => item != null);
    return getUpcomingYouthOpenCompetitions(mapped);
  } catch {
    return getUpcomingYouthOpenCompetitions(YOUTH_OPEN_COMPETITIONS_FALLBACK);
  }
}
