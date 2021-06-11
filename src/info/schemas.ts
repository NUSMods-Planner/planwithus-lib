import { JSONSchemaType } from "ajv";

import { infoTypeSchema } from "./typeSchemas";
import type { Info } from "./types";

const infoSchema: JSONSchemaType<Info> = {
  ...infoTypeSchema,
  errorMessage: { type: "info message should be a string" },
};

export { infoSchema };
