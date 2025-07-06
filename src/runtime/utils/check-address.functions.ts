/**
 * Kontrola zda dana hodnota je postovni smerovaci cislo
 *
 * @export
 * @param {(string | number)} value
 * @returns {*}  {boolean}
 */
export function IS_ZIP(value: string | number): boolean {
  return /^[0-9]{3}[ ]?[0-9]{2}$/.test(value?.toString());
}

/**
 * Kontrola na ulici s cislem popisnym
 *
 * @export
 * @param {string} value
 * @returns {*}  {boolean}
 */
export function IS_STREET_NAME(value: string): boolean {
  return /^[a-zA-Z0-9\s]+ [0-9]+[a-zA-Z]?\/?[0-9]*[a-zA-Z]?$/.test(value);
}

/**
 * Kontrola mesta
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */
export function IS_CITY(value: string): boolean {
  return /^[a-zA-ZÀ-ž\s'-]{2,}$/.test(value.trim());
}
