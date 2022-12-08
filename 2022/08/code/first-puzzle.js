import {
  countBy,
  extractNonEmptyLines,
  flatten,
  isTrue,
  map,
  numberify,
  readRawData,
  run,
  transpose,
} from "../../../utils/utils";

export const splitCells = (treesRow) => treesRow.split("").map(numberify);

const hasHigherTreeFactory =
  (ownHeight) =>
  (inBetweenHeights = []) =>
    inBetweenHeights.some((height) => height >= ownHeight);

const mapTreesMatrixToVisibility = (treesMatrix) => {
  const transposedMatrix = transpose(treesMatrix);
  return treesMatrix.map((treesRow, rowIndex) =>
    treesRow.map((treeHeight, colIndex) => {
      const treesColumn = transposedMatrix[colIndex];
      const top = treesColumn.slice(0, rowIndex);
      const left = treesRow.slice(0, colIndex);
      const bottom = treesColumn.slice(rowIndex + 1);
      const right = treesRow.slice(colIndex + 1);

      const hasHigher = hasHigherTreeFactory(treeHeight);

      const higherTreesCheckArray = [
        hasHigher(top),
        hasHigher(left),
        hasHigher(bottom),
        hasHigher(right),
      ];

      return higherTreesCheckArray.some((hasHigher) => !hasHigher);
    })
  );
};

console.log(
  run(
    readRawData,
    extractNonEmptyLines,
    map(splitCells),
    mapTreesMatrixToVisibility,
    flatten,
    countBy(isTrue)
  )("../2022/08/data/data")
);
