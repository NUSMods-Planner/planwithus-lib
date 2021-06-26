import type { Module } from "../module/types";

type SatisfierBase = {
  ref: string;
  info?: string;
};

type Context = { context?: unknown };

type SatisfierReduce = (results: SatisfierResult[]) => {
  isSatisfied: boolean;
} & Context;
type SatisfierBranch = SatisfierBase &
  (
    | { satisfiers: Satisfier[] }
    | {
        satisfiers: Satisfier[];
        reduce: SatisfierReduce;
        message: string;
      }
  );

const isSatisfierBranch = (
  satisfier: Satisfier
): satisfier is SatisfierBranch => "satisfiers" in satisfier;

type SatisfierAssign = (remaining: Module[]) => {
  remainingMask: boolean[];
} & Context;
type SatisfierLeafAssign = SatisfierBase & { assign: SatisfierAssign };

const isSatisfierLeafAssign = (
  satisfier: Satisfier
): satisfier is SatisfierLeafAssign => "assign" in satisfier;

type SatisfierConstraint = (assigned: Module[]) => {
  isSatisfied: boolean;
} & Context;
type SatisfierLeafConstraint = SatisfierBase & {
  constraint: SatisfierConstraint;
  message: string;
};

const isSatisfierLeafConstraint = (
  satisfier: Satisfier
): satisfier is SatisfierLeafConstraint => "constraint" in satisfier;

type SatisfierFilter = (assigned: Module[]) => {
  assignedMask: boolean[];
} & Context;
type SatisfierLeafFilter = SatisfierBase & { filter: SatisfierFilter };

const isSatisfierLeafFilter = (
  satisfier: Satisfier
): satisfier is SatisfierLeafFilter => "filter" in satisfier;

type Satisfier =
  | SatisfierBranch
  | SatisfierLeafAssign
  | SatisfierLeafConstraint
  | SatisfierLeafFilter;

type SatisfierResult = SatisfierBase & {
  added: Module[];
  assigned: Module[];
  remaining: Module[];
  removed: Module[];
  isSatisfied: boolean;
  results: SatisfierResult[];
  message?: string;
} & Context;

export type {
  Satisfier,
  SatisfierAssign,
  SatisfierBranch,
  SatisfierConstraint,
  SatisfierFilter,
  SatisfierLeafAssign,
  SatisfierLeafConstraint,
  SatisfierLeafFilter,
  SatisfierReduce,
  SatisfierResult,
};
export {
  isSatisfierBranch,
  isSatisfierLeafAssign,
  isSatisfierLeafConstraint,
  isSatisfierLeafFilter,
};
