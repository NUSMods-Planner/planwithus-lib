import type { Module } from "../../module/types";
import type { SatisfierLeaf } from "../../satisfier/types";
import { parseInequality } from "./";
import type { Inequality } from "./types";
import { InequalitySign } from "./types";

const calculateTotalMCs = (assigned: Module[]) =>
  assigned.map(([, mc]) => mc).reduce((x, y) => x + y);

const inequalitySatisfier = (inequality: Inequality): SatisfierLeaf => {
  const [sign, n] = parseInequality(inequality);
  return sign === InequalitySign.AtLeast
    ? {
        constraint: (assigned) => calculateTotalMCs(assigned) >= n,
        infos: [],
        messages: [`modules do not meet minimum MC requirement of ${n}`],
      }
    : {
        constraint: (assigned) => calculateTotalMCs(assigned) <= n,
        infos: [],
        messages: [`modules exceed the maximum MC requirement of ${n}`],
      };
};

export { inequalitySatisfier };
