import { Directory } from "../directory";
import { matchRuleSatisfier } from "../matchRule";
import { evaluateSatisfier } from "../satisfier";
import type {
  SatisfierBranch,
  SatisfierLeafAssign,
  SatisfierResult,
} from "../satisfier";
import { satisfyRuleSatisfier } from "../satisfyRule";
import type { Some } from "../some";
import type { BlockId } from "./blockId";

const assignBlockSatisfier = (
  prefix: string,
  dir: Directory,
  ref: string,
  blockId: BlockId
): SatisfierLeafAssign => ({
  ref,
  assign: (remaining) => {
    const result = evaluateSatisfier(
      [],
      remaining,
      blockSatisfier(prefix, dir, ref, blockId)
    );
    const { assigned: blockAssigned } = result;
    return {
      remainingMask: remaining.map(([moduleStr1]) =>
        blockAssigned.some(([moduleStr2]) => moduleStr1 === moduleStr2)
      ),
      context: result,
    };
  },
});

const assignSatisfier = (
  prefix: string,
  dir: Directory,
  ref: string,
  assign: Some<BlockId>
): SatisfierBranch => {
  const assignBlockIds: BlockId[] =
    typeof assign === "undefined"
      ? []
      : Array.isArray(assign)
      ? assign
      : [assign];
  return {
    ref,
    satisfiers: assignBlockIds.map((blockId) =>
      assignBlockSatisfier(prefix, dir, [ref, blockId].join("/"), blockId)
    ),
  };
};

const blockSatisfier = (
  prefix: string,
  dir: Directory,
  ref: string,
  blockId: BlockId
): SatisfierBranch => {
  const [newPrefix, block] = dir.find(prefix, blockId);
  const { assign, match, satisfy, info } = block;
  return Object.assign(
    {
      ref,
      satisfiers: [
        typeof assign === "undefined"
          ? []
          : [
              assignSatisfier(
                newPrefix,
                dir,
                [ref, "assign"].join("/"),
                assign
              ),
            ],
        typeof match === "undefined"
          ? []
          : [matchRuleSatisfier([ref, "match"].join("/"), match)],
        typeof satisfy === "undefined"
          ? []
          : [
              satisfyRuleSatisfier(
                newPrefix,
                dir,
                [ref, "satisfy"].join("/"),
                satisfy
              ),
            ],
      ].flat(),
      reduce: (results: SatisfierResult[]) => ({
        isSatisfied:
          typeof satisfy === "undefined"
            ? true
            : results[results.length - 1].isSatisfied,
      }),
      message: "block does not satisfy all rules",
    },
    typeof info === "undefined" ? {} : { info }
  );
};

export { blockSatisfier };
