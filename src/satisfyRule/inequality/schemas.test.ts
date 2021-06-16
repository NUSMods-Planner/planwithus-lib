import chai from "chai";
import chaiSubset from "chai-subset";
import { assert, property, sample } from "fast-check";
import addContext from "mochawesome/addContext";

import { ajv } from "../../index.test";
import { inequality } from "./index.test";
import { inequalitySchema } from "./schemas";

const ajvValidate = ajv.compile(inequalitySchema);

chai.use(chaiSubset);
chai.should();

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
  it("should validate inequality in the form <=n or >=n", function () {
    sample(inequality, 10).forEach((sample, i) =>
      addContext(this, {
        title: `inequality sample ${i}`,
        value: sample,
      })
    );
    return assert(property(inequality, ajvValidate));
  });

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
