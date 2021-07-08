import type { BlockId } from "../block/blockId";
import type { Inequality } from "./inequality";

type MCSatisfyRule = { mc: Inequality };
type AndSatisfyRule = { and: SatisfyRule[] };
type OrSatisfyRule = { or: SatisfyRule[] };

type SatisfyRuleObject = MCSatisfyRule | AndSatisfyRule | OrSatisfyRule;

type SatisfyRule = BlockId | SatisfyRuleObject;

export type {
  AndSatisfyRule,
  MCSatisfyRule,
  OrSatisfyRule,
  SatisfyRule,
  SatisfyRuleObject,
};
