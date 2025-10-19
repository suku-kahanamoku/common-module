import { nextTick, ref, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { useRoute, navigateTo, useUrl } from "#imports";

import { CLONE, ITERATE } from "../utils";
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
      configParams.mode = config.mode;

      const query = _generateQueryParams(
        config.syscode,
        config.pagination || {},
        configParams
      );

      await navigateTo(
        { path: useUrl("self", { route }), query },
        {
          replace: true,
        }
      );
    }
  }

  /**
   * Změní stránkování a naviguje.
   *
   * @param {IConfig} config
   * @param {number} value
   * @param {HTMLElement | string} [scrollTo]
   *
   * @example
   * onPageChange(config, 2);
   */
  function onPageChange(
    config: IConfig,
    value: number,
    scrollTo?: HTMLElement | string
  ) {
    if (config?.syscode) {
      const pagination = config.pagination || {};
      pagination.page = value;
      navigate(config);
      if (scrollTo) {
        nextTick(() => {
          if (typeof scrollTo === "string") {
            const element = document.querySelector(scrollTo);
            element?.scrollIntoView({ behavior: "smooth", block: "start" });
          } else {
            scrollTo.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      }
    }
  }

  /**
   * Změní počet položek na stránku a naviguje.
   *
   * @param {IConfig} config
   * @param {number} value
   * @param {HTMLElement | string} [scrollTo]
   *
   * @example
   * onLimitChange(config, 20);
   */
  function onLimitChange(
    config: IConfig,
    value: number,
    scrollTo?: HTMLElement | string
  ) {
    if (config?.syscode) {
      const pagination = config.pagination || {};
      pagination.limit = value;
      pagination.page = 1;
      navigate(config);
      if (scrollTo) {
        nextTick(() => {
          if (typeof scrollTo === "string") {
            const element = document.querySelector(scrollTo);
            element?.scrollIntoView({ behavior: "smooth", block: "start" });
          } else {
            scrollTo.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      }
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
   * @returns {*}  {Record<string, string>}
   *
   * @example
   * const query = _generateQueryParams("syscode", { page: 2, limit: 10 }, config);
   * console.log(query); // "syscode={...}&otherParam=value"
   */
  function _generateQueryParams(
    syscode: string,
    pagination?: IPagination,
    config?: IConfig
  ): Record<string, any> {
    let queryParams = {} as Record<string, any>;

    // Zkopírování existujících query parametrů
    ITERATE(route.query, (value, key) => {
      if (typeof value === "string") {
        try {
          queryParams[key] = JSON.parse(value);
        } catch (error) {
          console.error(error);
        }
      } else {
        queryParams[key] = value;
      }
    });

    queryParams[syscode] = queryParams[syscode] || {};

    // Přidání dalších parametrů z konfigurace
    if (config) {
      ITERATE(config, (value, key) => (queryParams[syscode][key] = value));
    }

    // Nastavení stránkování
    queryParams[syscode].pagination = {
      page: pagination?.page,
      limit: pagination?.limit,
    };

    // Serializace všech hodnot na string
    ITERATE(
      queryParams,
      (value, key) => (queryParams[key] = JSON.stringify(value))
    );
    return queryParams;
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
