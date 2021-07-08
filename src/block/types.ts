import type { MatchRule } from "../matchRule";
import type { SatisfyRule } from "../satisfyRule";
import type { Some } from "../some";
import type { BlockId } from "./blockId";

type Block = {
  name?: string;
  ay?: number;
  assign?: Some<BlockId>;
  match?: Some<MatchRule>;
  satisfy?: Some<SatisfyRule>;
  url?: string;
  info?: string;
  // the following line is used to prevent compilation errors due to the
  // oddities of JSONSchemaType
  [blockId: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

enum BlockClass {
  Primary = "primary",
  Second = "second",
  Minor = "minor",
}
const BLOCK_CLASSES = [BlockClass.Primary, BlockClass.Second, BlockClass.Minor];

export type { Block };
export { BLOCK_CLASSES, BlockClass };
