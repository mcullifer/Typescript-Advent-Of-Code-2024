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
	// We actually want to find inside the diffs array repeating sequences
	// that are 4 long and check if that sequence appears for the others
	// the sequence doesn't need to happen in all of them
	// but we do want the sequence that produces the largest number
	// the number is the index of when this diff sequence occurs
	// so might need to bring out the sequence arrays too
	let offset = 4;
	let sequenceMap: Record<string, number[]> = {};
	let sequenceId = '';
	let sequence2Id = '';
	let maxSum = 0;
	let maxSequence = '';
	let tempSum = 0;
	for (let i = 0; i < diffsPerSecretNumber[0].length - offset - 1; i++) {
		sequenceId = diffsPerSecretNumber[0].slice(i, i + offset).join(',');
		let nextNumber = ones[0][i + offset];
		for (let j = 1; j < secretNumbers.length; j++) {
			for (let k = 0; k < diffsPerSecretNumber[j].length - offset - 1; k++) {
				sequence2Id = diffsPerSecretNumber[j].slice(k, k + offset).join(',');
				if (sequenceId !== sequence2Id) continue;
				let nextNumber2 = ones[j][k + offset];
				if (!sequenceMap[sequenceId]) {
					sequenceMap[sequenceId] = Array(secretNumbers.length).fill(0);
					sequenceMap[sequenceId][0] = nextNumber;
				}
				sequenceMap[sequenceId][j] = nextNumber2;
				tempSum = 0;
				for (let num of sequenceMap[sequenceId]) {
					tempSum += num;
				}
				if (tempSum > maxSum) {
					maxSum = tempSum;
					maxSequence = sequenceId;
				}
			}
		}
	}

	console.log(maxSequence, maxSum);
	return maxSum;
}

const test = Reader.read(22, 'test');
const input = Reader.read(22, 'input');
Benchmark.run(part1, test);
Benchmark.run(part2, input);
