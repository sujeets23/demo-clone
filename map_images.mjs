import fs from 'fs';
import canvasPkg from 'canvas';
const { createCanvas, Image } = canvasPkg;

const files = fs.readdirSync('extracted_images').filter(f => f.endsWith('.png'));

console.log(`Found ${files.length} images`);
for (const file of files) {
  const buf = fs.readFileSync(`extracted_images/${file}`);
  const img = new Image();
  img.src = buf;
  console.log(`${file}: width=${img.width}, height=${img.height}, ratio=${(img.width/img.height).toFixed(2)}`);
}

