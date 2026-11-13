import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

async function extractImages() {
  const data = new Uint8Array(fs.readFileSync('Landing page.pdf'));
  const doc = await pdfjsLib.getDocument({ data }).promise;
  const page = await doc.getPage(1);
  const ops = await page.getOperatorList();
  console.log('Total operators:', ops.fnArray.length);

  // Look for paintImageXObject or similar
  const imageNames = [];
  for (let i = 0; i < ops.fnArray.length; i++) {
    const fn = ops.fnArray[i];
    const args = ops.argsArray[i];
    // pdfjsLib.OPS.paintImageXObject
    if (fn === pdfjsLib.OPS.paintImageXObject || fn === pdfjsLib.OPS.paintInlineImageXObject) {
      imageNames.push({ fn, args });
    }
  }
  console.log('Images found in operators:', imageNames.length, imageNames.slice(0, 10));

  // Check commonObjs and objs
  page.objs.get(imageNames[0]?.args[0], (obj) => {
    console.log('Obj callback:', Object.keys(obj || {}));
  });
}

extractImages().catch(console.error);

