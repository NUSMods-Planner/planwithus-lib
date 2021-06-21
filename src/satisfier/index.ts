import type { Module } from "../module/types";
import type { Satisfier, SatisfierResult } from "./types";
import { isSatisfierBranch, isSatisfierLeaf } from "./types";

const evaluateSatisfier = (
  assigned: Module[],
  satisfier: Satisfier
): SatisfierResult => {
  if (isSatisfierLeaf(satisfier)) {
    const { constraint, infos, messages } = satisfier;
    const satisfied = constraint(assigned);
    return satisfied
      ? {
          assigned,
          satisfied,
          infos,
          messages: [],
        }
      : {
          assigned,
          satisfied,
          infos: [],
          messages,
        };
  } else if (isSatisfierBranch(satisfier)) {
    const { filter, satisfiers, constraint } = satisfier;
    const newAssigned = filter(assigned);
    const satisfierResult: SatisfierResult = {
      assigned: newAssigned,
      satisfied: true,
      infos: [],
      messages: [],
    };

    const [newSatisfieds, newSatisfierResult] = satisfiers.reduce(
      ([accSatisfieds, satisfierResult], satisfier) => {
        const { infos: accInfos, messages: accMessages } = satisfierResult;
        const { satisfied, infos, messages } = evaluateSatisfier(
          newAssigned,
          satisfier
        );
        return [
          [...accSatisfieds, satisfied],
          {
            assigned: newAssigned,
            satisfied,
            infos: accInfos.concat(infos),
            messages: accMessages.concat(messages),
          },
        ];
      },
      [[] as boolean[], satisfierResult]
    );

    const satisfied = constraint(newSatisfieds);
    return satisfied
      ? { ...newSatisfierResult, satisfied, messages: [] }
      : { ...newSatisfierResult, assigned, satisfied, infos: [] };
  } else {
    throw new Error("satisfier is not well-defined");
  }
};

export { evaluateSatisfier };
