import { JSONSchemaType } from "ajv";

import type { Info } from "../info";
import type { BlockId } from "../block/blockId";
import { blockIdSchema } from "../block/blockId";

type BlockIdSatisfyRule = { blockId: BlockId } & Partial<Info>;

const blockIdSatisfyRuleSchema: JSONSchemaType<BlockIdSatisfyRule> = {
  type: "object",
  required: ["blockId"],
  additionalProperties: false,
  properties: {
    blockId: blockIdSchema,
    info: { type: "string", nullable: true },
  },
};

// TODO: Implement separate inequality type & schema
type MCSatisfyRule = { mc: number | string };

const MCSatisfyRuleSchema: JSONSchemaType<MCSatisfyRule> = {
  type: "object",
  required: ["mc"],
  additionalProperties: false,
  properties: {
    mc: {
      anyOf: [{ type: "integer" }, { type: "string", pattern: "^[<>]=\\d+" }],
    },
  },
};

type AndSatisfyRule = { and: SatisfyRule[] };

const andSatisfyRuleSchema: JSONSchemaType<AndSatisfyRule> = {
  type: "object",
  required: ["and"],
  additionalProperties: false,
  properties: {
    and: {
      type: "array",
      items: {
        anyOf: [
          blockIdSchema,
          { type: "object", required: [], $ref: "satisfyRule" },
        ],
      },
    },
  },
};

type OrSatisfyRule = { or: SatisfyRule[] };

const orSatisfyRuleSchema: JSONSchemaType<OrSatisfyRule> = {
  type: "object",
  required: ["or"],
  additionalProperties: false,
  properties: {
    or: {
      type: "array",
      items: {
        anyOf: [
          blockIdSchema,
          { type: "object", required: [], $ref: "satisfyRule" },
        ],
      },
    },
  },
};

type SatisfyRule =
  | BlockId
  | BlockIdSatisfyRule
  | MCSatisfyRule
  | AndSatisfyRule
  | OrSatisfyRule;

const satisfyRuleSchema: JSONSchemaType<SatisfyRule> = {
  $id: "satisfyRule",
  anyOf: [
    { type: "string" },
    blockIdSatisfyRuleSchema,
    MCSatisfyRuleSchema,
    andSatisfyRuleSchema,
    orSatisfyRuleSchema,
  ],
};

export type { SatisfyRule };
export { satisfyRuleSchema };
