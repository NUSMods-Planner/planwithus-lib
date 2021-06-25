import type { Module } from "../module/types";

type MatcherLeaf = {
  type: string;
  match: (module: Module) => boolean;
  info?: string;
};
const isMatcherLeaf = (matcher: Matcher): matcher is MatcherLeaf =>
  "match" in matcher;

type MatcherBranch = {
  type: string;
  matchers: Matcher[];
  constraint: (matcheds: Module[][]) => boolean;
};
const isMatcherBranch = (matcher: Matcher): matcher is MatcherBranch =>
  "matchers" in matcher;

type Matcher = MatcherLeaf | MatcherBranch;

type MatcherResult = {
  type: string;
  matched: Module[];
  remaining: Module[];
  results: MatcherResult[];
  info?: string;
};

export type { Matcher, MatcherBranch, MatcherLeaf, MatcherResult };
export { isMatcherBranch, isMatcherLeaf };
