import { readRawData, run, sumArrayItems } from "../../../utils/utils";

export const SHAPES = {
  ROCK: 0,
  PAPER: 1,
  SCISSORS: 2,
};

export const SHAPE_SCORES = {
  [SHAPES.ROCK]: 1,
  [SHAPES.PAPER]: 2,
  [SHAPES.SCISSORS]: 3,
};

export const LOSE_OUTCOME = 0;
export const DRAW_OUTCOME = 3;
export const WIN_OUTCOME = 6;

export const OUTCOME_MATRIX = [
  [DRAW_OUTCOME, LOSE_OUTCOME, WIN_OUTCOME],
  [WIN_OUTCOME, DRAW_OUTCOME, LOSE_OUTCOME],
  [LOSE_OUTCOME, WIN_OUTCOME, DRAW_OUTCOME],
];

export const FIRST_PLAYER_CHOICES = {
  A: SHAPES.ROCK,
  B: SHAPES.PAPER,
  C: SHAPES.SCISSORS,
};

export const SECOND_PLAYER_CHOICES = {
  X: SHAPES.ROCK,
  Y: SHAPES.PAPER,
  Z: SHAPES.SCISSORS,
};

export const readRounds = (input) =>
  input
    .split("\n")
    .filter(Boolean)
    .map((input) => input.split(" "));

const getScores = (array) =>
  array.map((input) => {
    const firstPlayerChoice = FIRST_PLAYER_CHOICES[input[0]];
    const secondPlayerChoice = SECOND_PLAYER_CHOICES[input[1]];
    return (
      OUTCOME_MATRIX[secondPlayerChoice][firstPlayerChoice] +
      SHAPE_SCORES[secondPlayerChoice]
    );
  });

const raw = readRawData("../2022/02/data/data");

console.log(run(readRounds, getScores, sumArrayItems)(raw));
