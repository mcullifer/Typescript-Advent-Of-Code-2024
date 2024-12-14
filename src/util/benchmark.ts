export class Benchmark {
	static run<T>(func: (...args: any) => T, ...args: any) {
		let now = performance.now();
		let result = func(...args);
		let elapsed = (performance.now() - now).toFixed(2);
		let fnName = func.name;
		fnName = fnName.charAt(0).toUpperCase() + fnName.slice(1);
		const time = `\x1b[36m[${elapsed}ms]\x1b[0m`;
		console.log(`${time} ${fnName}: \x1b[32m${result}\x1b[0m`);
	}
}
