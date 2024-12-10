import { Benchmark } from '@/util/benchmark';
import { Reader } from '@/util/reader';

const test = Reader.read(10, 'test');
const input = Reader.read(10, 'input');

type Point = [number, number];

const directions: Point[] = [
	[-1, 0], // UP
	[1, 0], // DOWN
	[0, -1], // LEFT
	[0, 1] // RIGHT
];

function inBounds(point: Point, grid: string[][]): boolean {
	const [row, col] = point;
	return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
}

function next(current: Point, dir: Point): Point {
	return [current[0] + dir[0], current[1] + dir[1]];
}

function isValid(current: Point, next: Point, grid: string[][]): boolean {
	const currentVal = parseInt(grid[current[0]][current[1]]);
	const nextVal = parseInt(grid[next[0]][next[1]]);
	if (isNaN(currentVal) || isNaN(nextVal)) {
		return false;
	}
	return nextVal - currentVal === 1;
}

function DFS(grid: string[][], countDistinct = false): number {
	let trailCounts = 0;
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[0].length; j++) {
			if (grid[i][j] !== '0') {
				continue;
			}
			let trailHeads = new Set<string>();
			let queue: Point[] = [[i, j]];
			let current: Point | undefined;
			let nextPoint: Point;
			while ((current = queue.pop())) {
				if (grid[current[0]][current[1]] === '9') {
					trailHeads.add(current.toString());
					if (countDistinct) {
						trailCounts++;
					}
					continue;
				}
				for (let direction of directions) {
					nextPoint = next(current, direction);
					if (inBounds(nextPoint, grid) && isValid(current, nextPoint, grid)) {
						queue.push(nextPoint);
					}
				}
			}
			if (!countDistinct) {
				trailCounts += trailHeads.size;
			}
		}
	}
	return trailCounts;
}

function part1(input: string[]) {
	const grid = input.map((x) => x.split(''));
	const trails = DFS(grid);
	return trails;
}

function part2(input: string[]) {
	const grid = input.map((x) => x.split(''));
	const trails = DFS(grid, true);
	return trails;
}

Benchmark.run(part1, test);
console.log('---------------------');
Benchmark.run(part2, test);
