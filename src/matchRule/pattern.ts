import { JSONSchemaType } from "ajv";

type Pattern = string;

const patternSchema: JSONSchemaType<Pattern> = { type: "string" };

export type { Pattern };
export { patternSchema };
