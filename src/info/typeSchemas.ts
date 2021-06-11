import { JSONSchemaType } from "ajv";

import type { Info } from "./types";

const infoTypeSchema: JSONSchemaType<Info> = { type: "string" };

export { infoTypeSchema };
