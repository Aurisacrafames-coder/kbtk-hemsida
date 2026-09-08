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

export const SIGNUP_GROUP_CATEGORIES = [
  {
    name: 'Nybörjare 7-10 år',
    forTrialSignup: true,
  },
  {
    name: 'Nybörjare 11-14 år',
    forTrialSignup: true,
  },
  {
    name: 'Parasport 360',
    forTrialSignup: true,
  },
  {
    name: 'Motionärer',
    forTrialSignup: true,
  },
  {
    name: 'Föräldramedlemskap',
    forTrialSignup: false,
  },
  {
    name: 'Övriga spelare',
    forTrialSignup: true,
  },
] as const;

export type SignupGroupCategoryName = (typeof SIGNUP_GROUP_CATEGORIES)[number]['name'];

export const TRIAL_GROUP_OPTIONS = SIGNUP_GROUP_CATEGORIES.filter(
  (category) => category.forTrialSignup,
).map((category) => category.name) as [
  'Nybörjare 7-10 år',
  'Nybörjare 11-14 år',
  'Parasport 360',
  'Motionärer',
  'Övriga spelare',
];

export const MEMBERSHIP_FEE_SEK = 350;

export type TrialGroupFeeInfo = {
  trainingFeeSek: number | null;
  trainingLabel: string;
  trainingNote?: string;
};

/** Avgifter per provträningsgrupp (höst/vår, sept–maj). */
export const TRIAL_GROUP_FEE_INFO: Record<(typeof TRIAL_GROUP_OPTIONS)[number], TrialGroupFeeInfo> = {
  'Nybörjare 7-10 år': { trainingFeeSek: 1300, trainingLabel: 'Pingisskola/Nybörjare' },
  'Nybörjare 11-14 år': { trainingFeeSek: 1300, trainingLabel: 'Pingisskola/Nybörjare' },
  'Parasport 360': {
    trainingFeeSek: null,
    trainingLabel: 'Parasport 360',
    trainingNote:
      'Träningsavgiften bekräftas av klubben efter provträningen.',
  },
  Motionärer: { trainingFeeSek: 1500, trainingLabel: 'Motionsgrupp' },
  'Övriga spelare': {
    trainingFeeSek: null,
    trainingLabel: 'Enligt grupp',
    trainingNote:
      'Träningsavgiften beror på vilken grupp du placeras i (1 500–2 250 kr/säsong, t.ex. Grupp E 1 500 kr, Grupp C/D 1 700 kr). Klubben bekräftar belopp efter provträningen.',
  },
};

export function getTrialMembershipTotal(group: string) {
  const info = TRIAL_GROUP_FEE_INFO[group as (typeof TRIAL_GROUP_OPTIONS)[number]];
  if (!info || info.trainingFeeSek === null) {
    return null;
  }
  return MEMBERSHIP_FEE_SEK + info.trainingFeeSek;
}

/**
 * SBTF-licenser säsongen 2026–2027.
 * Källa: sbtf.se – Licensinformation / åldersbestämmelser 2026–2027.
 * Ålder räknas per säsong: barn 0–11, ungdom 12–20, vuxen 21–64, pensionär 65+.
 */
export const LICENSE_OPTIONS = [
  { value: 'b_barn', label: 'B-licens barn (född 2015 eller senare)', fee: 150 },
  { value: 'b_ungdom', label: 'B-licens ungdom (född 2006–2014)', fee: 150 },
  { value: 'b_vuxen', label: 'B-licens vuxen (född 1963–2005)', fee: 200 },
  { value: 'b_pensionar', label: 'B-licens pensionär (född 1962 eller tidigare)', fee: 200 },
  { value: 'a_barn', label: 'A-licens barn (född 2015 eller senare)', fee: 250 },
  { value: 'a_ungdom', label: 'A-licens ungdom (född 2006–2014)', fee: 450 },
  { value: 'a_vuxen', label: 'A-licens vuxen (född 1963–2005)', fee: 750 },
  { value: 'a_pensionar', label: 'A-licens pensionär (född 1962 eller tidigare)', fee: 500 },
] as const;
