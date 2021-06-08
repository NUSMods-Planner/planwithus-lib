import { JSONSchemaType } from "ajv";

import { patternTypeSchema } from "./typeSchemas";
import type { Pattern } from "./types";

const patternSchema: JSONSchemaType<Pattern> = {
  ...patternTypeSchema,
  pattern: "^[A-Z0-9x*]+$",
  errorMessage:
    "pattern should be a non-empty string composed of A-Z, 0-9, x or *",
};

export { patternSchema };
