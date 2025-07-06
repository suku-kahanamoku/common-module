import { describe, it, expect } from "vitest";

import {
  CAPITALIZE,
  REMOVE_FIRST_STRING,
  REMOVE_LAST_STRING,
  RTRIM,
  LTRIM,
  TRIM,
  RESOLVE_MARKS,
  GET_MARK,
  GET_CLOSEST_NUM,
  GENERATE_QR,
  REMOVE_DIACRITICS,
} from "./modify-string.functions";

describe("String and Utility Functions Unit Tests", () => {
  describe("CAPITALIZE function", () => {
    it("should capitalize the first letter of the string", () => {
      expect(CAPITALIZE("hello")).toBe("Hello");
      expect(CAPITALIZE(" Hello")).toBe("Hello");
      expect(CAPITALIZE("hElLo")).toBe("HElLo");
    });

    it("should return an empty string if input is empty", () => {
      expect(CAPITALIZE("")).toBe("");
    });
  });

  describe("REMOVE_FIRST_STRING function", () => {
    it("should remove the first occurrence of the delimiter", () => {
      expect(REMOVE_FIRST_STRING("test.cz/aaa/bbb", "/")).toBe("/aaa/bbb");
      expect(REMOVE_FIRST_STRING("test.cz/aaa/bbb", "/", true)).toBe("aaa/bbb");
    });

    it("should return the original string if delimiter is not found", () => {
      expect(REMOVE_FIRST_STRING("test.cz/aaa/bbb", "-")).toBe(
        "test.cz/aaa/bbb"
      );
    });

    it("should handle empty delimiter", () => {
      expect(REMOVE_FIRST_STRING("test.cz/aaa/bbb", "")).toBe(
        "test.cz/aaa/bbb"
      );
    });
  });

  describe("REMOVE_LAST_STRING function", () => {
    it("should remove the last occurrence of the delimiter", () => {
      expect(REMOVE_LAST_STRING("test.cz/aaa/bbb", "/")).toBe("test.cz/aaa/");
      expect(REMOVE_LAST_STRING("test.cz/aaa/bbb", "/", true)).toBe(
        "test.cz/aaa"
      );
    });

    it("should return the original string if delimiter is not found", () => {
      expect(REMOVE_LAST_STRING("test.cz/aaa/bbb", "-")).toBe(
        "test.cz/aaa/bbb"
      );
    });

    it("should handle empty delimiter", () => {
      expect(REMOVE_LAST_STRING("test.cz/aaa/bbb", "")).toBe("test.cz/aaa/bbb");
    });
  });

  describe("RTRIM function", () => {
    it("should remove trailing whitespace characters", () => {
      expect(RTRIM("hello   ")).toBe("hello");
      expect(RTRIM("hello...", ".")).toBe("hello");
      expect(RTRIM("hello---", "-")).toBe("hello");
    });

    it("should handle cases with no characters to trim", () => {
      expect(RTRIM("hello")).toBe("hello");
    });

    it("should handle empty string", () => {
      expect(RTRIM("")).toBe("");
    });
  });

  describe("LTRIM function", () => {
    it("should remove leading whitespace characters", () => {
      expect(LTRIM("   hello")).toBe("hello");
      expect(LTRIM("...hello", ".")).toBe("hello");
      expect(LTRIM("---hello", "-")).toBe("hello");
    });

    it("should handle cases with no characters to trim", () => {
      expect(LTRIM("hello")).toBe("hello");
    });

    it("should handle empty string", () => {
      expect(LTRIM("")).toBe("");
    });
  });

  describe("TRIM function", () => {
    it("should remove leading and trailing whitespace characters", () => {
      expect(TRIM("   hello   ")).toBe("hello");
      expect(TRIM("...hello...", ".")).toBe("hello");
      expect(TRIM("---hello---", "-")).toBe("hello");
    });

    it("should handle cases with no characters to trim", () => {
      expect(TRIM("hello")).toBe("hello");
    });

    it("should handle empty string", () => {
      expect(TRIM("")).toBe("");
    });
  });

  describe("RESOLVE_MARKS function", () => {
    it("should replace ${...} with corresponding values from params", () => {
      const params = {
        appService: {
          auth: {
            token: "12345",
          },
        },
      };
      expect(RESOLVE_MARKS("Token: ${appService.auth.token}", params)).toBe(
        "Token: 12345"
      );
    });

    it("should handle nested properties correctly", () => {
      const params = {
        user: {
          name: {
            first: "John",
            last: "Doe",
          },
        },
      };
      expect(
        RESOLVE_MARKS("Name: ${user.name.first} ${user.name.last}", params)
      ).toBe("Name: John Doe");
    });

    it("should return the original string if no marks are found", () => {
      expect(RESOLVE_MARKS("No marks here", {})).toBe("No marks here");
    });
  });

  describe("GET_MARK function", () => {
    it('should return "&" if the value contains "?"', () => {
      expect(GET_MARK("example.com?foo=bar")).toBe("&");
    });

    it('should return "?" if the value does not contain "?"', () => {
      expect(GET_MARK("example.com")).toBe("?");
    });
  });

  describe("GET_CLOSEST_NUM function", () => {
    it("should return the closest number from the list", () => {
      expect(GET_CLOSEST_NUM(5, [1, 4, 9, 12])).toBe(4);
      expect(GET_CLOSEST_NUM(7, [1, 4, 9, 12])).toBe(9);
      expect(GET_CLOSEST_NUM(10, [1, 4, 9, 12])).toBe(9);
    });

    it("should handle cases with only one number in the list", () => {
      expect(GET_CLOSEST_NUM(5, [10])).toBe(10);
      expect(GET_CLOSEST_NUM(15, [10])).toBe(10);
    });

    it("should handle empty list", () => {
      expect(GET_CLOSEST_NUM(5, [])).toBeUndefined();
    });
  });

  describe("GENERATE_QR function", () => {
    it("should generate a correct QR code URL", () => {
      const value = "example";
      const expected = `https://barcode.tec-it.com/barcode.ashx?data=${value}&code=MobileQRCode&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=72&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&codepage=Default&qunit=Mm&quiet=0&hidehrt=False&eclevel=L&dmsize=Default`;
      expect(GENERATE_QR(value)).toBe(expected);
    });
  });

  describe("REMOVE_DIACRITICS function", () => {
    it("should remove diacritics from text", () => {
      expect(REMOVE_DIACRITICS("čřžýáéí")).toBe("crzyaei");
      expect(REMOVE_DIACRITICS("àáâãäå")).toBe("aaaaaa");
      expect(REMOVE_DIACRITICS("œæ")).toBe("oeae");
    });

    it("should handle text without diacritics", () => {
      expect(REMOVE_DIACRITICS("hello")).toBe("hello");
    });

    it("should handle empty string", () => {
      expect(REMOVE_DIACRITICS("")).toBe("");
    });
  });
});
