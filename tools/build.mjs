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

// Tek dosyalık sürümde (ve Android uygulamasında) yazı tipleri dosyanın içine gömülür:
// internet olmasa da oyun aynı görünür. Dosyalar src/fonts/ içindedir (SIL Open Font License 1.1).
const LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const LATIN_EXT = 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';
const face = (family, file, weight, range) => {
  const b64 = readFileSync(join(ROOT, 'src', 'fonts', file)).toString('base64');
  return `@font-face{font-family:"${family}";font-style:normal;font-display:swap;font-weight:${weight};src:url(data:font/woff2;base64,${b64}) format("woff2");unicode-range:${range}}`;
};
const fontCss = [
  face('Baloo 2', 'baloo-2-latin-ext-wght-normal.woff2', '400 800', LATIN_EXT),
  face('Baloo 2', 'baloo-2-latin-wght-normal.woff2', '400 800', LATIN),
  face('Nunito', 'nunito-latin-ext-wght-normal.woff2', '200 1000', LATIN_EXT),
  face('Nunito', 'nunito-latin-wght-normal.woff2', '200 1000', LATIN),
].join('\n');
const favicon = 'data:image/svg+xml;base64,' + readFileSync(join(ROOT, 'src', 'icon.svg')).toString('base64');
const script = `<script>\n${scenesJs}\n${levels}\n${game}\n</script>`;

const standalone = `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#121838">
<meta name="description" content="Kelime Avı: Anadolu Yolculuğu. Türkiye'nin tarihî yerlerinde geçen, harfleri birleştirerek kelime bulduğun bulmaca oyunu.">
<title>Kelime Avı: Anadolu Yolculuğu</title>
<link rel="icon" href="${favicon}">
<style>
${fontCss}
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
