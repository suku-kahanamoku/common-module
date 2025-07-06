import { describe, it, expect } from "vitest";

import {
  CLONE,
  CONVERT_DOT_TO_OBJECT,
  DIFFERENCE,
  GET_OBJECT_PARAM,
  GET_VALUE,
  INTERSECTION,
  ITERATE,
  MERGE,
  RANDOM,
  SHUFFLE,
} from "./modify-object.functions.js";

describe("CLONE function unit test", () => {
  it("should clone a simple object correctly", () => {
    const obj = { a: 1, b: { c: 2 } };
    const cloned = CLONE(obj);
    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj); // Ensure it's a different object
  });

  it("should clone an array correctly", () => {
    const arr = [1, 2, [3, 4]];
    const cloned = CLONE(arr);
    expect(cloned).toEqual(arr);
    expect(cloned).not.toBe(arr); // Ensure it's a different array
  });

  it("should clone a Date object correctly", () => {
    const date = new Date();
    const cloned = CLONE(date);
    expect(cloned).toEqual(date);
    expect(cloned).not.toBe(date); // Ensure it's a different Date object
  });

  it("should clone a RegExp object correctly", () => {
    const regex = /test/i;
    const cloned = CLONE(regex);
    expect(cloned).toEqual(regex);
    expect(cloned).not.toBe(regex); // Ensure it's a different RegExp object
  });

  it("should handle null and non-object values correctly", () => {
    expect(CLONE(null)).toBe(null);
    expect(CLONE(123)).toBe(123);
    expect(CLONE("string")).toBe("string");
  });
});

describe("SHUFFLE function unit test", () => {
  it("should shuffle the array in place", () => {
    const arr = [1, 2, 3, 4, 5];
    const original = [...arr];
    SHUFFLE(arr);
    expect(arr).not.toEqual(original); // Ensure the array has been shuffled
    expect(arr.sort()).toEqual(original.sort()); // Ensure all elements are present
  });

  it("should handle empty array", () => {
    const arr: any = [];
    SHUFFLE(arr);
    expect(arr).toEqual([]); // An empty array should remain empty
  });

  it("should handle array with one element", () => {
    const arr = [1];
    SHUFFLE(arr);
    expect(arr).toEqual([1]); // A single-element array should remain unchanged
  });
});

describe("RANDOM function unit test", () => {
  it("should return a random element from the array", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = RANDOM(arr);
    expect(arr).toContain(result); // Result should be one of the array elements
  });

  it("should handle empty array", () => {
    const arr: any = [];
    expect(RANDOM(arr)).toBeUndefined(); // An empty array should return undefined
  });
});

describe("INTERSECTION function unit test", () => {
  it("should find intersection of two arrays", () => {
    const arr1 = ["a", "b", "c"];
    const arr2 = ["b", "c", "d"];
    expect(INTERSECTION(arr1, arr2)).toEqual(["b", "c"]);
  });

  it("should handle no common elements", () => {
    const arr1 = ["a", "b"];
    const arr2 = ["c", "d"];
    expect(INTERSECTION(arr1, arr2)).toEqual([]);
  });

  it("should handle empty arrays", () => {
    const arr1: any = [];
    const arr2 = ["a", "b"];
    expect(INTERSECTION(arr1, arr2)).toEqual([]);
  });
});

describe("DIFFERENCE function unit test", () => {
  it("should find the difference between two arrays", () => {
    const arr1 = ["a", "b", "c"];
    const arr2 = ["b", "c", "d"];
    expect(DIFFERENCE(arr1, arr2)).toEqual(["a", "d"]);
  });

  it("should handle empty arrays", () => {
    const arr1: any = [];
    const arr2 = ["a", "b"];
    expect(DIFFERENCE(arr1, arr2)).toEqual(["a", "b"]);
  });

  it("should handle arrays with no difference", () => {
    const arr1 = ["a", "b"];
    const arr2 = ["a", "b"];
    expect(DIFFERENCE(arr1, arr2)).toEqual([]);
  });
});

describe("ITERATE function unit test", () => {
  it("should iterate over object properties", () => {
    const obj = { a: 1, b: 2 };
    const result: string[] = [];
    ITERATE(obj, (value, key) => result.push(key));
    expect(result).toEqual(["a", "b"]);
  });

  it("should iterate over array elements", () => {
    const arr = [1, 2, 3];
    const result: number[] = [];
    ITERATE(arr, (value) => result.push(value));
    expect(result).toEqual([1, 2, 3]);
  });

  it("should handle empty object or array", () => {
    const result: string[] = [];
    ITERATE({}, () => result.push("should not be called"));
    expect(result).toEqual([]);

    ITERATE([], () => result.push("should not be called"));
    expect(result).toEqual([]);
  });
});
describe("GET_VALUE function unit test", () => {
  const data = {
    params: {
      fields: {
        firstname: "Jan",
      },
    },
  };

  it("should return the correct value given a valid path", () => {
    expect(GET_VALUE(data, "firstname", "params.fields")).toBe("Jan");
  });

  it("should return undefined for invalid path", () => {
    expect(GET_VALUE(data, "firstname", "invalid.path")).toBeUndefined();
  });

  it("should return the correct value without a path", () => {
    expect(GET_VALUE(data, "params")).toEqual(data.params);
  });

  it("should handle undefined and empty values", () => {
    expect(GET_VALUE(data, "nonexistent")).toBeUndefined();
    expect(GET_VALUE({}, "nonexistent")).toBeUndefined();
  });
});

describe("GET_OBJECT_PARAM function unit test", () => {
  const data = {
    params: {
      fields: {
        firstname: "Jan",
      },
    },
  };

  it("should return the object for a valid path", () => {
    expect(GET_OBJECT_PARAM(data, "params.fields")).toEqual(data.params.fields);
  });

  it("should return the value for a valid path when not an object", () => {
    expect(GET_OBJECT_PARAM(data, "params.fields.firstname")).toBe("Jan");
  });

  it("should handle undefined and empty values", () => {
    expect(GET_OBJECT_PARAM({}, "nonexistent")).toBeUndefined();
  });
});

describe("MERGE function unit test", () => {
  it("should merge two objects correctly", () => {
    const target = { a: 1, b: { c: 2 } };
    const source = { b: { d: 3 }, e: 4 };
    expect(MERGE(target, source)).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 });
  });

  it("should handle merging with empty objects", () => {
    const target = { a: 1 };
    const source = {};
    expect(MERGE(target, source)).toEqual({ a: 1 });
  });

  it("should handle merging objects with null values", () => {
    const target = { a: null };
    const source = { a: 1 };
    expect(MERGE(target, source)).toEqual({ a: 1 });
  });
});

describe("CONVERT_DOT_TO_OBJECT function unit test", () => {
  it("should convert dot notation to nested objects", () => {
    const params = {
      "params.firstname": "Jan",
      "params.lastname": "Novak",
    };

    const expected = {
      params: {
        firstname: "Jan",
        lastname: "Novak",
      },
    };

    CONVERT_DOT_TO_OBJECT(params);
    expect(params).toEqual(expected);
  });

  it("should merge with existing nested objects", () => {
    const params = {
      "params.firstname": "Jan",
      params: {
        lastname: "Novak",
      },
    };

    const expected = {
      params: {
        firstname: "Jan",
        lastname: "Novak",
      },
    };

    CONVERT_DOT_TO_OBJECT(params);
    expect(params).toEqual(expected);
  });

  it("should handle cases where no conversion is needed", () => {
    const params = {
      firstname: "Jan",
      lastname: "Novak",
    };

    const expected = {
      firstname: "Jan",
      lastname: "Novak",
    };

    CONVERT_DOT_TO_OBJECT(params);
    expect(params).toEqual(expected);
  });

  it("should handle empty input gracefully", () => {
    const params = {};

    const expected = {};

    CONVERT_DOT_TO_OBJECT(params);
    expect(params).toEqual(expected);
  });

  it("should handle nested objects with dot notation", () => {
    const params = {
      "user.name.first": "Jan",
      "user.name.last": "Novak",
      "user.address.city": "Prague",
    };

    const expected = {
      user: {
        name: {
          first: "Jan",
          last: "Novak",
        },
        address: {
          city: "Prague",
        },
      },
    };

    CONVERT_DOT_TO_OBJECT(params);
    expect(params).toEqual(expected);
  });

  it("should handle non-string keys correctly", () => {
    const params = {
      123: "numericKey",
      "nested.456": "value",
    };

    const expected = {
      123: "numericKey",
      nested: {
        456: "value",
      },
    };

    CONVERT_DOT_TO_OBJECT(params);
    expect(params).toEqual(expected);
  });

  it("should handle cases where the final value is not a string", () => {
    const params = {
      "data.count": 10,
      "data.flag": true,
    };

    const expected = {
      data: {
        count: 10,
        flag: true,
      },
    };

    CONVERT_DOT_TO_OBJECT(params);
    expect(params).toEqual(expected);
  });
});
