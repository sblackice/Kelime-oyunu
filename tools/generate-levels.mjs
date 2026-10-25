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
import { LOCATIONS, LEVELS_PER_LOCATION, LEVEL_SOURCE } from './level-source.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MAX_COLS = 9;
const MAX_ROWS = 9;

// Basit, tohumlu rastgele sayı üreteci (mulberry32)
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const chars = (s) => [...s];

function countLetters(s) {
  const m = new Map();
  for (const ch of chars(s)) m.set(ch, (m.get(ch) || 0) + 1);
  return m;
}

function canForm(word, letters) {
  const pool = countLetters(letters);
  for (const ch of chars(word)) {
    const n = pool.get(ch) || 0;
    if (n === 0) return false;
    pool.set(ch, n - 1);
  }
  return true;
}

function validate(src, idx) {
  const errors = [];
  const n = chars(src.letters).length;
  const seen = new Set();
  for (const w of src.words) {
    if (w !== w.toLocaleUpperCase('tr-TR')) errors.push(`${w}: büyük harf değil`);
    if (!canForm(w, src.letters)) errors.push(`${w}: ${src.letters} harfleriyle kurulamıyor`);
    if (chars(w).length < 3) errors.push(`${w}: 3 harften kısa`);
    if (seen.has(w)) errors.push(`${w}: tekrar ediyor`);
    seen.add(w);
  }
  if (!src.words.some((w) => chars(w).length === n)) errors.push('tüm harfleri kullanan kelime yok');
  if (errors.length) throw new Error(`Bölüm ${idx + 1}: ${errors.join('; ')}`);
}

// ---- Izgara yerleşimi ----
const key = (r, c) => `${r},${c}`;

function tryPlace(grid, word, r, c, d) {
  const L = chars(word);
  const dr = d === 'v' ? 1 : 0;
  const dc = d === 'h' ? 1 : 0;
  // kelimenin hemen önü ve arkası boş olmalı
  if (grid.has(key(r - dr, c - dc))) return -1;
  if (grid.has(key(r + dr * L.length, c + dc * L.length))) return -1;
  let crossings = 0;
  for (let k = 0; k < L.length; k++) {
    const rr = r + dr * k;
    const cc = c + dc * k;
    const cell = grid.get(key(rr, cc));
    if (cell) {
      if (cell.ch !== L[k] || cell.dirs.has(d)) return -1;
      crossings++;
    } else {
      // yan komşular boş olmalı (istenmeyen kelimeler oluşmasın)
      if (d === 'h' && (grid.has(key(rr - 1, cc)) || grid.has(key(rr + 1, cc)))) return -1;
      if (d === 'v' && (grid.has(key(rr, cc - 1)) || grid.has(key(rr, cc + 1)))) return -1;
    }
  }
  return crossings;
}

function commit(grid, word, r, c, d) {
  const L = chars(word);
  const dr = d === 'v' ? 1 : 0;
  const dc = d === 'h' ? 1 : 0;
  for (let k = 0; k < L.length; k++) {
    const kk = key(r + dr * k, c + dc * k);
    const cell = grid.get(kk) || { ch: L[k], dirs: new Set() };
    cell.dirs.add(d);
    grid.set(kk, cell);
  }
}

function bbox(placed) {
  let minR = Infinity, minC = Infinity, maxR = -Infinity, maxC = -Infinity;
  for (const p of placed) {
    const len = chars(p.w).length;
    const r2 = p.d === 'v' ? p.r + len - 1 : p.r;
    const c2 = p.d === 'h' ? p.c + len - 1 : p.c;
    minR = Math.min(minR, p.r); minC = Math.min(minC, p.c);
    maxR = Math.max(maxR, r2); maxC = Math.max(maxC, c2);
  }
  return { minR, minC, rows: maxR - minR + 1, cols: maxC - minC + 1 };
}

function layout(words, seed) {
  const rand = rng(seed);
  let best = null;
  for (let attempt = 0; attempt < 3000; attempt++) {
    const [first, ...rest] = words;
    // sonraki kelimeler: uzunluğa göre, eşitlerde rastgele
    const order = rest
      .map((w) => ({ w, k: chars(w).length + rand() * 1.5 }))
      .sort((a, b) => b.k - a.k)
      .map((x) => x.w);
    const grid = new Map();
    const placed = [{ w: first, r: 0, c: 0, d: 'h' }];
    commit(grid, first, 0, 0, 'h');
    let totalCross = 0;
    let ok = true;
    for (const w of order) {
      const L = chars(w);
      const cands = [];
      for (const p of placed) {
        const P = chars(p.w);
        const d = p.d === 'h' ? 'v' : 'h';
        for (let i = 0; i < P.length; i++) {
          for (let j = 0; j < L.length; j++) {
            if (P[i] !== L[j]) continue;
            const r = p.d === 'h' ? p.r - j : p.r + i;
            const c = p.d === 'h' ? p.c + i : p.c - j;
            const x = tryPlace(grid, w, r, c, d);
            if (x > 0) cands.push({ r, c, d, x });
          }
        }
      }
      if (!cands.length) { ok = false; break; }
      // aday puanı: kesişim sayısı + sığma + rastgelelik
      for (const cd of cands) {
        const bb = bbox([...placed, { w, r: cd.r, c: cd.c, d: cd.d }]);
        cd.s = bb.rows * bb.cols - cd.x * 4 + rand() * 6;
      }
      cands.sort((a, b) => a.s - b.s);
      const pick = cands[Math.floor(rand() * Math.min(3, cands.length))];
      commit(grid, w, pick.r, pick.c, pick.d);
      placed.push({ w, r: pick.r, c: pick.c, d: pick.d });
      totalCross += pick.x;
    }
    if (!ok) continue;
    const bb = bbox(placed);
    if (bb.cols > MAX_COLS || bb.rows > MAX_ROWS) continue;
    // telefon ekranına uygunluk: alanı küçük, en/boy dengeli olsun
    const score = bb.rows * bb.cols + Math.abs(bb.cols - bb.rows) * 2 + Math.max(0, bb.rows - bb.cols) * 3 - totalCross * 3;
    if (!best || score < best.score) {
      best = {
        score,
        rows: bb.rows,
        cols: bb.cols,
        words: placed.map((p) => ({ w: p.w, r: p.r - bb.minR, c: p.c - bb.minC, d: p.d })),
      };
    }
  }
  return best;
}

// Çemberdeki harf sırası: kelimeleri saat yönünde doğrudan okutmasın
function wheelOrder(letters, words, seed) {
  const rand = rng(seed * 7 + 3);
  const L = chars(letters);
  for (let t = 0; t < 200; t++) {
    const a = [...L];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    const ring = a.join('') + a.join('');
    if (!words.some((w) => ring.includes(w))) return a;
  }
  return L;
}

function ascii(level) {
  const g = Array.from({ length: level.rows }, () => Array(level.cols).fill('·'));
  for (const p of level.words) {
    chars(p.w).forEach((ch, k) => {
      const r = p.d === 'v' ? p.r + k : p.r;
      const c = p.d === 'h' ? p.c + k : p.c;
      g[r][c] = ch;
    });
  }
  return g.map((row) => '   ' + row.join(' ')).join('\n');
}

// ---- Ana akış ----
const levels = LEVEL_SOURCE.map((src, i) => {
  validate(src, i);
  const lay = layout(src.words, 1000 + i * 17);
  if (!lay) throw new Error(`Bölüm ${i + 1}: yerleşim bulunamadı (${src.words.join(', ')})`);
  return {
    n: i + 1,
    loc: Math.floor(i / LEVELS_PER_LOCATION),
    letters: wheelOrder(src.letters, src.words, i + 1),
    rows: lay.rows,
    cols: lay.cols,
    words: lay.words,
  };
});

if (levels.length !== LOCATIONS.length * LEVELS_PER_LOCATION) {
  throw new Error(`Bölüm sayısı (${levels.length}) durak sayısıyla uyuşmuyor`);
}

for (const lv of levels) {
  console.log(`Bölüm ${lv.n} [${LOCATIONS[lv.loc].name}] harfler: ${lv.letters.join(' ')}  (${lv.cols}x${lv.rows})`);
  console.log(ascii(lv));
}

const out =
  '// Bu dosya tools/generate-levels.mjs tarafından üretildi. Elle düzenlemeyin;\n' +
  '// tools/level-source.mjs dosyasını değiştirip aracı yeniden çalıştırın.\n' +
  `const LOCATIONS = ${JSON.stringify(LOCATIONS, null, 1)};\n` +
  `const LEVELS_PER_LOCATION = ${LEVELS_PER_LOCATION};\n` +
  `const LEVELS = ${JSON.stringify(levels)};\n`;
writeFileSync(join(ROOT, 'src', 'levels.js'), out);
console.log(`\n${levels.length} bölüm src/levels.js dosyasına yazıldı.`);
