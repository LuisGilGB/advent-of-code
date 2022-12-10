import {
  extractNonEmptyLines,
  flatten,
  map,
  readRawData,
  run,
} from "../../../utils/utils";
import { countTailPositions, parseMoveLine, trackMoves } from "./first-puzzle";

const ROPE_LENGTH = 10;

console.log(
  run(
    readRawData,
    extractNonEmptyLines,
    map(parseMoveLine),
    flatten,
    trackMoves(ROPE_LENGTH),
    countTailPositions
  )("../2022/09/data/data")
);
