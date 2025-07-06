import type { IPagination } from "./response.interface";

/**
 * @interface IConfig
 * @description
 * Rozhraní pro konfiguraci objektu nebo systému.
 *
 * @property {string} syscode - Systémový kód, který je povinný v konfiguraci.
 * @property {string} [restUrl] - URL pro načtení dat ze serveru.
 * @property {string} [modelType] - Typ modelu, se kterým konfigurace pracuje.
 * @property {string} [title] - Libovolný titulek konfigurace.
 * @property {any[][]} [sort] - Pole pro určení řazení dat.
 * @property {IPagination} [pagination] - Stránkovací metadata.
 * @property {Record<string, number>} [projection] - Atributy objektu s hodnotami určujícími viditelnost.
 * @property {Record<string, any>} [factory] - Factory funkce pro generování dat.
 * @property {any} [propName] - Libovolné další vlastnosti konfigurace.
 */
export interface IConfig {
  /**
   * Systemovy kod, v configu je povinny
   *
   * @type {string}
   * @memberof IConfig
   */
  syscode: string;

  /**
   * Url pro nacteni dat ze serveru
   *
   * @type {string}
   * @memberof IConfig
   */
  restUrl?: string;

  /**
   * Typ modelu, se kterym config pracuje
   *
   * @type {string}
   * @memberof IConfig
   */
  modelType?: string;

  /**
   * Libovolny titulek
   *
   * @type {string}
   * @memberof IConfig
   */
  title?: string;

  /**
   * Razeni
   *
   * @type {any[][]}
   * @memberof IConfig
   */
  sort?: any[][];

  /**
   * Strankovani
   *
   * @type {IPagination}
   * @memberof IConfig
   */
  pagination?: IPagination;

  /**
   * Atributy objektu
   *
   * @type {Record<string, number>}
   * @memberof IConfig
   */
  projection?: Record<string, number>;

  /**
   * Factory funkce
   *
   * @type {Record<string, any>}
   * @memberof IConfig
   */
  factory?: Record<string, any>;

  /**
   *
   */
  [propName: string]: any;
}
