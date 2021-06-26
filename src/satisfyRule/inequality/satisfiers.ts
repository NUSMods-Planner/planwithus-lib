import type { Module } from "../../module/types";
import type { SatisfierLeaf } from "../../satisfier/types";
import { parseInequality } from "./";
import type { Inequality } from "./types";
import { InequalitySign } from "./types";

const calculateTotalMCs = (assigned: Module[]) =>
  assigned.map(([, mc]) => mc).reduce((x, y) => x + y, 0);

const inequalitySatisfier = (inequality: Inequality): SatisfierLeaf => {
  const [sign, n] = parseInequality(inequality);
  return {
    type: "inequality",
    rule: inequality,
    constraint: (assigned) =>
      sign === InequalitySign.AtLeast
        ? calculateTotalMCs(assigned) >= n
        : calculateTotalMCs(assigned) <= n,
  };
};

export { inequalitySatisfier };
