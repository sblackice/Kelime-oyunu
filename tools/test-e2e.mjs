// Kelime Avı – uçtan uca test.
// Kullanım:  node tools/test-e2e.mjs [ekran-görüntüsü-klasörü]
// Gerçek bir oyuncu gibi tarayıcıda oynar: harfleri sürükler, ipucu kullanır, bütün bölümleri bitirir;
// seviyeleri, bonus kelimeleri, reklam yerlerini (deneme kipi) ve geri tuşunu da dener.
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
// Hızlı çözüm (toplu bölüm testi): harfleri klavye olayıyla gönderir
async function solveFast(page) {
  for (const w of await levelWords(page)) {
    await page.evaluate((w) => {
      for (const ch of Array.from(w)) document.dispatchEvent(new KeyboardEvent('keydown', { key: ch }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    }, w);
    await page.waitForFunction((w) => { const s = window.__kelimeAvi.state(); return !s.cur || s.cur.found.includes(w); }, w, { timeout: 5000 });
    await page.waitForFunction(() => !document.querySelector('.flyer'), null, { timeout: 5000 });
  }
}
// Tebrikler ekranı: pencereleri kapat, "sonraki" düğmesini bekle
async function finishComplete(page, expect) {
  await waitScreen(page, 'complete', 10000);
  const seen = { gift: false, card: null, tier: false };
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    const modal = await page.evaluate(() => { const m = document.querySelector('#modal'); return m.hidden ? null : m.innerText; });
    if (modal) {
      if (/Hediye kutusu/.test(modal)) seen.gift = true;
      if (/seviyesini bitirdin/.test(modal)) seen.tier = true;
      const name = await page.evaluate(() => document.querySelector('#modal .card-name')?.textContent || null);
      if (name) seen.card = name;
      if (expect && expect.shotModal) await shot(page, expect.shotModal + (name ? '-kart' : /seviyesini/.test(modal) ? '-seviye' : '-hediye'));
      await page.click('#modal [data-close]');
      await sleep(expect.fast ? 40 : 250);
      continue;
    }
    const btn = await page.evaluate(() => { const b = document.querySelector('#btn-next'); return b.hidden ? null : b.textContent; });
    if (btn && btn === expect.next) break;
    await sleep(expect.fast ? 30 : 120);
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
  const META = await page.evaluate(() => ({ levels: LEVELS.length, per: LEVELS_PER_LOCATION, locs: LOCATIONS.map((l) => l.name), tiers: TIERS.map((t) => t.name) }));
  check(META.levels === META.locs.length * META.per && META.levels >= 200, `${META.levels} bölüm, ${META.locs.length} durak, ${META.tiers.length} seviye`);
  check((await page.textContent('#home-tier-name')) === 'SEVİYE 1 · ÇIRAK', 'ana ekranda seviye adı (ÇIRAK)');
  check((await page.textContent('#home-tier-loc')) === `Kapadokya · 0/${META.per}`, 'ana ekranda durak ilerlemesi');
  await page.click('[data-act="map"]');
  await sleep(400);
  await shot(page, '01b-seviyeler');
  check((await page.$$eval('.map-tier', (e) => e.length)) === META.tiers.length, 'Seviyeler penceresi bütün seviyeleri listeliyor');
  check((await page.$$eval('.map-row.now', (e) => e.length)) === 1 && (await page.$$eval('.map-row.locked', (e) => e.length)) === META.locs.length - 1, 'Seviyeler: 1 durak açık, diğerleri kilitli');
  check(await page.evaluate(() => window.__kelimeAvi.back()) === true && await page.isHidden('#modal'), 'geri tuşu açık pencereyi kapatıyor');
  check(await page.evaluate(() => window.__kelimeAvi.back()) === false, 'ana sayfada geri tuşu uygulamadan çıkışa izin veriyor');
  check((await page.textContent('#home-count')) === '0', 'yolculuk sayacı 0');
  check((await st(page)).gems === 200, 'başlangıç elması 200');

  console.log('Bölüm 1 (eğitim)');
  await page.click('#btn-play');
  await waitScreen(page, 'game');
  await sleep(500);
  await shot(page, '02-bolum1-egitim');
  check((await page.textContent('#tut-text')) === 'KOY kelimesinin harflerini birleştir.', 'eğitim yönergesi doğru');
  check(await page.isHidden('#btn-shuffle'), 'ilk bölümde karıştırma düğmesi gizli');
  check((await page.textContent('#lvl-label')) === 'BÖLÜM 1', 'oyun ekranında bölüm numarası yazıyor');
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
  check((await page.textContent('#loc-text')) === `1/${META.per}`, `durak çubuğu 1/${META.per}`);
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

  console.log('Bölüm 4 (bonus kelime, geri tuşu)');
  await page.click('#btn-next');
  await waitScreen(page, 'game');
  await sleep(400);
  const bonus4 = await page.evaluate(() => window.__kelimeAvi.level().x);
  check(bonus4.length > 0, `bölüm 4'te bonus kelime var (${bonus4.join(', ')})`);
  const g4 = (await st(page)).gems;
  await dragWord(page, bonus4[0]);
  await sleep(250);
  await shot(page, '09-bonus-kelime');
  let s4 = await st(page);
  check(s4.gems === g4 + 5 && s4.cur.bonus.includes(bonus4[0]) && s4.bonus === 1, 'bonus kelime +5 elmas kazandırdı');
  check(/Bonus kelime/.test(await page.textContent('#toast')), 'bonus kelime bildirimi çıktı');
  check(s4.cur.found.length === 0, 'bonus kelime bulmacaya yazılmadı');
  await sleep(700);
  await dragWord(page, bonus4[0]);
  await sleep(250);
  check((await st(page)).gems === g4 + 5, 'aynı bonus kelime ikinci kez ödül vermedi');
  check(await page.evaluate(() => window.__kelimeAvi.back()) === true, 'oyunda geri tuşu işlendi');
  await waitScreen(page, 'home');
  check((await page.textContent('#btn-play')) === 'BÖLÜM 4', 'geri tuşu ana sayfaya döndürdü, bölüm korundu');
  await page.click('#btn-play');
  await waitScreen(page, 'game');
  await sleep(400);
  await solveRemaining(page);
  await finishComplete(page, { next: 'BÖLÜM 5' });
  check((await page.textContent('#loc-title')) === 'KAPADOKYA', 'durak hâlâ KAPADOKYA');

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
  check((await st(page)).gems === 5, 'iki ücretli ipucundan sonra elmas 5 (bonus kelimeden)');
  await page.click('#btn-hint'); await sleep(350);
  check(/Elmasın bitti/.test(await page.textContent('#modal')), 'elmas yetmeyince "Elmasın bitti" penceresi çıktı');
  check((await page.$('#gem-ad')) === null, 'reklamsız sürümde "reklam izle" düğmesi yok');
  await shot(page, '11-yetersiz-elmas');
  await page.click('#modal .close');
  await solveRemaining(page);
  await finishComplete(page, { next: 'BÖLÜM 7' });

  // Kalan bölümler hızlı kipte (azaltılmış hareket) oynanır; her durağın ilk bölümünün ekran görüntüsü alınır
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await waitScreen(page, 'home');
  await page.click('#btn-play');
  await waitScreen(page, 'game');
  const N = META.levels, PER = META.per;
  const gifts = [], cards = [], tiers = [], overlaps = [], badBoards = [];
  const boardCheck = () => page.evaluate(() => {
    const h = document.querySelector('#btn-hint').getBoundingClientRect();
    const hintHit = [...document.querySelectorAll('#wheel .letter')].some((l) => {
      const r = l.getBoundingClientRect();
      return r.right > h.left - 4 && r.left < h.right + 4 && r.bottom > h.top - 4 && r.top < h.bottom + 4;
    });
    const cells = [...document.querySelectorAll('.cell')].map((c) => c.getBoundingClientRect());
    const wheel = document.querySelector('#wheel').getBoundingClientRect();
    const top = document.querySelector('#scr-game .topbar').getBoundingClientRect();
    const ok = Math.min(...cells.map((r) => r.width)) >= 24 && Math.max(...cells.map((r) => r.bottom)) < wheel.top - 20 &&
      Math.min(...cells.map((r) => r.top)) >= top.bottom - 1 && Math.min(...cells.map((r) => r.left)) >= 0 && Math.max(...cells.map((r) => r.right)) <= innerWidth;
    return { hintHit, ok };
  });
  const t0 = Date.now();
  for (let n = 7; n <= N; n++) {
    if (n > 7) { await page.click('#btn-next'); await waitScreen(page, 'game'); }
    await sleep(60);
    const s = await st(page);
    if (s.level !== n) { check(false, `bölüm ${n} açılmadı (durum: ${s.level})`); break; }
    if (await page.isVisible('#tut-ok')) await page.click('#tut-ok');
    if ((n - 1) % PER === 0) { await sleep(900); await shot(page, `12-durak-${String((n - 1) / PER + 1).padStart(2, '0')}`); }
    const bc = await boardCheck();
    if (bc.hintHit) overlaps.push(n);
    if (!bc.ok) badBoards.push(n);
    await solveFast(page);
    const next = n < N ? `BÖLÜM ${n + 1}` : 'DEVAM';
    const seen = await finishComplete(page, { next, fast: true, shotModal: n === PER ? '19-ilk-durak' : n === PER * 3 ? '19-ilk-seviye' : null });
    if (seen.gift) gifts.push(n);
    if (seen.card) cards.push(seen.card);
    if (seen.tier) tiers.push(n);
  }
  console.log(`Bölüm 7-${N} (${Math.round((Date.now() - t0) / 1000)} sn)`);
  const range = (step) => Array.from({ length: Math.floor(N / step) }, (_, i) => (i + 1) * step);
  check(overlaps.length === 0, `ipucu düğmesi hiçbir harfle çakışmıyor${overlaps.length ? ' (çakışan: ' + overlaps.join(', ') + ')' : ''}`);
  check(badBoards.length === 0, `bütün bulmacalar ekrana sığıyor, kutular en az 24 px${badBoards.length ? ' (sorunlu: ' + badBoards.join(', ') + ')' : ''}`);
  check(JSON.stringify(gifts) === JSON.stringify(range(8)), `hediye kutuları her 8 bölümde (${gifts.length} adet)`);
  check(JSON.stringify(cards) === JSON.stringify(META.locs), `her durak sonunda kart kazanıldı (${cards.length} kart)`);
  check(JSON.stringify(tiers) === JSON.stringify(range(PER * 3)), `seviye ödülleri ${range(PER * 3).join(', ')}. bölümlerde`);
  const fin = await st(page);
  check(fin.completed === N && fin.level === N + 1, `${N} bölüm tamamlandı`);
  check(fin.cards.length === META.locs.length, `${META.locs.length} kartın hepsi açıldı`);
  const expGems = 5 + range(8).length * 100 + META.tiers.length * 250;
  check(fin.gems === expGems, `elmas: 5 + ${range(8).length} hediye × 100 + ${META.tiers.length} seviye × 250 = ${expGems} (${fin.gems})`);
  await shot(page, '20-son-tebrikler');
  await page.click('#btn-next');
  await waitScreen(page, 'end');
  await sleep(500);
  await shot(page, '21-yolculuk-bitti');
  await page.click('#scr-end [data-act="cards"]');
  await sleep(300);
  await page.click('#modal .close');
  await page.evaluate(() => window.__kelimeAvi.back());
  await waitScreen(page, 'home');
  await page.click('[data-act="map"]');
  await sleep(300);
  await shot(page, '21b-seviyeler-bitti');
  check((await page.$$eval('.map-row.done', (e) => e.length)) === META.locs.length, 'Seviyeler: bütün duraklar tamamlandı görünüyor');
  await page.click('#modal .close');
  await page.click('#btn-play');
  await waitScreen(page, 'game');
  check((await st(page)).level === 1, 'baştan oyna bölüm 1’i açtı');
  await page.evaluate(() => window.__kelimeAvi.back());
  await waitScreen(page, 'home');
  await page.emulateMedia({ reducedMotion: 'no-preference' });

  console.log('Ayarlar ve kartlar');
  await page.click('#scr-home [data-act="cards"]');
  await sleep(500);
  await shot(page, '22-kartlarim');
  check((await page.$$eval('.mini-card:not(.locked)', (e) => e.length)) === META.locs.length, `koleksiyonda ${META.locs.length} açık kart`);
  await page.click('#modal .close');
  await page.click('#scr-home [data-act="settings"]');
  await sleep(400);
  await shot(page, '23-ayarlar');
  await page.click('#set-sound');
  check((await st(page)).sound === false, 'ses ayarı kapatıldı');
  await page.click('#set-reset');
  await page.click('#set-do-reset');
  await waitScreen(page, 'home');
  const rs = await st(page);
  check(rs.completed === 0 && rs.gems === 200 && rs.cards.length === 0 && rs.sound === false, 'sıfırlama ilerlemeyi sildi, ses ayarını korudu');

  console.log('Eski kayıttan geçiş');
  await page.evaluate(() => localStorage.setItem('kelime-avi:v1', JSON.stringify({ v: 1, level: 9, completed: 8, gems: 150, tut: { first: true }, cards: ['kapadokya', 'efes'], cur: { n: 9, found: ['BALIK', 'BAL'], rev: [], order: [0, 1, 2, 3, 4] } })));
  await page.reload();
  await waitScreen(page, 'home');
  const mg = await st(page);
  check(mg.level === 9 && mg.gems === 150 && mg.cur === null, 'eski sürüm kaydı açıldı; uyuşmayan yarım bölüm güvenle sıfırlandı');
  await page.click('#btn-play');
  await waitScreen(page, 'game');
  check((await page.$$eval('.cell.found', (e) => e.length)) === 0, 'geçiş sonrası bölüm temiz başladı');

  console.log('Reklam yerleri (deneme kipi: ?reklam=demo)');
  {
    const pa = await ctx.newPage();
    pa.on('pageerror', (e) => errors.push(e.message));
    const seed = (level, gems) => pa.evaluate(([level, gems]) => localStorage.setItem('kelime-avi:v1', JSON.stringify({ v: 1, level, completed: level - 1, gems, tut: { first: true, hintShown: true, hintGiven: true, shuffle: true }, cards: [] })), [level, gems]);
    const bannerOn = () => pa.evaluate(() => getComputedStyle(document.querySelector('#ad-demo')).display !== 'none');
    await pa.goto(FILE + '?reklam=demo');
    await waitScreen(pa, 'home');
    await seed(2, 200);
    await pa.reload();
    await waitScreen(pa, 'home');
    await pa.click('#btn-play');
    await waitScreen(pa, 'game');
    check(!(await bannerOn()), 'ilk 3 bölümde reklam alanı yok');
    await seed(7, 0);
    await pa.reload();
    await waitScreen(pa, 'home');
    await sleep(300);
    check(await bannerOn(), 'ana ekranda alt reklam alanı görünüyor');
    await shot(pa, '26-reklam-ana-ekran');
    await pa.click('#btn-play');
    await waitScreen(pa, 'game');
    await sleep(600);
    const geo = await pa.evaluate(() => {
      const ad = document.querySelector('#ad-demo').getBoundingClientRect();
      const wheel = document.querySelector('#wheel').getBoundingClientRect();
      const cells = [...document.querySelectorAll('.cell')].map((c) => c.getBoundingClientRect());
      return { adTop: ad.top, adH: ad.height, wheelBottom: wheel.bottom, vh: innerHeight, lowest: Math.max(...cells.map((r) => r.bottom)), wheelTop: wheel.top };
    });
    check(geo.adH === 60 && Math.abs(geo.adTop + geo.adH - geo.vh) < 1, 'reklam alanı ekranın en altında, 60 px');
    check(geo.wheelBottom <= geo.adTop - 8, `harf çemberi reklam alanına değmiyor (${Math.round(geo.adTop - geo.wheelBottom)} px boşluk)`);
    check(geo.lowest < geo.wheelTop - 20, 'reklam alanı varken bulmaca çemberle çakışmıyor');
    await shot(pa, '27-reklam-oyun');
    // ödüllü reklam
    await pa.click('#btn-hint');
    await sleep(350);
    check(await pa.isVisible('#gem-ad'), 'elmas bitince "REKLAM İZLE" düğmesi çıkıyor');
    await shot(pa, '28-reklam-izle-dugmesi');
    await pa.click('#gem-ad');
    await sleep(300);
    check(await pa.isVisible('#ad-full'), 'ödüllü reklam tam ekran açıldı');
    check(await pa.evaluate(() => window.__kelimeAvi.back()) === true && await pa.isVisible('#ad-full'), 'reklam sırasında geri tuşu oyunu bozmuyor');
    await shot(pa, '29-reklam-tam-ekran');
    await pa.click('#ad-full-close');
    await sleep(300);
    check((await st(pa)).gems === 100 && await pa.isHidden('#modal'), 'ödüllü reklam bitince +100 elmas verildi');
    // bölüm arası reklam: 7. bölümü bitir
    await solveRemaining(pa);
    await finishComplete(pa, { next: 'BÖLÜM 8' });
    await pa.click('#btn-next');
    await sleep(400);
    check(!(await pa.isVisible('#ad-full')), 'son reklamdan 2 dakika geçmeden bölüm arası reklam çıkmıyor');
    await waitScreen(pa, 'game');
    await solveRemaining(pa);
    await finishComplete(pa, { next: 'BÖLÜM 9' });
    await pa.evaluate(() => window.__kelimeAvi.ads.testClock(130000));
    await pa.click('#btn-next');
    await sleep(400);
    check(await pa.isVisible('#ad-full'), 'süre dolunca bölüm arasında tam ekran reklam çıktı');
    check((await scr(pa)) === 'complete', 'reklam kapanmadan sonraki bölüm başlamıyor');
    await pa.click('#ad-full-close');
    await waitScreen(pa, 'game');
    check((await st(pa)).level === 9, 'reklam kapanınca sonraki bölüm açıldı');
    await solveRemaining(pa);
    await finishComplete(pa, { next: 'BÖLÜM 10' });
    await pa.evaluate(() => window.__kelimeAvi.ads.testClock(130000));
    await pa.click('#btn-next');
    await sleep(400);
    check(!(await pa.isVisible('#ad-full')), 'art arda bölümlerde reklam çıkmıyor (en sık 3 bölümde bir)');
    await pa.close();
  }

  console.log('Küçük ekran ve masaüstü (en büyük bulmacalar, reklam alanı açık)');
  const big = await page.evaluate(() => {
    const byCols = LEVELS.reduce((a, b) => (b.cols > a.cols || (b.cols === a.cols && b.rows > a.rows) ? b : a));
    const byRows = LEVELS.reduce((a, b) => (b.rows > a.rows || (b.rows === a.rows && b.cols > a.cols) ? b : a));
    return [...new Set([byCols.n, byRows.n, LEVELS.length])];
  });
  for (const [w, h, name] of [[360, 640, '24-kucuk-ekran'], [320, 568, '24b-cok-kucuk-ekran'], [1280, 800, '25-masaustu']]) {
    const p2 = await browser.newPage({ viewport: { width: w, height: h } });
    p2.on('pageerror', (e) => errors.push(e.message));
    await p2.goto(FILE + '?reklam=demo');
    await p2.waitForFunction(() => window.__kelimeAvi && window.__kelimeAvi.screen() === 'home');
    for (const lvl of big) {
      await p2.evaluate((lvl) => { localStorage.setItem('kelime-avi:v1', JSON.stringify({ v: 1, level: lvl, completed: lvl - 1, gems: 300, tut: { first: true, hintShown: true, hintGiven: true, shuffle: true }, cards: [] })); }, lvl);
      await p2.reload();
      await p2.waitForFunction(() => window.__kelimeAvi.screen() === 'home');
      await p2.click('#btn-play');
      await p2.waitForFunction(() => window.__kelimeAvi.screen() === 'game');
      await sleep(600);
      const o = await p2.evaluate(() => {
        const cells = [...document.querySelectorAll('.cell')].map((c) => c.getBoundingClientRect());
        const wheel = document.querySelector('#wheel').getBoundingClientRect();
        const ad = document.querySelector('#ad-demo').getBoundingClientRect();
        const top = document.querySelector('#scr-game .topbar').getBoundingClientRect();
        return { lowest: Math.max(...cells.map((r) => r.bottom)), highest: Math.min(...cells.map((r) => r.top)), topBottom: top.bottom, size: Math.min(...cells.map((r) => r.width)), wheelTop: wheel.top, wheelBottom: wheel.bottom, adTop: ad.top, scrollW: document.documentElement.scrollWidth, vw: innerWidth, L: window.__kelimeAvi.level() };
      });
      check(o.lowest < o.wheelTop - 20 && o.highest >= o.topBottom - 1, `${w}x${h} bölüm ${lvl} (${o.L.cols}x${o.L.rows}): bulmaca çemberle ve üst çubukla çakışmıyor`);
      check(o.size >= 22, `${w}x${h} bölüm ${lvl}: kutu boyu ${Math.round(o.size)} px (en az 22)`);
      check(o.wheelBottom <= o.adTop, `${w}x${h} bölüm ${lvl}: çember reklam alanının üstünde`);
      check(o.scrollW <= o.vw, `${w}x${h} bölüm ${lvl}: yatay kaydırma yok`);
      if (lvl === big[0]) await p2.screenshot({ path: join(OUT, name + '.png') });
    }
    await p2.close();
  }

  check(errors.length === 0, 'tarayıcıda hata yok' + (errors.length ? ': ' + errors.join(' | ') : ''));
  await browser.close();
  console.log(`\n${checks - failures}/${checks} kontrol geçti. Ekran görüntüleri: ${OUT}`);
  process.exit(failures ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
