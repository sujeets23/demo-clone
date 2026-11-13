import fs from 'fs';

const buf = fs.readFileSync('Landing page.pdf');
const str = buf.toString('latin1');

let fdRegex = /\/FontDescriptor\s+(\d+)\s+(\d+)\s+R/g;
let m;
while ((m = fdRegex.exec(str)) !== null) {
  console.log('FontDescriptor ref:', m[0]);
  const objId = m[1];
  const objStart = str.indexOf(`${objId} 0 obj`);
  if (objStart !== -1) {
    const objEnd = str.indexOf('endobj', objStart);
    console.log(`FontDescriptor ${objId}:`, str.substring(objStart, objEnd + 6));
  }
}

// Also let's inspect the entire objects for 349, 837, 1351, 1833, 2311
for (const id of [349, 837, 1351, 1833, 2311]) {
  const objStart = str.indexOf(`${id} 0 obj`);
  const objEnd = str.indexOf('endobj', objStart);
  console.log(`Font ${id} end dict:`, str.substring(objEnd - 200, objEnd + 6));
}

