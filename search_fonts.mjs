import fs from 'fs';

const buf = fs.readFileSync('Landing page.pdf');
const str = buf.toString('latin1');

const fontNames = [
  'Inter', 'Roboto', 'Helvetica', 'Arial', 'Poppins', 'Montserrat',
  'Plus Jakarta Sans', 'PlusJakartaSans', 'DM Sans', 'DMSans',
  'Outfit', 'Cabinet Grotesk', 'CabinetGrotesk', 'Satoshi', 'General Sans',
  'GeneralSans', 'Syne', 'Clash Display', 'ClashDisplay', 'Rubik',
  'Manrope', 'Urbanist', 'Space Grotesk', 'SpaceGrotesk', 'Epilogue',
  'Playfair', 'Cinzel', 'Oswald', 'Bebas', 'Anton', 'Barlow',
  'Sport News', 'Pacifico', 'Caveat', 'Kaushan', 'Satisfy', 'Dancing Script'
];

for (const f of fontNames) {
  if (str.toLowerCase().includes(f.toLowerCase())) {
    console.log(`Found font keyword: ${f}`);
  }
}

