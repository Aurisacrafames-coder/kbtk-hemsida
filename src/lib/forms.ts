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
    description:
      'Pingisskola för yngre barn. Lek, grundteknik och en rolig introduktion till bordtennis.',
    forTrialSignup: true,
  },
  {
    name: 'Nybörjare 11-14 år',
    description:
      'För dig som är ny eller nästan ny i tonåren. Fokus på grundteknik och spel i lagom gruppstorlek.',
    forTrialSignup: true,
  },
  {
    name: 'Parasport 360',
    description:
      'Träning för dig med funktionsvariation. Klubben hjälper dig till rätt grupp och upplägg efter provträning.',
    forTrialSignup: true,
  },
  {
    name: 'Motionärer',
    description:
      'Vuxna, motionärer och pensionärer som vill spela regelbundet.',
    forTrialSignup: true,
  },
  {
    name: 'Föräldramedlemskap',
    description:
      'Tilläggsmedlemskap för föräldrar till barn i klubben — 350 kr/säsong utöver barnets avgift, utan egen träningstid.',
    forTrialSignup: false,
  },
  {
    name: 'Övriga spelare',
    description:
      'Om du redan spelat mer eller ska placeras i seriegrupp (t.ex. C–A). Klubben hjälper dig efter provträning.',
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

export function getSignupGroupDescription(name: string): string | undefined {
  return SIGNUP_GROUP_CATEGORIES.find((category) => category.name === name)?.description;
}

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
  'Parasport 360': {
    trainingFeeSek: null,
    trainingLabel: 'Parasport 360',
    trainingNote:
      'Träningsavgiften bekräftas av klubben efter provträningen.',
  },
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
