import { parseMatrix, readRawData, run, runAsync } from "../../../utils/utils";
import {
  calculateGraphMap,
  calculateOptimalRoute,
  countSteps,
  translateMatrix,
} from "./first-puzzle";

const capAtOneStepUpWithLowestFree = (currentValue, destinationValue) => ({
  weight:
    destinationValue === 0
      ? 1
      : destinationValue - currentValue > 1
      ? Infinity
      : 10,
});

// Unused in the ned, but for the naive approach of calculating Dijkstra for all possible starting points
const splitByStartingPoints = ({ end, heightsMatrix }) =>
  heightsMatrix
    .reduce(
      (acc, row, rowIndex) =>
        row.reduce((acc, height, colIndex) => {
          if (height === 0) {
            acc.push([rowIndex, colIndex]);
          }
          return acc;
        }, acc),
      []
    )
    .map((start) => ({
      start,
      end,
      heightsMatrix,
    }));

const filterRedundantLowestPoints = ({ acc, path, matrix }) => ({
  acc,
  matrix,
  path: path.filter((stringCoord, i) => {
    const [rowIndex, colIndex] = (path[i + 1] || "1,1").split(",");
    return matrix[rowIndex][colIndex] !== 0;
  }),
});

runAsync(
  readRawData,
  parseMatrix,
  translateMatrix,
  calculateGraphMap(capAtOneStepUpWithLowestFree),
  calculateOptimalRoute({
    batchSize: 1,
  })
)("../2022/12/data/data").then(
  run(filterRedundantLowestPoints, countSteps, console.log)
);
