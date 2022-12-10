import {
  extractNonEmptyLines,
  map,
  readRawData,
  run,
} from "../../../utils/utils";
import {
  parseInstruction,
  runMachineAndReturnRegisterHistory,
} from "./first-puzzle";

const SCREEN_WIDTH = 40;

const returnScreen = (history) =>
  history.reduce((acc, spritePointer, i) => {
    const spritePositions = [
      spritePointer - 1,
      spritePointer,
      spritePointer + 1,
    ];
    acc = acc + (spritePositions.includes(i % SCREEN_WIDTH) ? "#" : ".");
    const isEndOfLine = (i + 1) % SCREEN_WIDTH === 0;
    if (isEndOfLine) {
      acc = acc + "\n";
    }
    return acc;
  }, "");

console.log(
  run(
    readRawData,
    extractNonEmptyLines,
    map(parseInstruction),
    runMachineAndReturnRegisterHistory,
    returnScreen
  )("../2022/10/data/data")
);
