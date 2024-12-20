import { Benchmark } from '@/util/benchmark';
import { Reader } from '@/util/reader';

function part1(input: string[]) {}

function part2(input: string[]) {}

const test = Reader.read(20, 'test');
const input = Reader.read(20, 'input');
Benchmark.run(part1, test);
Benchmark.run(part2, test);
