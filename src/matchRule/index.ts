import { Info, INFO_PROPERTIES } from "../info";

type Pattern = string;

const MATCH_RULE_PROPERTIES = ["and", "or", "exclude", ...INFO_PROPERTIES];

type PatternMatchRule = Pattern | ({ pattern: Pattern } & Partial<Info>);
type AndMatchRule = { and: MatchRule[] };
type OrMatchRule = { or: MatchRule[] };
type ExcludeMatchRule = { exclude: MatchRule };

type MatchRule =
  | PatternMatchRule
  | AndMatchRule
  | OrMatchRule
  | ExcludeMatchRule;

export { Pattern, MatchRule, MATCH_RULE_PROPERTIES };
