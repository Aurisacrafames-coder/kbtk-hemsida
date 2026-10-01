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
    id: 'supersondag-stenungsund-2026-10-18',
    title: 'SuperSöndag',
    date: '2026-10-18',
    place: 'Stenungsunds Arena, Nösnäsvägen 2, Stenungsund',
    audience: 'Alla välkomna (även utan licens)',
    summary:
      'Intern tävling i Stenungsund via elva9. Förmiddag: storpool i divisioner. Eftermiddag: dubbel. Gratis och ej rankinggrundande. Anmäl dig själv via länken.',
    signupUrl: 'https://elva9.se/tournaments/supersondag-2026',
    invitationPdf: '/tavlingar/SuperSondag-2026-inbjudan.pdf',
    feeNote: 'Gratis',
    deadlineNote: 'Anmälan stänger onsdag 14 oktober kl. 21:00',
    highlights: [
      'Förmiddag: storpool (divisioner om 7 med liknande ranking)',
      'Eftermiddag: dubbel i 3-pooler med A- och B-slutspel',
      'Ingen licens krävs',
      '16 bord i Stenungsunds Arena',
    ],
  },
    {
    id: 'lilla-gbg-smashen-2026-11-14',
    title: 'Lilla Göteborgs-Smashen',
    date: '2026-11-14',
    place: 'Exercishuset, Parkgatan 35, Göteborg',
    audience: 'Barn födda 2015–2019 (nybörjare och de som tävlat lite)',
    summary:
      'Barntävling arrangerad av Göteborgs Bordtennisförbund. Anmäl dig själv via länken — avgiften betalas med Swish på plats. Platserna brukar ta slut fort.',
    signupUrl: 'https://forms.gle/7o3yx6guDkxrK5rs7',
    invitationPdf: '/tavlingar/Inbjudan-Gbg-Smashen-14-nov-2026.pdf',
    feeNote: '175 kr, betalas med Swish på tävlingsdagen',
    deadlineNote: 'Anmälan senast fredag 13 november kl. 14.00',
    highlights: [
      'Förmiddag: start 09:00 (anmälan i sekretariatet senast 08:20) — bra för helt nya',
      'Eftermiddag: start 13:00 (anmälan i sekretariatet senast 12:20) — bra om man tävlat lite',
      'Minst B-licens krävs (ordnas via klubben)',
      'Poolspel, minst 3 matcher — alla fär pris',
    ],
  }
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
