import chai from "chai";

import { evaluateSatisfier } from "../../satisfier";
import type { Module } from "../../module/types";
import { inequalitySatisfier } from "./satisfiers";

chai.should();

describe("inequalitySatisfier", () => {
  const modulesList1 = [
    ["CS2100", 4],
    ["GER1000", 4],
    ["CS2040S", 4],
    ["ST2131", 4],
    ["MA1521", 4],
    ["CS1231", 4],
    ["CS2030", 4],
  ] as Module[];

  it("should satisfy upper bound of MCs if total MC count is equal", () => {
    const satisfier1 = inequalitySatisfier("<=28");
    evaluateSatisfier(modulesList1, satisfier1).should.eql({
      type: "inequality",
      satisfied: true,
      assigned: modulesList1,
      results: [],
    });
  });

  it("should satisfy upper bound of MCs if total MC count is lower", () => {
    const satisfier2 = inequalitySatisfier("<=32");
    evaluateSatisfier(modulesList1, satisfier2).should.eql({
      type: "inequality",
      satisfied: true,
      assigned: modulesList1,
      results: [],
    });
  });

  it("should not satisfy upper bound of MCs if total MC count is higher", () => {
    const satisfier = inequalitySatisfier("<=16");
    evaluateSatisfier(modulesList1, satisfier).should.eql({
      type: "inequality",
      satisfied: false,
      assigned: modulesList1,
      results: [],
    });
  });

  it("should satisfy lower bound of MCs if total MC count is higher", () => {
    const satisfier = inequalitySatisfier(">=16");
    evaluateSatisfier(modulesList1, satisfier).should.eql({
      type: "inequality",
      satisfied: true,
      assigned: modulesList1,
      results: [],
    });
  });

  it("should satisfy lower bound of MCs if total MC count is equal", () => {
    const satisfier = inequalitySatisfier(">=28");
    evaluateSatisfier(modulesList1, satisfier).should.eql({
      type: "inequality",
      satisfied: true,
      assigned: modulesList1,
      results: [],
    });
  });

  it("should not satisfy lower bound of MCs if total MC count is lower", () => {
    const satisfier = inequalitySatisfier(">=40");
    evaluateSatisfier(modulesList1, satisfier).should.eql({
      type: "inequality",
      satisfied: false,
      assigned: modulesList1,
      results: [],
    });
  });
});
