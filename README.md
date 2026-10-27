# Kelime Avı

Türkiye'nin tarihî yerlerinde geçen, harfleri birleştirerek kelime bulduğun bir bulmaca oyunu.
Oyun mantığı **Words of Wonders (WOW) – Kelime Oyunu** uygulamasıyla aynıdır. Ad, logo, renkler, çizimler, sesler, kelimeler ve bölümler bu projeye özgüdür.

- **Sürüm:** 0.1 (ilk oynanabilir sürüm)
- **Bölüm sayısı:** 32 bölüm, 8 durak (her durakta 4 bölüm)
- **Duraklar:** Kapadokya · Efes Antik Kenti · Ayasofya · Pamukkale · Nemrut Dağı · Galata Kulesi · Sümela Manastırı · Göbeklitepe
- **Ana ekran:** Kız Kulesi

## İndir (Android)

**[kelime-avi.apk dosyasını indir](https://github.com/sblackice/Kelime-oyunu/releases/latest/download/kelime-avi.apk)** · [Tüm sürümler](https://github.com/sblackice/Kelime-oyunu/releases)

APK her güncellemede GitHub Actions tarafından otomatik derlenir (`.github/workflows/android.yml`). Bu bir test sürümüdür ve test imza anahtarıyla imzalanmıştır; Google Play için ayrı, gizli bir anahtar gerekir.

## Nasıl oynanır?

1. `dist/kelime-avi.html` dosyasını telefonun veya bilgisayarın tarayıcısında aç. Tek bir dosyadır, kurulum gerekmez.
2. Yeşil **BÖLÜM** düğmesine bas.
3. Alttaki çemberde parmağını harflerin üzerinde gezdir ve bırak. Kelime doğruysa harfler yukarıdaki bulmacaya uçar.
4. Bulmacadaki bütün kelimeleri bulunca bölüm biter.
5. Takılırsan ampul düğmesine bas. **İpucu** boş bir kutuya bir harf açar ve 100 elmas tutar.
6. Ortadaki çapraz ok düğmesi harflerin yerini **karıştırır** (ücretsiz).
7. 8 bölümde bir **hediye kutusu** (+100 elmas) açılır. Her durağın 4 bölümü bitince o yerin **kartı** kazanılır. Kartlar sol alttaki "Kartlarım" düğmesinde durur.

Bilgisayarda klavyeyle de oynanabilir: harfleri yaz, **Enter** ile gönder, **Backspace** ile son harfi sil.

İlerleme tarayıcıda otomatik kaydedilir. Oyun Claude'da yayınlanmış sayfa olarak açılırsa ve bu özellik destekleniyorsa ilerleme Claude hesabına da kaydedilir.

## Klasörler

| Yol | Ne var? |
|---|---|
| `dist/kelime-avi.html` | Oynanabilir oyun (tek dosya) |
| `dist/kelime-avi-artifact.html` | Claude'da yayınlanan sürüm |
| `src/` | Oyunun kaynak dosyaları: `app.html` (ekranlar), `style.css` (görünüm), `game.js` (oyun mantığı), `levels.js` (üretilmiş bölümler), `scenes/` (arka plan çizimleri) |
| `tools/level-source.mjs` | **Bölümler burada yazılır** (harfler ve kelimeler) |
| `tools/generate-levels.mjs` | Bölümleri doğrular, bulmaca yerleşimini otomatik hesaplar |
| `tools/build-scenes.mjs` | Tarihî yer çizimlerini (SVG) üretir |
| `tools/build.mjs` | Her şeyi `dist/` içindeki tek dosyada birleştirir |
| `tools/test-e2e.mjs` | 32 bölümü tarayıcıda baştan sona oynayan otomatik test |
| `docs/WOW-analiz-raporu.md` | Words of Wonders analiz raporu |
| `docs/TASARIM-NOTLARI.md` | Nelerin WOW ile aynı, nelerin farklı olduğu ve bölüm listesi |

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

1. `tools/level-source.mjs` dosyasında `LOCATIONS` listesine yeni durağı, `LEVEL_SOURCE` listesine de 4 bölümü ekle. İlk kelime, tüm harfleri kullanan kelime olmalı.
2. Yeni durak için `tools/build-scenes.mjs` içine bir çizim fonksiyonu ekle (dosya adı durağın `id` değeriyle aynı olmalı).
3. Sırasıyla `generate-levels`, `build-scenes`, `build` ve `test-e2e` komutlarını çalıştır.

Araç; kelimelerin harflerle kurulabildiğini, tekrar olmadığını ve en az bir kelimenin tüm harfleri kullandığını kontrol eder. Kurallara uymayan bölümde hata verir.

## Lisans

Henüz bir lisans seçilmedi.
