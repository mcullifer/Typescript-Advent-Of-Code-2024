import fs from 'fs';

export class Reader {
	static read(day: number, fileName: string, singleLine = false): string[] {
		let path = `src/day${day}/${fileName}.txt`;
		let res = fs.readFileSync(path, 'utf8');
		if (singleLine) {
			return [res];
		} else {
			return res.split('\n').map((x) => x.replace('\r', ''));
		}
	}
}
