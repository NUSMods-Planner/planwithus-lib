import { Info, INFO_PROPERTIES } from "../info";
import { MatchRule } from "../matchRule";
import { SatisfyRule } from "../satisfyRule";

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

export { Block, BlockId, BLOCK_PROPERTIES };
