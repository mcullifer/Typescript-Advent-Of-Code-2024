import { Benchmark } from '@/util/benchmark';
import { Reader } from '@/util/reader';

const test = Reader.read(12, 'test');
const input = Reader.read(12, 'input');

type Point = [number, number];

const directions = [
	[-1, 0],
	[1, 0],
	[0, -1],
	[0, 1]
];

function inBounds(point: Point, maxRow: number, maxCol: number) {
	return point[0] >= 0 && point[0] < maxRow && point[1] >= 0 && point[1] < maxCol;
}

function BFS(visited: Set<string>, input: string[], start: Point = [0, 0]): [Set<string>, number] {
	let region = new Set<string>();
	let queue: Point[] = [start];
	let current: Point | undefined;
	let cornerCount = 0;
	while ((current = queue.shift())) {
		if (region.has(current.toString())) continue;
		visited.add(current.toString());
		region.add(current.toString());
		const [row, col] = current;
		let cornersAdded = 4;
		for (let direction of directions) {
			let next: Point = [row + direction[0], col + direction[1]];
			if (
				inBounds(next, input.length, input[0].length) &&
				!region.has(next.toString()) &&
				input[next[0]][next[1]] === input[row][col]
			) {
				queue.push(next);
				cornersAdded -= 2;
			}
		}
		cornerCount += cornersAdded;
	}
	return [region, cornerCount];
}

function part1(input: string[]) {
	let visited = new Set<string>();
	let cost = 0;
	for (let i = 0; i < input.length; i++) {
		for (let j = 0; j < input.length; j++) {
			if (visited.has([i, j].toString())) continue;
			let [region, cornerCount] = BFS(visited, input, [i, j]);
			cost += cornerCount * region.size;
		}
	}
	return cost;
}

function part2(input: string[]) {
	let visited = new Set<string>();
	let cost = 0;
	for (let i = 0; i < input.length; i++) {
		for (let j = 0; j < input.length; j++) {
			if (visited.has([i, j].toString())) continue;
			let [region, _] = BFS(visited, input, [i, j]);
			let sides = 0;
			for (let point of region) {
				let [row, col] = point.split(',').map(Number);
				let up = [row - 1, col].toString();
				let down = [row + 1, col].toString();
				let left = [row, col - 1].toString();
				let right = [row, col + 1].toString();
				if (!region.has(up) && !region.has(left)) {
					sides += 1;
				}
				if (!region.has(up) && !region.has(right)) {
					sides += 1;
				}
				if (!region.has(down) && !region.has(right)) {
					sides += 1;
				}
				if (!region.has(down) && !region.has(left)) {
					sides += 1;
				}
				if (region.has(up) && region.has(right) && !region.has([row - 1, col + 1].toString())) {
					sides += 1;
				}
				if (region.has(up) && region.has(left) && !region.has([row - 1, col - 1].toString())) {
					sides += 1;
				}
				if (region.has(down) && region.has(right) && !region.has([row + 1, col + 1].toString())) {
					sides += 1;
				}
				if (region.has(down) && region.has(left) && !region.has([row + 1, col - 1].toString())) {
					sides += 1;
				}
			}
			cost += sides * region.size;
		}
	}
	return cost;
}

Benchmark.run(part1, test);
console.log('---------------------');
Benchmark.run(part2, test);
