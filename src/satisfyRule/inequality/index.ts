import type { Inequality } from "./types";
import { InequalitySign } from "./types";

const parseInequality = (inequality: Inequality): [InequalitySign, number] => {
  const matches = inequality.match(/^[<>]=(\d+)$/);
  if (matches === null || matches.length === 0) {
    throw new Error("inequality is malformed");
  }
  const n = parseInt(matches[1]);
  return [
    inequality.startsWith("<=")
      ? InequalitySign.AtMost
      : InequalitySign.AtLeast,
    n,
  ];
};

export { parseInequality };
