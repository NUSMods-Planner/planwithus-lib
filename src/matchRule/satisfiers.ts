import type {
  Satisfier,
  SatisfierBranch,
  SatisfierLeafAssign,
} from "../satisfier";
import type { Some } from "../some";
import { patternSatisfier, patternToRE } from "./pattern";
import type {
  AndMatchRule,
  MatchRule,
  OrMatchRule,
  PatternMatchRule,
} from "./types";

const patternMatchRuleSatisfier = (
  ref: string,
  rule: PatternMatchRule
): SatisfierLeafAssign => {
  const { pattern, exclude = [], info } = rule;
  const excludeArray = typeof exclude === "string" ? [exclude] : exclude;
  const excludeRE = patternToRE(...excludeArray);
  const { assign } = patternSatisfier(ref, pattern);
  return {
    ref,
    assign: (remaining) => {
      const { remainingMask } = assign(remaining);
      return {
        remainingMask: remainingMask.map((bool, i) => {
          const module = remaining[i];
          const [moduleStr] = module;
          return bool && !excludeRE.test(moduleStr);
        }),
      };
    },
    info,
  };
};

const andMatchRuleSatisfier = (
  ref: string,
  { and }: AndMatchRule
): SatisfierBranch => ({
  ref,
  satisfiers: and.map((rule, i) =>
    matchRuleSatisfier([ref, i].join("/"), rule)
  ),
  reduce: (results) => ({
    isSatisfied: results.every(({ isSatisfied }) => isSatisfied),
  }),
  message: "modules do not match all rules",
});

const orMatchRuleSatisfier = (
  ref: string,
  { or }: OrMatchRule
): SatisfierBranch => ({
  ref,
  satisfiers: or.map((rule, i) => matchRuleSatisfier([ref, i].join("/"), rule)),
  reduce: (results) => ({
    isSatisfied: results.some(({ isSatisfied }) => isSatisfied),
  }),
  message: "modules do not match any rule",
});

const matchRuleSatisfier = (ref: string, match: Some<MatchRule>): Satisfier => {
  if (Array.isArray(match)) {
    return orMatchRuleSatisfier(ref, { or: match });
  } else if (typeof match === "string") {
    return patternSatisfier(ref, match);
  } else if ("pattern" in match) {
    return patternMatchRuleSatisfier(ref, match);
  } else if ("and" in match) {
    return andMatchRuleSatisfier([ref, "and"].join("/"), match);
  } else if ("or" in match) {
    return orMatchRuleSatisfier([ref, "or"].join("/"), match);
  } else {
    throw new Error("match rule is not well-defined");
  }
};

export {
  andMatchRuleSatisfier,
  matchRuleSatisfier,
  orMatchRuleSatisfier,
  patternMatchRuleSatisfier,
};
