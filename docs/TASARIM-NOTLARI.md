# Kelime Avı: Anadolu Yolculuğu – Tasarım Notları (sürüm 0.3)

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
| İlerleme çubukları | 8 bölümlük hediye çubuğu + durak çubuğu (kart resmiyle). WOW'un ilk durağı 4 bölümdü; Kelime Avı'nda her durak 20 bölüm |
| Övgü bandı | Son kelimede "GÜZEL / SÜPER / HARİKA / MÜKEMMEL" |
| Sesler | Harf seçme, doğru/yanlış kelime, ipucu ve bölüm sonu efektleri; sürekli müzik yok (WOW kaydında da duyulmadı) |
| Kayıt | Uygulama kapanıp açılınca kalınan yerden devam |

## 2. Bilerek farklı yapılanlar (özgünlük için)

| Konu | WOW | Kelime Avı |
|---|---|---|
| Ad ve logo | Words of Wonders | "Kelime Avı: Anadolu Yolculuğu"; "KELİME" harf karoları + büyüteçli "AVI" + alt başlık şeridi. Simge: "K" karosu ve büyüteç |
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
- **Son bölümden sonra:** "Bütün durakları gezdin!" ekranı ve "Baştan oyna".
- **Seviyeler:** 12 durak 4 seviyeye ayrıldı (Çırak, Kalfa, Usta, Üstat). Her seviye sonunda +250 elmas.
- **Günlük ödül:** Her gün ilk girişte 20, 30, 40, 50, 60, 80, 150 elmas (üst üste 1.–7. gün; gün atlanırsa baştan). İlk 3 bölümde gösterilmez.
- **Hediyeyi ikiye katlama:** Reklam hazırsa hediye kutusunda "Reklam izle, 2 katını al" düğmesi çıkar.
- **Bonus kelime:** Bulmacada yeri olmayan ama sözlükte bulunan kelime +5 elmas verir (bölüm başına her kelime bir kez).
- **Bölüm numarası:** Oyun ekranının üstünde yazar.
- **Android geri tuşu:** Açık pencereyi kapatır, oyundayken ana sayfaya döner, ana sayfadayken uygulamayı arka plana alır.

## 4. Bu sürümde olmayanlar

| Özellik | Neden yok? |
|---|---|
| Mavi "W" jetonu | WOW'da ne işe yaradığı anlaşılamadı |
| Uygulama içi satın alma | Mağaza hesabı, vergi/ödeme ayarları ve test süreci gerektirir |
| Günlük bulmaca / görevler | Öneri olarak sunuldu; henüz yapılmadı |
| Arka plan müziği | WOW kaydında duyulmadı |
| Gerçek reklamlar | Altyapı hazır; şu an Google'ın deneme reklamları çıkıyor. Bkz. [`PLAY-STORE-REHBERI.md`](PLAY-STORE-REHBERI.md) |

## 5. Bölüm listesi (ana kelimeler)

Her bölümün tüm kelimeleri `tools/level-source.mjs` dosyasındadır. Aşağıda her bölümün ana (en uzun) kelimesi var.

| Bölümler | Seviye | Durak | Ana kelimeler |
|---|---|---|---|
| 1–20 | Çırak | Kapadokya (Nevşehir) | KOY, YAT, SAP, KAYA, KURT, DAMA, KULE, SARI, YENİ, AYNI, PARA, SAAT, ESKİ, TANE, FARK, AÇIK, GENÇ, TERK, HATA, ASIL |
| 21–40 | Çırak | Efes Antik Kenti (İzmir) | FİLM, FENA, DEFA, SERT, AŞIK, KRAL, PARK, KARA, AĞIR, İKNA, KALP, ADİL, IŞIK, AYRI, ORTA, AKIL, KİLO, İNŞA, ÜLKE, TREN |
| 41–60 | Çırak | Ayasofya (İstanbul) | EKİP, AKSİ, DERT, KANI, YARA, KATI, HALK, AĞAÇ, YAZI, KART, MASA, TARZ, BALIK, SARAY, GÜNEŞ, KİTAP, PAMUK, KALEM, DAMLA, ORMAN |
| 61–80 | Kalfa | Pamukkale (Denizli) | DUVAR, ASLAN, YAZIK, MARTI, TAVAN, ŞARKI, YILAN, AKREP, HAYIR, TAMAM, ZAMAN, ARTIK, BAŞKA, BAYAN, SELAM, KİMSE, HAZIR, KADIN, KABUL, YARIN |
| 81–100 | Kalfa | Nemrut Dağı (Adıyaman) | HAFTA, YALAN, İNSAN, MERAK, POLİS, AKŞAM, SAKİN, KARAR, SABAH, YETER, DÜNYA, ANCAK, KOLAY, SAHİP, YAKIN, GARİP, HAYAL, RAHAT, HAYAT, KESİN |
| 101–120 | Kalfa | Galata Kulesi (İstanbul) | GELİR, ZARAR, GİZLİ, BEYAZ, ÇIKAR, HASTA, YEMİN, SICAK, NEFES, BASİT, KÖPEK, KAYIP, SAYIN, CANLI, KARTAL, KAPTAN, TOPRAK, KARDEŞ, KAYNAK, YAPRAK |
| 121–140 | Usta | Sümela Manastırı (Trabzon) | TAŞKIN, LÜTFEN, YARDIM, HARİKA, TEKRAR, YANLIŞ, DOKTOR, DIŞARI, YALNIZ, NEFRET, SANİYE, ÇEVİRİ, YÜKSEK, TAHMİN, BERBAT, BAŞKAN, NORMAL, PARDON, MİLLET, YUKARI |
| 141–160 | Usta | Göbeklitepe (Şanlıurfa) | PATRON, DÜRÜST, TEKLİF, TESLİM, KELİME, ZENGİN, DESTEK, KUTSAL, HAYVAN, KAPALI, PARMAK, HAMİLE, TEDAVİ, DÜZGÜN, YARGIÇ, AVUKAT, SAĞLAM, İTİRAF, HİZMET, FIRSAT |
| 161–180 | Usta | Truva (Çanakkale) | İŞARET, İHANET, SAĞLIK, YILLIK, DÜŞMAN, ŞİRKET, KURŞUN, PARLAK, YANGIN, SOSYAL, KAMERA, TESPİT, TEKNİK, FUTBOL, TAPINAK, MERHABA, KONTROL, HAREKET, SÜREKLİ, TELEFON |
| 181–200 | Üstat | Bodrum Kalesi (Muğla) | KORKUNÇ, ARKADAŞ, YETERLİ, SEVGİLİ, ANLAŞMA, SERBEST, KİŞİSEL, YÜZBAŞI, GEREKLİ, YARAMAZ, DEĞERLİ, ZİYARET, YABANCI, EVLİLİK, SALDIRI, SORUMLU, KOCAMAN, İHTİYAÇ, TAVSİYE, HAYALET |
| 201–220 | Üstat | Safranbolu Evleri (Karabük) | SAVUNMA, NİHAYET, MAHKEME, BİNBAŞI, PRENSES, KARIŞIK, GÖSTERİ, SEVİMLİ, CESARET, MÜSAADE, KRALİÇE, HEYECAN, ANAHTAR, ÖĞRENCİ, SEYAHAT, FEDERAL, HEMŞİRE, YUMURTA, GEÇERLİ, SİPARİŞ |
| 221–240 | Üstat | İshak Paşa Sarayı (Ağrı) | TEHLİKE, RANDEVU, YUMUŞAK, KOMUTAN, KOMİSER, TAHLİYE, UFAKLIK, DOKTORA, HASTANE, NÜKLEER, TANIDIK, MÜŞTERİ, İNTİKAM, SEÇENEK, GARANTİ, OYUNCAK, PATATES, SİGORTA, FIRTINA, SENATÖR |


**Kelimeler nasıl seçildi?** Bir kelimenin bulmacaya girmesi için (1) Zemberek sözlüğünde madde başı olması, (2) film altyazılarından çıkarılmış sıklık listesinde yeterince sık geçmesi ve (3) elle tutulan "gösterme" listesinde olmaması gerekir. Kaba sözler hiçbir yerde kabul edilmez. Çekimli biçimler (ör. "evler"), özel adlar ve çocuklara uygun olmayan ya da hassas konular bulmacada gösterilmez.

**Dürüst not:** Liste bir kez gözle tarandı, ama 775 farklı kelimenin tek tek TDK sözlüğünden kontrolü **yapılmadı**. Sıklık listesi film altyazılarından geldiği için günlük konuşma dilini yansıtır. Yayından önce bir insanın listeyi baştan sona okuması önerilir.

## 6. Bilinen sınırlamalar ve sonraki adımlar

1. **Gerçek telefon testi:** Uygulama otomatik olarak bir Android emülatöründe açılıp deneniyor, ama gerçek telefonlarda elle denenmedi.
2. **Reklam kütüphanesi sürümü:** Derleme, bilinen çalışan bir sürüme (`play-services-ads 24.4.0`) sabitlendi. Yayından önce Google'ın sürüm notlarına bakıp güncel sürüme çıkarılmalı.
3. **"Kelime Avı" adı:** Mağazalarda bu adı içeren başka oyunlar var. Bkz. Play Store rehberi, bölüm 5.
4. **Kod küçültme (R8) kapalı:** APK gereğinden büyük. Yayından önce açılıp denenmeli.
5. **iPhone:** Yalnızca tarayıcı sürümü var.
