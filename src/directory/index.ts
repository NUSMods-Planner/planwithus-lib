import { decomposeBlock } from "../block";
import type { Block } from "../block/types";

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

  find(prefix: string): Block {
    if (prefix in Object.keys(this.blocks)) {
      throw new Error(`block '${prefix}' does not exist`);
    }
    return this.blocks[prefix];
  }
}

export { Directory };
