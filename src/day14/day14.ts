import { Benchmark } from '@/util/benchmark';
import { Reader } from '@/util/reader';

const test = Reader.read(14, 'test');
const input = Reader.read(14, 'input');

type Point = [number, number];

type Robot = {
	pos: Point;
	velocity: Point;
};

function setup(input: string[]) {
	let robots: Robot[] = [];
	for (let line of input) {
		let [positionPart, velocityPart] = line.split(' ');
		let start = positionPart.slice(2).split(',').map(Number);
		let velocity = velocityPart.slice(2).split(',').map(Number);
		robots.push({
			pos: [start[0], start[1]],
			velocity: [velocity[0], velocity[1]]
		});
	}
	return robots;
}

function getNext(robot: Robot, colMax: number, rowMax: number) {
	let nextX = (robot.pos[0] + (robot.velocity[0] % colMax) + colMax) % colMax;
	let nextY = (robot.pos[1] + (robot.velocity[1] % rowMax) + rowMax) % rowMax;
	return [nextX, nextY] as Point;
}

function part1(input: string[]) {
	let robots = setup(input);
	const cols = 101;
	const rows = 103;
	const middleRow = Math.floor(rows / 2);
	const middleCol = Math.floor(cols / 2);
	const seconds = 100;
	for (let second = 0; second < seconds; second++) {
		for (let robot of robots) {
			let nextPos = getNext(robot, cols, rows);
			robot.pos = nextPos;
		}
	}
	let quad1 = 0;
	let quad2 = 0;
	let quad3 = 0;
	let quad4 = 0;
	for (let robot of robots) {
		if (robot.pos[0] === middleCol || robot.pos[1] === middleRow) continue;
		if (robot.pos[0] < middleCol && robot.pos[1] < middleRow) {
			quad1++;
		} else if (robot.pos[0] > middleCol && robot.pos[1] < middleRow) {
			quad2++;
		} else if (robot.pos[0] < middleCol && robot.pos[1] > middleRow) {
			quad3++;
		} else if (robot.pos[0] > middleCol && robot.pos[1] > middleRow) {
			quad4++;
		}
	}
	return quad1 * quad2 * quad3 * quad4;
}

function part2(input: string[]) {
	const robots = setup(input);
	const cols = 101;
	const rows = 103;
	const uniques = new Set<string>();
	let allUniqueAt = -1;
	let elapsed = 0;
	while (allUniqueAt === -1) {
		uniques.clear();
		for (let robot of robots) {
			let nextPos = getNext(robot, cols, rows);
			robot.pos = nextPos;
			uniques.add(robot.pos.toString());
		}
		if (uniques.size === robots.length) {
			allUniqueAt = elapsed;
		}
		elapsed++;
	}
	return elapsed;
}

Benchmark.run(part1, test);
console.log('---------------------');
Benchmark.run(part2, test);