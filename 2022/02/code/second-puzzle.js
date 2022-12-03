import { readRawData, run, sumArrayItems } from "../../../utils/utils";
import {
  DRAW_OUTCOME,
  FIRST_PLAYER_CHOICES,
  LOSE_OUTCOME,
  OUTCOME_MATRIX,
  readRounds,
  SHAPE_SCORES,
  WIN_OUTCOME,
} from "./first-puzzle";

const OUTCOMES_MAP = {
  X: LOSE_OUTCOME,
  Y: DRAW_OUTCOME,
  Z: WIN_OUTCOME,
};

const getScores = (array) =>
  array.map((input) => {
    const firstPlayerChoice = FIRST_PLAYER_CHOICES[input[0]];
    const secondPlayerOutcome = OUTCOMES_MAP[input[1]];
    const secondPlayerChoice = OUTCOME_MATRIX.findIndex(
      (row) => row[firstPlayerChoice] === secondPlayerOutcome
    );
    return (
      OUTCOME_MATRIX[secondPlayerChoice][firstPlayerChoice] +
      SHAPE_SCORES[secondPlayerChoice]
    );
  });

const raw = readRawData("../2022/02/data/data");

console.log(run(readRounds, getScores, sumArrayItems)(raw));
