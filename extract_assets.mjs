import fs from 'fs';
import canvasPkg from 'canvas';
const { createCanvas, Image } = canvasPkg;

const fullPageBuf = fs.readFileSync('full_page.png');
const fullImg = new Image();
fullImg.src = fullPageBuf;

if (!fs.existsSync('public')) fs.mkdirSync('public');
if (!fs.existsSync('public/images')) fs.mkdirSync('public/images');

function crop(x, y, w, h, outPath) {
  const c = createCanvas(w, h);
  const ctx = c.getContext('2d');
  ctx.drawImage(fullImg, x, y, w, h, 0, 0, w, h);
  fs.writeFileSync(`public/images/${outPath}`, c.toBuffer('image/png'));
  console.log(`Saved public/images/${outPath} (${w}x${h})`);
}

// 1. Logo "Sport News"
// from y=35 to 85, x=130 to 290
crop(130, 35, 160, 50, 'logo.png');

// 2. Hero basketball player + ball + watermark (or cutout)
// In section 1, hero graphic extends from x=40, y=170 to x=1000, y=890
crop(40, 160, 960, 750, 'hero-composite.png');
// Also just the player if needed
crop(280, 210, 720, 700, 'hero-player.png');

// 3. Right side "Today" cards:
// Card 1: Runner
// x=1033, y=325, w=272, h=165
crop(1033, 325, 272, 165, 'today-runner.png');
// Card 2: Indycar
// x=1033, y=652, w=272, h=165
crop(1033, 652, 272, 165, 'today-indycar.png');

// 4. Category images:
// Soccer ball: x=135, y=1140, w=270, h=280
crop(135, 1140, 270, 280, 'cat-football.png');
// Basketball on court: x=435, y=960, w=270, h=230
crop(435, 960, 270, 230, 'cat-basketball.png');
// Car sport: x=735, y=1140, w=270, h=280
crop(735, 1140, 270, 280, 'cat-carsport.png');
// Table tennis: x=1035, y=960, w=270, h=280
crop(1035, 960, 270, 280, 'cat-tabletennis.png');

// 5. Trending News:
// Horse racing thumb: x=170, y=1680, w=235, h=145
crop(170, 1680, 235, 145, 'trend-horse.png');
// Cycling thumb: x=170, y=1860, w=235, h=145
crop(170, 1860, 235, 145, 'trend-cycling-small.png');
// Boxing thumb: x=170, y=2040, w=235, h=145
crop(170, 2040, 235, 145, 'trend-boxing.png');
// USA Cycling hero banner: x=735, y=1560, w=570, h=635
crop(735, 1560, 570, 635, 'trend-cycling-large.png');

// 6. Football Banner (Lionel Messi):
// x=135, y=2280, w=1170, h=520
crop(135, 2280, 1170, 520, 'banner-football.png');

// 7. Recent News:
// Taekwondo main: x=135, y=2930, w=270, h=300
crop(135, 2930, 270, 300, 'recent-taekwondo-main.png');
// Taekwondo thumb: x=450, y=2945, w=70, h=65
crop(450, 2945, 70, 65, 'recent-thumb-1.png');
// Golf thumb: x=450, y=3025, w=70, h=65
crop(450, 3025, 70, 65, 'recent-thumb-2.png');
// Cricket thumb: x=450, y=3105, w=70, h=65
crop(450, 3105, 70, 65, 'recent-thumb-3.png');

// 8. Clubs Logos:
// From extracted images or crop
crop(785, 2960, 22, 22, 'club-1.png');
crop(785, 3000, 22, 22, 'club-2.png');
crop(785, 3040, 22, 22, 'club-3.png');
crop(785, 3080, 22, 22, 'club-4.png');
crop(785, 3120, 22, 22, 'club-5.png');
crop(785, 3160, 22, 22, 'club-6.png');

// 9. Sports Articles:
// Basketball shoe: x=135, y=3365, w=370, h=245
crop(135, 3365, 370, 245, 'article-1.png');
// Hockey player: x=535, y=3365, w=370, h=245
crop(535, 3365, 370, 245, 'article-2.png');
// Badminton: x=935, y=3365, w=370, h=245
crop(935, 3365, 370, 245, 'article-3.png');
// Avatars:
crop(135, 3630, 42, 42, 'author-1.png');
crop(535, 3630, 42, 42, 'author-2.png');
crop(935, 3630, 42, 42, 'author-3.png');

// 10. Newsletter banner:
// x=135, y=4050, w=1170, h=360
crop(135, 4050, 1170, 360, 'newsletter-banner.png');
// Also just the football player cutout with spiral
crop(780, 4040, 525, 370, 'newsletter-player.png');

