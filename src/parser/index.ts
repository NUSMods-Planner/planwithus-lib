/**
 * This module provides parsing functionality for blocks using
 * [ajv](https://ajv.js.org/), a JSON schema validator, and
 * [js-yaml](https://github.com/nodeca/js-yaml), a YAML parser in JavaScript.
 *
 * @module
 */

import Ajv from "ajv";
import ajvErrors from "ajv-errors";
import yaml from "js-yaml";

import type { Block } from "../block";
import { blockSchema } from "../block";
import { matchRuleSchema } from "../matchRule";
import { satisfyRuleSchema } from "../satisfyRule";

const ajv = new Ajv({
  allErrors: true, // necessary for ajv-errors
  allowUnionTypes: true,
  schemas: [matchRuleSchema, satisfyRuleSchema],
});
ajvErrors(ajv);
const ajvValidate = ajv.compile(blockSchema);

/**
 * Parses an unknown object into a [[Block]].
 *
 * @param block Object representing a block.
 * @return The desired block.
 */
const parse = (block: unknown): Block => {
  if (!ajvValidate(block)) {
    throw new Error(JSON.stringify(ajvValidate.errors, null, 2));
  }
  return block;
};

/**
 * Parses a YAML string into a [[Block]] using
 * [js-yaml](https://github.com/nodeca/js-yaml).
 *
 * @param contents YAML string represent a block.
 * @return The desired block.
 */
const parseYAML = (contents: string): Block => {
  const block = yaml.load(contents);
  if (typeof block !== "object" || !block) {
    throw new Error(`unexpected type: ${typeof block}`);
  }
  return parse(block);
};

export { parse, parseYAML };
