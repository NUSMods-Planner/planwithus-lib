import { Directory } from "../directory";
import { evaluateMatcher } from "../matcher";
import type {
  Satisfier,
  SatisfierBranch,
  SatisfierLeaf,
} from "../satisfier/types";
import { satisfyRuleSatisfier } from "../satisfyRule/satisfiers";
import { blockMatcher } from "./matchers";
import type { Block } from "./types";

const blockSatisfier = (dir: Directory, block: Block): SatisfierBranch => {
  const { satisfy, info } = block;
  const infoSatisfier: SatisfierLeaf = {
    constraint: () => true,
    infos: typeof info === "undefined" ? [] : [info],
    messages: [],
  };
  return {
    filter: (assigned) => {
      const { matched } = evaluateMatcher(assigned, blockMatcher(dir, block));
      return matched;
    },
    satisfiers: ([infoSatisfier] as Satisfier[]).concat(
      typeof satisfy === "undefined" ? [] : [satisfyRuleSatisfier(dir, satisfy)]
    ),
    constraint: (satisfieds) => satisfieds.every((bool) => bool),
  };
};

export { blockSatisfier };
