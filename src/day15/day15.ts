import { Benchmark } from '@/util/benchmark';
import { Reader } from '@/util/reader';

type Point = [number, number];
type Direction = '^' | 'v' | '<' | '>';
class Box {
	left: Point;
	right: Point;
	leftChar: string;
	rightChar: string;
	constructor(left: Point, right?: Point) {
		if (right !== undefined) {
			this.left = left;
			this.right = right;
			this.leftChar = '[';
			this.rightChar = ']';
		} else {
			this.left = this.right = left;
			this.leftChar = this.rightChar = 'O';
		}
	}

	get gpsCoordinate() {
		return 100 * this.left[0] + this.left[1];
	}

	move(direction: Direction) {
		this.left = addDirection(this.left, direction);
		this.right = addDirection(this.right, direction);
	}

	canMove(input: Array<string[]>, direction: Direction) {
		let nextLeft = addDirection(this.left, direction);
		let nextRight = addDirection(this.right, direction);
		if (input[nextLeft[0]][nextLeft[1]] === '#' || input[nextRight[0]][nextRight[1]] === '#') {
			return false;
		}
		return true;
	}

	touchesHorizontally(box: Box, direction: Direction) {
		const isInSameRow = box.left[0] === this.left[0] && box.right[0] === this.right[0];
		const dir = direction === '<' ? -1 : 1;
		const isNextTo = this.left[1] + dir === box.right[1] || this.right[1] + dir === box.left[1];
		return isInSameRow && isNextTo;
	}

	touchesVertically(box: Box, direction: Direction) {
		let dir = direction === '^' ? -1 : 1;
		let matchesLeftVertically =
			this.left[0] + dir === box.left[0] || this.left[0] + dir === box.right[0];
		let matchesRightVertically =
			this.right[0] + dir === box.left[0] || this.right[0] + dir === box.right[0];
		let touchesLeftHorizontally = this.left[1] === box.left[1] || this.left[1] === box.right[1];
		let touchesRightHorizontally = this.right[1] === box.left[1] || this.right[1] === box.right[1];
		return (
			(matchesLeftVertically || matchesRightVertically) &&
			(touchesLeftHorizontally || touchesRightHorizontally)
		);
	}
}

function setup(input: string[], double = false): [Array<string[]>, Direction[], Point, Box[]] {
	let map: Array<string[]> = [];
	let movements: Direction[] = [];
	let start: Point = [0, 0];
	let onMovements = false;
	let boxes: Box[] = [];
	for (let i = 0; i < input.length; i++) {
		if (input[i].length === 0) {
			onMovements = true;
		}
		if (onMovements) {
			movements.push(...(input[i].split('') as Direction[]));
		} else {
			let toAdd = [];
			for (let j = 0; j < input[i].length; j++) {
				let char = input[i][j];
				if (char === 'O') {
					if (double) {
						boxes.push(new Box([i, toAdd.length], [i, toAdd.length + 1]));
						toAdd.push('[');
						toAdd.push(']');
					} else {
						toAdd.push('O');
						boxes.push(new Box([i, j]));
					}
				} else if (char === '@') {
					if (double) {
						start = [i, toAdd.length];
						toAdd.push('@');
						toAdd.push('.');
					} else {
						toAdd.push('@');
						start = [i, j];
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

function DFS(box: Box, boxes: Box[], direction: Direction) {
	let queue: Box[] = [box];
	let current: Box | undefined;
	let touchingBoxes = [];
	let visited = new Set<string>();
	const vertical = direction === '^' || direction === 'v';
	while (queue.length > 0) {
		current = queue.pop();
		if (!current) break;
		visited.add(current.left.toString());
		touchingBoxes.push(current);
		for (let i = 0; i < boxes.length; i++) {
			if (
				vertical &&
				current.touchesVertically(boxes[i], direction) &&
				!visited.has(boxes[i].left.toString())
			) {
				queue.push(boxes[i]);
			} else if (
				!vertical &&
				current.touchesHorizontally(boxes[i], direction) &&
				!visited.has(boxes[i].left.toString())
			) {
				queue.push(boxes[i]);
			}
		}
	}
	return touchingBoxes;
}

function push2(map: Array<string[]>, current: Point, direction: Direction, boxes: Box[]): Point {
	let next = addDirection(current, direction);
	let nextChar = map[next[0]][next[1]];
	if (nextChar === '#') {
		return current;
	}
	if (nextChar === '.') {
		map[next[0]][next[1]] = '@';
		map[current[0]][current[1]] = '.';
		return next;
	}
	let box = boxes.find(
		(box) =>
			(box.left[0] === next[0] && box.left[1] === next[1]) ||
			(box.right[0] === next[0] && box.right[1] === next[1])
	);
	if (!box) {
		return next;
	}
	let touchingBoxes = DFS(box, boxes, direction);
	let canMove = 0;
	for (let i = 0; i < touchingBoxes.length; i++) {
		if (touchingBoxes[i].canMove(map, direction)) {
			canMove++;
		}
	}
	if (canMove !== touchingBoxes.length) {
		return current;
	}
	for (let i = touchingBoxes.length - 1; i >= 0; i--) {
		map[touchingBoxes[i].left[0]][touchingBoxes[i].left[1]] = '.';
		map[touchingBoxes[i].right[0]][touchingBoxes[i].right[1]] = '.';
		touchingBoxes[i].move(direction);
		map[touchingBoxes[i].left[0]][touchingBoxes[i].left[1]] = touchingBoxes[i].leftChar;
		map[touchingBoxes[i].right[0]][touchingBoxes[i].right[1]] = touchingBoxes[i].rightChar;
	}
	map[next[0]][next[1]] = '@';
	map[current[0]][current[1]] = '.';
	return next;
}

function part1(input: string[]) {
	let [map, movements, start, boxes] = setup(input);
	let pos = start;
	for (let movement of movements) {
		pos = push2(map, pos, movement, boxes);
	}
	let sum = 0;
	for (let box of boxes) {
		sum += box.gpsCoordinate;
	}
	return sum;
}

function part2(input: string[]) {
	let [map, movements, start, boxes] = setup(input, true);
	let pos = start;
	for (let movement of movements) {
		pos = push2(map, pos, movement, boxes);
	}
	let sum = 0;
	for (let box of boxes) {
		sum += box.gpsCoordinate;
	}

	return sum;
}

const test = Reader.read(15, 'test');
const input = Reader.read(15, 'input');
Benchmark.run(part1, test);
Benchmark.run(part2, test);
