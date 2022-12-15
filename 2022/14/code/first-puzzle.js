import {
  extractNonEmptyLines,
  flatten,
  map,
  mapMatrixBy,
  numberify,
  readRawData,
  run,
} from "../../../utils/utils";

const POURING_PIXEL_LOCATION = [500, 0];

const ROCK = "#";
const AIR = ".";
const SAND = "o";
const POURING_PIXEL = "+";

const parseTrace = (rawTrace) =>
  rawTrace.split(" -> ").map((rawPixel) => rawPixel.split(",").map(numberify));

const extractLinearTraces = (trace) =>
  trace.reduce((acc, pixel, i, arr) => {
    if (i > 0) {
      acc.push([arr[i - 1], pixel]);
    }
    return acc;
  }, []);

const getSliceMatrix = (rockLines) => {
  const xLimits = rockLines
    .map((rockLine) => rockLine.map(([x, y]) => x))
    .flat();
  const yLimits = rockLines.map((limits) => limits.map(([x, y]) => y)).flat();
  const xBoundaries = [Math.min(...xLimits), Math.max(...xLimits) + 1];
  const yBoundaries = [0, Math.max(...yLimits) + 1];

  const sliceMatrix = new Array(yBoundaries[1])
    .fill(null)
    .map(() => new Array(xBoundaries[1] - xBoundaries[0]).fill(AIR));

  const normalizedPouringPixel = [
    POURING_PIXEL_LOCATION[0] - xBoundaries[0],
    POURING_PIXEL_LOCATION[1] - yBoundaries[0],
  ];
  sliceMatrix[normalizedPouringPixel[1]][normalizedPouringPixel[0]] =
    POURING_PIXEL;

  return {
    rockLines,
    xBoundaries,
    yBoundaries,
    sliceMatrix,
  };
};

const getRow = (pixel) => pixel[1];
const getCol = (pixel) => pixel[0];

const isVertical = (rockLine) => getCol(rockLine[0]) === getCol(rockLine[1]);
const isHorizontal = (rockLine) => getRow(rockLine[0]) === getRow(rockLine[1]);

const findRocks = ({ rockLines, ...rest }) => ({
  ...rest,
  rocksSet: new Set(
    rockLines
      .reduce((acc, rockLine) => {
        const row1 = getRow(rockLine[0]);
        const row2 = getRow(rockLine[1]);
        const col1 = getCol(rockLine[0]);
        const col2 = getCol(rockLine[1]);
        if (isVertical(rockLine)) {
          for (
            let rowIndex = Math.min(row1, row2);
            rowIndex <= Math.max(row1, row2);
            rowIndex++
          ) {
            acc.push([rowIndex, col1]);
          }
        } else if (isHorizontal(rockLine)) {
          for (
            let colIndex = Math.min(col1, col2);
            colIndex <= Math.max(col1, col2);
            colIndex++
          ) {
            acc.push([row1, colIndex]);
          }
        }
        return acc;
      }, [])
      .map(JSON.stringify)
  ),
});

const paintRocks = ({ rocksSet, sliceMatrix, xBoundaries, ...rest }) => {
  return {
    rocksSet,
    sliceMatrix: mapMatrixBy((item, { colIndex, rowIndex }) => {
      if (rocksSet.has(JSON.stringify([rowIndex, colIndex + xBoundaries[0]]))) {
        return ROCK;
      }
      return item;
    })(sliceMatrix),
    ...rest,
  };
};

run(
  readRawData,
  extractNonEmptyLines,
  map(parseTrace),
  map(extractLinearTraces),
  flatten,
  getSliceMatrix,
  findRocks,
  paintRocks,
  console.log
)("../2022/14/data/test-data");
