import { Colors } from '@/util/colors';

export class Benchmark {
	static withTitle(day: number, title?: string) {
		let dayStr = `${Colors.FgGreen}Day ${day.toString().padStart(2, '0')}${Colors.Reset}`;
		let titleStr = title ? ` - ${title}` : '';
		// let coloredTitle = `${Colors.FgRed}${titleStr}${Colors.Reset}`;
		console.log(`\n🎄⭐ ${dayStr}${titleStr} ⭐🎄`);
		return this;
	}

	static run<T>(func: (...args: any) => T, ...args: any) {
		let now = performance.now();
		let result = func(...args);
		let elapsed = (performance.now() - now).toFixed(2);
		let fnName = func.name;
		fnName = fnName.charAt(0).toUpperCase() + fnName.slice(1);
		const time = `\x1b[36m[${elapsed}ms]\x1b[0m`;
		console.log(`${time} ${fnName}: \x1b[32m${result}\x1b[0m`);
		return this;
	}
}
