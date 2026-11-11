// Kelime Avı – Google Play mağaza görsellerini üretir.
// Kullanım:  node tools/build-store.mjs   →  store/ klasörü
//   simge-512.png            uygulama simgesi (512×512)
//   one-cikan-1024x500.png   öne çıkan görsel
//   ekran-1…6.png            telefon ekran görüntüleri (1080×1920)
// Gerekli: Playwright + Chromium, önce node tools/build.mjs çalıştırılmış olmalı.
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync, readFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'store');
mkdirSync(OUT, { recursive: true });
const FILE = 'file://' + join(ROOT, 'dist', 'kelime-avi.html');
const b64 = (p) => readFileSync(join(ROOT, 'src', p)).toString('base64');
const icon = readFileSync(join(ROOT, 'src', 'icon.svg'), 'utf8');
const font = (file, fam, w) => `@font-face{font-family:"${fam}";font-weight:${w};src:url(data:font/woff2;base64,${b64('fonts/' + file)}) format("woff2")}`;
const fonts = font('baloo-2-latin-wght-normal.woff2', 'Baloo 2', '400 800') + font('baloo-2-latin-ext-wght-normal.woff2', 'Baloo 2x', '400 800') +
  font('nunito-latin-wght-normal.woff2', 'Nunito', '200 1000') + font('nunito-latin-ext-wght-normal.woff2', 'Nunito x', '200 1000');

const browser = await chromium.launch();

// 1) simge
{
  const p = await browser.newPage({ viewport: { width: 512, height: 512 } });
  await p.setContent(`<body style="margin:0">${icon.replace('<svg ', '<svg width="512" height="512" ')}</body>`);
  await p.screenshot({ path: join(OUT, 'simge-512.png') });
  await p.close();
}

// 2) öne çıkan görsel
{
  const p = await browser.newPage({ viewport: { width: 1024, height: 500 } });
  const tiles = [...'KELİME'].map((c, i) => `<span style="transform:rotate(${i % 2 ? 3 : -4}deg)">${c}</span>`).join('');
  await p.setContent(`<style>${fonts}
    body{margin:0;width:1024px;height:500px;overflow:hidden;position:relative;font-family:"Nunito","Nunito x",sans-serif;background:#121838}
    .bg{position:absolute;inset:0;background:url(data:image/svg+xml;base64,${b64('scenes/kapadokya.svg')}) center 78%/cover}
    .sh{position:absolute;inset:0;background:linear-gradient(90deg,rgba(14,18,48,.82) 0%,rgba(14,18,48,.55) 45%,rgba(14,18,48,0) 75%)}
    .box{position:absolute;left:64px;top:92px;display:flex;flex-direction:column;align-items:flex-start;gap:6px}
    .tiles{display:flex;gap:9px}.tiles span{width:76px;height:80px;border-radius:16px;display:grid;place-items:center;background:linear-gradient(#fffdf8,#f3e7d2);color:#1f4fa3;font-weight:900;font-size:52px;box-shadow:0 6px 0 #c9b48e}
    .word{font:800 124px/1 "Baloo 2","Baloo 2x";letter-spacing:.06em;color:#f1b434;-webkit-text-stroke:6px #14336e;paint-order:stroke fill;text-shadow:0 9px 0 #14336e;display:flex;align-items:center;gap:14px;margin-top:6px}
    .word svg{width:104px;height:104px}
    .sub{margin-top:14px;padding:11px 26px 9px;border-radius:999px;background:linear-gradient(#2f66c8,#14336e);border:3px solid #f1b434;color:#fff;font:800 25px/1 "Baloo 2","Baloo 2x";letter-spacing:.16em}
  </style><div class="bg"></div><div class="sh"></div><div class="box"><div class="tiles">${tiles}</div>
  <div class="word"><svg viewBox="0 0 48 48"><path d="M30 30l12 12" stroke="#14336e" stroke-width="11" stroke-linecap="round"/><path d="M30 30l12 12" stroke="#f1b434" stroke-width="6" stroke-linecap="round"/><circle cx="20" cy="20" r="14" fill="#bfe6ff" fill-opacity=".45" stroke="#14336e" stroke-width="8.5"/><circle cx="20" cy="20" r="14" fill="none" stroke="#f1b434" stroke-width="4.5"/></svg>AVI</div>
  <div class="sub">ANADOLU YOLCULUĞU</div></div>`);
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: join(OUT, 'one-cikan-1024x500.png') });
  await p.close();
}

// 3) telefon ekran görüntüleri (360×640 mantıksal, 3 kat → 1080×1920)
{
  const ctx = await browser.newContext({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 3 });
  const p = await ctx.newPage();
  await p.goto(FILE);
  await p.waitForFunction(() => window.__kelimeAvi && window.__kelimeAvi.screen() === 'home');
  const seed = async (level, extra = {}) => {
    await p.evaluate(([level, extra]) => localStorage.setItem('kelime-avi:v1', JSON.stringify({
      v: 1, level, completed: level - 1, gems: 640, tut: { first: true, hintShown: true, hintGiven: true, shuffle: true },
      cards: LOCATIONS.slice(0, Math.floor((level - 1) / LEVELS_PER_LOCATION)).map((l) => l.id), daily: { day: window.__kelimeAvi.today(), streak: 3 }, ...extra,
    })), [level, extra]);
    await p.reload();
    await p.waitForFunction(() => window.__kelimeAvi.screen() === 'home');
    await p.waitForTimeout(700);
  };
  const play = async (found) => {
    await p.click('#btn-play');
    await p.waitForFunction(() => window.__kelimeAvi.screen() === 'game');
    await p.waitForTimeout(700);
    const words = await p.evaluate(() => window.__kelimeAvi.level().words.map((w) => w.w));
    for (const w of words.slice(0, found)) {
      await p.evaluate((w) => { for (const ch of Array.from(w)) document.dispatchEvent(new KeyboardEvent('keydown', { key: ch })); document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })); }, w);
      await p.waitForTimeout(900);
    }
  };
  let n = 0;
  const snap = () => p.screenshot({ path: join(OUT, `ekran-${++n}.png`) });
  await seed(27); await snap();                       // ana ekran
  await play(2); await snap();                        // Efes, 4 harf
  await seed(96); await play(3); await snap();        // Nemrut, 5 harf
  await seed(186); await play(4); await snap();       // Bodrum, 7 harf
  await seed(131); await p.click('[data-act="map"]'); await p.waitForTimeout(500); await snap();   // seviyeler
  await p.click('#modal .close'); await p.click('[data-act="cards"]'); await p.waitForTimeout(500); await snap(); // kartlar
}
await browser.close();
console.log('store/ klasörü hazır');
