import type { Matcher, MatcherBranch, MatcherLeaf } from "../matcher/types";
import type { Some } from "../some/types";
import { patternMatcher, patternToRE } from "./pattern/matchers";
import type {
  AndMatchRule,
  MatchRule,
  OrMatchRule,
  PatternMatchRule,
} from "./types";

const patternMatchRuleMatcher = ({
  pattern,
  exclude = [],
  info,
}: PatternMatchRule): MatcherLeaf => {
  const excludeArray = typeof exclude === "string" ? [exclude] : exclude;
  const excludeRE = patternToRE(...excludeArray);
  const { match } = patternMatcher(pattern);
  return {
    match: (module) => {
      const [moduleStr] = module;
      return match(module) && !excludeRE.test(moduleStr);
    },
    infos: typeof info === "undefined" ? [] : [info],
  };
};

const andMatchRuleMatcher = ({ and }: AndMatchRule): MatcherBranch => ({
  matchers: and.map(matchRuleMatcher),
  constraint: (matcheds) => matcheds.every((matched) => matched.length > 0),
});

const orMatchRuleMatcher = ({ or }: OrMatchRule): MatcherBranch => ({
  matchers: or.map(matchRuleMatcher),
  constraint: (matcheds) => matcheds.some((matched) => matched.length > 0),
});

const matchRuleMatcher = (match: Some<MatchRule>): Matcher => {
  if (Array.isArray(match)) {
    return matchRuleMatcher({ or: match });
  } else if (typeof match === "string") {
    return patternMatcher(match);
  } else if ("pattern" in match) {
    return patternMatchRuleMatcher(match);
  } else if ("and" in match) {
    return andMatchRuleMatcher(match);
  } else if ("or" in match) {
    return orMatchRuleMatcher(match);
  } else {
    throw new Error("match rule(s) is (are) not well-defined");
  }
};

export {
  andMatchRuleMatcher,
  matchRuleMatcher,
  orMatchRuleMatcher,
  patternMatchRuleMatcher,
};
