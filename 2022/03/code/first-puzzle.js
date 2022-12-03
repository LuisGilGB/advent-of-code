import {
  getCharCode,
  isUpperCase,
  readRawData,
  run,
  sumArrayItems,
} from "../../../utils/utils";

const LOWER_CASE_STARTING_PRIORITY = 1;
const UPPER_CASE_STARTING_PRIORITY = 27;

const LOWER_CASE_CHART_CODE_OFFSET = -(
  getCharCode("a") - LOWER_CASE_STARTING_PRIORITY
);
const UPPER_CASE_CHART_CODE_OFFSET = -(
  getCharCode("A") - UPPER_CASE_STARTING_PRIORITY
);

export const getOffset = (char) =>
  isUpperCase(char)
    ? UPPER_CASE_CHART_CODE_OFFSET
    : LOWER_CASE_CHART_CODE_OFFSET;

export const getRucksacks = (input) =>
  input
    .split("\n")
    .filter(Boolean)
    .map((row) => ({
      firstCompartment: new Set(row.slice(0, row.length / 2).split("")),
      secondCompartment: new Set(row.slice(row.length / 2).split("")),
    }));

const getRepeatedItemType = ({ firstCompartment, secondCompartment }) => {
  let res;
  firstCompartment.forEach((itemType) => {
    if (secondCompartment.has(itemType)) {
      res = itemType;
    }
  });
  return res;
};

export const getRepeatedItemTypes = (input) => input.map(getRepeatedItemType);

export const getPriority = (input) =>
  input.map((itemType) => getCharCode(itemType) + getOffset(itemType));

const raw = readRawData("../2022/03/data/data");

console.log(
  run(getRucksacks, getRepeatedItemTypes, getPriority, sumArrayItems)(raw)
);
