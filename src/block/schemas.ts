import { JSONSchemaType } from "ajv";

import { matchRuleRefSchema, matchRuleTypeSchema } from "../matchRule";
import { satisfyRuleRefSchema, satisfyRuleTypeSchema } from "../satisfyRule";
import { someSchema } from "../some";
import { blockTypeSchema } from "./typeSchemas";
import type { Block } from "./types";

const BLOCK_SCHEMA_ID = "block";

const blockRefSchema: JSONSchemaType<Block> = {
  ...blockTypeSchema,
  $ref: BLOCK_SCHEMA_ID,
};

const blockSchema: JSONSchemaType<Block> = {
  ...blockTypeSchema,
  $id: BLOCK_SCHEMA_ID,
  if: blockTypeSchema,
  then: {
    properties: {
      name: {
        type: "string",
        nullable: true,
        errorMessage: { type: "property 'name' should be a string" },
      },
      ay: {
        type: "integer",
        minimum: 1,
        nullable: true,
        errorMessage: {
          type: "property 'ay' should be a positive integer",
          minimum: "property 'ay' should be a positive integer",
        },
      },
      assign: {
        ...someSchema({ type: "string" }, { type: "string" }, {}),
        nullable: true,
        errorMessage: {
          type: "property 'assign' should be either a block ID or an array of block IDs",
        },
      },
      match: {
        ...someSchema(matchRuleTypeSchema, matchRuleRefSchema, {}),
        nullable: true,
        errorMessage: {
          type: "property 'match' should be either a match rule or an array of match rules",
        },
      },
      satisfy: {
        ...someSchema(satisfyRuleTypeSchema, satisfyRuleRefSchema, {}),
        nullable: true,
        errorMessage: {
          type: "property 'satisfy' should be either a satisfy rule or an array of satisfy rules",
        },
      },
      url: {
        type: "string",
        nullable: true,
        errorMessage: "property 'url' should be a string",
      },
      info: {
        type: "string",
        nullable: true,
        errorMessage: "property 'info' should be a string",
      },
    },
    additionalProperties: blockRefSchema,
  },
  errorMessage: {
    type: "block should be an object",
    _: "invalid block", // suppress unnecessary error messages
  },
};

export { blockRefSchema, blockSchema };
