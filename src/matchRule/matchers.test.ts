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
      type: "patternMatchRule",
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
      results: [],
      info: "swag",
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
      type: "orMatchRule",
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
      results: [
        {
          type: "patternMatchRule",
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
          results: [],
          info: "hi1",
        },
        {
          type: "patternMatchRule",
          matched: [],
          remaining: [
            ["MA1100", 4],
            ["CS1231", 4],
            ["CS1231S", 4],
            ["MA1101R", 4],
            ["MA1102R", 4],
            ["MA2101", 4],
            ["MA2101S", 4],
          ],
          results: [],
        },
      ],
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
      type: "andMatchRule",
      matched: [],
      remaining: modulesList1,
      results: [
        {
          type: "patternMatchRule",
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
          results: [],
          info: "hi1",
        },
        {
          type: "patternMatchRule",
          matched: [],
          remaining: [
            ["MA1100", 4],
            ["CS1231", 4],
            ["CS1231S", 4],
            ["MA1101R", 4],
            ["MA1102R", 4],
            ["MA2101", 4],
            ["MA2101S", 4],
          ],
          results: [],
        },
      ],
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
          and: [{ pattern: "CS1231S", info: "swaggy" }, "MA1xxx*"],
        },
      ],
    });

    const matcherResult = evaluateMatcher(modulesList1, matcher);
    matcherResult.should.have.property("type");
    matcherResult.type.should.equal("orMatchRule");
    matcherResult.should.have.property("matched");
    matcherResult.matched.should.eql([
      ["CS1231", 4],
      ["MA1100", 4],
      ["CS1231S", 4],
      ["MA2101", 4],
      ["MA2101S", 4],
    ]);
    matcherResult.should.have.property("remaining");
    matcherResult.remaining.should.eql([
      ["MA1101R", 4],
      ["MA1513", 4],
      ["MA1102R", 4],
      ["MA1511", 4],
      ["MA1511A", 4],
      ["MA1512", 4],
      ["MA1507", 4],
      ["MA1521", 4],
    ]);

    matcherResult.should.have.property("results");
    const results = matcherResult.results;
    results.should.have.lengthOf(4);
    results[0].should.eql({
      type: "patternMatchRule",
      matched: [["CS1231", 4]],
      remaining: [
        ["MA1100", 4],
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
      ],
      results: [],
      info: "foo",
    });
    results[1].should.eql({
      type: "pattern",
      matched: [["MA1100", 4]],
      remaining: [
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
      ],
      results: [],
    });
    results[2].should.eql({
      type: "andMatchRule",
      matched: [
        ["CS1231S", 4],
        ["MA2101", 4],
        ["MA2101S", 4],
      ],
      remaining: [
        ["MA1101R", 4],
        ["MA1513", 4],
        ["MA1102R", 4],
        ["MA1511", 4],
        ["MA1511A", 4],
        ["MA1512", 4],
        ["MA1507", 4],
        ["MA1521", 4],
      ],
      results: [
        {
          type: "patternMatchRule",
          matched: [["CS1231S", 4]],
          remaining: [
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
          ],
          results: [],
          info: "bar",
        },
        {
          type: "patternMatchRule",
          matched: [
            ["MA2101", 4],
            ["MA2101S", 4],
          ],
          remaining: [
            ["MA1101R", 4],
            ["MA1513", 4],
            ["MA1102R", 4],
            ["MA1511", 4],
            ["MA1511A", 4],
            ["MA1512", 4],
            ["MA1507", 4],
            ["MA1521", 4],
          ],
          results: [],
          info: "swag",
        },
      ],
    });
    results[3].should.eql({
      type: "andMatchRule",
      matched: [],
      remaining: [
        ["MA1101R", 4],
        ["MA1513", 4],
        ["MA1102R", 4],
        ["MA1511", 4],
        ["MA1511A", 4],
        ["MA1512", 4],
        ["MA1507", 4],
        ["MA1521", 4],
      ],
      results: [
        {
          type: "patternMatchRule",
          matched: [],
          remaining: [
            ["MA1101R", 4],
            ["MA1513", 4],
            ["MA1102R", 4],
            ["MA1511", 4],
            ["MA1511A", 4],
            ["MA1512", 4],
            ["MA1507", 4],
            ["MA1521", 4],
          ],
          results: [],
        },
        {
          type: "pattern",
          matched: [
            ["MA1101R", 4],
            ["MA1513", 4],
            ["MA1102R", 4],
            ["MA1511", 4],
            ["MA1511A", 4],
            ["MA1512", 4],
            ["MA1507", 4],
            ["MA1521", 4],
          ],
          remaining: [],
          results: [],
        },
      ],
    });
  });
});
