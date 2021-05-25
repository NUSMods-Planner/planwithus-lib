import { JSONSchemaType } from "ajv";

type BlockId = string;
const blockIdSchema: JSONSchemaType<BlockId> = { type: "string" };

export type { BlockId };
export { blockIdSchema };
