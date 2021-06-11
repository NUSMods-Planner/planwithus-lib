import { JSONSchemaType } from "ajv";

import { infoSchema } from "../info/schemas";
import type { Info } from "../info/types";
import { MATCH_RULE_SCHEMA_ID } from "../matchRule/schemas";
import type { MatchRule } from "../matchRule/types";
import { SATISFY_RULE_SCHEMA_ID } from "../satisfyRule";
import type { SatisfyRule } from "../satisfyRule";
import { blockIdSchema } from "./blockId/schemas";
import type { BlockId } from "./blockId/types";

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
    { type: "string", $ref: MATCH_RULE_SCHEMA_ID },
    {
      type: "object",
      required: [],
      $ref: MATCH_RULE_SCHEMA_ID,
    },
    {
      type: "array",
      items: {
        anyOf: [
          { type: "string", $ref: MATCH_RULE_SCHEMA_ID },
          {
            type: "object",
            required: [],
            $ref: MATCH_RULE_SCHEMA_ID,
          },
        ],
      },
    },
  ],
};

type SatisfyRules = SatisfyRule | SatisfyRule[];

const satisfyRulesSchema: JSONSchemaType<SatisfyRules> = {
  anyOf: [
    { type: "string", $ref: SATISFY_RULE_SCHEMA_ID },
    {
      type: "object",
      required: [],
      $ref: SATISFY_RULE_SCHEMA_ID,
    },
    {
      type: "array",
      items: {
        anyOf: [
          { type: "string", $ref: SATISFY_RULE_SCHEMA_ID },
          {
            type: "object",
            required: [],
            $ref: SATISFY_RULE_SCHEMA_ID,
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
  info?: Info;
  // the following line is used to prevent compilation errors due to the
  // oddities of JSONSchemaType
  [blockId: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

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
    info: { ...infoSchema, nullable: true },
  },
  additionalProperties: {
    type: "object",
    required: [],
    $ref: "block",
  },
};

const decomposeBlock = (
  block: Block,
  prefix?: string
): [Block, Record<string, Block>] => {
  if (prefix === undefined || prefix === null) {
    prefix = "";
  }

  const { name, ay, assign, match, satisfy, url, info, ...subblocks } = block;
  const mainBlock = { name, ay, assign, match, satisfy, url, info };
  const flatSubblocks = Object.entries(subblocks)
    .map(([sbName, sb]) => {
      const sbPrefix = [prefix, sbName].join("/");
      return [sbPrefix, ...decomposeBlock(sb, sbPrefix)];
    })
    .reduce(
      (accFlatSbs, [sbPrefix, sbMainBlock, sbFlatSbs]) => ({
        ...accFlatSbs,
        [sbPrefix as string]: sbMainBlock,
        ...(sbFlatSbs as Record<string, Block>),
      }),
      {}
    );
  return [mainBlock, flatSubblocks];
};

export type { Block };
export { blockSchema, decomposeBlock };
