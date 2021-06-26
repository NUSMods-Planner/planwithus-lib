import type { Module } from "../module/types";

type SatisfierLeaf = {
  type: string;
  rule: unknown;
  constraint: (assigned: Module[]) => boolean;
  info?: string;
};
const isSatisfierLeaf = (satisfier: Satisfier): satisfier is SatisfierLeaf =>
  !("satisfiers" in satisfier);

type SatisfierBranch = {
  type: string;
  rule: unknown;
  filter: (assigned: Module[]) => Module[];
  satisfiers: Satisfier[];
  constraint: (satisfieds: boolean[]) => boolean;
};
const isSatisfierBranch = (
  satisfier: Satisfier
): satisfier is SatisfierBranch => "satisfiers" in satisfier;

type Satisfier = SatisfierLeaf | SatisfierBranch;

type SatisfierResult = {
  type: string;
  rule: unknown;
  assigned: Module[];
  satisfied: boolean;
  results: SatisfierResult[];
  info?: string;
};

export type { Satisfier, SatisfierBranch, SatisfierLeaf, SatisfierResult };
export { isSatisfierBranch, isSatisfierLeaf };
