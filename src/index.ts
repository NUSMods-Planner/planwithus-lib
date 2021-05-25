import Ajv from "ajv";

import { blockSchema } from "./block";
import { matchRuleSchema } from "./matchRule";
import { satisfyRuleSchema } from "./satisfyRule";

const ajv = new Ajv({
  strict: true,
  allowUnionTypes: true,
  schemas: [matchRuleSchema, satisfyRuleSchema],
});
const validate = ajv.compile(blockSchema);

export { validate };
