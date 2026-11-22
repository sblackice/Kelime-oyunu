# Kelime Avı: Anadolu Yolculuğu – Derleme Yönergeleri

Bu belge, kaynak projeden oyunu ve Android uygulamasını nasıl üreteceğini adım adım anlatır.

## 0. Bu ZIP'te ne var, ne yok?

| Var | Yok (bilerek konmadı) |
|---|---|
| `src/` oyun kodu (HTML/CSS/JavaScript), bölüm verisi, çizimler, yazı tipleri, simge | `dist/`: derleme çıktıları (komutla yeniden üretilir) |
| `tools/` bölüm, çizim, derleme, test ve mağaza görseli araçları | İmza anahtarları (`*.keystore`, `*.jks`) ve parolaları |
| `android/` Android/Gradle projesi (WebView kabuğu, AdMob reklam köprüsü) | `.env` dosyaları, `local.properties`, önbellekler (`.gradle/`, `build/`, `node_modules/`) |
| `docs/` tasarım notları, Play Store rehberi, mağaza metinleri, gizlilik taslağı | `tools/sozluk/`: indirilen sözlük dosyaları (yalnızca yeni bölüm üretirken gerekir, bkz. README) |
| `store/` mağaza görselleri | Git geçmişi |
| `.github/workflows/android.yml` otomatik derleme akışı | |

## 1. Gerekenler

| Araç | Ne için? | Sürüm |
|---|---|---|
| [Node.js](https://nodejs.org) | Oyunu derlemek | 18 veya üstü (GitHub'da 20 ile derleniyor) |
| Java (JDK) | Android uygulamasını derlemek | 17 (örnek: [Temurin 17](https://adoptium.net)) |
| Android SDK | Android uygulamasını derlemek | Platform 36 (Android 16). En kolayı [Android Studio](https://developer.android.com/studio) kurmak |
| Playwright + Chromium | Yalnızca otomatik testler ve mağaza görselleri | `npm i -D playwright` ve `npx playwright install chromium` |

Gradle'ı ayrıca kurman gerekmez: `android/gradlew` ilk çalışmada doğru sürümü (8.14.3) kendisi indirir.

## 2. Oyunu derle (tarayıcı sürümü)

Proje klasöründe bir terminal aç ve sırayla:

```bash
node tools/generate-levels.mjs --quiet   # bölümleri doğrula → src/levels.js
node tools/build-scenes.mjs              # çizimleri üret → src/scenes/*.svg
node tools/build.mjs                     # tek dosyalık oyun → dist/kelime-avi.html
```

`dist/kelime-avi.html` dosyasını tarayıcıda açınca oyun çalışır. Reklam yerlerini görmek için adresin sonuna `?reklam=demo` ekle.

## 3. Android uygulamasını derle

```bash
mkdir -p android/app/src/main/assets
cp dist/kelime-avi.html android/app/src/main/assets/index.html
cd android
./gradlew assembleRelease      # APK  → app/build/outputs/apk/release/app-release.apk
./gradlew bundleRelease        # AAB  → app/build/outputs/bundle/release/app-release.aab (Google Play bunu ister)
```

Windows'ta `./gradlew` yerine `gradlew.bat` yaz. Android Studio ile: **File → Open** ile `android/` klasörünü aç, sonra **Build → Build App Bundle(s) / APK(s)**. Assets kopyalama adımını yine önceden yapman gerekir.

Android SDK'nın yeri bulunamazsa `android/local.properties` dosyası oluştur ve içine `sdk.dir=/SDK/klasörünün/yolu` yaz. Android Studio bunu kendisi yapar.

### İmza: hangi anahtarla imzalanır?

`android/app/build.gradle` sırayla şunlara bakar:

1. **Yayın anahtarı:** `android/imza.properties` varsa onu kullanır. Örneği: `android/imza.properties.example`. Bu dosya `.gitignore` ile korunur.
2. **Test anahtarı:** Yalnızca GitHub deposunda bulunur, bu ZIP'te yoktur.
3. **Hiçbiri yoksa:** Android'in bilgisayarında kendiliğinden oluşturduğu hata ayıklama anahtarı kullanılır. Bu APK yalnızca deneme içindir.

**Uyarı:** Telefonda kurulu olan sürüm başka bir anahtarla imzalandıysa yenisi "üzerine" kurulamaz. Önce eskisini silmek gerekir; bu da telefondaki ilerlemeyi siler.

**Google Play için yayın anahtarı oluşturma (bir kez):**

```bash
keytool -genkeypair -v -keystore kelime-avi-yayin.jks -alias kelimeavi -keyalg RSA -keysize 4096 -validity 10000
```

Bu komut parola, ad ve şehir sorar. Oluşan `.jks` dosyasını ve parolaları **proje klasörünün dışında**, güvenli bir yerde sakla ve yedekle. Kaybolursa uygulamayı bir daha güncelleyemezsin. Kimseyle (Claude dâhil) paylaşma; `imza.properties` dosyasını kendi bilgisayarında doldur.

### Reklam kimlikleri

`android/ads.properties` içinde şu an Google'ın **deneme** kimlikleri var (para kazandırmaz). Kendi AdMob kimliklerini buraya yaz. Ayrıntı: `docs/PLAY-STORE-REHBERI.md`.

## 4. Testler (isteğe bağlı)

```bash
node tools/test-e2e.mjs        # 240 bölümü tarayıcıda baştan sona oynar (~8 dakika)
node tools/build-store.mjs     # mağaza görsellerini yeniden üretir → store/
```

GitHub'a gönderilen her değişiklikte `.github/workflows/android.yml` APK'yı derler, Android emülatöründe dener (`android/ci/emulator-test.sh`) ve sürümler sayfasına ekler. Bu akış GitHub deposundaki test anahtarını kullanır. Bu ZIP'ten yeni bir depo açarsan anahtar olmayacağı için her derleme farklı bir hata ayıklama anahtarıyla imzalanır.

## 5. Sık yapılan değişiklikler

| Ne değişecek? | Hangi dosya? |
|---|---|
| Bölümler, kelimeler | `tools/level-source.mjs` (sonra adım 2) |
| Duraklar, seviyeler, zorluk planı | `tools/kelime-ayar.mjs` |
| Elmas, ipucu bedeli, reklam sıklığı, günlük ödül | `src/game.js` dosyasının en başındaki sabitler |
| Renkler, yerleşim | `src/style.css` |
| Ekranlar, düğmeler, simgeler | `src/app.html` |
| Durak çizimleri | `tools/build-scenes.mjs` |
| Uygulama adı | `android/app/src/main/res/values/strings.xml`, `tools/build.mjs`, `src/app.html` |
| Uygulama simgesi | `src/icon.svg` ve `android/app/src/main/res/drawable/ic_launcher_*.xml` |
| Sürüm numarası | `package.json`, `src/game.js` (`VERSION`), `android/app/build.gradle` (`versionName`) |

Yeni bölüm üretme (sözlükten) yönergesi `README.md` dosyasında.

## 6. Bilinen eksikler

- Gerçek telefonlarda elle denenmedi; yalnızca tarayıcıda ve Android emülatöründe otomatik denendi.
- Uygulama içi satın alma (Google Play Billing) ve sunucu yok. Elmaslar yalnızca telefonda (localStorage) tutulur; gerçek parayla satış eklenecekse sunucu tarafı doğrulama gerekir.
- Reklam kütüphanesi `play-services-ads 24.4.0` sürümüne sabitlendi; yayından önce güncel sürüm kontrol edilmeli.
