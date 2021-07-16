/**
 * This module defines the [[Directory]] class.
 * @module
 */

import type { Block } from "../block";
import type { BlockId } from "../block/blockId";

const decomposeBlock = (
  block: Block,
  prefix?: string
): [Block, Record<string, Block>] => {
  if (prefix === undefined || prefix === null) {
    prefix = "";
  }

  const { name, ay, assign, match, satisfy, url, info, ...subblocks } = block;
  const mainBlock = { name, ay, assign, match, satisfy, url, info };
  const flatSubblocks = Object.entries(subblocks)
    .map(([sbName, sb]) => {
      const sbPrefix = [prefix, sbName].join("/");
      return [sbPrefix, ...decomposeBlock(sb, sbPrefix)];
    })
    .reduce(
      (accFlatSbs, [sbPrefix, sbMainBlock, sbFlatSbs]) => ({
        ...accFlatSbs,
        [sbPrefix as string]: sbMainBlock,
        ...(sbFlatSbs as Record<string, Block>),
      }),
      {}
    );
  return [mainBlock, flatSubblocks];
};

/**
 * Class representing a block directory, providing functionality for adding
 * blocks and block identifier resolution.
 */
class Directory {
  #blocks: Record<string, Block>;
  #topLevelBlocks: Set<string>;

  constructor() {
    this.#blocks = {};
    this.#topLevelBlocks = new Set();
  }

  /**
   * Adds a block into the directory.
   *
   * This function handles the decomposition of blocks into properties and
   * subblocks. The parent block and each of its subblocks are added to the
   * block directory, with an appropriate prefix prepended to the block
   * identifiers.
   *
   * For example, by passing in `prefix` as `"foobar"` and `block` as a block
   * with subblocks `foo` and `bar`, three blocks will be added to the directory
   * with identifiers `foobar`, `foobar/foo` and `foobar/bar`.
   *
   * **Note that each block in the directory will have its subblocks stripped
   * away. If it is necessary to access a subblock, the [[find]] function should
   * be used with `prefix` set to the identifier of the parent block and `id`
   * set to the (partial) identifier of the subblock.**
   *
   * @param prefix A prefix string representing the full identifier of the
   * block.
   * @param block The block to be added to the directory.
   * @param isTopLevel A flag indicating if the block is top level. (Top level
   * blocks can be selected by users as "courses", while all other blocks are
   * hidden.)
   */
  addBlock(prefix: string, block: Block, isTopLevel = true): void {
    const [mainBlock, flatSubblocks] = decomposeBlock(block);
    if (prefix in Object.keys(this.#blocks)) {
      throw new Error(`block '${prefix}' already exists`);
    }

    this.#blocks[prefix] = mainBlock;
    Object.entries(flatSubblocks).forEach(([name, block]) => {
      const newName = prefix + name;
      if (newName in Object.keys(this.#blocks)) {
        throw new Error(`block '${prefix}' already exists`);
      }
      this.#blocks[newName] = block as Block;
    });

    if (isTopLevel) {
      this.#topLevelBlocks.add(prefix);
    }
  }

  /**
   * Finds a block in the directory.
   *
   * This function attempts to find a block with the exact same full identifier
   * as `id`. If no such block exists, it will search for a block with `id`
   * directly under `prefix`.
   *
   * For example, if `prefix` is set to `"abc"` and `id` to `"ghi"`, the
   * function will check if either of the blocks `ghi` or `abc/ghi` exist.
   *
   * @param prefix A prefix string representing the full identifier of the
   * parent block, if any.
   * @param id The identifier of the desired block. This may either be a full
   * identifier or a partial identifier under the parent block.
   * @return A pair with the first element as the full identifier of the desired
   * block and the second element as the desired block itself.
   */
  find(prefix: string, id: BlockId): [BlockId, Block] {
    const prefixedId = prefix === "" ? id : [prefix, id].join("/");
    if (Object.keys(this.#blocks).includes(id)) {
      return [id, this.#blocks[id]];
    } else if (Object.keys(this.#blocks).includes(prefixedId)) {
      return [prefixedId, this.#blocks[prefixedId]];
    } else {
      throw new Error(
        id !== prefixedId
          ? `blocks '${id}', '${prefixedId}' do not exist`
          : `block '${id}' does not exist`
      );
    }
  }

  /**
   * Retrieves all top level block identifiers in the directory.
   *
   * @return A list of full identifiers of all top level blocks in the
   * directory.
   */
  retrieveTopLevel(): BlockId[] {
    return [...this.#topLevelBlocks];
  }
}

export { Directory };
