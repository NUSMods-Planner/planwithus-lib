import type { BlockId } from "../block/blockId";
import { blockSatisfier } from "../block";
import { Directory } from "../directory";
import type {
  Satisfier,
  SatisfierBranch,
  SatisfierLeafConstraint,
} from "../satisfier";
import { evaluateSatisfier } from "../satisfier";
import type { Some } from "../some";
import { inequalitySatisfier } from "./inequality";
import type {
  AndSatisfyRule,
  MCSatisfyRule,
  OrSatisfyRule,
  SatisfyRule,
} from "./types";

const blockIdSatisfier = (
  prefix: string,
  dir: Directory,
  ref: string,
  blockId: BlockId
): SatisfierLeafConstraint => ({
  ref,
  constraint: (assigned) => {
    const result = evaluateSatisfier(
      [],
      assigned,
      blockSatisfier(prefix, dir, ref, blockId)
    );
    const { isSatisfied } = result;
    return { isSatisfied, context: result };
  },
  message: `modules do not satisfy block '${blockId}'`,
});

const MCSatisfyRuleSatisfier = (
  ref: string,
  { mc }: MCSatisfyRule
): Satisfier => inequalitySatisfier(ref, mc);

const andSatisfyRuleSatisfier = (
  prefix: string,
  dir: Directory,
  ref: string,
  { and }: AndSatisfyRule
): SatisfierBranch => ({
  ref,
  satisfiers: and.map((rule, i) =>
    satisfyRuleSatisfier(prefix, dir, [ref, i].join("/"), rule)
  ),
  reduce: (results) => ({
    isSatisfied: results.every(({ isSatisfied }) => isSatisfied),
  }),
  message: "modules were not satisfied by all rules",
});

const orSatisfyRuleSatisfier = (
  prefix: string,
  dir: Directory,
  ref: string,
  { or }: OrSatisfyRule
): SatisfierBranch => ({
  ref,
  satisfiers: or.map((rule, i) =>
    satisfyRuleSatisfier(prefix, dir, [ref, i].join("/"), rule)
  ),
  reduce: (results) => ({
    isSatisfied: results.some(({ isSatisfied }) => isSatisfied),
  }),
  message: "modules were not satisfied by any rule",
});

const satisfyRuleSatisfier = (
  prefix: string,
  dir: Directory,
  ref: string,
  satisfy: Some<SatisfyRule>
): Satisfier => {
  if (Array.isArray(satisfy)) {
    return andSatisfyRuleSatisfier(prefix, dir, ref, { and: satisfy });
  } else if (typeof satisfy === "string") {
    return blockIdSatisfier(prefix, dir, [ref, satisfy].join("/"), satisfy);
  } else if ("mc" in satisfy) {
    return MCSatisfyRuleSatisfier([ref, "mc"].join("/"), satisfy);
  } else if ("and" in satisfy) {
    return andSatisfyRuleSatisfier(
      prefix,
      dir,
      [ref, "and"].join("/"),
      satisfy
    );
  } else if ("or" in satisfy) {
    return orSatisfyRuleSatisfier(prefix, dir, [ref, "or"].join("/"), satisfy);
  } else {
    throw new Error("satisfy rule(s) is (are) not well-defined");
  }
};

export {
  MCSatisfyRuleSatisfier,
  andSatisfyRuleSatisfier,
  orSatisfyRuleSatisfier,
  satisfyRuleSatisfier,
};
