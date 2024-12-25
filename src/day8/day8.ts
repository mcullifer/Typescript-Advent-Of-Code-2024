import { Benchmark } from '@/util/benchmark';
import { Reader } from '@/util/reader';

type Point = [number, number];

function isAntenna(char: string) {
	return char.match(/[a-zA-Z0-9]/);
}

function inBounds(node: Point, max: Point) {
	return node[0] >= 0 && node[0] < max[0] && node[1] >= 0 && node[1] < max[1];
}

function getAntennaPositions(input: string[]) {
	let antennaPositions = new Map<string, Point[]>();
	for (let i = 0; i < input.length; i++) {
		for (let j = 0; j < input[i].length; j++) {
			if (!isAntenna(input[i][j])) continue;
			let existing = antennaPositions.get(input[i][j]);
			if (existing) {
				existing.push([i, j]);
				antennaPositions.set(input[i][j], existing);
			} else {
				antennaPositions.set(input[i][j], [[i, j]]);
			}
		}
	}
	return antennaPositions;
}

function propagate(
	startNode: Point,
	endNode: Point,
	maxCoords: Point,
	distance: Point,
	propagateToEnd = false
) {
	const antiNodes = [];
	let continueStart = true;
	let continueEnd = true;
	// In Part 1 we don't include the nodes themselves so we
	// start at the next values out, push the nodes to the antiNodes list, then
	// exit the loop after the first iteration.
	if (!propagateToEnd) {
		startNode[0] += distance[0];
		startNode[1] += distance[1];
		endNode[0] -= distance[0];
		endNode[1] -= distance[1];
	}
	while (continueStart || continueEnd) {
		continueEnd = inBounds(endNode, maxCoords);
		continueStart = inBounds(startNode, maxCoords);
		if (continueStart) {
			antiNodes.push(startNode.map((val) => val.toString()).join(','));
			startNode[0] += distance[0];
			startNode[1] += distance[1];
		}
		if (continueEnd) {
			antiNodes.push(endNode.map((val) => val.toString()).join(','));
			endNode[0] -= distance[0];
			endNode[1] -= distance[1];
		}
		if (!propagateToEnd) {
			continueStart = false;
			continueEnd = false;
		}
	}
	return antiNodes;
}

function getAntiNodes(
	antennaPositions: Map<string, Point[]>,
	maxCoords: Point,
	propagateToEnd = false
) {
	const antiNodes = new Set<string>();
	const current: Point = [0, 0];
	const next: Point = [0, 0];
	const distance: Point = [0, 0];
	for (let [antenna, positions] of antennaPositions) {
		for (let i = 0; i < positions.length - 1; i++) {
			for (let j = i + 1; j < positions.length; j++) {
				next[0] = positions[j][0];
				next[1] = positions[j][1];
				current[0] = positions[i][0];
				current[1] = positions[i][1];
				distance[0] = next[0] - current[0];
				distance[1] = next[1] - current[1];
				for (let antiNode of propagate(next, current, maxCoords, distance, propagateToEnd)) {
					antiNodes.add(antiNode);
				}
			}
		}
	}
	return antiNodes;
}

function part1(input: string[]) {
	const antennaPositions = getAntennaPositions(input);
	const antiNodes = getAntiNodes(antennaPositions, [input.length, input[0].length]);
	return antiNodes.size;
}

function part2(input: string[]) {
	const antennaPositions = getAntennaPositions(input);
	const antiNodes = getAntiNodes(antennaPositions, [input.length, input[0].length], true);
	return antiNodes.size;
}

const test = Reader.read(8, 'test');
const input = Reader.read(8, 'input');
Benchmark.withTitle(8).run(part1, test).run(part2, test);
