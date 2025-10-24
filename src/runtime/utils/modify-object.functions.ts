import { IS_DEFINED, IS_OBJECT } from "./check.functions";
import { TRIM } from "./modify-string.functions";

/**
 * Naklonuje dany objekt
 *
 * @export
 * @param {*} item
 * @returns
 */
export function CLONE(item: any): any {
  if (item === null || typeof item !== "object") {
    return item;
  }

  if (Array.isArray(item)) {
    return item.map(CLONE);
  }

  if (item instanceof Date) {
    return new Date(item.getTime());
  }

  if (item instanceof RegExp) {
    return new RegExp(item.source, item.flags);
  }

  if (item instanceof File) {
    return item;
  }

  if (typeof FileList !== "undefined" && item instanceof FileList) {
    return item;
  }

  const clonedObject = {} as any;
  for (const key in item) {
    if (Object.prototype.hasOwnProperty.call(item, key)) {
      clonedObject[key] = CLONE(item[key]);
    }
  }

  return clonedObject;
}

/**
 * Dane pole zamicha
 *
 * @export
 * @param {[any]} value
 */
export function SHUFFLE(value: any[]) {
  for (let i = value.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [value[i], value[j]] = [value[j], value[i]];
  }
}

/**
 * Z daneho pole vybere nahodnou hodnotu
 *
 * @export
 * @param {any[]} value
 * @returns {*}
 */
export function RANDOM(value: any[]): any {
  return value[Math.floor(Math.random() * value.length)];
}

/**
 * Nalezne prunik
 *
 * @export
 * @param {string[]} arr1
 * @param {string[]} arr2
 * @returns {string[]}
 */
export function INTERSECTION(arr1: string[], arr2: string[]): string[] {
  return arr1.filter((value) => arr2.includes(value));
}

/**
 * Nalezne rozdil
 *
 * @export
 * @param {string[]} arr1
 * @param {string[]} arr2
 * @returns {string[]}
 */
export function DIFFERENCE(arr1: string[], arr2: string[]): string[] {
  return arr1
    .filter((element) => !arr2.includes(element))
    .concat(arr2.filter((element) => !arr1.includes(element)));
}

/**
 * Iteruje objekt
 *
 * @export
 * @param {(Record<string, any> | Record<string, any>[])} item
 * @param {(value: any, key: string, index?: number) => void} callback
 */
export function ITERATE(
  item: Record<string, any> | Record<string, any>[],
  callback: (value: any, key: string, index?: number) => void
) {
  if (item && (IS_OBJECT(item) || Array.isArray(item))) {
    let index = 0;
    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        callback((item as any)[key], key, index);
        index++;
      }
    }
  }
}

/**
 * Vrati hodnotu z viceurovnoveho objektu
 * data: {
 *  params: {
 *   fields: {
 *    firstname: 'Jan'
 *   }
 *  }
 * }
 * GET_VALUE(data, 'firstname', 'params#fields', '#')
 *
 * @export
 * @param {Record<string, any>} item
 * @param {string} [name]
 * @param {string} [path]
 * @param {string} [delimiter='.']
 * @returns {*}  {Record<string, any>}
 */
export function GET_VALUE(
  item: Record<string, any>,
  name?: string,
  path?: string,
  delimiter: string = "."
): Record<string, any> | undefined {
  let value;
  if (item) {
    if (path) {
      value = path
        .split(delimiter)
        .reduce((accum, curr) => accum && accum[curr], item);
      if (value && name) {
        value = value[name];
      }
    } else {
      if (name && IS_DEFINED(item[name])) {
        value = item[name];
      }
    }
  }
  return IS_DEFINED(value) && TRIM(value.toString()).length ? value : undefined;
}

/**
 *
 *
 * @export
 * @param {*} item
 * @param {string} [path]
 * @param {string} [delimiter="."]
 * @return {*}  {*}
 */
export function GET_OBJECT_PARAM(
  item: any,
  path?: string,
  delimiter: string = "."
): any {
  return IS_OBJECT(item) ? GET_VALUE(item, "", path, delimiter) : item;
}

/**
 * Mergne dva objekty a vrati jeden
 *
 * @export
 * @param {Record<string, any>} target
 * @param {Record<string, any>} source
 * @returns {*}  {Record<string, any>}
 */
export function MERGE(
  target: Record<string, any>,
  source: Record<string, any>
): Record<string, any> {
  // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
  for (const key of Object.keys(source))
    if (target && source[key] instanceof Object) {
      Object.assign(source[key], MERGE(target[key], source[key]));
    }
  // Join `target` and modified `source`
  Object.assign(target || {}, source);
  return target;
}

/**
 * Transformuje teckovou notaci do objektu
 * napr.
 * {params.firstname:john} => {params:{firstname:john}}
 *
 * @export
 * @param {*} params
 */
export function CONVERT_DOT_TO_OBJECT(params: Record<string, any>) {
  ITERATE(params, (value, key) => {
    if (key.includes(".")) {
      const keys = key.split(".");
      keys.reduce((accum: any, curr: string, index: number) => {
        if (accum) {
          // pokud atribut existuje, jen posune na dalsi uroven
          if (IS_DEFINED(accum[curr])) {
            return accum[curr];
          }
          // jinak pokud neexistuje, ale neni to konecna hodnota, tak vytvori novou uroven
          else if (index < keys.length - 1) {
            return (accum[curr] = {});
          }
          // jinak pokud je to konecna hodnota, tak dosadi finalni hodnotu
          else {
            return (accum[curr] = value);
          }
        }
      }, params);
      delete params[key];
    }
  });
}
