import chai from "chai";
import chaiSubset from "chai-subset";
import { assert, property } from "fast-check";

import { ajv } from "../../index.test";
import { pattern } from "./index.test";
import { patternSchema } from "./schemas";

chai.use(chaiSubset);
chai.should();

const ajvValidate = ajv.compile(patternSchema);

const isInvalidPattern = (patternStr: string) => {
  ajvValidate(patternStr).should.be.false;
  ajvValidate.should.have.property("errors");

  const errors = ajvValidate.errors!;
  errors.should.be.an("array");
  errors.should.containSubset([
    {
      instancePath: "",
      message:
        "pattern should be a non-empty string composed of A-Z, 0-9, x or *",
    },
  ]);
};

describe("patternSchema", () => {
  it("should validate non-empty pattern composed of A-Z, 0-9, x or *", () =>
    assert(property(pattern, ajvValidate), {
      examples: [["*"], ["ACC1002"], ["IS1103"], ["CS1231S"], ["MA1102R"]],
    }));

  it("should not validate empty pattern", () => isInvalidPattern(""));
  it("should not validate pattern with invalid characters", () =>
    ["AB123a", "Ac123a", "AB123^S", "AB1*3^S", "$A1*3^S", "/A1x33S"].forEach(
      isInvalidPattern
    ));
});
