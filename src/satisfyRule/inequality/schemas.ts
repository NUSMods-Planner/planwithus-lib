import { JSONSchemaType } from "ajv";

import { inequalityTypeSchema } from "./typeSchemas";
import type { Inequality } from "./types";

const inequalitySchema: JSONSchemaType<Inequality> = {
  ...inequalityTypeSchema,
  if: inequalityTypeSchema,
  then: { pattern: "^[<>]=\\d+" },
  errorMessage:
    "inequality should be a string in the form of '>=n' or '<=n' for some positive integer n",
};

export { inequalitySchema };
