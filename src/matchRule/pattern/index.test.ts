import { constantFrom, stringOf, tuple } from "fast-check";

const UPPERCASE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const DIGITS = "0123456789".split("");

const modulePrefix = stringOf(constantFrom(...UPPERCASE_LETTERS), {
  minLength: 2,
  maxLength: 3,
});
const moduleNumber = stringOf(constantFrom("x", "*", ...DIGITS), {
  minLength: 1,
  maxLength: 4,
});
const moduleSuffix = stringOf(constantFrom(...UPPERCASE_LETTERS), {
  minLength: 0,
  maxLength: 1,
});

const pattern = tuple(modulePrefix, moduleNumber, moduleSuffix).map((t) =>
  t.join("")
);

export { pattern };
