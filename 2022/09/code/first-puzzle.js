import {
  extractNonEmptyLines,
  flatten,
  map,
  normalizeArray,
  readRawData,
  run,
  substractArrays,
  sumArrays,
} from "../../../utils/utils";

const STARTING_POINT = [0, 0];

const startingStateFactory = (length) =>
  new Array(length).fill(null).map(() => STARTING_POINT);

const ROPE_LENGTH = 2;

const MOVES_MAP = {
  R: [1, 0],
  U: [0, 1],
  L: [-1, 0],
  D: [0, -1],
};

export const parseMoveLine = (moveLine) => {
  const [direction, count] = moveLine.split(" ");
  return new Array(+count).fill(null).map(() => MOVES_MAP[direction]);
};

export const trackMoves = (ropeLength) => (moves) => {
  const startingState = startingStateFactory(ropeLength);
  const tailPositionsSet = new Set();
  tailPositionsSet.add(JSON.stringify(startingState.at(-1)));

  const destination = moves.reduce((acc, move) => {
    acc.forEach((knot, i) => {
      acc[i] = i > 0 ? pullFrom(knot, acc[i - 1]) : sumArrays(knot, move);
    });
    tailPositionsSet.add(JSON.stringify(acc.at(-1)));
    return acc;
  }, startingState);

  return {
    destination,
    tailPositionsSet,
  };
};

const pullFrom = (pulled, puller) => {
  const diff = substractArrays(puller, pulled);
  if (diff.every((diff) => Math.abs(diff) <= 1)) {
    return pulled;
  }
  return sumArrays(pulled, normalizeArray(diff));
};

export const countTailPositions = ({ tailPositionsSet }) => {
  console.log("tailPositionsSet", tailPositionsSet);
  return tailPositionsSet.size;
};

console.log(
  run(
    readRawData,
    extractNonEmptyLines,
    map(parseMoveLine),
    flatten,
    trackMoves(ROPE_LENGTH),
    countTailPositions
  )("../2022/09/data/test-data")
);
