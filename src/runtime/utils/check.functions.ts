/**
 * Kontrola, zda dana hodnota obsahuje jenom cislo
 * napr. 0-9
 *
 * @export
 * @param {*} value
 * @returns {boolean}
 */
export function IS_NUMERIC(value: any): boolean {
  // Ensure the value is defined and not a boolean
  if (value === null || typeof value === "boolean") return false;

  // Convert value to string and trim it
  const valueStr = value?.toString().trim();

  // Check if the value is a valid numeric string
  return /^-?\d+(\.\d+)?$/.test(valueStr);
}

/**
 * Kontrola, zda dana hodnota obsahuje jenom abecedu
 * je zohlednena i 1x mezera mezi kazdymi slovy
 * napr. a-z
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */
export function IS_ALPHABET(value: string): boolean {
  // Ensure the value is defined and is a string
  if (typeof value !== "string") return false;

  // Check for empty string
  if (value.trim().length === 0) return false;

  // Validate that the value consists only of alphabetic characters, spaces, and single hyphens
  return /^([A-Za-z\u00C0-\u024F\u1E00-\u1EFF]+(?:\s[A-Za-z\u00C0-\u024F\u1E00-\u1EFF]+)*)$/.test(
    value
  );
}

/**
 * Kontrola, zda je hodnota definovana
 *
 * @export
 * @param {*} value
 * @returns {boolean}
 */
export function IS_DEFINED(value: any): boolean {
  return typeof value !== "undefined" && value !== null;
}

/**
 * Kontrola, zda je hodnota objekt
 *
 * @export
 * @param {*} value
 * @returns {boolean}
 */
export function IS_OBJECT(value: any): boolean {
  return (
    IS_DEFINED(value) && typeof value === "object" && !Array.isArray(value)
  );
}

/**
 * Kontrola, zda se jedna o id
 *
 * @export
 * @param {string} objectid
 * @returns {*}
 */
export function IS_OBJECT_ID(objectid: string) {
  return !objectid ||
    (typeof objectid !== "string" &&
      (typeof objectid !== "object" ||
        Array.isArray(objectid) ||
        typeof objectid !== "function"))
    ? false
    : /^[0-9A-Z]{24}$/i.test(objectid.toString());
}

/**
 * Kontrola, zda zada hodnota je mezi min a max
 *
 * @export
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {boolean}
 */
export function IS_IN_RANGE(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Kontrola, zda se jedna o html tag
 *
 * @export
 * @param {string} value
 * @returns {*}  {boolean}
 */
export function IS_HTML_TAG(value: string): boolean {
  // Ensure the value is a string
  if (typeof value !== "string") return false;

  // Regex to match valid HTML tags, including opening, closing, and self-closing tags
  const tagRegex =
    /^(<(\w+)[^>]*>.*<\/\2>)|^(<(\w+)[^>]*\/>)|^(<br\s*\/?>|<hr\s*\/?>|<input\s*[^>]*>)$/i;

  // Check for well-formed HTML tags only
  return tagRegex.test(value);
}

/**
 * Kontrola, zda se jedna o funkci
 *
 * @export
 * @param {string} value
 * @returns {*}  {boolean}
 */
export function IS_FNCE(value: string): boolean {
  return value && /^(\w+(\.\w+)*)\((\w+(?:,\s*\w+)*)?\)$/.test(value)
    ? true
    : false;
}
