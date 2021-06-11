import { JSONSchemaType } from "ajv";

import { Inequality } from "./types";

const inequalityTypeSchema: JSONSchemaType<Inequality> = { type: "string" };

export { inequalityTypeSchema };
