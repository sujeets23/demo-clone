import fs from 'fs';

const buf = fs.readFileSync('Landing page.pdf');
console.log('Total file bytes:', buf.length);

// Search for strings in PDF
const text = buf.toString('latin1');
const matches = [];
let re = /\/Type\s*\/Page\b|\/Type\s*\/XObject|\/Subtype\s*\/Image|\/Filter\s*\/[A-Za-z0-9]+/g;
let m;
let counts = {};
while ((m = re.exec(text)) !== null) {
  counts[m[0]] = (counts[m[0]] || 0) + 1;
}
console.log('Object counts:', counts);

// Look for image dimensions or /Width /Height /ColorSpace
let reDims = /\/Width\s+(\d+)\s*\/Height\s+(\d+)/g;
while ((m = reDims.exec(text)) !== null) {
  console.log(`Image dim: Width=${m[1]}, Height=${m[2]}`);
}

// Check what fonts or text might be in PDF
let reFont = /\/BaseFont\s*\/([A-Za-z0-9\+\-]+)/g;
let fonts = new Set();
while ((m = reFont.exec(text)) !== null) {
  fonts.add(m[1]);
}
console.log('Fonts found via raw search:', Array.from(fonts));

// Check PDF creator / producer
let reMeta = /\/(Creator|Producer|Title|Author)\s*\(([^)]+)\)/g;
while ((m = reMeta.exec(text)) !== null) {
  console.log(`${m[1]}: ${m[2]}`);
}

