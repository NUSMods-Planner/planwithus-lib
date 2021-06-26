import { Directory } from "../directory";
import { evaluateMatcher } from "../matcher";
import type { SatisfierBranch, SatisfierLeaf } from "../satisfier/types";
import { satisfyRuleSatisfier } from "../satisfyRule/satisfiers";
import { blockMatcher } from "./matchers";
import type { BlockId } from "./blockId/types";

const blockSatisfier = (
  dir: Directory,
  prefix: string,
  blockId: BlockId
): SatisfierBranch => {
  const [newPrefix, block] = dir.find(prefix, blockId);
  const { assign, satisfy, info } = block;

  const infoSatisfier: SatisfierLeaf = {
    type: "info",
    rule: null,
    constraint: () => true,
    info,
  };
  const assignBlockIds: BlockId[] =
    typeof assign === "undefined"
      ? []
      : Array.isArray(assign)
      ? assign
      : [assign];
  const assignSatisfier = {
    ...satisfyRuleSatisfier(dir, newPrefix, assignBlockIds),
    type: "assign",
    rule: assign,
  };

  return {
    type: "block",
    rule: { prefix: newPrefix, block },
    filter: (assigned) => {
      const { matched } = evaluateMatcher(
        assigned,
        blockMatcher(dir, prefix, blockId)
      );
      return matched;
    },
    satisfiers: [
      ...(typeof info === "undefined" ? [] : [infoSatisfier]),
      ...(typeof assign === "undefined" ? [] : [assignSatisfier]),
      ...(typeof satisfy === "undefined"
        ? []
        : [satisfyRuleSatisfier(dir, newPrefix, satisfy)]),
    ],
    constraint: (satisfieds) => satisfieds.every((bool) => bool),
  };
};

export { blockSatisfier };
