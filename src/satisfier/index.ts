import type { Module } from "../module/types";
import type {
  Satisfier,
  SatisfierBranch,
  SatisfierLeafAssign,
  SatisfierLeafConstraint,
  SatisfierLeafFilter,
  SatisfierResult,
} from "./types";
import {
  isSatisfierBranch,
  isSatisfierLeafAssign,
  isSatisfierLeafConstraint,
  isSatisfierLeafFilter,
} from "./types";

const evaluateSatisfierLeafAssign = (
  assigned: Module[],
  remaining: Module[],
  { ref, info, assign }: SatisfierLeafAssign
): SatisfierResult => {
  const { remainingMask, context } = assign(remaining);
  const newAssigned = remaining.filter((module, i) => remainingMask[i]);
  const newRemaining = remaining.filter((module, i) => !remainingMask[i]);
  const isSatisfied = newAssigned.length > 0;
  return Object.assign(
    {
      ref,
      added: isSatisfied ? newAssigned : [],
      assigned: isSatisfied ? [...assigned, ...newAssigned] : assigned,
      remaining: isSatisfied ? newRemaining : remaining,
      removed: [],
      isSatisfied,
      results: [],
    },
    typeof info === "undefined" ? {} : { info },
    typeof context === "undefined" ? {} : { context }
  );
};

const evaluateSatisfierLeafConstraint = (
  assigned: Module[],
  remaining: Module[],
  { ref, info, constraint, message }: SatisfierLeafConstraint
): SatisfierResult => {
  const { isSatisfied, context } = constraint(assigned);
  return Object.assign(
    {
      ref,
      added: [],
      assigned,
      remaining,
      removed: [],
      isSatisfied,
      results: [],
    },
    isSatisfied ? {} : { message },
    typeof info === "undefined" ? {} : { info },
    typeof context === "undefined" ? {} : { context }
  );
};

const evaluateSatisfierLeafFilter = (
  assigned: Module[],
  remaining: Module[],
  { ref, info, filter }: SatisfierLeafFilter
): SatisfierResult => {
  const { assignedMask, context } = filter(assigned);
  const newAssigned = assigned.filter((module, i) => assignedMask[i]);
  const newRemaining = assigned.filter((module, i) => !assignedMask[i]);
  return Object.assign(
    {
      ref,
      added: [],
      assigned: newAssigned,
      remaining: [...remaining, ...newRemaining],
      removed: newRemaining,
      isSatisfied: true,
      results: [],
    },
    typeof info === "undefined" ? {} : { info },
    typeof context === "undefined" ? {} : { context }
  );
};

const evaluateSatisfierBranch = (
  assigned: Module[],
  remaining: Module[],
  satisfier: SatisfierBranch
): SatisfierResult => {
  const { ref, info, satisfiers } = satisfier;
  const results = satisfiers.reduce((accResults, satisfier) => {
    const { assigned: accAssigned, remaining: accRemaining } =
      accResults.length === 0
        ? { assigned, remaining }
        : accResults[accResults.length - 1];
    const result = evaluateSatisfier(accAssigned, accRemaining, satisfier);
    return [...accResults, result];
  }, [] as SatisfierResult[]);
  const { assigned: newAssigned, remaining: newRemaining } =
    results.length === 0
      ? { assigned, remaining }
      : results[results.length - 1];

  if ("reduce" in satisfier) {
    const { reduce, message } = satisfier;
    const { isSatisfied, context } = reduce(results);
    return Object.assign(
      { ref, isSatisfied, results },
      isSatisfied
        ? {
            added: remaining.filter(([moduleStr1]) =>
              newAssigned.some(([moduleStr2]) => moduleStr1 === moduleStr2)
            ),
            assigned: newAssigned,
            remaining: newRemaining,
            removed: assigned.filter(([moduleStr1]) =>
              newRemaining.some(([moduleStr2]) => moduleStr1 === moduleStr2)
            ),
          }
        : {
            added: [],
            assigned,
            remaining,
            removed: [],
            message,
          },
      typeof info === "undefined" ? {} : { info },
      typeof context === "undefined" ? {} : { context }
    );
  } else {
    return Object.assign(
      {
        ref,
        isSatisfied: true,
        results,
        added: remaining.filter(([moduleStr1]) =>
          newAssigned.some(([moduleStr2]) => moduleStr1 === moduleStr2)
        ),
        assigned: newAssigned,
        remaining: newRemaining,
        removed: assigned.filter(([moduleStr1]) =>
          newRemaining.some(([moduleStr2]) => moduleStr1 === moduleStr2)
        ),
      },
      typeof info === "undefined" ? {} : { info }
    );
  }
};

const evaluateSatisfier = (
  assigned: Module[],
  remaining: Module[],
  satisfier: Satisfier
): SatisfierResult => {
  if (isSatisfierLeafAssign(satisfier)) {
    return evaluateSatisfierLeafAssign(assigned, remaining, satisfier);
  } else if (isSatisfierLeafConstraint(satisfier)) {
    return evaluateSatisfierLeafConstraint(assigned, remaining, satisfier);
  } else if (isSatisfierLeafFilter(satisfier)) {
    return evaluateSatisfierLeafFilter(assigned, remaining, satisfier);
  } else if (isSatisfierBranch(satisfier)) {
    return evaluateSatisfierBranch(assigned, remaining, satisfier);
  } else {
    throw new Error("satisfier is not well-defined");
  }
};

export { evaluateSatisfier };
