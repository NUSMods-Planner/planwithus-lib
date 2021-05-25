import { INFO_PROPERTIES } from "../info";
import type { Info } from "../info";
import type { MatchRule } from "../matchRule";
import type { SatisfyRule } from "../satisfyRule";

const BLOCK_PROPERTIES = [
  "assign",
  "ay",
  "match",
  "name",
  "satisfy",
  "url",
  ...INFO_PROPERTIES,
];

type BlockId = string;

type Block = {
  name?: string;
  ay?: number;
  assign?: BlockId[];
  match?: MatchRule[];
  satisfy?: SatisfyRule[];
  url?: string;
} & Partial<Info>;

export type { Block, BlockId };
export { BLOCK_PROPERTIES };
