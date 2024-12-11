import { Benchmark } from '@/util/benchmark';
import { Reader } from '@/util/reader';

const test = Reader.read(11, 'test', true);
const input = Reader.read(11, 'input', true);

function blink(value: string): string[] {
	if (value === '0') {
		return ['1'];
	}
	if (value.length % 2 === 0) {
		const half = value.length / 2;
		const firstHalf = parseInt(value.slice(0, half));
		const secondHalf = parseInt(value.slice(half, value.length));
		return [firstHalf.toString(), secondHalf.toString()];
	}
	return [(parseInt(value) * 2024).toString()];
}

function blinkUntil(stones: string[], iterations: number): number {
	let stoneMap = new Map<string, number>();
	for (let stone of stones) {
		stoneMap.set(stone, (stoneMap.get(stone) ?? 0) + 1);
	}
	for (let count = 0; count < iterations; count++) {
		let results = new Map<string, number>();
		for (let [stone, stoneCount] of stoneMap) {
			stoneMap.delete(stone);
			for (let val of blink(stone)) {
				results.set(val, (results.get(val) ?? 0) + stoneCount);
			}
		}
		stoneMap = results;
	}
	return Array.from(stoneMap.values()).reduce((acc, val) => (acc += val), 0);
}

function part1(input: string[]): number {
	let stones = input[0].split(' ');
	return blinkUntil(stones, 25);
}

function part2(input: string[]): number {
	let stones = input[0].split(' ');
	return blinkUntil(stones, 75);
}

Benchmark.run(part1, test);
console.log('---------------------');
Benchmark.run(part2, test);
