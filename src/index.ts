import Ajv from "ajv";
import yaml from "js-yaml";

import type { Block } from "./block";
import { blockSchema } from "./block";
import { matchRuleSchema } from "./matchRule";
import { satisfyRuleSchema } from "./satisfyRule";

const ajv = new Ajv({
  allowUnionTypes: true,
  schemas: [matchRuleSchema, satisfyRuleSchema],
});
const ajvValidate = ajv.compile(blockSchema);

const parse = (contents: string): Block => {
  const block = yaml.load(contents);
  if (typeof block !== "object" || !block) {
    throw new Error(`unexpected type: ${typeof block}`);
  }
  if (!ajvValidate(block)) {
    throw new Error(JSON.stringify(ajvValidate.errors, null, 2));
  }
  return block;
};

export { parse };
