import { initDirectories } from "../";
import { blockSatisfier } from "../block/satisfiers";
import { evaluateSatisfier } from "../satisfier";
import type { Module } from "../module/types";

describe("blockSatisfier", () => {
  it("idk if this works", async () => {
    const { primary } = await initDirectories();
    console.log(Object.keys(primary.blocks));
    const satisfier = blockSatisfier(primary, "", "cs-hons-2020");
    const modules = [
      ["CS1101S", 4],
      ["CS1231S", 4],
      ["CS2030S", 4],
      ["CS2040S", 4],
      ["CS2100", 4],
      ["CS2103T", 4],
      ["DSA1101", 4],
      ["MA1101R", 4],
      ["MA2002", 4],
      ["CS2106", 4],
      ["CS3230", 4],
      ["CS3244", 4],
      ["PC1231", 4],
    ] as Module[];
    console.log(JSON.stringify(evaluateSatisfier(modules, satisfier), null, 2));
  });
});
