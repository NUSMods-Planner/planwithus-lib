import chai from "chai";
import chaiSubset from "chai-subset";
import {
  array,
  assert,
  integer,
  letrec,
  oneof,
  property,
  record,
  sample,
} from "fast-check";

import { ajv } from "../index.test";
import { blockId } from "../block/blockId/schemas.test";
import { inequality } from "./inequality/schemas.test";
import { satisfyRuleSchema } from "./schemas";

chai.use(chaiSubset);
chai.should();

const ajvValidate = ajv.compile(satisfyRuleSchema);

const { mcSatisfyRule, andSatisfyRule, orSatisfyRule, satisfyRule } = letrec(
  (tie) => ({
    blockId,
    mcSatisfyRule: record(
      { mc: oneof(integer({ min: 1 }), inequality) },
      { requiredKeys: ["mc"] }
    ),
    andSatisfyRule: record({
      and: array(tie("satisfyRule"), { minLength: 1 }),
    }),
    orSatisfyRule: record({ or: array(tie("satisfyRule"), { minLength: 1 }) }),
    satisfyRule: oneof(
      { depthFactor: 0.6, withCrossShrink: true },
      tie("blockId"),
      tie("mcSatisfyRule"),
      tie("andSatisfyRule"),
      tie("orSatisfyRule")
    ),
  })
);

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

describe("satisfyRuleSchema", () => {
  sample(satisfyRule, 4);

  it("should validate satisfy rule with valid block id", () =>
    assert(property(blockId, ajvValidate)));

  it("should validate satisfy rules with valid mc", () =>
    assert(property(mcSatisfyRule, ajvValidate)));

  it("should validate valid recursive satisfy rules", () =>
    assert(property(satisfyRule, ajvValidate)));

  it("should not validate non-string/object", () => {
    const error = {
      instancePath: "",
      message: "satisfy rule should be either a string or an object",
    };
    isInvalidRule(null, error);
    isInvalidRule(undefined, error);
    isInvalidRule(10, error);
    isInvalidRule([12, 24], error);
  });

  it("should not validate satisfy rules with extra properties", () =>
    isInvalidRule(
      {
        and: [
          { or: ["2k"], abc: "def" },
          { mc: 8, ghi: "jkl" },
        ],
        mno: "pqr",
      },
      {
        instancePath: "/and/0",
        message: "or satisfy rule should have property 'or' only",
      },
      {
        instancePath: "/and/1",
        message: "MC satisfy rule should have property 'mc' only",
      },
      {
        instancePath: "",
        message: "and satisfy rule should have property 'and' only",
      }
    ));

  it("should not validate ambiguous satisfy rules", () => {
    const message =
      "satisfy rule should have only one of properties 'mc', 'and', 'or'";
    isInvalidRule(
      {
        or: [
          { mc: 5, and: ["CS2040"] },
          { and: [{ and: ["abc"], or: ["def"] }] },
        ],
      },
      { instancePath: "/or/0", message },
      { instancePath: "/or/1/and/0", message }
    );
  });

  it("should not validate and satisfy rules with non-array property", () => {
    const message =
      "property 'and' should be a non-empty array of satisfy rules";
    isInvalidRule(
      { or: [{ and: {} }, { or: [{ and: 3 }] }] },
      { instancePath: "/or/0/and", message },
      { instancePath: "/or/1/or/0/and", message }
    );
  });

  it("should not validate and satisfy rules with empty array property", () => {
    const message = "property 'and' should not be an empty array";
    isInvalidRule(
      { or: [{ and: [] }, { or: [{ and: [] }] }] },
      { instancePath: "/or/0/and", message },
      { instancePath: "/or/1/or/0/and", message }
    );
  });

  it("should not validate or satisfy rules with non-array property", () => {
    const message =
      "property 'or' should be a non-empty array of satisfy rules";
    isInvalidRule(
      { and: [{ or: {} }, { and: [{ or: 3 }] }] },
      { instancePath: "/and/0/or", message },
      { instancePath: "/and/1/and/0/or", message }
    );
  });

  it("should not validate or satisfy rules with empty array property", () => {
    const message = "property 'or' should not be an empty array";
    isInvalidRule(
      { and: [{ or: [] }, { and: [{ or: [] }] }] },
      { instancePath: "/and/0/or", message },
      { instancePath: "/and/1/and/0/or", message }
    );
  });
});

export { andSatisfyRule, mcSatisfyRule, orSatisfyRule, satisfyRule };
