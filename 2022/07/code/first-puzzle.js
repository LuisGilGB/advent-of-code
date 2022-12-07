import {
  extractNonEmptyLines,
  filter,
  map,
  numberify,
  readRawData,
  run,
  sumArrayItems,
} from "../../../utils/utils";

export const ROOT_DIR = "/";

const COMMAND_LINE_CHAR = "$";

const CHANGE_DIRECTORY_COMMAND = "cd";
const LIST_COMMAND = "ls";

const DIRECTORY_KEYWORD = "dir";

const COMMANDS = new Set([CHANGE_DIRECTORY_COMMAND, LIST_COMMAND]);

export const MOVE_OUT_DIR = "..";

export const MAX_ACCOUNTABLE_SIZE = 100_000;

export const parseTerminalLine = (rawLine) => {
  const isCommand = rawLine.startsWith(COMMAND_LINE_CHAR);

  return {
    isCommand,
    parsedContent: isCommand
      ? parseCommand(rawLine)
      : parseListOutputLine(rawLine),
  };
};

const identifyCommand = (word) => (COMMANDS.has(word) ? word : "unknown");

const parseCommand = (commandLine) => {
  const words = commandLine.split(" ");
  const command = identifyCommand(words[1]);
  const args = words.slice(2);

  return {
    command,
    args,
  };
};

const parseListOutputLine = (outputLine) => {
  const words = outputLine.split(" ");
  const isDirectory = words[0] === DIRECTORY_KEYWORD;
  return isDirectory
    ? {
        isDirectory,
        dirName: words[1],
      }
    : {
        isDirectory,
        fileName: words[1],
        size: numberify(words[0]),
      };
};

const factories = {
  buildDirectory: (dirName) => ({
    isDirectory: true,
    name: dirName,
    children: [],
  }),
  buildFile: (fileName, size) => ({
    isDirectory: false,
    name: fileName,
    size,
  }),
  buildDirectoriesListNode: (subtree) => ({
    name: subtree.name,
    size: calculateDirectorySize(subtree),
  }),
};

export const buildFileSystemTree = (parsedTerminal) => {
  const fileSystemTree = factories.buildDirectory(ROOT_DIR);
  const currentDirectory = [ROOT_DIR];

  const getCurrentDirectoryObject = (currentDirectory) => {
    let fileSystemPointer = fileSystemTree;
    currentDirectory.slice(1).map((dirName) => {
      fileSystemPointer = fileSystemPointer.children.find(
        (dir) => dir.name === dirName
      );
    });
    return fileSystemPointer;
  };

  parsedTerminal.forEach((parsedLine) => {
    if (parsedLine.isCommand) {
      const { command, args } = parsedLine.parsedContent;
      if (command === CHANGE_DIRECTORY_COMMAND) {
        const destination = args[0];
        if (destination === MOVE_OUT_DIR) {
          currentDirectory.pop();
        } else {
          getCurrentDirectoryObject(currentDirectory).children.push(
            factories.buildDirectory(destination)
          );
          currentDirectory.push(destination);
        }
      }
    } else {
      const { isDirectory } = parsedLine.parsedContent;
      if (!isDirectory) {
        const { fileName, size } = parsedLine.parsedContent;
        getCurrentDirectoryObject(currentDirectory).children.push(
          factories.buildFile(fileName, size)
        );
      }
    }
  });

  return fileSystemTree;
};

const calculateDirectorySize = (subtree) =>
  subtree.children.reduce(
    (acc, child) =>
      !child.isDirectory
        ? acc + child.size
        : acc + calculateDirectorySize(child),
    0
  );

export const listDirectoriesMetadata = (fileSystemTree) => {
  let list = [];

  const fillList = (children) => {
    children.forEach((child) => {
      if (child.isDirectory) {
        list.push(factories.buildDirectoriesListNode(child));
        fillList(child.children);
      }
    });
  };
  fillList(fileSystemTree.children);

  return list;
};

const hasLessSizeThan = (capSize) => (directory) => directory.size < capSize;

const getSize = (item) => item.size;

console.log(
  run(
    readRawData,
    extractNonEmptyLines,
    map(parseTerminalLine),
    buildFileSystemTree,
    listDirectoriesMetadata,
    filter(hasLessSizeThan(MAX_ACCOUNTABLE_SIZE)),
    map(getSize),
    sumArrayItems
  )("../2022/07/data/data")
);
