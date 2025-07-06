import { describe, it, expect } from "vitest";
import { IS_ABSOLUTE_URL } from "./check-url.functions";

describe("IS_ABSOLUTE_URL function unit test", () => {
  it("should be a valid absolute URL", () => {
    expect(IS_ABSOLUTE_URL("http://example.com")).toBeTruthy(); // Valid HTTP URL
    expect(IS_ABSOLUTE_URL("https://example.com")).toBeTruthy(); // Valid HTTPS URL
    expect(IS_ABSOLUTE_URL("ftp://example.com")).toBeTruthy(); // Valid FTP URL
    expect(IS_ABSOLUTE_URL("http://example.com/path?query=1")).toBeTruthy(); // HTTP URL with path and query
    expect(IS_ABSOLUTE_URL("https://user:pass@example.com/path")).toBeTruthy(); // URL with user info
    expect(IS_ABSOLUTE_URL("http://subdomain.example.com")).toBeTruthy(); // URL with subdomain
    expect(IS_ABSOLUTE_URL("https://example.com:8080")).toBeTruthy(); // URL with port
    expect(IS_ABSOLUTE_URL("http://example.com/path#fragment")).toBeTruthy(); // URL with fragment
  });

  it("should not be a valid absolute URL", () => {
    expect(IS_ABSOLUTE_URL("example.com")).toBeFalsy(); // Missing scheme
    expect(IS_ABSOLUTE_URL("http://")).toBeFalsy(); // Scheme only with no host
    expect(IS_ABSOLUTE_URL("https://:8080")).toBeFalsy(); // Missing host
    expect(IS_ABSOLUTE_URL("ftp://user:pass@")).toBeFalsy(); // Missing host
    expect(IS_ABSOLUTE_URL("//example.com")).toBeFalsy(); // Relative URL with double slashes
    expect(IS_ABSOLUTE_URL("http:// example.com")).toBeFalsy(); // Invalid URL with space
    expect(IS_ABSOLUTE_URL("ftp:/example.com")).toBeFalsy(); // Incomplete scheme
    expect(IS_ABSOLUTE_URL("http:/example.com")).toBeFalsy(); // Incomplete scheme
    expect(IS_ABSOLUTE_URL("https://:8080")).toBeFalsy(); // Missing host
    expect(IS_ABSOLUTE_URL("https://.com")).toBeFalsy(); // Missing domain
    expect(IS_ABSOLUTE_URL("https://example..com")).toBeFalsy(); // Invalid domain
  });
});
