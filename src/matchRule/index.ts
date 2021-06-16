import { evaluateMatcher } from "../matcher";
import type { MatcherResult } from "../matcher/types";
import type { Module } from "../module/types";
import type { Some } from "../some/types";
import { matchRuleMatcher } from "./matchers";
import type { MatchRule } from "./types";

const performMatch = (
  match: Some<MatchRule>,
  modules: Module[]
): MatcherResult => evaluateMatcher(modules, matchRuleMatcher(match));

export { performMatch };
