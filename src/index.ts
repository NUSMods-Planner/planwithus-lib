/**
 * This module provides functions that make up the main functionality of
 * `planwithus-lib`.
 *
 * A block is used to express course requirements. Blocks are loaded from the
 * `blocks/` directory of the repository root folder and arranged into
 * classes, with each class forming a subdirectory of the `blocks/` directory.
 * (For example, blocks under the `primary` class can be found at
 * `blocks/primary`.) Blocks are currently organised into three categories,
 * `primary` (referring to primary majors), `second` (referring to second
 * majors) and `minor` (referring to minors).
 *
 * Each block is represented by a [YAML](https://yaml.org/) file which contains
 * a single *top-level block* with an identifier corresponding to its filename.
 * (For example, the block at `blocks/primary/cs-hons-2020.yml` is a primary
 * major block with the identifier `cs-hons-2020`.) Beyond their classes, folder
 * names are ignored; the two files at `blocks/primary/cs-hons-2020.yml` and
 * `blocks/primary/cs-hons-2020/cs-hons-2020.yml` will represent a primary major
 * with the same identifier `cs-hons-2020`. **Note that blocks with the same
 * identifiers are prohibited.**
 *
 * For more information on the specification format of blocks, please refer to
 * the [[block]] module.
 *
 * @module
 */

import fs from "fs/promises";
import glob from "globby";
import path from "path";

import { Directory } from "./directory";
import { parseYAML } from "./parser";
import type { BlockId } from "./block/blockId";
import { BLOCK_CLASSES, blockSatisfier } from "./block";
import type { Module } from "./module";
import type { SatisfierResult } from "./satisfier";
import { evaluateSatisfier } from "./satisfier";

const PATH_PREFIX = path.join(__dirname, "../blocks");

const loadBlocks = async (type: string): Promise<Directory> => {
  const files = await glob(`${PATH_PREFIX}/${type}/**/*.yml`);
  const fileContents = await Promise.all(
    files.map((fileName) => fs.readFile(fileName, "utf8"))
  );

  const verifier = new Directory();
  files.forEach((filename, i) =>
    verifier.addBlock(
      path.basename(filename).replace(/\.yml$/, ""),
      parseYAML(fileContents[i])
    )
  );
  return verifier;
};

/**
 * Initialises block directories with each directory corresponding to a block
 * class.
 *
 * @return An object with keys as block classes and values as block directories.
 */
const initDirectories = async (): Promise<Record<string, Directory>> => {
  const directories = await Promise.all(BLOCK_CLASSES.map(loadBlocks));
  return Object.fromEntries(
    BLOCK_CLASSES.map((prefix, i) => [prefix, directories[i]])
  );
};

/**
 * Wrapper function that verifies a study plan against a specific block.
 *
 * @param modules List of modules in the study plan.
 * @param dir Block directory which contains the desired block.
 * @param blockId Identifier of the desired block.
 * @return An object representing the result of a study plan verification.
 */
const verifyPlan = (
  modules: Module[],
  dir: Directory,
  blockId: BlockId
): SatisfierResult =>
  evaluateSatisfier([], modules, blockSatisfier("", dir, blockId, blockId));

export { initDirectories, verifyPlan };
