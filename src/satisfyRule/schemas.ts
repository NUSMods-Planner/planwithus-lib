import { JSONSchemaType } from "ajv";

import { inequalitySchema } from "./inequality/schemas";
import {
  MCSatisfyRuleTypeSchema,
  andSatisfyRuleTypeSchema,
  orSatisfyRuleTypeSchema,
  satisfyRuleObjectTypeSchema,
  satisfyRuleTypeSchema,
} from "./typeSchemas";
import type {
  AndSatisfyRule,
  MCSatisfyRule,
  OrSatisfyRule,
  SatisfyRule,
  SatisfyRuleObject,
} from "./types";

const SATISFY_RULE_SCHEMA_ID = "satisfyRule";

const satisfyRuleRefSchema: JSONSchemaType<SatisfyRule> = {
  ...satisfyRuleTypeSchema,
  $ref: SATISFY_RULE_SCHEMA_ID,
};

const MCSatisfyRuleSchema: JSONSchemaType<MCSatisfyRule> = {
  ...MCSatisfyRuleTypeSchema,
  additionalProperties: false,
  properties: {
    mc: {
      type: ["integer", "string"],
      if: { type: "integer" },
      then: {
        exclusiveMinimum: 0,
        errorMessage: "number should be a positive integer",
      },
      else: {
        if: { type: "string" },
        then: inequalitySchema,
      },
      errorMessage:
        "property 'mc' should be either a positive integer or a string representing an inequality",
    },
  },
  errorMessage: {
    additionalProperties: "MC satisfy rule should have property 'mc' only",
  },
};

const andSatisfyRuleSchema: JSONSchemaType<AndSatisfyRule> = {
  ...andSatisfyRuleTypeSchema,
  additionalProperties: false,
  properties: {
    and: {
      type: "array",
      items: satisfyRuleRefSchema,
      minItems: 1,
      errorMessage: {
        type: "property 'and' should be a non-empty array of satisfy rules",
        minItems: "property 'and' should not be an empty array",
      },
    },
  },
  errorMessage: {
    additionalProperties: "and satisfy rule should have property 'and' only",
  },
};

const orSatisfyRuleSchema: JSONSchemaType<OrSatisfyRule> = {
  ...orSatisfyRuleTypeSchema,
  additionalProperties: false,
  properties: {
    or: {
      type: "array",
      items: satisfyRuleRefSchema,
      minItems: 1,
      errorMessage: {
        type: "property 'or' should be a non-empty array of satisfy rules",
        minItems: "property 'or' should not be an empty array",
      },
    },
  },
  errorMessage: {
    additionalProperties: "or satisfy rule should have property 'or' only",
  },
};

const satisfyRuleObjectSchema: JSONSchemaType<SatisfyRuleObject> = {
  ...satisfyRuleObjectTypeSchema,
  oneOf: [
    MCSatisfyRuleTypeSchema,
    andSatisfyRuleTypeSchema,
    orSatisfyRuleTypeSchema,
  ],
  if: {
    oneOf: [
      MCSatisfyRuleTypeSchema,
      andSatisfyRuleTypeSchema,
      orSatisfyRuleTypeSchema,
    ],
  },
  then: {
    if: MCSatisfyRuleTypeSchema,
    then: MCSatisfyRuleSchema,
    else: {
      if: andSatisfyRuleTypeSchema,
      then: andSatisfyRuleSchema,
      else: {
        if: orSatisfyRuleTypeSchema,
        then: orSatisfyRuleSchema,
      },
    },
  },
  errorMessage: {
    oneOf: "satisfy rule should have only one of properties 'mc', 'and', 'or'",
  },
};

const satisfyRuleSchema: JSONSchemaType<SatisfyRule> = {
  ...satisfyRuleTypeSchema,
  $id: SATISFY_RULE_SCHEMA_ID,
  if: satisfyRuleTypeSchema,
  then: {
    if: { type: "string" },
    else: {
      if: satisfyRuleObjectTypeSchema,
      then: satisfyRuleObjectSchema,
    },
  },
  errorMessage: {
    type: "satisfy rule should be either a string or an object",
    _: "invalid satisfy rule", // suppress unnecessary error messages
  },
};

export {
  MCSatisfyRuleSchema,
  andSatisfyRuleSchema,
  orSatisfyRuleSchema,
  satisfyRuleObjectSchema,
  satisfyRuleRefSchema,
  satisfyRuleSchema,
};
