/**
 * Normalize a UK phone number to E.164 (+44…). Returns null if it isn't a plausible
 * UK number. Accepts spaces, dashes, parentheses, and +44 / 0044 / 44 / 0 prefixes.
 */
export function normalizeUkPhone(input: string): string | null {
  const cleaned = input.replace(/[\s().-]/g, "");

  let national: string;
  if (cleaned.startsWith("+44")) national = cleaned.slice(3);
  else if (cleaned.startsWith("0044")) national = cleaned.slice(4);
  else if (cleaned.startsWith("44") && cleaned.length >= 11) national = cleaned.slice(2);
  else if (cleaned.startsWith("0")) national = cleaned.slice(1);
  else return null;

  // UK national significant numbers are 9-10 digits; geographic/mobile start 1, 2, 3 or 7.
  if (!/^\d{9,10}$/.test(national)) return null;
  if (!/^[1237]/.test(national)) return null;

  return `+44${national}`;
}
