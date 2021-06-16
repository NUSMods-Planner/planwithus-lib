import { constantFrom, integer, tuple } from "fast-check";

const inequality = tuple(
  constantFrom("<=", ">="),
  integer({ min: 1, max: 200 })
).map(([sign, n]: [string, number]) => `${sign}${n}`);

export { inequality };
