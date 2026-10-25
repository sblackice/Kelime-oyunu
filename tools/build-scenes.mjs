// Kelime Avı – tarihî yer arka planlarını (SVG) üretir.
// Kullanım:  node tools/build-scenes.mjs   →  src/scenes/*.svg
// Tüm çizimler bu projeye özgüdür; dikey telefon ekranı için 400x800 tuvalde çizilir.
// Ekranda üstte bulmaca, altta harf çemberi olduğu için yapılar ekranın ortasında, çember ile ızgara arasında görünecek şekilde konumlandırıldı.

import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src', 'scenes');
mkdirSync(OUT, { recursive: true });

// ---------- yardımcılar ----------
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
const f = (n) => Math.round(n * 10) / 10;

function svg(defs, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs>${body}</svg>`;
}
function lin(id, stops, x2 = 0, y2 = 1) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops
    .map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op != null ? ` stop-opacity="${op}"` : ''}/>`)
    .join('')}</linearGradient>`;
}
function rad(id, stops, cx = 0.5, cy = 0.5, r = 0.5) {
  return `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops
    .map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op != null ? ` stop-opacity="${op}"` : ''}/>`)
    .join('')}</radialGradient>`;
}
// Yumuşak tepe silueti (sinüs toplamı)
function ridge(y, amp, seed, color, opts = {}) {
  const r = rng(seed);
  const p1 = r() * 6, p2 = r() * 6, p3 = r() * 6;
  const w1 = opts.w1 || 0.012, w2 = opts.w2 || 0.031, w3 = opts.w3 || 0.07;
  let d = `M0 ${f(y)}`;
  for (let x = 0; x <= 400; x += 8) {
    const yy = y - amp * (0.55 * Math.sin(x * w1 + p1) + 0.3 * Math.sin(x * w2 + p2) + 0.15 * Math.sin(x * w3 + p3));
    d += ` L${x} ${f(yy)}`;
  }
  d += ` L400 ${opts.bottom || 800} L0 ${opts.bottom || 800}Z`;
  return `<path d="${d}" fill="${color}"${opts.op ? ` opacity="${opts.op}"` : ''}/>`;
}
function cloud(x, y, s, color = '#fff', op = 0.8) {
  return `<g opacity="${op}" fill="${color}"><ellipse cx="${x}" cy="${y}" rx="${f(38 * s)}" ry="${f(11 * s)}"/><ellipse cx="${f(x - 14 * s)}" cy="${f(y - 7 * s)}" rx="${f(16 * s)}" ry="${f(12 * s)}"/><ellipse cx="${f(x + 8 * s)}" cy="${f(y - 11 * s)}" rx="${f(19 * s)}" ry="${f(15 * s)}"/></g>`;
}
function gull(x, y, s = 1, color = '#2b2b3a') {
  return `<path d="M${f(x - 9 * s)} ${f(y)} q${f(4.5 * s)} ${f(-5 * s)} ${f(9 * s)} 0 q${f(4.5 * s)} ${f(-5 * s)} ${f(9 * s)} 0" fill="none" stroke="${color}" stroke-width="${f(1.6 * s)}" stroke-linecap="round"/>`;
}
function stars(n, seed, maxY) {
  const r = rng(seed);
  let s = '';
  for (let i = 0; i < n; i++) {
    const rr = r() < 0.12 ? 1.4 : 0.6 + r() * 0.5;
    s += `<circle cx="${f(r() * 400)}" cy="${f(r() * maxY)}" r="${f(rr)}" fill="#fff" opacity="${f(0.35 + r() * 0.6)}"/>`;
  }
  return s;
}
function pine(x, y, h, c1, c2) {
  const w = h * 0.42;
  return `<g><rect x="${f(x - h * 0.03)}" y="${f(y - h * 0.12)}" width="${f(h * 0.06)}" height="${f(h * 0.14)}" fill="#3b2a20"/>` +
    `<path d="M${f(x)} ${f(y - h)} L${f(x + w * 0.55)} ${f(y - h * 0.55)} L${f(x + w * 0.3)} ${f(y - h * 0.55)} L${f(x + w * 0.75)} ${f(y - h * 0.2)} L${f(x + w * 0.4)} ${f(y - h * 0.2)} L${f(x + w)} ${f(y - h * 0.08)} L${f(x - w)} ${f(y - h * 0.08)} L${f(x - w * 0.4)} ${f(y - h * 0.2)} L${f(x - w * 0.75)} ${f(y - h * 0.2)} L${f(x - w * 0.3)} ${f(y - h * 0.55)} L${f(x - w * 0.55)} ${f(y - h * 0.55)}Z" fill="${c1}"/>` +
    `<path d="M${f(x)} ${f(y - h)} L${f(x + w * 0.55)} ${f(y - h * 0.55)} L${f(x + w * 0.3)} ${f(y - h * 0.55)} L${f(x + w * 0.75)} ${f(y - h * 0.2)} L${f(x + w * 0.4)} ${f(y - h * 0.2)} L${f(x + w)} ${f(y - h * 0.08)} L${f(x)} ${f(y - h * 0.08)}Z" fill="${c2}"/></g>`;
}
function cypress(x, y, h, c1 = '#2f4f35', c2 = '#24402a') {
  const w = h * 0.13;
  return `<g><path d="M${f(x)} ${f(y - h)} C${f(x + w)} ${f(y - h * 0.75)} ${f(x + w * 1.1)} ${f(y - h * 0.25)} ${f(x + w * 0.5)} ${f(y)} L${f(x - w * 0.5)} ${f(y)} C${f(x - w * 1.1)} ${f(y - h * 0.25)} ${f(x - w)} ${f(y - h * 0.75)} ${f(x)} ${f(y - h)}Z" fill="${c1}"/><path d="M${f(x)} ${f(y - h)} C${f(x + w)} ${f(y - h * 0.75)} ${f(x + w * 1.1)} ${f(y - h * 0.25)} ${f(x + w * 0.5)} ${f(y)} L${f(x)} ${f(y)}Z" fill="${c2}"/></g>`;
}
function bush(x, y, s, c1, c2) {
  return `<g><ellipse cx="${x}" cy="${y}" rx="${f(22 * s)}" ry="${f(12 * s)}" fill="${c1}"/><ellipse cx="${f(x - 10 * s)}" cy="${f(y - 6 * s)}" rx="${f(12 * s)}" ry="${f(10 * s)}" fill="${c1}"/><ellipse cx="${f(x + 8 * s)}" cy="${f(y - 8 * s)}" rx="${f(13 * s)}" ry="${f(11 * s)}" fill="${c2}"/></g>`;
}
function grass(x, y, s, color) {
  return `<path d="M${x} ${y} l${f(-4 * s)} ${f(-10 * s)} M${x} ${y} l${f(1 * s)} ${f(-13 * s)} M${x} ${y} l${f(5 * s)} ${f(-9 * s)}" stroke="${color}" stroke-width="${f(1.6 * s)}" stroke-linecap="round" fill="none"/>`;
}

// ---------- 1) Kapadokya: peribacaları ve sıcak hava balonları ----------
function balloon(x, y, s, c1, c2) {
  const w = 20 * s, h = 26 * s;
  const env = `M${f(x)} ${f(y - h)} C${f(x + w * 1.25)} ${f(y - h)} ${f(x + w * 1.15)} ${f(y + h * 0.15)} ${f(x + w * 0.32)} ${f(y + h * 0.62)} L${f(x - w * 0.32)} ${f(y + h * 0.62)} C${f(x - w * 1.15)} ${f(y + h * 0.15)} ${f(x - w * 1.25)} ${f(y - h)} ${f(x)} ${f(y - h)}Z`;
  const stripe = `M${f(x)} ${f(y - h)} C${f(x + w * 0.45)} ${f(y - h)} ${f(x + w * 0.42)} ${f(y + h * 0.2)} ${f(x + w * 0.12)} ${f(y + h * 0.62)} L${f(x - w * 0.12)} ${f(y + h * 0.62)} C${f(x - w * 0.42)} ${f(y + h * 0.2)} ${f(x - w * 0.45)} ${f(y - h)} ${f(x)} ${f(y - h)}Z`;
  return `<g><path d="${env}" fill="${c1}"/><path d="${stripe}" fill="${c2}"/>` +
    `<path d="${env}" fill="url(#balShade)"/>` +
    `<path d="M${f(x - w * 0.3)} ${f(y + h * 0.62)} L${f(x - w * 0.18)} ${f(y + h * 0.95)} M${f(x + w * 0.3)} ${f(y + h * 0.62)} L${f(x + w * 0.18)} ${f(y + h * 0.95)}" stroke="#5a3b2b" stroke-width="${f(0.8 * s)}"/>` +
    `<rect x="${f(x - w * 0.2)}" y="${f(y + h * 0.93)}" width="${f(w * 0.4)}" height="${f(h * 0.2)}" rx="${f(1.5 * s)}" fill="#6b4630"/></g>`;
}
function chimney(x, base, w, h, light, shade, cap) {
  const top = base - h;
  const body = `M${f(x - w)} ${f(base)} C${f(x - w * 0.8)} ${f(base - h * 0.45)} ${f(x - w * 0.42)} ${f(top + h * 0.25)} ${f(x - w * 0.3)} ${f(top + 6)} Q${f(x)} ${f(top - 4)} ${f(x + w * 0.3)} ${f(top + 6)} C${f(x + w * 0.42)} ${f(top + h * 0.25)} ${f(x + w * 0.8)} ${f(base - h * 0.45)} ${f(x + w)} ${f(base)}Z`;
  const shadeP = `M${f(x + w * 0.05)} ${f(top + 2)} Q${f(x + w * 0.2)} ${f(top)} ${f(x + w * 0.3)} ${f(top + 6)} C${f(x + w * 0.42)} ${f(top + h * 0.25)} ${f(x + w * 0.8)} ${f(base - h * 0.45)} ${f(x + w)} ${f(base)} L${f(x + w * 0.25)} ${f(base)}Z`;
  let s = `<g><path d="${body}" fill="${light}"/><path d="${shadeP}" fill="${shade}"/>`;
  if (cap) s += `<ellipse cx="${f(x)}" cy="${f(top + 2)}" rx="${f(w * 0.48)}" ry="${f(w * 0.22)}" fill="${cap}"/>`;
  return s + '</g>';
}
function cave(x, y, s, c = '#6b3f31') {
  return `<path d="M${f(x - 4 * s)} ${f(y + 6 * s)} L${f(x - 4 * s)} ${f(y)} Q${f(x)} ${f(y - 5 * s)} ${f(x + 4 * s)} ${f(y)} L${f(x + 4 * s)} ${f(y + 6 * s)}Z" fill="${c}"/>`;
}
function kapadokya() {
  const defs =
    lin('sky', [[0, '#5f6fbf'], [0.42, '#b98ec7'], [0.62, '#f2a98e'], [0.72, '#ffd2a1']]) +
    rad('sun', [[0, '#fff3cf'], [0.35, '#ffe0a8', 0.9], [1, '#ffd29a', 0]]) +
    lin('balShade', [[0, '#fff', 0.18], [0.5, '#fff', 0], [1, '#000', 0.22]], 1, 0) +
    lin('ground', [[0, '#c4835e'], [1, '#8f5641']]);
  let b = `<rect width="400" height="800" fill="url(#sky)"/>`;
  b += `<circle cx="292" cy="520" r="120" fill="url(#sun)"/><circle cx="292" cy="520" r="30" fill="#fff4d6"/>`;
  b += cloud(80, 150, 1.1, '#fff', 0.35) + cloud(320, 230, 0.9, '#ffe9e0', 0.4) + cloud(160, 300, 0.7, '#fff', 0.3);
  // balonlar (uzak: küçük ve soluk)
  const balls = [
    [60, 120, 0.7, '#e8574a', '#f6c453'], [138, 210, 0.55, '#2a9d8f', '#f1e3c6'], [228, 92, 0.85, '#f2b632', '#e0533d'],
    [330, 150, 0.65, '#3a5ba0', '#f6c453'], [305, 330, 0.45, '#e0533d', '#fff4dc'], [90, 330, 0.4, '#f2b632', '#3a5ba0'],
    [190, 390, 0.32, '#2a9d8f', '#f2b632'], [360, 420, 0.3, '#e8574a', '#fff'], [250, 250, 0.38, '#8e5aa8', '#f6c453'],
  ];
  for (const [x, y, s, c1, c2] of balls) b += `<g opacity="${f(0.55 + s * 0.5)}">${balloon(x, y, s * 1.6, c1, c2)}</g>`;
  // uzak sırtlar
  b += ridge(560, 18, 3, '#b48aa8', { op: 0.8 });
  b += ridge(585, 22, 7, '#c99a9f');
  // orta: düz tepeli platolar ve peribacaları
  b += `<path d="M0 600 L40 600 L52 585 L120 583 L132 600 L400 600 L400 800 L0 800Z" fill="#d9a07f"/>`;
  const ch = [
    [34, 700, 30, 250, '#e8c29b', '#c88f69', '#8a5a45'], [88, 712, 22, 175, '#e2b78f', '#c08560', '#80523f'],
    [326, 700, 32, 270, '#ebc7a1', '#c98f69', '#8a5a45'], [376, 712, 24, 190, '#e2b78f', '#bf8460', '#80523f'],
    [136, 700, 16, 120, '#e6be96', '#c58a64', '#86563f'], [274, 700, 18, 140, '#e6be96', '#c58a64', null],
    [206, 690, 14, 95, '#eac5a0', '#c98f69', '#8a5a45'], [170, 700, 11, 70, '#e2b78f', '#c08560', null],
    [242, 705, 12, 80, '#e2b78f', '#c08560', '#80523f'],
  ];
  for (const c of ch) b += chimney(...c);
  b += cave(30, 560, 1.4) + cave(40, 600, 1.2) + cave(26, 640, 1.1) + cave(322, 545, 1.5) + cave(334, 590, 1.2) + cave(316, 630, 1.1) + cave(88, 610, 1.1) + cave(378, 600, 1.2) + cave(136, 640, 0.9) + cave(274, 630, 1);
  // ön plan: tüf kayalar
  b += `<path d="M0 690 C60 672 110 700 170 688 C230 676 280 702 340 686 C370 678 390 684 400 688 L400 800 L0 800Z" fill="url(#ground)"/>`;
  b += `<path d="M0 742 C80 728 140 752 220 740 C300 728 350 748 400 736 L400 800 L0 800Z" fill="#7a4636" opacity="0.7"/>`;
  b += bush(52, 720, 0.8, '#7c7a3f', '#8f8d4a') + bush(356, 724, 0.9, '#7c7a3f', '#8f8d4a') + bush(205, 712, 0.6, '#86843f', '#9a974d');
  return svg(defs, b);
}

// ---------- 2) Efes: Celsus Kütüphanesi ----------
function efes() {
  const defs =
    lin('sky', [[0, '#5aa6dc'], [0.55, '#a9d6ef'], [0.75, '#e6f2f2']]) +
    lin('marble', [[0, '#f3e9d6'], [1, '#d9c7a6']], 1, 0) +
    lin('wall', [[0, '#e5d5b8'], [1, '#cbb592']]) +
    lin('ground', [[0, '#dbc79d'], [1, '#b9a074']]);
  let b = `<rect width="400" height="800" fill="url(#sky)"/>`;
  b += cloud(70, 120, 1.2, '#fff', 0.85) + cloud(310, 180, 1, '#fff', 0.8) + cloud(200, 260, 0.6, '#fff', 0.6);
  b += ridge(520, 26, 11, '#8fae9e', { op: 0.75 });
  b += ridge(560, 18, 5, '#9fb48c');
  // cephe
  const L = 72, R = 328, W = R - L;
  b += `<rect x="${L}" y="330" width="${W}" height="300" fill="url(#wall)"/>`;
  // kapılar ve pencereler
  for (const x of [128, 200, 272]) {
    const w = x === 200 ? 30 : 24;
    b += `<path d="M${x - w / 2} 600 L${x - w / 2} 538 Q${x} 520 ${x + w / 2} 538 L${x + w / 2} 600Z" fill="#5c4630"/>`;
    b += `<rect x="${x - 11}" y="376" width="22" height="34" rx="3" fill="#6b533a"/>`;
  }
  // alt kat sütunları (4 çift)
  const pairs = [86, 156, 230, 300];
  for (const px of pairs) {
    for (const dx of [0, 16]) {
      const x = px + dx;
      b += `<rect x="${x}" y="452" width="11" height="140" fill="url(#marble)"/><rect x="${x - 2}" y="446" width="15" height="7" fill="#efe2c8"/><rect x="${x - 2}" y="590" width="15" height="6" fill="#d8c6a4"/>`;
    }
    b += `<rect x="${px - 6}" y="432" width="41" height="15" fill="#efe2c8"/><rect x="${px - 6}" y="444" width="41" height="3" fill="#cdb894"/>`;
  }
  b += `<rect x="${L - 4}" y="426" width="${W + 8}" height="7" fill="#e9dcc1"/>`;
  // üst kat: 3 çıkıntılı bölme + alınlıklar (üçgen ve kavisli)
  const up = [[121, 'tri'], [192, 'arc'], [265, 'tri']];
  for (const [px, kind] of up) {
    for (const dx of [0, 15]) {
      const x = px + dx;
      b += `<rect x="${x}" y="350" width="9" height="74" fill="url(#marble)"/><rect x="${x - 2}" y="345" width="13" height="6" fill="#efe2c8"/>`;
    }
    b += `<rect x="${px - 6}" y="334" width="36" height="12" fill="#efe2c8"/>`;
    if (kind === 'tri') b += `<path d="M${px - 8} 334 L${px + 12} 312 L${px + 32} 334Z" fill="#ead9bb" stroke="#cdb894" stroke-width="1.5"/>`;
    else b += `<path d="M${px - 8} 334 Q${px + 12} 300 ${px + 32} 334Z" fill="#ead9bb" stroke="#cdb894" stroke-width="1.5"/>`;
  }
  b += `<rect x="${L - 4}" y="326" width="${W + 8}" height="6" fill="#e9dcc1"/>`;
  // basamaklar
  b += `<rect x="${L - 12}" y="596" width="${W + 24}" height="12" fill="#e8dcc3"/><rect x="${L - 24}" y="607" width="${W + 48}" height="12" fill="#ddcfb1"/><rect x="${L - 36}" y="618" width="${W + 72}" height="14" fill="#cfbf9d"/>`;
  // yıkıntı ve servi ağaçları
  b += cypress(28, 640, 190) + cypress(372, 640, 170) + cypress(52, 640, 120, '#3a5a3f', '#2c4a31') + cypress(352, 640, 110, '#3a5a3f', '#2c4a31');
  b += `<path d="M0 628 C90 620 160 636 240 628 C320 620 360 630 400 626 L400 800 L0 800Z" fill="url(#ground)"/>`;
  // devrik sütun parçaları
  b += `<g><rect x="40" y="690" width="70" height="22" rx="10" fill="#e8dcc3"/><ellipse cx="110" cy="701" rx="8" ry="11" fill="#d5c4a2"/><rect x="290" y="676" width="34" height="38" rx="3" fill="#e2d4b7"/><rect x="285" y="670" width="44" height="8" fill="#efe3cb"/><rect x="330" y="700" width="40" height="14" fill="#d6c6a6"/></g>`;
  for (let i = 0; i < 18; i++) b += grass(15 + i * 22, 760 - (i % 3) * 18, 1.1, '#8e9a52');
  return svg(defs, b);
}

// ---------- 3) Ayasofya ----------
function minaret(x, base, top, w) {
  return `<g><rect x="${f(x - w / 2)}" y="${top}" width="${w}" height="${base - top}" fill="#efe2d2"/><rect x="${f(x)}" y="${top}" width="${f(w / 2)}" height="${base - top}" fill="#d8c5b0"/>` +
    `<rect x="${f(x - w / 2 - 3)}" y="${f(top + (base - top) * 0.28)}" width="${w + 6}" height="5" fill="#e7d7c4"/><rect x="${f(x - w / 2 - 3)}" y="${f(top + (base - top) * 0.55)}" width="${w + 6}" height="5" fill="#e7d7c4"/>` +
    `<path d="M${f(x - w / 2)} ${top} L${x} ${top - w * 3.4} L${f(x + w / 2)} ${top}Z" fill="#7d8aa3"/><path d="M${x} ${top - w * 3.4} L${f(x + w / 2)} ${top} L${x} ${top}Z" fill="#65728c"/><line x1="${x}" y1="${top - w * 3.4}" x2="${x}" y2="${top - w * 3.4 - 8}" stroke="#d9b45a" stroke-width="1.5"/></g>`;
}
function ayasofya() {
  const defs =
    lin('sky', [[0, '#1d2f6e'], [0.45, '#6c5a9e'], [0.68, '#e7876a'], [0.78, '#f6b98a']]) +
    lin('dome', [[0, '#a7b3c6'], [1, '#6f7c93']], 1, 0) +
    lin('rose', [[0, '#d99a82'], [1, '#b36f5d']], 1, 0) +
    lin('sea', [[0, '#e49a7f'], [0.4, '#7a6aa0'], [1, '#2f3a74']]);
  let b = `<rect width="400" height="800" fill="url(#sky)"/>` + stars(30, 4, 220);
  b += `<circle cx="70" cy="560" r="26" fill="#ffd9a0" opacity="0.9"/>`;
  b += ridge(600, 14, 21, '#6a5a8c', { op: 0.6 });
  // ana yapı
  const cx = 200;
  b += minaret(118, 600, 368, 9) + minaret(282, 600, 368, 9);
  b += `<rect x="96" y="500" width="208" height="110" fill="url(#rose)"/>`;
  b += `<path d="M110 500 Q150 448 196 452 L204 452 Q250 448 290 500Z" fill="#c98571"/>`;
  // yarım kubbeler
  b += `<path d="M118 500 A42 38 0 0 1 202 500Z" fill="url(#dome)"/><path d="M198 500 A42 38 0 0 1 282 500Z" fill="url(#dome)"/>`;
  // kasnak ve ana kubbe
  b += `<rect x="146" y="446" width="108" height="20" fill="#cf8f78"/>`;
  for (let i = 0; i < 9; i++) b += `<rect x="${152 + i * 11.5}" y="450" width="5" height="11" rx="2" fill="#5b3a3a"/>`;
  b += `<path d="M142 448 A58 54 0 0 1 258 448Z" fill="url(#dome)"/><path d="M152 440 A48 40 0 0 1 200 400" fill="none" stroke="#dfe6ef" stroke-width="3" opacity="0.6"/>`;
  b += `<line x1="${cx}" y1="394" x2="${cx}" y2="378" stroke="#d9b45a" stroke-width="2.5"/><circle cx="${cx}" cy="376" r="3" fill="#d9b45a"/>`;
  // payandalar ve pencereler
  for (const x of [96, 150, 236, 290]) b += `<rect x="${x}" y="492" width="14" height="118" fill="#a9675a"/>`;
  for (let i = 0; i < 6; i++) b += `<path d="M${128 + i * 26} 560 L${128 + i * 26} 548 Q${134 + i * 26} 540 ${140 + i * 26} 548 L${140 + i * 26} 560Z" fill="#5b3a3a"/>`;
  b += minaret(70, 612, 350, 11) + minaret(330, 612, 350, 11);
  // ağaçlar ve deniz
  b += `<rect x="0" y="606" width="400" height="20" fill="#3e4a3a"/>`;
  for (let i = 0; i < 12; i++) b += bush(10 + i * 36, 612, 0.75 + (i % 3) * 0.1, '#334533', '#3f5540');
  b += `<rect x="0" y="622" width="400" height="178" fill="url(#sea)"/>`;
  for (let i = 0; i < 16; i++) b += `<rect x="${f(40 + ((i * 53) % 300))}" y="${640 + i * 9}" width="${f(30 + (i % 4) * 14)}" height="2" rx="1" fill="#ffd9b0" opacity="${f(0.15 + (i % 3) * 0.12)}"/>`;
  b += gull(300, 300, 1.2, '#2a2440') + gull(330, 280, 0.9, '#2a2440') + gull(95, 250, 1, '#2a2440');
  return svg(defs, b);
}

// ---------- 4) Pamukkale: travertenler ----------
function terrace(cx, y, w, h, seed) {
  const r = rng(seed);
  let rim = `M${f(cx - w)} ${f(y)} Q${f(cx)} ${f(y - h * 0.5)} ${f(cx + w)} ${f(y)}`;
  // sarkıt kenar
  let edge = '';
  const n = Math.max(6, Math.round(w / 9));
  for (let i = 0; i <= n; i++) {
    const x = cx + w - (2 * w * i) / n;
    const t = (x - cx) / w;
    const yy = y + 4 + (1 - t * t) * h * 0.05;
    const drop = 8 + r() * h * 0.55;
    edge += ` L${f(x)} ${f(yy + drop)} L${f(x - w / n / 2)} ${f(yy + 3)}`;
  }
  const body = `${rim}${edge} Z`;
  const pool = `M${f(cx - w * 0.92)} ${f(y - 2)} Q${f(cx)} ${f(y - h * 0.46)} ${f(cx + w * 0.92)} ${f(y - 2)} Q${f(cx)} ${f(y + h * 0.04)} ${f(cx - w * 0.92)} ${f(y - 2)}Z`;
  return `<g><path d="${body}" fill="#f6f7f4"/><path d="${body}" fill="url(#trShade)"/><path d="${pool}" fill="url(#pool)"/><path d="M${f(cx - w * 0.6)} ${f(y - h * 0.2)} Q${f(cx)} ${f(y - h * 0.34)} ${f(cx + w * 0.4)} ${f(y - h * 0.22)}" stroke="#fff" stroke-width="1.4" fill="none" opacity="0.7"/></g>`;
}
function pamukkale() {
  const defs =
    lin('sky', [[0, '#3f9ad8'], [0.5, '#93cdef'], [0.7, '#e2f3fa']]) +
    lin('pool', [[0, '#9be6e6'], [1, '#2fb3bf']]) +
    lin('trShade', [[0, '#fff', 0], [0.6, '#cdd8da', 0.35], [1, '#aebfc3', 0.6]]) +
    lin('hill', [[0, '#eef1ee'], [1, '#d5dedd']]);
  let b = `<rect width="400" height="800" fill="url(#sky)"/>`;
  b += `<circle cx="320" cy="120" r="34" fill="#fff6d8"/><circle cx="320" cy="120" r="60" fill="#fff6d8" opacity="0.25"/>`;
  b += cloud(90, 170, 1.1, '#fff', 0.9) + cloud(250, 240, 0.8, '#fff', 0.8);
  b += ridge(440, 30, 31, '#9db08a', { op: 0.85 });
  // tepe üstü: ağaçlar ve antik sütunlar
  b += `<path d="M0 470 C80 440 160 452 230 446 C300 440 360 452 400 460 L400 800 L0 800Z" fill="url(#hill)"/>`;
  for (let i = 0; i < 9; i++) b += bush(20 + i * 46, 452 + (i % 2) * 6, 0.6, '#5f8a52', '#6f9a5e');
  for (const x of [292, 306, 320, 334]) b += `<rect x="${x}" y="408" width="7" height="40" fill="#e9e1cf"/>`;
  b += `<rect x="288" y="402" width="54" height="7" fill="#efe8d8"/>`;
  // teraslar (yukarıdan aşağı)
  const T = [
    [120, 500, 120, 34, 1], [300, 500, 110, 32, 2], [210, 540, 150, 40, 3], [70, 590, 110, 40, 4], [300, 596, 120, 40, 5],
    [190, 640, 170, 46, 6], [60, 700, 120, 46, 7], [330, 700, 120, 46, 8], [200, 750, 190, 50, 9],
  ];
  for (const t of T) b += terrace(...t);
  return svg(defs, b);
}

// ---------- 5) Nemrut Dağı: dev taş başlar ----------
function stoneHead(x, base, s, seed) {
  const r = rng(seed);
  const w = 34 * s, h = 46 * s, hat = 52 * s;
  let g = `<g>`;
  // başlık (konik taç)
  g += `<path d="M${f(x - w * 0.82)} ${f(base - h)} C${f(x - w * 0.8)} ${f(base - h - hat * 0.6)} ${f(x - w * 0.3)} ${f(base - h - hat)} ${f(x + w * 0.15)} ${f(base - h - hat * 0.98)} C${f(x + w * 0.6)} ${f(base - h - hat * 0.9)} ${f(x + w * 0.85)} ${f(base - h - hat * 0.5)} ${f(x + w * 0.82)} ${f(base - h)}Z" fill="#b29070"/>`;
  g += `<path d="M${f(x + w * 0.15)} ${f(base - h - hat * 0.98)} C${f(x + w * 0.6)} ${f(base - h - hat * 0.9)} ${f(x + w * 0.85)} ${f(base - h - hat * 0.5)} ${f(x + w * 0.82)} ${f(base - h)} L${f(x + w * 0.2)} ${f(base - h)}Z" fill="#8f7056"/>`;
  g += `<rect x="${f(x - w * 0.86)}" y="${f(base - h - 6 * s)}" width="${f(w * 1.72)}" height="${f(8 * s)}" rx="${f(3 * s)}" fill="#a3825f"/>`;
  // yüz
  g += `<path d="M${f(x - w * 0.75)} ${f(base - h)} L${f(x + w * 0.75)} ${f(base - h)} C${f(x + w * 0.8)} ${f(base - h * 0.45)} ${f(x + w * 0.55)} ${f(base)} ${f(x)} ${f(base)} C${f(x - w * 0.55)} ${f(base)} ${f(x - w * 0.8)} ${f(base - h * 0.45)} ${f(x - w * 0.75)} ${f(base - h)}Z" fill="#c4a27f"/>`;
  g += `<path d="M${f(x + w * 0.1)} ${f(base - h)} L${f(x + w * 0.75)} ${f(base - h)} C${f(x + w * 0.8)} ${f(base - h * 0.45)} ${f(x + w * 0.55)} ${f(base)} ${f(x)} ${f(base)}Z" fill="#a8876a"/>`;
  // gözler, burun, ağız
  g += `<path d="M${f(x - w * 0.42)} ${f(base - h * 0.72)} q${f(w * 0.14)} ${f(-4 * s)} ${f(w * 0.28)} 0 M${f(x + w * 0.14)} ${f(base - h * 0.72)} q${f(w * 0.14)} ${f(-4 * s)} ${f(w * 0.28)} 0" stroke="#6e5340" stroke-width="${f(2.2 * s)}" fill="none" stroke-linecap="round"/>`;
  g += `<path d="M${f(x)} ${f(base - h * 0.66)} L${f(x - w * 0.08)} ${f(base - h * 0.42)} L${f(x + w * 0.08)} ${f(base - h * 0.42)}" stroke="#6e5340" stroke-width="${f(1.8 * s)}" fill="none"/>`;
  g += `<path d="M${f(x - w * 0.16)} ${f(base - h * 0.3)} q${f(w * 0.16)} ${f(4 * s)} ${f(w * 0.32)} 0" stroke="#6e5340" stroke-width="${f(1.8 * s)}" fill="none" stroke-linecap="round"/>`;
  // sakal bukleleri
  for (let row = 0; row < 2; row++) for (let i = 0; i < 4; i++) {
    g += `<circle cx="${f(x - w * 0.36 + i * w * 0.24 + (row ? w * 0.12 : 0))}" cy="${f(base - h * 0.16 + row * 6 * s)}" r="${f(3 * s)}" fill="#9c7c60" opacity="${f(0.7 + r() * 0.3)}"/>`;
  }
  return g + '</g>';
}
function nemrut() {
  const defs =
    lin('sky', [[0, '#2c2352'], [0.38, '#7c3f73'], [0.58, '#e06f62'], [0.7, '#f8b065']]) +
    rad('sun', [[0, '#fff0c4'], [0.4, '#ffc977', 0.8], [1, '#ff9e5a', 0]]) +
    lin('tumulus', [[0, '#9b7a66'], [1, '#6b5045']], 1, 0) +
    lin('ground', [[0, '#7b5c4b'], [1, '#4e3a33']]);
  let b = `<rect width="400" height="800" fill="url(#sky)"/>` + stars(26, 9, 200);
  b += `<circle cx="200" cy="560" r="150" fill="url(#sun)"/><circle cx="200" cy="560" r="44" fill="#ffe2a6"/>`;
  b += ridge(570, 30, 41, '#6c4a73', { op: 0.85 });
  b += ridge(600, 22, 45, '#5c3f5f');
  // tümülüs (taş yığını tepe)
  b += `<path d="M40 640 C110 600 150 470 200 452 C250 470 290 600 360 640Z" fill="url(#tumulus)"/>`;
  const r = rng(77);
  for (let i = 0; i < 70; i++) {
    const t = r();
    const y = 470 + t * 165;
    const half = 8 + t * 150;
    b += `<circle cx="${f(200 + (r() * 2 - 1) * half * 0.9)}" cy="${f(y)}" r="${f(0.8 + r() * 1.3)}" fill="#5a4038" opacity="0.6"/>`;
  }
  // teras zemini
  b += `<path d="M0 640 L400 636 L400 800 L0 800Z" fill="url(#ground)"/>`;
  for (let i = 0; i < 9; i++) b += `<rect x="${i * 46 - 6}" y="${646 + (i % 2) * 4}" width="40" height="14" rx="3" fill="#6a4f42" opacity="0.8"/>`;
  // kartal heykeli başı (sağ)
  b += `<g><path d="M300 700 C300 640 320 612 352 612 C372 612 384 624 392 636 L372 640 C380 660 380 690 372 700Z" fill="#b29070"/><path d="M392 636 L372 640 L380 652Z" fill="#8f7056"/><circle cx="356" cy="630" r="3" fill="#5a4334"/><path d="M330 650 q12 8 30 4 M326 668 q14 8 34 4" stroke="#8f7056" stroke-width="2" fill="none"/></g>`;
  // dev başlar
  b += stoneHead(84, 740, 1.6, 3) + stoneHead(214, 694, 0.95, 5);
  return svg(defs, b);
}

// ---------- 6) Galata Kulesi ----------
function house(x, base, w, h, roof, wall, seed) {
  const r = rng(seed);
  let s = `<rect x="${x}" y="${base - h}" width="${w}" height="${h}" fill="${wall}"/><path d="M${x - 3} ${base - h} L${x + w / 2} ${base - h - w * 0.32} L${x + w + 3} ${base - h}Z" fill="${roof}"/>`;
  const cols = Math.max(1, Math.floor(w / 12));
  const rows = Math.max(1, Math.floor(h / 16));
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    if (r() < 0.55) s += `<rect x="${f(x + 4 + i * (w - 8) / cols)}" y="${f(base - h + 6 + j * 16)}" width="5" height="7" fill="#ffd27a" opacity="${f(0.6 + r() * 0.4)}"/>`;
  }
  return s;
}
function galata() {
  const defs =
    lin('sky', [[0, '#0d1a46'], [0.45, '#27387f'], [0.66, '#8e5a8a'], [0.76, '#f09a64']]) +
    lin('stone', [[0, '#e3cfb1'], [0.55, '#c3a987'], [1, '#8f7860']], 1, 0) +
    lin('cone', [[0, '#7f90b3'], [1, '#3f4d70']], 1, 0) +
    lin('sea', [[0, '#3a3f7a'], [1, '#141c46']]) +
    rad('glow', [[0, '#ffd27a', 0.55], [1, '#ffd27a', 0]]);
  let b = `<rect width="400" height="800" fill="url(#sky)"/>` + stars(60, 13, 360);
  b += `<path d="M330 92 a26 26 0 1 0 0 52 a20 20 0 1 1 0 -52Z" fill="#fff3d6"/>`;
  // uzak tarihî yarımada silueti
  b += `<path d="M0 600 L0 572 L30 570 Q40 552 50 570 L74 570 L74 540 L76 534 L78 540 L78 570 L110 570 Q126 548 142 570 L170 572 L240 574 L262 574 Q280 552 298 574 L320 574 L320 546 L322 540 L324 546 L324 574 L400 574 L400 600Z" fill="#3c3266" opacity="0.8"/>`;
  // kule
  const x = 200;
  b += `<ellipse cx="${x}" cy="420" rx="90" ry="140" fill="url(#glow)"/>`;
  b += `<path d="M${x - 40} 650 L${x - 34} 372 L${x + 34} 372 L${x + 40} 650Z" fill="url(#stone)"/>`;
  for (let i = 0; i < 9; i++) b += `<line x1="${x - 39 + i * 0.4}" y1="${400 + i * 28}" x2="${x + 39 - i * 0.4}" y2="${400 + i * 28}" stroke="#a48d70" stroke-width="1" opacity="0.5"/>`;
  for (const [wy, wx] of [[430, -12], [480, 10], [530, -8], [585, 12]]) b += `<rect x="${x + wx - 3}" y="${wy}" width="6" height="16" rx="3" fill="#ffd27a"/>`;
  // seyir katı: kemerli pencereler
  b += `<rect x="${x - 38}" y="330" width="76" height="44" fill="#d9c3a3"/>`;
  for (let i = 0; i < 6; i++) b += `<path d="M${x - 33 + i * 12} 368 L${x - 33 + i * 12} 346 Q${x - 29 + i * 12} 338 ${x - 25 + i * 12} 346 L${x - 25 + i * 12} 368Z" fill="#ffcf6e"/>`;
  b += `<rect x="${x - 46}" y="370" width="92" height="7" fill="#b89c7b"/>`;
  for (let i = 0; i < 12; i++) b += `<rect x="${x - 44 + i * 8}" y="377" width="1.5" height="9" fill="#5a4a3a"/>`;
  b += `<rect x="${x - 46}" y="385" width="92" height="3" fill="#8f7860"/><rect x="${x - 42}" y="324" width="84" height="7" fill="#c9b08f"/>`;
  // konik çatı
  b += `<path d="M${x - 44} 326 L${x} 210 L${x + 44} 326Z" fill="url(#cone)"/><line x1="${x}" y1="210" x2="${x}" y2="190" stroke="#d9b45a" stroke-width="2.5"/><circle cx="${x}" cy="188" r="3.5" fill="#d9b45a"/>`;
  // evler
  const H = [
    [6, 660, 44, 70, '#7b3f3a', '#c9a27f'], [52, 668, 38, 60, '#6c3a3a', '#b98d6e'], [92, 660, 40, 74, '#7b3f3a', '#d3b190'],
    [250, 662, 42, 66, '#6c3a3a', '#c79c7b'], [294, 656, 48, 80, '#7b3f3a', '#b98d6e'], [344, 664, 52, 66, '#6c3a3a', '#d3b190'],
    [128, 672, 40, 50, '#5c3333', '#a98063'], [212, 676, 40, 44, '#5c3333', '#a98063'],
  ];
  H.forEach((h, i) => (b += house(...h, i + 1)));
  b += `<rect x="0" y="672" width="400" height="20" fill="#2a2440"/>`;
  b += `<rect x="0" y="690" width="400" height="110" fill="url(#sea)"/>`;
  const r = rng(5);
  for (let i = 0; i < 34; i++) b += `<rect x="${f(r() * 380)}" y="${f(696 + r() * 100)}" width="${f(8 + r() * 26)}" height="2" rx="1" fill="#ffd27a" opacity="${f(0.15 + r() * 0.4)}"/>`;
  b += gull(80, 300, 1.2, '#c9d1ef') + gull(110, 286, 0.9, '#c9d1ef') + gull(320, 330, 1, '#c9d1ef');
  return svg(defs, b);
}

// ---------- 7) Sümela Manastırı ----------
function sumela() {
  const defs =
    lin('sky', [[0, '#8fb6bd'], [0.6, '#d4e4e0'], [1, '#eef3ef']]) +
    lin('cliff', [[0, '#7a786c'], [0.5, '#5d5b51'], [1, '#45443d']], 1, 0) +
    lin('fog', [[0, '#fff', 0], [0.5, '#fff', 0.75], [1, '#fff', 0]], 1, 0);
  let b = `<rect width="400" height="800" fill="url(#sky)"/>`;
  b += ridge(300, 40, 51, '#7f9f97', { op: 0.6 });
  b += ridge(360, 36, 53, '#5f8478', { op: 0.75 });
  b += `<rect x="0" y="330" width="400" height="40" fill="url(#fog)"/>`;
  // kayalık
  b += `<path d="M150 800 L160 520 C165 430 190 330 230 270 C260 230 300 210 340 220 C370 228 392 250 400 262 L400 800Z" fill="url(#cliff)"/>`;
  for (let i = 0; i < 9; i++) b += `<path d="M${240 + i * 17} ${300 + (i % 3) * 20} L${236 + i * 17} ${560 + (i % 4) * 30}" stroke="#3e3d37" stroke-width="2" opacity="0.4"/>`;
  // manastır (kayaya yaslanmış katlar)
  const mx = 238, my = 470;
  b += `<rect x="${mx - 18}" y="${my + 64}" width="160" height="10" fill="#8a826f"/>`;
  const blocks = [
    [mx - 10, my + 4, 46, 60, '#efe6d2'], [mx + 34, my - 14, 40, 78, '#e8dcc4'], [mx + 72, my + 10, 52, 54, '#f2ead8'], [mx + 120, my - 4, 30, 68, '#e3d6bd'],
  ];
  for (const [x, y, w, h, c] of blocks) {
    b += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/><rect x="${x + w - 7}" y="${y}" width="7" height="${h}" fill="#cbbd9f"/>`;
    b += `<path d="M${x - 3} ${y} L${x + w / 2} ${y - 9} L${x + w + 3} ${y}Z" fill="#8c4a3a"/>`;
    const cols = Math.floor(w / 11);
    for (let i = 0; i < cols; i++) for (let j = 0; j < Math.floor(h / 20); j++) b += `<path d="M${x + 5 + i * 11} ${y + 18 + j * 20} L${x + 5 + i * 11} ${y + 10 + j * 20} Q${x + 8 + i * 11} ${y + 6 + j * 20} ${x + 11 + i * 11} ${y + 10 + j * 20} L${x + 11 + i * 11} ${y + 18 + j * 20}Z" fill="#4c3b30"/>`;
  }
  // kemerli destek duvarı
  b += `<rect x="${mx - 14}" y="${my + 72}" width="156" height="34" fill="#cfc2a6"/>`;
  for (let i = 0; i < 7; i++) b += `<path d="M${mx - 8 + i * 22} ${my + 106} L${mx - 8 + i * 22} ${my + 88} Q${mx + 1 + i * 22} ${my + 78} ${mx + 10 + i * 22} ${my + 88} L${mx + 10 + i * 22} ${my + 106}Z" fill="#6b604e"/>`;
  b += `<rect x="0" y="600" width="400" height="44" fill="url(#fog)" opacity="0.8"/>`;
  // ormanlık yamaçlar
  b += ridge(620, 30, 57, '#3f6b4e');
  const r = rng(91);
  for (let i = 0; i < 26; i++) {
    const x = r() * 420 - 10;
    const y = 640 + r() * 150;
    const h = 60 + r() * 90;
    b += pine(f(x), f(y), f(h), r() < 0.5 ? '#2f5d3e' : '#3d7350', '#24492f');
  }
  for (let i = 0; i < 10; i++) b += pine(f(i * 22), f(560 + (i % 3) * 18), f(70 + (i % 4) * 14), '#3d7350', '#2a5238');
  return svg(defs, b);
}

// ---------- 8) Göbeklitepe: T biçimli dikilitaşlar ----------
function tPillar(x, base, h, w, relief) {
  let s = `<g><rect x="${f(x - w / 2)}" y="${f(base - h)}" width="${w}" height="${h}" fill="#dcc59d"/><rect x="${f(x + w * 0.1)}" y="${f(base - h)}" width="${f(w * 0.4)}" height="${h}" fill="#bea47a"/>`;
  s += `<rect x="${f(x - w * 1.35)}" y="${f(base - h - w * 0.9)}" width="${f(w * 2.7)}" height="${f(w * 0.95)}" rx="${f(w * 0.12)}" fill="#e4cfa9"/><rect x="${f(x - w * 1.35)}" y="${f(base - h - w * 0.2)}" width="${f(w * 2.7)}" height="${f(w * 0.25)}" fill="#c3a97f"/>`;
  if (relief === 'fox') s += `<path d="M${f(x - w * 0.35)} ${f(base - h * 0.55)} l${f(w * 0.25)} ${f(-w * 0.35)} l${f(w * 0.1)} ${f(w * 0.25)} l${f(w * 0.25)} 0 l${f(-w * 0.05)} ${f(w * 0.5)} l${f(-w * 0.45)} ${f(w * 0.1)}Z" fill="none" stroke="#8c7350" stroke-width="2"/>`;
  if (relief === 'snake') s += `<path d="M${f(x - w * 0.2)} ${f(base - h * 0.85)} q${f(w * 0.3)} ${f(w * 0.25)} 0 ${f(w * 0.5)} q${f(-w * 0.3)} ${f(w * 0.25)} 0 ${f(w * 0.5)} q${f(w * 0.3)} ${f(w * 0.25)} 0 ${f(w * 0.5)}" fill="none" stroke="#8c7350" stroke-width="2"/>`;
  if (relief === 'arms') s += `<path d="M${f(x - w * 0.45)} ${f(base - h * 0.75)} q${f(w * 0.1)} ${f(h * 0.35)} ${f(w * 0.45)} ${f(h * 0.4)} q${f(w * 0.35)} ${f(-h * 0.05)} ${f(w * 0.45)} ${f(-h * 0.4)}" fill="none" stroke="#8c7350" stroke-width="2.2"/>`;
  return s + '</g>';
}
function gobeklitepe() {
  const defs =
    lin('sky', [[0, '#5f86b8'], [0.45, '#e2b98a'], [0.66, '#f5cf8e'], [0.74, '#fbe3b0']]) +
    lin('plain', [[0, '#d8a666'], [1, '#b47a46']]) +
    lin('pit', [[0, '#a87a4f'], [1, '#c99b67']]);
  let b = `<rect width="400" height="800" fill="url(#sky)"/>`;
  b += `<circle cx="96" cy="500" r="34" fill="#fff1c9" opacity="0.95"/><circle cx="96" cy="500" r="70" fill="#fff1c9" opacity="0.25"/>`;
  b += cloud(300, 170, 1, '#fff7e8', 0.6) + cloud(130, 240, 0.7, '#fff7e8', 0.5);
  b += ridge(560, 12, 61, '#c79a72', { op: 0.8, w1: 0.008 });
  b += ridge(585, 14, 63, '#d4a46b');
  b += `<path d="M0 600 C100 590 300 594 400 600 L400 800 L0 800Z" fill="url(#plain)"/>`;
  // kazı çukuru ve çevre duvarı
  b += `<ellipse cx="200" cy="650" rx="196" ry="78" fill="url(#pit)"/><ellipse cx="200" cy="650" rx="196" ry="78" fill="none" stroke="#e1c08e" stroke-width="6"/>`;
  const r = rng(33);
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2;
    b += `<rect x="${f(200 + Math.cos(a) * 184 - 7)}" y="${f(650 + Math.sin(a) * 70 - 4)}" width="${f(12 + r() * 6)}" height="${f(7 + r() * 4)}" rx="2" fill="#c8a272" opacity="0.9"/>`;
  }
  // arka sıra dikilitaşlar
  for (const [x, y, h, w] of [[50, 616, 84, 15], [104, 604, 96, 16], [296, 604, 96, 16], [350, 616, 84, 15]]) b += tPillar(x, y, h, w);
  // merkezdeki iki büyük dikilitaş
  b += tPillar(156, 664, 190, 26, 'arms') + tPillar(246, 664, 190, 26, 'fox');
  // ön sıra
  for (const [x, y, h, w, rel] of [[40, 712, 110, 19, 'snake'], [360, 712, 110, 19, null]]) b += tPillar(x, y, h, w, rel);
  for (let i = 0; i < 16; i++) b += grass(14 + i * 26, 780 - (i % 2) * 14, 1.1, '#9a7a3f');
  return svg(defs, b);
}

// ---------- Ana ekran: Kız Kulesi ----------
function kizkulesi() {
  const defs =
    lin('sky', [[0, '#363d8f'], [0.4, '#9a5f9a'], [0.6, '#ee8a6c'], [0.7, '#ffc68a']]) +
    lin('sea', [[0, '#f2a27f'], [0.35, '#9a6e9e'], [1, '#2b2f6e']]) +
    rad('sun', [[0, '#fff1c8'], [0.4, '#ffd08f', 0.7], [1, '#ffb27a', 0]]);
  let b = `<rect width="400" height="800" fill="url(#sky)"/>` + stars(24, 17, 200);
  b += `<circle cx="120" cy="545" r="130" fill="url(#sun)"/><circle cx="120" cy="545" r="36" fill="#fff0c6"/>`;
  b += cloud(300, 220, 1.2, '#ffd9c4', 0.45) + cloud(90, 300, 0.9, '#ffd2c0', 0.4);
  // uzak siluet: kubbeler ve minareler
  let sk = 'M0 560 L0 540 L20 540 Q34 520 48 540 L60 540 L60 506 L62 498 L64 506 L64 540 L96 540 Q116 512 136 540 L150 540 L150 510 L152 502 L154 510 L154 540 L200 540 L232 540 Q250 520 268 540 L300 540 L300 512 L302 504 L304 512 L304 540 L330 540 Q350 516 370 540 L400 540 L400 560Z';
  b += `<path d="${sk}" fill="#5a3f72" opacity="0.75"/>`;
  b += `<rect x="0" y="556" width="400" height="244" fill="url(#sea)"/>`;
  const r = rng(8);
  for (let i = 0; i < 18; i++) b += `<rect x="${f(70 + r() * 100)}" y="${f(566 + i * 10)}" width="${f(18 + r() * 40)}" height="2.4" rx="1.2" fill="#ffe2b0" opacity="${f(0.25 + r() * 0.4)}"/>`;
  // kule adası
  const x = 330, y = 712;
  b += `<ellipse cx="${x}" cy="${y + 12}" rx="80" ry="14" fill="#3b2f4f" opacity="0.5"/>`;
  b += `<path d="M${x - 72} ${y + 8} C${x - 60} ${y - 6} ${x + 60} ${y - 6} ${x + 74} ${y + 8}Z" fill="#6d5a5a"/>`;
  b += `<rect x="${x - 60}" y="${y - 40}" width="120" height="44" fill="#f2e7da"/><rect x="${x + 30}" y="${y - 40}" width="30" height="44" fill="#d9c8b6"/>`;
  for (let i = 0; i < 7; i++) b += `<rect x="${x - 52 + i * 16}" y="${y - 30}" width="7" height="12" rx="3" fill="#7a5a5a"/>`;
  b += `<path d="M${x - 64} ${y - 40} L${x + 64} ${y - 40} L${x + 56} ${y - 50} L${x - 56} ${y - 50}Z" fill="#9aa3b8"/>`;
  // kule gövdesi
  b += `<rect x="${x - 16}" y="${y - 122}" width="32" height="84" fill="#f6ede2"/><rect x="${x + 4}" y="${y - 122}" width="12" height="84" fill="#dccbb8"/>`;
  b += `<rect x="${x - 22}" y="${y - 128}" width="44" height="8" fill="#e3d4c2"/>`;
  for (let i = 0; i < 3; i++) b += `<rect x="${x - 10 + i * 8}" y="${y - 112}" width="4" height="12" rx="2" fill="#7a5a5a"/>`;
  b += `<rect x="${x - 12}" y="${y - 150}" width="24" height="24" fill="#f6ede2"/><rect x="${x - 9}" y="${y - 145}" width="18" height="12" fill="#ffd27a" opacity="0.9"/>`;
  b += `<path d="M${x - 16} ${y - 150} L${x} ${y - 190} L${x + 16} ${y - 150}Z" fill="#7d8aa3"/><path d="M${x} ${y - 190} L${x + 16} ${y - 150} L${x} ${y - 150}Z" fill="#62708c"/>`;
  b += `<line x1="${x}" y1="${y - 190}" x2="${x}" y2="${y - 212}" stroke="#4a4a5a" stroke-width="1.6"/><path d="M${x} ${y - 212} L${x + 16} ${y - 207} L${x} ${y - 202}Z" fill="#d6303a"/>`;
  // tekne
  b += `<g><path d="M60 640 L124 640 L114 652 L70 652Z" fill="#3a2f45"/><rect x="86" y="624" width="16" height="16" fill="#f2e7da"/><line x1="94" y1="624" x2="94" y2="608" stroke="#3a2f45" stroke-width="1.5"/></g>`;
  b += gull(70, 380, 1.3, '#3a2f55') + gull(104, 360, 1, '#3a2f55') + gull(330, 420, 1.1, '#3a2f55');
  return svg(defs, b);
}

const SCENES = { kapadokya, efes, ayasofya, pamukkale, nemrut, galata, sumela, gobeklitepe, kizkulesi };
for (const [name, fn] of Object.entries(SCENES)) {
  const s = fn();
  writeFileSync(join(OUT, `${name}.svg`), s);
  console.log(`${name}.svg  ${(s.length / 1024).toFixed(1)} KB`);
}
