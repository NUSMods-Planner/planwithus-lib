import { decomposeBlock } from "../block";
import type { Block } from "../block/types";
import type { BlockId } from "../block/blockId/types";

class Directory {
  blocks: Record<string, Block>;

  constructor() {
    this.blocks = {};
  }

  addBlock(prefix: string, block: Block): void {
    const [mainBlock, flatSubblocks] = decomposeBlock(block);
    if (prefix in Object.keys(this.blocks)) {
      throw new Error(`block '${prefix}' already exists`);
    }

    this.blocks[prefix] = mainBlock;
    Object.entries(flatSubblocks).forEach(([name, block]) => {
      const newName = prefix + name;
      if (newName in Object.keys(this.blocks)) {
        throw new Error(`block '${prefix}' already exists`);
      }
      this.blocks[newName] = block as Block;
    });
  }

  find(prefix: string, id: BlockId): [BlockId, Block] {
    const prefixedId = prefix === "" ? id : [prefix, id].join("/");
    if (Object.keys(this.blocks).includes(id)) {
      return [id, this.blocks[id]];
    } else if (Object.keys(this.blocks).includes(prefixedId)) {
      return [prefixedId, this.blocks[prefixedId]];
    } else {
      throw new Error(
        id !== prefixedId
          ? `block '${id}' or '${prefixedId}' does not exist`
          : `block '${id}' does not exist`
      );
    }
  }
}

export { Directory };
