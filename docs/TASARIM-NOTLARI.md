# Kelime Avı – Tasarım Notları (sürüm 0.1)

Bu belge, Kelime Avı'nın Words of Wonders'tan (WOW) **neleri aynen aldığını**, **neleri bilerek farklı yaptığını** ve WOW'da gözlenemediği için **hangi kararları bu projenin kendisinin verdiğini** açıklar.
Gözlemlerin kaynağı: [`WOW-analiz-raporu.md`](WOW-analiz-raporu.md).

## 1. WOW ile aynı olanlar (gözleme dayalı)

| Özellik | Kelime Avı'ndaki karşılığı |
|---|---|
| Akış | Yükleme → Ana ekran (yolculuk sayacı + yeşil "BÖLÜM N") → Bölüm → Övgü bandı → "TEBRİKLER!" → sonraki bölüm |
| Harf çemberi | Dokun–sürükle–bırak; seçilen harf renkli daireye dönüşür, harfler çizgiyle bağlanır, çemberin üstündeki balonda kelime yazar |
| Doğru kelime | Harfler balondan hücrelere tek tek uçar (~0,8 sn), hücreler renklenir |
| Yanlış kelime | Balon ~0,4 sn sağa sola titrer ve kaybolur; ceza yok |
| Bulmaca | Sabit, kesişen yatay/dikey kelimeler; her kelimenin kendi yeri var |
| Kalan kelime vurgusu | Tek kelime kalınca ~1,5 sn sonra o kelimenin yeri bir kez zıplar ve çerçevelenir |
| İpucu | 100 elmas; boş bir hücreye tek harf açar; mümkünse ortak olmayan hücreyi seçer |
| Ücretsiz eğitim ipuçları | 3. bölümde "Takılırsan İPUCU kullanabilirsin." + 2 ücretsiz hak (rozet) |
| Başlangıç bakiyesi | 200 elmas |
| İlk bölüm eğitimi | Ekran kararır, "… kelimesinin harflerini birleştir." yazar; karıştırma düğmesi gizlidir |
| Zorluk | 3 harf/2 kelime ile başlar, anagram çiftleri, sonra harf sayısı artar; her bölümde tüm harfleri kullanan bir kelime var |
| İlerleme çubukları | 8 bölümlük hediye çubuğu + 4 bölümlük durak çubuğu (kart resmiyle) |
| Övgü bandı | Son kelimede "GÜZEL / SÜPER / HARİKA / MÜKEMMEL" |
| Sesler | Harf seçme, doğru/yanlış kelime, ipucu ve bölüm sonu efektleri; sürekli müzik yok (WOW kaydında da duyulmadı) |
| Kayıt | Uygulama kapanıp açılınca kalınan yerden devam |

## 2. Bilerek farklı yapılanlar (özgünlük için)

| Konu | WOW | Kelime Avı |
|---|---|---|
| Ad ve logo | Words of Wonders | "KELİME" harf karoları + "AVI" |
| Vurgu rengi | Mor | İznik çini mavisi, altın ve mercan kırmızısı |
| Para birimi simgesi | Yeşil elmas | Turkuaz elmas |
| Arka planlar | Dünya harikaları | Türkiye'nin tarihî yerleri (bu proje için çizildi) |
| Ana ekran | Sonbahar göl manzarası | Kız Kulesi gün batımı |
| Kelimeler ve bölümler | WOW'un bölümleri | Tamamen yeni; WOW'un ilk bölümlerindeki kelimeler (KAŞ, ÇAM/MAÇ, KIŞ/ŞIK…) ilk bölümlerde kullanılmadı |
| Sesler | Kayıtlı ses dosyaları | Tarayıcıda anlık üretilen, dosyasız sesler |

## 3. WOW'da gözlenmediği için bu projenin verdiği kararlar

Aşağıdakiler WOW'da **görülmedi**. Oyunun eksiksiz çalışması için mantıklı bir varsayılan seçildi. Hepsi kolayca değiştirilebilir:

- **Hediye kutusunun içeriği:** +100 elmas (`GIFT_GEMS`, `src/game.js`).
- **Durak kartı:** Durak bitince kartın gösterildiği bir pencere ve "Kartlarım" koleksiyonu (WOW'da profil simgesinin içeriği bilinmiyor).
- **Karıştırma eğitimi:** 5. bölümde kısa bir açıklama.
- **Geri sürükleme:** Parmağı önceki harfe geri götürünce son harf bırakılır.
- **Tekrar girilen kelime:** Bulmacadaki yeri kısa bir süre parlar.
- **İpucuyla tamamlanan kelime:** Bütün harfleri ipucuyla açılan kelime bulunmuş sayılır.
- **Klavye desteği:** Bilgisayarda yazarak oynama.
- **Titreşim ayarı** ve **ilerlemeyi sıfırlama** (onaylı).
- **32. bölümden sonra:** "Bütün durakları gezdin!" ekranı ve "Baştan oyna".

## 4. Bu sürümde olmayanlar

| Özellik | Neden yok? |
|---|---|
| Bonus kelime | Lisansı uygun bir Türkçe sözlük listesi henüz seçilmedi. WOW'da da bu özellik gözlenmedi |
| Mavi "W" jetonu | WOW'da ne işe yaradığı anlaşılamadı |
| Reklam ve uygulama içi satın alma | Mağaza hesabı, gizlilik onayı ve test süreci gerektirir |
| Günlük bulmaca / görevler | WOW'un ilk bölümlerinde görülmedi |
| Arka plan müziği | WOW kaydında duyulmadı |
| Android uygulaması (APK) | Sonraki aşama; şu an tarayıcıda çalışan tek dosya |

## 5. Bölüm listesi

| Bölüm | Durak | Harfler | Kelimeler |
|---|---|---|---|
| 1 | Kapadokya | K O Y | KOY, YOK |
| 2 | Kapadokya | Y A T | YAT, TAY |
| 3 | Kapadokya | S A P | SAP, PAS |
| 4 | Kapadokya | K A Y A | KAYA, YAKA, AYA |
| 5 | Efes Antik Kenti | K U R T | KURT, KUR, TUR |
| 6 | Efes Antik Kenti | D A M A | DAMA, DAM, ADA |
| 7 | Efes Antik Kenti | K U L E | KULE, KUL, KEL |
| 8 | Efes Antik Kenti | S A R I | SARI, ASIR, ARI, SIR |
| 9 | Ayasofya | B A L I K | BALIK, AKIL, BAL, KIL |
| 10 | Ayasofya | S A R A Y | SARAY, YARA, ARA, YAS, RAY |
| 11 | Ayasofya | G Ü N E Ş | GÜNEŞ, GÜN, ŞEN, GEN |
| 12 | Ayasofya | K İ T A P | KİTAP, TAKİP, KAT, KAP, TİP |
| 13 | Pamukkale | P A M U K | PAMUK, PUMA, KUM, KAP |
| 14 | Pamukkale | K A L E M | KALEM, KALE, ELMA, MAL, KEL |
| 15 | Pamukkale | D A M L A | DAMLA, ADAM, LAMA, DAL, DAM |
| 16 | Pamukkale | O R M A N | ORMAN, ROMAN, MOR, NAR |
| 17 | Nemrut Dağı | D U V A R | DUVAR, VAR, DUA, DAR |
| 18 | Nemrut Dağı | A S L A N | ASLAN, SANAL, ALAN, NAL, SAL, ANA |
| 19 | Nemrut Dağı | Y A Z I K | YAZIK, YAZI, KAZI, AZIK, KIZ, KAZ |
| 20 | Nemrut Dağı | K A R T A L | KARTAL, TARLA, KART, KAR, KAT, ATA |
| 21 | Galata Kulesi | M A R T I | MARTI, MART, TAM, ARI |
| 22 | Galata Kulesi | T A V A N | TAVAN, VATAN, ANT, TAN, ANA |
| 23 | Galata Kulesi | Ş A R K I | ŞARKI, KIŞ, ŞIK, KIR, KAR, AŞK |
| 24 | Galata Kulesi | K A P T A N | KAPTAN, KANAT, KAPAN, KAN, KAP, TAN |
| 25 | Sümela Manastırı | T O P R A K | TOPRAK, ORTA, ROTA, ORAK, PARK, TOP |
| 26 | Sümela Manastırı | K A R D E Ş | KARDEŞ, KADER, KAŞ, AŞK, DAR, KAR |
| 27 | Sümela Manastırı | K A Y N A K | KAYNAK, AYAK, KAYA, YAKA, KAN, YAN |
| 28 | Sümela Manastırı | Y A P R A K | YAPRAK, PARK, YARA, PAY, RAY, ARK |
| 29 | Göbeklitepe | Y I L A N | YILAN, ALIN, ANI, NAL, YAN |
| 30 | Göbeklitepe | A K R E P | AKREP, KREP, PEK, KAR, ARK |
| 31 | Göbeklitepe | T A Ş K I N | TAŞKIN, TANIK, AKIN, KATI, TAŞ, KIŞ |
| 32 | Göbeklitepe | T A P I N A K | TAPINAK, KANAT, KAPAN, KAPI, TAKI, KITA |

**Not:** Kelimeler yaygın Türkçe kelimelerden seçildi. Bir sözlükle otomatik doğrulama **yapılmadı**. Yayından önce bir kez TDK sözlüğünden elle kontrol edilmesi önerilir.

## 6. Bilinen sınırlamalar ve sonraki adımlar

1. **Yazı tipleri** (Baloo 2, Nunito) Google Fonts'tan yüklenir. İnternet yoksa telefonun kendi yazı tipi kullanılır, oyun yine çalışır.
2. **Android uygulaması:** Tek dosyalık web oyunu bir Android paketine dönüştürülebilir. Hangi aracın (ör. Capacitor veya Trusted Web Activity) en uygun olduğu sonraki aşamada araştırılmalı.
3. **"Kelime Avı" adı:** Mağazalarda bu adı kısmen içeren başka oyunlar var (ör. "Gizli Kelime - Kelime Avı"). Google Play'e yüklemeden önce ad çakışması kontrol edilmeli.
4. **Daha fazla bölüm:** Araç (`tools/generate-levels.mjs`) yeni bölümleri otomatik yerleştirir. Yeni bölümler için yalnızca kelime listesi yazmak yeterli.
5. **Gerçek cihaz testi:** Otomatik testler Chromium'da yapıldı (390×844, 360×640 ve 1280×800). iPhone Safari ve farklı Android telefonlarda elle denenmeli.
