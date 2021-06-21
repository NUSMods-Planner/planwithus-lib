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

const MCSatisfyRuleSatisfier = ({ mc }: MCSatisfyRule): SatisfierLeaf =>
  inequalitySatisfier(mc);

const andSatisfyRuleSatisfier = (
  dir: Directory,
  { and }: AndSatisfyRule
): SatisfierBranch => ({
  filter: (assigned) => assigned,
  satisfiers: and.map((rule) => satisfyRuleSatisfier(dir, rule)),
  constraint: (satisfieds) => satisfieds.every((bool) => bool),
});

const orSatisfyRuleSatisfier = (
  dir: Directory,
  { or }: OrSatisfyRule
): SatisfierBranch => ({
  filter: (assigned) => assigned,
  satisfiers: or.map((rule) => satisfyRuleSatisfier(dir, rule)),
  constraint: (satisfieds) => satisfieds.some((bool) => bool),
});

// TODO: Implement subblock resolution
const satisfyRuleSatisfier = (
  dir: Directory,
  satisfy: Some<SatisfyRule>
): Satisfier => {
  if (Array.isArray(satisfy)) {
    return satisfyRuleSatisfier(dir, { and: satisfy });
  } else if (typeof satisfy === "string") {
    return blockSatisfier(dir, dir.find(satisfy));
  } else if ("mc" in satisfy) {
    return MCSatisfyRuleSatisfier(satisfy);
  } else if ("and" in satisfy) {
    return andSatisfyRuleSatisfier(dir, satisfy);
  } else if ("or" in satisfy) {
    return orSatisfyRuleSatisfier(dir, satisfy);
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
