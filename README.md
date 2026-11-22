# Kelime Avı: Anadolu Yolculuğu

Türkiye'nin tarihî yerlerinde geçen, harfleri birleştirerek kelime bulduğun bir bulmaca oyunu.
Oyun mantığı **Words of Wonders (WOW) – Kelime Oyunu** uygulamasıyla aynıdır. Ad, logo, renkler, çizimler, sesler, kelimeler ve bölümler bu projeye özgüdür.

- **Sürüm:** 0.3
- **Bölüm sayısı:** 240 bölüm, 12 durak (her durakta 20 bölüm), 4 seviye
- **Seviyeler:** Çırak (3–4 harf) · Kalfa (5 harf) · Usta (6 harf) · Üstat (7 harf)
- **Duraklar:** Kapadokya · Efes Antik Kenti · Ayasofya · Pamukkale · Nemrut Dağı · Galata Kulesi · Sümela Manastırı · Göbeklitepe · Truva · Bodrum Kalesi · Safranbolu Evleri · İshak Paşa Sarayı
- **Ana ekran:** Kız Kulesi
- **Reklam ve Google Play:** [`docs/PLAY-STORE-REHBERI.md`](docs/PLAY-STORE-REHBERI.md) · mağaza metinleri: [`docs/MAGAZA-METINLERI.md`](docs/MAGAZA-METINLERI.md) · mağaza görselleri: `store/`

## İndir (Android)

**[kelime-avi.apk dosyasını indir](https://github.com/sblackice/Kelime-oyunu/releases/latest/download/kelime-avi.apk)** · [Tüm sürümler](https://github.com/sblackice/Kelime-oyunu/releases)

APK her güncellemede GitHub Actions tarafından otomatik derlenir ve bir Android emülatöründe açılıp denenir (`.github/workflows/android.yml`, `android/ci/emulator-test.sh`). Bu bir test sürümüdür: test imza anahtarıyla imzalanmıştır ve Google'ın **deneme** reklamlarını gösterir. Google Play için ayrı, gizli bir anahtar ve kendi AdMob kimliklerin gerekir.

## Nasıl oynanır?

1. `dist/kelime-avi.html` dosyasını telefonun veya bilgisayarın tarayıcısında aç. Tek bir dosyadır, kurulum gerekmez.
2. Yeşil **BÖLÜM** düğmesine bas.
3. Alttaki çemberde parmağını harflerin üzerinde gezdir ve bırak. Kelime doğruysa harfler yukarıdaki bulmacaya uçar.
4. Bulmacadaki bütün kelimeleri bulunca bölüm biter.
5. Takılırsan ampul düğmesine bas. **İpucu** boş bir kutuya bir harf açar ve 100 elmas tutar.
6. Ortadaki çapraz ok düğmesi harflerin yerini **karıştırır** (ücretsiz).
7. Bulmacada yeri olmayan ama doğru olan bir kelime bulursan **bonus kelime** sayılır: +5 elmas.
8. 8 bölümde bir **hediye kutusu** (+100 elmas) açılır. Her durağın 20 bölümü bitince o yerin **kartı**, her seviyenin 3 durağı bitince **seviye ödülü** (+250 elmas) kazanılır.
9. Her gün ilk girişte **günlük ödül** verilir (20–150 elmas; üst üste girdikçe büyür).
10. Ana ekrandaki seviye kutusuna dokununca **Seviyeler** penceresi açılır: hangi durakta olduğunu ve kalanları gösterir.

Bilgisayarda klavyeyle de oynanabilir: harfleri yaz, **Enter** ile gönder, **Backspace** ile son harfi sil.

İlerleme tarayıcıda otomatik kaydedilir. Oyun Claude'da yayınlanmış sayfa olarak açılırsa ve bu özellik destekleniyorsa ilerleme Claude hesabına da kaydedilir.

## Klasörler

| Yol | Ne var? |
|---|---|
| `dist/kelime-avi.html` | Oynanabilir oyun (tek dosya) |
| `dist/kelime-avi-artifact.html` | Claude'da yayınlanan sürüm |
| `src/` | Oyunun kaynak dosyaları: `app.html` (ekranlar), `style.css` (görünüm), `game.js` (oyun mantığı), `levels.js` (üretilmiş bölümler), `scenes/` (arka plan çizimleri), `fonts/` (yazı tipleri, SIL OFL 1.1) |
| `tools/level-source.mjs` | **Bölümlerin listesi** (harfler, kelimeler, bonus kelimeler) |
| `tools/kelime-ayar.mjs` | Duraklar, seviyeler, zorluk planı ve istenmeyen kelime listeleri |
| `tools/suggest-levels.mjs` | Sözlükten bölüm önerir ve `level-source.mjs` dosyasını yazar (elle çalıştırılır) |
| `tools/generate-levels.mjs` | Bölümleri doğrular, bulmaca yerleşimini otomatik hesaplar |
| `android/` | Android uygulama kabuğu; `ads.properties` reklam kimlikleri |
| `src/icon.svg` | Uygulama simgesinin kaynağı |
| `tools/build-store.mjs`, `store/` | Mağaza görsellerini üretir (simge, öne çıkan görsel, ekran görüntüleri) |
| `tools/build-scenes.mjs` | Tarihî yer çizimlerini (SVG) üretir |
| `tools/build.mjs` | Her şeyi `dist/` içindeki tek dosyada birleştirir |
| `tools/test-e2e.mjs` | 240 bölümü tarayıcıda baştan sona oynayan otomatik test (yaklaşık 8 dakika) |
| `docs/WOW-analiz-raporu.md` | Words of Wonders analiz raporu |
| `docs/TASARIM-NOTLARI.md` | Nelerin WOW ile aynı, nelerin farklı olduğu ve bölüm listesi |

## Kaynak projeyi ZIP olarak almak

`bash tools/kaynak-zip.sh` komutu düzenlenebilir kaynak projeyi `dist-kaynak/` klasörüne ZIP olarak paketler. İmza anahtarları, parolalar, `.env` dosyaları, derleme çıktıları ve önbellekler ZIP'e girmez; araç bunu paketledikten sonra ayrıca denetler. Derleme adımları: [`DERLEME.md`](DERLEME.md).

## Geliştirici komutları

Gerekli: [Node.js](https://nodejs.org) 18 veya üstü.

```bash
node tools/generate-levels.mjs   # bölümleri doğrula ve src/levels.js dosyasını üret
node tools/build-scenes.mjs      # çizimleri src/scenes/ klasörüne üret
node tools/build.mjs             # dist/ içindeki oyun dosyalarını üret
node tools/test-e2e.mjs          # otomatik test (Playwright ve Chromium gerekir)
```

Test için bir kez kurulum: `npm i -D playwright` ve ardından `npx playwright install chromium`.

### Yeni bölüm eklemek

Bölümler sözlükten üretilir, sonra gözle kontrol edilir:

1. Sözlük dosyalarını `tools/sozluk/` klasörüne indir (depoya eklenmez):
   - `master-dictionary.dict` → [Zemberek-NLP](https://github.com/ahmetaa/zemberek-nlp) (Apache-2.0): kelimenin Türkçe olup olmadığı
   - `tr_50k.txt` → [FrequencyWords](https://github.com/hermitdave/FrequencyWords) (içerik CC-BY-SA-4.0): kelimenin ne kadar yaygın olduğu (yalnızca sıralama için)
2. `tools/kelime-ayar.mjs` içinde durağı (`LOCATIONS`), seviyeyi (`TIERS`) ve harf sayısı planını (`LENGTH_PLAN`) güncelle.
3. `node tools/suggest-levels.mjs --dry` ile öneriyi oku. Beğenmediğin kelimeyi `GRID_AVOID` (bulmacada gösterme) ya da `BAN` (hiç kabul etme) listesine ekle ve tekrar çalıştır.
4. `node tools/suggest-levels.mjs` ile `level-source.mjs` dosyasını yaz; sonra `generate-levels`, `build-scenes`, `build` ve `test-e2e`.
5. Yeni durak için `tools/build-scenes.mjs` içine bir çizim fonksiyonu ekle (adı durağın `id` değeriyle aynı olmalı).

## Lisans

Henüz bir lisans seçilmedi.
