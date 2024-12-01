export class Benchmark {
	static run<T>(func: (...args: any) => T, ...args: any) {
		let now = performance.now();
		let result = func(...args);
		let elapsed = (performance.now() - now).toFixed(2);
		console.log(`Result: ${result} in ${elapsed}ms`);
	}
}
