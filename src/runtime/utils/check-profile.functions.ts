/**
 * Kontrola na spravnost emailove adresy
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */
export function IS_EMAIL(value: string): boolean {
  // tslint:disable-next-line:max-line-length
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(value);
}

/**
 * Kontrola IC fyzicke osoby
 *
 * @export
 * @param {(string | number)} value
 * @returns {*}  {boolean}
 */
export function IS_TIN(value: string | number): boolean {
  try {
    value = value?.toString();
    let a = 0;
    value = value.length === 7 ? `0${value}` : value;
    if (value.length !== 8) throw 1;
    const b = value.split("");
    let c = 0;
    for (let i = 0; i < 7; i++) a += +b[i] * (8 - i);
    a = a % 11;
    c = 11 - a;
    if (a == 1) c = 0;
    if (a == 0) c = 1;
    if (a == 10) c = 1;
    if (+b[7] != c) throw 1;
  } catch (e) {
    return false;
  }
  return true;
}

/**
 * Kontrola DIC firmy
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */
export function IS_VATID(value: string): boolean {
  try {
    const id = value.substring(0, 2).toUpperCase();
    value = value.substring(2);
    if (value.length < 8 || value.length > 11) throw 1;
    if (id === "CZ") {
      if (value.length === 8) return IS_TIN(value);
      throw 1;
    } else if (id === "SK") {
      if (value.length === 8) return true; // Assuming no specific checksum for SK VAT ID
      throw 1;
    }
    return false; // Invalid country code
  } catch (e) {
    return false;
  }
}

/**
 * Kontrola rodneho cisla
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */
export function IS_PERSON_NUM(value: string | number): boolean {
  value = value.toString().replace("/", ""); // Remove any slashes

  // Check if the value has valid length and consists only of digits
  if (!/^\d{9,10}$/.test(value)) return false;

  const length = value.length;
  const yearPrefix = length === 10 ? 1900 : 2000; // Determine year prefix based on length
  let year = Number.parseInt(value.substr(0, 2), 10);
  const month = Number.parseInt(value.substr(2, 2), 10);
  const day = Number.parseInt(value.substr(4, 2), 10);
  const controlDigit = length === 10 ? Number.parseInt(value[9], 10) : null;

  // Adjust year based on month and prefix
  if (year < 54) {
    year += yearPrefix;
  } else {
    year += 1900;
  }

  // Handle months that need adjustment
  let adjustedMonth = month;
  if (month > 70) {
    adjustedMonth -= 70; // Female numbers
  } else if (month > 50) {
    adjustedMonth -= 50; // Female numbers (pre-1954)
  } else if (month > 20) {
    adjustedMonth -= 20; // Male numbers
  }

  // Validate the date
  const date = new Date(year, adjustedMonth - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== adjustedMonth - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }

  // Validate control digit for 10-digit personal numbers
  if (length === 10) {
    const digits = value.substr(0, 9).split("").map(Number);
    const calculatedControlDigit =
      (digits.reduce((sum, digit, index) => sum + digit * (8 - index), 0) %
        11) %
      10;
    return controlDigit === calculatedControlDigit;
  }

  return true;
}

/**
 * Kontrola jmena
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */
export function IS_NAME(value: string): boolean {
  return (
    /^[A-Za-z\u00C0-\u024F\u1E00-\u1EFF]+([\s\-'][A-Za-z\u00C0-\u024F\u1E00-\u1EFF]+)*$/.test(
      value
    ) && (value || "").length >= 2
  );
}
