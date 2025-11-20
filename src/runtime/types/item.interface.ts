/**
 * @interface IItem
 * @description
 * Základní rozhraní pro položku.
 *
 * @property {string} _id - Jedinečný identifikátor položky.
 * @property {any} [propName] - Libovolné další vlastnosti položky.
 */
export interface IItem {
  _id: string;
  [propName: string]: any;
}

/**
 * @interface ITreeItem
 * @extends IItem
 * @description
 * Rozhraní pro položku ve stromové struktuře.
 *
 * @property {string} [parent_syscode] - Syscode přímého rodiče.
 * @property {ITreeItem[]} [children] - Pole potomků.
 * @property {boolean} [active] - Příznak, zda je položka aktivní.
 */
export interface ITreeItem extends IItem {
  parent_syscode?: string;
  children?: ITreeItem[];
  active?: boolean;
}

/**
 * @interface IRef
 * @extends IItem
 * @description
 * Rozhraní pro referenční položku.
 *
 * @property {string} code - Kód referenční položky.
 * @property {string} description - Popis referenční položky.
 */
export interface IRef extends IItem {
  code: string;
  description: string;
}
