import { Benchmark } from '@/util/benchmark';
import { Reader } from '@/util/reader';

function mix(value: number, secretNumber: number) {
	return value ^ secretNumber;
}

function prune(secretNumber: number) {
	return secretNumber & 16777215;
}

function getNextSecretNumber(secretNumber: number) {
	let res = secretNumber * 64;
	secretNumber = mix(res, secretNumber);
	secretNumber = prune(secretNumber);

	res = Math.floor(secretNumber / 32);
	secretNumber = mix(res, secretNumber);
	secretNumber = prune(secretNumber);

	res = secretNumber * 2048;
	secretNumber = mix(res, secretNumber);
	secretNumber = prune(secretNumber);
	return secretNumber;
}

function part1(input: string[]) {
	const secretNumbers = input.map((line) => parseInt(line));
	const numsPerDay = 2000;
	let sum = 0;
	for (let secretNumber of secretNumbers) {
		for (let i = 0; i < numsPerDay; i++) {
			secretNumber = getNextSecretNumber(secretNumber);
		}
		sum += secretNumber;
	}
	return sum;
}

function part2(input: string[]) {
	const secretNumbers = input.map((line) => parseInt(line));
	const numsPerDay = 2000;
	let diffsPerSecretNumber = [];
	let ones = [];
	for (let secretNumber of secretNumbers) {
		let sequence = [secretNumber];
		let onesPlace = [];
		let diffs = [];
		for (let i = 0; i < numsPerDay; i++) {
			let str = secretNumber.toString();
			onesPlace.push(parseInt(str[str.length - 1]));
			secretNumber = getNextSecretNumber(secretNumber);
			sequence.push(secretNumber);
			if (i === 0) continue;
			let diff = onesPlace[i] - onesPlace[i - 1];
			diffs.push(diff);
		}
		diffsPerSecretNumber.push(diffs);
		ones.push(onesPlace);
	}
	let offset = 4;
	let sequenceMap = new Map<string, number>();
	let sequenceId = '';
	let maxSum = 0;
	let maxSequence = '';
	let seen = new Set<string>();
	for (let i = 0; i < diffsPerSecretNumber.length; i++) {
		seen.clear();
		for (let j = 0; j < diffsPerSecretNumber[i].length - offset; j++) {
			sequenceId = diffsPerSecretNumber[i].slice(j, j + offset).join(',');
			if (seen.has(sequenceId)) continue;
			seen.add(sequenceId);
			let nextNumber = ones[i][j + offset];
			let existing = sequenceMap.get(sequenceId) ?? 0;
			let next = existing + nextNumber;
			sequenceMap.set(sequenceId, next);
			if (next > maxSum) {
				maxSum = next;
				maxSequence = sequenceId;
			}
		}
	}
	console.log(maxSequence, maxSum);
	return maxSum;
}

const test = Reader.read(22, 'test');
const input = Reader.read(22, 'input');
Benchmark.run(part1, test);
Benchmark.run(part2, test);
