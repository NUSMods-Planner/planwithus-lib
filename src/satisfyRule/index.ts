import { BlockId } from "../block";
import { Info, INFO_PROPERTIES } from "../info";

import { Inequality } from "./inequality";

const SATISFY_RULE_PROPERTIES = ["and", "mc", "or", ...INFO_PROPERTIES];

type BlockIdSatisfyRule =
  | BlockId
  | ({ [blockId: string]: null } & Partial<Info>);
type MCSatisfyRule = { mc: number | Inequality };
type AndSatisfyRule = { and: SatisfyRule[] };
type OrSatisfyRule = { or: SatisfyRule[] };

type SatisfyRule =
  | BlockIdSatisfyRule
  | MCSatisfyRule
  | AndSatisfyRule
  | OrSatisfyRule;

export type { SatisfyRule };
export { SATISFY_RULE_PROPERTIES };
