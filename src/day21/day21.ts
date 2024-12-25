import { Benchmark } from '@/util/benchmark';
import { Reader } from '@/util/reader';

type Point = [number, number];
type Node = {
	pos: Point;
	visited: Set<string>;
	path: string[];
	dir?: string;
	dist: number;
	end: string;
};
type Keybind = {
	for: string;
	pos: Point;
	combo: string; // Must end in A
};
const dirMap: Record<string, string> = {
	'-1,0': '^',
	'1,0': 'v',
	'0,-1': '<',
	'0,1': '>'
};
const dirMapReverse: Record<string, Point> = {
	'^': [-1, 0],
	v: [1, 0],
	'<': [0, -1],
	'>': [0, 1]
};
const dirs: Point[] = [
	[-1, 0],
	[1, 0],
	[0, -1],
	[0, 1]
];
const keypad = [
	['7', '8', '9'],
	['4', '5', '6'],
	['1', '2', '3'],
	['#', '0', 'A']
];
const arrows = [
	['#', '^', 'A'],
	['<', 'v', '>']
];
const keypadStart: Point = [3, 2];
const arrowStart: Point = [0, 2];

function inBounds(grid: string[][], point: Point) {
	return (
		point[0] >= 0 &&
		point[0] < grid.length &&
		point[1] >= 0 &&
		point[1] < grid[0].length &&
		grid[point[0]][point[1]] !== '#'
	);
}

function boogie(grid: string[][], start: Point, end: string) {
	let queue: Keybind[] = [{ for: end, pos: start, combo: '' }];
	let visited = new Set<string>();
	let potentialKeybinds: Keybind[] = [];
	while (queue.length > 0) {
		let current = queue.shift();
		if (!current) break;
		visited.add(current.pos.toString());
		if (grid[current.pos[0]][current.pos[1]] === end) {
			current.combo += 'A';
			potentialKeybinds.push(current);
			continue;
		}
		for (let dir of dirs) {
			let next: Point = [current.pos[0] + dir[0], current.pos[1] + dir[1]];
			if (inBounds(grid, next) && !visited.has(next.toString())) {
				queue.push({
					for: current.for,
					pos: next,
					combo: current.combo.concat(dirMap[dir.toString()])
				});
			}
		}
	}
	potentialKeybinds = potentialKeybinds.sort((a, b) => a.combo.length - b.combo.length);
	potentialKeybinds.filter((k) => k.combo.length === potentialKeybinds[0].combo.length);
	return potentialKeybinds;
}

function BFS(grid: string[][], start: Point, end: string, first = false) {
	let queue: Node[] = [{ pos: start, visited: new Set<string>(), path: [], dist: 0, end: end }];
	let best: Node | undefined;
	while (queue.length > 0) {
		let current = queue.shift();
		if (!current) break;
		current.visited.add(current.pos.toString());
		if (grid[current.pos[0]][current.pos[1]] === end) {
			if (best === undefined || current.dist < best.dist) {
				current.path.push('A');
				best = current;
			}
			continue;
		}
		for (let dir of dirs) {
			let next: Point = [current.pos[0] + dir[0], current.pos[1] + dir[1]];
			let directionCharacter = dirMap[dir.toString()];
			if (inBounds(grid, next) && !current.visited.has(next.toString())) {
				let nextVisited = new Set([...current.visited]);
				queue.push({
					pos: next,
					visited: nextVisited,
					dir: directionCharacter,
					path: [...current.path, directionCharacter],
					dist: current.dist + 1,
					end: current.end
				});
			}
		}
	}
	return best;
}

function getInputs(numInput: Node[]) {
	let results: Node[] = [];
	let start = arrowStart;
	for (let res of numInput) {
		for (let pathDir of res.path) {
			let result = BFS(arrows, start, pathDir);
			if (!result) return [];
			results.push(result);
			start = result.pos;
		}
	}
	return results;
}

function robo(keybind: Keybind, maxDepth = 2) {
	let start = arrowStart;
	for (let char of keybind.combo) {
		let potentialKeybinds = boogie(keypad, start, char);
	}
}

function part1(input: string[]) {
	let sum = 0;
	for (let code of input) {
		let start = keypadStart;
		let final = '';
		for (let char of code) {
			let keybinds = boogie(keypad, start, char);
			start = keybinds[0].pos;
			for (let potentialKeybind of keybinds) {
				robo(potentialKeybind);
			}
		}
		if (code === '029A') {
			console.log(final);
		}
		sum += final.length * parseInt(code.replace('A', ''));
		console.log('-----------------');
	}
	return sum;
}

function part2(input: string[]) {}

// 188892 is too high
const test = Reader.read(21, 'test');
const input = Reader.read(21, 'input');
Benchmark.withTitle(21).run(part1, test).run(part2, test);
// <vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A
// v<<A>>^A<A>AvA<^AA>A<vAAA>^A
// <A^A>^^AvvvA
// 029A
