import { readRawData, run } from "../../../utils/utils";

export const getLatestPackageSize =
  (markerSize = 1) =>
  (datastream) => {
    let res;
    let set = new Set();
    for (let index = markerSize; set.size !== markerSize; index++) {
      res = index;
      const slice = datastream.slice(0, index).slice(-markerSize);
      set = new Set(slice);
    }
    return res;
  };

console.log(run(readRawData, getLatestPackageSize(4))("../2022/06/data/data"));
