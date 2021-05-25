import fs from "fs/promises";
import path from "path";
import glob from "globby";
import yaml from "js-yaml";

import { validate } from "./";
import { Block } from "./block";

const PATH_PREFIX = path.join(__dirname, "../examples");

const pathToBlockName = (type: string, fileName: string) =>
  path.relative(path.join(PATH_PREFIX, type), fileName).replace(/\.yml$/g, "");

type Blocks = {
  [blockName: string]: Block;
};

const parseFile = (
  blocks: Blocks,
  type: string,
  fileName: string,
  contents: string
) => {
  console.log(fileName);
  const block = yaml.load(contents);

  if (typeof block !== "object" || !block) {
    throw new Error(`${fileName}: unexpected type: ${typeof block}`);
  }

  if (validate(block)) {
    console.log(JSON.stringify(block, null, 2));
  } else {
    console.error(validate.errors);
  }
};

const loadPrimaryBlocks = async () => {
  const files = await glob(`${PATH_PREFIX}/primary/**/*.yml`);
  const fileContents = await Promise.all(
    files.map((fileName) => {
      return fs.readFile(fileName, "utf8");
    })
  );

  const blocks = {} as Blocks;
  files.forEach((file, i) =>
    parseFile(blocks, "primary", file, fileContents[i])
  );
  return blocks;
};

const main = async () => {
  const blocks = await loadPrimaryBlocks();
  /*
  const matchRules = blocks["cs-hons-2020/found"].match as MatchRule[];
  console.log(matchRules);
  if (typeof matchRules[0] === "object" && "and" in matchRules[0]) {
    const andRules = matchRules[0].and as MatchRule[];
    console.log(andRules);
    if (typeof andRules[5] === "object" && "or" in andRules[5]) {
      const orRule = andRules[5].or;
      console.log(orRule);
    }
  }
  */
};

main();
