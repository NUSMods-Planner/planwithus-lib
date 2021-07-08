/**
 * This module reexports functions, schemas and types relating to match rules.
 *
 * There are currently four types of **match rules**:
 * 1. Pattern match rule
 * 2. Pattern match rule (extended)
 * 3. And match rule
 * 4. Or match rule
 *
 * # Pattern match rule
 *
 * A pattern match rule is a pattern string that matches module names (e.g.
 * `MA42xx*`). Please refer to the [[matchRule/pattern]] module for more
 * information on the format of the pattern string.
 *
 * Examples:
 * ```yaml
 * - GER1000 # matches exactly "GER1000"
 * - MA42xx* # matches all modules starting with "MA42" followed by two digits
 * - * # matches all modules
 * ```
 *
 * # Pattern match rule (extended)
 *
 * An extended pattern match rule is an object with the following fields:
 * 1. `pattern`, a pattern string matching the desired modules;
 * 2. `info` (optional), a string that provides additional information whenever
 * the match rule is invoked; and
 * 3. `exclude` (optional), a pattern string or an array of pattern strings
 * which negate any matches.
 *
 * Examples:
 * ```yaml
 * # an extended pattern match rule with no other fields, matching exactly the
 * # module "GER1000"
 * - pattern: GER1000
 * # an extended pattern match rule with an `info` field
 * - pattern: GER1000
 *   info: "This module is part of the General Education requirements."
 * # an extended pattern match rule with an `exclude` field containing a pattern
 * # string, matching all modules starting with "GER" other than "GER1000"
 * - pattern: GER*
 *   exclude: GER1000
 * # an extended pattern match rule with an `exclude` field containing an array
 * # of pattern strings, matching all modules starting with "MA42" followed by
 * # two digits other than "MA4203" and "MA4207"
 * - pattern: MA42xx*
 *   exclude: [MA4203, MA4207]
 * ```
 *
 * # And match rule
 *
 * An and match rule is an object with an `and` field assigned to an array of
 * match rules. For the match rule to be matched, **all** child match rules
 * must be matched.
 *
 * Examples:
 * ```yaml
 * # and match rule which only matches the modules "GER1000" and "MA1101R" if
 * # both are in the list of modules
 * - and:
 *   - GER1000
 *   - MA1101R
 * # a more complex and match rule which only matches if at least one of the
 * # following modules "CS1010", "CS1010S" or "CS1010X", as well as the module
 * # "DSA1101", are in the list of modules
 * - and:
 *   - or: [CS1010, CS1010S, CS1010X]
 *   - DSA1101
 * ```
 *
 * # Or match rule
 *
 * An or match rule is an object with an `or` field assigned to an array of
 * match rules. For the match rule to be matched, **at least one** of the child
 * match rules must be matched.
 *
 * Examples:
 * ```yaml
 * # or match rule which matches either of the modules "GER1000" and "MA1101R"
 * - or:
 *   - GER1000
 *   - MA1101R
 * # a more complex or match rule which only matches if either the module
 * # "MA1102R", or both of the modules "MA1511" and "MA1512", are in the list of
 * # modules
 * - or:
 *   - MA1102R
 *   - and: [MA1511, MA15112]
 * ```
 *
 * @module
 */

export {
  andMatchRuleSatisfier,
  matchRuleSatisfier,
  orMatchRuleSatisfier,
  patternMatchRuleSatisfier,
} from "./satisfiers";
export {
  andMatchRuleSchema,
  matchRuleRefSchema,
  matchRuleSchema,
  orMatchRuleSchema,
  patternMatchRuleSchema,
} from "./schemas";
export {
  andMatchRuleTypeSchema,
  matchRuleTypeSchema,
  orMatchRuleTypeSchema,
  patternMatchRuleTypeSchema,
} from "./typeSchemas";
export type {
  AndMatchRule,
  MatchRule,
  OrMatchRule,
  PatternMatchRule,
} from "./types";
