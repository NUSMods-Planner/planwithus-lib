import { JSONSchemaType } from "ajv";

type Pattern = string;

const patternSchema: JSONSchemaType<Pattern> = {
  type: "string",
  pattern: "^[A-Z0-9x*]+$",
  errorMessage:
    "pattern should be a non-empty string composed of A-Z, 0-9, x or *",
};

export type { Pattern };
export { patternSchema };
