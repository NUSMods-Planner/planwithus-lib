import { JSONSchemaType } from "ajv";

import type { Info } from "../info";

import type { Pattern } from "./pattern";
import { patternSchema } from "./pattern";

type PatternMatchRule = { pattern: Pattern } & Partial<Info>;

const patternMatchRuleSchema: JSONSchemaType<PatternMatchRule> = {
  type: "object",
  required: ["pattern"],
  additionalProperties: false,
  properties: {
    pattern: patternSchema,
    info: { type: "string", nullable: true },
  },
};

type AndMatchRule = { and: MatchRule[] };

const andMatchRuleSchema: JSONSchemaType<AndMatchRule> = {
  type: "object",
  required: ["and"],
  additionalProperties: false,
  properties: {
    and: {
      type: "array",
      items: {
        anyOf: [
          patternSchema,
          { type: "object", required: [], $ref: "matchRule" },
        ],
      },
    },
  },
};

type OrMatchRule = { or: MatchRule[] };

const orMatchRuleSchema: JSONSchemaType<OrMatchRule> = {
  type: "object",
  required: ["or"],
  additionalProperties: false,
  properties: {
    or: {
      type: "array",
      items: {
        anyOf: [
          patternSchema,
          { type: "object", required: [], $ref: "matchRule" },
        ],
      },
    },
  },
};

type ExcludeMatchRule = { exclude: MatchRule };

const excludeMatchRuleSchema: JSONSchemaType<ExcludeMatchRule> = {
  type: "object",
  required: ["exclude"],
  additionalProperties: false,
  properties: {
    exclude: {
      anyOf: [
        patternSchema,
        { type: "object", required: [], $ref: "matchRule" },
      ],
    },
  },
};

type MatchRule =
  | Pattern
  | PatternMatchRule
  | AndMatchRule
  | OrMatchRule
  | ExcludeMatchRule;

const matchRuleSchema: JSONSchemaType<MatchRule> = {
  $id: "matchRule",
  anyOf: [
    patternSchema,
    patternMatchRuleSchema,
    andMatchRuleSchema,
    orMatchRuleSchema,
    excludeMatchRuleSchema,
  ],
};

export type { MatchRule };
export { matchRuleSchema };
