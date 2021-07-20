import { parse } from "../src/parser";

import cs_hons_2020 from "./primary/cs-hons-2020/cs-hons-2020.yml";
import cs_hons_2020_ai from "./primary/cs-hons-2020/cs-hons-2020-ai.yml";
import cs_hons_2020_alg from "./primary/cs-hons-2020/cs-hons-2020-alg.yml";
import cs_hons_2020_cgg from "./primary/cs-hons-2020/cs-hons-2020-cgg.yml";
import cs_hons_2020_cs from "./primary/cs-hons-2020/cs-hons-2020-cs.yml";
import cs_hons_2020_ds from "./primary/cs-hons-2020/cs-hons-2020-ds.yml";
import cs_hons_2020_mir from "./primary/cs-hons-2020/cs-hons-2020-mir.yml";
import cs_hons_2020_nds from "./primary/cs-hons-2020/cs-hons-2020-nds.yml";
import cs_hons_2020_pc from "./primary/cs-hons-2020/cs-hons-2020-pc.yml";
import cs_hons_2020_pl from "./primary/cs-hons-2020/cs-hons-2020-pl.yml";
import cs_hons_2020_se from "./primary/cs-hons-2020/cs-hons-2020-se.yml";
import dsa_hons_2017 from "./primary/dsa-hons-2017.yml";
import ee_hons_2021 from "./primary/ee-hons-2021/ee-hons-2021.yml";
import ee_hons_2021_iot from "./primary/ee-hons-2021/ee-hons-2021-iot.yml";
import ee_hons_2021_robotics from "./primary/ee-hons-2021/ee-hons-2021-robotics.yml";
import fos_2015 from "./primary/fos-2015.yml";
import ma_hons_2019 from "./primary/ma-hons-2019.yml";
import ph_hons_2019 from "./primary/ph-hons-2019.yml";
import ulr_2015 from "./primary/ulr-2015.yml";
import ulr_2021 from "./primary/ulr-2021.yml";

import ma_2019_second from "./second/ma-2019.yml";

import ma_2019_minor from "./minor/ma-2019.yml";

const loadBlock = (blockYaml) => {
  return parse(blockYaml);
};

export const primary = {
  ["cs-hons-2020"]: loadBlock(cs_hons_2020),
  ["cs-hons-2020-ai"]: loadBlock(cs_hons_2020_ai),
  ["cs-hons-2020-alg"]: loadBlock(cs_hons_2020_alg),
  ["cs-hons-2020-cgg"]: loadBlock(cs_hons_2020_cgg),
  ["cs-hons-2020-cs"]: loadBlock(cs_hons_2020_cs),
  ["cs-hons-2020-ds"]: loadBlock(cs_hons_2020_ds),
  ["cs-hons-2020-mir"]: loadBlock(cs_hons_2020_mir),
  ["cs-hons-2020-nds"]: loadBlock(cs_hons_2020_nds),
  ["cs-hons-2020-pc"]: loadBlock(cs_hons_2020_pc),
  ["cs-hons-2020-pl"]: loadBlock(cs_hons_2020_pl),
  ["cs-hons-2020-se"]: loadBlock(cs_hons_2020_se),
  ["ee-hons-2021-"]: loadBlock(ee_hons_2021),
  ["ee-hons-2021-iot"]: loadBlock(ee_hons_2021_iot),
  ["ee-hons-2021-robotics"]: loadBlock(ee_hons_2021_robotics),
  ["dsa-hons-2017"]: loadBlock(dsa_hons_2017),
  ["fos-2015"]: loadBlock(fos_2015),
  ["ma-hons-2019"]: loadBlock(ma_hons_2019),
  ["ph-hons-2019"]: loadBlock(ph_hons_2019),
  ["ulr-2015"]: loadBlock(ulr_2015),
  ["ulr-2021"]: loadBlock(ulr_2021),
};

export const second = {
  ["ma-2019"]: loadBlock(ma_2019_second),
};

export const minor = {
  ["ma-2019"]: loadBlock(ma_2019_minor),
};
