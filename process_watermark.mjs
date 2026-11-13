import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

async function processWatermark() {
  const img = await loadImage('assets/img/hero-basketball-watermark.png');
  const w = img.width;
  const h = img.height;

  // Create canvas for circular basketball
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');

  // Draw circular clip path centered on the basketball
  const cx = w * 0.505;
  const cy = h * 0.495;
  const r = w * 0.44;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // Draw image
  ctx.drawImage(img, 0, 0);
  ctx.restore();

  // Get image data and convert to grayscale + very light tint
  const imgData = ctx.getImageData(0, 0, w, h);
  const d = imgData.data;

  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] > 0) {
      // Grayscale
      const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      // Map to faint subtle grey like Figma design (#F1F5F9 to #E2E8F0)
      // In Figma section_1_y0.png: the basketball circle background is #F6F8FA, lines are #E2E8F0
      const norm = gray / 255;
      const val = Math.round(238 + norm * 12);
      d[i] = val;
      d[i + 1] = val + 2;
      d[i + 2] = val + 5;
      d[i + 3] = Math.round(d[i + 3] * 0.95);
    }
  }

  ctx.putImageData(imgData, 0, 0);

  fs.writeFileSync('assets/img/hero-basketball-watermark.png', canvas.toBuffer('image/png'));
  console.log('Processed hero-basketball-watermark.png successfully!');
}

processWatermark().catch(console.error);

