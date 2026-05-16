/**
 * @interface IItem
 * @description
 * Základní rozhraní pro položku.
 *
 * @property {number | string} id - Jedinečný identifikátor položky.
 * @property {any} [propName] - Libovolné další vlastnosti položky.
 */
export interface IItem {
  id: number | string;
  created_at?: string;
  updated_at?: string;
  [propName: string]: any;
}

