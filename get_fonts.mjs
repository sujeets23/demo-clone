import fs from 'fs';

const buf = fs.readFileSync('Landing page.pdf');
const str = buf.toString('latin1');

// Find all /BaseFont or /FontName or /FontFamily
let fontRegex = /\/BaseFont\s*\/([^\s\/>]+)/g;
let m;
let fonts = new Set();
while ((m = fontRegex.exec(str)) !== null) {
  fonts.add(m[1]);
}
console.log('BaseFonts found:', Array.from(fonts));

// Also let's inspect the Font objects in 2312 0 R (Page resources)
const resIdx = str.indexOf('2312 0 obj');
if (resIdx !== -1) {
  console.log('Resources object snippet:');
  console.log(str.substring(resIdx, resIdx + 3000));
}

