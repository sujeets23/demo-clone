const fs = require('fs');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const { createCanvas } = require('@napi-rs/canvas');

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
    
    // Sample first 20 text items
    console.log('Sample text items:');
    textContent.items.slice(0, 30).forEach(item => {
      if (item.str && item.str.trim()) {
        console.log(`  [y=${Math.round(item.transform[5])}] ${item.str}`);
      }
    });

    // Check common font styles in textContent.styles
    console.log('Font styles:', Object.keys(textContent.styles).map(k => ({
      name: k,
      fontFamily: textContent.styles[k].fontFamily,
      ascent: textContent.styles[k].ascent,
      descent: textContent.styles[k].descent
    })));
  }
}

inspect().catch(err => {
  console.error(err);
});

