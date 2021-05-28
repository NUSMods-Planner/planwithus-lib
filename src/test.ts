import fs from "fs/promises";
import path from "path";
import glob from "globby";

import { parse } from "./";
import type { Block } from "./block";
import type { MatchRule } from "./matchRule";

const PATH_PREFIX = path.join(__dirname, "../examples");

const loadBlocks = async (type: string) => {
  const files = await glob(`${PATH_PREFIX}/${type}/**/*.yml`);
  const fileContents = await Promise.all(
    files.map((fileName) => {
      return fs.readFile(fileName, "utf8");
    })
  );

  return files.reduce((accBlocks, filename, i) => {
    console.log(filename);
    return parse(
      accBlocks,
      path.basename(filename).replace(/\.yml$/, ""),
      fileContents[i]
    );
  }, {} as Record<string, Block>);
};

const main = async () => {
  const primaryBlocks = await loadBlocks("primary");
  console.log(JSON.stringify(primaryBlocks, null, 2));
  console.log("---");
  const matchRules = primaryBlocks["cs-hons-2020/found"].match as MatchRule[];
  console.log(matchRules);
  if (typeof matchRules[0] === "object" && "and" in matchRules[0]) {
    const andRules = matchRules[0].and as MatchRule[];
    console.log(andRules);
    if (typeof andRules[5] === "object" && "or" in andRules[5]) {
      const orRule = andRules[5].or;
      console.log(orRule);
    }
  }
};

main();
