import { ref, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { useRoute, navigateTo, useUrl } from "#imports";

import { CLONE, GET_MARK, ITERATE } from "../utils";
import type { IPagination, IConfig } from "../types";

/**
 * @function useNavigable
 * @description
 * Poskytuje funkce pro navigaci a manipulaci s URL na základě změn konfigurace.
 *
 * @returns {Object} Objekt obsahující funkce pro navigaci.
 *
 * @example
 * const { navigate, onPageChange, onLimitChange, onSort } = useNavigable();
 * navigate(config);
 * onPageChange(config, 2);
 * onLimitChange(config, 20);
 * onSort(config, [["name", "asc"]]);
 */
export function useNavigable() {
  const route = useRoute();
  const _queue = ref();

  /**
   * Přidá požadavek do fronty pro zpracování.
   *
   * @param {...any} params - Parametry pro navigaci.
   *
   * @example
   * navigate(config);
   */
  function navigate(...params: any) {
    _queue.value = params;
  }

  /**
   * Změní URL bez přidání do historie.
   *
   * @param {IConfig} config - Konfigurace navigace.
   * @param {Record<string, any>} [params] - Další parametry.
   *
   * @example
   * await _navigate(config, { additionalParam: "value" });
   */
  async function _navigate(config: IConfig, params?: IConfig): Promise<void> {
    if (config?.syscode) {
      const configParams = CLONE(params) || {};
      configParams.sort = config.sort;
      configParams.cols = config.cols;
      configParams.displayFields = config.displayFields;
      configParams.panel = config.panel;
      configParams.tab = config.tab;
      configParams.fix = config.fix;
      configParams.model = config.model;

      const query = _generateQueryParams(
        config.syscode,
        config.pagination || {},
        configParams
      );

      await navigateTo(`${useUrl("self", { route })}?${query}`, {
        replace: true,
      });
    }
  }

  /**
   * Změní stránkování a naviguje.
   *
   * @param {IConfig} config - Konfigurace navigace.
   * @param {number} value - Nová stránka.
   *
   * @example
   * onPageChange(config, 2);
   */
  function onPageChange(config: IConfig, value: number) {
    if (config?.syscode) {
      const pagination = config.pagination || {};
      pagination.page = value;
      navigate(config);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  /**
   * Změní počet položek na stránku a naviguje.
   *
   * @param {IConfig} config - Konfigurace navigace.
   * @param {number} value - Počet položek na stránku.
   *
   * @example
   * onLimitChange(config, 20);
   */
  function onLimitChange(config: IConfig, value: number) {
    if (config?.syscode) {
      const pagination = config.pagination || {};
      pagination.limit = value;
      pagination.page = 1;
      navigate(config);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  /**
   * Změní řazení a naviguje.
   *
   * @param {IConfig} config - Konfigurace navigace.
   * @param {any[]} value - Parametry řazení.
   *
   * @example
   * onSort(config, [["name", "asc"]]);
   */
  function onSort(config: IConfig, value: any[]) {
    if (config?.syscode) {
      config.sort = Array.isArray(value[0])
        ? value
        : value.length
        ? [value]
        : [];
      navigate(config);
    }
  }

  /**
   * Generuje query parametry z konfigurace.
   *
   * @param {string} syscode - Systémový kód.
   * @param {IPagination} [pagination] - Stránkovací metadata.
   * @param {IConfig} [config] - Další konfigurace.
   * @returns {string} Query string.
   *
   * @example
   * const query = _generateQueryParams("syscode", { page: 2, limit: 10 }, config);
   * console.log(query); // "syscode={...}&otherParam=value"
   */
  function _generateQueryParams(
    syscode: string,
    pagination?: IPagination,
    config?: IConfig
  ): string {
    let urlConfig = {} as IConfig;

    // Načtení aktuální konfigurace z query parametrů
    try {
      urlConfig = JSON.parse((route.query[syscode] as string) || "{}");
    } catch (error) {
      console.error(error);
    }
    // Příklad: route.query = { syscode: '{"pagination":{"page":1,"limit":10}}' }

    // Nastavení stránkování
    urlConfig.pagination = { page: pagination?.page, limit: pagination?.limit };
    // Příklad: urlConfig.pagination = { page: 2, limit: 10 }

    // Přidání dalších parametrů z konfigurace
    if (config) {
      ITERATE(config, (value, key) => (urlConfig[key] = value));
    }

    // Příklad: config = { sort: [["name", "asc"]] }
    // Výsledek: urlConfig = { pagination: { page: 2, limit: 10 }, sort: [["name", "asc"]] }
    const tmpQuery: Record<string, IConfig> = {};
    tmpQuery[syscode] = urlConfig;
    // Příklad: tmpQuery = { syscode: { pagination: { page: 2, limit: 10 }, sort: [["name", "asc"]] } }

    // udela merge route.query a nove query, nakonec z merge udela query string pro url
    let result = "";
    ITERATE(
      { ...route.query, ...tmpQuery },
      (value, key) =>
        (result += `${GET_MARK(result)}${key}=${
          key === syscode ? JSON.stringify(urlConfig) : value
        }`)
    );
    // Příklad: Výsledek = "syscode={...}&otherParam=value"
    return result;
  }

  watch(
    _queue,
    useDebounceFn((params: any[]) => _navigate(params[0], params[1]), 400)
  );

  return {
    navigate,
    onPageChange,
    onLimitChange,
    onSort,
  };
}
