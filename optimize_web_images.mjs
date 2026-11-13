import fs from 'fs';
import path from 'path';
import canvasPkg from 'canvas';
const { createCanvas, Image } = canvasPkg;

const srcDir = 'assets/images';
const outDir = 'assets/img';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Copy logo directly
fs.copyFileSync(path.join(srcDir, 'logo.png'), path.join(outDir, 'logo.png'));

// List of images and max display widths (2x for retina)
const specs = {
  // Hero
  'hero-basketball-player.png': { maxW: 1400 },
  'hero-basketball-watermark.png': { maxW: 900 },
  'today-runner.png': { maxW: 600 },
  'today-indycar.png': { maxW: 600 },

  // Categories
  'cat-football.png': { maxW: 600 },
  'cat-basketball.png': { maxW: 600 },
  'cat-carsport.png': { maxW: 600 },
  'cat-tabletennis.png': { maxW: 600 },

  // Trending
  'trending-horse.png': { maxW: 600 },
  'trending-cycling-small.png': { maxW: 600 },
  'trending-boxing.png': { maxW: 600 },
  'trending-cycling-feature.png': { maxW: 1200 },

  // Banner
  'banner-messi-football.png': { maxW: 1600 },

  // Recent
  'recent-taekwondo-main.png': { maxW: 600 },
  'recent-taekwondo-overlay.png': { maxW: 600 },
  'recent-thumb-taekwondo.png': { maxW: 200 },
  'recent-thumb-golf.png': { maxW: 200 },
  'recent-thumb-cricket.png': { maxW: 200 },

  // Clubs
  'club-mancity.png': { maxW: 100 },
  'club-liverpool.png': { maxW: 100 },
  'club-chelsea.png': { maxW: 100 },
  'club-tottenham.png': { maxW: 100 },
  'club-arsenal.png': { maxW: 100 },
  'club-manunited.png': { maxW: 100 },

  // Articles
  'article-basketball-shoes.png': { maxW: 800 },
  'article-hockey-player.png': { maxW: 800 },
  'article-badminton-racket.png': { maxW: 800 },
  'author-jake-will.png': { maxW: 150 },
  'author-foxi-zacon.png': { maxW: 150 },
  'author-bong-lozada.png': { maxW: 150 },

  // Newsletter
  'newsletter-quarterback.png': { maxW: 1000 },
};

for (const [filename, { maxW }] of Object.entries(specs)) {
  const srcPath = path.join(srcDir, filename);
  if (!fs.existsSync(srcPath)) {
    console.warn(`File not found: ${srcPath}`);
    continue;
  }
  const buf = fs.readFileSync(srcPath);
  const img = new Image();
  img.src = buf;

  let w = img.width;
  let h = img.height;
  if (w > maxW) {
    const scale = maxW / w;
    w = Math.round(w * scale);
    h = Math.round(h * scale);
  }

  const c = createCanvas(w, h);
  const ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);

  const outPath = path.join(outDir, filename);
  fs.writeFileSync(outPath, c.toBuffer('image/png'));
  console.log(`Optimized ${filename}: ${img.width}x${img.height} -> ${w}x${h} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
}

console.log('All images optimized for web!');

