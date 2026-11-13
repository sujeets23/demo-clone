import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import canvasPkg from 'canvas';
const { createCanvas } = canvasPkg;

async function extractEmbeddedImages() {
  const data = new Uint8Array(fs.readFileSync('Landing page.pdf'));
  const doc = await pdfjsLib.getDocument({ data }).promise;
  const page = await doc.getPage(1);
  const ops = await page.getOperatorList();
  
  if (!fs.existsSync('extracted_images')) fs.mkdirSync('extracted_images');

  let imgIdx = 0;
  for (let i = 0; i < ops.fnArray.length; i++) {
    if (ops.fnArray[i] === pdfjsLib.OPS.paintImageXObject) {
      const objId = ops.argsArray[i][0];
      page.objs.get(objId, (img) => {
        if (!img) return;
        imgIdx++;
        console.log(`Image ${imgIdx}: id=${objId}, width=${img.width}, height=${img.height}, kind=${img.kind}`);
        if (img.data) {
          const c = createCanvas(img.width, img.height);
          const ctx = c.getContext('2d');
          const imgData = ctx.createImageData(img.width, img.height);
          
          if (img.data.length === img.width * img.height * 4) {
            imgData.data.set(img.data);
          } else if (img.data.length === img.width * img.height * 3) {
            let src = 0, dst = 0;
            while (src < img.data.length) {
              imgData.data[dst] = img.data[src];
              imgData.data[dst+1] = img.data[src+1];
              imgData.data[dst+2] = img.data[src+2];
              imgData.data[dst+3] = 255;
              src += 3;
              dst += 4;
            }
          } else if (img.data.length === img.width * img.height) {
            let src = 0, dst = 0;
            while (src < img.data.length) {
              const v = img.data[src];
              imgData.data[dst] = v;
              imgData.data[dst+1] = v;
              imgData.data[dst+2] = v;
              imgData.data[dst+3] = 255;
              src++;
              dst += 4;
            }
          }
          ctx.putImageData(imgData, 0, 0);
          fs.writeFileSync(`extracted_images/img_${imgIdx}_${objId}_${img.width}x${img.height}.png`, c.toBuffer('image/png'));
        }
      });
    }
  }
}

extractEmbeddedImages().catch(console.error);
