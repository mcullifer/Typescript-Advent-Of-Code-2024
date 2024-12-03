import { Benchmark } from '@/util/benchmark';
import { Reader } from '@/util/reader';

const test = Reader.read(3, 'test', true);
const input = Reader.read(3, 'input', true);

function part1(input: string[]) {
	let line = input[0];
	let results = 0;
	let reg = /mul\((\d+),(\d+)\)/g;
	let match;
	while ((match = reg.exec(line))) {
		results += parseInt(match[1]) * parseInt(match[2]);
	}
	return results;
}

function part2(input: string[]) {
	let line = input[0];
	let results = 0;
	let reg = /do(?:n't)*\(\)|mul\((\d+),(\d+)\)/g;
	let match;
	let addNext = true;
	while ((match = reg.exec(line))) {
		if (match[0] === "don't()") {
			addNext = false;
		} else if (match[0] === 'do()') {
			addNext = true;
		} else {
			if (addNext) {
				results += parseInt(match[1]) * parseInt(match[2]);
			}
		}
	}
	return results;
}

Benchmark.run(part1, test);
console.log('---------------------');
Benchmark.run(part2, test);
