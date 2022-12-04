import {
  buildSetFromString,
  getLast,
  readRawData,
  run,
  sumArrayItems,
} from "../../../utils/utils";
import { getPriority, getRucksacks } from "./first-puzzle";

const GROUP_SIZE = 3;

const getGroups = (input) =>
  input.reduce(
    (acc, row) => {
      const currentGroup = getLast(acc);
      if (currentGroup.length < GROUP_SIZE) {
        acc[acc.length - 1].push(row);
      } else {
        acc.push([row]);
      }
      return acc;
    },
    [[]]
  );

const getBadges = (input) =>
  input.map((group) => {
    let res;
    const rSets = group.map((rucksack) => buildSetFromString(rucksack));
    rSets[0].forEach((itemType) => {
      if (rSets.slice(1).every((rSet) => rSet.has(itemType))) {
        res = itemType;
      }
    });
    return res;
  });

const raw = readRawData("../2022/03/data/data");

console.log(
  run(getRucksacks, getGroups, getBadges, getPriority, sumArrayItems)(raw)
);
