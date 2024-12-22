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
	let buyerPrices = [];
	for (let secretNumber of secretNumbers) {
		let tempPrices = [secretNumber];
		for (let i = 0; i < numsPerDay; i++) {
			secretNumber = getNextSecretNumber(secretNumber);
			tempPrices.push(secretNumber);
		}
		buyerPrices.push(tempPrices);
	}
	let sequenceSums = new Map<string, number>();
	let seen = new Set<string>();
	let maxSum = 0;
	let maxSequence = '';
	for (let prices of buyerPrices) {
		seen.clear();
		for (let j = 1; j < prices.length - 3; j++) {
			let seq = [];
			let sequenceValue = 0;
			for (let k = 0; k < 4; k++) {
				let prevLastDigit = prices[j + k - 1] % 10;
				let currentLastDigit = prices[j + k] % 10;
				let diff = currentLastDigit - prevLastDigit;
				if (k === 3) {
					sequenceValue = currentLastDigit;
				}
				seq.push(diff);
			}
			let sequenceId = `${seq[0]},${seq[1]},${seq[2]},${seq[3]}`;
			if (seen.has(sequenceId)) continue;
			seen.add(sequenceId);
			let next = (sequenceSums.get(sequenceId) ?? 0) + sequenceValue;
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
