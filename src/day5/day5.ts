import { Benchmark } from '@/util/benchmark';
import { Reader } from '@/util/reader';

const test = Reader.read(5, 'test');
const input = Reader.read(5, 'input');

function updateOrderMap(line: string, orderMap: Map<string, string[]>) {
	let [key, val] = line.split('|');
	let existing = orderMap.get(key);
	if (existing) {
		existing.push(val);
		orderMap.set(key, existing);
	} else {
		orderMap.set(key, [val]);
	}
}

function part1(input: string[]) {
	let sum = 0;
	let isUpdateSection = false;
	let isValid = false;
	let updates = [];
	const orderingMap = new Map<string, string[]>();

	for (let line of input) {
		// Build the ordering map
		if (!isUpdateSection) {
			if (line === '') {
				isUpdateSection = true;
				continue;
			}
			updateOrderMap(line, orderingMap);
		}

		// Validate the updates
		isValid = false;
		updates = line.split(',');
		for (let j = 1; j < updates.length; j++) {
			let order = orderingMap.get(updates[j]);
			if (!order) continue;
			for (let k = 0; k < j; k++) {
				isValid = !order.includes(updates[k]);
				if (!isValid) break;
			}
			if (!isValid) break;
		}
		if (isValid) {
			const middleIndex = Math.floor(updates.length / 2);
			sum += parseInt(updates[middleIndex]);
		}
	}

	return sum;
}

function part2(input: string[]) {
	let sum = 0;
	let isUpdateSection = false;
	let hasSwapped = false;
	let updates = [];
	const orderingMap = new Map<string, string[]>();

	for (let line of input) {
		// Build the ordering map
		if (!isUpdateSection) {
			if (line === '') {
				isUpdateSection = true;
				continue;
			}
			updateOrderMap(line, orderingMap);
		}

		// Sort invalid updates
		hasSwapped = false;
		updates = line.split(',');
		for (let j = 1; j < updates.length; j++) {
			let order = orderingMap.get(updates[j]);
			if (!order) continue;
			for (let k = 0; k < j; k++) {
				if (order.includes(updates[k])) {
					let temp = updates[k];
					updates[k] = updates[j];
					updates[j] = temp;
					hasSwapped = true;
				}
			}
		}
		if (hasSwapped) {
			const middleIndex = Math.floor(updates.length / 2);
			sum += parseInt(updates[middleIndex]);
		}
	}
	return sum;
}

Benchmark.run(part1, test);
console.log('---------------------');
Benchmark.run(part2, test);
