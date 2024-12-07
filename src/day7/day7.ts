import fs from 'fs';
// Couldn't figure this one out unfortunately. The solution is from this user on Reddit:
// www.reddit.com/r/adventofcode/comments/1h8l3z5/comment/m0vfcn0/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
const data = fs.readFileSync(`src/day7/test.txt`, 'utf-8').split('\n');
const equations = data.map((line) => line.split(/ |: /).map(Number));

const operations = [
	(a: number, b:number) => a + b,
	(a: number, b:number) => a * b,
	(a: number, b:number) => +(String(a) + b) // uncomment to solve part 2
];

function tryOperation(eq: number[], i: number, tot: number): boolean {
	if (i >= eq.length) return tot === eq[0];
	return operations.some((op) => tryOperation(eq, i + 1, op(tot, eq[i])));
}

const result = equations.reduce((sum, eq) => (sum += tryOperation(eq, 2, eq[1]) ? eq[0] : 0), 0);
console.log(result)
