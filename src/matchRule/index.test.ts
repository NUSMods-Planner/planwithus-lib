import { array, letrec, oneof, record, string } from "fast-check";

import { some } from "../some/index.test";
import { pattern } from "./pattern/index.test";

const { patternMatchRule, andMatchRule, orMatchRule, matchRule } = letrec(
  (tie) => ({
    patternMatchRule: record(
      {
        pattern,
        exclude: some(pattern, { maxLength: 5 }),
        info: string(),
      },
      { requiredKeys: ["pattern"] }
    ),
    andMatchRule: record({
      and: array(tie("matchRule"), { maxLength: 5 }),
    }),
    orMatchRule: record({
      or: array(tie("matchRule"), { maxLength: 5 }),
    }),
    matchRule: oneof(
      { depthFactor: 0.8, withCrossShrink: true },
      pattern,
      tie("patternMatchRule"),
      tie("andMatchRule"),
      tie("orMatchRule")
    ),
  })
);

export { andMatchRule, matchRule, orMatchRule, patternMatchRule };
