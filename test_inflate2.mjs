import fs from 'fs';
import zlib from 'zlib';

const buf = fs.readFileSync('Landing page.pdf');

function findInBuffer(needle, start = 0) {
  return buf.indexOf(Buffer.from(needle), start);
}

const idx2313 = findInBuffer('2313 0 obj');
console.log('Byte offset of 2313 0 obj:', idx2313);

const streamHeader = findInBuffer('stream', idx2313);
let dataStart = streamHeader + 6;
if (buf[dataStart] === 13) dataStart++;
if (buf[dataStart] === 10) dataStart++;

const endStream = findInBuffer('endstream', dataStart);
let dataEnd = endStream;
if (buf[dataEnd - 1] === 10) dataEnd--;
if (buf[dataEnd - 1] === 13) dataEnd--;

const streamBuf = buf.subarray(dataStart, dataEnd);
console.log('Stream length:', streamBuf.length, 'first 10 bytes:', streamBuf.subarray(0, 10));

const decomp = zlib.inflateSync(streamBuf);
console.log('Successfully decompressed! Decompressed length:', decomp.length);
fs.writeFileSync('contents_decompressed.txt', decomp);

// Inspect the first 2000 chars of contents
console.log('First 2000 chars of contents:');
console.log(decomp.subarray(0, 2000).toString('utf8'));

