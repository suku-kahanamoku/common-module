import { defineNuxtModule, createResolver, addImportsDir } from "@nuxt/kit";
import defu from "defu";

/**
 * @typedef {Object} ModuleOptions
 * @description
 * Rozhraní pro možnosti konfigurace modulu `common-module`.
 */
export interface ModuleOptions {}

/**
 * @module common-module
 * @description
 * Tento modul poskytuje společné funkce a konfigurace pro Nuxt aplikaci.
 * Umožňuje přidání runtime konfigurací a composables.
 *
 * @example
 * ```typescript
 * export default defineNuxtConfig({
 *   commonModule: {},
 * });
 * ```
 */
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "common-module",
    configKey: "commonModule",
  },
  // Výchozí možnosti konfigurace Nuxt modulu
  defaults: {},

  /**
   * @function setup
   * @description
   * Hlavní funkce modulu, která nastavuje runtime konfigurace a přidává composables.
   *
   * @param {ModuleOptions} _options - Uživatelské možnosti konfigurace.
   * @param {Nuxt} _nuxt - Instance Nuxt aplikace.
   */
  async setup(_options, _nuxt) {
    const { resolve } = createResolver(import.meta.url);

    // Načtení proměnných prostředí
    const env = process.env || {};

    // Sloučení runtime konfigurací s výchozími hodnotami
    _nuxt.options.runtimeConfig.public = defu(
      _nuxt.options.runtimeConfig.public,
      {
        FRONTEND_HOST: env.FRONTEND_HOST,
      }
    );

    // Přidání composables
    addImportsDir(resolve("./runtime/composables"));
  },
});

// Export all utils for direct import from main entry point
export * from './runtime/utils';
