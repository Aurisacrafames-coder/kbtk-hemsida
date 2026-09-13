import { SIGNUP_GROUP_CATEGORIES } from './forms';

const checkinBaseUrl =
  import.meta.env.VITE_CHECKIN_URL ?? 'https://kbtk-checkin.vercel.app';

export type PublicSignupGroup = {
  name: string;
  description: string;
  info: string;
  forTrialSignup: boolean;
  sortOrder: number;
};

export type PublicSignupGroupsFile = {
  groups: Array<Partial<PublicSignupGroup> & { name?: string }>;
};

const defaultDescriptions: Record<string, { description: string; info: string }> = {
  'Nybörjare 7-10 år': {
    description:
      'Pingisskola för yngre barn. Lek, grundteknik och en rolig introduktion till bordtennis. Rack och bollar finns att låna. Glöm inte träningskläder, inneskor och vattenflaska.',
    info: 'Lördagar 10.00 - 11.00. Föräldrar är med som hjälptränare/ledare.',
  },
  'Nybörjare 11-14 år': {
    description:
      'För dig som är ny och kanske spelat en del i skolan. Fokus på grundteknik och spel i lagom gruppstorlek. Rack och bollar finns att låna. Glöm inte träningskläder, inneskor och vattenflaska.',
    info: 'Lördagar 10.00 - 11.00. Föräldrar är med som hjälptränare/ledare.',
  },
  'Parasport 360': {
    description:
      'Träning för dig med funktionsvariation. Klubben hjälper dig till rätt grupp och upplägg efter provträning.',
    info: '',
  },
  Motionärer: {
    description: 'Vuxna, motionärer och pensionärer som vill spela regelbundet.',
    info: '',
  },
  Föräldramedlemskap: {
    description:
      'Tilläggsmedlemskap för föräldrar till barn i klubben — 350 kr/säsong utöver barnets avgift, utan egen träningstid.',
    info: '',
  },
  'Övriga spelare': {
    description:
      'Om du redan spelat mer eller ska placeras i seriegrupp (t.ex. C–A). Klubben hjälper dig efter provträning.',
    info: '',
  },
};

export const DEFAULT_SIGNUP_GROUPS: PublicSignupGroup[] = SIGNUP_GROUP_CATEGORIES.map(
  (category, index) => {
    const defaults = defaultDescriptions[category.name] ?? { description: '', info: '' };
    return {
      name: category.name,
      description: defaults.description,
      info: defaults.info,
      forTrialSignup: category.forTrialSignup,
      sortOrder: (index + 1) * 10,
    };
  },
);

function normalizeSignupGroup(
  raw: Partial<PublicSignupGroup>,
  index: number,
): PublicSignupGroup | null {
  if (typeof raw.name !== 'string' || !raw.name.trim()) {
    return null;
  }

  const name = raw.name.trim();
  const defaults = DEFAULT_SIGNUP_GROUPS.find((group) => group.name === name);

  return {
    name,
    description:
      typeof raw.description === 'string' && raw.description.trim()
        ? raw.description.trim()
        : (defaults?.description ?? ''),
    info:
      typeof raw.info === 'string' && raw.info.trim()
        ? raw.info.trim()
        : (defaults?.info ?? ''),
    forTrialSignup:
      typeof raw.forTrialSignup === 'boolean'
        ? raw.forTrialSignup
        : (defaults?.forTrialSignup ?? true),
    sortOrder:
      typeof raw.sortOrder === 'number' && Number.isFinite(raw.sortOrder)
        ? raw.sortOrder
        : (defaults?.sortOrder ?? (index + 1) * 10),
  };
}

/** Prefer check-in order and fields when present; fall back to local defaults. */
export function resolveSignupGroups(overrides: PublicSignupGroup[]): PublicSignupGroup[] {
  if (overrides.length === 0) {
    return DEFAULT_SIGNUP_GROUPS;
  }

  return [...overrides].sort(
    (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, 'sv'),
  );
}

function parseSignupGroupsFile(
  data: PublicSignupGroupsFile | PublicSignupGroup,
): PublicSignupGroup[] {
  const items =
    'groups' in data && Array.isArray(data.groups)
      ? data.groups
      : 'name' in data
        ? [data]
        : [];

  return items
    .map((item, index) => normalizeSignupGroup(item, index))
    .filter((item): item is PublicSignupGroup => item !== null);
}

export async function fetchPublicSignupGroups(): Promise<PublicSignupGroup[]> {
  try {
    const response = await fetch(`${checkinBaseUrl}/api/public/signup-groups`);
    if (!response.ok) {
      throw new Error('Kunde inte ladda gruppinformation från check-in');
    }

    const data = (await response.json()) as PublicSignupGroupsFile;
    if (Array.isArray(data.groups) && data.groups.length > 0) {
      return resolveSignupGroups(parseSignupGroupsFile(data));
    }
  } catch {
    // Fallback till lokal fil om check-in inte svarar.
  }

  try {
    const response = await fetch('/signup-groups.json');
    if (!response.ok) {
      throw new Error('Kunde inte ladda signup-groups.json');
    }

    const data = (await response.json()) as PublicSignupGroupsFile | PublicSignupGroup;
    return resolveSignupGroups(parseSignupGroupsFile(data));
  } catch {
    return DEFAULT_SIGNUP_GROUPS;
  }
}

export function getSignupGroupByName(
  groups: PublicSignupGroup[],
  name: string,
): PublicSignupGroup | undefined {
  return groups.find((group) => group.name === name);
}

export function getTrialSignupGroups(groups: PublicSignupGroup[]): PublicSignupGroup[] {
  return groups.filter((group) => group.forTrialSignup);
}
