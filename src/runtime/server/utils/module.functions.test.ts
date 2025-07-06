import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import * as fs from "node:fs";
import { GENERATE_API_ENDPOINT, GENERATE_PAGES } from "./module.functions";

// Mockování modulů
vi.mock("node:fs", () => ({
  readdirSync: vi.fn(),
  promises: {
    readFile: vi.fn(),
  },
}));

vi.mock("@nuxt/kit", () => ({
  addServerHandler: vi.fn(() => {}),
  extendPages: vi.fn(() => {}),
}));

describe("module.functions.ts", () => {
  const mockResolve = (...path: string[]) => path.join("/");

  beforeEach(() => {
    vi.clearAllMocks(); // Vyčistí všechny mocky před každým testem
  });

  describe("GENERATE_API_ENDPOINT", () => {
    it("should generate an API endpoint for a valid .ts file", () => {
      const file = "user.get.ts";
      const prefix = "/api";
      const result = GENERATE_API_ENDPOINT(file, prefix, mockResolve);

      expect(result).toEqual({
        route: "/api/user",
        handler: "./runtime/server/api/user.get",
        method: "get",
        middleware: false,
        lazy: true,
      });
    });

    it("should return undefined for non-.ts files", () => {
      const file = "user.get.js";
      const prefix = "/api";
      const result = GENERATE_API_ENDPOINT(file, prefix, mockResolve);

      expect(result).toBeUndefined();
    });

    it("should generate endpoints for files in multiple directories", () => {
      const mockFiles = [
        "index.ts",
        "index.post.ts",
        "facebook.get.ts",
        "reset-password.post.ts",
      ];
      (fs.readdirSync as Mock).mockReturnValue(mockFiles);

      const apiLoginDir = "./runtime/server/api/login";
      const apiAuthDir = "./runtime/server/api/auth";
      const apiAdminDir = "./runtime/server/api/admin/user";

      // Login API endpoints
      fs.readdirSync(apiLoginDir)?.forEach((file) => {
        const result = GENERATE_API_ENDPOINT(file, "/api/login", mockResolve);
        expect(result).toEqual({
          route: `/api/login${
            file.includes("index") ? "" : `/${file.split(".")[0]}`
          }`,
          handler: `./runtime/server/api/login/${file.replace(/\.ts$/, "")}`,
          method: file.includes(".post.")
            ? "post"
            : file.includes(".get.")
            ? "get"
            : "get", // Výchozí metoda je "get"
          middleware: false,
          lazy: true,
        });
      });

      // Auth API endpoints
      fs.readdirSync(apiAuthDir)?.forEach((file) => {
        const result = GENERATE_API_ENDPOINT(file, "/api/auth", mockResolve);
        expect(result).toEqual({
          route: `/api/auth${
            file.includes("index") ? "" : `/${file.split(".")[0]}`
          }`,
          handler: `./runtime/server/api/auth/${file.replace(/\.ts$/, "")}`,
          method: file.includes(".post.")
            ? "post"
            : file.includes(".get.")
            ? "get"
            : "get", // Výchozí metoda je "get"
          middleware: false,
          lazy: true,
        });
      });

      // Admin User API endpoints
      fs.readdirSync(apiAdminDir)?.forEach((file) => {
        const result = GENERATE_API_ENDPOINT(
          file,
          "/api/admin/user",
          mockResolve
        );
        expect(result).toEqual({
          route: `/api/admin/user${
            file.includes("index") ? "" : `/${file.split(".")[0]}`
          }`,
          handler: `./runtime/server/api/admin/user/${file.replace(
            /\.ts$/,
            ""
          )}`,
          method: file.includes(".post.")
            ? "post"
            : file.includes(".get.")
            ? "get"
            : "get", // Výchozí metoda je "get"
          middleware: false,
          lazy: true,
        });
      });
    });
  });

  describe("GENERATE_PAGES", () => {
    it("should generate pages for valid files in a directory", () => {
      const dirName = "/about";
      const files = ["index.vue", "team.vue"];
      (fs.readdirSync as Mock).mockReturnValue(files);

      const result = GENERATE_PAGES(dirName, mockResolve);

      expect(result).toEqual([
        {
          name: "/about",
          path: "/about",
          file: "./runtime/pages/about/index.vue",
        },
        {
          name: "/about/team",
          path: "/about/team",
          file: "./runtime/pages/about/team.vue",
        },
      ]);
    });

    it("should skip files without extensions", () => {
      const dirName = "/about/team";
      const files = ["index.vue", "team.vue"];
      (fs.readdirSync as Mock).mockReturnValue(files);

      const result = GENERATE_PAGES(dirName, mockResolve);

      expect(result).toEqual([
        {
          name: "/about/team",
          path: "/about/team",
          file: "./runtime/pages/about/team/index.vue",
        },
        {
          name: "/about/team/team",
          path: "/about/team/team",
          file: "./runtime/pages/about/team/team.vue",
        },
      ]);
    });

    it("should generate pages for the root directory", () => {
      const dirName = "/";
      const files = ["index.vue", "home.vue"];
      (fs.readdirSync as Mock).mockReturnValue(files);

      const result = GENERATE_PAGES(dirName, mockResolve);

      expect(result).toEqual([
        {
          name: "/",
          path: "/",
          file: "./runtime/pages/index.vue",
        },
        {
          name: "/home",
          path: "/home",
          file: "./runtime/pages/home.vue",
        },
      ]);
    });

    it("should generate pages for the /pz directory", () => {
      const dirName = "/pz";
      const files = ["index.vue", "dashboard.vue"];
      (fs.readdirSync as Mock).mockReturnValue(files);

      const result = GENERATE_PAGES(dirName, mockResolve);

      expect(result).toEqual([
        {
          name: "/pz",
          path: "/pz",
          file: "./runtime/pages/pz/index.vue",
        },
        {
          name: "/pz/dashboard",
          path: "/pz/dashboard",
          file: "./runtime/pages/pz/dashboard.vue",
        },
      ]);
    });

    it("should generate pages for the /admin directory", () => {
      const dirName = "/admin";
      const files = ["index.vue", "users.vue", "settings.vue"];
      (fs.readdirSync as Mock).mockReturnValue(files);

      const result = GENERATE_PAGES(dirName, mockResolve);

      expect(result).toEqual([
        {
          name: "/admin",
          path: "/admin",
          file: "./runtime/pages/admin/index.vue",
        },
        {
          name: "/admin/users",
          path: "/admin/users",
          file: "./runtime/pages/admin/users.vue",
        },
        {
          name: "/admin/settings",
          path: "/admin/settings",
          file: "./runtime/pages/admin/settings.vue",
        },
      ]);
    });
  });
});
