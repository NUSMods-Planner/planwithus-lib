import type { Module } from "../module/types";
import type { Matcher, MatcherResult } from "./types";
import { isMatcherBranch, isMatcherLeaf } from "./types";

const evaluateMatcher = (
  remaining: Module[],
  matcher: Matcher
): MatcherResult => {
  if (isMatcherLeaf(matcher)) {
    const { type, rule, match, info } = matcher;
    const notMatch = (module: Module) => !match(module);
    const newMatched = remaining.filter(match);
    const newRemaining = remaining.filter(notMatch);
    return Object.assign(
      {
        type,
        rule,
        matched: newMatched,
        remaining: newRemaining,
        results: [],
      },
      newMatched.length > 0 && typeof info !== "undefined" ? { info } : {}
    );
  } else if (isMatcherBranch(matcher)) {
    const { type, rule, matchers, constraint } = matcher;
    const matcherResult = {
      type,
      rule,
      matched: [],
      remaining,
      results: [],
    } as MatcherResult;
    const [newMatcheds, newMatcherResult] = matchers.reduce(
      (
        [
          accMatcheds,
          { matched: accMatched, remaining: accRemaining, results: accResults },
        ],
        matcher
      ) => {
        const result = evaluateMatcher(accRemaining, matcher);
        const { matched, remaining } = result;
        return [
          [...accMatcheds, matched],
          {
            type,
            rule,
            matched: [...accMatched, ...matched],
            remaining,
            results: [...accResults, result],
          },
        ];
      },
      [[] as Module[][], matcherResult]
    );
    const { results: newResults } = newMatcherResult;
    return constraint(newMatcheds)
      ? newMatcherResult
      : { ...matcherResult, results: newResults };
  } else {
    throw new Error("matcher is not well-defined");
  }
};

export { evaluateMatcher };
