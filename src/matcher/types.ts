import type { Module } from "../module/types";

type MatcherLeaf = {
  match: (module: Module) => boolean;
  infos: string[];
};
const isMatcherLeaf = (matcher: Matcher): matcher is MatcherLeaf =>
  "match" in matcher;

type MatcherBranch = {
  matchers: Matcher[];
  constraint: (matcheds: Module[][]) => boolean;
};
const isMatcherBranch = (matcher: Matcher): matcher is MatcherBranch =>
  "matchers" in matcher;

type Matcher = MatcherLeaf | MatcherBranch;

type MatcherResult = {
  matched: Module[];
  remaining: Module[];
  infos: string[];
};

export type { Matcher, MatcherBranch, MatcherLeaf, MatcherResult };
export { isMatcherBranch, isMatcherLeaf };
