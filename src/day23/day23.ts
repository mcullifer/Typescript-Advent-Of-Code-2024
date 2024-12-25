import { Benchmark } from '@/util/benchmark';
import { Reader } from '@/util/reader';

function setup(input: string[]) {
	let connections = new Map<string, string[]>();
	for (let line of input) {
		let [first, second] = line.split('-');
		let existing = connections.get(first) ?? [];
		existing.push(second);
		connections.set(first, existing);
		let existing2 = connections.get(second) ?? [];
		existing2.push(first);
		connections.set(second, existing2);
	}
	return connections;
}

function part1(input: string[]) {
	const connections = setup(input);
	let triples = new Set<string>();
	for (let [key, connectedTo] of connections) {
		for (let pc of connectedTo) {
			let exists = connections.get(pc);
			if (!exists) {
				continue;
			}
			for (let pc2 of exists) {
				let secondDegreeConnections = connections.get(pc2);
				if (!secondDegreeConnections) continue;
				if (secondDegreeConnections.includes(key)) {
					if (
						triples.has(`${key}-${pc}-${pc2}`) ||
						triples.has(`${key}-${pc2}-${pc}`) ||
						triples.has(`${pc}-${key}-${pc2}`) ||
						triples.has(`${pc}-${pc2}-${key}`) ||
						triples.has(`${pc2}-${key}-${pc}`) ||
						triples.has(`${pc2}-${pc}-${key}`)
					) {
						continue;
					}
					triples.add(`${key}-${pc}-${pc2}`);
				}
			}
		}
	}
	let tees = Array.from(triples.values()).filter((v) =>
		v.split('-').some((p) => p.startsWith('t'))
	);
	return tees.length;
}

// Part 2 wasn't me, this was all chat gippity. I will take some time to understand this.
function part2(input: string[]) {
	// Step 1: Build adjacency list
	const buildGraph = (edges: string[]) => {
		const graph: Record<string, Set<string>> = {};
		for (const edge of edges) {
			const [a, b] = edge.split('-');
			if (!graph[a]) graph[a] = new Set();
			if (!graph[b]) graph[b] = new Set();
			graph[a].add(b);
			graph[b].add(a);
		}
		return graph;
	};

	// Step 2: Bron-Kerbosch Algorithm for finding cliques
	/**
	 *
	 * @param r Nodes currently forming the clique.
	 * @param p Nodes that can potentially be added to R to expand the clique.
	 * @param x Nodes already processed (to avoid duplicates).
	 * @param graph
	 * @param cliques
	 * @returns
	 */
	const bronKerbosch = (
		r: Set<string>,
		p: Set<string>,
		x: Set<string>,
		graph: Record<string, Set<string>>,
		cliques: string[][]
	) => {
		if (p.size === 0 && x.size === 0) {
			// Found a maximal clique
			cliques.push([...r]);
			return;
		}

		const pCopy = new Set(p);
		for (const node of pCopy) {
			const neighbors = graph[node];
			bronKerbosch(
				new Set([...r, node]),
				new Set([...p].filter((n) => neighbors.has(n))),
				new Set([...x].filter((n) => neighbors.has(n))),
				graph,
				cliques
			);
			p.delete(node);
			x.add(node);
		}
	};

	// Step 3: Find the largest cliques
	const findLargestCliques = (cliques: string[][]) => {
		const maxLength = Math.max(...cliques.map((clique) => clique.length));
		return cliques.filter((clique) => clique.length === maxLength);
	};

	// Execute the algorithm
	const graph = buildGraph(input);
	const cliques: string[][] = [];
	bronKerbosch(new Set(), new Set(Object.keys(graph)), new Set(), graph, cliques);
	const largestClique = findLargestCliques(cliques)[0].sort();
	return largestClique;
}

const test = Reader.read(23, 'test');
const input = Reader.read(23, 'input');
Benchmark.withTitle(23).run(part1, test).run(part2, test);
