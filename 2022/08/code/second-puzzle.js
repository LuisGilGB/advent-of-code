import {
  extractNonEmptyLines,
  flatten,
  getMax,
  map,
  mapMatrixBy,
  readRawData,
  run,
} from "../../../utils/utils";
import { splitCells } from "./first-puzzle";

const countTreesInSightFactory =
  (treeHeight) =>
  (treesAhead = []) =>
    treesAhead.reduce(
      (acc, targetHeight) => {
        if (acc.blocked) {
          return acc;
        }
        acc.count++;
        if (targetHeight >= treeHeight) {
          acc.blocked = true;
        }
        return acc;
      },
      { count: 0, blocked: false }
    );

const calculateScenicScore = (
  treeHeight,
  { rowIndex, colIndex, row, column }
) => {
  const countTreesInSight = countTreesInSightFactory(treeHeight);
  const treesInSight = {
    north: countTreesInSight(column.slice(0, rowIndex).reverse()),
    south: countTreesInSight(column.slice(rowIndex + 1)),
    east: countTreesInSight(row.slice(colIndex + 1)),
    west: countTreesInSight(row.slice(0, colIndex).reverse()),
  };
  return Object.values(treesInSight)
    .map(({ count }) => count)
    .reduce((acc, count) => acc * count, 1);
};

console.log(
  run(
    readRawData,
    extractNonEmptyLines,
    map(splitCells),
    mapMatrixBy(calculateScenicScore),
    flatten,
    getMax
  )("../2022/08/data/data")
);
