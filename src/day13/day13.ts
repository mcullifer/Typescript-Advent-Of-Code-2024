import { Benchmark } from '@/util/benchmark';
import { Reader } from '@/util/reader';

const test = Reader.read(13, 'test');
const input = Reader.read(13, 'input');

type ClawGame = {
	buttonA: [number, number];
	buttonB: [number, number];
	prize: [number, number];
};

function setup(input: string[]) {
	let groups = [];
	for (let i = 0; i < input.length; i += 4) {
		let buttonA = input[i]
			.split(': ')[1]
			.split(', ')
			.map((x) => parseInt(x.split('+')[1]));
		let buttonB = input[i + 1]
			.split(': ')[1]
			.split(', ')
			.map((x) => parseInt(x.split('+')[1]));
		let prize = input[i + 2]
			.split(': ')[1]
			.split(', ')
			.map((x) => parseInt(x.split('=')[1]));
		let game: ClawGame = {
			buttonA: [buttonA[0], buttonA[1]],
			buttonB: [buttonB[0], buttonB[1]],
			prize: [prize[0], prize[1]]
		};
		groups.push(game);
	}
	return groups;
}

function part1(input: string[]) {
	const games = setup(input);
	let sum = 0;
	for (let game of games) {
		const [a1, a2] = game.buttonA;
		const [b1, b2] = game.buttonB;
		const [prizeX, prizeY] = game.prize;

		const x = (prizeX * b2 - prizeY * b1) / (a1 * b2 - a2 * b1);
		const y = (prizeY * a1 - prizeX * a2) / (a1 * b2 - a2 * b1);

		const bothAreIntegers = Number.isInteger(x) && Number.isInteger(y);

		if (bothAreIntegers) {
			sum += x * 3 + y;
		}
	}
	return sum;
}

function part2(input: string[]) {
	const games = setup(input);
	let sum = 0;
	for (let game of games) {
		const [a1, a2] = game.buttonA;
		const [b1, b2] = game.buttonB;
		let [prizeX, prizeY] = game.prize;

		prizeX += 10000000000000;
		prizeY += 10000000000000;

		const x = (prizeX * b2 - prizeY * b1) / (a1 * b2 - a2 * b1);
		const y = (prizeY * a1 - prizeX * a2) / (a1 * b2 - a2 * b1);

		const bothAreIntegers = Number.isInteger(x) && Number.isInteger(y);
		if (bothAreIntegers) {
			sum += x * 3 + y;
		}
	}
	return sum;
}

Benchmark.run(part1, test);
console.log('---------------------');
Benchmark.run(part2, test);
