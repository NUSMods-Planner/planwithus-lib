import { JSONSchemaType } from "ajv";

import { patternSchema } from "./pattern/schemas";
import { patternTypeSchema } from "./pattern/typeSchemas";
import {
  andMatchRuleTypeSchema,
  excludeMatchRuleTypeSchema,
  matchRuleObjectTypeSchema,
  matchRuleTypeSchema,
  orMatchRuleTypeSchema,
  patternMatchRuleTypeSchema,
} from "./typeSchemas";
import type {
  AndMatchRule,
  ExcludeMatchRule,
  MatchRule,
  MatchRuleObject,
  OrMatchRule,
  PatternMatchRule,
} from "./types";

const matchRuleRecursiveSchema: JSONSchemaType<MatchRule> = {
  anyOf: [matchRuleTypeSchema],
  if: patternTypeSchema,
  then: patternSchema,
  else: {
    if: matchRuleObjectTypeSchema,
    then: { type: "object", required: [], $ref: "matchRule" },
  },
};

const patternMatchRuleSchema: JSONSchemaType<PatternMatchRule> = {
  type: "object",
  required: ["pattern"],
  additionalProperties: false,
  properties: {
    pattern: patternSchema,
    info: { type: "string", nullable: true },
  },
};

const andMatchRuleSchema: JSONSchemaType<AndMatchRule> = {
  type: "object",
  required: ["and"],
  properties: {
    and: {
      type: "array",
      items: matchRuleRecursiveSchema,
    },
  },
};

const orMatchRuleSchema: JSONSchemaType<OrMatchRule> = {
  type: "object",
  required: ["or"],
  additionalProperties: false,
  properties: {
    or: {
      type: "array",
      items: matchRuleRecursiveSchema,
    },
  },
};

const excludeMatchRuleSchema: JSONSchemaType<ExcludeMatchRule> = {
  type: "object",
  required: ["exclude"],
  additionalProperties: false,
  properties: {
    exclude: matchRuleRecursiveSchema,
  },
};

const matchRuleObjectSchema: JSONSchemaType<MatchRuleObject> = {
  type: "object",
  required: [],
  anyOf: [
    patternMatchRuleTypeSchema,
    andMatchRuleTypeSchema,
    orMatchRuleTypeSchema,
    excludeMatchRuleTypeSchema,
  ],
  if: patternMatchRuleTypeSchema,
  then: patternMatchRuleSchema,
  else: {
    if: andMatchRuleTypeSchema,
    then: andMatchRuleSchema,
    else: {
      if: orMatchRuleTypeSchema,
      then: orMatchRuleSchema,
      else: {
        if: excludeMatchRuleTypeSchema,
        then: excludeMatchRuleSchema,
      },
    },
  },
};

const matchRuleSchema: JSONSchemaType<MatchRule> = {
  $id: "matchRule",
  anyOf: [patternTypeSchema, matchRuleObjectTypeSchema],
  if: patternTypeSchema,
  then: patternSchema,
  else: {
    if: matchRuleObjectTypeSchema,
    then: matchRuleObjectSchema,
  },
  errorMessage: "invalid match rule",
};

export {
  patternMatchRuleSchema,
  andMatchRuleSchema,
  orMatchRuleSchema,
  excludeMatchRuleSchema,
  matchRuleObjectSchema,
  matchRuleSchema,
};
