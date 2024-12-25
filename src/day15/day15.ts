import { Benchmark } from '@/util/benchmark';
import { Reader } from '@/util/reader';

type Point = [number, number];
type Direction = '^' | 'v' | '<' | '>';
class Box {
	id: Symbol;
	row: number;
	col: number;
	size: number;
	leftChar: string;
	rightChar: string;
	constructor(pos: Point, size = 1) {
		this.id = Symbol();
		this.size = size;
		this.row = pos[0];
		this.col = pos[1];
		if (size === 1) {
			this.leftChar = this.rightChar = 'O';
		} else {
			this.leftChar = '[';
			this.rightChar = ']';
		}
	}

	get gpsCoordinate() {
		return 100 * this.row + this.col;
	}

	move(direction: Direction) {
		[this.row, this.col] = addDirection([this.row, this.col], direction);
		this.id = Symbol();
	}

	canMove(input: Array<string[]>, direction: Direction) {
		let [nextRow, nextCol] = addDirection([this.row, this.col], direction);
		const headHitsWall = input[nextRow][nextCol] === '#';
		const tailHitsWall = input[nextRow][nextCol + this.size - 1] === '#';
		return !(headHitsWall || tailHitsWall);
	}

	touchesHorizontally(box: Box, direction: Direction) {
		const dir = direction === '<' ? -1 : 1;
		const matchesVertical = this.row === box.row;
		const touchesTail = this.col + dir === box.col + box.size - 1;
		const touchesHead = this.col + dir + this.size - 1 === box.col;
		return matchesVertical && (touchesTail || touchesHead);
	}

	touchesVertically(box: Box, direction: Direction) {
		let dir = direction === '^' ? -1 : 1;
		const matchesVertical = this.row + dir === box.row;
		const touchesTail = this.col <= box.col && this.col + this.size - 1 >= box.col;
		const touchesHead = this.col >= box.col && this.col <= box.col + box.size - 1;
		return matchesVertical && (touchesTail || touchesHead);
	}

	touches(box: Box, direction: Direction) {
		return direction === '^' || direction === 'v'
			? this.touchesVertically(box, direction)
			: this.touchesHorizontally(box, direction);
	}
}

function setup(input: string[], double = false): [Array<string[]>, Direction[], Point, Box[]] {
	let map: Array<string[]> = [];
	let movements: Direction[] = [];
	let start: Point = [0, 0];
	let onMovements = false;
	let boxes: Box[] = [];
	for (let i = 0; i < input.length; i++) {
		if (onMovements) {
			movements.push(...(input[i].split('') as Direction[]));
		} else {
			if (input[i].length === 0) {
				onMovements = true;
				continue;
			}
			let toAdd = [];
			for (let j = 0; j < input[i].length; j++) {
				let char = input[i][j];
				if (char === 'O') {
					if (double) {
						boxes.push(new Box([i, toAdd.length], 2));
						toAdd.push('[');
						toAdd.push(']');
					} else {
						toAdd.push('O');
						boxes.push(new Box([i, toAdd.length - 1]));
					}
				} else if (char === '@') {
					if (double) {
						start = [i, toAdd.length];
						toAdd.push('@');
						toAdd.push('.');
					} else {
						toAdd.push('@');
						start = [i, toAdd.length - 1];
					}
				} else {
					toAdd.push(char);
					if (double) {
						toAdd.push(char);
					}
				}
			}
			map.push(toAdd);
		}
	}
	return [map, movements, start, boxes];
}

function addDirection(pos: Point, dir: 'v' | '^' | '<' | '>'): Point {
	switch (dir) {
		case '^':
			return [pos[0] - 1, pos[1]];
		case 'v':
			return [pos[0] + 1, pos[1]];
		case '<':
			return [pos[0], pos[1] - 1];
		case '>':
			return [pos[0], pos[1] + 1];
	}
}

function BFS(box: Box, boxes: Box[], direction: Direction, map: Array<string[]>) {
	let queue: Box[] = [box];
	let current: Box | undefined;
	let touchingBoxes = [];
	while (queue.length > 0) {
		current = queue.shift();
		if (!current) break;
		if (!current.canMove(map, direction)) {
			touchingBoxes = [];
			break;
		}
		touchingBoxes.push(current);
		for (let i = 0; i < boxes.length; i++) {
			if (current.id === boxes[i].id) continue;
			let touches = current.touches(boxes[i], direction);
			if (touches) {
				queue.push(boxes[i]);
			}
		}
	}
	return touchingBoxes;
}

function push(map: Array<string[]>, current: Point, direction: Direction, boxes: Box[]): Point {
	let next = addDirection(current, direction);
	let nextChar = map[next[0]][next[1]];
	if (nextChar === '#') {
		return current;
	} else if (nextChar === '.') {
		map[next[0]][next[1]] = '@';
		map[current[0]][current[1]] = '.';
		return next;
	}
	let box = boxes.find(
		(box) =>
			(box.row === next[0] && box.col === next[1]) ||
			(box.row === next[0] && box.col + box.size - 1 === next[1])
	);
	if (!box) return next;
	let touchingBoxes = BFS(box, boxes, direction, map);
	if (touchingBoxes.length === 0) {
		return current;
	}
	for (let i = touchingBoxes.length - 1; i >= 0; i--) {
		map[touchingBoxes[i].row][touchingBoxes[i].col] = '.';
		map[touchingBoxes[i].row][touchingBoxes[i].col + touchingBoxes[i].size - 1] = '.';
		touchingBoxes[i].move(direction);
		map[touchingBoxes[i].row][touchingBoxes[i].col] = touchingBoxes[i].leftChar;
		map[touchingBoxes[i].row][touchingBoxes[i].col + touchingBoxes[i].size - 1] =
			touchingBoxes[i].rightChar;
	}
	map[next[0]][next[1]] = '@';
	map[current[0]][current[1]] = '.';
	return next;
}

function part1(input: string[]) {
	let [map, movements, start, boxes] = setup(input);
	for (let movement of movements) {
		start = push(map, start, movement, boxes);
	}
	let sum = 0;
	for (let box of boxes) {
		sum += box.gpsCoordinate;
	}
	return sum;
}

function part2(input: string[]) {
	let [map, movements, start, boxes] = setup(input, true);
	for (let movement of movements) {
		start = push(map, start, movement, boxes);
	}
	let sum = 0;
	for (let box of boxes) {
		sum += box.gpsCoordinate;
	}
	return sum;
}

const test = Reader.read(15, 'test');
const input = Reader.read(15, 'input');
Benchmark.withTitle(15).run(part1, test).run(part2, test);
