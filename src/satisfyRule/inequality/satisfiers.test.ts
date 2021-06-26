import chai from "chai";

import type { Module } from "../../module/types";
import type {
  SatisfierConstraint,
  SatisfierFilter,
  SatisfierLeafConstraint,
  SatisfierLeafFilter,
} from "../../satisfier/types";
import { inequalitySatisfier } from "./satisfiers";

chai.should();

const buildMask = (modules: Module[], filtered: string[]): boolean[] =>
  modules.map(([moduleStr]) => filtered.includes(moduleStr));

const isCorrectConstraint = (
  constraint: SatisfierConstraint,
  modules: Module[],
  isSatisfied: boolean
) => constraint(modules).should.eql({ isSatisfied });

const isCorrectFilter = (
  filter: SatisfierFilter,
  modules: Module[],
  filtered: string[]
) => filter(modules).should.eql({ assignedMask: buildMask(modules, filtered) });

describe("inequalitySatisfier", () => {
  const ref = "inequality";
  const modulesList1 = [
    ["CS2100", 4],
    ["GER1000", 4],
    ["CS2040S", 4],
    ["ST2131", 4],
    ["MA1521", 4],
    ["CS1231", 4],
    ["CS2030", 4],
  ] as Module[];

  it("should satisfy lower bound of MCs if total MC count is higher", () => {
    const satisfier = inequalitySatisfier(ref, ">=16");
    satisfier.should.have.property("constraint");

    const { constraint } = satisfier as SatisfierLeafConstraint;
    isCorrectConstraint(constraint, modulesList1, true);
  });

  it("should satisfy lower bound of MCs if total MC count is equal", () => {
    const satisfier = inequalitySatisfier(ref, ">=28");
    satisfier.should.have.property("constraint");

    const { constraint } = satisfier as SatisfierLeafConstraint;
    isCorrectConstraint(constraint, modulesList1, true);
  });

  it("should not satisfy lower bound of MCs if total MC count is lower", () => {
    const satisfier = inequalitySatisfier(ref, ">=40");
    satisfier.should.have.property("constraint");

    const { constraint } = satisfier as SatisfierLeafConstraint;
    isCorrectConstraint(constraint, modulesList1, false);
  });

  it("should preserve list of modules with upper bound of MCs if total MC count is equal", () => {
    const satisfier = inequalitySatisfier(ref, "<=28");
    satisfier.should.have.property("filter");

    const { filter } = satisfier as SatisfierLeafFilter;
    isCorrectFilter(
      filter,
      modulesList1,
      modulesList1.map(([moduleStr]) => moduleStr)
    );
  });

  it("should preserve list of modules with upper bound of MCs if total MC count is lower", () => {
    const satisfier = inequalitySatisfier(ref, "<=32");
    satisfier.should.have.property("filter");

    const { filter } = satisfier as SatisfierLeafFilter;
    isCorrectFilter(
      filter,
      modulesList1,
      modulesList1.map(([moduleStr]) => moduleStr)
    );
  });

  it("should truncate list of modules with upper bound of MCs at exact cutoff if total MC count is higher and there exists some starting sequence with exact MC count", () => {
    const satisfier = inequalitySatisfier(ref, "<=16");
    satisfier.should.have.property("filter");

    const { filter } = satisfier as SatisfierLeafFilter;
    isCorrectFilter(filter, modulesList1, [
      "CS2100",
      "GER1000",
      "CS2040S",
      "ST2131",
    ]);
  });

  it("should truncate list of modules with upper bound of MCs, cutting off at the minimum starting sequence that exceeds upper bound, if total MC count is higher and there exists no starting sequence with exact MC count", () => {
    const satisfier = inequalitySatisfier(ref, "<=17");
    satisfier.should.have.property("filter");

    const { filter } = satisfier as SatisfierLeafFilter;
    isCorrectFilter(filter, modulesList1, [
      "CS2100",
      "GER1000",
      "CS2040S",
      "ST2131",
      "MA1521",
    ]);
  });
});
