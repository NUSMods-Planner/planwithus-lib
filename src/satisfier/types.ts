import type { Module } from "../module";

/**
 * Object with the following properties:
 * 1. `ref`, a reference string denoting the satisfier;
 * 2. `info` (optional), an info string that is displayed if the satisfier is
 * invoked.
 */
type SatisfierBase = {
  ref: string;
  info?: string;
};

/**
 * Object with the `context` (optional) property, which is used to denote some
 * context and can take on any value.
 */
type Context = { context?: unknown };

/**
 * Function type taking in a list of [[SatisfierResult]] and returning an object
 * with the following properties:
 * 1. `isSatisfied`, a boolean indicating the reduction of the results; and
 * 2. `context` (optional), inherited from [[Context]].
 */
type SatisfierReduce = (results: SatisfierResult[]) => {
  isSatisfied: boolean;
} & Context;

/**
 * Object with the following properties:
 * 1. `ref`, inherited from [[SatisfierBase]];
 * 2. `info` (optional), inherited from [[SatisfierBase]];
 * 3. `satisfiers`, which is a list of satisfiers;
 * 4. `reduce` (optional), which is a [[SatisfierReduce]] function that reduces
 * a list of satisfier results into an object containing a boolean with optional
 * context; and
 * 5. `message` (optional), which is an error message string that is displayed
 * if `reduce` returns a **false result**.
 *
 * The `reduce` property must be specified along with the `message` property.
 */
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

/**
 * Function type taking in a list of remaining modules and returning an object
 * with the following properties:
 * 1. `remainingMask`, an array of booleans of the same length as `remaining`,
 * with `true` marking the corresponding module as **assigned** and `false`
 * marking the corresponding module as **not assigned**; and
 * 2. `context` (optional), inherited from [[Context]].
 */
type SatisfierAssign = (remaining: Module[]) => {
  remainingMask: boolean[];
} & Context;

/**
 * Object with the following properties:
 * 1. `ref`, inherited from [[SatisfierBase]];
 * 2. `info` (optional), inherited from [[SatisfierBase]]; and
 * 3. `assign`, which is a [[SatisfierAssign]] function used to assign modules
 * from a list of remaining modules.
 */
type SatisfierLeafAssign = SatisfierBase & { assign: SatisfierAssign };

const isSatisfierLeafAssign = (
  satisfier: Satisfier
): satisfier is SatisfierLeafAssign => "assign" in satisfier;

/**
 * Function type taking in a list of assigned modules and returning an object
 * with the following properties:
 * 1. `isSatisfied`, a boolean indicating if the list of assigned modules
 * **meets the constraint**; and
 * 2. `context` (optional), inherited from [[Context]].
 */
type SatisfierConstraint = (assigned: Module[]) => {
  isSatisfied: boolean;
} & Context;

/**
 * Object with the following properties:
 * 1. `ref`, inherited from [[SatisfierBase]];
 * 2. `info` (optional), inherited from [[SatisfierBase]];
 * 3. `constraint`, which is a [[SatisfierConstraint]] function used to enforce
 * some constraint on a list of assigned modules; and
 * 4. `message`, which is an error message displayed if `constraint` returns
 * a **false result**.
 */
type SatisfierLeafConstraint = SatisfierBase & {
  constraint: SatisfierConstraint;
  message: string;
};

const isSatisfierLeafConstraint = (
  satisfier: Satisfier
): satisfier is SatisfierLeafConstraint => "constraint" in satisfier;

/**
 * Function type taking in a list of assigned modules and returning an object
 * with the following properties:
 * 1. `assignedMask`, an array of booleans of the same length as `assigned`,
 * with `true` marking the corresponding module as **still assigned** and
 * `false` marking the corresponding module as **unassigned**; and
 * 2. `context` (optional), inherited from [[Context]].
 */
type SatisfierFilter = (assigned: Module[]) => {
  assignedMask: boolean[];
} & Context;

/**
 * Object with the following properties:
 * 1. `ref`, inherited from [[SatisfierBase]];
 * 2. `info` (optional), inherited from [[SatisfierBase]]; and
 * 3. `filter`, which is a [[SatisfierFilter]] function used to filter a list
 * of assigned modules.
 */
type SatisfierLeafFilter = SatisfierBase & { filter: SatisfierFilter };

const isSatisfierLeafFilter = (
  satisfier: Satisfier
): satisfier is SatisfierLeafFilter => "filter" in satisfier;

/**
 * Type alias for one of these four types:
 * 1. [[SatisfierBranch]]
 * 2. [[SatisfierLeafAssign]]
 * 3. [[SatisfierLeafConstraint]]
 * 4. [[SatisfierLeafFilter]]
 *
 * The first type ([[SatisfierBranch]]) is used to construct a branch satisfier
 * that requires other satisfiers to be evaluated. The remaining three types are
 * used to construct leaf satisfiers, which may either assign modules
 * ([[SatisfierLeafAssign]]), impose a constraint on the assigned modules
 * ([[SatisfierLeafConstraint]]), or filter assigned modules
 * ([[SatisfierLeafFilter]]).
 */
type Satisfier =
  | SatisfierBranch
  | SatisfierLeafAssign
  | SatisfierLeafConstraint
  | SatisfierLeafFilter;

/**
 * Object containing the following properties:
 * 1. `ref`, inherited from [[SatisfierBase]];
 * 2. `info` (optional), inherited from [[SatisfierBase]];
 * 3. `added`, a list of modules added during the evaluation of the satisfier;
 * 4. `assigned`, a list of assigned modules after the evaluation of the
 * satisfier;
 * 5. `remaining`, a list of remaining modules after the evaluation of the
 * satisfier;
 * 6. `removed`, a list of modules removed during the evaluation of the
 * satisfier;
 * 7. `isSatisfied`, a boolean indicating if the satisfier is satisfied;
 * 8. `results`, a list of satisfier results;
 * 9. `message` (optional), an error message displayed if `isSatisfied` is
 * false; and
 * 10. `context` (optional), inherited from [[Context]].
 *
 * Satisfier results are arranged in a tree-like structure, similar to that of
 * satisfiers. For branch satisfiers which contain child satisfiers, the list of
 * results from the evaluation of each child satisfier is stored in `results`.
 * For leaf satisfiers, the `results` array is empty.
 */
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
  Context,
  Satisfier,
  SatisfierAssign,
  SatisfierBase,
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
