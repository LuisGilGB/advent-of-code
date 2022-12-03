import { getMax, readRawData, run, sumArrayItems } from "../../../utils/utils";

export const getElves = (caloriesInput) =>
  caloriesInput.split("\n").reduce(
    (acc, calories) => {
      if (calories) {
        acc.at(-1).push(+calories);
        return acc;
      } else {
        acc.push([]);
        return acc;
      }
    },
    [[]]
  );

export const getTotalCarriedCalories = (elves) => elves.map(sumArrayItems);

const raw = readRawData("../2022/01/data/data");

console.log(run(getElves, getTotalCarriedCalories, getMax)(raw));
