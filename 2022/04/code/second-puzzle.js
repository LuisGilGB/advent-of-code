import { extractNonEmptyLines, readRawData, run } from "../../../utils/utils";
import { mapPairs } from "./first-puzzle";

const countPairsThatOverlap = (pairs) =>
  pairs.reduce((acc, pair) => {
    if (
      Math.min(...pair.map((elf) => elf[1])) >=
      Math.max(...pair.map((elf) => elf[0]))
    ) {
      return acc + 1;
    }
    return acc;
  }, 0);

console.log(
  run(
    readRawData,
    extractNonEmptyLines,
    mapPairs,
    countPairsThatOverlap
  )("../2022/04/data/data")
);
