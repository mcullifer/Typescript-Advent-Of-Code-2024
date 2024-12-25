import { Benchmark } from '@/util/benchmark';
import { Reader } from '@/util/reader';

// This solution is from https://github.com/JustSamuel/AOC/blob/master/src/day19/index.ts
// I had a bad day and got very close initially but there were edge cases I was missing
// I also wasn't using "dynamic programming" I was iterating backwards through the list
// and getting the largest matching prefix then removing it
// I think that introduced edge cases where "bwrw" could become "bwr" and "w" but "w" is not in the list
// however "bw" and "br" could be and then my solution would fail.
// I still feel like my method could still work by iterating backwards and getting the largest prefix but
// continuing on until the end? But I'd have to track it in some way which I guess is what this solution is doing

function setup(input: string[]) {
	let nextSection = false;
	let availablePatterns = new Map<string, number>();
	let patternsToCheck: string[] = [];
	for (const line of input) {
		if (line === '') {
			nextSection = true;
			continue;
		}
		if (!nextSection) {
			line.split(', ').forEach((pattern) => availablePatterns.set(pattern, pattern.length));
		} else {
			patternsToCheck.push(line.trim());
		}
	}
	return { availablePatterns, patternsToCheck };
}

function part1(input: string[]) {
	let { availablePatterns, patternsToCheck } = setup(input);
	let possibleCount = 0;
	for (let pattern of patternsToCheck) {
		let arr = new Array(pattern.length + 1).fill(0);
		arr[0] = 1;
		for (let i = 0; i < pattern.length; i++) {
			if (!arr[i]) continue;
			for (let [available, availableLength] of availablePatterns) {
				let subStr = pattern.substring(i, i + availableLength);
				if (i + availableLength <= pattern.length && subStr === available) {
					arr[i + availableLength] += arr[i];
				}
			}
		}
		if (arr[pattern.length] > 0) {
			possibleCount++;
		}
	}
	return possibleCount;
}

function part2(input: string[]) {
	let { availablePatterns, patternsToCheck } = setup(input);
	let possibleCount = 0;
	for (let pattern of patternsToCheck) {
		let arr = new Array(pattern.length + 1).fill(0);
		arr[0] = 1;
		for (let i = 0; i < pattern.length; i++) {
			if (arr[i] === 0) continue;
			for (let [available, availableLength] of availablePatterns) {
				let subStr = pattern.substring(i, i + availableLength);
				if (i + availableLength <= pattern.length && subStr === available) {
					arr[i + availableLength] += arr[i];
				}
			}
		}
		possibleCount += arr[pattern.length];
	}
	return possibleCount;
}

const test = Reader.read(19, 'test');
const input = Reader.read(19, 'input');
Benchmark.withTitle(19).run(part1, test).run(part2, test);
