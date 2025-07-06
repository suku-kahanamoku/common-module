/**
 * Prevede vsechna pismena na velka
 *
 * @export
 * @param {string} value
 * @returns {*}  {string}
 */
export function CAPITALIZE(value: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    return value;
  }

  const trimmedValue = value.trim();
  return trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1);
}

/**
 * Dany text urizne na danem miste
 *
 * napr.
 * url = 'test.cz/aaa/bbb';
 * url = REMOVE_FIRST_STRING(url, '/');
 * VYSTUP: /aaa/bbb
 *
 * @export
 * @param {string} value
 * @param {string} delimiter
 * @param {boolean} [rmDelitimer=false]
 * @return {*}  {string}
 */
export function REMOVE_FIRST_STRING(
  value: string,
  delimiter: string,
  rmDelitimer: boolean = false
): string {
  let key = value.indexOf(delimiter);
  if (key >= 0) {
    if (rmDelitimer) {
      key += delimiter.length;
    }
    return value.slice(key);
  }
  return value;
}

/**
 * Dany text urizne na danem miste
 *
 * napr.
 * url = 'test.cz/aaa/bbb';
 * url = REMOVE_LAST_STRING(url, '/');
 * VYSTUP: test.cz/aaa
 *
 * @export
 * @param {string} value
 * @param {string} delimiter
 * @returns {string}
 */
export function REMOVE_LAST_STRING(
  value: string,
  delimiter: string,
  rmDelitimer: boolean = false
): string {
  let key = value?.lastIndexOf(delimiter);
  if (key >= 0) {
    !rmDelitimer && key++;
    return value.slice(0, key);
  }
  return value;
}

/**
 * Odstrani od konce bile znaky
 *
 * @export
 * @param {string} value
 * @param {string} [rmValue]
 * @returns {string}
 */
export function RTRIM(value: string, rmValue?: string): string {
  if (value && typeof value === "string") {
    if (!rmValue) {
      rmValue = " ";
    }
    value = value.replace(new RegExp(`[${rmValue}]+$`), "");
  }
  return value;
}

/**
 * Odstrani ze zacatku bile znaky
 *
 * @export
 * @param {string} value
 * @param {string} [rmValue]
 * @returns {string}
 */
export function LTRIM(value: string, rmValue?: string): string {
  if (value && typeof value === "string") {
    if (!rmValue) {
      rmValue = " ";
    }
    value = value.replace(new RegExp(`^[${rmValue}]+`), "");
  }
  return value;
}

/**
 * Odstrani na zacatku a na konci bile znaky
 *
 * @export
 * @param {string} value
 * @param {string} [rmValue=' ']
 * @returns {string}
 */
export function TRIM(value: string, rmValue: string = " "): string {
  return RTRIM(LTRIM(value, rmValue), rmValue);
}

/**
 * Zpracuje marky, tzn. vse co je v ${..}
 * napr. ${appService.auth.token}
 * Naprosto brutalni funkce, tak nesahat!!!
 *
 * @export
 * @param {string} value
 * @param {*} params
 * @returns {string}
 */
export function RESOLVE_MARKS(value: string, params: any): string {
  let result = value;
  if (result && params && typeof result === "string") {
    const matches = result.match(/\${(.*?)}/gi);
    if (matches) {
      matches.forEach((match) => {
        if (match) {
          const replaceValue = match
            .replace(/\${|}/g, "")
            .split(".")
            .reduce((accum, curVal) => {
              if (accum && accum[curVal]) {
                switch (accum[curVal].constructor.name) {
                  case "Date":
                    return accum[curVal].toISOString();
                  case "Function":
                    return accum[curVal]();
                  default:
                    return accum[curVal];
                }
              } else {
                return "";
              }
            }, params);
          // nahradi ${...} za hodnotu
          result = result.replace(
            match,
            Array.isArray(replaceValue) && replaceValue.length
              ? `"${replaceValue.join('","')}"`
              : replaceValue || ""
          );
        }
      });
    }
  }
  return result;
}

/**
 * Vrati mark pro http komunikaci
 *
 * @export
 * @param {string} value
 * @return {*}  {string}
 */
export function GET_MARK(value: string): string {
  return value.includes("?") ? "&" : "?";
}

/**
 * Vrati nejblizsi cislo z daneho rozsahu
 * napr.
 * values = [1, 4, 9, 12]
 * value = 5 => 4
 * value = 7 => 9
 * value = 10 => 9
 *
 * @export
 * @param {number} value
 * @param {number[]} values
 * @return {*}  {(number | undefined)}
 */
export function GET_CLOSEST_NUM(
  value: number,
  values: number[]
): number | undefined {
  if (value && values.length) {
    return values.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
  }
}

/**
 * Vygeneruje qr kod
 *
 * @export
 * @param {string} value
 * @return {*}  {string}
 */
export function GENERATE_QR(value: string): string {
  return `https://barcode.tec-it.com/barcode.ashx?data=${value}&code=MobileQRCode&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=72&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&codepage=Default&qunit=Mm&quiet=0&hidehrt=False&eclevel=L&dmsize=Default`;
}

/**
 * Odstrani diakritiku
 *
 * @export
 * @param {string} inputText
 * @returns {*}
 */
export function REMOVE_DIACRITICS(inputText: string) {
  let r = inputText.toLowerCase();
  r = r.replace(new RegExp(/\s/g), "-");
  r = r.replace(new RegExp(/[àáâãäå]/g), "a");
  r = r.replace(new RegExp(/[æ]/g), "ae");
  r = r.replace(new RegExp(/[çč]/g), "c");
  r = r.replace(new RegExp(/[ď]/g), "d");
  r = r.replace(new RegExp(/[èéêëě]/g), "e");
  r = r.replace(new RegExp(/[ìíîï]/g), "i");
  r = r.replace(new RegExp(/[ĺľ]/g), "l");
  r = r.replace(new RegExp(/[ñň]/g), "n");
  r = r.replace(new RegExp(/[òóôõöő]/g), "o");
  r = r.replace(new RegExp(/[œ]/g), "oe");
  r = r.replace(new RegExp(/[řŕ]/g), "r");
  r = r.replace(new RegExp(/[š]/g), "s");
  r = r.replace(new RegExp(/[ť]/g), "t");
  r = r.replace(new RegExp(/[ůùúûüúű]/g), "u");
  r = r.replace(new RegExp(/[ýÿ]/g), "y");
  r = r.replace(new RegExp(/[ž]/g), "z");
  return r;
}
