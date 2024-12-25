import { Benchmark } from '@/util/benchmark';
import { Reader } from '@/util/reader';

function setup(input: string[]) {
	let keys = [];
	let locks = [];
	const h = 7;
	for (let i = 0; i < input.length; i += h + 1) {
		let heights = [];
		let isLock = input[i][0] === '#';
		for (let j = 0; j < input[i].length; j++) {
			const searchChar = isLock ? '#' : '.';
			let row = i;
			while (row < i + h && input[row][j] === searchChar) {
				row++;
			}
			let res = isLock ? row - i - 1 : i + h - row - 1;
			heights.push(res);
		}
		if (isLock) {
			locks.push(heights);
		} else {
			keys.push(heights);
		}
	}
	return { keys, locks };
}

function part1(input: string[]) {
	const { keys, locks } = setup(input);
	let lockAndKeys = new Map<string, string[]>();
	const h = 7;
	for (let lock of locks) {
		for (let key of keys) {
			if (lock.every((v, i) => v + key[i] < h - 1)) {
				let existing = lockAndKeys.get(lock.join('')) ?? [];
				existing.push(key.join(''));
				lockAndKeys.set(lock.join(''), existing);
			}
		}
	}
	let sum = 0;
	for (let [lock, keys] of lockAndKeys) {
		sum += keys.length;
	}
	return sum;
}

const test = Reader.read(25, 'test');
const input = Reader.read(25, 'input');
Benchmark.run(part1, test);
