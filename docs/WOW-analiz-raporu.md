# Words of Wonders (WOW) – Kelime Oyunu: Analiz Raporu

- **Hazırlanma tarihi:** 25 Ekim 2026
- **Kapsam:** Kullanıcının gönderdiği 4 ekran görüntüsü ve 1 oynanış videosu ile web aramalarına dayanan analiz. Bu aşamada kod yazılmadı, proje oluşturulmadı.
- **En önemli sınır:** APK dosyası yok. Bu yüzden oyunun içi (kaynak kod, dosyalar, kullanılan kütüphaneler) **incelenmedi**. Aşağıdaki "iç işleyiş" açıklamalarının hepsi **gözleme dayalıdır** ve öyle işaretlenmiştir.

---

## Bu raporu nasıl okumalısınız? (Güven etiketleri)

Her önemli bulgunun yanında aşağıdaki etiketlerden biri var:

| Etiket | Anlamı |
|---|---|
| ✅ **Doğrulandı** | Ekran görüntüsünde veya videoda doğrudan gördüm ya da videodan ölçtüm. |
| 🟡 **Kısmen doğrulandı** | Yalnızca web arama aracının verdiği özette geçiyor. Sayfayı kendim açıp okuyamadım (ağ erişimi kapalıydı). |
| 🔷 **Güçlü çıkarım** | Birden fazla gözlem destekliyor ama doğrudan görmedim. |
| ❓ **Bilinmiyor** | Elimdeki verilerle tespit edilemiyor. |
| 🧪 **Test edilmeli** | Telefonda küçük bir deneme yapılarak öğrenilebilir (Bölüm 13'te nasıl yapılacağı yazıyor). |

Videodaki anlar **"video 0:05"** gibi saniye cinsinden belirtildi (videonun başından itibaren).

---

## 0. İncelenen materyaller ve çalışma yöntemi

### 0.1 Elimdeki materyaller

| # | Materyal | Ne gösteriyor |
|---|---|---|
| Görsel 1 | Google Play mağaza sayfası (telefon ekran görüntüsü) | Uygulama adı, geliştirici, puan, yaş sınırı, boyut, "Reklam içerir • Uygulama içi satın alma" |
| Görsel 2 | Yükleme ekranı | Sonbahar temalı göl manzarası, "YÜKLENİYOR..." çubuğu |
| Görsel 3 | Bölüm 1 (eğitim) | "KAŞ kelimesinin harflerini birleştir." yönergesi, K-A-Ş harf çemberi |
| Görsel 4 | Bölüm 1 sonrası "TEBRİKLER!" ekranı | "1 YOLCULUK", 1/8 hediye çubuğu, "GİZE PİRAMİTLERİ 1/4" |
| Video | `WhatsApp_Video_2026-10-25_at_17.28.18.mp4` – 40,8 sn, 480×1070 piksel, ~24 kare/sn, tek kanal ses | Açılış, ana ekran, Bölüm 2 ve 3'ün tamamı, Bölüm 4'ün başlangıcı |

### 0.2 Nasıl inceledim?

- Videodan saniyede 2 kare (toplam 82 kare) çıkarıp hepsine baktım.
- Kritik anlarda (kelime kabulü, hatalı kelime, ipucu, vurgulama animasyonu) saniyede 8–24 kareye çıkıp animasyon sürelerini ölçtüm.
- Ses kaydının seviyesini 100 milisaniyelik dilimlerle ölçtüm (hangi anda ses çıktığını görmek için).
- Ekrandaki ani değişimleri (sahne geçişleri) otomatik olarak tespit ettim.

### 0.3 Sınırlar (dürüstçe)

- **APK yok.** Kaynak kodu, dosya yapısı, izinler ve kütüphaneler incelenmedi.
- **Araçlar:** Bu ortamda `ffmpeg`, `ffprobe`, `python3` ve `java` var; **JADX, apktool, aapt ve adb yok.**
- **Ağ erişimi:** `play.google.com` (vekil sunucu 403 ile reddetti), `apps.apple.com`, `reports.exodus-privacy.eu.org` ve `fugo.com.tr` adreslerine erişilemedi. Web bilgileri **yalnızca arama özetlerinden** geliyor (🟡 etiketi).
- **Video sıkıştırılmış** (WhatsApp). Oyunun gerçek akıcılığı (FPS) ölçülemez.
- **Video bir ekran kaydı.** Oyunda müziğin açık olup olmadığı bilinmiyor.
- **Sadece yeni oyuncu deneyimi görüldü:** Görsel 1'de "Yükle" düğmesi var, yani oyun yeni kurulmuş. Bölüm 1–4 arası görüldü. İleri bölümlerde açılan özellikler (günlük bulmaca, mağaza vb.) görülmedi.

---

## 1. Yönetici özeti

1. İncelenen uygulama, Google Play'deki **"Words of Wonders: Kelime Oyunu" (Fugo Games)**. Android'de incelendi. ✅ Paket adının `com.fugo.wow` olması 🔷 güçlü çıkarım.
2. **Temel oyun:** Ekranın altındaki yuvarlak bir **harf çemberinde** harfler var. Oyuncu parmağını harflerin üzerinde gezdirerek kelime yazıyor. Doğru kelimeler yukarıdaki **mini bulmaca ızgarasına** yerleşiyor. Izgaradaki bütün kelimeler bulununca bölüm bitiyor. ✅
3. **Kelime kontrolü:** Videoda yalnızca ızgaradaki kelimeler kabul edildi. Harfleri doğru ama sırası yanlış olan "ŞKI" reddedildi. Reddedilince ceza yok, sadece kelime balonu titreyip kayboluyor. ✅
4. **İlerleme:** Her bölüm sonunda iki ilerleme çubuğu doluyor: **8 bölümde bir hediye kutusu** ve **4 bölümlük bir durak** ("Gize Piramitleri"). Durak tamamlanınca bir kart/resim kazanılıyor gibi görünüyor. ✅ çubuklar / 🔷 ödüller
5. **İpucu:** Bir ipucu **100 elmas**. Oyuna 200 elmasla başlanıyor. Bölüm 3'te eğitim amaçlı **2 ücretsiz ipucu** verildi. İpucu, boş bir hücrenin harfini açıyor. ✅
6. **Zorluk:** İlk 3 bölüm 3 harfli ve 2 kelimeli. Bölüm 4 ise 4 harfli ve 3 kelimeli. Görülen bölümlerin hepsinde en az bir kelime çemberdeki tüm harfleri kullanıyor. ✅
7. **Reklam / satın alma:** Mağazada "Reklam içerir" ve "Uygulama içi satın alma" yazıyor. ✅ İlk 4 bölümde hiç reklam **görülmedi**. Reklamların nerede çıktığı ❓ bilinmiyor.
8. **Teknik iç yapı** (oyun motoru, kütüphaneler, kayıt yöntemi, çevrim dışı çalışma) bu materyallerle **tespit edilemiyor** ❓. Gereken dosyalar ve testler Bölüm 13'te.

---

## 2. Uygulama kimliği ve sürüm bilgileri

| Alan | Değer | Kaynak | Etiket |
|---|---|---|---|
| Mağazadaki Türkçe adı | Words of Wonders: Kelime Oyunu | Görsel 1 | ✅ |
| Geliştirici | Fugo Games | Görsel 1 | ✅ |
| Resmî şirket unvanı | FUGO Bilişim Teknolojileri ve Yazılım Ticaret A.Ş. (İstanbul) | App Store listesine dair arama özeti | 🟡 |
| İncelenen platform | Android (Google Play arayüzü görülüyor) | Görsel 1 | ✅ |
| PC desteği | "Google Play Games ile PC'de oynayın" | Görsel 1 | ✅ |
| iOS sürümü | Var (App Store kimliği `id1369521645`, İngilizce adı "Words of Wonders: Crossword") | Arama özeti | 🟡 |
| Paket adı | `com.fugo.wow` | Arama sonuçlarındaki Google Play bağlantıları bu kimliği "Words of Wonders: Crossword" adıyla gösteriyor. Türkçe ad, aynı uygulamanın yerelleştirilmiş adı gibi görünüyor | 🔷 (telefonda doğrulanmalı 🧪) |
| Puan | 4,8 ★ – 6 Mn yorum | Görsel 1 | ✅ |
| İndirme sayısı | "100 M…" (ekranda kesik, büyük olasılıkla "100 Mn+") | Görsel 1 | ✅ kısmi |
| Yaş sınırı | PEGI 16 | Görsel 1 | ✅ (16 olmasının nedeni ❓) |
| İndirme boyutu | 186 MB | Görsel 1 | ✅ |
| Gelir modeli | "Reklam içerir • Uygulama içi satın alma" | Görsel 1 | ✅ |
| Tanıtım iddiası | "300 000+ çözülecek bulmaca" (tanıtım videosunun kapağında) | Görsel 1 | ✅ yazı görülüyor / iddianın doğruluğu ❓ |
| **Telefonunuzdaki sürüm numarası** | Görsellerde yok | – | ❓ 🧪 |
| Kamuya açık güncel sürüm | Arama özetlerine göre 5.10.x serisi. Aptoide: 5.10.2 (19.09.2026). ABD App Store önbelleği: 5.10.4. Google Play'in bir anlık görüntüsünde son güncelleme tarihi 22 Ekim 2026. GameLoop ise tarih vermeden 5.3.5 diyor. **Kaynaklar birbiriyle çelişiyor.** | Arama özetleri | 🟡 |

**Karıştırılmaması gereken diğer oyunlar:** Aynı markanın başka oyunları da var: "Words of Wonders: Search", "Guru" ve "Zen". Bunlar ayrı uygulamalar (arama özetlerine göre paketleri `com.fugo.wowsearch`, `com.fugo.wowguru`, `com.fugo.wowzen`). 🟡 Bu rapor yalnızca ana oyunla ilgili.

**Sürüm farkı uyarısı:** Mobil oyunlar aynı sürümde bile bölgeye, cihaza ve oyuncu grubuna göre farklı arayüz veya ödül gösterebilir (A/B testi). Bu rapordaki ekranlar, **25 Ekim 2026'da yeni kurulmuş bir Android kopyasının** ilk 4 bölümünü yansıtır. Daha eski veya daha yeni sürümler farklı olabilir.

---

## 3. Temel oyun döngüsü

```
Yükleme ekranı
   ↓
Ana ekran  ──(yeşil "BÖLÜM N" düğmesi)──►  Bölüm ekranı
                                              │  harf çemberinden kelime kur
                                              │  ↳ doğruysa ızgaraya yerleşir
                                              │  ↳ yanlışsa balon titrer, kaybolur
                                              ▼
                                   Tüm kelimeler bulundu
                                              ↓
                                   Övgü bandı ("SÜPER", "GÜZEL")
                                              ↓
                          "TEBRİKLER!" ekranı: sayaç + 2 ilerleme çubuğu
                                              ↓
                          "BÖLÜM N+1" düğmesi  ──►  sonraki bölüm (döngü)
```

### Videonun zaman çizelgesi

| Video anı | Olay | Etiket |
|---|---|---|
| 0:00–0:01 | Yükleme ekranı ("YÜKLENİYOR...") | ✅ |
| 0:01–0:02,5 | Ana ekran: logo, "1 YOLCULUK", "BÖLÜM 2" düğmesi, 200 elmas, 10 "W" jetonu, ayarlar ve profil simgesi | ✅ |
| ~0:03,4 | Bölüm 2 açılır: Ç, A, M harfleri, artı (+) şeklinde ızgara | ✅ |
| 0:04,5–0:05,4 | Oyuncu Ç→A→M sürükler, balonda "ÇA" yazar | ✅ |
| 0:05,6–0:06,3 | Harfler balondan ızgaraya uçar, ÇAM yatay satıra yerleşir, hücreler mora döner | ✅ |
| ~0:07,5 | Kalan dikey kelimenin sütunu bir kez "zıplar", sonra mor çerçeveyle işaretli kalır | ✅ |
| 0:08,5–0:09,2 | Oyuncu M→A→Ç sürükler ("MA" → "MAÇ") | ✅ |
| ~0:09,6–0:10,5 | MAÇ dikey sütuna yerleşir, **"SÜPER"** bandı çıkar | ✅ |
| ~0:11,3 | "TEBRİKLER!" ekranı: "2 YOLCULUK"; çubuklar 1/8→2/8 ve 1/4→2/4 olur | ✅ |
| ~0:13–0:14 | Düğme "BÖLÜM 2" → "BÖLÜM 3" olarak değişir, oyuncu dokunur | ✅ |
| ~0:14,8 | Bölüm 3 açılır: K, I, Ş harfleri | ✅ |
| 0:15,5–0:18,7 | Eğitim kutusu: "Takılırsan İPUCU kullanabilirsin." ve **TAMAM** düğmesi. Ok, üzerinde kırmızı **2** rozeti olan ipucu düğmesini gösterir | ✅ |
| ~0:19,5–0:20 | 1. ipucu: yatay kelimenin **sağ** hücresine Ş açılır, rozet 2→1 olur | ✅ |
| ~0:21,5–0:22 | 2. ipucu: yatay kelimenin **sol** hücresine K açılır, rozetin yerine "100 elmas" fiyatı gelir | ✅ |
| 0:24–0:26 | Oyuncu Ş→K→I ("ŞKI") dener: **reddedilir**, balon titreyip kaybolur | ✅ |
| 0:27–0:28 | K→I→Ş: **KIŞ** kabul edilir | ✅ |
| ~0:29,5 | Kalan dikey sütun yine zıplar ve çerçeveyle işaretlenir | ✅ |
| 0:33,5–0:35 | Ş→I→K: **ŞIK** kabul edilir, **"GÜZEL"** bandı çıkar | ✅ |
| ~0:36,2 | "TEBRİKLER!": "3 YOLCULUK"; çubuklar 2/8→3/8 ve 2/4→3/4 olur | ✅ |
| ~0:38,5 | "BÖLÜM 4" düğmesi | ✅ |
| ~0:39,3 | Bölüm 4 açılır: Ü, Y, K, Ö harfleri, H şeklinde ızgara (video burada bitiyor) | ✅ |

---

## 4. Oyun kuralları ve mekanikleri

### 4.1 Oyuncu oyuna nasıl başlıyor?
- Uygulama açılınca önce yükleme ekranı, sonra ana ekran geliyor. Ana ekranda tek büyük eylem düğmesi var: yeşil **"BÖLÜM N"**. ✅
- Bölüm 1 bir **eğitim bölümü**: ekran kararıyor, yalnızca hedef satır ve harf çemberi aydınlık kalıyor. "KAŞ kelimesinin harflerini birleştir." yazısı çıkıyor (Görsel 3). ✅
- Oyun hesap açmayı veya giriş yapmayı istemeden başlıyor gibi görünüyor. 🔷 (Kurulumdan ilk bölüme kadar olan kısım görülmedi 🧪)

### 4.2 Harfler nasıl gösteriliyor?
- Harfler, ekranın alt yarısındaki büyük, beyaz, yarı saydam bir **çemberin** kenarına eşit aralıklarla diziliyor. 3 harfte üçgen gibi (üst, sol alt, sağ alt), 4 harfte artı gibi (üst, sol, sağ, alt). ✅
- Harfler büyük ve kalın, siyah renkte. ✅
- Çemberin ortasında gri bir **karıştırma** (çapraz oklar) simgesi var. Bölüm 2'den itibaren görülüyor. Bölüm 1 eğitim ekranında bu simge görünmüyor. ✅
- Her harf çemberde **bir kez** yer alıyor. Görülen bölümlerde tekrar eden harf yok. ✅ (Tekrar eden harfli bölümler var mı ❓)

### 4.3 Harfleri seçme ve sürükleme
- Oyuncu bir harfe dokununca harf **mor bir daireye** dönüşüyor ve çemberin üstünde mor bir **önizleme balonu** beliriyor. Balonda o ana kadar seçilen harfler yazıyor ("Ş", "ÇA", "MA"). ✅
- Parmak başka bir harfin üstüne gelince o harf de seçiliyor ve iki harf **mor bir çizgiyle** birleşiyor. ✅
- Kelime, **parmak kaldırıldığında** kontrol ediliyor. ✅
- Her harf seçiminde kısa bir ses çıkıyor (ses kaydında her harf dokunuşunda bir tepe var). ✅ ses var / sesin türü ❓
- Geri gidince (parmağı önceki harfe döndürünce) seçimin iptal olup olmadığı görülmedi. ❓ 🧪

### 4.4 Kelime doğru olduğunda
1. Balondaki harfler ayrılıp **tek tek ve hafif gecikmeyle** ızgaradaki hücrelere uçuyor. ✅
2. Hücreler önce beyaz harfle doluyor, sonra **mor zemine** dönüyor. ✅
3. Bu işlem yaklaşık **0,75–0,9 saniye** sürüyor (videodan ölçüldü, ±0,1 sn). ✅
4. Ortak hücredeki harf (iki kelimenin kesiştiği yer) yeniden çiziliyor, yani harf animasyonu ortak hücreyi de kapsıyor. ✅

### 4.5 Kelime yanlış olduğunda
- "ŞKI" denemesinde balon **yaklaşık 0,4 saniye sağa sola titredi**, sonra kayboldu. ✅
- Kırmızı renk, uyarı yazısı veya elmas kaybı **yok**. Elmas 200'de kaldı. ✅
- Hatalı denemelerin bir sınırı olup olmadığı ❓ bilinmiyor. Görülen davranışa göre ceza yok. 🔷

### 4.6 Bulunan kelimeler tahtaya nasıl yerleşiyor?
- Izgara **baştan belli**: bölüm açıldığında boş hücreler görünüyor, yani kelimelerin yeri ve uzunluğu önceden tasarlanmış. ✅
- Her boşluğa belirli bir kelime ait. Örneğin Bölüm 2'de ÇAM ve MAÇ aynı harflerden oluşuyor ama ÇAM yatay satıra, MAÇ dikey sütuna yerleşti. ✅
- Kelimeler bulmaca gibi **yatay ve dikey** diziliyor ve ortak harflerde kesişiyor. ✅
- İlk kelimeden ~1,5 saniye sonra **kalan kelimenin sütunu bir kez büyüyüp küçülüyor**, sonra **mor çerçeveyle** işaretli kalıyor. Bölüm 2 ve 3'te aynı şekilde görüldü. ✅ Bu bir yönlendirme ipucu gibi görünüyor. 🔷 Sonraki bölümlerde de olup olmadığı 🧪.

### 4.7 Hangi kelimeler kabul ediliyor?
- Kabul edilenler: ÇAM, MAÇ, KIŞ, ŞIK (hepsi ızgarada yeri olan kelimeler). ✅
- Reddedilen: ŞKI (Türkçe bir kelime değil). ✅
- **Izgarada olmayan ama geçerli Türkçe kelimeler** (örneğin Ç-A-M harfleriyle "AÇ") **denenmedi**. Bu tür kelimelerin "bonus kelime" sayılıp sayılmadığı ❓ bilinmiyor 🧪. (Arkadium'un web sürümüne ait bir yardım sayfası, ızgaraya uymayan geçerli kelimelerin bonus kelime olabileceğini söylüyor 🟡. Ama o sayfa mobil uygulamayı anlatmıyor.)
- En kısa kabul edilen kelime uzunluğu ❓. Görülen bütün kelimeler 3 harfli.

### 4.8 Bölümü tamamlama koşulu
- **Izgaradaki tüm kelimeler** bulununca bölüm bitiyor: son kelime → övgü bandı → ızgara kaybolur → "TEBRİKLER!" (yaklaşık 2 saniye). ✅
- Bölümün bir süre sınırı yok gibi görünüyor (sayaç görülmedi). 🔷

### 4.9 İpucu sistemi
- İpucu düğmesi, çemberin sağ üstünde, ampul simgeli koyu yuvarlak bir düğme. Altında fiyatı yazıyor: **100 elmas**. ✅
- Bölüm 3'te eğitim kutusu ipucunu tanıttı ve düğmeye kırmızı **"2"** rozeti eklendi. İki kullanımdan sonra rozetin yerine "100" fiyatı geri geldi. **Elmas 200'de kaldı**, yani bu iki ipucu ücretsizdi. ✅
- İpucu, **henüz bulunmamış bir kelimenin boş bir hücresine tek bir harf** açıyor. Açılan harf beyaz hücrede siyah olarak duruyor (mor değil). Kelime bulununca hücre mora dönüyor. ✅
- Açılan hücre sırası: önce Ş (KIŞ'ın 3. harfi), sonra K (1. harfi). Harfler okuma sırasıyla açılmıyor. ✅ Hücrenin nasıl seçildiği (rastgele mi, kurala göre mi) ❓ 🧪
- Ortak hücre (I) ipucuyla açılmadı. ✅ Bu bir kural mı ❓.
- Oyunda başka yardım türleri (kelimenin tamamını açma, seçilen hücreyi açma vb.) olup olmadığı görülmedi. ❓

### 4.10 Karıştırma düğmesi
- Çemberin ortasındaki çapraz ok simgesi. ✅
- Videoda **hiç kullanılmadı**. ❓ Harflerin çemberdeki yerini değiştirdiği düşünülüyor (bu tür oyunlarda yaygın), ama bu oyunda doğrulanmadı. 🧪 Ücretli mi ücretsiz mi ❓ (üstünde fiyat yazmıyor ✅).

### 4.11 Para birimleri, ödüller, görevler, reklam ödülleri
| Öğe | Gözlem | Etiket |
|---|---|---|
| **Yeşil elmas** | Başlangıç 200. Görülen 4 bölümde hiç artmadı veya azalmadı. İpucu fiyatı bu birimle gösteriliyor | ✅ |
| **Mavi "W" jetonu** | Başlangıç 10. Hiç değişmedi. Ne işe yaradığı ❓ | ✅ görüldü / amaç ❓ |
| **Hediye kutusu çubuğu** | Her bölümde +1 doluyor (1/8 → 2/8 → 3/8). 8'de dolunca hediye verilmesi bekleniyor | ✅ çubuk / 🔷 ödül / içerik ❓ |
| **Durak çubuğu "GİZE PİRAMİTLERİ"** | Her bölümde +1 (1/4 → 2/4 → 3/4). Yanında piramit resimli bir **kart** var | ✅ / 🔷 durak bitince kart kazanılır |
| **"YOLCULUK" sayacı** | Ana ekranda ve "TEBRİKLER" ekranında yuvarlak içinde. Bölüm 1 sonrası 1, Bölüm 2 sonrası 2, Bölüm 3 sonrası 3 | ✅ / anlamı 🔷 (tamamlanan bölüm sayısı gibi davranıyor) |
| **Günlük görev / günlük ödül** | Görülmedi | ❓ 🧪 |
| **Reklam izleyerek ödül** | Görülmedi | ❓ 🧪 |
| **Övgü bantları** | "SÜPER" (Bölüm 2'nin son kelimesi), "GÜZEL" (Bölüm 3'ün son kelimesi). Hangi kurala göre seçildiği ❓ | ✅ |

---

## 5. Bölüm ve zorluk sistemi

### 5.1 Görülen bölümler

| Bölüm | Harfler | Izgara şekli | Kelimeler | Etiket |
|---|---|---|---|---|
| 1 | K, A, Ş | **T** şekli: 3 hücrelik yatay satır + ortasından aşağı inen 3 hücrelik sütun | Yatay: **KAŞ** (yönergede yazıyor). Dikey kelime görülmedi. Harflere ve şekle göre **AŞK** olması muhtemel | KAŞ ✅ / AŞK 🔷 tahmin |
| 2 | Ç, A, M | **Artı (+)**: 3'lük yatay + 3'lük dikey, ortada kesişiyor | Yatay **ÇAM**, dikey **MAÇ** | ✅ |
| 3 | K, I, Ş | **Artı (+)** | Yatay **KIŞ**, dikey **ŞIK** | ✅ |
| 4 | Ü, Y, K, Ö | **H** şekli: ortada 4'lük yatay + iki uçta 3'lük dikey | Çözülmedi. Harflere ve şekle uyan bir çözüm: yatay **ÖYKÜ**, solda **KÖY**, sağda **YÜK** | şekil ✅ / kelimeler tahmin (doğrulanmadı) |

### 5.2 Zorluk nasıl artıyor? (gözleme dayalı)
- **Harf sayısı:** Bölüm 1–3'te 3 harf, Bölüm 4'te 4 harf. ✅
- **Kelime sayısı:** Bölüm 1–3'te 2 kelime, Bölüm 4'te 3 kelime yeri. ✅
- **Tüm harfleri kullanan kelime:** Görülen her bölümde en az bir kelime çemberdeki **bütün** harfleri kullanıyor. ✅ (Bölüm 1–3) / 🔷 (Bölüm 4)
- **Anagram çiftleri:** İlk bölümlerdeki kelimeler aynı harflerin farklı dizilişleri (ÇAM/MAÇ, KIŞ/ŞIK). Yeni başlayan için kolay bir başlangıç. ✅
- **Yeni özellikler sırayla tanıtılıyor:** Bölüm 1'de sürükleme, Bölüm 3'te ipucu tanıtıldı. Karıştırma henüz tanıtılmadı. ✅
- Daha ileri bölümlerde harf sayısının nasıl arttığı (5, 6, 7 harf...) ❓ 🧪

### 5.3 Dünya / durak / harita sistemi
- İlk durak **"GİZE PİRAMİTLERİ"**. Bölüm arka planı da piramitler. ✅
- Durak **4 bölümden** oluşuyor (1/4 … 3/4). ✅ Bölüm 4 bitince durağın tamamlanması ve kartın kazanılması bekleniyor. 🔷 🧪
- App Store açıklamasına dair arama özetine göre oyun bir dizi "harika" (dünya harikası) üzerinden ilerliyor ve her harikada zorluk artıyor. 🟡 Gözlemlerle uyumlu. 🔷
- Videoda ayrı bir **harita ekranı** görülmedi. ❓ (Ana ekrandan doğrudan bölüme geçiliyor.)
- Ana ekran arka planı sonbahar temalı bir göl. Video Ekim ayında çekildiği için **mevsimsel tema** olabilir. 🔷 tahmin / 🧪

### 5.4 Bonus ve gizli kelimeler
- Görülmedi. Ekranda bonus kelime sayacı veya düğmesi yok (ilk 4 bölümde). ❓ 🧪

### 5.5 İlerleme kaydı
- Görsel 4'te Bölüm 1 bitmiş. Video ise **yükleme ekranıyla** başlıyor (uygulama yeniden açılmış) ve ana ekran "BÖLÜM 2"yi gösteriyor. Yani ilerleme, uygulama kapanıp açılınca **korunuyor**. 🔷
- Kaydın telefonda mı, sunucuda mı tutulduğu ❓. Ana ekrandaki **profil simgesi** bir hesap / bulut kayıt sistemine işaret ediyor olabilir. ❓ 🧪

---

## 6. Kelime doğrulama sistemi

> **Önemli:** Kaynak kod olmadığı için oyunun içinde kelimelerin **nasıl** kontrol edildiğini bilmiyorum. Aşağıda **gözlenen davranış** ile **olası teknik açıklama** ayrı tutuldu.

### 6.1 Gözlenen davranışlar
| Davranış | Etiket |
|---|---|
| Izgarada yeri olan kelimeler kabul edildi (ÇAM, MAÇ, KIŞ, ŞIK) | ✅ |
| Aynı harflerin anlamsız dizilişi reddedildi (ŞKI) | ✅ |
| Her kelime belirli bir boşluğa gidiyor. Aynı harflerden oluşan iki kelime karışmıyor | ✅ |
| Izgara şekli bölüm başında hazır görünüyor | ✅ |
| Bir kelime sadece çemberdeki harflerden ve her harf bir kez kullanılarak kuruluyor (sürükleme arayüzü bunu zorunlu kılıyor) | ✅ |
| Izgarada olmayan geçerli kelimeler | ❓ 🧪 |
| Zaten bulunmuş bir kelimeyi tekrar girmek | ❓ 🧪 |
| Tekrar eden harfler (ör. "KAPAK" gibi iki A'lı kelimeler) | ❓ 🧪 |

### 6.2 Olası teknik açıklama (TAHMİN – doğrulanmadı)
- Bölüm cevaplarının **sabit** olması çok muhtemel. Izgara boşlukları bölüm başında görünüyor, kelime–boşluk eşleşmesi kesin. 🔷
- Muhtemel bölüm verisi: harf listesi + her kelimenin yazılışı + başlangıç satırı/sütunu + yönü (yatay/dikey). Tahmin.
- Muhtemel kontrol: Parmak kalkınca seçilen harf dizisi bölümün kelime listesiyle karşılaştırılıyor. Bulunmamış bir kelimeyle eşleşirse ilgili boşluğa yerleştiriliyor. Tahmin.
- Bonus kelime özelliği varsa, ayrıca dile özel bir **sözlük listesi** gerekir. Var olup olmadığı ❓.
- Bölümlerin sunucudan mı geldiği, uygulama içinde mi durduğu ❓ (APK analizi veya uçak modu testi gerekir).

### 6.3 Türkçe karakterler
- Ç, Ş, Ü, Ö harfleri çemberde ve ızgarada doğru görünüyor. ✅
- **Noktasız I (ı) ile noktalı İ (i) ayrımı doğru:** "KIŞ" ve "ŞIK" kelimelerinde noktasız **I**, "TEBRİKLER" ve "GİZE PİRAMİTLERİ" yazılarında noktalı **İ** kullanılmış. ✅ Yani oyun Türkçe büyük harf kurallarına uyuyor. Bu, kelime kontrolünde ı/i karışıklığının önlendiğini gösteriyor. 🔷
- Harfler her zaman **büyük harf** gösteriliyor. Klavye girişi yok, sadece dokunma var. Bu yüzden büyük/küçük harf farkı oyuncu açısından ortaya çıkmıyor. ✅

---

## 7. Arayüz ve kullanıcı deneyimi

**Genel tasarım dili:** Tam ekran resimli arka plan, üstte ince bir bilgi çubuğu (elmas, W, ayarlar), yarı saydam beyaz paneller, mor vurgu rengi, yeşil eylem düğmesi, altın kurdeleli mor övgü bandı. ✅

### 7.1 Ekranların tek tek incelenmesi

#### 1) Açılış (yükleme) ekranı – Görsel 2, video 0:00 ✅
- **Amaç:** Oyun yüklenirken bekletmek.
- **Yerleşim:** Ortada "WORDS OF WONDERS" logosu, sonbahar göl manzarası, altta "YÜKLENİYOR..." yazısı ve beyaz ilerleme çubuğu.
- **Düğmeler:** Yok.
- **Geri bildirim:** İlerleme çubuğu.
- **İyileştirme önerisi:** Yükleme uzunsa kısa ipuçları gösterilebilir. (Süre ölçülemedi; videoda ~1 sn görünüyor ama kayıt yüklemenin ortasında başlamış olabilir.)

#### 2) Ana menü – video 0:01–0:02,5 ✅
- **Amaç:** Oyuncuyu tek dokunuşla sıradaki bölüme götürmek.
- **Yerleşim:** Üstte logo; ortada yuvarlak "1 YOLCULUK" göstergesi (etrafında parlayan halka animasyonu); altta yeşil **"BÖLÜM 2"** düğmesi; sol altta **profil** simgesi; sağ üstte **ayarlar** dişlisi; sol üstte elmas ve W sayaçları.
- **Dokunma:** Bölüm düğmesi, profil, ayarlar.
- **Animasyon:** Logo yukarı kayar, düğme ve sayaçlar belirir (giriş geçişi).
- **İyileştirme önerisi:** Elmas ve W'nin ne işe yaradığı ilk bakışta anlaşılmıyor. Kısa bir açıklama faydalı olabilir.

#### 3) Bölüm / harita ekranı ❓
- Videoda ayrı bir harita ekranı **görülmedi**. Bölüm ilerlemesi "TEBRİKLER" ekranındaki çubuklarla gösteriliyor. İlerleyen bölümlerde harita açılıp açılmadığı 🧪.

#### 4) Aktif oyun ekranı – Görsel 3, video 0:03–0:36 ✅
- **Amaç:** Bulmacayı çözmek.
- **Yerleşim (yukarıdan aşağı):** bilgi çubuğu → ortada kelime ızgarası → altta harf çemberi → çemberin sağ üstünde ipucu düğmesi. Arka plan durağın resmi (piramitler, palmiye yaprakları).
- **Düğmeler:** Ayarlar (sağ üst), ipucu (sağ alt), karıştırma (çemberin ortası).
- **Eksik:** Oyun ekranında **geri / ana sayfa** düğmesi görülmedi (yalnızca ayarlar var). ✅ Ana sayfaya ayarlar menüsünden dönülüp dönülmediği 🧪.

#### 5) Harf çemberi ✅
- **Dokunma:** Dokun → sürükle → bırak.
- **Görsel geri bildirim:** Seçilen harf mor daireye dönüşür, harfler arasında mor çizgi çekilir, üstteki balonda kelime yazılır.
- **Sesli geri bildirim:** Her harf seçiminde kısa ses.
- **Mobil uyum:** Çember ekranın alt yarısında, başparmakla rahat ulaşılabilir. Harfler büyük ve aralıklı.
- **İyileştirme önerisi:** 6–7 harfli bölümlerde harflerin sıkışması 🧪 olarak kontrol edilmeli.

#### 6) Kelime bulma alanı (ızgara) ✅
- **Boş hücre:** Yarı saydam beyaz kare.
- **Bulunmuş kelime:** Mor zemin, beyaz harf.
- **İpucuyla açılmış harf:** Beyaz zemin, siyah harf.
- **Vurgu:** Kalan kelimenin hücreleri mor çerçeveyle işaretleniyor.
- **İyileştirme önerisi:** Ortak hücreler belirgin; ilk bölümler için yeterli. Uzun ızgaralarda hücre boyutunun küçülmesi 🧪.

#### 7) İpucu ve karıştırma düğmeleri ✅
- **İpucu:** Ampul simgesi + "100" elmas fiyatı. Ücretsiz hak varken kırmızı sayı rozeti.
- **Karıştırma:** Çemberin ortasında gri simge, fiyat yok.
- **Eğitim:** Ekran kararır, sarı kutuda "Takılırsan İPUCU kullanabilirsin." yazar, beyaz bir ok ipucu düğmesini gösterir, "TAMAM" ile kapanır.
- **İyileştirme önerisi:** Elmas yetmediğinde ne olduğu görülmedi (mağazaya mı, reklama mı yönlendiriyor) 🧪.

#### 8) Bölüm tamamlandı ekranı – Görsel 4, video 0:11–0:14 ✅
- **Amaç:** Başarıyı kutlamak ve ilerlemeyi göstermek.
- **Yerleşim:** "TEBRİKLER!" başlığı; ortada yuvarlak "N YOLCULUK"; altında **hediye kutusu çubuğu (x/8)** ve **durak çubuğu (GİZE PİRAMİTLERİ x/4)** ve kartı; altta yeşil "BÖLÜM N+1"; sol altta **ana sayfa** düğmesi.
- **Animasyon:** Çubuklar **sırayla** doluyor (önce hediye, sonra durak). Ardından düğme bir önceki numarayla belirip parlayarak yeni numaraya geçiyor (ör. "BÖLÜM 2" → "BÖLÜM 3"). Sonraki bölüme geçerken yuvarlak gösterge küçülerek kayboluyor.
- **İyileştirme önerisi:** Hediye ve kartın ne kazandıracağı bu ekranda yazmıyor. Hedefi göstermek motivasyonu artırabilir.

#### 9) Ödül ve reklam ekranları ❓
- İlk 4 bölümde **hiçbir reklam veya ödül penceresi görülmedi.** 🧪

#### 10) Ayarlar ve diğer menüler ❓
- Ayarlar dişlisi ve profil simgesi görüldü ama **açılmadı**. İçerikleri (ses, müzik, dil, hesap, gizlilik, reklam izni vb.) ❓ 🧪

### 7.2 Ölçülen animasyon ve geçiş süreleri

| Animasyon | Yaklaşık süre | Etiket |
|---|---|---|
| Doğru kelime: harflerin hücrelere uçup mora dönmesi | 0,75–0,9 sn | ✅ |
| Yanlış kelime: balonun titreyip kaybolması | ~0,4 sn | ✅ |
| İlk kelimeden sonra kalan kelime vurgusu | kelimeden ~1,5 sn sonra başlıyor | ✅ |
| Son kelime → "TEBRİKLER" ekranı | ~2 sn | ✅ |
| "TEBRİKLER" → sonraki bölümün açılması (düğmeye dokunduktan sonra) | ~0,5–1 sn | ✅ |
| İpucu: düğmeye dokunma → harfin görünmesi | ~0,5 sn | ✅ |

*Not: Ölçümler sıkıştırılmış videodan saniyede 8–24 kareyle yapıldı. Hata payı yaklaşık ±0,1 sn.*

### 7.3 Ses gözlemleri (ses kaydının seviye analizi)

| Olay | Gözlem | Etiket |
|---|---|---|
| Harf seçimi | Her harf dokunuşunda kısa bir ses tepesi | ✅ |
| İpucu kullanımı | ~1 sn süren ses (0:19,8 ve 0:21,9) | ✅ |
| Kelime bulma + bölüm sonu | Birkaç saniye süren ses dizisi. Bölüm 2 ve 3'te aynı yapıda | ✅ |
| Sürekli arka plan müziği | Olayların arasında ses yok, yani **kayıtta sürekli müzik yok** | ✅ kayıtta / oyunda müzik var mı ❓ (ayarlardan kapalı olabilir) |

---

## 8. Teknik mimari ve APK bulguları

### 8.1 Durum: APK analizi YAPILMADI
- APK dosyası verilmedi. İnternetteki üçüncü taraf APK sitelerinden indirmeyi **bilerek denemedim**. Bu sitelerdeki dosyaların güvenliği ve aslına uygunluğu garanti değil, ayrıca ağ erişimi de kapalıydı.
- JADX ve apktool bu ortamda kurulu değil.
- Bu yüzden şunlar ❓ **bilinmiyor:** AndroidManifest izinleri, oyun motoru, kullanılan reklam/analiz kütüphaneleri, bölüm verilerinin dosya biçimi, yerel veritabanı, ağ bağlantıları.

### 8.2 Dışarıdan bilinenler
| Bilgi | Etiket |
|---|---|
| Android uygulaması, Google Play'den dağıtılıyor, PC'de Google Play Games ile çalışıyor | ✅ |
| İndirme boyutu 186 MB (resimli arka planlar ve sesler büyük yer tutuyor olabilir) | ✅ boyut / 🔷 neden |
| iOS sürümü de var | 🟡 |
| Oyun motoru (ör. Unity) | ❓ Arama hiçbir kaynakta doğrulamadı |
| **Google Play "Veri güvenliği" bölümü:** Arama özetine göre uygulama kişisel bilgileri, uygulama etkinliğini ve cihaz kimliklerini üçüncü taraflarla paylaşabiliyor. Bunlar analiz, reklam ve kişiselleştirme amacıyla kullanılıyor. Kullanıcı kimliği (isteğe bağlı), çökme kayıtları ve cihaz kimliği toplanabiliyor. Veri silme talebi yolu var | 🟡 (sayfayı açamadım) |
| Aynı arama özetinde "veriler aktarım sırasında şifrelenmiyor" ifadesi geçiyor | 🟡 **Doğrulayamadım.** Önemli bir iddia olduğu için Play Store'daki "Veri güvenliği" bölümünden **kendiniz kontrol etmelisiniz.** |
| App Store gizlilik etiketinde "kimlikler" ve "kullanım verileri"nin başka şirketlerin uygulama ve sitelerinde takip için kullanılabileceği yazıyor | 🟡 |
| Exodus Privacy (izleyici ve izin raporu) | Arama bu paket için rapor bulamadı. Sitenin kendisine erişilemedi ❓ |

### 8.3 APK gelirse neye bakılacak?
APK incelemesi yapılırsa şu sorular cevaplanabilir:
1. `AndroidManifest.xml` → izinler (internet, reklam kimliği, bildirim vb.), paket adı, sürüm.
2. Klasör yapısı → oyun motoru izleri (ör. Unity'de `assets/bin/Data` ve `libunity.so` dosyaları bulunur).
3. Kütüphane listesi → reklam ağları, analiz ve çökme raporlama araçları.
4. Varlık dosyaları → bölüm verileri (JSON, ikili dosya, şifreli paket?), kelime listeleri, yazı tipleri, sesler.
5. Ağ adresleri → bölümler veya kayıtlar sunucudan mı geliyor?

---

## 9. Reklam ve gelir modeli

| Konu | Bulgu | Etiket |
|---|---|---|
| Reklam var mı? | Evet ("Reklam içerir") | ✅ |
| Uygulama içi satın alma var mı? | Evet | ✅ |
| İlk 4 bölümde reklam | **Hiç görülmedi** | ✅ |
| Reklam gösterim noktaları (bölüm arası, ödüllü vb.) | ❓ | 🧪 |
| Ödüllü reklam (reklam izle → elmas/ipucu) | Görülmedi | ❓ 🧪 |
| Satın alınabilen ürünler | Arama özetine göre: reklamları kaldırma (ABD fiyatı 9,99 $), coin/para paketleri ve abonelik seçenekleri. Play'de "Oyun içi satın alma (rastgele öğeler dahil)" ibaresi | 🟡 (Türkiye fiyatları ❓) |
| İpucu ekonomisi | 1 ipucu = 100 elmas. Başlangıç 200 elmas = 2 ipucu. Eğitimde 2 ipucu bedava | ✅ |
| Bölüm başına elmas kazancı | Bölüm 1–3'te **0** (sayaç değişmedi) | ✅ |
| Oyuncuyu oyunda tutan unsurlar | Bitirme çubukları (8 bölümde hediye, 4 bölümde kart), "YOLCULUK" sayacı, övgü bantları, her durakta yeni arka plan, olası mevsimsel tema | ✅ / 🔷 |
| Günlük ödül | Görülmedi | ❓ |
| Zorluk–ödül dengesi | İlk bölümler çok kolay ve ödül vaat ediyor. Elmas kazanılmadığı için ipuçları ileride sınırlı kalabilir. Bu, elmas satın almaya veya reklam izlemeye yönlendirebilir | 🔷 tahmin |

**Not:** Gelir, reklam sıklığı veya oyuncu davranışına dair gerçek bir veri elimde yok. Bu konularda sayısal tahmin vermiyorum.

---

## 10. Çevrim dışı çalışma ve veri saklama

| Soru | Durum |
|---|---|
| İnternetsiz oynanabiliyor mu? | ❓ 🧪 (Uçak modu testi gerekli) |
| İlerleme uygulama kapanınca korunuyor mu? | 🔷 Evet (video yükleme ekranıyla başlayıp Bölüm 2'den devam ediyor) |
| İlerleme nerede tutuluyor (telefon / sunucu)? | ❓ |
| Uygulama silinip yeniden yüklenince ilerleme geri geliyor mu? | ❓ 🧪 |
| Profil simgesi hesap bağlama mı? | ❓ 🧪 |

---

## 11. Performans ve güvenlik gözlemleri

- **Akıcılık:** Sıkıştırılmış videoda takılma veya donma görülmedi. Ancak video gerçek FPS'i ölçmeye uygun değil. ✅ (sınırlı)
- **Yükleme:** Uygulama açılışında yükleme ekranı var. Bölümler arası geçiş ~0,5–1 sn. ✅
- **Boyut:** 186 MB indirme. Düşük depolamalı telefonlar için büyük sayılabilir. ✅
- **Güvenlik:** Kod incelenmediği için güvenlik değerlendirmesi **yapılamadı.** Veri paylaşımı bilgileri yalnızca arama özetlerinden geliyor (Bölüm 8.2). 🟡
- **Bu uygulama "güvenli" midir?** Resmî Google Play mağazasından yüklenmiş olması iyi bir işaret. Ancak bunu tek başına "tamamen güvenli" demek için yeterli kanıt sayamam. ❓

---

## 12. Doğrulanmış bulgular ve belirsizlikler (özet)

### ✅ Doğrulananlar
- Uygulama adı, geliştirici, puan, yaş sınırı, boyut, reklam ve satın alma bilgisi (Görsel 1)
- Harf çemberi ile sürükleyerek kelime kurma, önizleme balonu, mor bağlantı çizgisi
- Sabit ızgara, yatay/dikey kesişen kelimeler, her kelimenin kendi boşluğu
- Doğru kelimede uçan harf animasyonu (~0,8 sn), yanlış kelimede titreyen balon (~0,4 sn) ve cezasızlık
- Kalan kelime yerinin otomatik vurgulanması
- İpucu: 100 elmas, eğitimde 2 ücretsiz hak, boş hücreye tek harf açma
- Başlangıç bakiyesi 200 elmas ve 10 W. İlk 4 bölümde değişmedi
- 8 bölümlük hediye çubuğu, 4 bölümlük "Gize Piramitleri" durak çubuğu, "YOLCULUK" sayacı
- "SÜPER" ve "GÜZEL" övgü bantları
- Bölüm 1–4'ün harfleri ve ızgara şekilleri; Bölüm 2 ve 3'ün çözümleri
- Türkçe ı/İ ayrımının doğru gösterimi
- İlk 4 bölümde reklam çıkmaması; kayıtta sürekli müzik olmaması

### 🟡 Yalnızca arama özetinden
- Şirket unvanı, iOS sürümü, kamuya açık sürüm numaraları (5.10.x, birbiriyle çelişkili), veri güvenliği bilgileri, satın alma ürünleri, "harikalar" yapısı

### 🔷 Güçlü çıkarımlar
- Paket adı `com.fugo.wow`
- Bölüm cevapları sabit ve önceden tasarlanmış
- Durak 4 bölümde tamamlanıp kart veriyor; 8 bölümde hediye kutusu açılıyor
- "YOLCULUK" tamamlanan bölüm sayısını gösteriyor
- İlerleme uygulama kapanınca korunuyor

### ❓ Bilinmeyenler
- Telefonunuzdaki sürüm numarası, oyun motoru, kütüphaneler, izinler
- Bonus kelime sistemi, en kısa kelime uzunluğu, tekrar giriş davranışı
- Karıştırma düğmesinin davranışı, "W" jetonunun amacı
- Reklamların yeri ve sıklığı, ödüllü reklam, günlük ödül/görev
- Çevrim dışı çalışma, kaydın yeri, ayarlar ve profil menülerinin içeriği
- PEGI 16 sınıflandırmasının nedeni

---

## 13. Daha fazla inceleme için gereken dosyalar ve testler

### 13.1 İhtiyaç duyulan dosyalar / bilgiler
1. **Sürüm numarası:** Telefonda *Ayarlar → Uygulamalar → Words of Wonders → (en altta) Sürüm*. Ekran görüntüsü yeterli.
2. **Play Store "Bu oyun hakkında" ve "Veri güvenliği" bölümlerinin ekran görüntüleri.** Mağaza sayfasında "Bu oyun hakkında" yanındaki → okuna basın. "Veri güvenliği" kısmına kaydırıp ona da basın.
3. **Ek ekran kayıtları** (aşağıdaki testlerin videoları).
4. *(İsteğe bağlı)* **APK dosyası.** Bölüm 13.3'teki uyarıları okuyun.

### 13.2 Telefonda yapılabilecek basit testler

| # | Test | Nasıl yapılır? | Ne öğreniriz? |
|---|---|---|---|
| 1 | Bonus kelime | Izgarada olmayan geçerli bir kelime kurun (ör. 2 harfli "AÇ" gibi). Ekranda bir sayaç veya animasyon çıkıyor mu, izleyin | Bonus sistemi var mı, en kısa kelime kaç harf |
| 2 | Tekrar kelime | Zaten bulduğunuz bir kelimeyi yeniden kurun | Tekrar girişte ne olduğu |
| 3 | Geri sürükleme | Bir harf seçip parmağınızı önceki harfe geri götürün | Seçim iptal ediliyor mu |
| 4 | Karıştırma | Ortadaki çapraz ok simgesine basın | Harfler yer değiştiriyor mu, ücreti var mı |
| 5 | Elmas bitince ipucu | 2 ipucu kullanıp elmas bitince tekrar basın | Mağazaya mı, reklama mı yönlendiriyor |
| 6 | Bölüm 4 sonu | Bölüm 4'ü bitirin | Kart kazanılıyor mu, "Gize Piramitleri" tamamlanıyor mu, yeni durak ne |
| 7 | 8. bölüm | 8. bölüme kadar oynayın | Hediye kutusunda ne çıkıyor |
| 8 | Reklam sıklığı | 15–20 bölüm oynayın, reklam çıkan bölümleri not edin | Reklamların yeri ve sıklığı |
| 9 | Ayarlar | Dişli simgesine basın | Ses, müzik, dil, hesap ve gizlilik ayarları |
| 10 | Profil | Sol alttaki kişi simgesine basın | Hesap / bulut kaydı var mı |
| 11 | "W" jetonu | Üstteki mavi W'ye ve yeşil elmasa basın | Ne işe yaradıkları, mağaza var mı |
| 12 | Çevrim dışı | Uçak modunu açın, oyunu kapatıp yeniden açın, bir bölüm oynayın | İnternetsiz çalışıyor mu |
| 13 | Kayıt kalıcılığı | *(Dikkat: ilerleme kaybolabilir)* Oyunu silip yeniden yükleyin | İlerleme sunucuda mı tutuluyor |
| 14 | Uzun bölümler | 20., 50. bölüm gibi ileri bölümlerin ekran görüntüsünü alın | Harf sayısı ve ızgara büyüklüğü nasıl artıyor |

### 13.3 APK hakkında güvenlik ve hukuk uyarıları
- **Güvenlik:** Üçüncü taraf APK sitelerinden indirilen dosyalar değiştirilmiş olabilir. En güvenli yol, **kendi telefonunuzda Google Play'den kurulu olan kopyayı** dışa aktarmaktır. Bunun bir yolu Android'in resmî geliştirici aracı **adb**'dir. Bu araç, telefonda "Geliştirici seçenekleri" ve "USB hata ayıklama" açılmasını gerektirir. Bu ayar açıkken telefon bağlandığı bilgisayara daha fazla erişim izni verir. Bu yüzden işiniz bitince **kapatmanız** gerekir. İsterseniz bir sonraki aşamada adım adım anlatırım.
- **Modern paket biçimi:** Google Play uygulamaları genellikle tek bir APK değil, birden fazla parça (ana `base.apk` + ek "split" dosyaları) olarak kurar. Hepsinin birlikte alınması gerekir. 🔷
- **Hukuk:** Ticari bir uygulamayı tersine mühendislikle incelemek, uygulamanın kullanım koşullarıyla sınırlanmış olabilir. Fugo'nun koşullarını okuyamadım (siteye erişilemedi). **Bu bir hukuki görüş değildir.**
- **Önerim:** Amacınız **özgün** bir kelime oyunu yapmaksa APK analizi **şart değil**. Bu rapordaki gözlemler oyun mekaniğini tasarlamak için yeterli. Bir oyunun kodu, resimleri, sesleri, bölüm/kelime verileri, adı ve logosu korunur. Bunların hiçbiri kopyalanmamalıdır.

---

## 14. Sonraki aşama için hazırlık: Teknik yol haritası (kod yok)

> Bu bölüm, benzer **temel mekaniklere** sahip ama **özgün** (kendi adı, kendi görselleri, kendi bölümleri olan) bir Türkçe kelime oyunu için hangi sistemlerin kurulması gerektiğini özetler.

### 14.1 Yeniden kurulması gereken sistemler

| # | Sistem | WOW'da gözlenen | Bizim oyunda gereken | Tahmini zorluk |
|---|---|---|---|---|
| 1 | **Temel oyun döngüsü** | Ana ekran → Bölüm → Tebrikler → Sonraki bölüm | Ekranlar arası geçiş yöneticisi, bölüm başlatma/bitirme mantığı | Kolay |
| 2 | **Harf çemberi** | Dokun-sürükle-bırak, mor çizgi, önizleme balonu | Harflerin çember üzerine yerleşimi, parmak takibi, harfe "değme" algılama, çizgi çizimi, geri sürüklemede iptal | Orta |
| 3 | **Kelime doğrulama** | Sadece ızgara kelimeleri kabul ediliyor, yanlışta titreme | Seçilen diziyi bölüm cevaplarıyla karşılaştırma. İsteğe bağlı olarak bonus kelime sözlüğü. **Türkçe harf kuralları** (ı/I, i/İ), tekrar giriş kontrolü | Kolay (sözlük hariç) |
| 4 | **Bulmaca ızgarası** | Yatay/dikey kesişen kelimeler, hücre durumları (boş / ipucu / bulundu) | Izgara çizimi, hücre durumları, harf uçurma animasyonu | Orta |
| 5 | **Bölüm verileri** | Sabit bölümler, kademeli zorluk, anagram başlangıcı | Bölüm veri biçimi (14.2), **bölüm üretme aracı**, **Türkçe kelime listesi** | **Zor** (en büyük iş) |
| 6 | **İpucu ve ekonomi** | 100 elmaslık ipucu, 200 başlangıç, eğitimde ücretsiz hak | Para birimi, ipucu fiyatı, boş hücreye harf açma, ücretsiz hak rozetleri | Kolay–Orta |
| 7 | **İlerleme ve ödüller** | 8 bölümde hediye, 4 bölümde durak + kart, sayaç | Çubuklar, ödül tabloları, durak/tema sistemi | Orta |
| 8 | **Kayıt** | Uygulama kapanınca korunuyor | Telefonda kayıt (mevcut bölüm, bakiye, bulunan kelimeler, açılan ipuçları). Bulut kayıt sonraya bırakılabilir | Kolay (yerel) / Zor (bulut) |
| 9 | **Eğitim (ilk bölümler)** | Ekranı karartıp yönerge verme, ok ile gösterme | Eğitim adımları, vurgulama katmanı | Orta |
| 10 | **Görsel ve ses** | Mor/beyaz tema, resimli arka planlar, kısa sesler | **Özgün** arka planlar, simgeler, yazı tipi (lisansı uygun), ses efektleri | Orta (tasarım işi) |
| 11 | **Reklam / satın alma** *(isteğe bağlı)* | Reklam + uygulama içi satın alma | Reklam SDK'sı, KVKK/GDPR onay penceresi, mağaza kuralları | Zor |

### 14.2 Bölüm verisi nasıl tasarlanmalı? (kavramsal)

Her bölüm için tutulması gereken bilgiler:

| Alan | Açıklama | Örnek (WOW Bölüm 2'deki gözleme göre) |
|---|---|---|
| Bölüm no | Sıra numarası | 2 |
| Harfler | Çemberdeki harfler | Ç, A, M |
| Kelimeler | Her kelime için: yazılış, başlangıç satır/sütun, yön | ÇAM (satır 2, sütun 1, yatay); MAÇ (satır 1, sütun 2, dikey) |
| Bonus kelimeler *(isteğe bağlı)* | Izgarada olmayan geçerli kelimeler | – |
| Durak / tema | Hangi arka plan ve ilerleme grubu | Durak 1 |

**Zorluk eğrisi için gözlenen ilkeler:**
- İlk bölümlerde 3 harf, 2 kelime, anagram çiftleri.
- Her bölümde en az bir kelime bütün harfleri kullanır.
- Harf sayısı yavaş yavaş artar (Bölüm 4'te 4 harf).
- Yeni özellikler (ipucu, karıştırma) birer birer tanıtılır.

**Kelime listesi:** Türkçe için **lisansı kullanmaya uygun** bir kelime listesi bulunmalı. Ön aramada Zemberek-NLP gibi projeler çıktı. Ancak sözlük verisinin lisansını **doğrulayamadım.** Sonraki aşamada lisans dosyaları tek tek kontrol edilmeli. Uygunsuz kelimeleri (argo, hakaret) ayıklamak için ayrı bir filtre gerekecek.

### 14.3 Taklit edilmeye değer küçük kullanıcı deneyimi detayları
- Parmak kalkınca anında karar (bekleme yok).
- Yanlışta ceza yerine **yumuşak** geri bildirim (titreme).
- Doğruda harflerin **tek tek uçması** (tatmin duygusu).
- Kalan kelimenin **kendiliğinden vurgulanması** (takılmayı azaltır).
- Bölüm sonunda **iki ayrı hedef çubuğu** (kısa vadeli hediye + orta vadeli durak).
- Eğitimde **ücretsiz ipucu** vererek özelliği denetmek.

### 14.4 Tahmini teknik zorluklar
1. **Türkçe kelime listesi ve lisansı:** Hem yasal olarak kullanılabilir hem temiz bir liste bulmak.
2. **Bölüm üretimi:** Verilen harflerle çaprazlanan bir ızgara kuran algoritma ya da yüzlerce bölümü elle tasarlamak.
3. **Dokunma hassasiyeti:** Küçük ekranlarda ve çok harfli bölümlerde yanlış harfe değmeyi önlemek.
4. **Animasyon cilası:** "Hissiyat" büyük ölçüde zamanlama ayarlarına bağlı.
5. **Türkçe büyük/küçük harf hataları:** Birçok programlama dilinde varsayılan büyük harf çevirisi "i → I" yapar, Türkçede ise "i → İ" olmalıdır. Bu hata ŞIK/ŞİK gibi kelimeleri bozar.
6. **Reklam ve satın alma eklenirse:** Mağaza kuralları, KVKK/GDPR izinleri, test süreçleri.
7. **Cihaz çeşitliliği:** Farklı ekran boyutları ve eski telefonlarda test.

### 14.5 Önerilen geliştirme aşamaları
| Aşama | İş | Çıktı |
|---|---|---|
| 0 | **Araştırma:** Hazır açık kaynak projeleri (tercihen MIT lisanslı) ve Türkçe kelime listelerini incelemek; teknoloji seçimi (ör. Godot, Flutter, Unity veya web tabanlı). Bu oturumda ağ kısıtlı olduğu için yapılamadı. Ön aramada türe birebir uyan, lisansı uygun bir proje **bulamadım.** | Karşılaştırma tablosu ve seçim |
| 1 | **Prototip:** Tek bölüm, elle yazılmış veri; harf çemberi + ızgara + doğrulama | Oynanabilir tek bölüm |
| 2 | **Bölüm verisi:** Veri biçimi + 20–30 elle hazırlanmış bölüm | Kısa bir oyun |
| 3 | **İpucu, para birimi, kayıt** | İlerlemesi kaydedilen oyun |
| 4 | **Ekranlar ve cila:** Ana ekran, tebrikler ekranı, animasyonlar, sesler, eğitim | Görsel olarak tamamlanmış sürüm |
| 5 | **Bölüm üretim aracı + kelime listesi** | Yüzlerce bölüm |
| 6 | **Test:** Farklı telefonlarda deneme, hata düzeltme | Kararlı sürüm |
| 7 | *(İsteğe bağlı)* Reklam / satın alma | Gelir modeli |
| 8 | **Yayın** (Google Play) | Mağazada uygulama |

*Süre tahmini vermiyorum. Süre, seçilecek teknolojiye, hazır proje bulunup bulunmamasına ve görsel tasarım işine çok bağlı.*

---

## Kaynaklar

**Birincil materyaller (doğrudan incelendi):**
- Kullanıcının gönderdiği 4 ekran görüntüsü (Görsel 1–4)
- `WhatsApp_Video_2026-10-25_at_17.28.18.mp4` (40,8 sn oynanış videosu)

**Web kaynakları:** Bu sayfaların hiçbirini **açıp okuyamadım** (ağ erişimi kapalıydı). Aşağıdaki bilgiler arama aracının bu sayfalara dair özetlerinden geliyor. Bu yüzden 🟡 olarak işaretlendi.
- Google Play – Words of Wonders: Crossword: https://play.google.com/store/apps/details?id=com.fugo.wow&hl=en
- Google Play – Veri güvenliği sayfası: https://play.google.com/store/apps/datasafety?id=com.fugo.wow&hl=en_US
- App Store – Words of Wonders: Crossword: https://apps.apple.com/us/app/words-of-wonders-crossword/id1369521645
- Aptoide sürüm listesi: https://wow-fugo.en.aptoide.com/app
- AppMagic veri özeti: https://appmagic.rocks/google-play/words-of-wonders-crossword/com.fugo.wow/?hl=en
- GameLoop (Türkçe sayfa): https://www.gameloop.com/tr/game/word/words-of-wonders-crossword-to-connect-vocabulary-on-pc
- Microsoft Store listesi: https://www.microsoft.com/en-ie/p/words-of-wonders-crossword/9phtrpm974lh
- Arkadium yardım sayfası (web sürümü, mobil değil): https://support.arkadium.com/en/support/solutions/articles/44002806223--words-of-wonders-how-to-play-tips-scoring
- Diğer WOW oyunları (karıştırılmaması için): https://play.google.com/store/apps/details?id=com.fugo.wowsearch&hl=en , https://play.google.com/store/apps/details?id=com.fugo.wowguru&hl=en , https://play.google.com/store/apps/details?id=com.fugo.wowzen&hl=en_US
- Exodus Privacy hakkında: https://exodus-privacy.eu.org/en/page/what/
- Zemberek-NLP (kelime listesi araştırması için aday, lisansı doğrulanmadı): https://github.com/atagunduzalp/zemberek-nlp
