import { JSONSchemaType } from "ajv";

import { infoSchema } from "../info/schemas";
import { matchRuleRefSchema } from "../matchRule/schemas";
import { matchRuleTypeSchema } from "../matchRule/typeSchemas";
import { satisfyRuleRefSchema } from "../satisfyRule/schemas";
import { satisfyRuleTypeSchema } from "../satisfyRule/typeSchemas";
import { someSchema } from "../some/schemas";
import { blockIdSchema } from "./blockId/schemas";
import { blockIdTypeSchema } from "./blockId/typeSchemas";
import { blockTypeSchema } from "./typeSchemas";
import type { Block } from "./types";

const blockSchema: JSONSchemaType<Block> = {
  ...blockTypeSchema,
  $id: "block",
  if: blockTypeSchema,
  then: {
    properties: {
      name: { type: "string", nullable: true },
      ay: { type: "integer", nullable: true },
      assign: {
        ...someSchema(blockIdTypeSchema, blockIdSchema, { minItems: 1 }),
        nullable: true,
      },
      match: {
        ...someSchema(matchRuleTypeSchema, matchRuleRefSchema, { minItems: 1 }),
        nullable: true,
      },
      satisfy: {
        ...someSchema(satisfyRuleTypeSchema, satisfyRuleRefSchema, {
          minItems: 1,
        }),
        nullable: true,
      },
      url: { type: "string", nullable: true },
      info: { ...infoSchema, nullable: true },
    },
    additionalProperties: {
      ...blockTypeSchema.additionalProperties,
      $ref: "block",
    },
  },
};

export { blockSchema };
