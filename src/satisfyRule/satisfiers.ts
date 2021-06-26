import { blockSatisfier } from "../block/satisfiers";
import { Directory } from "../directory";
import type {
  Satisfier,
  SatisfierBranch,
  SatisfierLeaf,
} from "../satisfier/types";
import type { Some } from "../some/types";
import { inequalitySatisfier } from "./inequality/satisfiers";
import type {
  AndSatisfyRule,
  MCSatisfyRule,
  OrSatisfyRule,
  SatisfyRule,
} from "./types";

const MCSatisfyRuleSatisfier = ({ mc }: MCSatisfyRule): SatisfierLeaf => ({
  ...inequalitySatisfier(mc),
  type: "MCSatisfyRule",
  rule: { mc },
});

const andSatisfyRuleSatisfier = (
  dir: Directory,
  prefix: string,
  { and }: AndSatisfyRule
): SatisfierBranch => ({
  type: "andSatisfyRule",
  rule: { and },
  filter: (assigned) => assigned,
  satisfiers: and.map((rule) => satisfyRuleSatisfier(dir, prefix, rule)),
  constraint: (satisfieds) => satisfieds.every((bool) => bool),
});

const orSatisfyRuleSatisfier = (
  dir: Directory,
  prefix: string,
  { or }: OrSatisfyRule
): SatisfierBranch => ({
  type: "orSatisfyRule",
  rule: { or },
  filter: (assigned) => assigned,
  satisfiers: or.map((rule) => satisfyRuleSatisfier(dir, prefix, rule)),
  constraint: (satisfieds) => satisfieds.some((bool) => bool),
});

const satisfyRuleSatisfier = (
  dir: Directory,
  prefix: string,
  satisfy: Some<SatisfyRule>
): Satisfier => {
  if (Array.isArray(satisfy)) {
    return satisfyRuleSatisfier(dir, prefix, { and: satisfy });
  } else if (typeof satisfy === "string") {
    return blockSatisfier(dir, prefix, satisfy);
  } else if ("mc" in satisfy) {
    return MCSatisfyRuleSatisfier(satisfy);
  } else if ("and" in satisfy) {
    return andSatisfyRuleSatisfier(dir, prefix, satisfy);
  } else if ("or" in satisfy) {
    return orSatisfyRuleSatisfier(dir, prefix, satisfy);
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
