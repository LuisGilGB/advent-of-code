import minPriorityQueueFactory from "./minPriorityQueue";
import { numberify, sumArrayItems } from "./utils";

export const builGraphdMapForDijkstra =
  (destinationPredicate = (currentValue, destinationValue) => ({})) =>
  (matrix) => {
    const graphMap = new Map();
    const height = matrix.length;
    const width = matrix[0].length;
    matrix.forEach((row, rowIndex) => {
      row.forEach((cellValue, colIndex) => {
        graphMap.set([rowIndex, colIndex].toString(), {
          value: cellValue,
          destinations: [
            [rowIndex + 1, colIndex],
            [rowIndex - 1, colIndex],
            [rowIndex, colIndex + 1],
            [rowIndex, colIndex - 1],
          ]
            .filter(([y, x]) => y < height && x < width && x >= 0 && y >= 0)
            .map((destination) => ({
              id: destination.toString(),
              ...destinationPredicate(
                cellValue,
                matrix[destination[0]][destination[1]]
              ),
            })),
        });
      });
    });
    return {
      matrix,
      graphMap,
    };
  };

export const runDijkstra =
  ({ batchSize = 100, start, end } = {}) =>
  async ({ matrix, graphMap }) => {
    const alreadyVisited = new Set();
    const minPriorityQueue = minPriorityQueueFactory();
    const itinerariesMap = new Map([
      [
        start,
        {
          acc: 0,
          path: [start],
        },
      ],
    ]);
    const runDijkstraStep = (node = start) =>
      new Promise((resolve, reject) => {
        const { destinations } = graphMap.get(node);
        alreadyVisited.add(node);
        if (node === end) {
          resolve({ matrix, ...itinerariesMap.get(node) });
        }
        destinations.forEach((destination) => {
          const destinationId = destination.id;

          const { acc } = itinerariesMap.get(node);
          const candidateValue = acc + destination.weight;

          if (!alreadyVisited.has(destinationId)) {
            minPriorityQueue.has(destinationId)
              ? minPriorityQueue.decreaseForKey(destinationId, candidateValue)
              : minPriorityQueue.insert(destinationId, candidateValue);
          }
          if (itinerariesMap.has(destinationId)) {
            itinerariesMap.get(destinationId).acc > candidateValue &&
              itinerariesMap.set(destinationId, {
                acc: candidateValue,
                path: [...itinerariesMap.get(node).path, destinationId],
              });
          } else {
            itinerariesMap.set(destinationId, {
              acc: candidateValue,
              path: [...itinerariesMap.get(node).path, destinationId],
            });
          }
        });
        const nextNode = minPriorityQueue.extractMin();
        if (alreadyVisited.size % batchSize === 0) {
          setTimeout(async () => {
            resolve(runDijkstraStep(nextNode));
          }, 0);
        } else {
          resolve(runDijkstraStep(nextNode));
        }
      });
    return runDijkstraStep();
  };
