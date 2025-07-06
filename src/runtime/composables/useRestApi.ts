import { useRequestHeaders } from "#imports";

import {
  RTRIM,
  RESOLVE_MARKS,
  GET_MARK,
  REMOVE_LAST_STRING,
} from "../utils/modify-string.functions";
import { CLONE, ITERATE, MERGE } from "../utils/modify-object.functions";
import type { IPagination, IResponse } from "../types/response.interface";

/**
 * Odesílá HTTP požadavek na zadanou URL s volitelnými možnostmi.
 *
 * @export
 * @param {string} url - Cílová URL.
 * @param {Record<string, any>} [options] - Volitelné možnosti požadavku.
 * @returns {Promise<IResponse | undefined>} Odpověď serveru nebo `undefined`.
 *
 * @example
 * const response = await useApi("https://example.com/api/items", {
 *   method: "GET",
 *   cache: false,
 * });
 */
export async function useApi(
  url: string,
  options?: Record<string, any>
): Promise<IResponse | undefined> {
  if (url) {
    options = options || {};
    // Přidání cookies do hlaviček, pokud není zakázáno
    if (options.cookie !== false) {
      MERGE(options, { headers: useRequestHeaders(["cookie"]) as HeadersInit });
    }
    // Zakázání cachování, pokud je nastaveno
    if (options.cache === false) {
      options.headers["Cache-Control"] = "no-store, no-cache, must-revalidate";
    }
    // Odeslání požadavku s nahrazením escapovaných znaků
    return await $fetch(url.replaceAll("+", "%2B"), options);
  }
}

/**
 * Zpracovává URL a nahrazuje markery (např. `${}`) a další speciální znaky.
 *
 * @export
 * @param {string} url - Cílová URL.
 * @param {any} [cmp] - Kontextová data pro nahrazení markerů.
 * @returns {string} Upravená URL.
 *
 * @example
 * const url = useUrl("/test/${id}/", { id: 123 });
 * console.log(url); // "/test/123"
 */
export function useUrl(url: string, cmp?: any): string {
  return RTRIM(
    RESOLVE_MARKS(
      decodeURIComponent(url).replace("self", cmp?.route.path),
      cmp
    ),
    "/"
  ).replaceAll("#", "%23");
}

/**
 * Sestavuje kompletní URL s parametry řazení, stránkování a projekce.
 *
 * @export
 * @param {string} url - Základní URL.
 * @param {any} [cmp] - Kontextová data pro sestavení URL.
 * @returns {string} Kompletní URL.
 *
 * @example
 * const url = useCompleteUrl("/api/items", {
 *   config: {
 *     sort: [["name", "asc"]],
 *     pagination: { page: 2, limit: 10 },
 *     projection: { name: 1, age: 1 },
 *   },
 * });
 * console.log(url);
 * // "/api/items?sort=%5B%5B%22name%22%2C%22asc%22%5D%5D&limit=10&skip=10&projection=%7B%22name%22%3A1%2C%22age%22%3A1%7D"
 */
export function useCompleteUrl(url: string, cmp?: any): string {
  let result = useUrl(url, cmp);
  result = useSortUrl(result, cmp?.config?.sort);
  result = useLimitUrl(result, cmp?.config?.pagination);
  result = useProjection(result, cmp?.config?.projection);
  return result;
}

/**
 * Přidává parametry řazení do URL.
 *
 * @export
 * @param {string} url - Základní URL.
 * @param {any[][]} [sort] - Parametry řazení.
 * @returns {string} Upravená URL s parametry řazení.
 *
 * @example
 * const url = useSortUrl("/api/items", [["name", "asc"]]);
 * console.log(url); // "/api/items?sort=%5B%5B%22name%22%2C%22asc%22%5D%5D"
 */
export function useSortUrl(url: string, sort?: any[][]): string {
  if (sort?.length) {
    return url + `${GET_MARK(url)}sort=${JSON.stringify(sort)}`;
  } else {
    return url;
  }
}

/**
 * Přidává parametry stránkování do URL.
 *
 * @export
 * @param {string} url - Základní URL.
 * @param {IPagination} [pagination] - Parametry stránkování.
 * @returns {string} Upravená URL s parametry stránkování.
 *
 * @example
 * const url = useLimitUrl("/api/items", { page: 2, limit: 10 });
 * console.log(url); // "/api/items?limit=10&skip=10"
 */
export function useLimitUrl(url: string, pagination?: IPagination): string {
  if (pagination) {
    const skip = ((pagination.page || 1) - 1) * (pagination.limit || 0);
    return url + `${GET_MARK(url)}limit=${pagination.limit || 50}&skip=${skip}`;
  } else {
    return url;
  }
}

/**
 * Přidává parametry projekce do URL.
 *
 * @export
 * @param {string} url - Základní URL.
 * @param {Record<string, number>} [projection] - Parametry projekce.
 * @returns {string} Upravená URL s parametry projekce.
 *
 * @example
 * const url = useProjection("/api/items", { name: 1, age: 1 });
 * console.log(url); // "/api/items?projection=%7B%22name%22%3A1%2C%22age%22%3A1%7D"
 */
export function useProjection(
  url: string,
  projection?: Record<string, number>
): string {
  if (projection) {
    return url + `${GET_MARK(url)}projection=${JSON.stringify(projection)}`;
  } else {
    return url;
  }
}

/**
 * Přidává parametry factory do URL.
 *
 * @export
 * @param {string} url - Základní URL.
 * @param {any} [factory] - Parametry factory.
 * @param {string} [path] - Cesta pro relativní odkazy.
 * @returns {string} Upravená URL s parametry factory.
 *
 * @example
 * const url = useFactory("/api/items", { url: "../relative/path" }, "/current/path");
 * console.log(url); // "/api/items?factory=%7B%22url%22%3A%22%2Fcurrent%2Frelative%2Fpath%22%7D"
 */
export function useFactory(url: string, factory?: any, path?: string): string {
  if (!factory) return url;

  factory = CLONE(factory);

  const processRelativePaths = (value: string, currentPath: string): string => {
    let tmpPath = RTRIM(currentPath, "/");

    // Rozdělení cesty na segmenty a iterace
    const segments = value.split("/");
    for (const segment of segments) {
      if (segment === "..") {
        tmpPath = REMOVE_LAST_STRING(tmpPath, "/", true); // Posun o úroveň výše
      } else if (segment !== ".") {
        tmpPath = `${tmpPath}/${segment}`; // Přidání segmentu
      }
    }

    return RTRIM(tmpPath, "/");
  };

  ITERATE(factory, (value, name) => {
    if (name === "url" || name.includes("|url")) {
      if (value.startsWith("../")) {
        factory[name] = processRelativePaths(value, path || "");
      } else if (value.charAt(0) !== "/") {
        // Přidání relativní cesty
        factory[name] = `${RTRIM(path || "", "/")}/${value}`;
      }
    }
  });

  return url + `${GET_MARK(url)}factory=${JSON.stringify(factory)}`;
}
