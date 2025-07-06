/**
 * Kotrola na absolutni url
 *
 * @export
 * @param {string} url
 * @returns {boolean}
 */
export function IS_ABSOLUTE_URL(url: string): boolean {
  // Regular expression to validate absolute URLs with domain
  const regex =
    /^(?:[a-zA-Z][a-zA-Z\d+\-.]*):\/\/(?:(?:[a-zA-Z\d\-._~%]+(?::[a-zA-Z\d\-._~%]*)?@)?(?:[a-zA-Z\d\-]{1,63}(?:\.[a-zA-Z\d\-]{1,63})+|localhost)(?::\d+)?)(?:\/[^\s]*)?(?:\?[^\s]*)?(?:#[^\s]*)?$/;

  return regex.test(url);
}
