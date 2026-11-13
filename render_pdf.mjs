import canvasPkg from 'canvas';
const { createCanvas, DOMMatrix, Image, CanvasRenderingContext2D } = canvasPkg;

globalThis.window = globalThis;
globalThis.CanvasRenderingContext2D = CanvasRenderingContext2D;
globalThis.DOMMatrix = DOMMatrix;
globalThis.Image = Image;
globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 0);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);

// Load Path2D polyfill
await import('./node_modules/path2d-polyfill/dist/path2d-polyfill.min.js');
console.log('Path2D is:', typeof globalThis.Path2D);

import fs from 'fs';

class CustomCanvasFactory {
  create(width, height) {
    const canvas = createCanvas(width, height);
    return {
      canvas,
      context: canvas.getContext('2d'),
    };
  }
  reset(canvasAndContext, width, height) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }
  destroy(canvasAndContext) {
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
}

async function main() {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const data = new Uint8Array(fs.readFileSync('Landing page.pdf'));
  const doc = await pdfjsLib.getDocument({ data }).promise;
  console.log(`Document loaded. Pages: ${doc.numPages}`);

  const page = await doc.getPage(1);
  const viewport = page.getViewport({ scale: 1.0 });
  console.log(`Viewport: width=${viewport.width}, height=${viewport.height}`);

  const canvas = createCanvas(viewport.width, viewport.height);
  const context = canvas.getContext('2d');

  console.log('Rendering page to canvas...');
  const canvasFactory = new CustomCanvasFactory();
  const renderContext = {
    canvasContext: context,
    viewport: viewport,
    canvasFactory: canvasFactory
  };

  await page.render(renderContext).promise;
  console.log('Page rendered successfully!');

  // Save full image
  fs.writeFileSync('full_page.png', canvas.toBuffer('image/png'));
  console.log('full_page.png saved!');

  // Slice into sections of 800px
  const sectionHeight = 800;
  const numSections = Math.ceil(viewport.height / sectionHeight);
  if (!fs.existsSync('sections')) fs.mkdirSync('sections');

  for (let s = 0; s < numSections; s++) {
    const startY = s * sectionHeight;
    const h = Math.min(sectionHeight, viewport.height - startY);
    const sliceCanvas = createCanvas(viewport.width, h);
    const sliceCtx = sliceCanvas.getContext('2d');
    sliceCtx.drawImage(canvas, 0, startY, viewport.width, h, 0, 0, viewport.width, h);
    fs.writeFileSync(`sections/section_${s + 1}_y${startY}.png`, sliceCanvas.toBuffer('image/png'));
    console.log(`Saved sections/section_${s + 1}_y${startY}.png`);
  }
}

main().catch(err => {
  console.error('Error in main:', err);
});
