import Ajv from "ajv";
import ajvErrors from "ajv-errors";
import yaml from "js-yaml";

import type { Block } from "../block";
import { blockSchema } from "../block";
import { matchRuleSchema } from "../matchRule/schemas";
import { satisfyRuleSchema } from "../satisfyRule/schemas";

const ajv = new Ajv({
  allErrors: true, // necessary for ajv-errors
  allowUnionTypes: true,
  schemas: [matchRuleSchema, satisfyRuleSchema],
});
ajvErrors(ajv);
const ajvValidate = ajv.compile(blockSchema);

const parse = (block: unknown): Block => {
  if (!ajvValidate(block)) {
    throw new Error(JSON.stringify(ajvValidate.errors, null, 2));
  }
  return block;
};

const parseYAML = (contents: string): Block => {
  const block = yaml.load(contents);
  if (typeof block !== "object" || !block) {
    throw new Error(`unexpected type: ${typeof block}`);
  }
  return parse(block);
};

export { parse, parseYAML };
