const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const dir = path.join(root, 'assets', 'quran_image');
const out = path.join(root, 'src', 'data', 'quranImages.ts');
const lines = [
  '// AUTO-GENERATED FILE. Do not edit manually.',
  "import type { ImageSourcePropType } from 'react-native';",
  '',
  'export const quranImages: Record<number, ImageSourcePropType> = {',
];
let found = 0;
for (let i = 1; i <= 604; i++) {
  const file = path.join(dir, `${i}.png`);
  if (fs.existsSync(file)) {
    lines.push(`  ${i}: require('../../assets/quran_image/${i}.png'),`);
    found++;
  }
}
lines.push('};', '');
fs.writeFileSync(out, lines.join('\n'));
console.log(`Generated ${out} with ${found} Quran page images.`);
