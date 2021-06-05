import fs from "fs/promises";
import path from "path";
import glob from "globby";

import type { MatchRule } from "./matchRule";
import { parseYAML } from "./";
import { Verifier } from "./verifier";

const PATH_PREFIX = path.join(__dirname, "../blocks");

const loadBlocks = async (type: string): Promise<Verifier> => {
  const files = await glob(`${PATH_PREFIX}/${type}/**/*.yml`);
  const fileContents = await Promise.all(
    files.map((fileName) => fs.readFile(fileName, "utf8"))
  );

  const verifier = new Verifier();
  files.forEach((filename, i) => {
    console.log(filename);
    verifier.addBlock(
      path.basename(filename).replace(/\.yml$/, ""),
      parseYAML(fileContents[i])
    );
  });
  return verifier;
};

const main = async () => {
  const primaryVerifier = await loadBlocks("primary");
  console.log(JSON.stringify(primaryVerifier.blocks, null, 2));
  console.log("---");
  const secondVerifier = await loadBlocks("second");
  console.log(JSON.stringify(secondVerifier.blocks, null, 2));
  console.log("---");
  const matchRules = primaryVerifier.find("cs-hons-2020/found")
    .match as MatchRule[];
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
