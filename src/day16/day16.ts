import { Benchmark } from '@/util/benchmark';
import { Reader } from '@/util/reader';

type Point = [number, number];
const directions: Point[] = [
	[-1, 0],
	[1, 0],
	[0, -1],
	[0, 1]
];
const validDirections: { [key: string]: Point[] } = {
	'-1,0': [
		[-1, 0],
		[0, -1],
		[0, 1]
	],
	'1,0': [
		[1, 0],
		[0, -1],
		[0, 1]
	],
	'0,-1': [
		[0, -1],
		[-1, 0],
		[1, 0]
	],
	'0,1': [
		[0, 1],
		[-1, 0],
		[1, 0]
	]
};

class Node {
	constructor(
		public point: Point,
		public previous: Node | undefined,
		public direction: Point,
		public directionChanges: number,
		public length: number
	) {}
	get score() {
		return this.length + this.directionChanges * 1000;
	}
}

function setup(input: string[]): [string[][], Point, Point] {
	let grid: string[][] = [];
	let start: Point = [0, 0];
	let end: Point = [0, 0];
	for (let i = 0; i < input.length; i++) {
		grid.push([]);
		for (let j = 0; j < input[i].length; j++) {
			grid[i].push(input[i][j]);
			if (input[i][j] === 'S') {
				start = [i, j];
			} else if (input[i][j] === 'E') {
				end = [i, j];
			}
		}
	}
	return [grid, start, end];
}

function getMinimumScorePoint(nodes: Node[]): Node | undefined {
	if (nodes.length === 0) return undefined;
	let min = nodes[0];
	let idx = 0;
	for (let i = 1; i < nodes.length; i++) {
		if (nodes[i].score <= min.score) {
			min = nodes[i];
			idx = i;
		}
	}
	nodes = nodes.splice(idx, 1);
	return min;
}

function inBounds(grid: string[][], point: Point): boolean {
	return grid[point[0]][point[1]] !== '#';
}

function findPath(grid: string[][], start: Point, end: Point): [number, number] {
	let visited = new Map<string, Node>();
	let queue: Node[] = [new Node(start, undefined, directions[3], 0, 0)];
	let current: Node | undefined;
	let bestPaths: Node[] = [];
	let best: Node | undefined;
	while (queue.length > 0) {
		current = getMinimumScorePoint(queue);
		if (!current) break;
		const key = `${current.point}|${current.direction}`;
		visited.set(key, current);
		if (current.point[0] === end[0] && current.point[1] === end[1]) {
			if (!best) {
				best = current;
				bestPaths.push(current);
			}
			if (best.score >= current.score) {
				best = current;
				bestPaths.push(current);
			}
		}
		for (let dir of validDirections[`${current.direction}`]) {
			const next: Point = [current.point[0] + dir[0], current.point[1] + dir[1]];
			const isSameDirection = current.direction[0] === dir[0] && current.direction[1] === dir[1];
			const nextNode = new Node(
				next,
				current,
				dir,
				isSameDirection ? current.directionChanges : current.directionChanges + 1,
				current.length + 1
			);
			if (inBounds(grid, next) && !visited.has(`${next}|${dir}`)) {
				queue.push(nextNode);
			}
		}
	}

	let unique = new Set<string>();
	for (let node of bestPaths) {
		let current = node;
		while (current.previous) {
			// Uncomment to visualize the path
			// grid[current.point[0]][current.point[1]] = '\x1b[32mO\x1b[0m';
			if (!unique.has(`${current.point}`)) {
				unique.add(`${current.point}`);
			}
			current = current.previous;
		}
	}
	// Add 1 to the uniques so we can include the start point lol
	return [best?.score ?? 0, unique.size + 1];
}

function part1(input: string[]) {
	const [grid, start, end] = setup(input);
	const result = findPath(grid, start, end);
	return result;
}

function part2(input: string[]) {
	const [grid, start, end] = setup(input);
	const result = findPath(grid, start, end);
	return result;
}

const test = Reader.read(16, 'test');
const input = Reader.read(16, 'input');
Benchmark.run(part1, test);
Benchmark.run(part2, test);
