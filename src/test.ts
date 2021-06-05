import { initVerifiers } from ".";
import type { MatchRule } from "./matchRule";

const main = async () => {
  const { primary, second, minor } = await initVerifiers();

  console.log(JSON.stringify(primary.blocks, null, 2));
  console.log("---");
  console.log(JSON.stringify(second.blocks, null, 2));
  console.log("---");
  console.log(JSON.stringify(minor.blocks, null, 2));
  console.log("---");

  const matchRules = primary.find("cs-hons-2020/found").match as MatchRule[];
  console.log(matchRules);
  if (typeof matchRules[0] === "object" && "and" in matchRules[0]) {
    const andRules = matchRules[0].and as MatchRule[];
    console.log(andRules);
    if (typeof andRules[5] === "object" && "or" in andRules[5]) {
      const orRule = andRules[5].or;
      console.log(orRule);
    }
  }
};

main();
