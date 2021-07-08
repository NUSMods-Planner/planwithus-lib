import type { SatisfierLeafAssign } from "../../satisfier";
import { patternToRE } from "./";
import type { Pattern } from "./types";

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

export { patternSatisfier };
