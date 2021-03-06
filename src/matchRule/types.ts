import type { Some } from "../some";
import type { Pattern } from "./pattern";

type PatternMatchRule = {
  pattern: Pattern;
  exclude?: Some<Pattern>;
  info?: string;
};
type AndMatchRule = { and: MatchRule[] };
type OrMatchRule = { or: MatchRule[] };

type MatchRuleObject = PatternMatchRule | AndMatchRule | OrMatchRule;

type MatchRule = Pattern | MatchRuleObject;

export type {
  AndMatchRule,
  MatchRule,
  MatchRuleObject,
  OrMatchRule,
  PatternMatchRule,
};
