import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

async function inspect() {
  const data = new Uint8Array(fs.readFileSync('Landing page.pdf'));
  const doc = await pdfjsLib.getDocument({ data }).promise;
  console.log(`Pages: ${doc.numPages}`);

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: 1.0 });
    console.log(`Page ${i}: width=${viewport.width}, height=${viewport.height}`);

    const textContent = await page.getTextContent();
    const fonts = new Set();
    textContent.items.forEach(item => {
      if (item.fontName) fonts.add(item.fontName);
    });
    console.log('Fonts found:', Array.from(fonts));
    console.log('Styles:', textContent.styles);

    console.log(`Total text items: ${textContent.items.length}`);
    const lines = [];
    textContent.items.forEach((item, idx) => {
      if (item.str && item.str.trim()) {
        lines.push(`[x=${Math.round(item.transform[4])}, y=${Math.round(item.transform[5])}, size=${Math.round(item.transform[0])}, font=${item.fontName}]: "${item.str}"`);
      }
    });
    fs.writeFileSync('text_extracted.txt', lines.join('\n'));
    console.log(`Wrote ${lines.length} lines to text_extracted.txt`);
  }
}

inspect().catch(err => {
  console.error(err);
});
