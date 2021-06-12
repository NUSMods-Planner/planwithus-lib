import chai from "chai";
import chaiSubset from "chai-subset";
import {
  array,
  assert,
  constantFrom,
  integer,
  letrec,
  oneof,
  property,
  record,
  string,
  tuple,
  webUrl,
} from "fast-check";

import { ajv } from "../index.test";
import { matchRule } from "../matchRule/schemas.test";
import { satisfyRule } from "../satisfyRule/schemas.test";
import { some } from "../some/schemas.test";
import { blockSchema } from "./schemas";
import type { Block } from "./types";

chai.use(chaiSubset);
chai.should();

const ajvValidate = ajv.compile(blockSchema);

const BLOCK_KEYWORDS = [
  "name",
  "ay",
  "assign",
  "match",
  "satisfy",
  "url",
  "info",
];

const { block } = letrec((tie) => ({
  block: tuple(
    record(
      {
        name: string(),
        ay: integer({ min: 1950, max: 2030 }),
        assign: some(string(), { maxLength: 5 }),
        match: some(matchRule, { maxLength: 5 }),
        satisfy: some(satisfyRule, { maxLength: 5 }),
        url: webUrl(),
        info: string(),
      },
      { requiredKeys: [] }
    ),
    oneof(
      { depthFactor: 0.8, withCrossShrink: true },
      constantFrom([]),
      array(
        tuple(
          string().filter((blockId) => !BLOCK_KEYWORDS.includes(blockId)),
          tie("block")
        ),
        { maxLength: 5 }
      )
    )
  ).map(
    (t: [unknown, [string, unknown][]]) =>
      ({
        ...(t[0] as Block),
        ...(Object.fromEntries(t[1]) as Record<string, Block>),
      } as Block)
  ),
}));

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
  it("should validate valid block", () => assert(property(block, ajvValidate)));

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
