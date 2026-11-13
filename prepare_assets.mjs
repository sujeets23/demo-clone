import fs from 'fs';
import path from 'path';

const targetDir = 'assets/images';
if (!fs.existsSync('assets')) fs.mkdirSync('assets');
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

// Copy logo
if (fs.existsSync('public/images/logo.png')) {
  fs.copyFileSync('public/images/logo.png', path.join(targetDir, 'logo.png'));
}

// Map the extracted image IDs from image_placements to clean semantic names
const imageMap = {
  // Hero
  'img_p0_13': 'hero-basketball-watermark.png',
  'img_p0_15': 'hero-basketball-player.png',
  'img_p0_16': 'today-runner.png',
  'img_p0_19': 'today-indycar.png',

  // Categories
  'img_p0_9': 'cat-football.png',
  'img_p0_10': 'cat-basketball.png',
  'img_p0_11': 'cat-carsport.png',
  'img_p0_12': 'cat-tabletennis.png',

  // Trending
  'img_p0_1': 'trending-horse.png',
  'img_p0_2': 'trending-cycling-small.png',
  'img_p0_3': 'trending-boxing.png',
  'img_p0_4': 'trending-cycling-feature.png',

  // Banner
  'img_p0_45': 'banner-messi-football.png',

  // Recent
  'img_p0_28': 'recent-taekwondo-main.png',
  'img_p0_29': 'recent-taekwondo-overlay.png',
  'img_p0_34': 'recent-thumb-taekwondo.png',
  'img_p0_36': 'recent-thumb-golf.png',
  'img_p0_35': 'recent-thumb-cricket.png',

  // Clubs
  'img_p0_22': 'club-mancity.png',
  'img_p0_23': 'club-liverpool.png',
  'img_p0_24': 'club-chelsea.png',
  'img_p0_25': 'club-tottenham.png',
  'img_p0_26': 'club-arsenal.png',
  'img_p0_27': 'club-manunited.png',

  // Articles
  'img_p0_37': 'article-basketball-shoes.png',
  'img_p0_39': 'article-hockey-player.png',
  'img_p0_41': 'article-badminton-racket.png',
  'img_p0_38': 'author-jake-will.png',
  'img_p0_40': 'author-foxi-zacon.png',
  'img_p0_42': 'author-bong-lozada.png',

  // Newsletter
  'img_p0_43': 'newsletter-quarterback.png',
};

// Also copy from public/images any already nicely cropped composites:
const publicCopies = [
  'hero-composite.png',
  'banner-football.png',
  'trend-cycling-large.png',
  'newsletter-banner.png'
];
for (const p of publicCopies) {
  if (fs.existsSync(`public/images/${p}`)) {
    fs.copyFileSync(`public/images/${p}`, path.join(targetDir, p));
  }
}

// Find files in extracted_images
const extractedFiles = fs.readdirSync('extracted_images');
for (const [imgId, cleanName] of Object.entries(imageMap)) {
  const match = extractedFiles.find(f => f.includes(`_${imgId}_`));
  if (match) {
    fs.copyFileSync(path.join('extracted_images', match), path.join(targetDir, cleanName));
    console.log(`Mapped ${match} -> ${cleanName}`);
  } else {
    console.warn(`No match found for ${imgId}`);
  }
}

console.log('All assets prepared in assets/images!');

