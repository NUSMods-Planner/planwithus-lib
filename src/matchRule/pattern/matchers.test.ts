import chai from "chai";
import { array, assert, property, sample } from "fast-check";
import addContext from "mochawesome/addContext";

import { evaluateMatcher } from "../../matcher";
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
  const modulesList1 = [
    "CS2100",
    "GER1000",
    "CS2040S",
    "ST2131",
    "MA1521",
    "CS1231",
    "CS2030",
  ];

  it("should match all modules with *", () => {
    const matcher = patternMatcher("*");
    evaluateMatcher(modulesList1, matcher).should.eql({
      matched: modulesList1,
      remaining: [],
      infos: [],
    });
  });

  it("should match only valid modules with pattern containing *", () => {
    const matcher = patternMatcher("CS2*");
    evaluateMatcher(modulesList1, matcher).should.eql({
      matched: ["CS2100", "CS2040S", "CS2030"],
      remaining: ["GER1000", "ST2131", "MA1521", "CS1231"],
      infos: [],
    });
  });

  it("should match only valid modules with pattern containing x", () => {
    const matcher = patternMatcher("CS20xx");
    evaluateMatcher(modulesList1, matcher).should.eql({
      matched: ["CS2030"],
      remaining: ["CS2100", "GER1000", "CS2040S", "ST2131", "MA1521", "CS1231"],
      infos: [],
    });
  });

  it("should match only valid modules with pattern containing x and *", () => {
    const matcher = patternMatcher("CS20xx*");
    evaluateMatcher(modulesList1, matcher).should.eql({
      matched: ["CS2040S", "CS2030"],
      remaining: ["CS2100", "GER1000", "ST2131", "MA1521", "CS1231"],
      infos: [],
    });
  });
});

export { pattern };
