import fs from 'fs';
import canvasPkg from 'canvas';
const { createCanvas, Image } = canvasPkg;

const extractedFiles = fs.readdirSync('extracted_images').filter(f => f.endsWith('.png'));

// Load all extracted images into memory with small 32x32 thumbnails for comparison
const thumbSize = 32;
const extractedThumbs = [];

for (const file of extractedFiles) {
  const buf = fs.readFileSync(`extracted_images/${file}`);
  const img = new Image();
  img.src = buf;
  
  const c = createCanvas(thumbSize, thumbSize);
  const ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0, thumbSize, thumbSize);
  const data = ctx.getImageData(0, 0, thumbSize, thumbSize).data;
  extractedThumbs.push({ file, width: img.width, height: img.height, data });
}

console.log('Thumbs generated for extracted images.');

// Let's inspect where in the PDF operator list each image is placed!
// The PDF operator list has `cm` (transformation matrix) before `Do` (paintImageXObject)!
// That gives us the exact (x, y, width, height) of every image on the page!
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

async function mapImagePlacements() {
  const data = new Uint8Array(fs.readFileSync('Landing page.pdf'));
  const doc = await pdfjsLib.getDocument({ data }).promise;
  const page = await doc.getPage(1);
  const ops = await page.getOperatorList();

  let currentMatrix = [1, 0, 0, 1, 0, 0];
  const matrixStack = [];

  const placements = [];

  for (let i = 0; i < ops.fnArray.length; i++) {
    const fn = ops.fnArray[i];
    const args = ops.argsArray[i];

    if (fn === pdfjsLib.OPS.save) {
      matrixStack.push([...currentMatrix]);
    } else if (fn === pdfjsLib.OPS.restore) {
      if (matrixStack.length > 0) currentMatrix = matrixStack.pop();
    } else if (fn === pdfjsLib.OPS.transform) {
      // Multiply currentMatrix by args
      const [a1, b1, c1, d1, e1, f1] = currentMatrix;
      const [a2, b2, c2, d2, e2, f2] = args;
      currentMatrix = [
        a1 * a2 + c1 * b2,
        b1 * a2 + d1 * b2,
        a1 * c2 + c1 * d2,
        b1 * c2 + d1 * d2,
        a1 * e2 + c1 * f2 + e1,
        b1 * e2 + d1 * f2 + f1
      ];
    } else if (fn === pdfjsLib.OPS.paintImageXObject) {
      const imgId = args[0];
      // In PDF coordinate space:
      // The image is drawn in unit square [0,0] to [1,1] transformed by currentMatrix!
      // So width = hypot(currentMatrix[0], currentMatrix[1])
      // height = hypot(currentMatrix[2], currentMatrix[3])
      // x = currentMatrix[4]
      // y = currentMatrix[5]
      // In PDF (0,0 is bottom-left, page height is 4546)
      const pdfX = currentMatrix[4];
      const pdfY = currentMatrix[5];
      const pdfW = Math.hypot(currentMatrix[0], currentMatrix[1]);
      const pdfH = Math.hypot(currentMatrix[2], currentMatrix[3]);

      // Web / Top-Left coordinates:
      const webX = Math.round(pdfX);
      const webY = Math.round(4546 - pdfY - pdfH);
      const webW = Math.round(pdfW);
      const webH = Math.round(pdfH);

      placements.push({ imgId, webX, webY, webW, webH, pdfX, pdfY, pdfW, pdfH });
    }
  }

  console.log(`Found ${placements.length} image placements!`);
  placements.sort((a, b) => a.webY - b.webY);
  placements.forEach((p, idx) => {
    console.log(`[#${idx+1}] ${p.imgId}: at x=${p.webX}, y=${p.webY}, w=${p.webW}, h=${p.webH}`);
  });

  fs.writeFileSync('image_placements.json', JSON.stringify(placements, null, 2));
}

mapImagePlacements().catch(console.error);

