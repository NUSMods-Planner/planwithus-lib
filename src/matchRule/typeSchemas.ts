import { JSONSchemaType } from "ajv";

import { patternTypeSchema } from "./pattern/typeSchemas";
import type {
  AndMatchRule,
  ExcludeMatchRule,
  MatchRule,
  MatchRuleObject,
  OrMatchRule,
  PatternMatchRule,
} from "./types";

const matchRuleObjectTypeSchema: JSONSchemaType<MatchRuleObject> = {
  type: "object",
  required: [],
};

const matchRuleTypeSchema: JSONSchemaType<MatchRule> = {
  anyOf: [patternTypeSchema, matchRuleObjectTypeSchema],
};

const patternMatchRuleTypeSchema: JSONSchemaType<PatternMatchRule> = {
  type: "object",
  required: ["pattern"],
  properties: {
    pattern: patternTypeSchema,
    info: { type: "string", nullable: true },
  },
};

const andMatchRuleTypeSchema: JSONSchemaType<AndMatchRule> = {
  type: "object",
  required: ["and"],
  properties: {
    and: {
      type: "array",
      items: matchRuleTypeSchema,
    },
  },
};

const orMatchRuleTypeSchema: JSONSchemaType<OrMatchRule> = {
  type: "object",
  required: ["or"],
  properties: {
    or: {
      type: "array",
      items: matchRuleTypeSchema,
    },
  },
};

const excludeMatchRuleTypeSchema: JSONSchemaType<ExcludeMatchRule> = {
  type: "object",
  required: ["exclude"],
  properties: {
    exclude: matchRuleTypeSchema,
  },
};

export {
  andMatchRuleTypeSchema,
  excludeMatchRuleTypeSchema,
  matchRuleObjectTypeSchema,
  matchRuleTypeSchema,
  orMatchRuleTypeSchema,
  patternMatchRuleTypeSchema,
};
