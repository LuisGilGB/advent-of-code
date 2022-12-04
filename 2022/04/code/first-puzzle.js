import {
  extractNonEmptyLines,
  numberify,
  readRawData,
  run,
} from "../../../utils/utils";

export const mapPairs = (input) =>
  input.map((line) =>
    line.split(",").map((pair) => pair.split("-").map(numberify))
  );

const countPairsWithFullyContained = (pairs) =>
  pairs.reduce((acc, pair) => {
    if (pair[0][0] === pair[1][0]) {
      return acc + 1;
    }
    const lowerStartElfIndex = pair[0][0] < pair[1][0] ? 0 : 1;
    const lowerStartElf = pair[lowerStartElfIndex];
    const otherElf = pair[1 - lowerStartElfIndex];
    return lowerStartElf[1] >= otherElf[1] ? acc + 1 : acc;
  }, 0);

console.log(
  run(
    readRawData,
    extractNonEmptyLines,
    mapPairs,
    countPairsWithFullyContained
  )("../2022/04/data/data")
);
