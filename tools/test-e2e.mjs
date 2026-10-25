// Kelime Avı – uçtan uca test.
// Kullanım:  node tools/test-e2e.mjs [ekran-görüntüsü-klasörü]
// Gerçek bir oyuncu gibi tarayıcıda oynar: harfleri sürükler, ipucu kullanır, 32 bölümün hepsini bitirir.
// Gerekli: Playwright + Chromium (npm i -D playwright && npx playwright install chromium)

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { mkdirSync } from 'node:fs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(process.argv[2] || join(ROOT, 'test-output'));
mkdirSync(OUT, { recursive: true });
const FILE = 'file://' + join(ROOT, 'dist', 'kelime-avi.html');

let failures = 0, checks = 0;
function check(cond, msg) {
  checks++;
  if (cond) console.log('  ✓ ' + msg);
  else { failures++; console.log('  ✗ ' + msg); }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const st = (page) => page.evaluate(() => JSON.parse(JSON.stringify(window.__kelimeAvi.state())));
const scr = (page) => page.evaluate(() => window.__kelimeAvi.screen());
async function waitScreen(page, name, timeout = 8000) {
  await page.waitForFunction((n) => window.__kelimeAvi && window.__kelimeAvi.screen() === n, name, { timeout });
}
async function shot(page, name) { await page.screenshot({ path: join(OUT, name + '.png') }); }

async function letterPoints(page, word) {
  return page.evaluate((word) => {
    const els = [...document.querySelectorAll('#wheel .letter')];
    const used = new Set();
    const out = [];
    for (const ch of Array.from(word)) {
      const i = els.findIndex((e, k) => e.textContent === ch && !used.has(k));
      if (i < 0) return null;
      used.add(i);
      const r = els[i].getBoundingClientRect();
      out.push({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
    return out;
  }, word);
}
async function dragWord(page, word) {
  const pts = await letterPoints(page, word);
  if (!pts) throw new Error('Çemberde harf yok: ' + word);
  await page.mouse.move(pts[0].x, pts[0].y);
  await page.mouse.down();
  for (let k = 1; k < pts.length; k++) await page.mouse.move(pts[k].x, pts[k].y, { steps: 6 });
  await page.mouse.up();
}
async function touchWord(page, cdp, word) {
  const pts = await letterPoints(page, word);
  const tp = (p) => [{ x: p.x, y: p.y, id: 1 }];
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: tp(pts[0]) });
  for (let k = 1; k < pts.length; k++) {
    const a = pts[k - 1], b = pts[k];
    for (let s = 1; s <= 6; s++) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: tp({ x: a.x + ((b.x - a.x) * s) / 6, y: a.y + ((b.y - a.y) * s) / 6 }) });
    }
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}
async function waitIdle(page) {
  await page.waitForFunction(() => !document.querySelector('.flyer'), null, { timeout: 5000 });
  await sleep(120);
}
async function levelWords(page) {
  return page.evaluate(() => window.__kelimeAvi.level().words.map((w) => w.w));
}
async function solveRemaining(page) {
  const s = await st(page);
  for (const w of await levelWords(page)) {
    if (s.cur && s.cur.found.includes(w)) continue;
    if ((await scr(page)) !== 'game') break;
    await dragWord(page, w);
    await waitIdle(page);
  }
}
// Tebrikler ekranı: pencereleri kapat, "sonraki" düğmesini bekle
async function finishComplete(page, expect) {
  await waitScreen(page, 'complete', 10000);
  const seen = { gift: false, card: null };
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    const modal = await page.evaluate(() => { const m = document.querySelector('#modal'); return m.hidden ? null : m.innerText; });
    if (modal) {
      if (/Hediye kutusu/.test(modal)) seen.gift = true;
      const name = await page.evaluate(() => document.querySelector('#modal .card-name')?.textContent || null);
      if (name) seen.card = name;
      if (expect && expect.shotModal) await shot(page, expect.shotModal + (name ? '-kart' : '-hediye'));
      await page.click('#modal [data-close]');
      await sleep(250);
      continue;
    }
    const btn = await page.evaluate(() => { const b = document.querySelector('#btn-next'); return b.hidden ? null : b.textContent; });
    if (btn && btn === expect.next) break;
    await sleep(120);
  }
  return seen;
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  const cdp = await ctx.newCDPSession(page);

  console.log('Açılış');
  await page.goto(FILE);
  await shot(page, '00-yukleniyor');
  await waitScreen(page, 'home');
  await sleep(500);
  await shot(page, '01-ana-ekran');
  check((await page.textContent('#btn-play')) === 'BÖLÜM 1', 'ana ekran "BÖLÜM 1" gösteriyor');
  check((await page.textContent('#home-count')) === '0', 'yolculuk sayacı 0');
  check((await st(page)).gems === 200, 'başlangıç elması 200');

  console.log('Bölüm 1 (eğitim)');
  await page.click('#btn-play');
  await waitScreen(page, 'game');
  await sleep(500);
  await shot(page, '02-bolum1-egitim');
  check((await page.textContent('#tut-text')) === 'KOY kelimesinin harflerini birleştir.', 'eğitim yönergesi doğru');
  check(await page.isHidden('#btn-shuffle'), 'ilk bölümde karıştırma düğmesi gizli');
  await dragWord(page, 'OKY');
  await sleep(150);
  check(await page.evaluate(() => document.querySelector('#preview').classList.contains('shake')), 'geçersiz kelimede balon titriyor');
  await sleep(500);
  check((await st(page)).cur.found.length === 0, 'geçersiz kelime kabul edilmedi');
  check((await st(page)).gems === 200, 'geçersiz kelimede ceza yok');
  await dragWord(page, 'KOY');
  await sleep(200);
  await shot(page, '03-harfler-ucuyor');
  await waitIdle(page);
  check((await st(page)).cur.found.includes('KOY'), 'KOY bulundu');
  check(await page.isHidden('#tut'), 'ilk kelimeden sonra eğitim kapandı');
  check((await page.$$eval('.cell.found', (e) => e.length)) === 3, '3 hücre bulundu olarak işaretlendi');
  await sleep(1700);
  check((await page.$$eval('.cell.outlined', (e) => e.length)) >= 1, 'kalan kelimenin yeri çerçevelendi');
  await shot(page, '04-kalan-kelime-vurgusu');
  await dragWord(page, 'KOY');
  await waitIdle(page);
  check((await st(page)).cur.found.length === 1, 'aynı kelimeyi tekrar girmek bir şey değiştirmedi');
  await dragWord(page, 'YOK');
  await sleep(700);
  await shot(page, '05-ovgu-bandi');
  const seen1 = await finishComplete(page, { next: 'BÖLÜM 2' });
  await shot(page, '06-tebrikler');
  check((await page.textContent('#cmp-count')) === '1', 'tebrikler: 1 yolculuk');
  check((await page.textContent('#gift-text')) === '1/8', 'hediye çubuğu 1/8');
  check((await page.textContent('#loc-text')) === '1/4', 'durak çubuğu 1/4');
  check((await page.textContent('#loc-title')) === 'KAPADOKYA', 'durak adı KAPADOKYA');
  check(!seen1.gift && !seen1.card, 'ilk bölümde hediye/kart yok');

  console.log('Bölüm 2 (dokunmatik ve klavye)');
  await page.click('#btn-next');
  await waitScreen(page, 'game');
  await sleep(500);
  await touchWord(page, cdp, 'YAT');
  await waitIdle(page);
  check((await st(page)).cur.found.includes('YAT'), 'dokunmatik sürükleme ile YAT bulundu');
  await page.keyboard.type('tay');
  await page.keyboard.press('Enter');
  await sleep(1050);
  await shot(page, '05b-ovgu-bandi');
  check(await page.evaluate(() => document.querySelector('#praise').classList.contains('show')), 'son kelimeden sonra övgü bandı çıktı');
  await finishComplete(page, { next: 'BÖLÜM 3' });
  check((await st(page)).completed === 2, 'klavye ile TAY bulundu, bölüm bitti');

  console.log('Bölüm 3 (ipucu eğitimi)');
  await page.click('#btn-next');
  await waitScreen(page, 'game');
  await sleep(500);
  await shot(page, '07-ipucu-egitimi');
  check((await page.textContent('#tut-text')) === 'Takılırsan İPUCU kullanabilirsin.', 'ipucu eğitimi gösterildi');
  check((await page.textContent('#hint-badge')) === '2', 'ipucu rozetinde 2 ücretsiz hak');
  check(await page.isVisible('#tut-arrow'), 'ipucu eğitiminde ok görünüyor');
  await page.click('#tut-ok');
  await page.click('#btn-hint');
  await sleep(300);
  await page.click('#btn-hint');
  await sleep(300);
  let s3 = await st(page);
  check(s3.cur.rev.length + 0 >= 2 || s3.cur.found.length > 0, 'iki ipucu harf açtı');
  check(s3.gems === 200, 'eğitim ipuçları ücretsiz (elmas 200)');
  check(await page.isVisible('#hint-price'), 'ücretsiz haklar bitince fiyat görünüyor');
  await shot(page, '08-ipucu-kullanildi');
  await solveRemaining(page);
  await finishComplete(page, { next: 'BÖLÜM 4' });

  console.log('Bölüm 4 (durak sonu kartı)');
  await page.click('#btn-next');
  await waitScreen(page, 'game');
  await sleep(400);
  await solveRemaining(page);
  const seen4 = await finishComplete(page, { next: 'BÖLÜM 5', shotModal: '09-kapadokya' });
  check(seen4.card === 'Kapadokya', 'Kapadokya kartı kazanıldı');
  check((await page.textContent('#loc-title')) === 'EFES ANTİK KENTİ', 'sıradaki durak EFES ANTİK KENTİ');
  check((await st(page)).cards.includes('kapadokya'), 'kart kayda işlendi');

  console.log('Bölüm 5 (karıştırma, kaydetme)');
  await page.click('#btn-next');
  await waitScreen(page, 'game');
  await sleep(500);
  await shot(page, '10-efes-karistirma-egitimi');
  const before = (await st(page)).cur.order.join(',');
  await page.click('#btn-shuffle');
  await sleep(450);
  check((await st(page)).cur.order.join(',') !== before, 'karıştırma harflerin yerini değiştirdi');
  const w5 = await levelWords(page);
  await dragWord(page, w5[0]);
  await waitIdle(page);
  await sleep(1000);
  await page.reload();
  await waitScreen(page, 'home');
  check((await page.textContent('#btn-play')) === 'BÖLÜM 5', 'yeniden açınca ana ekran BÖLÜM 5');
  await page.click('#btn-play');
  await waitScreen(page, 'game');
  await sleep(400);
  check((await st(page)).cur.found.includes(w5[0]), 'bölüm içindeki ilerleme korundu');
  check((await page.$$eval('.cell.found', (e) => e.length)) >= 4, 'bulunan kelime ızgarada geri geldi');
  await solveRemaining(page);
  await finishComplete(page, { next: 'BÖLÜM 6' });

  console.log('Bölüm 6 (elmas yetmezse)');
  await page.click('#btn-next');
  await waitScreen(page, 'game');
  await sleep(400);
  await page.click('#btn-hint'); await sleep(250);
  await page.click('#btn-hint'); await sleep(250);
  check((await st(page)).gems === 0, 'iki ücretli ipucundan sonra elmas 0');
  await page.click('#btn-hint'); await sleep(250);
  check(await page.isVisible('#toast'), 'elmas yetmeyince uyarı çıktı');
  await shot(page, '11-yetersiz-elmas');
  await solveRemaining(page);
  await finishComplete(page, { next: 'BÖLÜM 7' });

  // Kalan bölümler: her durağın ilk bölümünün ekran görüntüsü
  const shotsAt = { 9: '12-ayasofya', 13: '13-pamukkale', 17: '14-nemrut', 21: '15-galata', 25: '16-sumela', 29: '17-gobeklitepe', 32: '18-son-bolum' };
  const gifts = [], cards = [], overlaps = [];
  const hintOverlap = () => page.evaluate(() => {
    const h = document.querySelector('#btn-hint').getBoundingClientRect();
    return [...document.querySelectorAll('#wheel .letter')].some((l) => {
      const r = l.getBoundingClientRect();
      return r.right > h.left - 4 && r.left < h.right + 4 && r.bottom > h.top - 4 && r.top < h.bottom + 4;
    });
  });
  for (let n = 7; n <= 32; n++) {
    await page.click('#btn-next');
    await waitScreen(page, 'game');
    await sleep(450);
    if (shotsAt[n]) await shot(page, shotsAt[n]);
    if (await hintOverlap()) overlaps.push(n);
    const s = await st(page);
    if (s.level !== n) { check(false, `bölüm ${n} açılmadı (durum: ${s.level})`); break; }
    await solveRemaining(page);
    const next = n < 32 ? `BÖLÜM ${n + 1}` : 'DEVAM';
    const seen = await finishComplete(page, { next, shotModal: n === 8 ? '19-efes' : null });
    if (seen.gift) gifts.push(n);
    if (seen.card) cards.push(seen.card);
  }
  console.log('Bölüm 7-32');
  check(overlaps.length === 0, `ipucu düğmesi hiçbir harfle çakışmıyor${overlaps.length ? ' (çakışan: ' + overlaps.join(', ') + ')' : ''}`);
  check(JSON.stringify(gifts) === JSON.stringify([8, 16, 24, 32]), `hediye kutuları 8, 16, 24, 32. bölümlerde (${gifts.join(', ')})`);
  check(cards.length === 7, `7 kart daha kazanıldı (${cards.join(', ')})`);
  const fin = await st(page);
  check(fin.completed === 32 && fin.level === 33, '32 bölüm tamamlandı');
  check(fin.cards.length === 8, '8 kartın hepsi açıldı');
  check(fin.gems === 400, `elmas: 0 + 4 hediye × 100 = 400 (${fin.gems})`);
  await shot(page, '20-son-tebrikler');
  await page.click('#btn-next');
  await waitScreen(page, 'end');
  await sleep(500);
  await shot(page, '21-yolculuk-bitti');

  console.log('Ayarlar ve kartlar');
  await page.click('#scr-end [data-act="cards"]');
  await sleep(500);
  await shot(page, '22-kartlarim');
  check((await page.$$eval('.mini-card:not(.locked)', (e) => e.length)) === 8, 'koleksiyonda 8 açık kart');
  await page.click('#modal .close');
  await page.click('#btn-restart');
  await waitScreen(page, 'game');
  check((await st(page)).level === 1, 'baştan oyna bölüm 1’i açtı');
  await page.click('#scr-game [data-act="settings"]');
  await sleep(400);
  await shot(page, '23-ayarlar');
  await page.click('#set-sound');
  check((await st(page)).sound === false, 'ses ayarı kapatıldı');
  await page.click('#set-reset');
  await page.click('#set-do-reset');
  await waitScreen(page, 'home');
  const rs = await st(page);
  check(rs.completed === 0 && rs.gems === 200 && rs.cards.length === 0 && rs.sound === false, 'sıfırlama ilerlemeyi sildi, ses ayarını korudu');

  console.log('Küçük ekran ve masaüstü');
  for (const [w, h, name] of [[360, 640, '24-kucuk-ekran'], [1280, 800, '25-masaustu']]) {
    const p2 = await browser.newPage({ viewport: { width: w, height: h } });
    p2.on('pageerror', (e) => errors.push(e.message));
    await p2.goto(FILE);
    await p2.waitForFunction(() => window.__kelimeAvi && window.__kelimeAvi.screen() === 'home');
    await p2.evaluate(() => { localStorage.setItem('kelime-avi:v1', JSON.stringify({ v: 1, level: 32, completed: 31, gems: 300, tut: { first: true, hintShown: true, hintGiven: true, shuffle: true }, cards: [] })); });
    await p2.reload();
    await p2.waitForFunction(() => window.__kelimeAvi.screen() === 'home');
    await p2.click('#btn-play');
    await p2.waitForFunction(() => window.__kelimeAvi.screen() === 'game');
    await sleep(600);
    const overflow = await p2.evaluate(() => {
      const cells = [...document.querySelectorAll('.cell')].map((c) => c.getBoundingClientRect());
      const wheel = document.querySelector('#wheel').getBoundingClientRect();
      const lowest = Math.max(...cells.map((r) => r.bottom));
      return { lowest, wheelTop: wheel.top, wheelBottom: wheel.bottom, vh: innerHeight, scrollW: document.documentElement.scrollWidth, vw: innerWidth };
    });
    check(overflow.lowest < overflow.wheelTop - 30, `${w}x${h}: ızgara çemberle çakışmıyor`);
    check(overflow.wheelBottom <= overflow.vh, `${w}x${h}: çember ekrana sığıyor`);
    check(overflow.scrollW <= overflow.vw, `${w}x${h}: yatay kaydırma yok`);
    await p2.screenshot({ path: join(OUT, name + '.png') });
    await p2.close();
  }

  check(errors.length === 0, 'tarayıcıda hata yok' + (errors.length ? ': ' + errors.join(' | ') : ''));
  await browser.close();
  console.log(`\n${checks - failures}/${checks} kontrol geçti. Ekran görüntüleri: ${OUT}`);
  process.exit(failures ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
