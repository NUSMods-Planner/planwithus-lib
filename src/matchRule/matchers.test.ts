import chai from "chai";

import { evaluateMatcher } from "../matcher";
import { matchRuleMatcher, patternMatchRuleMatcher } from "./matchers";

chai.should();

describe("matchRuleMatcher", () => {
  const modulesList1 = [
    "MA1100",
    "CS1231",
    "CS1231S",
    "MA1101R",
    "MA1513",
    "MA1102R",
    "MA1511",
    "MA1511A",
    "MA1512",
    "MA1507",
    "MA1521",
    "MA2101",
    "MA2101S",
  ];

  it("should match only valid modules with pattern match rule", () => {
    const matcher = patternMatchRuleMatcher({
      pattern: "MA1xxx*",
      exclude: "MA15xx",
      info: "swag",
    });
    evaluateMatcher(modulesList1, matcher).should.eql({
      matched: ["MA1100", "MA1101R", "MA1102R", "MA1511A"],
      remaining: [
        "CS1231",
        "CS1231S",
        "MA1513",
        "MA1511",
        "MA1512",
        "MA1507",
        "MA1521",
        "MA2101",
        "MA2101S",
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
      matched: ["MA1513", "MA1511", "MA1511A", "MA1512", "MA1507", "MA1521"],
      remaining: [
        "MA1100",
        "CS1231",
        "CS1231S",
        "MA1101R",
        "MA1102R",
        "MA2101",
        "MA2101S",
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
        "CS1231",
        "MA1100",
        "CS1231S",
        "MA2101",
        "MA2101S",
        "MA1101R",
        "MA1102R",
        "MA1511",
        "MA1512",
        "MA1511A",
      ],
      remaining: ["MA1513", "MA1507", "MA1521"],
      infos: ["foo", "bar", "swag", "true swag"],
    });
  });
});
