import { describe, it, expect } from "vitest";
import { IS_ZIP, IS_STREET_NAME, IS_CITY } from "./check-address.functions";

// Tests for IS_ZIP function
describe("IS_ZIP function unit test", () => {
  it("should be a valid zip code", () => {
    expect(IS_ZIP(12345)).toBeTruthy();
    expect(IS_ZIP("12345")).toBeTruthy();
    expect(IS_ZIP("123 45")).toBeTruthy();
  });

  it("should not be an invalid zip code", () => {
    expect(IS_ZIP(123456)).toBeFalsy();
    expect(IS_ZIP(1234)).toBeFalsy();
    expect(IS_ZIP("1234")).toBeFalsy();
    expect(IS_ZIP("12 345")).toBeFalsy();
    expect(IS_ZIP("1234A")).toBeFalsy();
    expect(IS_STREET_NAME("")).toBeFalsy();
  });
});

// Tests for IS_STREET_NAME function
describe("IS_STREET_NAME function unit test", () => {
  it("should be a valid street name with house number", () => {
    expect(IS_STREET_NAME("Main Street 123")).toBeTruthy();
    expect(IS_STREET_NAME("5th Avenue 12A")).toBeTruthy();
    expect(IS_STREET_NAME("Oak St 1/23")).toBeTruthy();
  });

  it("should not be an invalid street name", () => {
    expect(IS_STREET_NAME("MainStreet")).toBeFalsy(); // No space
    expect(IS_STREET_NAME("Main 123Street")).toBeFalsy(); // Number in the wrong place
    expect(IS_STREET_NAME("Main Street")).toBeFalsy(); // No house number
    expect(IS_STREET_NAME("123")).toBeFalsy(); // Just a number
    expect(IS_STREET_NAME("")).toBeFalsy(); // Empty string
  });
});

// Tests for IS_CITY function
describe("IS_CITY function unit test", () => {
  it("should be a valid city name", () => {
    expect(IS_CITY("Prague")).toBeTruthy();
    expect(IS_CITY("New York")).toBeTruthy();
    expect(IS_CITY("Los Angeles")).toBeTruthy();
    expect(IS_CITY("San Francisco")).toBeTruthy();
  });

  it("should not be an invalid city name", () => {
    expect(IS_CITY("A")).toBeFalsy(); // Too short
    expect(IS_CITY("New@York")).toBeFalsy(); // Contains special character
    expect(IS_CITY("!City")).toBeFalsy(); // Starts with special character
    expect(IS_CITY("C!ty")).toBeFalsy(); // Contains special character in the middle
    expect(IS_CITY("City 123 45")).toBeFalsy();
    expect(IS_CITY("")).toBeFalsy(); // Empty string
  });
});
