import { JSONSchemaType } from "ajv";

import type { Some } from "./types";

const someTypeSchema = <T>(
  typeSchema: JSONSchemaType<T>
): JSONSchemaType<Some<T>> =>
  ({
    type: [typeSchema.type, "array"].flat(),
    anyOf: [typeSchema, { type: "array", items: typeSchema }],
  } as JSONSchemaType<Some<T>>); // this disables some checks which require
// typeSchema.type to be explicitly specified

export { someTypeSchema };
