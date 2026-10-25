// Kelime Avı – bölümlerin kaynak verisi.
// Her bölüm: çemberdeki harfler + ızgaraya yerleşecek kelimeler.
// İlk kelime ızgaraya ilk (yatay) yerleştirilir; eğitim bölümünde hedef kelime odur.
// Kelimeler büyük harfle ve Türkçe kurallara göre yazılır (ı → I, i → İ).
// Yerleşim (satır/sütun/yön) tools/generate-levels.mjs tarafından otomatik hesaplanır.

export const LOCATIONS = [
  { id: 'kapadokya', name: 'Kapadokya', city: 'Nevşehir' },
  { id: 'efes', name: 'Efes Antik Kenti', city: 'İzmir' },
  { id: 'ayasofya', name: 'Ayasofya', city: 'İstanbul' },
  { id: 'pamukkale', name: 'Pamukkale', city: 'Denizli' },
  { id: 'nemrut', name: 'Nemrut Dağı', city: 'Adıyaman' },
  { id: 'galata', name: 'Galata Kulesi', city: 'İstanbul' },
  { id: 'sumela', name: 'Sümela Manastırı', city: 'Trabzon' },
  { id: 'gobeklitepe', name: 'Göbeklitepe', city: 'Şanlıurfa' },
];

// Her durakta 4 bölüm var (Words of Wonders'ın ilk durağında gözlendiği gibi).
export const LEVELS_PER_LOCATION = 4;

export const LEVEL_SOURCE = [
  // 1) Kapadokya – 3 harf, 2 kelime (ilk bölüm eğitim)
  { letters: 'KOY', words: ['KOY', 'YOK'] },
  { letters: 'YAT', words: ['YAT', 'TAY'] },
  { letters: 'SAP', words: ['SAP', 'PAS'] },
  { letters: 'KAYA', words: ['KAYA', 'YAKA', 'AYA'] },

  // 2) Efes – 4 harf
  { letters: 'KURT', words: ['KURT', 'KUR', 'TUR'] },
  { letters: 'DAMA', words: ['DAMA', 'DAM', 'ADA'] },
  { letters: 'KULE', words: ['KULE', 'KUL', 'KEL'] },
  { letters: 'SARI', words: ['SARI', 'ASIR', 'ARI', 'SIR'] },

  // 3) Ayasofya – 5 harf
  { letters: 'BALIK', words: ['BALIK', 'AKIL', 'BAL', 'KIL'] },
  { letters: 'SARAY', words: ['SARAY', 'YARA', 'ARA', 'YAS', 'RAY'] },
  { letters: 'GÜNEŞ', words: ['GÜNEŞ', 'GÜN', 'ŞEN', 'GEN'] },
  { letters: 'KİTAP', words: ['KİTAP', 'TAKİP', 'KAT', 'KAP', 'TİP'] },

  // 4) Pamukkale – 5 harf
  { letters: 'PAMUK', words: ['PAMUK', 'PUMA', 'KUM', 'KAP'] },
  { letters: 'KALEM', words: ['KALEM', 'KALE', 'ELMA', 'MAL', 'KEL'] },
  { letters: 'DAMLA', words: ['DAMLA', 'ADAM', 'LAMA', 'DAL', 'DAM'] },
  { letters: 'ORMAN', words: ['ORMAN', 'ROMAN', 'MOR', 'NAR'] },

  // 5) Nemrut Dağı – 5-6 harf
  { letters: 'DUVAR', words: ['DUVAR', 'VAR', 'DUA', 'DAR'] },
  { letters: 'ASLAN', words: ['ASLAN', 'SANAL', 'ALAN', 'NAL', 'SAL', 'ANA'] },
  { letters: 'YAZIK', words: ['YAZIK', 'YAZI', 'KAZI', 'AZIK', 'KIZ', 'KAZ'] },
  { letters: 'KARTAL', words: ['KARTAL', 'TARLA', 'KART', 'KAR', 'KAT', 'ATA'] },

  // 6) Galata Kulesi – 5-6 harf
  { letters: 'MARTI', words: ['MARTI', 'MART', 'TAM', 'ARI'] },
  { letters: 'TAVAN', words: ['TAVAN', 'VATAN', 'ANT', 'TAN', 'ANA'] },
  { letters: 'ŞARKI', words: ['ŞARKI', 'KIŞ', 'ŞIK', 'KIR', 'KAR', 'AŞK'] },
  { letters: 'KAPTAN', words: ['KAPTAN', 'KANAT', 'KAPAN', 'KAN', 'KAP', 'TAN'] },

  // 7) Sümela Manastırı – 6 harf
  { letters: 'TOPRAK', words: ['TOPRAK', 'ORTA', 'ROTA', 'ORAK', 'PARK', 'TOP'] },
  { letters: 'KARDEŞ', words: ['KARDEŞ', 'KADER', 'KAŞ', 'AŞK', 'DAR', 'KAR'] },
  { letters: 'KAYNAK', words: ['KAYNAK', 'AYAK', 'KAYA', 'YAKA', 'KAN', 'YAN'] },
  { letters: 'YAPRAK', words: ['YAPRAK', 'PARK', 'YARA', 'PAY', 'RAY', 'ARK'] },

  // 8) Göbeklitepe – 5-7 harf
  { letters: 'YILAN', words: ['YILAN', 'ALIN', 'ANI', 'NAL', 'YAN'] },
  { letters: 'AKREP', words: ['AKREP', 'KREP', 'PEK', 'KAR', 'ARK'] },
  { letters: 'TAŞKIN', words: ['TAŞKIN', 'TANIK', 'AKIN', 'KATI', 'TAŞ', 'KIŞ'] },
  { letters: 'TAPINAK', words: ['TAPINAK', 'KANAT', 'KAPAN', 'KAPI', 'TAKI', 'KITA'] },
];
