import {
  extractNonEmptyLines,
  map,
  numberify,
  readRawData,
  run,
  sumArrayItems,
} from "../../../utils/utils";

export const parseLine = (line) =>
  line
    .split("Sensor at x=")
    .map((line) => line.split(", y="))
    .flat()
    .map((line) => line.split(": closest beacon is at x="))
    .flat()
    .map((line) => line.split(", y="))
    .flat()
    .filter(Boolean)
    .map(numberify);

export const splitSensorBeacon = (sensorBeacon) => ({
  sensor: { x: sensorBeacon[0], y: sensorBeacon[1] },
  beacon: { x: sensorBeacon[2], y: sensorBeacon[3] },
});

const beaconlessCellsAtRow = (rowIndex) => (sensorsData) => {
  const beaconlessCellsSet = sensorsData.reduce((acc, { sensor, beacon }) => {
    const rangeDistance = sumArrayItems([
      Math.abs(sensor.x - beacon.x),
      Math.abs(sensor.y - beacon.y),
    ]);
    const rowDistance = Math.abs(sensor.y - rowIndex);
    const rowCloseness = rangeDistance - rowDistance;
    if (rowCloseness >= 0) {
      for (let i = sensor.x - rowCloseness; i <= sensor.x + rowCloseness; i++) {
        acc.add(JSON.stringify([i, rowIndex]));
      }
    }
    return acc;
  }, new Set());

  sensorsData.forEach(({ sensor, beacon }) => {
    beaconlessCellsSet.delete(JSON.stringify([sensor.x, sensor.y]));
    beaconlessCellsSet.delete(JSON.stringify([beacon.x, beacon.y]));
  });

  return beaconlessCellsSet;
};

const getSetSize = (set) => set.size;

// run(
//   readRawData,
//   extractNonEmptyLines,
//   map(parseLine),
//   map(splitSensorBeacon),
//   beaconlessCellsAtRow(2000000),
//   getSetSize,
//   console.log
// )("../2022/15/data/data");
