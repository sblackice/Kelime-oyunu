// Kelime Avı – bölüm öneri aracı (yalnızca geliştirme sırasında elle çalıştırılır).
// Kullanım:  node tools/suggest-levels.mjs            → tools/level-source.mjs dosyasını yeniden yazar
//            node tools/suggest-levels.mjs --dry      → yalnızca ekrana basar
// Ne yapar:
//   1) Sözlükten (tools/sozluk/) yaygın kelimeleri seçer.
//   2) Her bölüm için bir ana kelime ve onun harfleriyle kurulabilen yaygın kelimeleri bulur.
//   3) Bulmacaya yerleşebildiğini dener.
//   4) Bulmacada olmayan ama sözlükte bulunan kelimeleri "bonus kelime" olarak ekler.
// Sonuç elle gözden geçirilir; istenmeyen kelimeler tools/kelime-ayar.mjs içindeki listelere eklenir.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { loadDict } from './sozluk.mjs';
import { canForm, chars, layout } from './layout.mjs';
import { LOCATIONS, TIERS, LEVELS_PER_LOCATION, LENGTH_PLAN, PINNED, BAN, GRID_AVOID, BASE_AVOID } from './kelime-ayar.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const DRY = process.argv.includes('--dry');
const d = loadDict(join(HERE, 'sozluk'));
const len = (w) => chars(w).length;
const f = (w) => d.freq.get(w) || 0;

const ban = new Set(BAN);
const gridAvoid = new Set([...BAN, ...GRID_AVOID]);
const baseAvoid = new Set(BASE_AVOID);
const GRID_MIN_FREQ = 600;
const BASE_MIN_FREQ = 900;

// Çekimli görünen biçimleri ele (ör. EVLER, ADAMDAN, GELDİ, AÇACAK)
const SUFFIXES = ['LAR', 'LER', 'DAN', 'DEN', 'TAN', 'TEN', 'ACAK', 'ECEK', 'DI', 'Dİ', 'DU', 'DÜ', 'TI', 'Tİ', 'TU', 'TÜ', 'MIŞ', 'MİŞ', 'MUŞ', 'MÜŞ', 'IYOR', 'İYOR', 'SIN', 'SİN', 'SUN', 'SÜN', 'ARAK', 'EREK', 'INCA', 'İNCE'];
function looksInflected(w) {
  for (const s of SUFFIXES) {
    if (!w.endsWith(s)) continue;
    const st = w.slice(0, -s.length);
    if (len(st) >= 2 && (d.lemmas.has(st) || d.stems.has(st))) return true;
  }
  return false;
}

const common = [...d.lemmas].filter((w) => len(w) >= 3 && len(w) <= 7 && f(w) >= GRID_MIN_FREQ && !gridAvoid.has(w) && !looksInflected(w));
const allValid = [...new Set([...d.lemmas, ...d.stems])].filter((w) => len(w) >= 3 && len(w) <= 7 && !ban.has(w));

const WORDS_FOR = { 3: [2, 2], 4: [3, 4], 5: [4, 5], 6: [5, 6], 7: [6, 7] };
const used = new Map();           // kelime → kaç bölümde kullanıldı
const usedBases = new Set();      // harf kümeleri
const sig = (w) => chars(w).sort().join('');

const pinnedBy = {};
for (const p of PINNED) (pinnedBy[len(p.letters)] ||= []).push(p);

const basesBy = {};
for (const n of [3, 4, 5, 6, 7]) {
  basesBy[n] = common
    .filter((w) => len(w) === n && f(w) >= BASE_MIN_FREQ && !baseAvoid.has(w))
    .sort((a, b) => f(b) - f(a));
}

function pickLevel(n, seed) {
  const pin = pinnedBy[n] && pinnedBy[n].shift();
  if (pin) { usedBases.add(sig(pin.letters)); pin.words.forEach((w) => used.set(w, (used.get(w) || 0) + 1)); return pin; }
  const [minW, maxW] = WORDS_FOR[n];
  const list = basesBy[n];
  while (list.length) {
    const base = list.shift();
    if (usedBases.has(sig(base))) continue;
    const subs = common.filter((w) => w !== base && canForm(w, base));
    if (subs.length + 1 < minW) continue;
    // puan: yaygınlık + uzunluk − daha önce kullanılma
    const score = (w) => Math.log10(f(w)) + len(w) * 0.55 - (used.get(w) || 0) * 0.9;
    const ranked = subs.sort((a, b) => score(b) - score(a));
    for (let k = Math.min(maxW - 1, ranked.length); k >= minW - 1; k--) {
      const words = [base, ...ranked.slice(0, k)];
      if (layout(words, seed, 400)) {
        usedBases.add(sig(base));
        words.forEach((w) => used.set(w, (used.get(w) || 0) + 1));
        return { letters: base, words };
      }
    }
  }
  throw new Error(`${n} harfli yeterli ana kelime kalmadı`);
}

const total = LOCATIONS.length * LEVELS_PER_LOCATION;
if (LENGTH_PLAN.length !== total) throw new Error(`LENGTH_PLAN ${LENGTH_PLAN.length} ≠ ${total}`);
const out = [];
LENGTH_PLAN.forEach((n, i) => {
  const lv = pickLevel(n, 1000 + i * 17);
  const grid = new Set(lv.words);
  const bonus = allValid.filter((w) => !grid.has(w) && canForm(w, lv.letters)).sort((a, b) => a.localeCompare(b, 'tr'));
  out.push({ letters: lv.letters, words: lv.words, bonus });
});

out.forEach((lv, i) => {
  console.log(`${String(i + 1).padStart(3)} ${lv.letters.padEnd(8)} ${lv.words.slice(1).join(' ')}   | +${lv.bonus.length}${process.argv.includes('--bonus') ? ' ' + lv.bonus.join(' ') : ''}`);
});

if (!DRY) {
  const q = (a) => '[' + a.map((w) => `'${w}'`).join(', ') + ']';
  let s = '// Kelime Avı – bölümlerin kaynak verisi.\n';
  s += '// Bu dosya tools/suggest-levels.mjs tarafından sözlükten üretildi ve elle gözden geçirildi.\n';
  s += '// letters: çemberdeki harfler (ilk kelime tüm harfleri kullanır)\n';
  s += '// words:   bulmacaya yerleşen kelimeler\n';
  s += '// bonus:   bulmacada olmayan ama kabul edilen kelimeler (bonus elmas kazandırır)\n';
  s += "export { LOCATIONS, TIERS, LEVELS_PER_LOCATION } from './kelime-ayar.mjs';\n\n";
  s += 'export const LEVEL_SOURCE = [\n';
  out.forEach((lv, i) => {
    if (i % LEVELS_PER_LOCATION === 0) s += `\n  // ${LOCATIONS[i / LEVELS_PER_LOCATION].name}\n`;
    s += `  { letters: '${lv.letters}', words: ${q(lv.words)}, bonus: ${q(lv.bonus)} },\n`;
  });
  s += '];\n';
  writeFileSync(join(HERE, 'level-source.mjs'), s);
  console.log(`\n${out.length} bölüm tools/level-source.mjs dosyasına yazıldı.`);
}
