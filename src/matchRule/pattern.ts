import { JSONSchemaType } from "ajv";

type Pattern = string;

const patternSchema: JSONSchemaType<Pattern> = {
  type: "string",
  pattern: "^[A-Z0-9x*]*$",
};

export type { Pattern };
export { patternSchema };
