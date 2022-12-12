import { builGraphdMapForDijkstra, runDijkstra } from "../../../utils/dijkstra";
import {
  findInMatrix,
  getCharCode,
  mapMatrixBy,
  parseMatrix,
  readRawData,
  run,
  runAsync,
} from "../../../utils/utils";

export const START_CHAR = "S";
export const END_CHAR = "E";

export const LOWEST_HEIGHT_CHAR = "a";
export const BIGGEST_HEIGHT_CHAR = "z";

const removeStartEnd = (char) => {
  if (char === START_CHAR) {
    return LOWEST_HEIGHT_CHAR;
  } else if (char === END_CHAR) {
    return BIGGEST_HEIGHT_CHAR;
  }
  return char;
};
const getHeight = (char) => getCharCode(char) - getCharCode(LOWEST_HEIGHT_CHAR);

export const translateMatrix = (parsedMatrix) => ({
  start: findInMatrix(parsedMatrix)(START_CHAR),
  end: findInMatrix(parsedMatrix)(END_CHAR),
  heightsMatrix: mapMatrixBy(run(removeStartEnd, getHeight))(parsedMatrix),
});

export const capAtOneStepUp = (currentValue, destinationValue) => ({
  weight: destinationValue - currentValue > 1 ? Infinity : 1,
});

export const calculateGraphMap =
  (weightPredicate = (currentValue, destinationValue) => destinationValue) =>
  (input) => ({
    start: input.start,
    end: input.end,
    ...builGraphdMapForDijkstra(weightPredicate)(input.heightsMatrix),
  });

const calculateOptimalRoute =
  ({ batchSize, predicate }) =>
  async ({ start, end, ...rest }) =>
    runDijkstra({
      batchSize,
      start: start.toString(),
      end: end.toString(),
      predicate,
    })(rest);

runAsync(
  readRawData,
  parseMatrix,
  translateMatrix,
  calculateGraphMap(capAtOneStepUp),
  calculateOptimalRoute({
    batchSize: 1,
  })
)("../2022/12/data/data").then(console.log);
