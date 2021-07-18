import chai from "chai";

import type { Module } from "../module";
import type { SatisfierAssign } from "../satisfier";
import { patternMatchRuleSatisfier } from "./satisfiers";

chai.should();

const buildMask = (modules: Module[], added: string[]): boolean[] =>
  modules.map(([moduleStr]) => added.includes(moduleStr));

const isCorrectAssign = (
  assign: SatisfierAssign,
  modules: Module[],
  added: string[]
) => assign(modules).should.eql({ remainingMask: buildMask(modules, added) });

describe("patternMatchRuleSatisfier", () => {
  const ref = "patternMatchRule";
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

  it("should assign only valid modules with pattern match rule containing no exclude patterns", () => {
    const { assign } = patternMatchRuleSatisfier(ref, { pattern: "CS1xxx*" });
    isCorrectAssign(assign, modulesList1, ["CS1231", "CS1231S"]);
  });

  it("should assign only valid modules with pattern match rule containing an exclude pattern", () => {
    const { assign } = patternMatchRuleSatisfier(ref, {
      pattern: "MA1xxx*",
      exclude: "MA15xx",
    });
    isCorrectAssign(assign, modulesList1, [
      "MA1100",
      "MA1101R",
      "MA1102R",
      "MA1511A",
    ]);
  });

  it("should assign only valid modules with pattern match rule containing multiple exclude patterns", () => {
    const { assign } = patternMatchRuleSatisfier(ref, {
      pattern: "MA*",
      exclude: ["MA151x*", "MA2xxx"],
    });
    isCorrectAssign(assign, modulesList1, [
      "MA1100",
      "MA1101R",
      "MA1102R",
      "MA1507",
      "MA1521",
      "MA2101S",
    ]);
  });
});
