import { array, letrec, oneof, record, string } from "fast-check";

import { inequality } from "./inequality/index.test";

const { mcSatisfyRule, andSatisfyRule, orSatisfyRule, satisfyRule } = letrec(
  (tie) => ({
    mcSatisfyRule: record({ mc: inequality }, { requiredKeys: ["mc"] }),
    andSatisfyRule: record({
      and: array(tie("satisfyRule"), { maxLength: 5 }),
    }),
    orSatisfyRule: record({
      or: array(tie("satisfyRule"), { maxLength: 5 }),
    }),
    satisfyRule: oneof(
      { depthFactor: 0.8, withCrossShrink: true },
      string(),
      tie("mcSatisfyRule"),
      tie("andSatisfyRule"),
      tie("orSatisfyRule")
    ),
  })
);

export { andSatisfyRule, mcSatisfyRule, orSatisfyRule, satisfyRule };
