import { should } from "chai";
import { assert, constantFrom, integer, property, tuple } from "fast-check";

import { ajv } from "../../index.test";
import { inequalitySchema } from "./schemas";

const ajvValidate = ajv.compile(inequalitySchema);

const inequality = tuple(constantFrom("<=", ">="), integer({ min: 1 })).map(
  ([sign, n]: [string, number]) => `${sign}${n}`
);

should();

const isInvalidInequality = (inequalityStr: string) => {
  ajvValidate(inequalityStr).should.be.false;
  ajvValidate.should.have.property("errors");

  const errors = ajvValidate.errors!;
  errors.should.be.an("array");
  errors.should.containSubset([
    {
      instancePath: "",
      message:
        "inequality should be a string in the form of '>=n' or '<=n' for some positive integer n",
    },
  ]);
};

describe("inequalitySchema", () => {
  it("should validate inequality in the form <=n or >=n", () =>
    assert(property(inequality, ajvValidate)));

  it("should not validate inequality of invalid form", () =>
    [
      "",
      "==23",
      "23",
      "<23",
      ">23",
      "<=-1",
      ">=-1",
      "<= 2",
      ">= 1",
      "> 3",
      "< 3",
      "<=3a",
      ">=3a",
      "a<=3",
      "a>=3",
    ].forEach(isInvalidInequality));
});

export { inequality };
