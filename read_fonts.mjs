import fs from 'fs';

const buf = fs.readFileSync('Landing page.pdf');
const str = buf.toString('latin1');

const fontIds = [349, 837, 1351, 1833, 2311];
for (const id of fontIds) {
  const pattern = `${id} 0 obj`;
  const idx = str.indexOf(pattern);
  if (idx !== -1) {
    const end = str.indexOf('endobj', idx);
    console.log(`=== Font Object ${id} ===`);
    console.log(str.substring(idx, Math.min(end + 6, idx + 1000)));
  }
}

