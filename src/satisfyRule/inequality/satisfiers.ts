import type { Module } from "../../module";
import type {
  Satisfier,
  SatisfierLeafConstraint,
  SatisfierLeafFilter,
} from "../../satisfier";
import { parseInequality } from "./";
import type { Inequality } from "./types";
import { InequalitySign } from "./types";

const calculateTotalMCs = (assigned: Module[]) =>
  assigned.map(([, mc]) => mc).reduce((x, y) => x + y, 0);

const atLeastInequalitySatisfier = (
  ref: string,
  n: number
): SatisfierLeafConstraint => ({
  ref,
  constraint: (assigned) => ({ isSatisfied: calculateTotalMCs(assigned) >= n }),
  message: `modules do not meet minimum MC requirement of ${n}`,
});

const atMostInequalitySatisfier = (
  ref: string,
  n: number
): SatisfierLeafFilter => ({
  ref,
  filter: (assigned) => {
    const [assignedMask] = assigned.reduce(
      ([accAssignedMask, accMC], [, moduleMC]) =>
        accMC < n
          ? [[...accAssignedMask, true], accMC + moduleMC]
          : [[...accAssignedMask, false], accMC],
      [[] as boolean[], 0]
    );
    return { assignedMask };
  },
});

const inequalitySatisfier = (
  ref: string,
  inequality: Inequality
): Satisfier => {
  const [sign, n] = parseInequality(inequality);
  return sign === InequalitySign.AtLeast
    ? atLeastInequalitySatisfier(ref, n)
    : atMostInequalitySatisfier(ref, n);
};

export { inequalitySatisfier };
