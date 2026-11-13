import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

async function main() {
  const img = await loadImage('chrome_screenshot.png');
  console.log(`Rendered page size: ${img.width}x${img.height}`);

  const sectionHeight = 800;
  const numSections = Math.ceil(img.height / sectionHeight);
  if (!fs.existsSync('rendered_sections')) fs.mkdirSync('rendered_sections');

  for (let s = 0; s < numSections; s++) {
    const yStart = s * sectionHeight;
    const currentHeight = Math.min(sectionHeight, img.height - yStart);
    const canvas = createCanvas(img.width, currentHeight);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, yStart, img.width, currentHeight, 0, 0, img.width, currentHeight);
    const outPath = `rendered_sections/rendered_sec_${s + 1}_y${yStart}.png`;
    fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
    console.log(`Saved ${outPath}`);
  }
}

main().catch(console.error);

