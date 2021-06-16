import chai from "chai";
import chaiSubset from "chai-subset";
import { assert, property } from "fast-check";

import { ajv } from "../index.test";
import { matchRule, patternMatchRule } from "./index.test";
import { pattern } from "./pattern/index.test";
import { matchRuleSchema } from "./schemas";

chai.use(chaiSubset);
chai.should();

const ajvValidate = ajv.compile(matchRuleSchema);

const isInvalidRule = (
  rule: unknown,
  ...expectedErrors: Record<string, unknown>[]
) => {
  ajvValidate(rule).should.be.false;
  ajvValidate.should.have.property("errors");

  const errors = ajvValidate.errors!;
  errors.should.be.an("array");
  errors.should.containSubset(expectedErrors);
};

describe("matchRuleSchema", () => {
  it("should validate match rule with valid pattern", () =>
    assert(property(pattern, ajvValidate)));

  it("should validate match rules with valid pattern and info", () =>
    assert(property(patternMatchRule, ajvValidate)));

  it("should validate valid recursive match rules", () =>
    assert(property(matchRule, ajvValidate)));

  it("should not validate non-string/object", () => {
    const error = {
      instancePath: "",
      message: "match rule should be either a string or an object",
    };
    isInvalidRule(null, error);
    isInvalidRule(undefined, error);
    isInvalidRule(10, error);
    isInvalidRule([12, 24], error);
  });

  it("should not validate match rules with extra properties", () =>
    isInvalidRule(
      {
        and: [{ or: [{ pattern: "CS2103T", info2: "foobar" }], abc: "def" }],
        mno: "pqr",
      },
      {
        instancePath: "/and/0/or/0",
        message:
          "pattern match rule should have properties 'pattern', 'exclude' (optional) and 'info' (optional) only",
      },
      {
        instancePath: "/and/0",
        message: "or match rule should have property 'or' only",
      },
      {
        instancePath: "",
        message: "and match rule should have property 'and' only",
      }
    ));

  it("should not validate ambiguous match rules", () => {
    const message =
      "match rule should have only one of properties 'pattern', 'and', 'or'";
    isInvalidRule(
      {
        or: [
          { pattern: "CS1231", and: [] },
          { pattern: "CS1231", or: [] },
          { and: [{ and: ["abc"], or: ["def"] }] },
        ],
      },
      { instancePath: "/or/0", message },
      { instancePath: "/or/1", message },
      { instancePath: "/or/2/and/0", message }
    );
  });

  it("should not validate pattern match rule with invalid patterns", () => {
    const message =
      "pattern should be a non-empty string composed of A-Z, 0-9, x or *";
    isInvalidRule(
      {
        and: [
          "CS210c",
          { pattern: "CS2100", exclude: "CS1231s" },
          { pattern: "CS210#T", exclude: ["CS1231", "CS21%"] },
        ],
      },
      { instancePath: "/and/0", message },
      { instancePath: "/and/1/exclude", message },
      { instancePath: "/and/2/pattern", message },
      { instancePath: "/and/2/exclude/1", message }
    );
  });

  it("should not validate pattern match rule with non-string/array exclude", () => {
    const message =
      "property 'exclude' should be either a pattern or an array of patterns";
    isInvalidRule(
      {
        or: [
          { pattern: "CS2101", exclude: {} },
          { pattern: "CS2101", exclude: 5 },
        ],
      },
      { instancePath: "/or/0/exclude", message },
      { instancePath: "/or/1/exclude", message }
    );
  });

  it("should not validate pattern match rule with non-string info", () => {
    const message = "property 'info' should be a string";
    isInvalidRule(
      { pattern: "CS2101", info: 42 },
      { instancePath: "/info", message }
    );
  });

  it("should not validate and match rules with non-array property", () => {
    const message = "property 'and' should be an array of match rules";
    isInvalidRule(
      { or: [{ and: {} }, { or: [{ and: 3 }] }] },
      { instancePath: "/or/0/and", message },
      { instancePath: "/or/1/or/0/and", message }
    );
  });

  it("should not validate or match rules with non-array property", () => {
    const message = "property 'or' should be an array of match rules";
    isInvalidRule(
      { or: [{ or: {} }, { and: [{ or: 3 }] }] },
      { instancePath: "/or/0/or", message },
      { instancePath: "/or/1/and/0/or", message }
    );
  });
});
