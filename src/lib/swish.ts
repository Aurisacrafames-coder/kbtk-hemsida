export const CLUB_SWISH_NUMBER = '1232603272';

export const CLUB_SWISH_NUMBER_DISPLAY = '123 260 3272';

export const SWISH_MESSAGE_MAX_LENGTH = 50;

const SEPARATOR = ' – ';

function joinParts(parts: string[]) {
  return parts
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .join(SEPARATOR);
}

function trimToMax(text: string, max: number) {
  if (text.length <= max) return text;

  const sliced = text.slice(0, max);
  const lastSeparator = sliced.lastIndexOf(SEPARATOR);
  if (lastSeparator >= Math.floor(max * 0.5)) {
    return sliced.slice(0, lastSeparator).trimEnd();
  }

  const lastSpace = sliced.lastIndexOf(' ');
  if (lastSpace >= Math.floor(max * 0.6)) {
    return sliced.slice(0, lastSpace).trimEnd();
  }

  return sliced.trimEnd();
}

function shortenCommaSeparatedDetail(detail: string) {
  const parts = detail
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length <= 1) {
    return detail;
  }

  let combined = parts[0];
  for (let index = 1; index < parts.length; index += 1) {
    const candidate = `${combined}, ${parts[index]}`;
    if (candidate.length > 28) {
      return combined.endsWith(' m.fl.') ? combined : `${combined} m.fl.`;
    }
    combined = candidate;
  }

  return combined;
}

export function buildSwishMessage(parts: {
  purpose: string;
  name?: string;
  detail?: string;
}) {
  const purpose = parts.purpose.trim();
  const name = parts.name?.trim() ?? '';
  let detail = parts.detail?.trim() ?? '';

  if (detail.includes(',')) {
    detail = shortenCommaSeparatedDetail(detail);
  }

  const variants = [
    joinParts([purpose, name, detail]),
    joinParts([purpose, name]),
    joinParts([name, purpose]),
    name,
    purpose,
  ];

  for (const variant of variants) {
    if (variant.length <= SWISH_MESSAGE_MAX_LENGTH) {
      return variant;
    }
  }

  return trimToMax(joinParts([purpose, name, detail]), SWISH_MESSAGE_MAX_LENGTH);
}

export async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return true;
  }

  return false;
}
