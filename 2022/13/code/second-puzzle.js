import {
  extractNonEmptyLines,
  flatten,
  map,
  multiplyItems,
  readRawData,
  run,
} from "../../../utils/utils";
import {
  comparePair,
  parsePair,
  RIGHT_ORDER,
  splitPairs,
} from "./first-puzzle";

const DIVIDER_1 = [[2]];
const DIVIDER_2 = [[6]];

const fixPairSorting = ([left, right]) =>
  comparePair([left, right]) === RIGHT_ORDER ? [left, right] : [right, left];

const addPacket = (packet) => (packets) => [...packets, packet];

const sortPackets = (packets) => packets.sort((a, b) => -comparePair([a, b]));

const findDividerIndexes = (dividers) => (packets) =>
  packets.reduce((acc, packet, i) => {
    if (dividers.includes(packet)) {
      acc.push(i + 1);
    }
    return acc;
  }, []);

run(
  readRawData,
  splitPairs,
  map(extractNonEmptyLines),
  map(parsePair),
  map(fixPairSorting),
  flatten,
  addPacket(DIVIDER_1),
  addPacket(DIVIDER_2),
  sortPackets,
  map(JSON.stringify),
  findDividerIndexes([DIVIDER_1, DIVIDER_2].map(JSON.stringify)),
  multiplyItems,
  console.log
)("../2022/13/data/data");
