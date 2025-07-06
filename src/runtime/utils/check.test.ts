import { describe, it, expect } from "vitest";
import {
  IS_NUMERIC,
  IS_ALPHABET,
  IS_DEFINED,
  IS_OBJECT,
  IS_IN_RANGE,
  IS_HTML_TAG,
  IS_FNCE,
} from "./check.functions";

describe("IS_NUMERIC function unit test", () => {
  it("should return true for numeric values", () => {
    expect(IS_NUMERIC(123)).toBeTruthy(); // Valid number
    expect(IS_NUMERIC("123")).toBeTruthy(); // Numeric string
    expect(IS_NUMERIC("  123  ")).toBeTruthy(); // Numeric string with spaces
    expect(IS_NUMERIC(0)).toBeTruthy(); // Zero
  });

  it("should return false for non-numeric values", () => {
    expect(IS_NUMERIC("abc")).toBeFalsy(); // Non-numeric string
    expect(IS_NUMERIC(true)).toBeFalsy(); // Boolean true
    expect(IS_NUMERIC(false)).toBeFalsy(); // Boolean false
    expect(IS_NUMERIC([])).toBeFalsy(); // Array
    expect(IS_NUMERIC({})).toBeFalsy(); // Object
    expect(IS_NUMERIC(null)).toBeFalsy(); // Null
    expect(IS_NUMERIC(undefined)).toBeFalsy(); // Undefined
  });
});

describe("IS_ALPHABET function unit test", () => {
  it("should return true for alphabetic strings", () => {
    expect(IS_ALPHABET("abc")).toBeTruthy(); // Lowercase alphabetic
    expect(IS_ALPHABET("ABC")).toBeTruthy(); // Uppercase alphabetic
    expect(IS_ALPHABET("a b c")).toBeTruthy(); // Alphabetic with spaces
    expect(IS_ALPHABET("áéíóú")).toBeTruthy(); // Alphabetic with accents
    expect(IS_ALPHABET("çñü")).toBeTruthy(); // Alphabetic with special characters
  });

  it("should return false for non-alphabetic strings", () => {
    expect(IS_ALPHABET("abc123")).toBeFalsy(); // Alphabetic with numbers
    expect(IS_ALPHABET("abc!")).toBeFalsy(); // Alphabetic with special characters
    expect(IS_ALPHABET("")).toBeFalsy(); // Empty string
    expect(IS_ALPHABET("123")).toBeFalsy(); // Numeric string
  });
});

describe("IS_DEFINED function unit test", () => {
  it("should return true for defined values", () => {
    expect(IS_DEFINED(123)).toBeTruthy(); // Defined number
    expect(IS_DEFINED("value")).toBeTruthy(); // Defined string
    expect(IS_DEFINED({})).toBeTruthy(); // Defined object
    expect(IS_DEFINED([])).toBeTruthy(); // Defined array
  });

  it("should return false for undefined values", () => {
    expect(IS_DEFINED(null)).toBeFalsy(); // Null is defined but should not be confused with undefined
    expect(IS_DEFINED(undefined)).toBeFalsy(); // Undefined
  });
});

describe("IS_OBJECT function unit test", () => {
  it("should return true for objects", () => {
    expect(IS_OBJECT({})).toBeTruthy(); // Plain object
    expect(IS_OBJECT(new Object())).toBeTruthy(); // Object created with the Object constructor
  });

  it("should return false for non-objects", () => {
    expect(IS_OBJECT(123)).toBeFalsy(); // Number
    expect(IS_OBJECT("string")).toBeFalsy(); // String
    expect(IS_OBJECT([])).toBeFalsy(); // Array
    expect(IS_OBJECT(null)).toBeFalsy(); // Null
    expect(IS_OBJECT(undefined)).toBeFalsy(); // Undefined
  });
});

describe("IS_IN_RANGE function unit test", () => {
  it("should return true if value is between min and max (inclusive)", () => {
    expect(IS_IN_RANGE(5, 1, 10)).toBeTruthy(); // Value within range
    expect(IS_IN_RANGE(1, 1, 10)).toBeTruthy(); // Value equal to min
    expect(IS_IN_RANGE(10, 1, 10)).toBeTruthy(); // Value equal to max
  });

  it("should return false if value is outside min and max range", () => {
    expect(IS_IN_RANGE(0, 1, 10)).toBeFalsy(); // Below min
    expect(IS_IN_RANGE(11, 1, 10)).toBeFalsy(); // Above max
    expect(IS_IN_RANGE(1, 5, 10)).toBeFalsy(); // Value below the valid range
  });
});

describe("IS_HTML_TAG function unit test", () => {
  it("should return true for valid HTML tags", () => {
    expect(IS_HTML_TAG("<br>")).toBeTruthy(); // Self-closing tag without '/'
    expect(IS_HTML_TAG("<br/>")).toBeTruthy(); // Self-closing tag with '/'
    expect(IS_HTML_TAG("<div>content</div>")).toBeTruthy(); // Properly closed tag with content
    expect(IS_HTML_TAG("<input type='text' />")).toBeTruthy(); // Self-closing tag with attributes
    expect(
      IS_HTML_TAG("<img src='image.jpg' alt='description' />")
    ).toBeTruthy(); // Self-closing tag with attributes
    expect(IS_HTML_TAG("<a href='link.html'>link</a>")).toBeTruthy(); // Properly closed tag with attributes and content
    expect(IS_HTML_TAG("<p>text</p>")).toBeTruthy(); // Valid paired tags with text
    expect(IS_HTML_TAG("<div><p></p></div>")).toBeTruthy(); // Correctly nested tags
  });

  it("should return false for invalid HTML tags", () => {
    expect(IS_HTML_TAG("<br")).toBeFalsy(); // Missing closing '>'
    expect(IS_HTML_TAG("br>")).toBeFalsy(); // Missing opening '<'
    expect(IS_HTML_TAG("< br >")).toBeFalsy(); // Spaces in tag name
    expect(IS_HTML_TAG("<123>")).toBeFalsy(); // Invalid tag name with digits
    expect(IS_HTML_TAG("<div><p></p>")).toBeFalsy(); // Incomplete closing tag
  });
});

describe("IS_FNCE function unit test", () => {
  it("should return true for valid function signatures", () => {
    expect(IS_FNCE("func()")).toBeTruthy(); // Function with no parameters
    expect(IS_FNCE("func(a)")).toBeTruthy(); // Function with one parameter
    expect(IS_FNCE("func(a, b)")).toBeTruthy(); // Function with multiple parameters
    expect(IS_FNCE("func(param1, param2, param3)")).toBeTruthy(); // Function with multiple parameters
    expect(IS_FNCE("someObject.someFunction(param1, param2)")).toBeTruthy(); // Function within an object
  });

  it("should return false for invalid function signatures", () => {
    expect(IS_FNCE("func(")).toBeFalsy(); // Incomplete function signature
    expect(IS_FNCE("func(param1")).toBeFalsy(); // Missing closing parenthesis
    expect(IS_FNCE("func(param1,)")).toBeFalsy(); // Trailing comma
    expect(IS_FNCE("func(param1, param2")).toBeFalsy(); // Missing closing parenthesis
    expect(IS_FNCE("func(param1, param2))")).toBeFalsy(); // Extra closing parenthesis
  });
});
