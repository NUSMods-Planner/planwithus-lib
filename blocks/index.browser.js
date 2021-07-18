import { parse } from "../src/parser";

import cs_hons_2020 from "./primary/cs-hons-2020/cs-hons-2020.yml";
import cs_hons_2020_ai from "./primary/cs-hons-2020/cs-hons-2020-ai.yml";
import cs_hons_2020_alg from "./primary/cs-hons-2020/cs-hons-2020-alg.yml";
import dsa_hons_2017 from "./primary/dsa-hons-2017.yml";
import fos_2015 from "./primary/fos-2015.yml";
import ma_hons_2019 from "./primary/ma-hons-2019.yml";
import ulr_2015 from "./primary/ulr-2015.yml";

import ma_2019_second from "./second/ma-2019.yml";

import ma_2019_minor from "./minor/ma-2019.yml";

const loadBlock = (blockYaml) => {
  return parse(blockYaml);
};

export const primary = {
  ["cs-hons-2020"]: loadBlock(cs_hons_2020),
  ["cs-hons-2020-ai"]: loadBlock(cs_hons_2020_ai),
  ["cs-hons-2020-alg"]: loadBlock(cs_hons_2020_alg),
  ["dsa-hons-2017"]: loadBlock(dsa_hons_2017),
  ["fos-2015"]: loadBlock(fos_2015),
  ["ma-hons-2019"]: loadBlock(ma_hons_2019),
  ["ulr-2015"]: loadBlock(ulr_2015),
};

export const second = {
  ["ma-2019"]: loadBlock(ma_2019_second),
};

export const minor = {
  ["ma-2019"]: loadBlock(ma_2019_minor),
};
