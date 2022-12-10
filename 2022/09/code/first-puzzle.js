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

const STARTING_STATE = {
  H: STARTING_POINT,
  T: STARTING_POINT,
};

const MOVES_MAP = {
  R: [1, 0],
  U: [0, 1],
  L: [-1, 0],
  D: [0, -1],
};

const parseMoveLine = (moveLine) => {
  const [direction, count] = moveLine.split(" ");
  return new Array(+count).fill(null).map(() => MOVES_MAP[direction]);
};

const trackMoves = (moves) => {
  const startingState = { ...STARTING_STATE };
  const tailPositionsSet = new Set();
  tailPositionsSet.add(JSON.stringify(startingState.T));
  const destination = moves.reduce((acc, move) => {
    acc.H = sumArrays(acc.H, move);
    acc.T = pullTail(acc);
    tailPositionsSet.add(JSON.stringify(acc.T));
    return acc;
  }, startingState);
  return {
    destination,
    tailPositionsSet,
  };
};

const pullTail = (state) => {
  const { H, T } = state;
  const diff = substractArrays(H, T);
  if (diff.every((diff) => Math.abs(diff) <= 1)) {
    return T;
  }
  return sumArrays(T, normalizeArray(diff));
};

const countTailPositions = ({ tailPositionsSet }) => tailPositionsSet.size;

console.log(
  run(
    readRawData,
    extractNonEmptyLines,
    map(parseMoveLine),
    flatten,
    trackMoves,
    countTailPositions
  )("../2022/09/data/data")
);
