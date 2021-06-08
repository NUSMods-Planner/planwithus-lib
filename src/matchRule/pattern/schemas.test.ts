import { should } from "chai";
import { assert, constantFrom, property, stringOf, tuple } from "fast-check";

import { ajv } from "../../index.test";
import { patternSchema } from "./schemas";

const ajvValidate = ajv.compile(patternSchema);

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
const pattern = tuple(modulePrefix, moduleNumber, moduleSuffix).map(
  (t: [string, string, string]) => t.join("")
);

should();

const isValidPattern = (patternStr: string) =>
  ajvValidate(patternStr).should.be.true;

const isInvalidPattern = (patternStr: string) => {
  ajvValidate(patternStr).should.be.false;
  ajvValidate.should.have.property("errors");

  const errors = ajvValidate.errors!;
  errors.should.be.an("array");
  errors.should.have.lengthOf.above(0);

  const error = errors[0];
  error.should.have.property("message");
  error.message!.should.equal(
    "pattern should be a non-empty string composed of A-Z, 0-9, x or *"
  );
};

describe("patternSchema", () => {
  it("should validate valid module code", () =>
    ["ACC1002", "GER1000", "IS1103", "CS1231S", "MA1102R", "MA2101S"].forEach(
      isValidPattern
    ));
  it("should validate wildcard", () => isValidPattern("*"));
  it("should validate non-empty pattern composed of A-Z, 0-9, x or *", () =>
    assert(property(pattern, (patternStr) => ajvValidate(patternStr))));

  it("should not validate empty pattern", () => isInvalidPattern(""));
  it("should not validate pattern with invalid characters", () =>
    ["AB123a", "Ac123a", "AB123^S", "AB1*3^S", "$A1*3^S", "/A1x33S"].forEach(
      isInvalidPattern
    ));
});

export { pattern };
