import fs from "fs/promises";
import path from "path";
import glob from "globby";
import yaml from "js-yaml";

import { RESERVED_PROPERTIES } from "./";
import { Block, BlockId } from "./block";
import { MatchRule, Pattern } from "./matchRule";
import { SatisfyRule } from "./satisfyRule";
import { parseInequality } from "./satisfyRule/inequality";

const PATH_PREFIX = path.join(__dirname, "../examples");

const pathToBlockName = (type: string, fileName: string) =>
  path.relative(path.join(PATH_PREFIX, type), fileName).replace(/\.yml$/g, "");

const isBlockIdArray = (x: unknown): x is BlockId[] =>
  Array.isArray(x) && x.every((y) => typeof y === "string");

type Blocks = {
  [blockName: string]: Block;
};

const parseMatchRules = (contents: unknown): MatchRule[] => {
  if (contents === null) {
    throw new Error(`contents cannot be null`);
  } else if (Array.isArray(contents)) {
    return contents.map(parseMatchRules).flat();
  } else if (typeof contents === "string") {
    return [contents];
  } else if (typeof contents !== "object") {
    throw new Error("contents is of foreign type");
  }

  const properties = contents as Record<string, unknown>;
  switch (Object.keys(properties).length) {
    case 0:
      throw new Error(`contents is an empty object`);
    case 1: {
      const [key, entry] = Object.entries(properties)[0];
      if (key === "and" || key === "or") {
        return [{ [key]: parseMatchRules(entry) } as MatchRule];
      } else if (key === "exclude") {
        if (typeof entry !== "string") {
          throw new Error("exclude pattern is of foreign type");
        }
        return [{ exclude: entry } as MatchRule];
      } else if (RESERVED_PROPERTIES.includes(key)) {
        throw new Error("key is a reserved keyword");
      }

      const pattern_str = key as Pattern;
      return [{ pattern: pattern_str } as MatchRule];
    }
    case 2: {
      if (!Object.keys(properties).includes("info")) {
        throw new Error("no info property");
      }

      const info_val = properties.info;
      if (typeof info_val !== "string") {
        throw new Error("info value is not a string");
      }

      delete properties.info;
      const pattern_str = Object.keys(properties)[0] as Pattern;
      return [{ pattern: pattern_str, info: info_val } as MatchRule];
    }
    default:
      throw new Error("contents has too many keys");
  }
};

const parseSatisfyRules = (contents: unknown): SatisfyRule[] => {
  if (contents === null) {
    throw new Error(`contents cannot be null`);
  } else if (Array.isArray(contents)) {
    return contents.map(parseSatisfyRules).flat();
  } else if (typeof contents === "string") {
    return [contents as BlockId];
  } else if (typeof contents !== "object") {
    throw new Error(`contents is of foreign type`);
  }

  const properties = contents as Record<string, unknown>;
  switch (Object.keys(properties).length) {
    case 0:
      throw new Error(`contents is an empty object`);
    case 1: {
      const [key, entry] = Object.entries(properties)[0];
      if (key === "mc") {
        if (typeof entry === "number") {
          return [properties as SatisfyRule];
        } else if (typeof entry === "string") {
          return [{ mc: parseInequality(entry) } as SatisfyRule];
        } else {
          throw new Error(`specified mc is of foreign type`);
        }
      } else if (key === "and" || key === "or") {
        return [{ [key]: parseSatisfyRules(entry) } as SatisfyRule];
      } else if (RESERVED_PROPERTIES.includes(key)) {
        throw new Error("key is a reserved keyword");
      }

      const blockId_str = key as Pattern;
      return [{ blockId: blockId_str } as SatisfyRule];
    }
    case 2: {
      if (!Object.keys(properties).includes("info")) {
        throw new Error("no info property");
      }

      const info_val = properties.info;
      if (typeof info_val !== "string") {
        throw new Error("info value is not a string");
      }

      delete properties.info;
      const blockId_str = Object.keys(properties)[0] as Pattern;
      return [{ blockId: blockId_str, info: info_val } as SatisfyRule];
    }
    default:
      throw new Error("contents has too many keys");
  }
};

const parseBlock = (
  blocks: Blocks,
  contents: Record<string, unknown>,
  name: BlockId
) => {
  if (name in blocks) {
    throw new Error(`Block "${name}" already exists.`);
  }

  const [properties, subBlocks] = Object.entries(contents).reduce(
    ([properties, subBlocks], [name, entry]) => {
      switch (name) {
        case "assign":
          if (typeof entry === "string") {
            properties.assign = [entry];
            break;
          } else if (isBlockIdArray(entry)) {
            properties.assign = entry;
            break;
          }
          throw new Error(
            `assign value is not a string or an array of strings`
          );
        case "ay":
          if (typeof entry !== "number") {
            throw new Error(`ay value is not a number`);
          }
          properties.ay = entry;
          break;
        case "match":
          properties.match = parseMatchRules(entry);
          break;
        case "satisfy":
          properties.satisfy = parseSatisfyRules(entry);
          break;
        case "info":
        case "name":
        case "url":
          if (typeof entry !== "string") {
            throw new Error(`${name} value is not a string`);
          }

          properties[name] = entry;
          break;
        default:
          if (RESERVED_PROPERTIES.includes(name)) {
            throw new Error(`${name} is a reserved keyword`);
          }
          if (entry === null || typeof entry !== "object") {
            throw new Error(`${name} value is not a map`);
          }

          subBlocks[name] = entry as Record<string, unknown>;
      }
      return [properties, subBlocks];
    },
    [
      {} as Record<string, unknown>,
      {} as Record<string, Record<string, unknown>>,
    ]
  );

  blocks[name] = properties as Block;
  Object.entries(subBlocks).forEach(([subBlockName, subBlock]) =>
    parseBlock(blocks, subBlock, `${name}/${subBlockName}`)
  );
};

const parseFile = (
  blocks: Blocks,
  type: string,
  fileName: string,
  contents: string
) => {
  console.log(fileName);
  const parsedYaml = yaml.load(contents);

  if (typeof parsedYaml !== "object" || !parsedYaml) {
    throw new Error(`${fileName}: unexpected type: ${typeof parsedYaml}`);
  }

  parseBlock(
    blocks,
    parsedYaml as Record<string, unknown>,
    pathToBlockName(type, fileName)
  );
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
  console.log(PATH_PREFIX);
  const blocks = await loadPrimaryBlocks();
  console.log(blocks);
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
};

main();
