import { Benchmark } from '@/util/benchmark';
import { Reader } from '@/util/reader';

const test = Reader.read(9, 'test', true);
const input = Reader.read(9, 'input', true);

function getExpandedFormat(diskMap: string) {
	let expanded: string[] = [];
	let id = 0;
	for (let i = 0; i < diskMap.length; i += 2) {
		let block = parseInt(diskMap[i]);
		expanded.push(...Array(block).fill(id.toString()));
		let freeSpace = parseInt(diskMap[i + 1]);
		if (freeSpace) {
			expanded.push(...Array(freeSpace).fill('.'));
		}
		id++;
	}
	return expanded;
}

function compact(disk: string[]) {
	let pointerLeft = disk.indexOf('.');
	let pointerRight = disk.length - 1;
	let temp = '.';
	while (pointerLeft < pointerRight) {
		while (disk[pointerLeft] !== '.' && pointerLeft < pointerRight) {
			pointerLeft++;
		}
		while (disk[pointerRight] === '.' && pointerLeft < pointerRight) {
			pointerRight--;
		}
		temp = disk[pointerLeft];
		disk[pointerLeft] = disk[pointerRight];
		disk[pointerRight] = temp;
	}
	return disk;
}

function findFreeSpace(disk: string[], required: number) {
	for (let left = 0; left < disk.length; left++) {
		if (disk[left] === '.') {
			let right = left;
			while (disk[right] === '.' && right < disk.length) {
				right++;
			}
			if (right - left >= required) {
				return left;
			}
		}
	}
	return -1;
}

function compact2(disk: string[]) {
	for (let i = disk.length - 1; i >= 0; i--) {
		if (disk[i] === '.') continue;
		let blockCount = 1;
		while (disk[i - blockCount] === disk[i] && i - blockCount >= 0) {
			blockCount += 1;
		}
		let freeStartIndex = findFreeSpace(disk, blockCount);
		if (freeStartIndex === -1 || freeStartIndex > i) {
			i -= blockCount - 1;
			continue;
		}
		for (let j = 0; j < blockCount; j++) {
			disk[freeStartIndex + j] = disk[i - j];
			disk[i - j] = '.';
		}
	}
	return disk;
}

function calculateChecksum(disk: string[]) {
	let sum = 0;
	for (let i = 0; i < disk.length; i++) {
		if (disk[i] === '.') continue;
		let val = parseInt(disk[i]);
		if (val) {
			sum += val * i;
		}
	}
	return sum;
}

function part1(input: string[]) {
	const diskMap = input[0];
	const expanded = getExpandedFormat(diskMap);
	compact(expanded);
	const sum = calculateChecksum(expanded);
	return sum;
}

function part2(input: string[]) {
	const diskMap = input[0];
	const expanded = getExpandedFormat(diskMap);
	compact2(expanded);
	const sum = calculateChecksum(expanded);
	return sum;
}

Benchmark.run(part1, test);
console.log('---------------------');
Benchmark.run(part2, test);
