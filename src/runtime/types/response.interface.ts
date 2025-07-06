import type { Http2ServerResponse } from "node:http2";

/**
 * @interface IResponse
 * @description
 * Rozhraní pro standardizovanou odpověď serveru.
 *
 * @property {any} [data] - Data vrácená serverem.
 * @property {IMsg[]} [msgs] - Pole zpráv obsahujících informace o výsledku operace.
 * @property {IPagination} [meta] - Metadata pro stránkování.
 */
export interface IResponse {
  data?: any;
  msgs?: IMsg[];
  meta?: IPagination;
}

/**
 * @interface IMsg
 * @description
 * Rozhraní pro zprávy vrácené serverem.
 *
 * @property {"success" | "error" | "warning" | "info"} type - Typ zprávy.
 * @property {string} message - Text zprávy.
 * @property {Record<string, any>} [options] - Další volitelné možnosti zprávy.
 */
export interface IMsg {
  type: "success" | "error" | "warning" | "info";
  message: string;
  options?: Record<string, any>;
}

/**
 * @interface IPagination
 * @description
 * Rozhraní pro stránkovací metadata.
 *
 * @property {boolean} [enabled] - Určuje, zda je stránkování povoleno.
 * @property {number} [limit] - Počet položek na stránku.
 * @property {number} [page] - Aktuální stránka.
 * @property {number} [total] - Celkový počet položek.
 * @property {number} [table_total] - Celkový počet položek v tabulce.
 * @property {number} [interval] - Interval stránkování.
 * @property {number} [skip] - Počet přeskočených položek.
 */
export interface IPagination {
  enabled?: boolean;
  limit?: number;
  page?: number;
  total?: number;
  table_total?: number;
  interval?: number;
  skip?: number;
}

/**
 * @typedef IHttpMethod
 * @description
 * Typ pro HTTP metody.
 */
export type IHttpMethod = "POST" | "PATCH" | "GET" | "PUT" | "DELETE";
