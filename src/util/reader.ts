import fs from 'fs';

export class Reader {
	static read(day: number, fileName: string, singleLine = false): string[] {
		try {
			let path = `src/day${day}/${fileName}.txt`;
			let res = fs.readFileSync(path, 'utf8');
			if (singleLine) {
				return [res];
			} else {
				return res.split('\n').map((x) => x.replace('\r', ''));
			}
		} catch (e) {
			if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
				console.error(`File not found: ${fileName}.txt`);
			}
			return [];
		}
	}

	static readSingleLine(day: number, fileName: string): string {
		return Reader.read(day, fileName, true)[0];
	}
}
