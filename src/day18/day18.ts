import { Benchmark } from '@/util/benchmark';
import { Reader } from '@/util/reader';

type Point = [number, number];
const directions: Point[] = [
	[-1, 0],
	[1, 0],
	[0, -1],
	[0, 1]
];

class MemorySpace {
	grid: string[][];
	constructor(size: number) {
		this.grid = [];
		for (let i = 0; i < size + 1; i++) {
			this.grid[i] = [];
			for (let j = 0; j < size + 1; j++) {
				this.grid[i][j] = '.';
			}
		}
	}

	set(x: number, y: number, value: string) {
		if (!this.inBounds(x, y)) return;
		this.grid[y][x] = value;
	}

	isCorrupted(x: number, y: number): boolean {
		return this.grid[y][x] === '#';
	}

	inBounds(x: number, y: number): boolean {
		return x >= 0 && x < this.grid.length && y >= 0 && y < this.grid.length;
	}

	show() {
		for (let line of this.grid) {
			console.log(line.join(''));
		}
	}
}

// 🗿 priority queue
function getMinimumStepPoint(queue: [Point, number][]) {
	if (queue.length === 0) return undefined;
	let min = queue[0];
	let minIndex = 0;
	for (let i = 1; i < queue.length; i++) {
		if (queue[i][1] < min[1]) {
			min = queue[i];
			minIndex = i;
		}
	}
	queue = queue.splice(minIndex, 1);
	return min;
}

function getShortestPath(start: Point, end: Point, memSpace: MemorySpace) {
	let visited = new Map<string, number>();
	let queue: [Point, number][] = [[start, 0]];
	while (queue.length > 0) {
		let current: [Point, number] | undefined = getMinimumStepPoint(queue);
		if (current === undefined) break;
		let existing = visited.get(current[0].toString());
		if (existing !== undefined) {
			continue;
		}
		visited.set(current[0].toString(), current[1]);
		if (current[0].toString() === end.toString()) {
			break;
		}
		for (let dir of directions) {
			let next: Point = [current[0][0] + dir[1], current[0][1] + dir[0]];
			if (visited.has(next.toString()) && visited.get(next.toString())! <= current[1] + 1) {
				continue;
			}
			if (memSpace.inBounds(next[0], next[1]) && !memSpace.isCorrupted(next[0], next[1])) {
				queue.push([next, current[1] + 1]);
			}
		}
	}
	return visited.get(end.toString()) ?? 0;
}

function part1(input: string[]) {
	const coords: Point[] = input.map((line) => line.split(',').map(Number) as Point);
	const memSpaceSize = 70;
	const byteRange = 1024;
	const memSpace = new MemorySpace(memSpaceSize);
	const start: Point = [0, 0];
	const end: Point = [memSpaceSize, memSpaceSize];
	coords.slice(0, byteRange).forEach(([x, y]) => memSpace.set(x, y, '#'));
	const shortest = getShortestPath(start, end, memSpace);
	return shortest;
}

// This isn't the best solution because it has to run the shortest path search multiple times
// A better way would be to get a list of the points that are on the minimum path between start and end
// then for each next item in the coords list if those points are on the path then we know that's the point that breaks it?
// Could maybe have an edge case with multiple best paths though where one path is still valid even if that point is in the list
function part2(input: string[]) {
	const coords: Point[] = input.map((line) => line.split(',').map(Number) as Point);
	const memSpaceSize = 70;
	const byteRange = 1024;
	const memSpace = new MemorySpace(memSpaceSize);
	const start: Point = [0, 0];
	const end: Point = [memSpaceSize, memSpaceSize];
	coords.slice(0, byteRange).forEach(([x, y]) => memSpace.set(x, y, '#'));
	let offset = 0;
	while (byteRange + offset < coords.length && getShortestPath(start, end, memSpace) !== 0) {
		offset++;
		const nextCorrupted = coords[byteRange + offset];
		memSpace.set(nextCorrupted[0], nextCorrupted[1], '#');
	}
	return coords[byteRange + offset];
}

const test = Reader.read(18, 'test');
const input = Reader.read(18, 'input');
Benchmark.withTitle(18).run(part1, test).run(part2, test);
