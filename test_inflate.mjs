import fs from 'fs';
import zlib from 'zlib';

const buf = fs.readFileSync('Landing page.pdf');
const str = buf.toString('latin1');

// Find all objects with /Type /Page (word boundary)
let pos = 0;
while (true) {
  let idx = str.indexOf('/Type /Page', pos);
  if (idx === -1) idx = str.indexOf('/Type/Page', pos);
  if (idx === -1) break;

  // Search backwards for "\n(\d+) (\d+) obj"
  let objStart = str.lastIndexOf('\n', idx);
  while (objStart > 0 && !str.substring(objStart, objStart + 20).includes('obj')) {
    objStart = str.lastIndexOf('\n', objStart - 1);
  }
  let objEnd = str.indexOf('endobj', idx);
  console.log('Found Page object:');
  console.log(str.substring(objStart, objEnd + 6));
  pos = idx + 11;
}

// Check object 2313
const obj2313Str = '2313 0 obj';
const idx2313 = str.indexOf(obj2313Str);
console.log('idx 2313:', idx2313);
const streamIdx = str.indexOf('stream', idx2313);
const endStreamIdx = str.indexOf('endstream', streamIdx);
console.log(str.substring(idx2313, streamIdx + 6));

// stream starts after \r\n or \n
let dataStart = streamIdx + 6;
while (buf[dataStart] === 10 || buf[dataStart] === 13) dataStart++;
let dataEnd = endStreamIdx;
while (buf[dataEnd - 1] === 10 || buf[dataEnd - 1] === 13) dataEnd--;

const streamBuf = buf.subarray(dataStart, dataEnd);
console.log('Stream bytes length:', streamBuf.length, 'first bytes:', streamBuf.slice(0, 10));

let decomp;
try {
  decomp = zlib.inflateSync(streamBuf);
  console.log('Decompressed with inflateSync! Length:', decomp.length);
} catch (e) {
  try {
    decomp = zlib.inflateRawSync(streamBuf);
    console.log('Decompressed with inflateRawSync! Length:', decomp.length);
  } catch (e2) {
    console.error('Failed inflateRawSync too:', e2.message);
  }
}

if (decomp) {
  fs.writeFileSync('contents_decompressed.txt', decomp);
  console.log('Sample text/ops from contents:\n', decomp.toString('latin1').substring(0, 2000));
}

