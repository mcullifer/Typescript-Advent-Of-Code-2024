import { Benchmark } from '@/util/benchmark';
import { Reader } from '@/util/reader';

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

function getPosition(robot: Robot, iterations: number, colMax: number, rowMax: number) {
	let nextX = (robot.pos[0] + ((robot.velocity[0] * iterations) % colMax) + colMax) % colMax;
	let nextY = (robot.pos[1] + ((robot.velocity[1] * iterations) % rowMax) + rowMax) % rowMax;
	return [nextX, nextY] as Point;
}

function part1(input: string[]) {
	let robots = setup(input);
	const cols = 101;
	const rows = 103;
	const middleRow = Math.floor(rows / 2);
	const middleCol = Math.floor(cols / 2);
	const seconds = 100;
	let quad1, quad2, quad3, quad4;
	quad1 = quad2 = quad3 = quad4 = 0;
	for (let robot of robots) {
		robot.pos = getPosition(robot, seconds, cols, rows);
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
	const maxSeconds = 100000;
	const cols = 101;
	const rows = 103;
	const uniques = new Set<string>();
	let allUniqueAt = -1;
	let elapsed = 0;
	while (allUniqueAt === -1 && elapsed < maxSeconds) {
		uniques.clear();
		elapsed++;
		for (let robot of robots) {
			robot.pos = getPosition(robot, 1, cols, rows);
			uniques.add(robot.pos.toString());
		}
		if (uniques.size === robots.length) {
			allUniqueAt = elapsed;
		}
	}
	return elapsed;
}

const test = Reader.read(14, 'test');
const input = Reader.read(14, 'input');
Benchmark.withTitle(14).run(part1, test).run(part2, test);
