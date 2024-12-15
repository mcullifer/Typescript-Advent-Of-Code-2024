import { Benchmark } from '@/util/benchmark';
import { Reader } from '@/util/reader';

type Point = [number, number];
type Direction = '^' | 'v' | '<' | '>';
class Box {
	leftT: Point = [0, 0];
	rightT: Point = [0, 0];
	constructor(public pos: Point) {
		this.leftT = [this.pos[0], this.pos[1] * 2];
		this.rightT = [this.leftT[0], this.leftT[1] + 1];
	}

	get gpsCoordinateT() {
		return 100 * this.leftT[0] + this.leftT[1];
	}

	get gpsCoordinate() {
		return 100 * this.pos[0] + this.pos[1];
	}

	move(direction: Direction) {
		this.pos = addDirection(this.pos, direction);
		this.leftT = addDirection(this.leftT, direction);
		this.rightT = addDirection(this.rightT, direction);
		return this.pos;
	}

	canMove(input: Array<string[]>, direction: Direction) {
		let next = addDirection(this.pos, direction);
		if (input[next[0]][next[1]] === '#') {
			return false;
		}
		return true;
	}

	canMoveTransform(input: Array<string[]>, direction: Direction) {
		let l = addDirection(this.leftT, direction);
		let r = addDirection(this.rightT, direction);
		if (input[l[0]][l[1]] === '#' || input[r[0]][r[1]] === '#') {
			return false;
		}
		return true;
	}

	touchesHorizontally(box: Box, direction: Direction) {
		const isInSameRow = box.leftT[0] === this.leftT[0] && box.rightT[0] === this.rightT[0];
		const dir = direction === '<' ? -1 : 1;
		const isNextTo = this.leftT[1] + dir === box.rightT[1] || this.rightT[1] + dir === box.leftT[1];
		return isInSameRow && isNextTo;
	}
	touchesVertically(box: Box, direction: Direction) {
		let matchesLeft = this.leftT[1] === box.leftT[1] || this.leftT[1] === box.rightT[1];
		let matchesRight = this.rightT[1] === box.leftT[1] || this.rightT[1] === box.rightT[1];
		let dir = direction === '^' ? -1 : 1;
		if (direction === '^') {
			if (matchesLeft) {
				return this.leftT[0] + dir === box.leftT[0] || this.leftT[0] + dir === box.rightT[0];
			} else if (matchesRight) {
				return this.rightT[0] + dir === box.leftT[0] || this.rightT[0] + dir === box.rightT[0];
			}
		} else if (direction === 'v') {
			if (matchesLeft) {
				return this.leftT[0] + dir === box.leftT[0] || this.leftT[0] + dir === box.rightT[0];
			} else if (matchesRight) {
				return this.rightT[0] + dir === box.leftT[0] || this.rightT[0] + dir === box.rightT[0];
			}
			return matchesLeft && this.leftT[0] + 1 === box.leftT[0];
		}
		return false;
	}
}

function setup(input: string[]): [Array<string[]>, Direction[], Point] {
	let map: Array<string[]> = [];
	let movements: Direction[] = [];
	let start: Point = [0, 0];
	let onMovements = false;
	for (let line of input) {
		if (line.length === 0) {
			onMovements = true;
		}
		if (onMovements) {
			movements.push(...(line.split('') as Direction[]));
		} else {
			let split = line.split('');
			let startCol = split.indexOf('@');
			map.push(line.split(''));
			if (startCol !== -1) {
				start = [map.length - 1, startCol];
			}
		}
	}
	return [map, movements, start];
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

function push(map: Array<string[]>, current: Point, direction: Direction) {
	let stack: Point[] = [current];
	let pointer = current;
	let hitWall = false;
	while (map[pointer[0]][pointer[1]] !== '#' && map[pointer[0]][pointer[1]] !== '.') {
		let next = addDirection(pointer, direction);
		let nextChar = map[next[0]][next[1]];
		if (nextChar === '#') {
			hitWall = true;
			break;
		} else if (nextChar === '.') {
			stack.push(next);
			break;
		} else if (nextChar === 'O') {
			stack.push(next);
		}
		pointer = next;
	}
	if (hitWall) {
		return current;
	}
	for (let i = stack.length - 1; i >= 0; i--) {
		let point = stack[i];
		if (i > 0) {
			let next = stack[i - 1];
			map[point[0]][point[1]] = map[next[0]][next[1]];
		} else {
			map[point[0]][point[1]] = '.';
		}
	}
	return addDirection(current, direction);
}

function BFS(box: Box, boxes: Box[], direction: Direction) {
	let q: Box[] = [box];
	let c: Box | undefined;
	let touchingBoxes = [];
	let visited = new Set<string>();
	const vertical = direction === '^' || direction === 'v';
	while (q.length > 0) {
		c = q.shift();
		if (!c) break;
		visited.add(c.leftT.toString());
		let touches = boxes.filter((b) => {
			if (vertical) {
				return c?.touchesVertically(b, direction);
			} else {
				return c?.touchesHorizontally(b, direction);
			}
		});
		touchingBoxes.push(c);
		for (let touching of touches) {
			if (!visited.has(touching.leftT.toString())) {
				q.push(touching);
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
			(box.leftT[0] === next[0] && box.leftT[1] === next[1]) ||
			(box.rightT[0] === next[0] && box.rightT[1] === next[1])
	);
	if (!box) {
		return current;
	}
	let touchingBoxes = BFS(box, boxes, direction);
	let canMove = [];
	for (let touching of touchingBoxes) {
		if (touching.canMoveTransform(map, direction)) {
			canMove.push(touching);
		}
	}
	if (canMove.length !== touchingBoxes.length) {
		return current;
	}
	for (let i = touchingBoxes.length - 1; i >= 0; i--) {
		let touching = touchingBoxes[i];
		map[touching.leftT[0]][touching.leftT[1]] = '.';
		map[touching.rightT[0]][touching.rightT[1]] = '.';
		touching.move(direction);
		map[touching.leftT[0]][touching.leftT[1]] = '[';
		map[touching.rightT[0]][touching.rightT[1]] = ']';
	}
	map[next[0]][next[1]] = '@';
	map[current[0]][current[1]] = '.';
	return next;
}

function gpsCoordinate(pos: Point) {
	return 100 * pos[0] + pos[1];
}

function printMap(map: Array<string[]>) {
	for (let line of map) {
		console.log(line.join(''));
	}
}

function part1(input: string[]) {
	let [map, movements, start] = setup(input);
	let pos = start;
	for (let movement of movements) {
		pos = push(map, pos, movement);
	}
	let sum = 0;
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[i].length; j++) {
			if (map[i][j] === 'O') {
				sum += gpsCoordinate([i, j]);
			}
		}
	}
	return sum;
}

function part2(input: string[]) {
	let [map, movements, start] = setup(input);
	let newMap: Array<string[]> = [];
	let boxes: Box[] = [];
	for (let i = 0; i < map.length; i++) {
		newMap.push([]);
		for (let j = 0; j < map[i].length; j++) {
			let char = map[i][j];
			if (char === '#') {
				newMap[i].push(...['#', '#']);
			} else if (char === 'O') {
				newMap[i].push(...['[', ']']);
				boxes.push(new Box([i, j]));
			} else if (char === '.') {
				newMap[i].push(...['.', '.']);
			} else if (char === '@') {
				newMap[i].push(...['@', '.']);
			}
		}
	}
	let newStart = newMap[start[0]].findIndex((char) => char === '@');
	let pos: Point = [start[0], newStart];
	for (let movement of movements) {
		pos = push2(newMap, pos, movement, boxes);
	}
	let sum = 0;
	for (let box of boxes) {
		sum += box.gpsCoordinateT;
	}

	return sum;
}

const test = Reader.read(15, 'test');
const input = Reader.read(15, 'input');
Benchmark.run(part1, test);
Benchmark.run(part2, test);
