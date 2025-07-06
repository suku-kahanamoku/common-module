import { addServerHandler, extendPages } from "@nuxt/kit";
import { parse } from "node:path";
import * as fs from "node:fs";

import { REMOVE_LAST_STRING, TRIM } from "./modify-string.functions";

/**
 * @function GENERATE_API_ENDPOINT
 * @description
 * Vytváří API endpoint na základě zadaného souboru a prefixu.
 *
 * @param {string} file - Název souboru, ze kterého se generuje endpoint.
 * @param {string} prefix - Prefix pro cestu endpointu.
 * @param {(...path: string[]) => string} resolve - Funkce pro vytvoření cesty k handleru.
 * @returns {object | undefined} Vrací objekt s konfigurací endpointu nebo `undefined`, pokud není soubor typu `.ts`.
 */
export function GENERATE_API_ENDPOINT(
  file: string,
  prefix: string,
  resolve: (...path: string[]) => string
) {
  const { name, ext } = parse(file); // Rozdělení názvu souboru na části (např. `name`, `ext`).
  // Příklad: Pokud `file` je "user.get.ts", `name` bude "user.get" a `ext` bude ".ts".

  if (ext !== ".ts") return; // Pokud soubor nemá příponu `.ts`, funkce nic neprovede.

  const nameArr = name.split("."); // Rozdělení názvu souboru podle teček.
  // Příklad: "user.get" -> ["user", "get"]

  let route = prefix; // Základní cesta endpointu.
  if (!nameArr[0].includes("index")) {
    route += `/${nameArr[0].replaceAll("[_id]", ":id")}`; // Pokud název neobsahuje "index", přidá se první část názvu do cesty.
    // Příklad: Pokud `prefix` je "/api" a `nameArr[0]` je "user", výsledná cesta bude "/api/user".
  }

  // Vytvoření cesty k handleru. Pokud název končí na ".d", odstraní se tato část.
  // Příklad: Pokud `name` je "user.d.get", výsledná cesta bude "./runtime/server/api/user.get".
  const handlerPath = resolve(
    `./runtime/server/${TRIM(prefix, "/")}/${
      name.endsWith(".d") ? REMOVE_LAST_STRING(name, ".d", true) : name
    }`
  );

  const options = {
    route, // Cesta endpointu.
    handler: handlerPath, // Cesta k handleru.
    method: (nameArr[1] || "get") as any, // HTTP metoda (např. "get", "post"). Pokud není uvedena, použije se "get".
    middleware: false, // Middleware není povolen.
    lazy: true, // Endpoint bude načten líně (lazy loading).
  };

  addServerHandler(options); // Registrace endpointu v Nuxt aplikaci.

  return options; // Vrácení konfigurace endpointu.
}

/**
 * @function GENERATE_PAGES
 * @description
 * Generuje stránky na základě souborů v zadaném adresáři.
 *
 * @param {string} dirName - Název adresáře, ze kterého se generují stránky.
 * @param {(...path: string[]) => string} resolve - Funkce pro vytvoření cesty k souborům.
 * @returns {Array<object>} Vrací pole objektů s konfigurací stránek.
 */
export function GENERATE_PAGES(
  dirName: string,
  resolve: (...path: string[]) => string
) {
  const result: Array<object> = [];
  const dirPath = resolve(`./runtime/pages${dirName}`); // Vytvoření cesty k adresáři stránek.

  fs.readdirSync(dirPath)?.forEach((file) => {
    const { name, base, ext } = parse(file); // Rozdělení názvu souboru na části.

    if (!ext) return; // Pokud soubor nemá příponu, přeskočí se.

    let resolvedName = name === "index" ? dirName : name; // Pokud je název "index", použije se název adresáře.
    // Příklad: Pokud `dirName` je "/about" a `name` je "index", `resolvedName` bude "/about".

    resolvedName = resolvedName.replaceAll("[_id]", ":id");

    if (dirName !== resolvedName) {
      resolvedName = dirName.endsWith("/")
        ? dirName + resolvedName
        : `${dirName}/${resolvedName}`;
      // Přidání názvu souboru k cestě adresáře.
      // Příklad: Pokud `dirName` je "/about" a `name` je "team", `resolvedName` bude "/about/team".
    }

    const options = {
      name: resolvedName, // Název stránky.
      path: resolvedName, // Cesta stránky.
      file: resolve(
        `./runtime/pages${dirName.endsWith("/") ? "" : dirName}/${base}`
      ), // Cesta k souboru stránky.
    };

    extendPages((pages) => {
      pages.push(options); // Přidání stránky do Nuxt konfigurace.
    });

    result.push(options); // Uložení konfigurace stránky do výsledného pole.
  });

  return result; // Vrácení všech generovaných stránek.
}

/**
 * @function READ_FILE
 * @description
 * Načítá obsah JSON souboru a vrací jej jako objekt.
 *
 * @param {string} name - Cesta k souboru.
 * @returns {Promise<Record<string, string>>} Vrací obsah souboru jako objekt nebo prázdný objekt v případě chyby.
 */
export async function READ_FILE(name: string): Promise<Record<string, string>> {
  try {
    const data = await fs.promises.readFile(name, "utf-8"); // Načtení obsahu souboru jako text.
    return JSON.parse(data); // Parsování textu do JSON objektu.
    // Příklad: Pokud `data` je '{"key": "value"}', vrátí se { key: "value" }.
  } catch (error) {
    console.error("Error loading JSON:", error); // Výpis chyby do konzole.
    return {}; // Vrácení prázdného objektu v případě chyby.
  }
}
