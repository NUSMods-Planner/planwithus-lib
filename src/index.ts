import Ajv from "ajv";
import yaml from "js-yaml";

import type { Block } from "./block";
import { blockSchema, decomposeBlock } from "./block";
import { matchRuleSchema } from "./matchRule";
import { satisfyRuleSchema } from "./satisfyRule";

const ajv = new Ajv({
  allowUnionTypes: true,
  schemas: [matchRuleSchema, satisfyRuleSchema],
});
const ajvValidate = ajv.compile(blockSchema);

const parse = (
  blocks: Record<string, Block>,
  prefix: string,
  contents: string
): Record<string, Block> => {
  const block = yaml.load(contents);
  if (typeof block !== "object" || !block) {
    throw new Error(`${prefix}: unexpected type: ${typeof block}`);
  }

  if (!ajvValidate(block)) {
    throw new Error(JSON.stringify(ajvValidate.errors, null, 2));
  }

  const [mainBlock, flatSubblocks] = decomposeBlock(block);
  if (prefix in Object.keys(blocks)) {
    throw new Error(`block "${prefix}" already exists`);
  }
  blocks[prefix] = mainBlock;
  Object.entries(flatSubblocks).forEach(([name, block]) => {
    const newName = prefix + name;
    if (newName in Object.keys(blocks)) {
      throw new Error(`block "${prefix}" already exists`);
    }
    blocks[newName] = block as Block;
  });

  return blocks;
};

export { parse };
