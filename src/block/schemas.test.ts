import chai from "chai";
import chaiSubset from "chai-subset";
import { assert, property, sample } from "fast-check";
import addContext from "mochawesome/addContext";

import { ajv } from "../index.test";
import { matchRuleSchema } from "../matchRule";
import { satisfyRuleSchema } from "../satisfyRule";
import { block } from "./index.test";
import { blockSchema } from "./schemas";

chai.use(chaiSubset);
chai.should();

const ajvValidate = ajv
  .addSchema(matchRuleSchema)
  .addSchema(satisfyRuleSchema)
  .compile(blockSchema);

const isInvalidBlock = (
  block: unknown,
  ...expectedErrors: Record<string, unknown>[]
) => {
  ajvValidate(block).should.be.false;
  ajvValidate.should.have.property("errors");

  const errors = ajvValidate.errors!;
  errors.should.be.an("array");
  errors.should.containSubset(expectedErrors);
};

describe("blockSchema", () => {
  it("should validate valid block", function () {
    sample(block, 10).forEach((sample, i) =>
      addContext(this, {
        title: `block sample ${i}`,
        value: sample,
      })
    );
    return assert(property(block, ajvValidate));
  });

  it("should not validate non-object", () => {
    const error = {
      instancePath: "",
      message: "block should be an object",
    };
    isInvalidBlock(null, error);
    isInvalidBlock(undefined, error);
    isInvalidBlock(10, error);
    isInvalidBlock([12, 24], error);
    isInvalidBlock("abc", error);
  });

  it("should not validate block with invalid properties", () =>
    isInvalidBlock(
      {
        name: { foo: "bar" },
        ay: -1000,
        assign: {},
        match: 1,
        satisfy: 2,
        url: { abc: "def" },
        info: 42,
      },
      { instancePath: "/name", message: "property 'name' should be a string" },
      {
        instancePath: "/ay",
        message: "property 'ay' should be a positive integer",
      },
      {
        instancePath: "/assign",
        message:
          "property 'assign' should be either a block ID or an array of block IDs",
      },
      {
        instancePath: "/match",
        message:
          "property 'match' should be either a match rule or an array of match rules",
      },
      {
        instancePath: "/satisfy",
        message:
          "property 'satisfy' should be either a satisfy rule or an array of satisfy rules",
      },
      { instancePath: "/url", message: "property 'url' should be a string" },
      { instancePath: "/info", message: "property 'info' should be a string" }
    ));
});
