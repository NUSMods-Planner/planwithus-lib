import type { Module } from "../module/types";
import type { Satisfier, SatisfierResult } from "./types";
import { isSatisfierBranch, isSatisfierLeaf } from "./types";

const evaluateSatisfier = (
  assigned: Module[],
  satisfier: Satisfier
): SatisfierResult => {
  if (isSatisfierLeaf(satisfier)) {
    const { type, rule, constraint, info } = satisfier;
    const satisfied = constraint(assigned);
    return Object.assign(
      {
        type,
        rule,
        assigned,
        satisfied,
        results: [],
      },
      satisfied && typeof info !== "undefined" ? { info } : {}
    );
  } else if (isSatisfierBranch(satisfier)) {
    const { type, rule, filter, satisfiers, constraint } = satisfier;
    const newAssigned = filter(assigned);
    const satisfierResult: SatisfierResult = {
      type,
      rule,
      assigned: newAssigned,
      satisfied: true,
      results: [],
    };

    const [newSatisfieds, newSatisfierResult] = satisfiers.reduce(
      (
        [accSatisfieds, { assigned: accAssigned, results: accResults }],
        satisfier
      ) => {
        const result = evaluateSatisfier(newAssigned, satisfier);
        const { satisfied } = result;
        return [
          [...accSatisfieds, satisfied],
          {
            type,
            rule,
            assigned: accAssigned,
            satisfied: true,
            results: [...accResults, result],
          },
        ];
      },
      [[] as boolean[], satisfierResult]
    );

    const satisfied = constraint(newSatisfieds);
    const { results: newResults } = newSatisfierResult;
    return satisfied
      ? newSatisfierResult
      : { ...satisfierResult, satisfied, results: newResults };
  } else {
    throw new Error("satisfier is not well-defined");
  }
};

export { evaluateSatisfier };
