import { JSONSchemaType } from "ajv";

import type {
  AndSatisfyRule,
  MCSatisfyRule,
  OrSatisfyRule,
  SatisfyRule,
  SatisfyRuleObject,
} from "./types";

const MCSatisfyRuleTypeSchema: JSONSchemaType<MCSatisfyRule> = {
  type: "object",
  required: ["mc"],
};

const andSatisfyRuleTypeSchema: JSONSchemaType<AndSatisfyRule> = {
  type: "object",
  required: ["and"],
};

const orSatisfyRuleTypeSchema: JSONSchemaType<OrSatisfyRule> = {
  type: "object",
  required: ["or"],
};

const satisfyRuleObjectTypeSchema: JSONSchemaType<SatisfyRuleObject> = {
  type: "object",
  required: [],
};

const satisfyRuleTypeSchema: JSONSchemaType<SatisfyRule> = {
  type: ["string", "object"],
  anyOf: [{ type: "string" }, satisfyRuleObjectTypeSchema],
};

export {
  MCSatisfyRuleTypeSchema,
  andSatisfyRuleTypeSchema,
  orSatisfyRuleTypeSchema,
  satisfyRuleObjectTypeSchema,
  satisfyRuleTypeSchema,
};
