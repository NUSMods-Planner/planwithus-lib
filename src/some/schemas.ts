import { JSONSchemaType } from "ajv";

import type { Some } from "./types";

const someSchema = <T>(
  typeSchema: JSONSchemaType<T>,
  schema: JSONSchemaType<T>,
  arrayProperties: Record<string, unknown>
): JSONSchemaType<Some<T>> =>
  ({
    type: [typeSchema.type, "array"].flat(),
    if: { type: typeSchema.type },
    then: schema,
    else: {
      if: { type: "array" },
      then: { ...arrayProperties, type: "array", items: schema },
    },
  } as JSONSchemaType<Some<T>>); // this disables some checks which require
// typeSchema.type to be explicitly specified

export { someSchema };
