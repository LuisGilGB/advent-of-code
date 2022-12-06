import { readRawData, run } from "../../../utils/utils";
import { extractExerciseData, readTops, runCrane } from "./first-puzzle";

console.log(
  run(
    readRawData,
    extractExerciseData,
    runCrane({ oneAtATime: false }),
    readTops
  )("../2022/05/data/data")
);
