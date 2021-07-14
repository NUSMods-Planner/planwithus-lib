import alias from "@rollup/plugin-alias";
import json from "@rollup/plugin-json";
import yaml from "@rollup/plugin-yaml";
import typescript from "rollup-plugin-ts";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "cjs",
  },
  plugins: [
    alias({
      entries: [
        { find: "../blocks/index", replacement: "../blocks/index.browser" },
      ],
    }),
    json(),
    yaml(),
    typescript(),
    nodeResolve(),
    commonjs(),
  ],
};
