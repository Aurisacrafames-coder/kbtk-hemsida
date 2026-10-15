const checkinBaseUrl =
  import.meta.env.VITE_CHECKIN_URL ?? 'https://kbtk-checkin.vercel.app';

export type JerseyNumberAssignment = {
  number: string;
  owner: string;
};

/**
 * Historisk namnlista som fallback tills check-in returnerar `assigned`.
 * Lediga nummer från API:t filtreras bort så listan inte motsäger check-in.
 */
const FALLBACK_JERSEY_ASSIGNMENTS: JerseyNumberAssignment[] = [
  { number: '01', owner: 'L Nilsson' },
  { number: '02', owner: 'PA' },
  { number: '03', owner: 'C Stadler' },
  { number: '04', owner: 'J Boquist' },
  { number: '06', owner: 'Hansson' },
  { number: '07', owner: 'T Andersson' },
  { number: '08', owner: 'Poljak' },
  { number: '09', owner: 'L Sjöström' },
  { number: '10', owner: 'Amir' },
  { number: '11', owner: 'T Skyman' },
  { number: '12', owner: 'Mårdby' },
  { number: '13', owner: 'Harry Hillberg' },
  { number: '14', owner: 'Ellen Olsson' },
  { number: '15', owner: 'W Lundgren' },
  { number: '24', owner: 'Nellie Rempling' },
  { number: '29', owner: 'Joar Oskarsson' },
  { number: '31', owner: 'Colin Åberg' },
  { number: '16', owner: 'L Bengtsson' },
  { number: '17', owner: 'Lundell' },
  { number: '18', owner: 'LUNDHOLM' },
  { number: '19', owner: 'RELFSON' },
  { number: '20', owner: 'A Andersson' },
  { number: '21', owner: 'Rolf P' },
  { number: '22', owner: 'S Rönnblom' },
  { number: '23', owner: 'Jonte' },
  { number: '26', owner: 'S. Ali Mahamoud' },
  { number: '28', owner: 'S Blanck' },
  { number: '30', owner: 'F Edvardsson' },
  { number: '32', owner: 'H Ragnarsson' },
  { number: '33', owner: 'Henriksson' },
  { number: '34', owner: 'L Palm' },
  { number: '36', owner: 'O Palm' },
  { number: '37', owner: 'Ängbacken' },
  { number: '38', owner: 'F E Fuxin' },
  { number: '39', owner: 'F Fuxin' },
  { number: '40', owner: 'H Ekeroth' },
  { number: '41', owner: 'Njal' },
  { number: '42', owner: 'Kalle' },
  { number: '43', owner: 'H Udd' },
  { number: '44', owner: 'Gerdes' },
  { number: '45', owner: 'M Väljemark' },
  { number: '46', owner: 'Leo Julin' },
  { number: '47', owner: 'O Stark' },
  { number: '50', owner: 'Movitz' },
  { number: '60', owner: 'Göthager' },
  { number: '61', owner: 'Malin H' },
  { number: '64', owner: 'Isac Jigmyr' },
  { number: '66', owner: 'Magnus' },
  { number: '67', owner: 'S Larsson' },
  { number: '69', owner: 'C Sjöberg' },
  { number: '70', owner: 'Valdemar' },
  { number: '72', owner: 'A Mentor' },
  { number: '73', owner: 'Gad' },
  { number: '74', owner: 'Sallander' },
  { number: '75', owner: 'J Boden' },
  { number: '77', owner: 'A Gabriel' },
  { number: '78', owner: 'Tobbe L' },
  { number: '80', owner: 'Udd' },
  { number: '82', owner: 'Mäntylä' },
  { number: '86', owner: 'L Gustafsson' },
  { number: '87', owner: 'Tobias G' },
  { number: '88', owner: 'R Wen' },
  { number: '89', owner: 'J Dahlqvist' },
  { number: '90', owner: 'A Grankvist' },
  { number: '93', owner: 'A Hendel' },
  { number: '94', owner: 'Rasmus' },
  { number: '95', owner: 'S Babic' },
  { number: '96', owner: 'Albin Rempling' },
  { number: '97', owner: 'Hansson' },
  { number: '98', owner: 'L Lundell' },
  { number: '99', owner: 'M Nordfelt' },
  { number: '103', owner: 'Jägerbom' },
];

export type PublicAssignedJerseyNumber = {
  number: number;
  holder_name: string;
};

export type PublicJerseyNumbers = {
  available: number[];
  assigned: PublicAssignedJerseyNumber[];
  min: number;
  max: number;
};

const DEFAULT_JERSEY_RANGE = { min: 1, max: 100 } as const;

export function formatJerseyNumber(number: number): string {
  if (number >= 0 && number <= 9) {
    return String(number).padStart(2, '0');
  }
  return String(number);
}

function normalizeAssigned(
  value: unknown,
): PublicAssignedJerseyNumber[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const row = item as Record<string, unknown>;
      const number = Number(row.number);
      const holder_name = String(row.holder_name ?? row.owner ?? '').trim();
      if (!Number.isInteger(number) || number < 0 || !holder_name) return null;
      return { number, holder_name };
    })
    .filter((row): row is PublicAssignedJerseyNumber => row != null);
}

function normalizeAvailable(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => Number(item))
    .filter((number) => Number.isInteger(number) && number >= 0);
}

/**
 * Namnlista för “Vem har vilket nummer?”.
 * Check-in `assigned` vinner; fallback fyller i övriga upptagna nummer.
 * Lediga nummer från API:t visas aldrig här.
 */
export function buildTakenJerseyAssignments(
  jerseyNumbers: PublicJerseyNumbers,
): JerseyNumberAssignment[] {
  const available = new Set(jerseyNumbers.available);
  const byNumber = new Map<number, string>();

  for (const row of FALLBACK_JERSEY_ASSIGNMENTS) {
    const number = Number.parseInt(row.number, 10);
    if (!Number.isInteger(number) || available.has(number)) continue;
    byNumber.set(number, row.owner);
  }

  for (const row of jerseyNumbers.assigned) {
    if (available.has(row.number)) continue;
    byNumber.set(row.number, row.holder_name);
  }

  return [...byNumber.entries()]
    .map(([number, owner]) => ({
      number: formatJerseyNumber(number),
      owner,
    }))
    .sort((a, b) => Number.parseInt(a.number, 10) - Number.parseInt(b.number, 10));
}

export async function fetchPublicJerseyNumbers(): Promise<PublicJerseyNumbers> {
  const response = await fetch(`${checkinBaseUrl}/api/public/jersey-numbers`);
  const data = (await response.json().catch(() => ({}))) as {
    available?: unknown;
    assigned?: unknown;
    min?: unknown;
    max?: unknown;
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error ?? 'Kunde inte ladda tröjnummer.');
  }

  const available = normalizeAvailable(data.available);
  const assigned = normalizeAssigned(data.assigned);
  const min =
    typeof data.min === 'number' && Number.isInteger(data.min)
      ? data.min
      : DEFAULT_JERSEY_RANGE.min;
  const max =
    typeof data.max === 'number' && Number.isInteger(data.max)
      ? data.max
      : DEFAULT_JERSEY_RANGE.max;

  return { available, assigned, min, max };
}

export const CLUB_CLOTHES_EMAIL = 'sten-inge@xlntreklam.se';

export const EQUIPMENT_LINKS = [
  {
    name: 'Stiga Sports',
    href: 'https://www.stigasports.com/sv',
    note: '30% rabattkod: INKOP_KUÄV_74574',
  },
  {
    name: 'CHTT',
    href: 'https://chtt.se/',
    note: 'Bra för att köpa kinesisk utrustning.',
  },
  {
    name: 'Wookie Sports',
    href: 'https://wookiesports.se/bordtennis/',
  },
  {
    name: 'TTEX',
    href: 'https://www.ttex.se/',
  },
  {
    name: 'Sydsport',
    href: 'https://www.sydsport.com/bordtennis/',
  },
] as const;
