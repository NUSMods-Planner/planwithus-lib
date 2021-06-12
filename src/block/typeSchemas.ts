import { JSONSchemaType } from "ajv";

import type { Block } from "./types";

const blockTypeSchema: JSONSchemaType<Block> = { type: "object", required: [] };

export { blockTypeSchema };
