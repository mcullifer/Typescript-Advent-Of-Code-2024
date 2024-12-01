import fs from 'fs';

export class Reader {
	static read(day: number, fileName: string): string[] {
		let path = `src/day${day}/${fileName}.txt`;
		return fs
			.readFileSync(path, 'utf8')
			.split('\n')
			.map((x) => x.replace('\r', ''));
	}
}
