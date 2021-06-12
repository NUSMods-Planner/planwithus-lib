import type { Info } from "../info/types";
import type { MatchRule } from "../matchRule/types";
import type { SatisfyRule } from "../satisfyRule/types";
import type { Some } from "../some/types";
import type { BlockId } from "./blockId/types";

type Block = {
  name?: string;
  ay?: number;
  assign?: Some<BlockId>;
  match?: Some<MatchRule>;
  satisfy?: Some<SatisfyRule>;
  url?: string;
  info?: Info;
  // the following line is used to prevent compilation errors due to the
  // oddities of JSONSchemaType
  [blockId: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export type { Block };
