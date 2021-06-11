import { JSONSchemaType } from "ajv";

import { blockIdTypeSchema } from "./typeSchemas";
import type { BlockId } from "./types";

const blockIdSchema: JSONSchemaType<BlockId> = blockIdTypeSchema;

export { blockIdSchema };
