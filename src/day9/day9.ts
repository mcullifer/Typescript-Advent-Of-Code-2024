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
	let pointerLeft = disk.indexOf('.'); // The first occurance of '.'
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
	for (let i = 0; i < disk.length; i++) {
		if (disk[i] === '.') {
			let j = i;
			while (disk[j] === '.' && j < disk.length) {
				j++;
			}
			if (j - i >= required) {
				return [i, j - i + 1];
			}
		}
	}
	return [-1, -1];
}

function findNextGroup(disk: string[], current: number) {
	for (let i = current; i >= 0; i--) {
		if (disk[i] !== '.') {
			let matching = 1;
			while (disk[current - matching] === disk[i] && current - matching >= 0) {
				matching += 1;
			}
			return [i, matching];
		}
	}
	return [-1, -1];
}

function compact2(disk: string[]) {
	let seen = new Set();
	for (let i = disk.length - 1; i >= 0; i--) {
		let group = findNextGroup(disk, i);
		if (seen.has(disk[group[0]])) {
			continue;
		}
		if (group[0] === -1) continue;
		seen.add(disk[group[0]]);
		let freeSpace = findFreeSpace(disk, group[1]);
		if (freeSpace[0] === -1) {
			i -= group[1];
			continue;
		}
		if (freeSpace[0] > group[0]) {
			i -= group[1];
			continue;
		}

		for (let j = 0; j < group[1]; j++) {
			disk[freeSpace[0] + j] = disk[i - j];
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

// Doesn't work RIP
function part2(input: string[]) {
	const diskMap = input[0];
	const expanded = getExpandedFormat(diskMap);
	compact2(expanded);
	console.log(expanded.join(''));
	const sum = calculateChecksum(expanded);
	return sum;
}

Benchmark.run(part1, test);
console.log('---------------------');
Benchmark.run(part2, test);
