import { Directory } from "../directory";
import { matchRuleMatcher } from "../matchRule/matchers";
import type { MatcherBranch } from "../matcher/types";
import type { Some } from "../some/types";
import type { BlockId } from "./blockId/types";

const blockAssignMatcher = (
  dir: Directory,
  prefix: string,
  assign: Some<BlockId>
): MatcherBranch => ({
  type: "assign",
  rule: assign,
  matchers: Array.isArray(assign)
    ? assign.map((blockId) => blockMatcher(dir, prefix, blockId))
    : [blockMatcher(dir, prefix, assign)],
  constraint: () => true,
});

const blockMatcher = (
  dir: Directory,
  prefix: string,
  blockId: BlockId
): MatcherBranch => {
  const [newPrefix, block] = dir.find(prefix, blockId);
  const { assign, match } = block;
  return {
    type: "block",
    rule: { prefix: newPrefix, block },
    matchers: [
      ...(typeof assign === "undefined"
        ? []
        : [blockAssignMatcher(dir, newPrefix, assign)]),
      ...(typeof match === "undefined" ? [] : [matchRuleMatcher(match)]),
    ],
    constraint: () => true,
  };
};

export { blockMatcher };
