/**
 * This module reexports functions, schemas and types related to the [[Pattern]]
 * type.
 *
 * A pattern is a string that matches module codes. Each pattern string is made
 * up of strictly numbers, uppercase letters, the letter 'x' (used to denote any
 * digit) and the wildcard '*' (used to denote any possibly empty sequence of
 * numbers or uppercase letters).
 *
 * Examples:
 * ```yaml
 * * # matches any module code
 * CS2103T # matches exactly "CS2103T"
 * MA22xx* # matches any module code starting with "MA22" followed by two
 *         # digits
 * ACC* # matches any module code starting with "ACC"
 * ```
 *
 * @module
 */

import type { Pattern } from "./types";

const patternToRE = (...patterns: Pattern[]): RegExp =>
  new RegExp(
    "^" +
      patterns
        .map((pattern) =>
          pattern.replace(/x/g, "[0-9]").replace(/\*/g, "[A-Z0-9]*")
        )
        .join("|") +
      "$"
  );

export { patternToRE };
export { patternSatisfier } from "./satisfiers";
export { patternSchema } from "./schemas";
export { patternTypeSchema } from "./typeSchemas";
export type { Pattern } from "./types";
