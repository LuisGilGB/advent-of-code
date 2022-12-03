import { getMax, readRawData, run, sumArrayItems } from "../../../utils/utils";
import { getElves, getTotalCarriedCalories } from "./first-puzzle";

const raw = readRawData("../2022/01/data/data");

const getNHighest =
  (n) =>
  (res = []) =>
  (input) => {
    const max = getMax(input);
    res.push(max);
    const maxIndex = input.indexOf(max);

    return res.length === n
      ? res
      : getNHighest(n)(res)([
          ...input.slice(0, maxIndex),
          ...input.slice(maxIndex + 1),
        ]);
  };

console.log(
  run(getElves, getTotalCarriedCalories, getNHighest(3)([]), sumArrayItems)(raw)
);
