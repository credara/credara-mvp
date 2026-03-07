import { parsePhoneNumber } from "libphonenumber-js";

const DEFAULT_COUNTRY = "NG";

export function normalizePhone(value: string, country: string = DEFAULT_COUNTRY): string {
  const parsed = parsePhoneNumber(value, country as "NG");
  if (!parsed?.isValid()) throw new Error("Invalid phone number");
  return parsed.format("E.164");
}

export function isValidPhone(value: string, country: string = DEFAULT_COUNTRY): boolean {
  try {
    const phone = parsePhoneNumber(value, country as "NG");
    return phone?.isValid() ?? false;
  } catch {
    return false;
  }
}
