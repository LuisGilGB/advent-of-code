import {
  arraify,
  extractNonEmptyLines,
  getNth,
  map,
  readRawData,
  run,
  sumArrayItems,
} from "../../../utils/utils";

export const RIGHT_ORDER = 1;
export const UNDECIDED = 0;
export const WRONG_ORDER = -1;

export const splitPairs = (rawInput) => rawInput.split("\n\n");

export const parsePair = (pair) => pair.map(JSON.parse);

export const compareIntegers = (left, right) => {
  if (left < right) {
    return RIGHT_ORDER;
  } else if (left === right) {
    return UNDECIDED;
  } else {
    return WRONG_ORDER;
  }
};

export const comparePairLists = (leftList, rightList) => {
  for (let i = 0; i <= Math.max(leftList.length, rightList.length); i++) {
    const left = leftList[i];
    const right = rightList[i];
    if (left === undefined) {
      if (right === undefined) {
        return UNDECIDED;
      } else {
        return RIGHT_ORDER;
      }
    } else {
      if (right === undefined) {
        return WRONG_ORDER;
      } else {
        const comparison = comparePair([left, right]);
        if (comparison !== UNDECIDED) {
          return comparison;
        }
      }
    }
  }
};

export const comparePair = ([left, right]) => {
  if (Array.isArray(left) && Array.isArray(right)) {
    return comparePairLists(left, right);
  } else if (!Array.isArray(left) && !Array.isArray(right)) {
    return compareIntegers(left, right);
  } else {
    return comparePairLists(arraify(left), arraify(right));
  }
};

export const getRightPairIndexes = (pairResults) =>
  pairResults.reduce((acc, pairResult, i) => {
    if (pairResult === RIGHT_ORDER) {
      acc.push(i + 1);
    }
    return acc;
  }, []);

run(
  readRawData,
  splitPairs,
  map(extractNonEmptyLines),
  map(parsePair),
  map(comparePair),
  getRightPairIndexes,
  sumArrayItems,
  console.log
)("../2022/13/data/data");
