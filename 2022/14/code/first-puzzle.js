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

const isVertical = (rockLine) => rockLine[0][1] === rockLine[1][1];
const isHorizontal = (rockLine) => rockLine[0][0] === rockLine[1][0];

const paintRocks = ({ rockLines, sliceMatrix, xBoundaries, ...rest }) => {
  rockLines.forEach((rockLine) => {
    mapMatrixBy((item, { colIndex, rowIndex }) => {
      const verticalStart = Math.min(...rockLine.map((limit) => limit[1]));
      const verticalEnd = Math.max(...rockLine.map((limit) => limit[1]));
      const horizontalStart =
        Math.min(...rockLine.map((limit) => limit[0])) - xBoundaries[0];
      const horizontalEnd =
        Math.max(...rockLine.map((limit) => limit[0])) - xBoundaries[0];

      if (
        rowIndex >= verticalStart &&
        rowIndex < verticalEnd &&
        colIndex >= horizontalStart &&
        colIndex <= horizontalEnd
      ) {
        return ROCK;
      }
      return item;
    })(sliceMatrix);
  });

  return {
    rockLines,
    sliceMatrix,
    xBoundaries,
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
  paintRocks,
  console.log
)("../2022/14/data/test-data");
