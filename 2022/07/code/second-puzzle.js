import {
  extractNonEmptyLines,
  getNth,
  map,
  readRawData,
  run,
  sort,
} from "../../../utils/utils";
import {
  buildFileSystemTree,
  getSize,
  listDirectoriesMetadata,
  parseTerminalLine,
} from "./first-puzzle";

const TOTAL_DISK_SPACE = 70_000_000;
const NEEDED_SPACE = 30_000_000;

const filterSmallDirectories = (sortedDirectoriesList) => {
  const emptySpace = TOTAL_DISK_SPACE - sortedDirectoriesList.at(-1).size;
  const amountToDelete = NEEDED_SPACE - emptySpace;
  return sortedDirectoriesList.filter(
    (directory) => directory.size >= amountToDelete
  );
};

console.log(
  run(
    readRawData,
    extractNonEmptyLines,
    map(parseTerminalLine),
    buildFileSystemTree,
    listDirectoriesMetadata,
    sort(getSize),
    filterSmallDirectories,
    getNth(0),
    getSize
  )("../2022/07/data/data")
);
