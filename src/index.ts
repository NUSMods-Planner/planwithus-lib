import Ajv from "ajv";
import fs from "fs/promises";
import glob from "globby";
import yaml from "js-yaml";
import path from "path";

import type { Block } from "./block";
import { blockSchema } from "./block";
import { matchRuleSchema } from "./matchRule";
import { satisfyRuleSchema } from "./satisfyRule";
import { Verifier } from "./verifier";

const BLOCK_CLASSES = ["primary", "second", "minor"];
const PATH_PREFIX = path.join(__dirname, "../blocks");

const ajv = new Ajv({
  allowUnionTypes: true,
  schemas: [matchRuleSchema, satisfyRuleSchema],
});
const ajvValidate = ajv.compile(blockSchema);

const parseYAML = (contents: string): Block => {
  const block = yaml.load(contents);
  if (typeof block !== "object" || !block) {
    throw new Error(`unexpected type: ${typeof block}`);
  }
  if (!ajvValidate(block)) {
    throw new Error(JSON.stringify(ajvValidate.errors, null, 2));
  }
  return block;
};

const loadBlocks = async (type: string): Promise<Verifier> => {
  const files = await glob(`${PATH_PREFIX}/${type}/**/*.yml`);
  const fileContents = await Promise.all(
    files.map((fileName) => fs.readFile(fileName, "utf8"))
  );

  const verifier = new Verifier();
  files.forEach((filename, i) =>
    verifier.addBlock(
      path.basename(filename).replace(/\.yml$/, ""),
      parseYAML(fileContents[i])
    )
  );
  return verifier;
};

const initVerifiers = async (): Promise<Record<string, Verifier>> => {
  const verifiers = await Promise.all(BLOCK_CLASSES.map(loadBlocks));
  return Object.fromEntries(
    BLOCK_CLASSES.map((prefix, i) => [prefix, verifiers[i]])
  );
};

export { BLOCK_CLASSES, initVerifiers };
