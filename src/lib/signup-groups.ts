import { SIGNUP_GROUP_CATEGORIES } from './forms';

const checkinBaseUrl =
  import.meta.env.VITE_CHECKIN_URL ?? 'https://kbtk-checkin.vercel.app';

export type PublicSignupGroup = {
  name: string;
  description: string;
  info: string;
};

export type PublicSignupGroupsFile = {
  groups: PublicSignupGroup[];
};

const defaultDescriptions: Record<string, { description: string; info: string }> = {
  'Nybörjare 7-10 år': {
    description:
      'Pingisskola för yngre barn. Lek, grundteknik och en rolig introduktion till bordtennis.',
    info: '',
  },
  'Nybörjare 11-14 år': {
    description:
      'För dig som är ny eller nästan ny i tonåren. Fokus på grundteknik och spel i lagom gruppstorlek.',
    info: '',
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
  'Föräldramedlemskap': {
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
  (category) => {
    const defaults = defaultDescriptions[category.name] ?? { description: '', info: '' };
    return {
      name: category.name,
      description: defaults.description,
      info: defaults.info,
    };
  },
);

function normalizeSignupGroup(raw: Partial<PublicSignupGroup>): PublicSignupGroup | null {
  if (typeof raw.name !== 'string' || !raw.name.trim()) {
    return null;
  }

  return {
    name: raw.name.trim(),
    description: typeof raw.description === 'string' ? raw.description.trim() : '',
    info: typeof raw.info === 'string' ? raw.info.trim() : '',
  };
}

export function mergeSignupGroups(overrides: PublicSignupGroup[]): PublicSignupGroup[] {
  const overrideByName = new Map(overrides.map((group) => [group.name, group]));

  return DEFAULT_SIGNUP_GROUPS.map((defaults) => {
    const override = overrideByName.get(defaults.name);
    if (!override) {
      return defaults;
    }

    return {
      name: defaults.name,
      description: override.description || defaults.description,
      info: override.info || defaults.info,
    };
  });
}

function parseSignupGroupsFile(data: PublicSignupGroupsFile | PublicSignupGroup): PublicSignupGroup[] {
  const items =
    'groups' in data && Array.isArray(data.groups)
      ? data.groups
      : 'name' in data
        ? [data]
        : [];

  return items
    .map((item) => normalizeSignupGroup(item))
    .filter((item): item is PublicSignupGroup => item !== null);
}

export async function fetchPublicSignupGroups(): Promise<PublicSignupGroup[]> {
  try {
    const response = await fetch(`${checkinBaseUrl}/api/public/signup-groups`);
    if (!response.ok) {
      throw new Error('Kunde inte ladda gruppinformation från check-in');
    }

    const data = (await response.json()) as PublicSignupGroupsFile;
    if (Array.isArray(data.groups)) {
      return mergeSignupGroups(parseSignupGroupsFile(data));
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
    return mergeSignupGroups(parseSignupGroupsFile(data));
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
