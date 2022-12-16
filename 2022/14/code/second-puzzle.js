import {
  beautifyMatrix,
  extractNonEmptyLines,
  flatten,
  map,
  readRawData,
  run,
  sumArrays,
} from "../../../utils/utils";
import {
  AIR,
  extractLinearTraces,
  findRocks,
  getCount,
  paintRocks,
  parseTrace,
  POURING_PIXEL,
  POURING_PIXEL_LOCATION,
  ROCK,
  SAND,
} from "./first-puzzle";

const DISTANCE_TO_GROUND = 2;

const getSliceMatrix = (rockLines) => {
  const xLimits = rockLines
    .map((rockLine) => rockLine.map(([x, y]) => x))
    .flat();
  const yLimits = rockLines.map((limits) => limits.map(([x, y]) => y)).flat();
  const yBoundaries = [0, Math.max(...yLimits) + 1 + DISTANCE_TO_GROUND];
  const xBoundaries = [
    Math.min(...xLimits) - yBoundaries[1],
    Math.max(...xLimits) + 1 + yBoundaries[1],
  ];

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

const fillRockBottom = ({ sliceMatrix, yBoundaries, ...rest }) => {
  sliceMatrix[yBoundaries[1] - 1].forEach((cell, i) => {
    sliceMatrix[yBoundaries[1] - 1][i] = ROCK;
  });
  return {
    sliceMatrix,
    yBoundaries,
    ...rest,
  };
};

const pour = ({ sliceMatrix, xBoundaries }) => {
  const TRIES = [
    [0, 1],
    [-1, 1],
    [1, 1],
  ];

  let position = POURING_PIXEL_LOCATION;
  let blocked = false;
  let outOfBoundaries = false;
  while (!blocked && !outOfBoundaries) {
    try {
      const move = TRIES.find(([deltaCol, deltaRow]) =>
        [AIR, undefined].includes(
          sliceMatrix[position[1] + deltaRow][
            position[0] + deltaCol - xBoundaries[0]
          ]
        )
      );
      if (!move) {
        blocked = true;
        sliceMatrix[position[1]][position[0] - xBoundaries[0]] = SAND;
      } else {
        position = sumArrays(position, move);
      }
    } catch (error) {
      outOfBoundaries = true;
    }
  }

  return {
    position,
    outOfBoundaries,
  };
};

const runPouring = ({ sliceMatrix, xBoundaries }) => {
  let outOfBoundaries = false;
  let counter = 0;
  let lastFilledPixel;
  while (!outOfBoundaries && lastFilledPixel !== POURING_PIXEL_LOCATION) {
    const pourResult = pour({ sliceMatrix, xBoundaries });
    lastFilledPixel = pourResult.position;
    outOfBoundaries = pourResult.outOfBoundaries;
    if (!outOfBoundaries) {
      counter++;
    }
  }
  return {
    sliceMatrix,
    counter,
  };
};

const printSliceMatrix = ({ sliceMatrix }) => beautifyMatrix(sliceMatrix);

run(
  readRawData,
  extractNonEmptyLines,
  map(parseTrace),
  map(extractLinearTraces),
  flatten,
  getSliceMatrix,
  findRocks,
  paintRocks,
  fillRockBottom,
  runPouring,
  // printSliceMatrix,
  getCount,
  console.log
)("../2022/14/data/data");
