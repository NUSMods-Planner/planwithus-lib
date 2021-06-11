import { JSONSchemaType } from "ajv";

import type { BlockId } from "./types";

const blockIdTypeSchema: JSONSchemaType<BlockId> = { type: "string" };

export { blockIdTypeSchema };
