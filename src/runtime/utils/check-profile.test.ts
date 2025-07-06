import { describe, it, expect } from "vitest";
import {
  IS_EMAIL,
  IS_TIN,
  IS_VATID,
  IS_PERSON_NUM,
  IS_NAME,
} from "./check-profile.functions.js";

// Tests for IS_EMAIL function
describe("IS_EMAIL function unit test", () => {
  it("should be a valid email address", () => {
    expect(IS_EMAIL("test@example.com")).toBeTruthy();
    expect(IS_EMAIL("user.name+tag+sorting@example.com")).toBeTruthy();
    expect(IS_EMAIL("user_name@example.com")).toBeTruthy();
    expect(IS_EMAIL("username@example.co.uk")).toBeTruthy();
    expect(IS_EMAIL("1234567890@example.com")).toBeTruthy();
  });

  it("should not be a valid email address", () => {
    expect(IS_EMAIL("plainaddress")).toBeFalsy(); // Missing @ sign
    expect(IS_EMAIL("@missingusername.com")).toBeFalsy(); // Missing username
    expect(IS_EMAIL("username@.com.my")).toBeFalsy(); // Dot starting domain part
    expect(IS_EMAIL("username@.com")).toBeFalsy(); // Dot starting domain part
    expect(IS_EMAIL("username@domain.com.")).toBeFalsy(); // Trailing dot in domain
    expect(IS_EMAIL("username@domain..com")).toBeFalsy(); // Double dots in domain
  });
});

// Tests for IS_TIN function
describe("IS_TIN function unit test", () => {
  it("should be a valid TIN", () => {
    expect(IS_TIN("54797063")).toBeTruthy(); // Valid TIN
  });

  it("should not be a valid TIN", () => {
    expect(IS_TIN("5479706")).toBeFalsy(); // Invalid (7 digits)
    expect(IS_TIN("54797064")).toBeFalsy(); // Invalid checksum
    expect(IS_TIN("5479706A")).toBeFalsy(); // Invalid (contains letter)
  });
});

// Tests for IS_VATID function
describe("IS_VATID function unit test", () => {
  it("should be a valid VAT ID", () => {
    expect(IS_VATID("CZ54797063")).toBeTruthy(); // Valid VAT ID with Czech country code
    expect(IS_VATID("SK63334977")).toBeTruthy(); // Valid VAT ID with Slovak country code
  });

  it("should not be a valid VAT ID", () => {
    expect(IS_VATID("CZ5479706")).toBeFalsy(); // Invalid (7 digits)
    expect(IS_VATID("CZ54797064")).toBeFalsy(); // Invalid checksum
    expect(IS_VATID("SK1234567")).toBeFalsy(); // Invalid (7 digits)
    expect(IS_VATID("SK12345678")).toBeTruthy(); // Valid format but no specific check for checksum
    expect(IS_VATID("US54797063")).toBeFalsy(); // Invalid country code
  });
});

// Tests for IS_PERSON_NUM function
describe("IS_PERSON_NUM function unit test", () => {
  it("should be a valid personal number", () => {
    expect(IS_PERSON_NUM("851028/4365")).toBeTruthy(); // Valid personal number with separator
    expect(IS_PERSON_NUM("8510284365")).toBeTruthy(); // Valid personal number without separator
  });

  it("should not be a valid personal number", () => {
    expect(IS_PERSON_NUM("851028/43656")).toBeFalsy(); // Invalid length
    expect(IS_PERSON_NUM("851028/436A")).toBeFalsy(); // Contains letter
    expect(IS_PERSON_NUM("851028/4368")).toBeFalsy(); // Invalid control digit
    expect(IS_PERSON_NUM("000000000")).toBeFalsy(); // Invalid date
  });
});

// Tests for IS_NAME function
describe("IS_NAME function unit test", () => {
  it("should be a valid name", () => {
    expect(IS_NAME("Anne-Marie")).toBeTruthy(); // Valid name with hyphen
    expect(IS_NAME("O'Connor")).toBeTruthy(); // Valid name with apostrophe
    expect(IS_NAME("José")).toBeTruthy(); // Valid name with accent
    expect(IS_NAME("Jean-Luc")).toBeTruthy(); // Valid name with hyphen
    expect(IS_NAME("Anne Marie")).toBeTruthy(); // Valid name with space
    expect(IS_NAME("Alice")).toBeTruthy(); // Valid name without special characters
    expect(IS_NAME("Léa")).toBeTruthy(); // Valid name with accent
    expect(IS_NAME("Álvaro")).toBeTruthy(); // Valid name with special character
    expect(IS_NAME("John Doe")).toBeTruthy(); // Valid name with space
  });

  it("should not be a valid name", () => {
    expect(IS_NAME("Anne-Marie-")).toBeFalsy(); // Ends with hyphen
    expect(IS_NAME("John..")).toBeFalsy(); // Ends with period
    expect(IS_NAME("  John")).toBeFalsy(); // Starts with space
    expect(IS_NAME("John@Doe")).toBeFalsy(); // Contains invalid character (@)
    expect(IS_NAME("A")).toBeFalsy(); // Too short
    expect(IS_NAME("John-Doe-")).toBeFalsy(); // Ends with hyphen
    expect(IS_NAME("Mary.")).toBeFalsy(); // Ends with period
    expect(IS_NAME("J0hn")).toBeFalsy(); // Contains digit
  });
});
