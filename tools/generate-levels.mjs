// Kelime Avı – bölüm üretim aracı.
// Kullanım:  node tools/generate-levels.mjs
// Ne yapar:
//   1) tools/level-source.mjs içindeki her bölümü doğrular
//      (kelimeler harflerden kurulabiliyor mu, tüm harfleri kullanan kelime var mı, tekrar var mı).
//   2) Kelimeleri bulmaca gibi kesişecek şekilde ızgaraya yerleştirir.
//   3) Sonucu src/levels.js dosyasına yazar ve ekrana ASCII önizleme basar.
// Aynı girdiyle her çalıştırmada aynı sonucu verir (sabit tohumlu rastgelelik).

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { LOCATIONS, TIERS, LEVELS_PER_LOCATION, LEVEL_SOURCE } from './level-source.mjs';
import { BAN } from './kelime-ayar.mjs';
import { validate, layout, wheelOrder, ascii, canForm, chars } from './layout.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const QUIET = process.argv.includes('--quiet');
const ban = new Set(BAN);

// ---- Ana akış ----
const levels = LEVEL_SOURCE.map((src, i) => {
  validate(src, i);
  const bonus = src.bonus || [];
  for (const w of bonus) {
    if (!canForm(w, src.letters) || chars(w).length < 3 || src.words.includes(w)) throw new Error(`Bölüm ${i + 1}: bonus kelime hatalı (${w})`);
  }
  for (const w of [...src.words, ...bonus]) if (ban.has(w)) throw new Error(`Bölüm ${i + 1}: yasaklı kelime (${w})`);
  const lay = layout(src.words, 1000 + i * 17);
  if (!lay) throw new Error(`Bölüm ${i + 1}: yerleşim bulunamadı (${src.words.join(', ')})`);
  return {
    n: i + 1,
    loc: Math.floor(i / LEVELS_PER_LOCATION),
    letters: wheelOrder(src.letters, src.words, i + 1),
    rows: lay.rows,
    cols: lay.cols,
    words: lay.words,
    x: bonus,
  };
});

if (levels.length !== LOCATIONS.length * LEVELS_PER_LOCATION) {
  throw new Error(`Bölüm sayısı (${levels.length}) durak sayısıyla uyuşmuyor`);
}

const seenLetters = new Set();
for (const src of LEVEL_SOURCE) {
  const k = chars(src.letters).sort().join('');
  if (seenLetters.has(k)) throw new Error(`Aynı harfler iki bölümde kullanılmış: ${src.letters}`);
  seenLetters.add(k);
}
if (TIERS.flatMap((t) => t.locs).join(',') !== LOCATIONS.map((_, i) => i).join(',')) throw new Error('TIERS bütün durakları sırayla kapsamalı');

for (const lv of QUIET ? [] : levels) {
  console.log(`Bölüm ${lv.n} [${LOCATIONS[lv.loc].name}] harfler: ${lv.letters.join(' ')}  (${lv.cols}x${lv.rows})`);
  console.log(ascii(lv));
}

const out =
  '// Bu dosya tools/generate-levels.mjs tarafından üretildi. Elle düzenlemeyin;\n' +
  '// tools/level-source.mjs dosyasını değiştirip aracı yeniden çalıştırın.\n' +
  `const LOCATIONS = ${JSON.stringify(LOCATIONS)};\n` +
  `const TIERS = ${JSON.stringify(TIERS)};\n` +
  `const LEVELS_PER_LOCATION = ${LEVELS_PER_LOCATION};\n` +
  `const LEVELS = ${JSON.stringify(levels)};\n`;
writeFileSync(join(ROOT, 'src', 'levels.js'), out);
console.log(`\n${levels.length} bölüm src/levels.js dosyasına yazıldı.`);
