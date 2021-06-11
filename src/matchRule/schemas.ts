import { JSONSchemaType } from "ajv";

import { infoSchema } from "../info/schemas";
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

const MATCH_RULE_SCHEMA_ID = "matchRule";

const matchRuleRecursiveSchema: JSONSchemaType<MatchRule> = {
  ...matchRuleTypeSchema,
  $ref: MATCH_RULE_SCHEMA_ID,
};

const patternMatchRuleSchema: JSONSchemaType<PatternMatchRule> = {
  ...patternMatchRuleTypeSchema,
  additionalProperties: false,
  properties: {
    pattern: patternSchema,
    info: { ...infoSchema, nullable: true },
  },
  errorMessage: {
    additionalProperties:
      "pattern match rule should have properties 'pattern' and 'info' (optional) only",
  },
};

const andMatchRuleSchema: JSONSchemaType<AndMatchRule> = {
  ...andMatchRuleTypeSchema,
  additionalProperties: false,
  properties: {
    and: {
      type: "array",
      items: matchRuleRecursiveSchema,
      minItems: 1,
      errorMessage: {
        type: "property 'and' should be a non-empty array of match rules",
        minItems: "property 'and' should not be an empty array",
      },
    },
  },
  errorMessage: {
    additionalProperties: "and match rule should have property 'and' only",
  },
};

const orMatchRuleSchema: JSONSchemaType<OrMatchRule> = {
  ...orMatchRuleTypeSchema,
  additionalProperties: false,
  properties: {
    or: {
      type: "array",
      items: matchRuleRecursiveSchema,
      minItems: 1,
      errorMessage: {
        type: "property 'or' should be a non-empty array of match rules",
        minItems: "property 'or' should not be an empty array",
      },
    },
  },
  errorMessage: {
    additionalProperties: "or match rule should have property 'or' only",
  },
};

const excludeMatchRuleSchema: JSONSchemaType<ExcludeMatchRule> = {
  ...excludeMatchRuleTypeSchema,
  additionalProperties: false,
  properties: {
    exclude: matchRuleRecursiveSchema,
  },
  errorMessage: {
    additionalProperties:
      "exclude match rule should have property 'exclude' only",
  },
};

const matchRuleObjectSchema: JSONSchemaType<MatchRuleObject> = {
  ...matchRuleObjectTypeSchema,
  oneOf: [
    patternMatchRuleTypeSchema,
    andMatchRuleTypeSchema,
    orMatchRuleTypeSchema,
    excludeMatchRuleTypeSchema,
  ],
  if: {
    oneOf: [
      patternMatchRuleTypeSchema,
      andMatchRuleTypeSchema,
      orMatchRuleTypeSchema,
      excludeMatchRuleTypeSchema,
    ],
  },
  then: {
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
  },
  errorMessage: {
    oneOf:
      "match rule should have only one of properties 'pattern', 'and', 'or', 'exclude'",
  },
};

const matchRuleSchema: JSONSchemaType<MatchRule> = {
  ...matchRuleTypeSchema,
  $id: MATCH_RULE_SCHEMA_ID,
  if: matchRuleTypeSchema,
  then: {
    if: patternTypeSchema,
    then: patternSchema,
    else: {
      if: matchRuleObjectTypeSchema,
      then: matchRuleObjectSchema,
    },
  },
  errorMessage: {
    type: "match rule should be either a string or an object",
    _: "invalid match rule", // suppress unnecessary error messages
  },
};

export {
  MATCH_RULE_SCHEMA_ID,
  andMatchRuleSchema,
  excludeMatchRuleSchema,
  matchRuleObjectSchema,
  matchRuleSchema,
  orMatchRuleSchema,
  patternMatchRuleSchema,
};
