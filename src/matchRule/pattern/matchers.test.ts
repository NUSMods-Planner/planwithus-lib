import chai from "chai";
import { array, assert, property, sample } from "fast-check";
import addContext from "mochawesome/addContext";

import { evaluateMatcher } from "../../matcher";
import type { Module } from "../../module/types";
import { pattern, patternExampleList } from "./index.test";
import { patternToRE, patternMatcher } from "./matchers";

chai.should();

const isInvalidExample = (re: RegExp, example: string) =>
  re.test.bind(re)(example).should.be.false;

describe("patternToRE", () => {
  it("should match valid modules with a single pattern", function () {
    sample(patternExampleList, 10).forEach((sample, i) =>
      addContext(this, {
        title: `patternExampleList sample ${i}`,
        value: sample,
      })
    );
    return assert(
      property(patternExampleList, ([patternStr, examples]) => {
        const re = patternToRE(patternStr);
        return examples.every(re.test.bind(re));
      })
    );
  });

  it("should match valid modules with multiple patterns", function () {
    const patternExampleListArray = array(patternExampleList, { minLength: 1 });
    sample(patternExampleListArray, 10).forEach((sample, i) =>
      addContext(this, {
        title: `patternExampleListArray sample ${i}`,
        value: sample,
      })
    );
    return assert(
      property(patternExampleListArray, (ts) => {
        const re = patternToRE(...ts.map(([patternStr]) => patternStr));
        return ts
          .map(([, examples]) => examples)
          .flat()
          .every(re.test.bind(re));
      })
    );
  });

  it("should not match x to non-number", () => {
    const re = patternToRE("x");
    ["A", "Z", "c", "#"].forEach((example) => isInvalidExample(re, example));
  });

  it("should not match * to a substring composed of characters other than A-Z and 0-9", () => {
    const re = patternToRE("*");
    ["c", "Ac", "cA", "0Ax", "x0A", "BA#", "#AB"].forEach((example) =>
      isInvalidExample(re, example)
    );
  });

  it("should not match substrings", () => {
    const re = patternToRE("A*xC");
    ["A1CZ", "AC1CZ", "ZA1C", "ZAC1C", "ZA1CZ", "ZAC1CZ"].forEach((example) =>
      isInvalidExample(re, example)
    );
  });
});

describe("patternMatcher", () => {
  const modulesList1: Module[] = [
    ["CS2100", 4],
    ["GER1000", 4],
    ["CS2040S", 4],
    ["ST2131", 4],
    ["MA1521", 4],
    ["CS1231", 4],
    ["CS2030", 4],
  ];

  it("should match all modules with *", () => {
    const matcher = patternMatcher("*");
    evaluateMatcher(modulesList1, matcher).should.eql({
      type: "pattern",
      matched: modulesList1,
      remaining: [],
      results: [],
    });
  });

  it("should match only valid modules with pattern containing *", () => {
    const matcher = patternMatcher("CS2*");
    evaluateMatcher(modulesList1, matcher).should.eql({
      type: "pattern",
      matched: [
        ["CS2100", 4],
        ["CS2040S", 4],
        ["CS2030", 4],
      ],
      remaining: [
        ["GER1000", 4],
        ["ST2131", 4],
        ["MA1521", 4],
        ["CS1231", 4],
      ],
      results: [],
    });
  });

  it("should match only valid modules with pattern containing x", () => {
    const matcher = patternMatcher("CS20xx");
    evaluateMatcher(modulesList1, matcher).should.eql({
      type: "pattern",
      matched: [["CS2030", 4]],
      remaining: [
        ["CS2100", 4],
        ["GER1000", 4],
        ["CS2040S", 4],
        ["ST2131", 4],
        ["MA1521", 4],
        ["CS1231", 4],
      ],
      results: [],
    });
  });

  it("should match only valid modules with pattern containing x and *", () => {
    const matcher = patternMatcher("CS20xx*");
    evaluateMatcher(modulesList1, matcher).should.eql({
      type: "pattern",
      matched: [
        ["CS2040S", 4],
        ["CS2030", 4],
      ],
      remaining: [
        ["CS2100", 4],
        ["GER1000", 4],
        ["ST2131", 4],
        ["MA1521", 4],
        ["CS1231", 4],
      ],
      results: [],
    });
  });
});

export { pattern };
