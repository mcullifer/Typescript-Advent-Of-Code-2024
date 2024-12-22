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
	let sequences = [];
	for (let secretNumber of secretNumbers) {
		let seq = [secretNumber];
		for (let i = 0; i < numsPerDay; i++) {
			secretNumber = getNextSecretNumber(secretNumber);
			seq.push(secretNumber);
		}
		sequences.push(seq);
	}
	let sequenceSums = new Map<string, number>();
	let seen = new Set<string>();
	let maxSum = 0;
	let maxSequence = '';
	for (let sequence of sequences) {
		seen.clear();
		for (let j = 1; j < sequence.length - 3; j++) {
			let seq = [];
			let lastOnesPlace = 0;
			for (let k = 0; k < 4; k++) {
				let prevOnesPlace = sequence[j + k - 1] % 10;
				let currentOnesPlace = sequence[j + k] % 10;
				let diff = currentOnesPlace - prevOnesPlace;
				if (k === 3) {
					lastOnesPlace = currentOnesPlace;
				}
				seq.push(diff);
			}
			let sequenceId = `${seq[0]},${seq[1]},${seq[2]},${seq[3]}`;
			if (seen.has(sequenceId)) continue;
			seen.add(sequenceId);
			let next = (sequenceSums.get(sequenceId) ?? 0) + lastOnesPlace;
			sequenceSums.set(sequenceId, next);
			if (next > maxSum) {
				maxSum = next;
				maxSequence = sequenceId;
			}
		}
	}
	return maxSum;
}

const test = Reader.read(22, 'test');
const input = Reader.read(22, 'input');
Benchmark.run(part1, test);
Benchmark.run(part2, test);
