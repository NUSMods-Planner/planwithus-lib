import type { Pattern } from "./types";

const patternToRE = (...patterns: Pattern[]): RegExp =>
  new RegExp(
    "^" +
      patterns
        .map((pattern) =>
          pattern.replace(/x/g, "[0-9]").replace(/\*/g, "[A-Z0-9]*")
        )
        .join("|") +
      "$"
  );

export { patternToRE };
export { patternSatisfier } from "./satisfiers";
export { patternSchema } from "./schemas";
export { patternTypeSchema } from "./typeSchemas";
export type { Pattern } from "./types";
