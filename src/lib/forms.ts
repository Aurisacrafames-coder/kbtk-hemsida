const checkinBaseUrl =
  import.meta.env.VITE_CHECKIN_URL ?? 'https://kbtk-checkin.vercel.app';

export const FORM_SLUGS = [
  'borja-spela',
  'licens',
  'tavling',
  'doraccess',
  'boka-hall',
  'kontakt',
] as const;

export type FormSlug = (typeof FORM_SLUGS)[number];

export const FORM_SLUG_LABELS: Record<FormSlug, string> = {
  'borja-spela': 'Börja spela',
  licens: 'Licensanmälan',
  tavling: 'Tävlingsanmälan',
  doraccess: 'Ansök om dörraccess',
  'boka-hall': 'Boka KBTK-hallen',
  kontakt: 'Kontakta oss',
};

export const FORM_SLUG_TYPES: Record<FormSlug, string> = {
  'borja-spela': 'trial_signup',
  licens: 'license',
  tavling: 'competition',
  doraccess: 'door_access',
  'boka-hall': 'hall_booking',
  kontakt: 'contact',
};

export function getFormSlugFromPath(pathname: string): FormSlug | null {
  const match = pathname.match(/^\/form\/([^/]+)\/?$/);
  if (!match) {
    return null;
  }
  const slug = match[1] as FormSlug;
  return FORM_SLUGS.includes(slug) ? slug : null;
}

export type FormRoute =
  | { kind: 'form'; slug: FormSlug }
  | { kind: 'competition-list' }
  | { kind: 'competition'; slug: string };

export function getFormRouteFromPath(pathname: string): FormRoute | null {
  const match = pathname.match(/^\/form\/([^/]+)(?:\/([^/]+))?\/?$/);
  if (!match) {
    return null;
  }

  const [, first, second] = match;
  if (first === 'tavling') {
    if (second) {
      return { kind: 'competition', slug: decodeURIComponent(second) };
    }
    return { kind: 'competition-list' };
  }

  const slug = first as FormSlug;
  if (FORM_SLUGS.includes(slug)) {
    return { kind: 'form', slug };
  }

  return null;
}

export async function submitSiteForm(payload: Record<string, unknown>) {
  const response = await fetch(`${checkinBaseUrl}/api/public/forms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as { ok?: boolean; error?: string };
  if (!response.ok || !data.ok) {
    throw new Error(data.error ?? 'Kunde inte skicka formuläret.');
  }
}

export const TRIAL_GROUP_OPTIONS = [
  'Nybörjare 7-10 år',
  'Nybörjare 11-14 år',
  'Motionärer',
  'Övriga spelare',
] as const;

export const MEMBERSHIP_FEE_SEK = 350;

export type TrialGroupFeeInfo = {
  trainingFeeSek: number | null;
  trainingLabel: string;
  trainingNote?: string;
};

/** Avgifter per provträningsgrupp (höst/vår, sept–maj). */
export const TRIAL_GROUP_FEE_INFO: Record<(typeof TRIAL_GROUP_OPTIONS)[number], TrialGroupFeeInfo> = {
  'Nybörjare 7-10 år': { trainingFeeSek: 1000, trainingLabel: 'Nybörjare' },
  'Nybörjare 11-14 år': { trainingFeeSek: 1000, trainingLabel: 'Nybörjare' },
  Motionärer: { trainingFeeSek: 1150, trainingLabel: 'Motionsgrupp' },
  'Övriga spelare': {
    trainingFeeSek: null,
    trainingLabel: 'Enligt grupp',
    trainingNote:
      'Träningsavgiften beror på vilken grupp du placeras i (1 000–1 800 kr/säsong). Klubben bekräftar belopp efter provträningen.',
  },
};

export function getTrialMembershipTotal(group: string) {
  const info = TRIAL_GROUP_FEE_INFO[group as (typeof TRIAL_GROUP_OPTIONS)[number]];
  if (!info || info.trainingFeeSek === null) {
    return null;
  }
  return MEMBERSHIP_FEE_SEK + info.trainingFeeSek;
}

export const LICENSE_OPTIONS = [
  { value: 'd', label: 'D-licens', fee: 190 },
  { value: 'a_barn', label: 'A-licens barn', fee: 350 },
  { value: 'a_ungdom', label: 'A-licens ungdom', fee: 450 },
  { value: 'a_senior', label: 'A-licens senior', fee: 550 },
  { value: 'pensionar', label: 'A-licens pensionär', fee: 350 },
] as const;

export const HALL_BOOKING_SLOTS = [
  { value: 'fre_16_20', label: 'Fredag 16:00–20:00' },
  { value: 'lor_16_20', label: 'Lördag 16:00–20:00' },
] as const;
