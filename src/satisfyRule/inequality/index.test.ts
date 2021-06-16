import { constantFrom, integer, tuple } from "fast-check";

const inequality = tuple(constantFrom("<=", ">="), integer({ min: 1 })).map(
  ([sign, n]: [string, number]) => `${sign}${n}`
);

export { inequality };
