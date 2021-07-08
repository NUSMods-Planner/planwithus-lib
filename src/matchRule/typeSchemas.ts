import { JSONSchemaType } from "ajv";

import { patternTypeSchema } from "./pattern";
import type {
  AndMatchRule,
  MatchRule,
  MatchRuleObject,
  OrMatchRule,
  PatternMatchRule,
} from "./types";

const patternMatchRuleTypeSchema: JSONSchemaType<PatternMatchRule> = {
  type: "object",
  required: ["pattern"],
};

const andMatchRuleTypeSchema: JSONSchemaType<AndMatchRule> = {
  type: "object",
  required: ["and"],
};

const orMatchRuleTypeSchema: JSONSchemaType<OrMatchRule> = {
  type: "object",
  required: ["or"],
};

const matchRuleObjectTypeSchema: JSONSchemaType<MatchRuleObject> = {
  type: "object",
  required: [],
};

const matchRuleTypeSchema: JSONSchemaType<MatchRule> = {
  type: ["string", "object"],
  anyOf: [patternTypeSchema, matchRuleObjectTypeSchema],
};

export {
  andMatchRuleTypeSchema,
  matchRuleObjectTypeSchema,
  matchRuleTypeSchema,
  orMatchRuleTypeSchema,
  patternMatchRuleTypeSchema,
};
