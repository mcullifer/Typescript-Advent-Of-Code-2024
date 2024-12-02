import { Benchmark } from '@/util/benchmark';
import { Reader } from '@/util/reader';

const test = Reader.read(2, 'test');
const input = Reader.read(2, 'input');

function setup(input: string[]) {
	let nums: number[][] = [];
	for (let line of input) {
		let split = line.split(' ');
		nums.push(split.map((n) => parseInt(n)));
	}
	return nums;
}

function part1(input: string[]): number {
	const nums = setup(input);
	let isDecreasing = false;
	let left = 0;
	let right = nums[0].length - 2;
	let safe = 0;
	let diffLeft = 0;
	let diffRight = 0;
	let failed = false;
	const isValid = (difference: number) => {
		if (difference > 0 && difference < 4) return true;
		return false;
	};
	for (let i = 0; i < nums.length; i++) {
		left = 0;
		right = nums[i].length - 2;
		failed = false;
		isDecreasing = nums[i][0] > nums[i][nums[i].length - 1];
		while (left <= right) {
			diffLeft = nums[i][left] - nums[i][left + 1];
			diffRight = nums[i][right] - nums[i][right + 1];
			if (!isDecreasing) {
				diffLeft *= -1;
				diffRight *= -1;
			}
			if (!isValid(diffLeft) || !isValid(diffRight)) {
				failed = true;
				break;
			}
			left++;
			right--;
		}
		if (!failed) {
			safe++;
		}
	}
	return safe;
}

function validate(nums: number[]) {
	let differences = [];
	for (let i = 1; i < nums.length; i++) {
		differences.push(nums[i] - nums[i - 1]);
	}
	const validWhenIncreasing = differences.every((d) => d >= 1 && d <= 3);
	const validWhenDecreasing = differences.every((d) => d <= -1 && d >= -3);
	return validWhenIncreasing || validWhenDecreasing;
}

// I think there's a faster way to do this without so many nested loops
// Probably something with checking in front or behind depending on if you expect an increase or decrease?
function part2(input: string[]) {
	const nums = setup(input);
	let passed = false;
	let safe = 0;
	for (let i = 0; i < nums.length; i++) {
		passed = false;
		for (let j = 0; j < nums[i].length; j++) {
			passed = validate(nums[i].slice(0, j).concat(nums[i].slice(j + 1)));
			if (passed) break;
		}
		if (passed) {
			safe++;
		}
	}
	return safe;
}

Benchmark.run(part1, test);
console.log('---------------------');
Benchmark.run(part2, test);
