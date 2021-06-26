import type { SatisfierLeafAssign } from "../../satisfier/types";
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

const patternSatisfier = (
  ref: string,
  pattern: Pattern
): SatisfierLeafAssign => {
  const re = patternToRE(pattern);
  return {
    ref,
    assign: (remaining) => ({
      remainingMask: remaining.map(([moduleStr]) =>
        re.test.bind(re)(moduleStr)
      ),
    }),
  };
};

export { patternSatisfier, patternToRE };
