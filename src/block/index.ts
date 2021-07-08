import type { Block } from "./types";

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

export { decomposeBlock };
export { blockTypeSchema } from "./typeSchemas";
export type { Block } from "./types";
export { BLOCK_CLASSES, BlockClass } from "./types";
export { blockSatisfier } from "./satisfiers";
export { blockRefSchema, blockSchema } from "./schemas";
