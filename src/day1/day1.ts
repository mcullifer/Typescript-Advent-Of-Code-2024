import { Benchmark } from '@/util/benchmark';
import { Reader } from '@/util/reader';

const test = Reader.read(1, 'test');
const input = Reader.read(1, 'input');

function setup(input: string[]) {
	let left = Array(input.length).fill(0);
	let right = Array(input.length).fill(0);
	let count = 0;
	for (let line of input) {
		let split = line.replace('   ', ' ').split(' ');
		left[count] = parseInt(split[0]);
		right[count] = parseInt(split[1]);
		count++;
	}
	return [left, right];
}

function part1(input: string[]): number {
	let [left, right] = setup(input);
	left.sort((a, b) => a-b);
	right.sort((a, b) => a-b);
	let sum = 0;
	for (let i = 0; i < left.length; i++) {
		sum += Math.abs(left[i] - right[i]);
	}
	return sum;
}

function part2(input: string[]): number {
	let [left, right] = setup(input);
	let sum = 0;
	let seen = new Map<number, number>();
	let frequency: number | undefined;
	let temp = 0;
	for (let i = 0; i < left.length; i++) {
		frequency = seen.get(left[i]);
		if (frequency != undefined && frequency > 0) {
			sum += (left[i] * frequency);
			continue;
		}
		seen.set(left[i], 0);
		for (let j = 0; j < right.length; j++) {
			if (right[j] === left[i]) {
				temp++;
				seen.set(left[i], temp);
			}			
		}
		sum += (left[i] * temp);
		temp = 0;
	}
	return sum;
}

Benchmark.run(part1, test);
console.log('---------------------');
Benchmark.run(part2, test);