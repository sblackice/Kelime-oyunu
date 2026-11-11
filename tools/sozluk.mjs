// Kelime Avı – sözlük yardımcıları (yalnızca geliştirme sırasında kullanılır).
// Kaynaklar (depoya eklenmez; tools/sozluk/ klasörüne indirilir, bkz. README):
//   master-dictionary.dict → Zemberek-NLP sözlüğü (Apache-2.0)  — kelimenin Türkçe olup olmadığı
//   tr_50k.txt             → FrequencyWords, OpenSubtitles 2018 (CC-BY-SA-4.0) — kelimenin ne kadar yaygın olduğu
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const up = (s) => s.toLocaleUpperCase('tr-TR');
const ALPHA = /^[abcçdefgğhıijklmnoöprsştuüvyz]+$/;

export function loadDict(dir) {
  const lemmas = new Set();   // ad, sıfat, zarf… (sözlük biçimi)
  const stems = new Set();    // fiil kökleri (gel, yaz…)
  for (const line of readFileSync(join(dir, 'master-dictionary.dict'), 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const m = t.match(/^(\S+)(?:\s+\[(.*)\])?$/);
    if (!m) continue;
    const w = m[1];
    const attrs = m[2] || '';
    if (!ALPHA.test(w)) continue;                       // özel ad, şapkalı harf, kısaltma, tireli söz yok
    if (/P:(Punc|Abbrv|Postp|Conj|Interj|Det|Ques|Dup|Pron|Num)/.test(attrs) || /Pr:|S:/.test(attrs)) continue;
    if (/(mak|mek)$/.test(w) && !/P:(Noun|Adj)/.test(attrs) && w.length > 4) { stems.add(up(w.slice(0, -3))); continue; }
    lemmas.add(up(w));
  }
  const freq = new Map();
  for (const line of readFileSync(join(dir, 'tr_50k.txt'), 'utf8').split('\n')) {
    const [w, n] = line.split(' ');
    if (w && ALPHA.test(w)) freq.set(up(w), Number(n));
  }
  return { lemmas, stems, freq };
}
