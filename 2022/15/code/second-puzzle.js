import {
  extractNonEmptyLines,
  map,
  mapField,
  normalizeArray,
  readRawData,
  run,
  sumArrayItems,
} from "../../../utils/utils";
import { parseLine, splitSensorBeacon } from "./first-puzzle";

const MIN_BOUNDARY = 0;
// const MAX_BOUNDARY = 20;
const MAX_BOUNDARY = 4_000_000;

const FREQUENCY_FACTOR = 4_000_000;

const getManhattanDistance = (pointA, pointB) =>
  sumArrayItems([Math.abs(pointA.x - pointB.x), Math.abs(pointA.y - pointB.y)]);

const getSensorBeaconDistance = ({ sensor, beacon }) =>
  getManhattanDistance(sensor, beacon);

const fillSensorBeaconMetrics = (sensorBeacon) => ({
  ...sensorBeacon,
  distance: getSensorBeaconDistance(sensorBeacon),
});

const getSensorPairsGap = (sensorsData) => {
  const pairsMap = new Map();
  sensorsData.forEach((sensorA) => {
    sensorsData.forEach((sensorB) => {
      if (
        sensorA !== sensorB &&
        !pairsMap.has(JSON.stringify([sensorA, sensorB])) &&
        !pairsMap.has(JSON.stringify([sensorB, sensorA]))
      ) {
        pairsMap.set(JSON.stringify([sensorA, sensorB]), {
          sensors: [sensorA, sensorB],
          gap:
            getManhattanDistance(sensorA.sensor, sensorB.sensor) -
            sensorA.distance -
            sensorB.distance,
        });
      }
    });
  });
  return {
    sensorsData,
    pairs: [...pairsMap.values()].filter(isOneSizeGapPair),
  };
};

const isOneSizeGapPair = (pairData) => pairData.gap > 0 && pairData.gap <= 4;

const calculateGapLine = (pairData) => {
  const { sensors } = pairData;
  const [sensorA, sensorB] = sensors;
  const smallestRangeSensor =
    sensorA.distance < sensorB.distance ? sensorA : sensorB;
  const smallestToBiggestVector = normalizeArray([
    sensorB.sensor.y - sensorA.sensor.y,
    sensorB.sensor.x - sensorA.sensor.x,
  ]);
  const gapLine = [];
  for (
    let gapDistanceDelta = 1;
    gapDistanceDelta <= pairData.gap;
    gapDistanceDelta++
  ) {
    const gapDistance = smallestRangeSensor.distance + 1;
    for (let i = 0; i <= gapDistance; i++) {
      const deltaY = smallestToBiggestVector[0] * i;
      const deltaX = smallestToBiggestVector[1] * (gapDistance - i);
      gapLine.push({
        x: smallestRangeSensor.sensor.x + deltaX,
        y: smallestRangeSensor.sensor.y + deltaY,
      });
    }
  }
  return { ...pairData, gapLine };
};

const extractGapPixels = ({ pairs, ...rest }) => ({
  ...rest,
  ...pairs.reduce(
    (acc, { gapLine, ...rest }) => {
      acc.gapPixels = [...acc.gapPixels, ...gapLine];
      acc.pairs.push({ ...rest });
      return acc;
    },
    { gapPixels: [], pairs: [] }
  ),
});

const filterPixelGapsInBoundaries = ({ gapPixels, ...rest }) => ({
  ...rest,
  gapPixels: gapPixels.filter(
    (pixel) =>
      pixel.x >= MIN_BOUNDARY &&
      pixel.y >= MIN_BOUNDARY &&
      pixel.x <= MAX_BOUNDARY &&
      pixel.y <= MAX_BOUNDARY
  ),
});

const filterDuplicatedPixelGaps = ({ gapPixels, ...rest }) => {
  const set = new Set();
  const setOfDuplicateds = new Set();
  gapPixels.forEach((pixel) => {
    const pixelString = JSON.stringify(pixel);
    if (set.has(pixelString)) {
      setOfDuplicateds.add(pixelString);
    } else {
      set.add(pixelString);
    }
  });
  return {
    ...rest,
    duplicatedGapPixels: [...setOfDuplicateds].map(JSON.parse),
  };
};

const findBlindPixel = ({ sensorsData, duplicatedGapPixels }) => {
  return duplicatedGapPixels.find((pixel) =>
    sensorsData.every(
      ({ sensor, distance }) => getManhattanDistance(pixel, sensor) >= distance
    )
  );
};

const tuneFrequency = ({ x, y }) => FREQUENCY_FACTOR * x + y;

run(
  readRawData,
  extractNonEmptyLines,
  map(parseLine),
  map(splitSensorBeacon),
  map(fillSensorBeaconMetrics),
  getSensorPairsGap,
  mapField("pairs", calculateGapLine),
  extractGapPixels,
  filterPixelGapsInBoundaries,
  filterDuplicatedPixelGaps,
  findBlindPixel,
  tuneFrequency,
  console.log
)("../2022/15/data/data");
