import {
  filter,
  map,
  multiplyItems,
  numberify,
  readRawData,
  run,
  sort,
} from "../../../utils/utils";

const TURNS = 20;
const WORRINESS_REDUCTION_BY = 3;

export const parseMonkeys = (rawInput) => rawInput.split("\n\n");

const parseMonkeyId = (rawMonkey) =>
  numberify(rawMonkey.slice("Monkey ".length, -1));

const parseStartingItems = (rawStartingItems) =>
  rawStartingItems
    .slice("  Starting items: ".length)
    .split(", ")
    .map(numberify);

const parseOperation = (rawOperation) => {
  const [operation, rawHyperParameter] = rawOperation
    .slice("  Operation: new = old ".length)
    .split(" ");
  return (input) => {
    const hyperParameter =
      rawHyperParameter === "old" ? input : numberify(rawHyperParameter);
    return operation === "*" ? input * hyperParameter : input + hyperParameter;
  };
};

const parseTest = (rawTest) => {
  const divisor = numberify(rawTest.slice("  Test: divisible by ".length));
  return (input) => input % divisor === 0;
};

const parseDestinationIfTrue = (rawTestTrue) =>
  numberify(rawTestTrue.slice("    If true: throw to monkey ".length));
const parseDestinationIfFalse = (rawTestFalse) =>
  numberify(rawTestFalse.slice("    If false: throw to monkey ".length));

export const parseMonkeyTurn = (rawMonkeyTurn) => {
  const [
    rawMonkey,
    rawStartingItems,
    rawOperation,
    rawTest,
    rawTestTrue,
    rawTestFalse,
  ] = rawMonkeyTurn.split("\n");

  return {
    id: parseMonkeyId(rawMonkey),
    startingItems: parseStartingItems(rawStartingItems),
    operation: parseOperation(rawOperation),
    test: parseTest(rawTest),
    destinationIfTrue: parseDestinationIfTrue(rawTestTrue),
    destinationIfFalse: parseDestinationIfFalse(rawTestFalse),
  };
};

const runGame =
  (turns = 1) =>
  (monkeyTurns) => {
    const inspections = monkeyTurns.map(() => 0);
    const runTurns = (
      expectedTurn,
      turnsLeft = turns,
      totalInspections = inspections
    ) => {
      if (turnsLeft === 0) {
        return totalInspections;
      }
      const turnProgress = expectedTurn.map((monkey) => monkey.startingItems);

      expectedTurn.forEach((monkey, i) => {
        const itemsToInspect = turnProgress[i].length;
        turnProgress[i].forEach((item) => {
          totalInspections[i]++;
          const updatedWorriness = Math.floor(
            monkey.operation(item) / WORRINESS_REDUCTION_BY
          );
          const destination = monkey.test(updatedWorriness)
            ? monkey.destinationIfTrue
            : monkey.destinationIfFalse;
          turnProgress[destination].push(updatedWorriness);
        });
        turnProgress[i] = turnProgress[i].slice(itemsToInspect);
      });
      const nextExpectedTurn = expectedTurn.map((monkey, i) => ({
        ...monkey,
        startingItems: turnProgress[i],
      }));

      return runTurns(nextExpectedTurn, turnsLeft - 1, totalInspections);
    };
    return runTurns(monkeyTurns);
  };

export const calculateMonkeyBusiness = (inspections) =>
  run(
    sort((input) => -input),
    filter((_, i) => i < 2),
    multiplyItems
  )(inspections);

console.log(
  run(
    readRawData,
    parseMonkeys,
    map(parseMonkeyTurn),
    runGame(TURNS),
    calculateMonkeyBusiness
  )("../2022/11/data/data")
);
