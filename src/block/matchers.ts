import { Directory } from "../directory";
import { matchRuleMatcher } from "../matchRule/matchers";
import type { MatcherBranch } from "../matcher/types";
import type { Some } from "../some/types";
import type { BlockId } from "./blockId/types";
import type { Block } from "./types";

const blockAssignMatcher = (
  dir: Directory,
  assign: Some<BlockId>
): MatcherBranch => ({
  matchers: Array.isArray(assign)
    ? assign.map((blockId) => blockMatcher(dir, dir.find(blockId)))
    : [blockMatcher(dir, dir.find(assign))],
  constraint: () => true,
});

const blockMatcher = (
  dir: Directory,
  { assign, match }: Block
): MatcherBranch => ({
  matchers: [
    ...(typeof assign === "undefined" ? [] : [blockAssignMatcher(dir, assign)]),
    ...(typeof match === "undefined" ? [] : [matchRuleMatcher(match)]),
  ],
  constraint: () => true,
});

export { blockMatcher };
