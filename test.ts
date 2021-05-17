import fs from "fs/promises";
import path from "path";
import glob from "globby";
import yaml from "js-yaml";

const PATH_PREFIX = path.join(__dirname, "examples");

const pathToBlockName = (fileName: string) => path.relative(PATH_PREFIX, fileName).replace(/\.yml$/g, "");

type Block = {
  name: string;
  ay?: number;
  mc?: string;
  assign: any;
};

type Blocks = {
  [blockName: string]: Block;
};

const BLOCK_PROPERTIES = [
  'name',
  'assign',
  'ay',
  'info',
  'mc',
  'ref',
  'match',
  'match-one',
];

const validateBlock = (blocks: Blocks, block: Block, name: string) => {
  if (typeof blocks[name] === "object") {
      throw new Error(`Block "${name}" already exists.`)
  }

  const [properties, subBlocks] = Object.entries(block)
    .reduce(([properties, subBlocks], [name, entry]) => {
      if (BLOCK_PROPERTIES.includes(name)) {
        (properties as any)[name] = entry;
      } else {
        (subBlocks as any)[name] = entry;
      }
      return [properties, subBlocks];
    }, [{} as Block, {}]);

  blocks[name] = properties;
  Object.entries(subBlocks)
    .forEach(([subBlockName, subBlock]) => validateBlock(blocks, subBlock as any, `${name}/${subBlockName}`));
};

const parseFile = (blocks: Blocks, fileName: string, contents: string) => {
  const parsedYaml = yaml.load(contents);

  if (typeof parsedYaml !== "object" || !parsedYaml) {
    throw new Error(`${fileName}: unexpected type: ${typeof parsedYaml}`);
  }

  validateBlock(blocks, parsedYaml as any, pathToBlockName(fileName));
};

const loadBlocks = async () => {
  const files = await glob(`${PATH_PREFIX}/**/*.yml`);
  const fileContents = await Promise.all(files.map((fileName) => {
    return fs.readFile(fileName, "utf8");
  }));

  const blocks = {};
  files.forEach((file, i) => parseFile(blocks, file, fileContents[i]));
  return blocks;
};

const main = async () => {
  const blocks = await loadBlocks();
  console.log(blocks);
};

main();
