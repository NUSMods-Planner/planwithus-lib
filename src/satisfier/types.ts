import type { Module } from "../module/types";

type SatisfierLeaf = {
  constraint: (assigned: Module[]) => boolean;
  infos: string[];
  messages: string[];
};
const isSatisfierLeaf = (satisfier: Satisfier): satisfier is SatisfierLeaf =>
  !("satisfiers" in satisfier);

type SatisfierBranch = {
  satisfiers: Satisfier[];
  filter: (assigned: Module[]) => Module[];
  constraint: (satisfieds: boolean[]) => boolean;
};
const isSatisfierBranch = (
  satisfier: Satisfier
): satisfier is SatisfierBranch => "satisfiers" in satisfier;

type Satisfier = SatisfierLeaf | SatisfierBranch;

type SatisfierResult = {
  assigned: Module[];
  satisfied: boolean;
  infos: string[];
  messages: string[];
};

export type { Satisfier, SatisfierBranch, SatisfierLeaf, SatisfierResult };
export { isSatisfierBranch, isSatisfierLeaf };
