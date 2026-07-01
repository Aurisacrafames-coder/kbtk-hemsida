export type PersonalIdValidationResult =
  | { ok: true; normalizedDate: string; normalizedSuffix: string }
  | { ok: false; message: string };

function luhnValid(tenDigits: string) {
  let sum = 0;

  for (let index = 0; index < 9; index += 1) {
    let digit = Number.parseInt(tenDigits[index] ?? '', 10);
    if (index % 2 === 0) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
  }

  const expectedCheckDigit = (10 - (sum % 10)) % 10;
  return expectedCheckDigit === Number.parseInt(tenDigits[9] ?? '', 10);
}

export function validateSwedishPersonalId(
  datePart: string,
  suffixPart: string,
): PersonalIdValidationResult {
  const date = datePart.replace(/\D/g, '');
  const suffix = suffixPart.replace(/\D/g, '');

  if (!/^\d{8}$/.test(date)) {
    return {
      ok: false,
      message: 'Personnumret ska börja med åtta siffror (ååååmmdd).',
    };
  }

  if (!/^\d{4}$/.test(suffix)) {
    return {
      ok: false,
      message: 'De fyra sista siffrorna ska vara exakt fyra siffror.',
    };
  }

  const year = Number.parseInt(date.slice(0, 4), 10);
  const month = Number.parseInt(date.slice(4, 6), 10);
  let day = Number.parseInt(date.slice(6, 8), 10);

  if (month < 1 || month > 12) {
    return { ok: false, message: 'Ogiltigt månadsvärde i personnumret.' };
  }

  if (day > 60) {
    day -= 60;
  }

  if (day < 1 || day > 31) {
    return { ok: false, message: 'Ogiltigt dagsvärde i personnumret.' };
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  if (day > daysInMonth) {
    return { ok: false, message: 'Ogiltigt datum i personnumret.' };
  }

  const tenDigit = `${date.slice(2)}${suffix}`;
  if (!luhnValid(tenDigit)) {
    return {
      ok: false,
      message: 'Personnumret är ogiltigt (kontrollsiffran stämmer inte).',
    };
  }

  return {
    ok: true,
    normalizedDate: date,
    normalizedSuffix: suffix,
  };
}
