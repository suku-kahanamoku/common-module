import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  useUrl,
  useCompleteUrl,
  useSortUrl,
  useLimitUrl,
  useProjection,
  useFactory,
} from "./useRestApi";

vi.mock("#imports", () => ({
  useRequestHeaders: vi.fn(),
  $fetch: vi.fn(), // Mockování $fetch
}));

describe("useRestApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useUrl", () => {
    it("should replace 'self' with the current route path", () => {
      const url = "self#test_hash=abc";
      const cmp = { route: { path: "/profile" } };
      const result = useUrl(url, cmp);

      expect(result).toBe("/profile%23test_hash=abc");
    });

    it("should resolve marks in the URL", () => {
      const url = "/test/${id}/";
      const cmp = { id: 123 };
      const result = useUrl(url, cmp);

      expect(result).toBe("/test/123");
    });
  });

  describe("useCompleteUrl", () => {
    it("should generate a complete URL with sort, pagination, and projection", () => {
      const url = "/api/items";
      const cmp = {
        config: {
          sort: [["name", "description"]],
          pagination: { page: 2, limit: 10 },
          projection: { name: 1, age: 1 },
        },
      };
      const result = useCompleteUrl(url, cmp);

      expect(decodeURIComponent(result)).toBe(
        '/api/items?sort=[["name","description"]]&limit=10&skip=10&projection={"name":1,"age":1}'
      );
    });
  });

  describe("useSortUrl", () => {
    it("should append sort parameters to the URL", () => {
      const url = "/api/items";
      const sort = [["name", "description"]];
      const result = useSortUrl(url, sort);

      expect(decodeURIComponent(result)).toBe(
        '/api/items?sort=[["name","description"]]'
      );
    });

    it("should return the original URL if no sort parameters are provided", () => {
      const url = "/api/items";
      const result = useSortUrl(url);

      expect(result).toBe("/api/items");
    });
  });

  describe("useLimitUrl", () => {
    it("should append pagination parameters to the URL", () => {
      const url = "/api/items";
      const pagination = { page: 2, limit: 10 };
      const result = useLimitUrl(url, pagination);

      expect(result).toBe("/api/items?limit=10&skip=10");
    });

    it("should return the original URL if no pagination is provided", () => {
      const url = "/api/items";
      const result = useLimitUrl(url);

      expect(result).toBe("/api/items");
    });
  });

  describe("useProjection", () => {
    it("should append projection parameters to the URL", () => {
      const url = "/api/items";
      const projection = { name: 1, age: 1 };
      const result = useProjection(url, projection);

      expect(decodeURIComponent(result)).toBe(
        '/api/items?projection={"name":1,"age":1}'
      );
    });

    it("should return the original URL if no projection is provided", () => {
      const url = "/api/items";
      const result = useProjection(url);

      expect(result).toBe("/api/items");
    });
  });

  describe("useFactory", () => {
    it("should process relative paths in the factory", () => {
      const url = "/api/items";
      const factory = { url: "../relative/path" };
      const path = "/aa/bb/cc/dd";
      const result = useFactory(url, factory, path);

      expect(decodeURIComponent(result)).toBe(
        '/api/items?factory={"url":"/aa/bb/cc/relative/path"}'
      );
    });

    it("should process relative paths in the factory", () => {
      const url = "/api/items";
      const factory = { url: "../../relative/path" };
      const path = "/aa/bb/cc/dd";
      const result = useFactory(url, factory, path);

      expect(decodeURIComponent(result)).toBe(
        '/api/items?factory={"url":"/aa/bb/relative/path"}'
      );
    });

    it("should append factory parameters to the URL", () => {
      const url = "/api/items";
      const factory = { key: "value" };
      const result = useFactory(url, factory);

      expect(decodeURIComponent(result)).toBe(
        '/api/items?factory={"key":"value"}'
      );
    });

    it("should return the original URL if no factory is provided", () => {
      const url = "/api/items";
      const result = useFactory(url);

      expect(result).toBe("/api/items");
    });
  });
});
