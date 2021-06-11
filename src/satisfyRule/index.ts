import { JSONSchemaType } from "ajv";

import type { Info } from "../info/types";
import type { BlockId } from "../block/blockId";
import { blockIdSchema } from "../block/blockId";
import { inequalitySchema } from "./inequality/schemas";
import type { Inequality } from "./inequality/types";

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

type MCSatisfyRule = { mc: number | Inequality };

const MCSatisfyRuleSchema: JSONSchemaType<MCSatisfyRule> = {
  type: "object",
  required: ["mc"],
  additionalProperties: false,
  properties: {
    mc: {
      anyOf: [{ type: "integer", exclusiveMinimum: 0 }, inequalitySchema],
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
