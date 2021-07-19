import {
  array,
  constant,
  constantFrom,
  integer,
  letrec,
  oneof,
  record,
  string,
  tuple,
  webUrl,
} from "fast-check";

import { matchRule } from "../matchRule/index.test";
import { satisfyRule } from "../satisfyRule/index.test";
import { some } from "../some/index.test";
import type { Block } from "./";

const BLOCK_KEYWORDS = [
  "name",
  "ay",
  "assign",
  "match",
  "satisfy",
  "url",
  "info",
  "isSelectable",
];

const { block } = letrec((tie) => ({
  block: tuple(
    record(
      {
        name: string(),
        ay: integer({ min: 1950, max: 2030 }),
        assign: some(string(), { maxLength: 5 }),
        match: some(matchRule, { maxLength: 5 }),
        satisfy: some(satisfyRule, { maxLength: 5 }),
        url: webUrl(),
        info: string(),
        isSelectable: constant(true),
      },
      { requiredKeys: [] }
    ),
    oneof(
      { depthFactor: 0.8, withCrossShrink: true },
      constantFrom([]),
      array(
        tuple(
          string().filter((blockId) => !BLOCK_KEYWORDS.includes(blockId)),
          tie("block")
        ),
        { maxLength: 5 }
      )
    )
  ).map(
    (t: [unknown, [string, unknown][]]) =>
      ({
        ...(t[0] as Block),
        ...(Object.fromEntries(t[1]) as Record<string, Block>),
      } as Block)
  ),
}));

export { block };
