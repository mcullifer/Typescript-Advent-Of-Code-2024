import { Benchmark } from '@/util/benchmark';
import { Reader } from '@/util/reader';

const test = Reader.read(4, 'test');
const input = Reader.read(4, 'input');

const directions = [
	[-1, 0], // UP
	[1, 0], // DOWN
	[0, -1], // LEFT
	[0, 1], // RIGHT
	[-1, -1], // UP LEFT
	[-1, 1], // UP RIGHT
	[1, -1], // DOWN LEFT
	[1, 1] // DOWN RIGHT
];

function walkInDirection(input: string[], x: number, y: number, direction: number[], pointer = 0) {
	const word = 'XMAS';
	let [dy, dx] = direction;

	const inRange = (x: number, y: number) =>
		x >= 0 && x < input[0].length && y >= 0 && y < input.length;

	while (inRange(x, y) && word[pointer] === input[y][x]) {
		if (pointer === word.length - 1) {
			return 1;
		}
		x += dx;
		y += dy;
		return walkInDirection(input, x, y, direction, pointer + 1);
	}
	return 0;
}

function part1(input: string[]) {
	let count = 0;

	for (let y = 0; y < input.length; y++) {
		for (let x = 0; x < input[y].length; x++) {
			for (let direction of directions) {
				count += walkInDirection(input, x, y, direction);
			}
		}
	}
	return count;
}

function isXmas(input: string[], x: number, y: number) {
	let [upLeft, upRight, downLeft, downRight] = directions.slice(4);
	let ALetter = input[y][x];
	let upLeftChar = input[y + upLeft[0]]?.[x + upLeft[1]];
	let upRightChar = input[y + upRight[0]]?.[x + upRight[1]];
	let downLeftChar = input[y + downLeft[0]]?.[x + downLeft[1]];
	let downRightChar = input[y + downRight[0]]?.[x + downRight[1]];
	let diag1 = [upLeftChar, ALetter, downRightChar].join('');
	let diag2 = [upRightChar, ALetter, downLeftChar].join('');
	const isValid = (check: string) => check === 'MAS' || check === 'SAM';
	if (isValid(diag1) && isValid(diag2)) {
		return 1;
	}
	return 0;
}

function part2(input: string[]) {
	let count = 0;

	for (let y = 0; y < input.length; y++) {
		for (let x = 0; x < input[y].length; x++) {
			if (input[y][x] === 'A') {
				count += isXmas(input, x, y);
			}
		}
	}
	return count;
}
// RIP 💀
Benchmark.run(part1, test);
Benchmark.run(part2, test);
