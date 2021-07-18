/**
 * This module reexports functions, schemas and types relating to satisfy rules.
 *
 * There are currently four types of **satisfy rules**:
 * 1. Block ID satisfy rule
 * 2. MC satisfy rule
 * 3. And satisfy rule
 * 4. Or satisfy rule
 *
 * # Block ID satisfy rule
 *
 * A block ID satisfy rule is a string representing a block identifier. For this
 * rule to be satisfied, the specified block must be satisfied by the list of
 * modules passed to it.
 *
 * Examples:
 * ```yaml
 * - bachelor-hons-2016
 * - fos-2015
 * ```
 *
 * # MC satisfy rule
 *
 * A Modular Credit (MC) satisfy rule is an object with a `mc` field assigned to
 * an inequality string. Please refer to [[satisfyRule/inequality]] for more
 * information on the format of the inequality string.
 *
 * If an "at least" inequality (e.g. ">=32") is passed, the satisfy rule is
 * satisfied only if the total number of MCs exceed the specified number.
 *
 * If an "at most" inequality (e.g. "<=16") is passed, the satisfy rule is
 * always satisfied; however, extraneous modules will be unassigned until there
 * are no more modules that can be unassigned without causing the total number
 * of MCs to fall below the specified number.
 *
 * For example, if a list of modules contains five modules A to E (in that
 * order) with each module having 4 MCs each,
 * 1. With the inequality "<=16", **modules A to D will remain** while **module
 * E is unassigned**. The total number of MCs now totals to 16, which is exactly
 * equal to the upper bound.
 * 2. With the inequality "<=11", **modules A to C will remain** while **modules
 * D and E are unassigned**. The total number of MCs now totals to 12. Observe
 * that this exceeds the upper bound of 11 MCs. However, if module C is
 * unassigned, the total number of MCs would fall to 8 MCs below the upper bound
 * of 11 MCs. In order to fill up the remaining capacity of MCs, module C is
 * assigned.
 *
 * Examples:
 * ```yaml
 * - mc: ">=32" # MC satisfy rule with an "at least" inequality
 * - mc: "<=16" # MC satisfy rule with an "at most" inequality
 * ```
 *
 * # And satisfy rule
 *
 * An and satisfy rule is an object with an `and` field assigned to an array of
 * satisfy rules. For the satisfy rule to be satisfied, **all** child satisfy
 * rules must be matched.
 *
 * Examples:
 * ```yaml
 * # and satisfy rule which is only satisfied if both the MC satisfy rule and
 * # the `4k` block are satisfied
 * - and:
 *   - mc: ">=24"
 *   - 4k
 * # a more complex and satisfy rule which is only satisfied if both the
 * # `4k-above` block and either of the following blocks,
 * # `cs-hons-2020-alg/prim-match` or `cs-hons-2020-ai/prim-match`, are
 * # satisfied
 * - and:
     - 4k-above
     - or:
       - cs-hons-2020-alg/prim-match
       - cs-hons-2020-ai/prim-match
 * ```
 *
 * # Or satisfy rule
 *
 * An or satisfy rule is an object with an `or` field assigned to an array of
 * satisfy rules. For the satisfy rule to be satisfied, **at least one** of the
 * child satisfy rules must be satisfied.
 *
 * Examples:
 * ```yaml
 * # or satisfy rule which is satisfied if either the `3k` or the `4k` block
 * # is satisfied
 * - or:
 *   - 3k
 *   - 4k
 * # a more complex or satisfy rule which is only satisfied if either the MC
 * # satisfy rule, or both the following blocks `4k-above` and `prim-match`, are
 * # satisfied
 * - or:
 *   - mc: ">=20"
 *   - and:
 *     - 4k-above
 *     - prim-match
 * ```
 *
 * @module
 */

export {
  MCSatisfyRuleSatisfier,
  andSatisfyRuleSatisfier,
  orSatisfyRuleSatisfier,
  satisfyRuleSatisfier,
} from "./satisfiers";
export {
  MCSatisfyRuleSchema,
  andSatisfyRuleSchema,
  orSatisfyRuleSchema,
  satisfyRuleRefSchema,
  satisfyRuleSchema,
} from "./schemas";
export {
  MCSatisfyRuleTypeSchema,
  andSatisfyRuleTypeSchema,
  orSatisfyRuleTypeSchema,
  satisfyRuleTypeSchema,
} from "./typeSchemas";
export type {
  AndSatisfyRule,
  MCSatisfyRule,
  OrSatisfyRule,
  SatisfyRule,
} from "./types";
