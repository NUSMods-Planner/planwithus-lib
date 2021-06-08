import { JSONSchemaType } from "ajv";

import { Pattern } from "./types";

const patternTypeSchema: JSONSchemaType<Pattern> = { type: "string" };

export { patternTypeSchema };
