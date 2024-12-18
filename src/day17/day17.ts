import { Benchmark } from '@/util/benchmark';
import { Reader } from '@/util/reader';

class Program {
	pointer = 0;
	output: number[] = [];
	instructions = [
		(operand: number) => {
			this.A = Math.floor(this.A / Math.pow(2, this.combo(operand)));
		},
		(operand: number) => {
			this.B = this.B ^ operand;
		},
		(operand: number) => {
			this.B = this.combo(operand) % 8;
		},
		(operand: number) => {
			return this.A === 0 ? undefined : operand - 2;
		},
		(operand: number) => {
			this.B = this.B ^ this.C;
		},
		(operand: number) => {
			this.output.push(this.combo(operand) % 8);
		},
		(operand: number) => {
			this.B = Math.floor(this.A / Math.pow(2, this.combo(operand)));
		},
		(operand: number) => {
			this.C = Math.floor(this.A / Math.pow(2, this.combo(operand)));
		}
	];

	constructor(
		public program: number[],
		public A: number,
		public B: number,
		public C: number
	) {}

	combo(operand: number) {
		if (operand >= 0 && operand <= 3) return operand;
		if (operand === 4) return this.A;
		if (operand === 5) return this.B;
		if (operand === 6) return this.C;
		throw new Error('Invalid operand');
	}

	execute() {
		for (this.pointer = 0; this.pointer < this.program.length; this.pointer += 2) {
			if (this.pointer >= this.program.length) {
				console.log('pointer exceeded this.program length');
				break;
			}
			let opCode = this.program[this.pointer];
			let operand = this.program[this.pointer + 1];
			let instructionFn = this.instructions[opCode];
			let updatedPointer = instructionFn(operand);
			this.pointer = updatedPointer ?? this.pointer;
		}
	}

	print() {
		return this.output.join(',');
	}
}

function part1(input: string[]) {
	let registerA = parseInt(input[0].split(':')[1].trim());
	let registerB = parseInt(input[1].split(':')[1].trim());
	let registerC = parseInt(input[2].split(':')[1].trim());
	let instructions = input[4].split(':')[1].split(',').map(Number);
	let program = new Program(instructions, registerA, registerB, registerC);
	program.execute();
	return program.print();
}

// Couldn't figure this out
// I see that every 8^n - 8^(n-1) a new number gets added to the output,
// so somewhere between there is where it happens although with my input
// 8^n - 8^(n-1) was way too big, but if I go to one previous
// it's orders of magnitude smaller so it still takes forever
// I'm a failure
function part2(input: string[]) {
	let registerA = parseInt(input[0].split(':')[1].trim());
	let registerB = parseInt(input[1].split(':')[1].trim());
	let registerC = parseInt(input[2].split(':')[1].trim());
	let instructions = input[4].split(':')[1].split(',').map(Number);
	let out = '';

	while (out !== instructions.toString()) {
		let program = new Program(instructions, registerA, registerB, registerC);
		program.execute();
		out = program.print();
		registerA++;
	}
	return registerA;
}

const test = Reader.read(17, 'test');
const input = Reader.read(17, 'input');
Benchmark.run(part1, test);
Benchmark.run(part2, test);
