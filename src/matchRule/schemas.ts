import { JSONSchemaType } from "ajv";

import { someSchema } from "../some";
import { patternSchema, patternTypeSchema } from "./pattern";
import {
  andMatchRuleTypeSchema,
  matchRuleObjectTypeSchema,
  matchRuleTypeSchema,
  orMatchRuleTypeSchema,
  patternMatchRuleTypeSchema,
} from "./typeSchemas";
import type {
  AndMatchRule,
  MatchRule,
  MatchRuleObject,
  OrMatchRule,
  PatternMatchRule,
} from "./types";

const MATCH_RULE_SCHEMA_ID = "matchRule";

const matchRuleRefSchema: JSONSchemaType<MatchRule> = {
  ...matchRuleTypeSchema,
  $ref: MATCH_RULE_SCHEMA_ID,
};

const patternMatchRuleSchema: JSONSchemaType<PatternMatchRule> = {
  ...patternMatchRuleTypeSchema,
  additionalProperties: false,
  properties: {
    pattern: patternSchema,
    exclude: {
      ...someSchema(patternTypeSchema, patternSchema, {}),
      nullable: true,
      errorMessage: {
        type: "property 'exclude' should be either a pattern or an array of patterns",
      },
    },
    info: {
      type: "string",
      nullable: true,
      errorMessage: { type: "property 'info' should be a string" },
    },
  },
  errorMessage: {
    additionalProperties:
      "pattern match rule should have properties 'pattern', 'exclude' (optional) and 'info' (optional) only",
  },
};

const andMatchRuleSchema: JSONSchemaType<AndMatchRule> = {
  ...andMatchRuleTypeSchema,
  additionalProperties: false,
  properties: {
    and: {
      type: "array",
      items: matchRuleRefSchema,
      errorMessage: {
        type: "property 'and' should be an array of match rules",
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
      items: matchRuleRefSchema,
      errorMessage: {
        type: "property 'or' should be an array of match rules",
      },
    },
  },
  errorMessage: {
    additionalProperties: "or match rule should have property 'or' only",
  },
};

const matchRuleObjectSchema: JSONSchemaType<MatchRuleObject> = {
  ...matchRuleObjectTypeSchema,
  oneOf: [
    patternMatchRuleTypeSchema,
    andMatchRuleTypeSchema,
    orMatchRuleTypeSchema,
  ],
  if: {
    oneOf: [
      patternMatchRuleTypeSchema,
      andMatchRuleTypeSchema,
      orMatchRuleTypeSchema,
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
      },
    },
  },
  errorMessage: {
    oneOf:
      "match rule should have only one of properties 'pattern', 'and', 'or'",
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
  andMatchRuleSchema,
  matchRuleObjectSchema,
  matchRuleRefSchema,
  matchRuleSchema,
  orMatchRuleSchema,
  patternMatchRuleSchema,
};
