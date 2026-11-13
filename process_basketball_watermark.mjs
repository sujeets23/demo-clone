import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

async function main() {
  const img = await loadImage('extracted_images/img_19_img_p0_13_3240x3240.png');
  const w = 1200;
  const h = 1200;

  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');

  // Basketball circle parameters in original image (3240x3240)
  // Let's draw it centered
  const cx = w * 0.5;
  const cy = h * 0.5;
  const r = w * 0.46;

  // Draw circle clip
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // Draw the basketball scaled to fit circle
  // Original center is around (1630, 1600), radius around 1400
  ctx.drawImage(img, 0, 0, w, h);
  ctx.restore();

  // Convert to monochrome subtle watermark
  const imgData = ctx.getImageData(0, 0, w, h);
  const d = imgData.data;

  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] > 0) {
      // Calculate grayscale from original RGB
      const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      
      // In the Figma design, the circle background is very faint #F4F6F8 (~245)
      // and the dark basketball seams are around #D2D9E2 (~215).
      // Dark seams have low gray (e.g. 20-80) -> map to ~210-220
      // Light basketball skin has higher gray (e.g. 150-220) -> map to ~244-248
      const t = Math.min(1, Math.max(0, gray / 230));
      const val = Math.round(214 + t * 32);

      d[i] = val;         // R
      d[i + 1] = val + 2; // G (slight cool tone)
      d[i + 2] = val + 4; // B (subtle slate tone)
      d[i + 3] = 255;     // Solid opaque circle as in Figma
    }
  }

  ctx.putImageData(imgData, 0, 0);

  fs.writeFileSync('assets/img/hero-basketball-watermark.png', canvas.toBuffer('image/png'));
  console.log('Created pristine hero-basketball-watermark.png');
}

main().catch(console.error);

