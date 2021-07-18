import fs from "fs";
import path from "path";
import { parseYAML } from "../src/parser";

const loadBlock = (filepath: string) => {
  return parseYAML(fs.readFileSync(path.join(__dirname, filepath), "utf-8"));
};

export const primary = {
  ["cs-hons-2020"]: loadBlock("primary/cs-hons-2020/cs-hons-2020.yml"),
  ["cs-hons-2020-ai"]: loadBlock("primary/cs-hons-2020/cs-hons-2020-ai.yml"),
  ["cs-hons-2020-alg"]: loadBlock("primary/cs-hons-2020/cs-hons-2020-alg.yml"),
  ["dsa-hons-2017"]: loadBlock("primary/dsa-hons-2017.yml"),
  ["fos-2015"]: loadBlock("primary/fos-2015.yml"),
  ["ma-hons-2019"]: loadBlock("primary/ma-hons-2019.yml"),
  ["ulr-2015"]: loadBlock("primary/ulr-2015.yml"),
};

export const second = {
  ["ma-2019"]: loadBlock("second/ma-2019.yml"),
};

export const minor = {
  ["ma-2019"]: loadBlock("minor/ma-2019.yml"),
};
