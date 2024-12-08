import { Benchmark } from '@/util/benchmark';
import { Reader } from '@/util/reader';

const test = Reader.read(8, 'test');
const input = Reader.read(8, 'input');

function isAntenna(char: string) {
	return char.match(/[a-zA-Z0-9]/);
}

function getAntennaPositions(input: string[]) {
	let antennaPositions = new Map<string, [number, number][]>();
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

function inBounds(val: number, max: number) {
	return val >= 0 && val < max;
}

function propogate(
	startNode: [number, number],
	endNode: [number, number],
	rowMax: number,
	colMax: number,
	dy: number,
	dx: number,
	once = false
) {
	let antiNodes = [];
	let continueStart = true;
	let continueEnd = true;
	while (continueStart || continueEnd) {
		continueStart = inBounds(startNode[0], rowMax) && inBounds(startNode[1], colMax);
		continueEnd = inBounds(endNode[0], rowMax) && inBounds(endNode[1], colMax);
		if (continueStart) {
			antiNodes.push(startNode.map((val) => val.toString()).join(','));
			startNode[0] += dy;
			startNode[1] += dx;
		}
		if (continueEnd) {
			antiNodes.push(endNode.map((val) => val.toString()).join(','));
			endNode[0] -= dy;
			endNode[1] -= dx;
		}
		if (once) {
			continueStart = false;
			continueEnd = false;
		}
	}
	return antiNodes;
}

function getAntiNodes(
	antennaPositions: Map<string, [number, number][]>,
	rowMax: number,
	colMax: number,
	propogateToEnd = false
) {
	let antiNodes = new Set<string>();
	for (let [antenna, positions] of antennaPositions) {
		for (let i = 0; i < positions.length - 1; i++) {
			for (let j = i + 1; j < positions.length; j++) {
				let next: [number, number] = [positions[j][0], positions[j][1]];
				let current: [number, number] = [positions[i][0], positions[i][1]];
				const dy = next[0] - current[0];
				const dx = next[1] - current[1];
				if (!propogateToEnd) {
					next[0] += dy;
					next[1] += dx;
					current[0] -= dy;
					current[1] -= dx;
				}
				for (let antiNode of propogate(next, current, rowMax, colMax, dy, dx, !propogateToEnd)) {
					antiNodes.add(antiNode);
				}
			}
		}
	}
	return antiNodes;
}

function part1(input: string[]) {
	const antennaPositions = getAntennaPositions(input);
	const antiNodes = getAntiNodes(antennaPositions, input.length, input[0].length);
	return antiNodes.size;
}

function part2(input: string[]) {
	const antennaPositions = getAntennaPositions(input);
	const antiNodes = getAntiNodes(antennaPositions, input.length, input[0].length, true);
	return antiNodes.size;
}

Benchmark.run(part1, test);
console.log('---------------------');
Benchmark.run(part2, test);
