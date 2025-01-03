import { Benchmark } from '@/util/benchmark';
import { Reader } from '@/util/reader';

type Point = [number, number];
type Grid = string[][];
type State = {
	pos: Point;
	canCheatAt: [Point, Point][]; // [from, to] basically where you are before cheating then after
	steps: number;
	visited: Set<string>;
};
const directions: Point[] = [
	[-1, 0],
	[1, 0],
	[0, -1],
	[0, 1]
];

function setup(input: string[]): [Grid, Point, Point] {
	let grid: Grid = [];
	let start: Point = [0, 0];
	let end: Point = [0, 0];
	for (let line of input) {
		grid.push(line.split(''));
		let S = line.indexOf('S');
		let E = line.indexOf('E');
		if (S !== -1) {
			start = [grid.length - 1, S];
		}
		if (E !== -1) {
			end = [grid.length - 1, E];
		}
	}
	return [grid, start, end];
}

function getNext(current: Point, direction: Point): Point {
	return [current[0] + direction[0], current[1] + direction[1]];
}

function inBounds(grid: Grid, point: Point): boolean {
	const inGrid =
		point[0] >= 0 && point[0] < grid.length && point[1] >= 0 && point[1] < grid[0].length;
	if (!inGrid) return false;
	const notWall = grid[point[0]][point[1]] !== '#';
	return inGrid && notWall;
}

function DFS(grid: Grid, start: Point, end: Point) {
	let queue: State[] = [{ pos: start, steps: 0, canCheatAt: [], visited: new Set() }];
	while (queue.length > 0) {
		let current = queue.pop();
		if (current === undefined) break;
		if (current.pos[0] === end[0] && current.pos[1] === end[1]) {
			current.visited.add(current.pos.toString());
			return current;
		}
		for (let direction of directions) {
			let next: State = {
				pos: getNext(current.pos, direction),
				canCheatAt: current.canCheatAt,
				steps: current.steps + 1,
				visited: current.visited
			};
			if (inBounds(grid, next.pos) && !next.visited.has(next.pos.toString())) {
				next.visited.add(current.pos.toString());
				queue.push(next);
			} else if (grid[next.pos[0]][next.pos[1]] === '#') {
				let nextCheat = getNext(next.pos, direction);
				if (inBounds(grid, nextCheat) && !next.visited.has(nextCheat.toString())) {
					next.canCheatAt.push([current.pos, nextCheat]);
				}
			}
		}
	}
	return null;
}

function getStepsSaved(state: State) {
	let visited = Array.from(state.visited.values());
	let stepsSaved = new Map<number, number>();
	for (let [from, to] of state.canCheatAt) {
		let distance = Math.abs(from[0] - to[0]) + Math.abs(from[1] - to[1]);
		if (distance <= 2) {
			let fromIndex = visited.indexOf(from.toString());
			let toIndex = visited.indexOf(to.toString());
			if (fromIndex === -1 || toIndex === -1) continue;
			let saved = toIndex - fromIndex - distance;
			if (stepsSaved.has(saved)) {
				stepsSaved.set(saved, stepsSaved.get(saved)! + 1);
			} else {
				stepsSaved.set(saved, 1);
			}
		}
	}
	return stepsSaved;
}

function part1(input: string[]) {
	const [grid, start, end] = setup(input);
	const result = DFS(grid, start, end);
	if (result === null) {
		console.log('No path found');
		return;
	}
	let stepsSaved = getStepsSaved(result);
	let atLeast100 = Array.from(stepsSaved.keys()).filter((x) => x >= 100);
	let total = atLeast100.reduce((acc, x) => acc + stepsSaved.get(x)!, 0);
	return total;
}

// This is incorrect
function part2(input: string[]) {
	const [grid, start, end] = setup(input);
	const result = DFS(grid, start, end);
	if (result === null) {
		console.log('No path found');
		return;
	}
	let stepsSaved = getStepsSaved(result);
	// I think I need to get the manhattan distance of each point on the valid path
	// from each other as long as they're less than 20?
	let atLeast100 = Array.from(stepsSaved.keys()).filter((x) => x >= 100);
	let total = atLeast100.reduce((acc, x) => acc + stepsSaved.get(x)!, 0);
	return total;
}

const test = Reader.read(20, 'test');
const input = Reader.read(20, 'input');
Benchmark.withTitle(20).run(part1, test).run(part2, test);
