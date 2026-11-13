import fs from 'fs';
import zlib from 'zlib';

const buf = fs.readFileSync('Landing page.pdf');
const str = buf.toString('latin1');

// Find object helper
function getObject(id, gen = 0) {
  const header = `\n${id} ${gen} obj`;
  let idx = str.indexOf(header);
  if (idx === -1) {
    const header2 = `${id} ${gen} obj`;
    idx = str.indexOf(header2);
  }
  if (idx === -1) return null;

  const endIdx = str.indexOf('endobj', idx);
  const streamIdx = str.indexOf('stream', idx);
  
  if (streamIdx !== -1 && streamIdx < endIdx) {
    // Has stream
    let streamStart = streamIdx + 6;
    if (str[streamStart] === '\r') streamStart++;
    if (str[streamStart] === '\n') streamStart++;
    
    const streamEnd = str.indexOf('endstream', streamStart);
    const headerPart = str.substring(idx, streamIdx);
    const rawStream = buf.subarray(streamStart, streamEnd);
    return { header: headerPart, stream: rawStream };
  } else {
    return { header: str.substring(idx, endIdx) };
  }
}

// Find Page object
const pageObjMatch = str.match(/(\d+)\s+0\s+obj[\s\S]*?\/Type\s*\/Page\b[\s\S]*?endobj/);
if (pageObjMatch) {
  console.log('Full Page Object:\n', pageObjMatch[0].substring(0, 1000));
}

// Inspect 2313 0 obj
const contents = getObject(2313, 0);
if (contents && contents.stream) {
  console.log('Contents stream length:', contents.stream.length);
  try {
    const decompressed = zlib.inflateSync(contents.stream);
    console.log('Contents decompressed length:', decompressed.length);
    console.log('Contents snippet (first 1000 chars):');
    console.log(decompressed.toString('utf8').substring(0, 1000));
    fs.writeFileSync('contents_stream_decompressed.txt', decompressed);
  } catch (e) {
    console.error('Inflation error:', e.message);
  }
} else {
  console.log('Contents not found or no stream:', contents);
}

