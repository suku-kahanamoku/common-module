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

/**
 * @interface IModel
 * @extends IItem
 * @description
 * Rozhraní pro model položky.
 *
 * @property {boolean} [visible] - Příznak, zda je položka viditelná.
 * @property {boolean} [deleted] - Příznak, zda je položka smazaná.
 * @property {string} last_updated - Datum a čas poslední aktualizace (ve formátu ISO).
 * @property {string} last_updated_by - Identifikátor uživatele, který položku naposledy aktualizoval.
 * @property {string} last_modified - Datum a čas poslední změny (ve formátu ISO).
 * @property {string} last_modified_by - Identifikátor uživatele, který položku naposledy změnil.
 * @property {string} [created_date] - Datum a čas vytvoření položky (ve formátu ISO).
 */
export interface IModel extends IItem {
  visible?: boolean;
  deleted?: boolean;
  last_updated: string;
  last_updated_by: string;
  last_modified: string;
  last_modified_by: string;
  created_date?: string;
}
