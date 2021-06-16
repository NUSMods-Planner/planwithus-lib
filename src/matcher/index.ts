import type { Module } from "../module/types";
import type { Matcher, MatcherResult } from "./types";
import { isMatcherBranch, isMatcherLeaf } from "./types";

const evaluateMatcher = (
  remaining: Module[],
  matcher: Matcher
): MatcherResult => {
  if (isMatcherLeaf(matcher)) {
    const { match, infos } = matcher;
    const notMatch = (module: Module) => !match(module);
    const newMatched = remaining.filter(match);
    const newRemaining = remaining.filter(notMatch);
    return {
      matched: newMatched,
      remaining: newRemaining,
      infos: newMatched.length > 0 ? infos : [],
    };
  } else if (isMatcherBranch(matcher)) {
    const { matchers, constraint } = matcher;
    const matcherResult = {
      matched: [],
      remaining,
      infos: [],
    } as MatcherResult;
    const [newMatcheds, newMatcherResult] = matchers.reduce(
      (
        [
          accMatcheds,
          { matched: accMatched, remaining: accRemaining, infos: accInfos },
        ],
        matcher
      ) => {
        const { matched, remaining, infos } = evaluateMatcher(
          accRemaining,
          matcher
        );
        return [
          accMatcheds.concat([matched]),
          {
            matched: accMatched.concat(matched),
            remaining,
            infos: accInfos.concat(infos),
          },
        ];
      },
      [[] as Module[][], matcherResult]
    );
    return constraint(newMatcheds) ? newMatcherResult : matcherResult;
  } else {
    throw new Error("matcher is not well-defined");
  }
};

export { evaluateMatcher };
