// Kelime Avı – derleme aracı.
// Kullanım:  node tools/build.mjs
// Çıktılar:
//   dist/kelime-avi.html           → tek başına çalışan oyun (telefonda/bilgisayarda doğrudan açılır)
//   dist/kelime-avi-artifact.html  → Claude Artifact olarak yayınlanan sürüm (doctype/html/head/body etiketleri olmadan)

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = (p) => readFileSync(join(ROOT, 'src', p), 'utf8');

const css = src('style.css');
const body = src('app.html');
const levels = src('levels.js');
const game = src('game.js');

const sceneDir = join(ROOT, 'src', 'scenes');
const scenes = {};
for (const f of readdirSync(sceneDir).filter((x) => x.endsWith('.svg')).sort()) {
  const svg = readFileSync(join(sceneDir, f));
  scenes[f.replace(/\.svg$/, '')] = 'data:image/svg+xml;base64,' + svg.toString('base64');
}
const scenesJs = `window.SCENES = ${JSON.stringify(scenes)};`;

const FONTS = 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@700;800;900&display=swap';
const favicon =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="4" y="4" width="56" height="56" rx="14" fill="#1f4fa3"/><rect x="12" y="12" width="40" height="40" rx="9" fill="#fff8ec"/><text x="32" y="45" text-anchor="middle" font-family="Arial Black,Arial" font-weight="900" font-size="32" fill="#1f4fa3">K</text></svg>'
  );
const script = `<script>\n${scenesJs}\n${levels}\n${game}\n</script>`;

const standalone = `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#121838">
<meta name="description" content="Kelime Avı: Türkiye'nin tarihî yerlerinde geçen, harfleri birleştirerek kelime bulduğun bulmaca oyunu.">
<title>Kelime Avı</title>
<link rel="icon" href="${favicon}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<style>
${css}
</style>
</head>
<body>
${body}
${script}
</body>
</html>
`;

const artifact = `<title>Kelime Avı</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="${FONTS}">
<style>
${css}
</style>
${body}
${script}
`;

mkdirSync(join(ROOT, 'dist'), { recursive: true });
writeFileSync(join(ROOT, 'dist', 'kelime-avi.html'), standalone);
writeFileSync(join(ROOT, 'dist', 'kelime-avi-artifact.html'), artifact);
console.log(`dist/kelime-avi.html           ${(standalone.length / 1024).toFixed(0)} KB`);
console.log(`dist/kelime-avi-artifact.html  ${(artifact.length / 1024).toFixed(0)} KB`);
