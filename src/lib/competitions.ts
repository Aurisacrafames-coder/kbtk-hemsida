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
  max_classes_per_pass: number | null;
  classes_per_pass_note: string | null;
  classes: PublicCompetitionClass[];
};

export type PublicCompetitionRegistrations = {
  submission_count: number;
  by_class: Array<{
    class_id: string;
    class_label: string;
    count: number;
    names: string[];
  }>;
  entries: Array<{
    submission_id: string;
    name: string;
    classes: { id: string; label: string }[];
    registered_at: string;
  }>;
};

export type PublicCompetitionDetails = {
  competition: PublicCompetition;
  registrations: PublicCompetitionRegistrations;
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
    registrations?: PublicCompetitionRegistrations;
    error?: string;
  };
  if (!response.ok || !data.competition) {
    throw new Error(data.error ?? 'Tävlingen hittades inte.');
  }
  return {
    competition: data.competition,
    registrations: data.registrations ?? {
      submission_count: 0,
      by_class: [],
      entries: [],
    },
  } satisfies PublicCompetitionDetails;
}

export function formatClassesPerPassInfo(competition: {
  max_classes_per_pass?: number | null;
  classes_per_pass_note?: string | null;
}) {
  const parts: string[] = [];

  if (competition.max_classes_per_pass && competition.max_classes_per_pass > 0) {
    parts.push(`Högst ${competition.max_classes_per_pass} klasser per pass.`);
  }

  const note = competition.classes_per_pass_note?.trim();
  if (note) {
    parts.push(note);
  }

  return parts.join(' ');
}

type ClassWithLabel = {
  id?: string;
  label: string;
};

const DEFAULT_PASS_KEY = '__default__';

const WEEKDAY_PATTERNS: { canonical: string; pattern: RegExp }[] = [
  { canonical: 'måndag', pattern: /\bm(?:å|a)ndag\b|\bm(?:å|a)n\b/ },
  { canonical: 'tisdag', pattern: /\btisdag\b|\btis\b/ },
  { canonical: 'onsdag', pattern: /\bonsdag\b|\bons\b/ },
  { canonical: 'torsdag', pattern: /\btorsdag\b|\btor\b/ },
  { canonical: 'fredag', pattern: /\bfredag\b|\bfre\b/ },
  { canonical: 'lördag', pattern: /\bl(?:ö|o)rdag\b|\bl(?:ö|o)r\b/ },
  { canonical: 'söndag', pattern: /\bs(?:ö|o)ndag\b|\bs(?:ö|o)n\b/ },
];

function inferPassKeyFromClassLabel(label: string): string {
  const normalized = label.toLowerCase().trim();
  if (!normalized) {
    return DEFAULT_PASS_KEY;
  }

  const parts: string[] = [];

  const dagMatch = normalized.match(/\bdag\s*(\d+)\b/);
  if (dagMatch) {
    parts.push(`dag ${dagMatch[1]}`);
  }

  const passMatch = normalized.match(/\bpass\s*(\d+)\b/);
  if (passMatch) {
    parts.push(`pass ${passMatch[1]}`);
  }

  for (const { canonical, pattern } of WEEKDAY_PATTERNS) {
    if (pattern.test(normalized)) {
      parts.push(canonical);
      break;
    }
  }

  if (/\bf(?:ö|o)rmiddag\b|\bfm\b|\(fm\)/.test(normalized)) {
    parts.push('förmiddag');
  } else if (/\beftermiddag\b|\bem\b|\(em\)/.test(normalized)) {
    parts.push('eftermiddag');
  }

  const isoDateMatch = normalized.match(/\b(\d{4}-\d{2}-\d{2})\b/);
  if (isoDateMatch) {
    parts.push(isoDateMatch[1]);
  } else {
    const shortDateMatch = normalized.match(/\b(\d{1,2})[./](\d{1,2})\b/);
    if (shortDateMatch) {
      parts.push(`${shortDateMatch[1]}/${shortDateMatch[2]}`);
    }
  }

  if (parts.length === 0) {
    return DEFAULT_PASS_KEY;
  }

  return parts.join('|');
}

function formatPassKeyForDisplay(passKey: string): string {
  if (passKey === DEFAULT_PASS_KEY) {
    return 'pass';
  }

  return passKey.replace(/\|/g, ', ');
}

function countSelectedClassesByPass(classes: ClassWithLabel[]): Map<string, number> {
  const counts = new Map<string, number>();

  for (const item of classes) {
    const passKey = inferPassKeyFromClassLabel(item.label);
    counts.set(passKey, (counts.get(passKey) ?? 0) + 1);
  }

  return counts;
}

export function validateClassesPerPassLimit(
  selectedClasses: ClassWithLabel[],
  maxClassesPerPass: number | null | undefined,
): { ok: true } | { ok: false; message: string } {
  if (!maxClassesPerPass || maxClassesPerPass < 1) {
    return { ok: true };
  }

  const counts = countSelectedClassesByPass(selectedClasses);

  for (const [passKey, count] of counts) {
    if (count > maxClassesPerPass) {
      const passLabel = formatPassKeyForDisplay(passKey);
      const message =
        passKey === DEFAULT_PASS_KEY
          ? `Du får högst ${maxClassesPerPass} klasser per pass.`
          : `Du får högst ${maxClassesPerPass} klasser per ${passLabel}.`;

      return { ok: false, message };
    }
  }

  return { ok: true };
}

export function canSelectCompetitionClass(
  competition: {
    max_classes_per_pass?: number | null;
    classes: ClassWithLabel[];
  },
  selectedClassIds: string[],
  classId: string,
): boolean {
  if (selectedClassIds.includes(classId)) {
    return true;
  }

  const max = competition.max_classes_per_pass;
  if (!max || max < 1) {
    return true;
  }

  const classById = new Map(competition.classes.map((item) => [item.id ?? item.label, item]));
  const targetClass = classById.get(classId);
  if (!targetClass) {
    return false;
  }

  const selectedClasses = selectedClassIds
    .map((id) => classById.get(id))
    .filter(Boolean) as ClassWithLabel[];

  const candidate = [...selectedClasses, targetClass];
  return validateClassesPerPassLimit(candidate, max).ok;
}

export function getCompetitionClassSelectionBlockReason(
  competition: {
    max_classes_per_pass?: number | null;
    classes: ClassWithLabel[];
  },
  selectedClassIds: string[],
  classId: string,
): string | null {
  if (canSelectCompetitionClass(competition, selectedClassIds, classId)) {
    return null;
  }

  const max = competition.max_classes_per_pass;
  if (!max || max < 1) {
    return null;
  }

  const classById = new Map(competition.classes.map((item) => [item.id ?? item.label, item]));
  const targetClass = classById.get(classId);
  if (!targetClass) {
    return null;
  }

  const passKey = inferPassKeyFromClassLabel(targetClass.label);
  const passLabel = formatPassKeyForDisplay(passKey);

  return passKey === DEFAULT_PASS_KEY
    ? `Du har redan valt max ${max} klasser per pass.`
    : `Du har redan valt max ${max} klasser för ${passLabel}.`;
}

export function formatCompetitionDate(value: string | null) {
  if (!value) return null;
  return new Date(`${value}T12:00:00`).toLocaleDateString('sv-SE', {
    dateStyle: 'medium',
  });
}
