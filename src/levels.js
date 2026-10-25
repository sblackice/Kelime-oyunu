// Bu dosya tools/generate-levels.mjs tarafından üretildi. Elle düzenlemeyin;
// tools/level-source.mjs dosyasını değiştirip aracı yeniden çalıştırın.
const LOCATIONS = [
 {
  "id": "kapadokya",
  "name": "Kapadokya",
  "city": "Nevşehir"
 },
 {
  "id": "efes",
  "name": "Efes Antik Kenti",
  "city": "İzmir"
 },
 {
  "id": "ayasofya",
  "name": "Ayasofya",
  "city": "İstanbul"
 },
 {
  "id": "pamukkale",
  "name": "Pamukkale",
  "city": "Denizli"
 },
 {
  "id": "nemrut",
  "name": "Nemrut Dağı",
  "city": "Adıyaman"
 },
 {
  "id": "galata",
  "name": "Galata Kulesi",
  "city": "İstanbul"
 },
 {
  "id": "sumela",
  "name": "Sümela Manastırı",
  "city": "Trabzon"
 },
 {
  "id": "gobeklitepe",
  "name": "Göbeklitepe",
  "city": "Şanlıurfa"
 }
];
const LEVELS_PER_LOCATION = 4;
const LEVELS = [{"n":1,"loc":0,"letters":["K","O","Y"],"rows":3,"cols":3,"words":[{"w":"KOY","r":1,"c":0,"d":"h"},{"w":"YOK","r":0,"c":1,"d":"v"}]},{"n":2,"loc":0,"letters":["Y","A","T"],"rows":3,"cols":3,"words":[{"w":"YAT","r":2,"c":0,"d":"h"},{"w":"TAY","r":0,"c":0,"d":"v"}]},{"n":3,"loc":0,"letters":["S","A","P"],"rows":3,"cols":3,"words":[{"w":"SAP","r":1,"c":0,"d":"h"},{"w":"PAS","r":0,"c":1,"d":"v"}]},{"n":4,"loc":0,"letters":["K","A","A","Y"],"rows":3,"cols":4,"words":[{"w":"KAYA","r":2,"c":0,"d":"h"},{"w":"AYA","r":0,"c":3,"d":"v"},{"w":"YAKA","r":0,"c":0,"d":"h"}]},{"n":5,"loc":1,"letters":["U","K","T","R"],"rows":3,"cols":4,"words":[{"w":"KURT","r":0,"c":0,"d":"h"},{"w":"TUR","r":0,"c":3,"d":"v"},{"w":"KUR","r":0,"c":0,"d":"v"}]},{"n":6,"loc":1,"letters":["A","A","M","D"],"rows":3,"cols":4,"words":[{"w":"DAMA","r":0,"c":0,"d":"h"},{"w":"ADA","r":0,"c":3,"d":"v"},{"w":"DAM","r":0,"c":0,"d":"v"}]},{"n":7,"loc":1,"letters":["K","L","U","E"],"rows":3,"cols":4,"words":[{"w":"KULE","r":1,"c":0,"d":"h"},{"w":"KEL","r":0,"c":3,"d":"v"},{"w":"KUL","r":0,"c":1,"d":"v"}]},{"n":8,"loc":1,"letters":["R","S","I","A"],"rows":4,"cols":5,"words":[{"w":"SARI","r":1,"c":1,"d":"h"},{"w":"ASIR","r":0,"c":1,"d":"v"},{"w":"ARI","r":3,"c":0,"d":"h"},{"w":"SIR","r":0,"c":4,"d":"v"}]},{"n":9,"loc":2,"letters":["L","A","I","K","B"],"rows":4,"cols":5,"words":[{"w":"BALIK","r":1,"c":0,"d":"h"},{"w":"AKIL","r":0,"c":4,"d":"v"},{"w":"BAL","r":0,"c":1,"d":"v"},{"w":"KIL","r":3,"c":2,"d":"h"}]},{"n":10,"loc":2,"letters":["A","S","R","Y","A"],"rows":5,"cols":5,"words":[{"w":"SARAY","r":2,"c":0,"d":"h"},{"w":"ARA","r":0,"c":3,"d":"v"},{"w":"YARA","r":0,"c":0,"d":"h"},{"w":"RAY","r":2,"c":2,"d":"v"},{"w":"YAS","r":0,"c":0,"d":"v"}]},{"n":11,"loc":2,"letters":["Ü","G","Ş","N","E"],"rows":3,"cols":5,"words":[{"w":"GÜNEŞ","r":0,"c":0,"d":"h"},{"w":"GÜN","r":0,"c":0,"d":"v"},{"w":"ŞEN","r":0,"c":4,"d":"v"},{"w":"GEN","r":2,"c":2,"d":"h"}]},{"n":12,"loc":2,"letters":["P","T","A","İ","K"],"rows":5,"cols":5,"words":[{"w":"KİTAP","r":0,"c":0,"d":"h"},{"w":"TAKİP","r":0,"c":2,"d":"v"},{"w":"KAT","r":2,"c":2,"d":"h"},{"w":"TİP","r":4,"c":0,"d":"h"},{"w":"KAP","r":0,"c":0,"d":"v"}]},{"n":13,"loc":3,"letters":["U","K","M","P","A"],"rows":5,"cols":5,"words":[{"w":"PAMUK","r":2,"c":0,"d":"h"},{"w":"PUMA","r":0,"c":2,"d":"v"},{"w":"KUM","r":2,"c":4,"d":"v"},{"w":"KAP","r":0,"c":0,"d":"v"}]},{"n":14,"loc":3,"letters":["M","L","A","E","K"],"rows":5,"cols":6,"words":[{"w":"KALEM","r":1,"c":1,"d":"h"},{"w":"ELMA","r":0,"c":3,"d":"v"},{"w":"KALE","r":1,"c":1,"d":"v"},{"w":"MAL","r":1,"c":5,"d":"v"},{"w":"KEL","r":4,"c":0,"d":"h"}]},{"n":15,"loc":3,"letters":["D","L","A","A","M"],"rows":5,"cols":5,"words":[{"w":"DAMLA","r":2,"c":0,"d":"h"},{"w":"ADAM","r":0,"c":4,"d":"v"},{"w":"LAMA","r":0,"c":2,"d":"v"},{"w":"DAM","r":2,"c":0,"d":"v"},{"w":"DAL","r":0,"c":0,"d":"h"}]},{"n":16,"loc":3,"letters":["N","O","M","A","R"],"rows":5,"cols":5,"words":[{"w":"ORMAN","r":1,"c":0,"d":"h"},{"w":"ROMAN","r":0,"c":0,"d":"v"},{"w":"MOR","r":1,"c":2,"d":"v"},{"w":"NAR","r":1,"c":4,"d":"v"}]},{"n":17,"loc":4,"letters":["D","R","V","U","A"],"rows":5,"cols":5,"words":[{"w":"DUVAR","r":2,"c":0,"d":"h"},{"w":"DAR","r":0,"c":4,"d":"v"},{"w":"DUA","r":2,"c":0,"d":"v"},{"w":"VAR","r":2,"c":2,"d":"v"}]},{"n":18,"loc":4,"letters":["N","L","A","S","A"],"rows":5,"cols":5,"words":[{"w":"ASLAN","r":4,"c":0,"d":"h"},{"w":"SANAL","r":0,"c":2,"d":"v"},{"w":"ALAN","r":1,"c":4,"d":"v"},{"w":"NAL","r":2,"c":2,"d":"h"},{"w":"ANA","r":1,"c":0,"d":"h"},{"w":"SAL","r":0,"c":0,"d":"v"}]},{"n":19,"loc":4,"letters":["I","Y","K","Z","A"],"rows":5,"cols":6,"words":[{"w":"YAZIK","r":1,"c":1,"d":"h"},{"w":"AZIK","r":0,"c":3,"d":"v"},{"w":"KAZI","r":1,"c":5,"d":"v"},{"w":"YAZI","r":1,"c":1,"d":"v"},{"w":"KIZ","r":4,"c":0,"d":"h"},{"w":"KAZ","r":3,"c":3,"d":"h"}]},{"n":20,"loc":4,"letters":["T","A","R","A","K","L"],"rows":6,"cols":6,"words":[{"w":"KARTAL","r":3,"c":0,"d":"h"},{"w":"TARLA","r":0,"c":5,"d":"v"},{"w":"KART","r":0,"c":3,"d":"v"},{"w":"KAT","r":0,"c":3,"d":"h"},{"w":"KAR","r":3,"c":0,"d":"v"},{"w":"ATA","r":1,"c":1,"d":"v"}]},{"n":21,"loc":5,"letters":["M","I","R","A","T"],"rows":4,"cols":5,"words":[{"w":"MARTI","r":2,"c":0,"d":"h"},{"w":"MART","r":0,"c":2,"d":"v"},{"w":"TAM","r":0,"c":0,"d":"h"},{"w":"ARI","r":0,"c":4,"d":"v"}]},{"n":22,"loc":5,"letters":["T","N","V","A","A"],"rows":5,"cols":5,"words":[{"w":"TAVAN","r":0,"c":0,"d":"h"},{"w":"VATAN","r":0,"c":2,"d":"v"},{"w":"ANA","r":3,"c":2,"d":"h"},{"w":"ANT","r":2,"c":0,"d":"h"},{"w":"TAN","r":4,"c":0,"d":"h"}]},{"n":23,"loc":5,"letters":["A","Ş","R","I","K"],"rows":5,"cols":5,"words":[{"w":"ŞARKI","r":2,"c":0,"d":"h"},{"w":"KIŞ","r":1,"c":4,"d":"v"},{"w":"KAR","r":0,"c":2,"d":"v"},{"w":"AŞK","r":2,"c":1,"d":"v"},{"w":"ŞIK","r":0,"c":0,"d":"h"},{"w":"KIR","r":4,"c":1,"d":"h"}]},{"n":24,"loc":5,"letters":["N","A","A","K","P","T"],"rows":5,"cols":7,"words":[{"w":"KAPTAN","r":1,"c":0,"d":"h"},{"w":"KAPAN","r":0,"c":1,"d":"v"},{"w":"KANAT","r":0,"c":4,"d":"v"},{"w":"KAP","r":3,"c":0,"d":"h"},{"w":"TAN","r":4,"c":4,"d":"h"},{"w":"KAN","r":2,"c":6,"d":"v"}]},{"n":25,"loc":6,"letters":["T","A","P","R","O","K"],"rows":6,"cols":6,"words":[{"w":"TOPRAK","r":3,"c":0,"d":"h"},{"w":"ORTA","r":2,"c":3,"d":"v"},{"w":"ROTA","r":1,"c":0,"d":"v"},{"w":"PARK","r":0,"c":5,"d":"v"},{"w":"ORAK","r":5,"c":1,"d":"h"},{"w":"TOP","r":0,"c":3,"d":"h"}]},{"n":26,"loc":6,"letters":["R","Ş","A","D","K","E"],"rows":6,"cols":6,"words":[{"w":"KARDEŞ","r":5,"c":0,"d":"h"},{"w":"KADER","r":1,"c":2,"d":"v"},{"w":"DAR","r":3,"c":2,"d":"h"},{"w":"AŞK","r":1,"c":0,"d":"h"},{"w":"KAŞ","r":0,"c":0,"d":"v"},{"w":"KAR","r":1,"c":4,"d":"v"}]},{"n":27,"loc":6,"letters":["N","K","Y","K","A","A"],"rows":6,"cols":6,"words":[{"w":"KAYNAK","r":2,"c":0,"d":"h"},{"w":"KAYA","r":2,"c":0,"d":"v"},{"w":"YAKA","r":2,"c":2,"d":"v"},{"w":"YAN","r":0,"c":3,"d":"v"},{"w":"AYAK","r":5,"c":0,"d":"h"},{"w":"KAN","r":2,"c":5,"d":"v"}]},{"n":28,"loc":6,"letters":["K","A","P","R","Y","A"],"rows":5,"cols":6,"words":[{"w":"YAPRAK","r":4,"c":0,"d":"h"},{"w":"PARK","r":1,"c":5,"d":"v"},{"w":"YARA","r":2,"c":2,"d":"h"},{"w":"PAY","r":2,"c":0,"d":"v"},{"w":"RAY","r":0,"c":2,"d":"v"},{"w":"ARK","r":0,"c":1,"d":"h"}]},{"n":29,"loc":7,"letters":["I","Y","L","N","A"],"rows":5,"cols":5,"words":[{"w":"YILAN","r":2,"c":0,"d":"h"},{"w":"ALIN","r":0,"c":1,"d":"v"},{"w":"YAN","r":0,"c":4,"d":"v"},{"w":"ANI","r":2,"c":3,"d":"v"},{"w":"NAL","r":0,"c":0,"d":"h"}]},{"n":30,"loc":7,"letters":["A","E","P","R","K"],"rows":5,"cols":5,"words":[{"w":"AKREP","r":2,"c":0,"d":"h"},{"w":"KREP","r":0,"c":3,"d":"v"},{"w":"KAR","r":2,"c":1,"d":"v"},{"w":"ARK","r":4,"c":0,"d":"h"},{"w":"PEK","r":0,"c":1,"d":"h"}]},{"n":31,"loc":7,"letters":["K","N","Ş","A","I","T"],"rows":6,"cols":6,"words":[{"w":"TAŞKIN","r":2,"c":0,"d":"h"},{"w":"TANIK","r":0,"c":5,"d":"v"},{"w":"TAŞ","r":0,"c":2,"d":"v"},{"w":"KATI","r":0,"c":0,"d":"h"},{"w":"AKIN","r":2,"c":1,"d":"v"},{"w":"KIŞ","r":2,"c":3,"d":"v"}]},{"n":32,"loc":7,"letters":["T","A","I","P","A","K","N"],"rows":6,"cols":7,"words":[{"w":"TAPINAK","r":3,"c":0,"d":"h"},{"w":"KANAT","r":0,"c":5,"d":"v"},{"w":"KAPAN","r":1,"c":2,"d":"h"},{"w":"TAKI","r":0,"c":3,"d":"v"},{"w":"KAPI","r":2,"c":1,"d":"v"},{"w":"KITA","r":5,"c":0,"d":"h"}]}];
