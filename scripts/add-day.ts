import fs from 'fs';
import path from 'path';

const dayNumber = process.argv[2];

if (!dayNumber || isNaN(parseInt(dayNumber))) {
	console.error('Please provide a valid day number (e.g., `npm run create-day 16`).');
	process.exit(1);
}

const dayFolder = `day${dayNumber.padStart(2, '0')}`;
const basePath = path.join(__dirname, '../src', dayFolder);

if (fs.existsSync(basePath)) {
	console.error(`Folder for ${dayFolder} already exists.`);
	process.exit(1);
}

fs.mkdirSync(basePath, { recursive: true });

const files = ['day' + dayNumber.padStart(2, '0') + '.ts', 'input.txt', 'test.txt'];

files.forEach((file) => {
	const filePath = path.join(basePath, file);
	fs.writeFileSync(filePath, '', 'utf-8');
	console.log(`Created: ${filePath}`);
});

console.log(`Successfully created folder and files for ${dayFolder}.`);
