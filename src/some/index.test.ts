import type { Arbitrary, ArrayConstraints } from "fast-check";
import { array, oneof } from "fast-check";

import type { Some } from "./types";

const some = <T>(
  arbitrary: Arbitrary<T>,
  constraints: ArrayConstraints
): Arbitrary<Some<T>> => oneof(arbitrary, array(arbitrary, constraints));

export { some };
