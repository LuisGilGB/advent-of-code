import { map, numberify, readRawData, run } from "../../../utils/utils";
import {
  calculateMonkeyBusiness,
  parseDestinationIfFalse,
  parseDestinationIfTrue,
  parseMonkeyId,
  parseMonkeys,
  parseStartingItems,
} from "./first-puzzle";

const parseDivisor = (rawTest) =>
  numberify(rawTest.slice("  Test: divisible by ".length));

const parseRemaindersUpdater = (rawOperation) => {
  const [operation, rawHyperParameter] = rawOperation
    .slice("  Operation: new = old ".length)
    .split(" ");

  return (remaindersMap) => {
    return Object.keys(remaindersMap).reduce((acc, divisor) => {
      const input = remaindersMap[divisor];
      const hyperParameter =
        rawHyperParameter === "old" ? input : numberify(rawHyperParameter);
      acc[divisor] =
        operation === "*"
          ? ((input % divisor) * (hyperParameter % divisor)) % divisor
          : ((input % divisor) + (hyperParameter % divisor)) % divisor;
      return acc;
    }, {});
  };
};

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
    divisor: parseDivisor(rawTest),
    remaindersUpdater: parseRemaindersUpdater(rawOperation),
    destinationIfTrue: parseDestinationIfTrue(rawTestTrue),
    destinationIfFalse: parseDestinationIfFalse(rawTestFalse),
  };
};

const attachRemaindersTracking = (monkeys) => {
  const remaindersTemplate = monkeys.reduce((acc, { divisor }) => {
    acc[divisor] = 0;
    return acc;
  }, {});
  return monkeys.map((monkey) => ({
    ...monkey,
    startingItemsRemainders: monkey.startingItems.map((value) =>
      Object.keys(remaindersTemplate).reduce((acc, remainder) => {
        acc[remainder] = value % remainder;
        return acc;
      }, {})
    ),
  }));
};

export const runGame =
  (turns = 1) =>
  (monkeyTurns) => {
    const batchSize = 100;
    const inspections = monkeyTurns.map(() => 0);
    const runTurns = (
      expectedTurn,
      turnsLeft = turns,
      totalInspections = inspections
    ) =>
      new Promise((resolve) => {
        if (turnsLeft === 0) {
          return resolve(totalInspections);
        }
        const turnProgress = expectedTurn.map(
          (monkey) => monkey.startingItemsRemainders
        );

        expectedTurn.forEach((monkey, i) => {
          const itemsToInspect = turnProgress[i].length;
          turnProgress[i].forEach((remaindersMap) => {
            totalInspections[i]++;
            const nextRemaindersMap = monkey.remaindersUpdater(remaindersMap);
            const destination =
              nextRemaindersMap[monkey.divisor] === 0
                ? monkey.destinationIfTrue
                : monkey.destinationIfFalse;

            turnProgress[destination].push(nextRemaindersMap);
          });
          turnProgress[i] = turnProgress[i].slice(itemsToInspect);
        });
        const nextExpectedTurn = expectedTurn.map((monkey, i) => ({
          ...monkey,
          startingItemsRemainders: turnProgress[i],
        }));

        if (turnsLeft % batchSize === 0) {
          setTimeout(async () => {
            resolve(
              runTurns(nextExpectedTurn, turnsLeft - 1, totalInspections)
            );
          }, 0);
        } else {
          resolve(runTurns(nextExpectedTurn, turnsLeft - 1, totalInspections));
        }
      });

    return runTurns(monkeyTurns);
  };

run(
  readRawData,
  parseMonkeys,
  map(parseMonkeyTurn),
  attachRemaindersTracking,
  runGame(10_000)
)("../2022/11/data/data").then(run(calculateMonkeyBusiness, console.log));
