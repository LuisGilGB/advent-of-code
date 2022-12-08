import {
  countBy,
  flatten,
  isTrue,
  mapMatrixBy,
  numberify,
  parseMatrixMappingBy,
  readRawData,
  run,
} from "../../../utils/utils";

const hasHigherTreeFactory =
  (ownHeight) =>
  (inBetweenHeights = []) =>
    inBetweenHeights.some((height) => height >= ownHeight);

const isVisible = (treeHeight, { rowIndex, colIndex, row, column }) => {
  const hasHigher = hasHigherTreeFactory(treeHeight);

  const hasHigherAt = {
    north: hasHigher(column.slice(0, rowIndex)),
    south: hasHigher(column.slice(rowIndex + 1)),
    east: hasHigher(row.slice(colIndex + 1)),
    west: hasHigher(row.slice(0, colIndex)),
  };

  return Object.values(hasHigherAt).some((hasHigher) => !hasHigher);
};

console.log(
  run(
    readRawData,
    parseMatrixMappingBy(numberify),
    mapMatrixBy(isVisible),
    flatten,
    countBy(isTrue)
  )("../2022/08/data/data")
);
