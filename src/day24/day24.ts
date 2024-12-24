import { Benchmark } from '@/util/benchmark';
import { Reader } from '@/util/reader';

class Wire {
	id: number;
	constructor(
		public name: string,
		public value: number = -1
	) {
		this.id = parseInt(name.slice(1, name.length));
		if (isNaN(this.id)) {
			this.id = -1;
		}
	}
}

class Gate {
	swapped: boolean = false;
	constructor(
		public input1: Wire,
		public input2: Wire,
		public output: Wire,
		public op: string
	) {}

	doOperation() {
		switch (this.op) {
			case 'AND':
				this.output.value = this.input1.value & this.input2.value;
				break;
			case 'OR':
				this.output.value = this.input1.value | this.input2.value;
				break;
			case 'XOR':
				this.output.value = this.input1.value ^ this.input2.value;
				break;
		}
	}
}

function setup(input: string[]) {
	let wires = new Map<string, Wire>();
	let gates = new Map<string, Gate>();
	let missing = new Set<string>();
	let onNextSection = false;
	for (let line of input) {
		if (line === '') {
			onNextSection = true;
			continue;
		}
		if (!onNextSection) {
			let [k, v] = line.split(': ');
			wires.set(k, new Wire(k, parseInt(v)));
		} else {
			let [input1, operation, input2, arrow, output] = line.split(' ');
			let input1Wire = wires.get(input1);
			if (input1Wire === undefined) {
				missing.add(input1);
				input1Wire = new Wire(input1);
			}
			let input2Wire = wires.get(input2);
			if (input2Wire === undefined) {
				missing.add(input2);
				input2Wire = new Wire(input2);
			}
			let outputWire = new Wire(output);
			missing.add(output);
			gates.set(output, new Gate(input1Wire, input2Wire, outputWire, operation));
		}
	}
	return { wires, gates, missing };
}

function binaryToDecimal(n: string) {
	return parseInt(n, 2);
}

function decimalToBinary(n: number) {
	return n.toString(2);
}

function solve(wires: Map<string, Wire>, gates: Map<string, Gate>, missing: Set<string>) {
	while (missing.size > 0) {
		for (let missingWire of missing.values()) {
			let gate = gates.get(missingWire);
			if (gate === undefined) {
				missing.delete(missingWire);
				continue;
			}
			let input1 = wires.get(gate.input1.name);
			let input2 = wires.get(gate.input2.name);
			if (!input1) {
				missing.add(gate.input1.name);
				continue;
			}
			if (!input2) {
				missing.add(gate.input2.name);
				continue;
			}
			gate.input1 = input1;
			gate.input2 = input2;
			gate.doOperation();
			gates.set(missingWire, gate);
			wires.set(missingWire, gate.output);
			missing.delete(missingWire);
		}
	}
}

function part1(input: string[]) {
	let { wires, gates, missing } = setup(input);
	solve(wires, gates, missing);
	let zWires = Array.from(wires.values())
		.filter((w) => w.name.startsWith('z'))
		.sort((a, b) => b.id - a.id)
		.reduce((acc, wire) => acc + wire.value, '');
	return binaryToDecimal(zWires);
}

function part2(input: string[]) {
	let { wires, gates, missing } = setup(input);
	solve(wires, gates, missing);
	let xWires = Array.from(wires.values())
		.filter((w) => w.name.startsWith('x'))
		.sort((a, b) => b.id - a.id)
		.reduce((acc, wire) => acc + wire.value, '');
	let yWires = Array.from(wires.values())
		.filter((w) => w.name.startsWith('y'))
		.sort((a, b) => b.id - a.id)
		.reduce((acc, wire) => acc + wire.value, '');
	let zWires = Array.from(wires.values())
		.filter((w) => w.name.startsWith('z'))
		.sort((a, b) => b.id - a.id)
		.reduce((acc, wire) => acc + wire.value, '');
	let decX = binaryToDecimal(xWires);
	let decY = binaryToDecimal(yWires);
	let res = decX & decY;
	xWires = xWires;
	yWires = yWires;
	let bad = [];
	for (let j = 0; j < xWires.length; j++) {
		if ((parseInt(xWires[j]) & parseInt(yWires[j])) !== parseInt(zWires[j])) {
			bad.push(j);
		}
	}
	console.log(bad);
	console.log('0' + xWires, 'X');
	console.log('0' + yWires, 'Y');
	console.log(zWires, 'Z');
	console.log(decimalToBinary(res), 'X & Y');
	console.log(res, binaryToDecimal(zWires));
	let zs = Array.from(wires.values())
		.filter((w) => w.name.startsWith('z'))
		.sort((a, b) => b.id - a.id);
	for (let z = 0; z < bad.length; z++) {
		console.log(zs[z].name);
	}
}

const test = Reader.read(24, 'test');
const input = Reader.read(24, 'input');
Benchmark.run(part1, test);
Benchmark.run(part2, input);
