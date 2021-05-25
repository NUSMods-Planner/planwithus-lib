type AtMost = {
  key: "AT_MOST";
  value: number;
};

type AtLeast = {
  key: "AT_LEAST";
  value: number;
};

type Inequality = AtMost | AtLeast;

const parseInequality = (str: string): Inequality => {
  const match = str.match(/^([<>]=)(\d+)$/);
  if (match === null) {
    throw new Error("inequality is invalid; only <= and >= allowed");
  }

  const [, sym, num] = match;
  return sym === "<="
    ? {
        key: "AT_MOST",
        value: parseInt(num),
      }
    : {
        key: "AT_LEAST",
        value: parseInt(num),
      };
};

export { Inequality, parseInequality };
