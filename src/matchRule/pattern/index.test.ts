import type { Arbitrary } from "fast-check";
import { constant, constantFrom, set, stringOf, tuple } from "fast-check";

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

const replaceCharWithArb = (char: string): Arbitrary<string> => {
  if (char.match(/^[0-9A-Z]$/)) {
    return constant(char);
  } else if (char === "x") {
    return constantFrom(...DIGITS);
  } else if (char === "*") {
    return stringOf(constantFrom(...UPPERCASE_LETTERS, ...DIGITS), {
      minLength: 0,
      maxLength: 8,
    });
  } else {
    throw new Error("char is not a valid pattern character");
  }
};

const patternExample = (patternStr: string): Arbitrary<string> =>
  patternStr
    .split("")
    .map(replaceCharWithArb)
    .reduce((acc, arb) => tuple(acc, arb).map(([x, y]) => x + y));

const patternExampleList = pattern.chain((patternStr) =>
  tuple(constant(patternStr), set(patternExample(patternStr), { minLength: 1 }))
);

export { pattern, patternExampleList };
