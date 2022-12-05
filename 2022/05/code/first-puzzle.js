import {
  extractNonEmptyLines,
  numberify,
  readRawData,
  run,
} from "../../../utils/utils";

const MOVE_PARAM_INDEX = 1;
const FROM_PARAM_INDEX = 3;
const TO_PARAM_INDEX = 5;

const extractExerciseData = (rawInput) => {
  const [rawInitial, rawMoves] = rawInput.split("\n\n");
  return {
    initial: parseInitial(rawInitial),
    moves: parseMoves(rawMoves),
  };
};

const parseInitial = (rawInitial) => {
  const serializedCrates = extractNonEmptyLines(rawInitial).slice(0, -1);
  const stacks = extractNonEmptyLines(rawInitial)
    .at(-1)
    .replaceAll(" ", "")
    .split("")
    .map(numberify)
    .reduce((acc, stackNumber, i) => {
      acc[stackNumber] = [];
      serializedCrates.forEach((stackingLevel) => {
        const crate = stackingLevel.at(1 + i * 4);
        if (crate !== " ") {
          acc[stackNumber].push(crate);
        }
      });
      acc[stackNumber].reverse();
      return acc;
    }, {});

  return {
    stacks,
  };
};

const parseMoves = (rawMoves) => {
  const moves = extractNonEmptyLines(rawMoves).map((command) => {
    const tokens = command.split(" ");
    return {
      move: numberify(tokens[MOVE_PARAM_INDEX]),
      from: numberify(tokens[FROM_PARAM_INDEX]),
      to: numberify(tokens[TO_PARAM_INDEX]),
    };
  });
  return moves;
};

const runCrane = ({ initial, moves }) => {
  const { stacks: initialStacks } = initial;
  const stacks = { ...initialStacks };
  moves.forEach(({ move, from, to }) => {
    stacks[to] = [...stacks[to], ...stacks[from].slice(-move).reverse()];
    stacks[from] = stacks[from].slice(0, -move);
  });
  return stacks;
};

const readTops = (stacks) =>
  Object.values(stacks)
    .map((stack) => stack.at(-1))
    .join("");

console.log(
  run(
    readRawData,
    extractExerciseData,
    runCrane,
    readTops
  )("../2022/05/data/data")
);
