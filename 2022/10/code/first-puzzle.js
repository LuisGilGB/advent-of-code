import {
  extractNonEmptyLines,
  filter,
  map,
  numberify,
  readRawData,
  run,
  sumArrayItems,
} from "../../../utils/utils";

export const MILESTONE_SHIFT = 20;
export const MILESTONES_STEP = 40;
export const REGISTER_INITIAL_VALUE = 1;

export const INSTRUCTIONS = {
  addx: {
    cycles: 2,
    fn: (registerValue, instructionValue) => registerValue + instructionValue,
  },
  noop: {
    cycles: 1,
  },
};

export const parseInstruction = (rawLine) => {
  const [key, value] = rawLine.split(" ");
  return {
    key,
    ...(value && { value: numberify(value) }),
  };
};

export const runMachineAndReturnRegisterHistory = (instructions) =>
  instructions.reduce(
    (accHistory, instruction) => {
      const currentValue = accHistory.at(-1);
      const { cycles, fn } = INSTRUCTIONS[instruction.key];
      accHistory = [...accHistory, ...new Array(cycles).fill(currentValue)];
      accHistory[accHistory.length - 1] =
        fn?.(currentValue, instruction.value) ?? currentValue;
      return accHistory;
    },
    [REGISTER_INITIAL_VALUE]
  );

export const isMilestone = (value, index) =>
  (index - MILESTONE_SHIFT + 1) % MILESTONES_STEP === 0;

export const getSignalStrength = (value, i) =>
  value * (i * MILESTONES_STEP + MILESTONE_SHIFT);

console.log(
  run(
    readRawData,
    extractNonEmptyLines,
    map(parseInstruction),
    runMachineAndReturnRegisterHistory,
    filter(isMilestone),
    map(getSignalStrength),
    sumArrayItems
  )("../2022/10/data/data")
);
