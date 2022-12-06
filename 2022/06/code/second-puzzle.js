import { readRawData, run } from "../../../utils/utils";
import { getLatestPackageSize } from "./first-puzzle";

console.log(run(readRawData, getLatestPackageSize(14))("../2022/06/data/data"));
