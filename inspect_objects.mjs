import fs from 'fs';

const buf = fs.readFileSync('Landing page.pdf');
console.log('PDF total size:', buf.length);

// Let's search for objects: "\d+ \d+ obj"
const objRegex = /(\d+)\s+(\d+)\s+obj([\s\S]*?)endobj/g;
let match;
let count = 0;
const objects = [];

// Since the file is 24MB, regex across whole buffer might be heavy, let's parse using basic stream or chunks
let str = buf.toString('latin1');
console.log('Buffer converted to latin1 string');

// Let's find xref or trailer or /Root
const trailerIdx = str.lastIndexOf('trailer');
console.log('Trailer index:', trailerIdx);
if (trailerIdx !== -1) {
  console.log('Trailer content:', str.substring(trailerIdx, trailerIdx + 500));
}

// Let's find all /Type /Page
let pageMatch = /\/Type\s*\/Page\b[\s\S]*?>>/g;
while ((match = pageMatch.exec(str)) !== null) {
  console.log('Page dict:', match[0]);
}

// Let's find /Contents in the page
let contentsMatch = /\/Contents\s+(\d+)\s+(\d+)\s+R/g;
while ((match = contentsMatch.exec(str)) !== null) {
  console.log('Contents ref:', match[0]);
}

