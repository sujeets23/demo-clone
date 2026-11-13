import fs from 'fs';
import canvasPkg from 'canvas';
const { createCanvas, Image } = canvasPkg;

// Let's create an HTML visual index or small thumbnails of all extracted_images
// so we can see which image is which!
const files = fs.readdirSync('extracted_images').filter(f => f.endsWith('.png'));

let html = `<!DOCTYPE html><html><head><style>
body { font-family: sans-serif; display: flex; flex-wrap: wrap; gap: 10px; background: #eee; }
.card { background: white; padding: 8px; border-radius: 6px; width: 220px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); font-size: 11px; }
img { max-width: 100%; height: 140px; object-fit: contain; background: #fafafa; }
</style></head><body>`;

for (const file of files) {
  html += `<div class="card">
    <img src="../extracted_images/${file}" />
    <div><strong>${file}</strong></div>
  </div>`;
}

html += `</body></html>`;
fs.writeFileSync('extracted_images/index.html', html);
console.log('Saved extracted_images/index.html');

