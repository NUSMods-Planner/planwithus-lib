/**
 * This module reexports various functions, schemas and types relating to
 * blocks.
 *
 * A **block** is used to express the metadata and logic of course
 * requirements. Blocks can be subdivided into multiple blocks which can be
 * reused in other course combinations.
 *
 * ## Metadata Fields
 *
 * ### `name` (optional)
 *
 * The `name` field is used to assign a name to a block. It can be used to store
 * the name of the course or a specific section of its requirements.
 *
 * Examples:
 * ```yaml
 * name: "Data Science and Analytics (Hons)" # course name
 * name: Level-1000 modules # human-readable identifier for child blocks
 * ```
 *
 * ### `ay` (optional)
 *
 * The `ay` field is used to indicate the academic year of the course. Its value
 * should correspond to the calendar year of the first semester. For example, a
 * block representing course requirements for the AY21/22 cohort onwards should
 * have the `ay` field set to 2021.
 *
 * It is only necessary to set the `ay` field for top-level blocks representing
 * courses. All child blocks are taken to have the same `ay` as their parent
 * block, unless specified otherwise.
 *
 * Examples:
 * ```yaml
 * ay: 2020 # course requirements for the AY20/21 cohort
 * ```
 *
 * ### `url` (optional)
 *
 * The `url` field is used to provide a [URL](https://en.wikipedia.org/wiki/URL)
 * that links to the relevant course requirements.
 *
 * Examples:
 * ```yaml
 * url: https://www.science.nus.edu.sg/wp-content/uploads/2019/11/FacultyRequirements.pdf
 * ```
 *
 * ### `info` (optional)
 *
 * The `info` field is used to alert the user to any important information. This
 * can be used in cases where the specified logic may not be sufficient to cover
 * the entirety of a course's requirements.
 *
 * Examples:
 * ```yaml
 * info: "Please refer to the URL to verify that you meet the Faculty Requirements. Take note that some modules might fall under multiple subject groups."
 * ```
 *
 * ### `isSelectable` (optional)
 *
 * The `isSelectable` field is used to mark a block as selectable in the GUI. By
 * default, `isSelectable` is taken to be false if not specified otherwise.
 *
 * Examples:
 * ```yaml
 * isSelectable: true
 * ```
 *
 * ## Logic Fields
 *
 * The logic of a block can be viewed in three distinct stages: `assign`,
 * `match` and `satisfy`.
 *
 * 1. Each block begins with a list of modules, which may be all the modules
 * listed on the planner (for top-level blocks), or a subset of these modules
 * that have been filtered out by other blocks (for child blocks).
 * 2. These modules are assigned to the specified blocks in the `assign` stage.
 * 3. Remaining unassigned modules are passed to the `match` stage where
 * matching modules are assigned to the current block.
 * 4. Lastly, all assigned and matched modules are passed to the `satisfy` stage
 * to ensure that the modules match a set of criteria.
 *
 * Most blocks will have either an `assign` + `satisfy` stage or a `match` +
 * `satisfy` stage. In most cases, course requirements can be specified in a
 * straightforward manner using this three-stage logic flow.
 *
 * ### `assign` (optional)
 *
 * The `assign` field can take either a string, representing a block identifier,
 * or an array of block identifiers.
 *
 * Modules passed to the block are assigned to each of the specified blocks in
 * the `assign` field from the first block to the last block, with every module
 * assigned to at most one block.
 *
 * Examples:
 * ```yaml
 * assign: ue # a single block with identifier "ue"
 * assign: [ulr-2015, 1k, 2k, 3k-4k, fos-2015, ue] # six blocks with priority
 *                                                 # from "ulr-2015" to "ue"
 * ```
 *
 * ### `match` (optional)
 *
 * After the `assign` stage, the remaining modules are passed to the `match`
 * stage which consists of a list of match rules. The `match` field can take
 * either a single match rule or an array of match rules. By default, modules
 * will be matched if they meet **any** of the specified match rules.
 *
 * Please refer to the [[matchRule]] module for more information on match rules.
 *
 * Examples:
 * ```yaml
 * match:
 *   - and: # and match rule
 *     - or: [CS1010, CS1010S, CS1010X] # or match rule, taking in an array of
 *                                      # pattern match rules
 *     - DSA1101 # pattern match rule
 *   - or: # or match rule
 *     - CS2103 # pattern match rule
 *     # pattern match rule with info
 *     - pattern: CS2103T
 *       info: "Students taking CS2103T Software Engineering must take CS2101 Effective Communication for Computing Professionals in the same semester."
 *   # pattern match rule with exclude
 *   - pattern: "MA2xxx*"
 *     exclude: "MA23xx*" # this removes all modules matched by the previous
 *                        # pattern, "MA2xxx*" that match "MA23xx*"
 * ```
 *
 * ### `satisfy` (optional)
 *
 * Lastly, the `satisfy` stage takes all modules that were assigned in the
 * `assign` stage or matched in the `match` stage and passes them to a list of
 * satisfy rules. The `satisfy` field can take either a single satisfy rule or
 * an array of satisfy rules. By default, a block with **no `satisfy` rules** is
 * taken to be satisfied and a block with **multiple `satisfy` rules** must
 * satisfy **all** of the rules.
 *
 * Please refer to the [[satisfyRule]] module for more information on satisfy
 * rules.
 *
 * Examples:
 * ```yaml
 * satisfy:
 *   - 4k-above # block ID satisfy rule
 *   - or: # or satisfy rule, with an array of satisfy rules
 *     - cs-hons-2020-alg/prim-match # block ID satisfy rule
 *     - cs-hons-2020-ai/prim-match
 *   - mc: ">=12" # MC satisfy rule
 * ```
 *
 * ## Child blocks
 *
 * Blocks can contain other blocks, which are constructed in a similar fashion
 * to the top-level block.
 *
 * @module
 */

export { blockTypeSchema } from "./typeSchemas";
export type { Block } from "./types";
export { BLOCK_CLASSES, BlockClass } from "./types";
export { blockSatisfier } from "./satisfiers";
export { blockSchema } from "./schemas";
