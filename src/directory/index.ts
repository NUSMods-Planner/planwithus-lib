import type { Block } from "../block";
import { decomposeBlock } from "../block";
import type { BlockId } from "../block/blockId";

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
          ? `blocks '${id}', '${prefixedId}' do not exist`
          : `block '${id}' does not exist`
      );
    }
  }
}

export { Directory };
