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

/** Tävlingar där ungdomar anmäler sig själva (inte via klubbens tävlingsanmälan). */
export const YOUTH_OPEN_COMPETITIONS: YouthOpenCompetition[] = [
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

export function getUpcomingYouthOpenCompetitions(today = todayLocalIso()) {
  return YOUTH_OPEN_COMPETITIONS.filter((item) => item.date >= today).sort((a, b) =>
    a.date.localeCompare(b.date),
  );
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
