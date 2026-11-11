// Kelime Avı – bölüm ayarları: duraklar, seviyeler, zorluk planı ve kelime süzgeçleri.

export const LEVELS_PER_LOCATION = 20;

export const LOCATIONS = [
  { id: 'kapadokya', name: 'Kapadokya', city: 'Nevşehir' },
  { id: 'efes', name: 'Efes Antik Kenti', city: 'İzmir' },
  { id: 'ayasofya', name: 'Ayasofya', city: 'İstanbul' },
  { id: 'pamukkale', name: 'Pamukkale', city: 'Denizli' },
  { id: 'nemrut', name: 'Nemrut Dağı', city: 'Adıyaman' },
  { id: 'galata', name: 'Galata Kulesi', city: 'İstanbul' },
  { id: 'sumela', name: 'Sümela Manastırı', city: 'Trabzon' },
  { id: 'gobeklitepe', name: 'Göbeklitepe', city: 'Şanlıurfa' },
  { id: 'truva', name: 'Truva', city: 'Çanakkale' },
  { id: 'bodrum', name: 'Bodrum Kalesi', city: 'Muğla' },
  { id: 'safranbolu', name: 'Safranbolu Evleri', city: 'Karabük' },
  { id: 'ishakpasa', name: 'İshak Paşa Sarayı', city: 'Ağrı' },
];

// Seviyeler: her seviye 3 durak (60 bölüm) içerir.
export const TIERS = [
  { id: 'cirak', name: 'Çırak', desc: '3–4 harfli kelimeler', locs: [0, 1, 2] },
  { id: 'kalfa', name: 'Kalfa', desc: '5 harfli kelimeler', locs: [3, 4, 5] },
  { id: 'usta', name: 'Usta', desc: '6 harfli kelimeler', locs: [6, 7, 8] },
  { id: 'ustat', name: 'Üstat', desc: '7 harfli kelimeler', locs: [9, 10, 11] },
];

// Her bölümün harf sayısı (durak başına 20 bölüm)
const rep = (n, k) => Array(k).fill(n);
export const LENGTH_PLAN = [
  ...rep(3, 3), ...rep(4, 17),            // Kapadokya
  ...rep(4, 20),                          // Efes
  ...rep(4, 12), ...rep(5, 8),            // Ayasofya
  ...rep(5, 20),                          // Pamukkale
  ...rep(5, 20),                          // Nemrut
  ...rep(5, 14), ...rep(6, 6),            // Galata
  ...rep(6, 20),                          // Sümela
  ...rep(6, 20),                          // Göbeklitepe
  ...rep(6, 14), ...rep(7, 6),            // Truva
  ...rep(7, 20),                          // Bodrum
  ...rep(7, 20),                          // Safranbolu
  ...rep(7, 20),                          // İshak Paşa
];

// Elle yazılmış, sırası korunan bölümler (ilk sürümden)
export const PINNED = [
  { letters: 'KOY', words: ['KOY', 'YOK'] },
  { letters: 'YAT', words: ['YAT', 'TAY'] },
  { letters: 'SAP', words: ['SAP', 'PAS'] },
  { letters: 'KAYA', words: ['KAYA', 'YAKA', 'AYA'] },
  { letters: 'KURT', words: ['KURT', 'KUR', 'TUR'] },
  { letters: 'DAMA', words: ['DAMA', 'DAM', 'ADA'] },
  { letters: 'KULE', words: ['KULE', 'KUL', 'KEL'] },
  { letters: 'SARI', words: ['SARI', 'ASIR', 'ARI', 'SIR'] },
  { letters: 'BALIK', words: ['BALIK', 'AKIL', 'BAL', 'KIL'] },
  { letters: 'SARAY', words: ['SARAY', 'YARA', 'ARA', 'YAS', 'RAY'] },
  { letters: 'GÜNEŞ', words: ['GÜNEŞ', 'GÜN', 'ŞEN', 'GEN'] },
  { letters: 'KİTAP', words: ['KİTAP', 'TAKİP', 'KAT', 'KAP', 'TİP'] },
  { letters: 'PAMUK', words: ['PAMUK', 'PUMA', 'KUM', 'KAP'] },
  { letters: 'KALEM', words: ['KALEM', 'KALE', 'ELMA', 'MAL', 'KEL'] },
  { letters: 'DAMLA', words: ['DAMLA', 'ADAM', 'LAMA', 'DAL', 'DAM'] },
  { letters: 'ORMAN', words: ['ORMAN', 'ROMAN', 'MOR', 'NAR'] },
  { letters: 'DUVAR', words: ['DUVAR', 'VAR', 'DUA', 'DAR'] },
  { letters: 'ASLAN', words: ['ASLAN', 'SANAL', 'ALAN', 'NAL', 'SAL', 'ANA'] },
  { letters: 'YAZIK', words: ['YAZIK', 'YAZI', 'KAZI', 'AZIK', 'KIZ', 'KAZ'] },
  { letters: 'MARTI', words: ['MARTI', 'MART', 'TAM', 'ARI'] },
  { letters: 'TAVAN', words: ['TAVAN', 'VATAN', 'ANT', 'TAN', 'ANA'] },
  { letters: 'ŞARKI', words: ['ŞARKI', 'KIŞ', 'ŞIK', 'KIR', 'KAR', 'AŞK'] },
  { letters: 'YILAN', words: ['YILAN', 'ALIN', 'ANI', 'NAL', 'YAN'] },
  { letters: 'AKREP', words: ['AKREP', 'KREP', 'PEK', 'KAR', 'ARK'] },
  { letters: 'KARTAL', words: ['KARTAL', 'TARLA', 'KART', 'KAR', 'KAT', 'ATA'] },
  { letters: 'KAPTAN', words: ['KAPTAN', 'KANAT', 'KAPAN', 'KAN', 'KAP', 'TAN'] },
  { letters: 'TOPRAK', words: ['TOPRAK', 'ORTA', 'ROTA', 'ORAK', 'PARK', 'TOP'] },
  { letters: 'KARDEŞ', words: ['KARDEŞ', 'KADER', 'KAŞ', 'AŞK', 'DAR', 'KAR'] },
  { letters: 'KAYNAK', words: ['KAYNAK', 'AYAK', 'KAYA', 'YAKA', 'KAN', 'YAN'] },
  { letters: 'YAPRAK', words: ['YAPRAK', 'PARK', 'YARA', 'PAY', 'RAY', 'ARK'] },
  { letters: 'TAŞKIN', words: ['TAŞKIN', 'TANIK', 'AKIN', 'KATI', 'TAŞ', 'KIŞ'] },
  { letters: 'TAPINAK', words: ['TAPINAK', 'KANAT', 'KAPAN', 'KAPI', 'TAKI', 'KITA'] },
];

// Hiçbir yerde kabul edilmeyen kelimeler (kaba/argo)
export const BAN = [
  'SİK', 'SİKİ', 'SİKİŞ', 'SİKME', 'GÖT', 'GÖTÜ', 'BOK', 'OROSPU', 'İBNE', 'AMCIK', 'AMINA', 'YARAK', 'TAŞAK', 'PİÇ',
  'PUŞT', 'KAHPE', 'KALTAK', 'GAVAT', 'PEZEVENK', 'SÜRTÜK', 'ÇÜK', 'YAVŞAK', 'DALYARAK', 'SIÇ', 'OSUR', 'FAHİŞE', 'KERHANE', 'PORNO',
];

// Bulmacada gösterilmeyen ama bonus olarak kabul edilen kelimeler
// (çekimli biçimler, özel adlar, az bilinenler, çocuklara uygun olmayan ya da hassas konular)
export const GRID_AVOID = [
  'ADEM', 'ADINA', 'AKAR', 'ALA', 'ALIM', 'ALİ', 'AMMA', 'AMİN', 'ANAL', 'ANCA', 'ANINDA', 'ANMA', 'ARAP', 'ARDA',
  'ASIK', 'ASGARİ', 'AŞAR', 'AZI', 'BAN', 'BARA', 'BAZ', 'BAĞI', 'BETA', 'BOM', 'CESET', 'DENLİ', 'DİMİ', 'DİNE',
  'EDER', 'ELDE', 'ELİM', 'EMME', 'ENAYİ', 'ENDER', 'EREN', 'GALE', 'GELEN', 'GEÇER', 'GİNE', 'HAD', 'HALT', 'HARA',
  'HARE', 'HART', 'HAV', 'HEBA', 'HIYAR', 'HİT', 'İNME', 'İNÇ', 'İNİ', 'İSE', 'KAKA', 'KALA', 'KANA', 'KAY',
  'KEZ', 'KIÇ', 'KOÇU', 'KONT', 'KİP', 'KİT', 'MALA', 'MEME', 'MEN', 'METAN', 'MİNE', 'MURAT', 'NAN', 'NATO',
  'NİCE', 'OLUR', 'ONCA', 'ONUR', 'PAT', 'POS', 'RAM', 'ROM', 'SAM', 'SAN', 'SARA', 'SEK', 'SENT', 'SIK',
  'SİM', 'SİN', 'SONDA', 'TALK', 'TEKE', 'TIR', 'TİK', 'TİM', 'TROL', 'ULU', 'UĞUR', 'VAZ', 'YAĞI', 'YAZMA',
  'YERİNE', 'ÇAK', 'ÇEKER', 'ÇEKİ', 'ÜSTE', 'KAST', 'SALT', 'STAR', 'ORAL', 'AYİN', 'VAAZ', 'KABİR', 'HAÇ', 'CİN',
  'DİN', 'KİLİSE', 'TANRI', 'LANET', 'DAYAK', 'İMHA', 'SARHOŞ', 'BİRA', 'PURO', 'SİGARA', 'İNTİHAR', 'TECAVÜZ', 'CİNAYET', 'SEKS',
  'PİSLİK', 'EZİK', 'KARI', 'BAKİR', 'HOR', 'AĞI', 'ARİ', 'ADİ', 'BAS', 'DEK', 'FİT', 'GENE', 'OTO', 'BARİ',
  'SORUM', 'YAZIN', 'İSTER', 'KERE', 'ALIŞ', 'ZENCİ', 'ŞİMDİ', 'BÖYLE', 'OLMAZ', 'GEÇEN', 'NEREDE', 'İÇİNDE', 'BİRKAÇ', 'AYRICA',
  'GALİBA', 'CİDDEN', 'ÜSTÜNE', 'BİRÇOK', 'AFERİN', 'BAYAĞI', 'GELENİ', 'ASLINDA', 'SONUNDA', 'TAMAMEN', 'OLDUKÇA', 'YANINDA', 'YAKINDA', 'YERİNDE',
  'DÜNYADA', 'GENELDE', 'ELİNDEN', 'DOĞRUSU', 'ÜSTELİK', 'MUTLAKA', 'BENİMKİ', 'ADAMI', 'AÇAR', 'AYNEN', 'BANK', 'BUNAK', 'CİNSEL', 'DANE',
  'DERKEN', 'EDNA', 'ETMEN', 'GERÇİ', 'GÜM', 'GÜNÜ', 'HAYLİ', 'HELE', 'KEŞ', 'KÜT', 'LEŞ', 'MANİ', 'MARTİN', 'MİKA',
  'MİKRO', 'MİRA', 'NEYSE', 'RESMEN', 'REŞİT', 'SAKİ', 'SIRF', 'SÖR', 'SİNE', 'UYUR', 'ÇAR', 'İKEN', 'İLERDE', 'İŞTE',
  'ŞÖYLE', 'HANGİ', 'HATTA', 'BAZEN', 'İŞKENCE', 'IRK', 'KURBAN', 'ÇIPLAK', 'BİLİNEN', 'BİNİ', 'FRANK', 'GINA', 'KATİL', 'OYSA',
  'RAMAK', 'SARF', 'İÇKİ', 'PARTİ', 'TUVALET', 'ETNİK', 'FIRT', 'YANİ', 'HANİ', 'SANKİ', 'SAHİ', 'PEKİ', 'MARK', 'TABİ',
  'SERSERİ',
];

// Ana kelime (bölümün en uzun kelimesi) olarak kullanılmayanlar (bağlaç/zarf gibi sıkıcı kelimeler)
export const BASE_AVOID = [
  'DAHA', 'YANİ', 'PEKİ', 'ASLA', 'HANİ', 'SAHİ', 'ZATEN', 'FALAN', 'SIKI', 'MARK', 'HALA', 'SONRA', 'NASIL', 'BELKİ',
  'KADAR', 'BİRAZ',
];
