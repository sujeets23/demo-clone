import fs from 'fs';
import canvasPkg from 'canvas';
const { createCanvas, Image } = canvasPkg;

const fullPageBuf = fs.readFileSync('full_page.png');
const fullImg = new Image();
fullImg.src = fullPageBuf;

// Scan y from 0 to 120, x from 100 to 300 to find dark pixels (logo)
const c = createCanvas(300, 150);
const ctx = c.getContext('2d');
ctx.drawImage(fullImg, 50, 0, 300, 150, 0, 0, 300, 150);
const imgData = ctx.getImageData(0, 0, 300, 150);

let minX = 300, maxX = 0, minY = 150, maxY = 0;
for (let y = 0; y < 150; y++) {
  for (let x = 0; x < 300; x++) {
    const idx = (y * 300 + x) * 4;
    const r = imgData.data[idx];
    const g = imgData.data[idx + 1];
    const b = imgData.data[idx + 2];
    // If not pure white
    if (r < 220 || g < 220 || b < 220) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

console.log(`Logo bounds within (50, 0): minX=${minX}, maxX=${maxX}, minY=${minY}, maxY=${maxY}`);
const realX = 50 + minX - 4;
const realY = minY - 4;
const realW = (maxX - minX) + 8;
const realH = (maxY - minY) + 8;
console.log(`Absolute logo bounds: x=${realX}, y=${realY}, w=${realW}, h=${realH}`);

// Save tightly cropped logo
const logoCanvas = createCanvas(realW, realH);
const logoCtx = logoCanvas.getContext('2d');
logoCtx.drawImage(fullImg, realX, realY, realW, realH, 0, 0, realW, realH);
// Make white background transparent
const logoData = logoCtx.getImageData(0, 0, realW, realH);
for (let i = 0; i < logoData.data.length; i += 4) {
  const r = logoData.data[i];
  const g = logoData.data[i + 1];
  const b = logoData.data[i + 2];
  const brightness = (r + g + b) / 3;
  // If near white, alpha = 255 - brightness
  if (brightness > 240) {
    logoData.data[i + 3] = 0;
  } else if (brightness > 180) {
    logoData.data[i + 3] = Math.round((255 - brightness) * (255 / 75));
  }
}
logoCtx.putImageData(logoData, 0, 0);
fs.writeFileSync('public/images/logo.png', logoCanvas.toBuffer('image/png'));
console.log('Saved transparent logo.png!');

