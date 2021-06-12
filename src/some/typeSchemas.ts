import { JSONSchemaType } from "ajv";

import type { Some } from "./types";

const someTypeSchema = <T>(
  typeSchema: JSONSchemaType<T>
): JSONSchemaType<Some<T>> => ({
  type: [typeSchema.type, "array"].flat(),
  anyOf: [typeSchema, { type: "array", items: typeSchema }],
});

export { someTypeSchema };
