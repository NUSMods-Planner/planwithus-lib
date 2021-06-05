import fs from "fs/promises";
import glob from "globby";
import path from "path";

import { parseYAML } from "./parser";
import { Verifier } from "./verifier";

const BLOCK_CLASSES = ["primary", "second", "minor"];
const PATH_PREFIX = path.join(__dirname, "../blocks");

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
