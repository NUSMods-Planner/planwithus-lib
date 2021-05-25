import { BLOCK_PROPERTIES } from "./block";
import { INFO_PROPERTIES } from "./info";
import { MATCH_RULE_PROPERTIES } from "./matchRule";
import { SATISFY_RULE_PROPERTIES } from "./satisfyRule";

const RESERVED_PROPERTIES = [
  ...BLOCK_PROPERTIES,
  ...INFO_PROPERTIES,
  ...MATCH_RULE_PROPERTIES,
  ...SATISFY_RULE_PROPERTIES,
];

export { RESERVED_PROPERTIES };
