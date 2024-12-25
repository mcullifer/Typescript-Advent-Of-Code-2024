import { Benchmark } from '@/util/benchmark';
import { Reader } from '@/util/reader';

const rowInBounds = (row: number, source: string[]) => row >= 0 && row < source.length;
const colInBounds = (col: number, source: string[]) => col >= 0 && col < source[0].length;
const direction = [
	[-1, 0], // UP
	[0, 1], // RIGHT
	[1, 0], // DOWN
	[0, -1] // LEFT
];

function setCharAt(str: string, index: number, chr: string) {
	if (index > str.length - 1) return str;
	return str.substring(0, index) + chr + str.substring(index + 1);
}

function isCycle(input: string[], start: [number, number], currentDirection = 0) {
	const visited = new Set<string>();
	const queue: [number, number][] = [start];
	let pos: [number, number] | undefined;
	while ((pos = queue.pop())) {
		const [row, col] = pos;
		if (visited.has(`${row},${col},${currentDirection}`)) {
			return true;
		}
		visited.add(`${row},${col},${currentDirection}`);
		let nextRow = row + direction[currentDirection][0];
		let nextCol = col + direction[currentDirection][1];
		if (rowInBounds(nextRow, input) && colInBounds(nextCol, input)) {
			while (input[nextRow][nextCol] === '#') {
				currentDirection = (currentDirection + 1) % direction.length;
				nextRow = row + direction[currentDirection][0];
				nextCol = col + direction[currentDirection][1];
			}
			nextRow = row + direction[currentDirection][0];
			nextCol = col + direction[currentDirection][1];
			if (rowInBounds(nextRow, input) && colInBounds(nextCol, input)) {
				queue.push([nextRow, nextCol]);
			}
		}
	}
	return false;
}

function DFS(input: string[], start: [number, number], currentDirection = 0) {
	const visited = new Set<string>();
	let cycles = new Set<string>();
	const queue: [number, number][] = [start];
	let pos: [number, number] | undefined;
	let loops = 0;
	while ((pos = queue.pop())) {
		const [row, col] = pos;
		visited.add(`${row},${col}`);
		if (visited.has(`${row},${col}`)) {
			let temp = input[row];
			let testInput = setCharAt(input[row], col, '#');
			input[row] = testInput;
			let res = isCycle(input, start);
			if (res) {
				loops++;
				cycles.add(`${row},${col}`);
			}
			input[row] = temp;
		}
		let nextRow = row + direction[currentDirection][0];
		let nextCol = col + direction[currentDirection][1];
		if (rowInBounds(nextRow, input) && colInBounds(nextCol, input)) {
			while (input[nextRow][nextCol] === '#') {
				currentDirection = (currentDirection + 1) % direction.length;
				nextRow = row + direction[currentDirection][0];
				nextCol = col + direction[currentDirection][1];
			}
			nextRow = row + direction[currentDirection][0];
			nextCol = col + direction[currentDirection][1];
			if (rowInBounds(nextRow, input) && colInBounds(nextCol, input)) {
				queue.push([nextRow, nextCol]);
			}
		}
	}
	return [visited.size, cycles.size];
}

function findStartPosition(input: string[]): [number, number] {
	for (let row = 0; row < input.length; row++) {
		for (let col = 0; col < input[row].length; col++) {
			if (input[row][col] === '^') {
				return [row, col];
			}
		}
	}
	return [0, 0];
}

function part1And2(input: string[]) {
	const start = findStartPosition(input);
	return DFS(input, start);
}

const test = Reader.read(6, 'test');
const input = Reader.read(6, 'input');
Benchmark.withTitle(6).run(part1And2, test);
