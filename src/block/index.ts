import { JSONSchemaType } from "ajv";

import type { Info } from "../info";
import type { MatchRule } from "../matchRule";
import type { SatisfyRule } from "../satisfyRule";

import type { BlockId } from "./blockId";
import { blockIdSchema } from "./blockId";

type BlockIds = BlockId | BlockId[];

const blockIdsSchema: JSONSchemaType<BlockIds> = {
  type: ["string", "array"],
  anyOf: [
    blockIdSchema,
    {
      type: "array",
      items: { type: "string" },
    },
  ],
};

type MatchRules = MatchRule | MatchRule[];

const matchRulesSchema: JSONSchemaType<MatchRules> = {
  anyOf: [
    { type: "string", $ref: "matchRule" },
    {
      type: "object",
      required: [],
      $ref: "matchRule",
    },
    {
      type: "array",
      items: {
        anyOf: [
          { type: "string", $ref: "matchRule" },
          {
            type: "object",
            required: [],
            $ref: "matchRule",
          },
        ],
      },
    },
  ],
};

type SatisfyRules = SatisfyRule | SatisfyRule[];

const satisfyRulesSchema: JSONSchemaType<SatisfyRules> = {
  anyOf: [
    { type: "string", $ref: "satisfyRule" },
    {
      type: "object",
      required: [],
      $ref: "satisfyRule",
    },
    {
      type: "array",
      items: {
        anyOf: [
          { type: "string", $ref: "satisfyRule" },
          {
            type: "object",
            required: [],
            $ref: "satisfyRule",
          },
        ],
      },
    },
  ],
};

type Block = {
  name?: string;
  ay?: number;
  assign?: BlockIds;
  match?: MatchRules;
  satisfy?: SatisfyRules;
  url?: string;
  // the following line is used to prevent compilation errors due to the
  // oddities of JSONSchemaType
  [blockId: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
} & Partial<Info>;

const blockSchema: JSONSchemaType<Block> = {
  $id: "block",
  type: "object",
  required: [],
  properties: {
    name: { type: "string", nullable: true },
    ay: { type: "integer", nullable: true },
    assign: {
      type: ["string", "array"],
      ...blockIdsSchema,
      nullable: true,
    },
    match: {
      type: ["string", "object", "array"],
      ...matchRulesSchema,
      nullable: true,
    },
    satisfy: {
      type: ["string", "object", "array"],
      ...satisfyRulesSchema,
      nullable: true,
    },
    url: { type: "string", nullable: true },
    info: { type: "string", nullable: true },
  },
  additionalProperties: {
    type: "object",
    required: [],
    $ref: "block",
  },
};

export type { Block };
export { blockSchema };
