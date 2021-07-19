/**
 * Type representing a module as a pair of a string and number.
 *
 * The first element represents the module code, while the second element
 * represents the number of Modular Credits (MCs).
 *
 * For more information on the NUS Modular System, please refer to
 * https://www.nus.edu.sg/registrar/academic-information-policies/graduate/modular-system.
 */
type Module = [
    string,
    number
];
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
type Context = {
    context?: unknown;
};
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
type SatisfierBranch = SatisfierBase & ({
    satisfiers: Satisfier[];
} | {
    satisfiers: Satisfier[];
    reduce: SatisfierReduce;
    message: string;
});
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
type SatisfierLeafAssign = SatisfierBase & {
    assign: SatisfierAssign;
};
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
type SatisfierLeafFilter = SatisfierBase & {
    filter: SatisfierFilter;
};
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
type Satisfier = SatisfierBranch | SatisfierLeafAssign | SatisfierLeafConstraint | SatisfierLeafFilter;
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
/**
 * Generic representing either an instance of something or an array of such
 * instances.
 */
type Some<T> = T | T[];
type Pattern = string;
type PatternMatchRule = {
    pattern: Pattern;
    exclude?: Some<Pattern>;
    info?: string;
};
type AndMatchRule = {
    and: MatchRule[];
};
type OrMatchRule = {
    or: MatchRule[];
};
type MatchRuleObject = PatternMatchRule | AndMatchRule | OrMatchRule;
type MatchRule = Pattern | MatchRuleObject;
/**
 * Alias type representing a block identifier.
 */
type BlockId = string;
type Inequality = string;
type MCSatisfyRule = {
    mc: Inequality;
};
type AndSatisfyRule = {
    and: SatisfyRule[];
};
type OrSatisfyRule = {
    or: SatisfyRule[];
};
type SatisfyRuleObject = MCSatisfyRule | AndSatisfyRule | OrSatisfyRule;
type SatisfyRule = BlockId | SatisfyRuleObject;
type Block = {
    name?: string;
    ay?: number;
    assign?: Some<BlockId>;
    match?: Some<MatchRule>;
    satisfy?: Some<SatisfyRule>;
    url?: string;
    info?: string;
    isSelectable?: boolean;
    // the following line is used to prevent compilation errors due to the
    // oddities of JSONSchemaType
    [blockId: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};
/**
 * Class representing a block directory, providing functionality for adding
 * blocks and block identifier resolution.
 */
declare class Directory {
    private _blocks;
    private _selectableBlocks;
    /**
     * Adds a block into the directory.
     *
     * This function handles the decomposition of blocks into properties and
     * subblocks. The parent block and each of its subblocks are added to the
     * block directory, with an appropriate prefix prepended to the block
     * identifiers.
     *
     * For example, by passing in `prefix` as `"foobar"` and `block` as a block
     * with subblocks `foo` and `bar`, three blocks will be added to the directory
     * with identifiers `foobar`, `foobar/foo` and `foobar/bar`.
     *
     * **Note that each block in the directory will have its subblocks stripped
     * away. If it is necessary to access a subblock, the [[find]] function should
     * be used with `prefix` set to the identifier of the parent block and `id`
     * set to the (partial) identifier of the subblock.**
     *
     * @param prefix A prefix string representing the full identifier of the
     * block.
     * @param block The block to be added to the directory.
     */
    addBlock(prefix: string, block: Block): void;
    /**
     * Finds a block in the directory.
     *
     * This function attempts to find a block with the exact same full identifier
     * as `id`. If no such block exists, it will search for a block with `id`
     * directly under `prefix`.
     *
     * For example, if `prefix` is set to `"abc"` and `id` to `"ghi"`, the
     * function will check if either of the blocks `ghi` or `abc/ghi` exist.
     *
     * @param prefix A prefix string representing the full identifier of the
     * parent block, if any.
     * @param id The identifier of the desired block. This may either be a full
     * identifier or a partial identifier under the parent block.
     * @return A pair with the first element as the full identifier of the desired
     * block and the second element as the desired block itself.
     */
    find(prefix: string, id: BlockId): [
        BlockId,
        Block
    ];
    /**
     * Retrieves all selectable block identifiers in the directory.
     *
     * @return A list of full identifiers of all selectable blocks in the
     * directory.
     */
    retrieveSelectable(): BlockId[];
}
/**
 * Initialises block directories with each directory corresponding to a block
 * class.
 *
 * @return An object with keys as block classes and values as block directories.
 */
declare const initDirectories: () => Record<string, Directory>;
/**
 * Wrapper function that verifies a study plan against a specific block.
 *
 * @param modules List of modules in the study plan.
 * @param dir Block directory which contains the desired block.
 * @param blockId Identifier of the desired block.
 * @return An object representing the result of a study plan verification.
 */
declare const verifyPlan: (modules: Module[], dir: Directory, blockId: BlockId) => SatisfierResult;
export { initDirectories, verifyPlan, Block, AndMatchRule, MatchRule, OrMatchRule, PatternMatchRule, Module, Satisfier, SatisfierAssign, SatisfierBase, SatisfierBranch, SatisfierConstraint, SatisfierFilter, SatisfierLeafAssign, SatisfierLeafConstraint, SatisfierLeafFilter, SatisfierReduce, SatisfierResult, AndSatisfyRule, MCSatisfyRule, OrSatisfyRule, SatisfyRule, Some };
