# Kelime Avı – Reklam ve Google Play Rehberi

Bu belge, oyunu Google Play'e koyup reklam geliri almak için **senin** yapman gerekenleri sırasıyla anlatır.
Kodun içindeki reklam altyapısı hazırdır; eksik olan şeyler yalnızca senin hesabınla yapılabilecek adımlardır.

> **Dürüst not:** Bu adımların bir kısmı Google'ın o günkü ekranlarına bağlıdır ve zamanla değişir.
> Aşağıdaki kurallar bu belge yazılırken (Kasım 2026) kaynaklardan doğrulanabildiği kadarıyla yazıldı.
> Google'ın resmî geliştirici sayfalarına (developers.google.com) bu çalışma ortamından erişilemedi;
> o yüzden her adımda Google'ın kendi ekranındaki güncel yazı esas alınmalıdır.

## 1. Oyunda reklamlar nerede duruyor?

| Reklam türü | Nerede? | Ne zaman? |
|---|---|---|
| **Alt şerit (banner)** | Ekranın en altında, oyunun **dışında** ayrı bir şerit. Harf çemberi ile arasında boşluk var | 4. bölümden itibaren her ekranda. İlk 3 bölümde reklam yok |
| **Tam ekran (geçiş/interstitial)** | "TEBRİKLER" ekranında sonraki bölüme geçerken | En erken 6. bölümden sonra, en sık 3 bölümde bir ve iki reklam arasında en az 2 dakika |
| **Ödüllü video (rewarded)** | Elmas penceresinde "REKLAM İZLE" düğmesi (elmas sayacındaki + işareti ya da elmas bitince) | Yalnızca oyuncu isterse. Karşılığı +100 elmas (1 ipucu) |

Bu sayılar `src/game.js` dosyasının en başındaki sabitlerdir (`AD_FREE_LEVELS`, `INTER_MIN_LEVEL`, `INTER_EVERY`, `INTER_MIN_GAP`, `REWARD_GEMS`). Değiştirmek için yalnızca o sayıları değiştirmek yeterlidir.

**Tarayıcıda önizleme:** `dist/kelime-avi.html?reklam=demo` adresiyle açarsan reklam yerleri gri kutularla görünür.

**Neden böyle yerleştirildi?** Reklam, dokunulan düğmelerin hemen yanında olursa yanlışlıkla tıklanır; Google bunu kural ihlali sayar. O yüzden şerit oyun alanının dışındadır ve tam ekran reklam yalnızca bölüm bittikten sonra, oyuncu "sonraki bölüm" dediğinde çıkar.

## 2. Şu an hangi reklamlar çıkıyor?

`android/ads.properties` dosyasında Google'ın herkese açık **deneme** kimlikleri yazılı. Bunlarla üzerinde "Test Ad" yazan sahte reklamlar çıkar. **Para kazandırmaz**, ama her şeyin çalıştığını güvenle denemeni sağlar.

Bu kimlikler hatırlanan değerlerdir; yalnızca geçiş ve ödüllü reklam kimlikleri arama sonuçlarıyla doğrulanabildi. Uygulama kimliği ve banner kimliği Google'ın resmî sayfasından **doğrulanamadı** (sayfaya erişilemedi). Kendi kimliklerini yazınca bu belirsizlik ortadan kalkar.

## 3. Gerçek reklam için adımlar

1. **AdMob hesabı aç:** <https://admob.google.com> → Google hesabınla gir → ülke, saat dilimi ve para birimini seç. (Ücretsizdir. Ödeme alabilmek için kimlik ve adres doğrulaması ister.)
2. **Uygulamayı ekle:** Uygulamalar → Uygulama ekle → Android → uygulama henüz mağazada değilse "Hayır" → ad: Kelime Avı.
   Sana `ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY` biçiminde bir **uygulama kimliği** verir (ortasında `~` vardır).
3. **3 reklam birimi oluştur:** Reklam birimleri → Reklam birimi ekle → sırayla **Banner**, **Geçiş reklamı**, **Ödüllü**.
   Her biri `ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ` biçiminde bir kimlik verir (ortasında `/` vardır).
4. **Kimlikleri dosyaya yaz:** `android/ads.properties` dosyasındaki 4 satırı kendi kimliklerinle değiştir. Bana "kimliklerim şunlar" dersen ben de yazarım. (Bu kimlikler gizli değildir; uygulamanın içinde zaten görünür.)
5. **İzin penceresi (Avrupa için):** AdMob → Gizlilik ve mesajlaşma → "Avrupa düzenlemeleri" mesajı oluştur ve yayınla. Uygulamadaki kod bu pencereyi kendiliğinden gösterir.
6. **app-ads.txt:** AdMob, bir web sitesine `app-ads.txt` adlı küçük bir dosya koymanı ister. Web siten yoksa ücretsiz bir GitHub Pages sayfası yeterlidir. Dosyanın içeriğini AdMob verir.

**Çok önemli:** Kendi reklamına asla kendin tıklama ve başkasına tıklatma. Google bunu fark eder ve hesabı kalıcı olarak kapatabilir. Deneme yaparken deneme kimliklerini kullan.

## 4. Google Play'e yükleme adımları

1. **Geliştirici hesabı:** <https://play.google.com/console> → bir kerelik kayıt ücreti vardır (bu belge yazılırken 25 ABD doları olarak biliniyordu; güncel tutarı Google'ın ekranında gör).
2. **Yeni kişisel hesaplarda kapalı test şartı:** Google, yeni kişisel hesaplardan, uygulamayı herkese açmadan önce belli sayıda test kullanıcısıyla belli bir süre kapalı test yapmasını istiyor. Sayı ve süre zamanla değişti; güncel şartı Play Console sana gösterir. **Bu yüzden yayın birkaç hafta sürebilir.**
3. **Gizli imza anahtarı:** Depodaki test anahtarı herkese açıktır; mağaza için **kullanılamaz**. Kendi bilgisayarında bir anahtar oluşturman ve saklaman gerekir. Bu anahtar kaybolursa uygulamayı güncelleyemezsin. Hazır olduğunda adım adım birlikte yaparız.
4. **AAB dosyası:** Google Play, APK yerine `.aab` (uygulama paketi) ister. Derleme sistemi bunu üretebilir (`./gradlew bundleRelease`); gizli anahtar hazır olunca ekleriz.
5. **Mağaza sayfası:** Uygulama adı, kısa ve uzun açıklama, simge (512×512), öne çıkan görsel (1024×500), en az 2 telefon ekran görüntüsü.
6. **Uygulama içeriği formları (zorunlu):**
   - **Gizlilik politikası adresi:** Reklam gösteren uygulamalarda zorunludur. Taslak: [`gizlilik-politikasi-taslak.md`](gizlilik-politikasi-taslak.md). İnternette herkesin açabileceği bir adreste durmalıdır.
   - **Reklamlar:** "Evet, reklam içeriyor".
   - **Veri güvenliği:** Reklam kütüphanesi cihaz kimliği (reklam kimliği) ve yaklaşık konum gibi veriler toplayabilir; formda bunlar işaretlenmelidir. Google, kendi kütüphanesinin topladıklarını ayrı bir sayfada listeler.
   - **Reklam kimliği:** "Evet, kullanıyor (reklam amacıyla)".
   - **Hedef kitle:** **13 yaş ve üzeri** seçmeni öneririm. 13 yaş altını seçersen "Aileler" kuralları devreye girer ve reklamlar için çok daha sıkı şartlar gelir.
   - **İçerik derecelendirmesi:** Anketi doldur (şiddet, kumar vb. yok).
7. **Hedef Android sürümü:** Google Play, 31 Ağustos 2026'dan beri yeni uygulamaların Android 16'yı (API 36) hedeflemesini istiyor. Uygulama buna göre ayarlandı (`targetSdk 36`).

## 5. Ad çakışması

"Kelime Avı" adını içeren başka oyunlar mağazada var. Aynı adla yayınlamak reddedilme ya da karışıklık riski taşır. Yayından önce ayırt edici bir ek düşün (örnek: "Kelime Avı: Anadolu Yolculuğu"). Ad değişirse uygulama kimliği (`com.kelimeavi.oyun`) de **yayından önce** kesinleşmelidir; yayından sonra değiştirilemez.

## 6. Yayından önce kontrol listesi

- [ ] Kelimeler bir kez de insan gözüyle gözden geçirildi (bölüm listesi: `tools/level-source.mjs`)
- [ ] Gerçek telefonlarda denendi (küçük ve büyük ekran)
- [ ] `android/ads.properties` içine kendi AdMob kimliklerin yazıldı
- [ ] Gizli imza anahtarı oluşturuldu ve güvenli bir yere yedeklendi
- [ ] Gizlilik politikası yayında ve adresi Play Console'a girildi
- [ ] AdMob'da izin mesajı (Avrupa) yayınlandı
- [ ] Veri güvenliği, reklam, hedef kitle ve içerik derecelendirme formları dolduruldu
