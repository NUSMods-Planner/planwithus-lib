/**
 * This module reexports functions, schemas and types relating to the
 * [[Inequality]] type.
 *
 * Only two types of inequality strings are allowed:
 * 1. "at least" inequalities (e.g. ">=32"); and
 * 2. "at most" inequalities (e.g. "<=16").
 *
 * The inequality string should start with either "<=" or ">=", followed by a
 * positive integer.
 *
 * @module
 */

import type { Inequality } from "./types";
import { InequalitySign } from "./types";

/**
 * Parses an inequality into its sign and number.
 *
 * @param inequality The specified inequality.
 * @return A pair with the first element as the sign of the inequality and the
 * second element as the number of the inequality.
 */
const parseInequality = (inequality: Inequality): [InequalitySign, number] => {
  const matches = inequality.match(/^[<>]=(\d+)$/);
  if (matches === null || matches.length === 0) {
    throw new Error("inequality is malformed");
  }
  const n = parseInt(matches[1]);
  return [
    inequality.startsWith("<=")
      ? InequalitySign.AtMost
      : InequalitySign.AtLeast,
    n,
  ];
};

export { parseInequality };
export { inequalitySatisfier } from "./satisfiers";
export { inequalitySchema } from "./schemas";
export { inequalityTypeSchema } from "./typeSchemas";
export type { Inequality } from "./types";
export { InequalitySign } from "./types";
