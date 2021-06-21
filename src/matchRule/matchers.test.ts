import chai from "chai";

import { evaluateMatcher } from "../matcher";
import type { Module } from "../module/types";
import { matchRuleMatcher, patternMatchRuleMatcher } from "./matchers";

chai.should();

describe("matchRuleMatcher", () => {
  const modulesList1: Module[] = [
    ["MA1100", 4],
    ["CS1231", 4],
    ["CS1231S", 4],
    ["MA1101R", 4],
    ["MA1513", 4],
    ["MA1102R", 4],
    ["MA1511", 4],
    ["MA1511A", 4],
    ["MA1512", 4],
    ["MA1507", 4],
    ["MA1521", 4],
    ["MA2101", 4],
    ["MA2101S", 4],
  ];

  it("should match only valid modules with pattern match rule", () => {
    const matcher = patternMatchRuleMatcher({
      pattern: "MA1xxx*",
      exclude: "MA15xx",
      info: "swag",
    });
    evaluateMatcher(modulesList1, matcher).should.eql({
      matched: [
        ["MA1100", 4],
        ["MA1101R", 4],
        ["MA1102R", 4],
        ["MA1511A", 4],
      ],
      remaining: [
        ["CS1231", 4],
        ["CS1231S", 4],
        ["MA1513", 4],
        ["MA1511", 4],
        ["MA1512", 4],
        ["MA1507", 4],
        ["MA1521", 4],
        ["MA2101", 4],
        ["MA2101S", 4],
      ],
      infos: ["swag"],
    });
  });

  it("should match only valid modules once if or rule has duplicate rules", () => {
    const matcher = matchRuleMatcher({
      or: [
        { pattern: "MA1xxx*", exclude: "MA11xx*", info: "hi1" },
        { pattern: "MA1xxx*", exclude: "MA11xx*", info: "hi2" },
      ],
    });
    evaluateMatcher(modulesList1, matcher).should.eql({
      matched: [
        ["MA1513", 4],
        ["MA1511", 4],
        ["MA1511A", 4],
        ["MA1512", 4],
        ["MA1507", 4],
        ["MA1521", 4],
      ],
      remaining: [
        ["MA1100", 4],
        ["CS1231", 4],
        ["CS1231S", 4],
        ["MA1101R", 4],
        ["MA1102R", 4],
        ["MA2101", 4],
        ["MA2101S", 4],
      ],
      infos: ["hi1"],
    });
  });

  it("should match no modules if and rule has duplicate rules", () => {
    const matcher = matchRuleMatcher({
      and: [
        { pattern: "MA1xxx*", exclude: "MA11xx*", info: "hi1" },
        { pattern: "MA1xxx*", exclude: "MA11xx*", info: "hi2" },
      ],
    });
    evaluateMatcher(modulesList1, matcher).should.eql({
      matched: [],
      remaining: modulesList1,
      infos: [],
    });
  });

  it("should match only valid modules with recursive match rules", () => {
    const matcher = matchRuleMatcher({
      or: [
        { pattern: "CS1231", info: "foo" },
        "MA1100",
        {
          and: [
            { pattern: "CS1231*", info: "bar" },
            { pattern: "MA2101*", info: "swag" },
          ],
        },
        {
          and: [
            {
              or: [{ and: ["MA1511", "MA1512"] }, { pattern: "ACC*" }],
            },
            {
              and: [
                { pattern: "CS1231S", info: "swaggy" },
                { pattern: "MA1101R", info: "thomas" },
                "MA1102R",
              ],
            },
            "MA1xxx*",
          ],
        },
        {
          and: [
            { pattern: "MA11xx*", info: "true swag" },
            "MA1511",
            "MA1512",
            { or: ["MA6220", "MA1511A"] },
          ],
        },
      ],
    });
    evaluateMatcher(modulesList1, matcher).should.eql({
      matched: [
        ["CS1231", 4],
        ["MA1100", 4],
        ["CS1231S", 4],
        ["MA2101", 4],
        ["MA2101S", 4],
        ["MA1101R", 4],
        ["MA1102R", 4],
        ["MA1511", 4],
        ["MA1512", 4],
        ["MA1511A", 4],
      ],
      remaining: [
        ["MA1513", 4],
        ["MA1507", 4],
        ["MA1521", 4],
      ],
      infos: ["foo", "bar", "swag", "true swag"],
    });
  });
});
