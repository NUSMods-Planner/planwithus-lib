import chai from "chai";
import { array, assert, property, sample } from "fast-check";
import addContext from "mochawesome/addContext";

import type { Module } from "../../module/types";
import type { SatisfierAssign } from "../../satisfier/types";
import { patternExampleList } from "./index.test";
import { patternToRE, patternSatisfier } from "./satisfiers";

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

const buildMask = (modules: Module[], added: string[]): boolean[] =>
  modules.map(([moduleStr]) => added.includes(moduleStr));

const isCorrectAssign = (
  assign: SatisfierAssign,
  modules: Module[],
  added: string[]
) => assign(modules).should.eql({ remainingMask: buildMask(modules, added) });

describe("patternSatisfier", () => {
  const ref = "pattern";
  const modulesList1: Module[] = [
    ["CS2100", 4],
    ["GER1000", 4],
    ["CS2040S", 4],
    ["ST2131", 4],
    ["MA1521", 4],
    ["CS1231", 4],
    ["CS2030", 4],
  ];

  it("should assign all modules with *", () => {
    const { assign } = patternSatisfier(ref, "*");
    isCorrectAssign(
      assign,
      modulesList1,
      modulesList1.map(([moduleStr]) => moduleStr)
    );
  });

  it("should assign only valid modules with pattern containing *", () => {
    const { assign } = patternSatisfier(ref, "CS2*");
    isCorrectAssign(assign, modulesList1, ["CS2100", "CS2040S", "CS2030"]);
  });

  it("should assign only valid modules with pattern containing x", () => {
    const { assign } = patternSatisfier(ref, "CS20xx");
    isCorrectAssign(assign, modulesList1, ["CS2030"]);
  });

  it("should assign only valid modules with pattern containing x and *", () => {
    const { assign } = patternSatisfier(ref, "CS20xx*");
    isCorrectAssign(assign, modulesList1, ["CS2040S", "CS2030"]);
  });
});
