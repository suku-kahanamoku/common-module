import { describe, it, expect } from "vitest";
import {
  IS_CZECH_PHONE_NUMBER,
  IS_PHONE_NUMBER,
} from "./check-phone.functions";

// Tests for the IS_CZECH_PHONE_NUMBER function
describe("IS_CZECH_PHONE_NUMBER function unit test", () => {
  it("should be a valid Czech phone number", () => {
    expect(IS_CZECH_PHONE_NUMBER("+420123456789")).toBeTruthy(); // Valid format with international prefix, no spaces
    expect(IS_CZECH_PHONE_NUMBER("+420 123 456 789")).toBeTruthy(); // Valid format with international prefix and spaces
    expect(IS_CZECH_PHONE_NUMBER("00420123456789")).toBeTruthy(); // Valid format with 00420 prefix, no spaces
    expect(IS_CZECH_PHONE_NUMBER("00420 123 456 789")).toBeTruthy(); // Valid format with 00420 prefix and spaces
    expect(IS_CZECH_PHONE_NUMBER("123456789")).toBeTruthy(); // Valid format without prefix, no spaces
    expect(IS_CZECH_PHONE_NUMBER("123 456 789")).toBeTruthy(); // Valid format without prefix, with spaces
  });

  it("should not be a valid Czech phone number", () => {
    expect(IS_CZECH_PHONE_NUMBER("+421123456789")).toBeFalsy(); // Invalid prefix (+421 instead of +420)
    expect(IS_CZECH_PHONE_NUMBER("+420123 456 78")).toBeFalsy(); // Too few digits
    expect(IS_CZECH_PHONE_NUMBER("+420 1234 56789")).toBeFalsy(); // Incorrect spacing format
    expect(IS_CZECH_PHONE_NUMBER("00420-123-456-789")).toBeFalsy(); // Incorrect format with dashes
    expect(IS_CZECH_PHONE_NUMBER("12345678")).toBeFalsy(); // Too few digits
    expect(IS_CZECH_PHONE_NUMBER("1234 56789")).toBeFalsy(); // Incorrect spacing format
    expect(IS_CZECH_PHONE_NUMBER("+420 12345678")).toBeFalsy(); // Too few digits with correct prefix
    expect(IS_CZECH_PHONE_NUMBER("abcd123456789")).toBeFalsy(); // Contains invalid characters (letters)
  });
});

// Tests for the IS_PHONE_NUMBER function
describe("IS_PHONE_NUMBER function unit test", () => {
  it("should be a valid phone number", () => {
    expect(IS_PHONE_NUMBER("+123456789")).toBeTruthy(); // Valid with international prefix
    expect(IS_PHONE_NUMBER("+12(34)56789")).toBeTruthy(); // Valid with parentheses
    expect(IS_PHONE_NUMBER("+12-34-56789")).toBeTruthy(); // Valid with dashes
    expect(IS_PHONE_NUMBER("+12.34.56789")).toBeTruthy(); // Valid with dots
    expect(IS_PHONE_NUMBER("123456789")).toBeTruthy(); // Valid without prefix
    expect(IS_PHONE_NUMBER("123 456 789")).toBeTruthy(); // Valid with spaces
    expect(IS_PHONE_NUMBER("123-456-789")).toBeTruthy(); // Valid with dashes
    expect(IS_PHONE_NUMBER("123/456/789")).toBeTruthy(); // Valid with slashes
    expect(IS_PHONE_NUMBER("123.456.789")).toBeTruthy(); // Valid with dots
    expect(IS_PHONE_NUMBER("(123) 456-789")).toBeTruthy(); // Valid with parentheses and dashes
    expect(IS_PHONE_NUMBER("+ (123) 456-789")).toBeTruthy(); // Valid with plus sign, parentheses, and dashes
  });

  it("should not be a valid phone number", () => {
    expect(IS_PHONE_NUMBER("12345678")).toBeFalsy(); // Too few digits
    expect(IS_PHONE_NUMBER("12(34)5678")).toBeFalsy(); // Too few characters
    expect(IS_PHONE_NUMBER("abc123456789")).toBeFalsy(); // Contains invalid characters (letters)
    expect(IS_PHONE_NUMBER("12345#6789")).toBeFalsy(); // Contains invalid character (#)
    expect(IS_PHONE_NUMBER("")).toBeFalsy(); // Empty string
  });
});
