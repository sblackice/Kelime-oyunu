#!/usr/bin/env bash
# Kelime Avı – düzenlenebilir kaynak projeyi ZIP olarak paketler.
# Kullanım:  bash tools/kaynak-zip.sh [çıktı.zip]
# Varsayılan çıktı: dist-kaynak/kelime-avi-kaynak-<sürüm>.zip
#
# Dahil: Android/Gradle projesi, oyun kodu (HTML/CSS/JS), bölüm verileri, çizimler, yazı tipleri,
#        araçlar, belgeler, mağaza görselleri, GitHub Actions akışı, derleme yönergeleri.
# Hariç: derleme çıktıları (dist/, build/), önbellekler (.gradle/, node_modules/), git geçmişi,
#        imza anahtarları ve parolaları (*.keystore, *.jks, imza.properties, test-imza.properties),
#        .env dosyaları, indirilen sözlük dosyaları (tools/sozluk/), test çıktıları.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
VER="$(node -p "require('./package.json').version")"
OUT="${1:-dist-kaynak/kelime-avi-kaynak-$VER.zip}"
mkdir -p "$(dirname "$OUT")"
OUT="$(cd "$(dirname "$OUT")" && pwd)/$(basename "$OUT")"
rm -f "$OUT"

# Yalnızca git'in izlediği dosyalar (yerel önbellek ve çıktılar kendiliğinden dışarıda kalır)
git ls-files -z \
  | grep -zvE '^(dist/|dist-kaynak/|test-output/|tools/sozluk/)' \
  | grep -zvE '(\.keystore|\.jks|\.p12|\.pem|\.key)$' \
  | grep -zvE '(^|/)(imza\.properties|test-imza\.properties|local\.properties|\.env(\..*)?)$' \
  | xargs -0 zip -q -X "$OUT"

# Güvenlik denetimi: yasaklı dosya ya da açık parola ZIP'e girmiş mi?
BAD="$(unzip -Z1 "$OUT" | grep -E '(\.keystore|\.jks|\.p12|\.pem|\.key|imza\.properties|local\.properties|\.env)$' || true)"
if [ -n "$BAD" ]; then echo "HATA: ZIP'e girmemesi gereken dosya var:"; echo "$BAD"; rm -f "$OUT"; exit 1; fi
if unzip -p "$OUT" '*.gradle' | grep -aqiE "^[[:space:]]*(store|key)Password[[:space:]]*(=[[:space:]]*)?['\"]"; then
  echo "HATA: Android dosyalarında açık yazılmış parola bulundu."; rm -f "$OUT"; exit 1
fi
echo "$OUT"
echo "$(unzip -Z1 "$OUT" | wc -l) dosya, $(du -h "$OUT" | cut -f1)"
