export const CLUB_SWISH_NUMBER = '1232603272';

export const CLUB_SWISH_NUMBER_DISPLAY = '123 260 3272';

export function buildSwishMessage(parts: {
  purpose: string;
  name?: string;
  detail?: string;
}) {
  return [parts.purpose, parts.name?.trim(), parts.detail?.trim()]
    .filter((part) => part && part.length > 0)
    .join(' – ');
}

export async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return true;
  }

  return false;
}
