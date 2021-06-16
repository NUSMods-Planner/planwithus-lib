import type { MatcherLeaf } from "../../matcher/types";
import type { Module } from "../../module/types";
import type { Pattern } from "./types";

const patternToRE = (...patterns: Pattern[]): RegExp =>
  new RegExp(
    "^" +
      patterns
        .map((pattern) =>
          pattern.replace(/x/g, "[0-9]").replace(/\*/g, "[A-Z0-9]*")
        )
        .join("|") +
      "$"
  );

const patternMatcher = (pattern: Pattern): MatcherLeaf => {
  const re = patternToRE(pattern);
  return {
    match: ([moduleStr]: Module) => re.test.bind(re)(moduleStr),
    infos: [],
  };
};

export { patternMatcher, patternToRE };
