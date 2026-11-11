/* Kelime Avı – oyun mantığı.
   Bağımlılık yok. levels.js (LOCATIONS, LEVELS, LEVELS_PER_LOCATION) ve
   build sırasında eklenen SCENES (arka plan görselleri) bu dosyadan önce yüklenir. */
(function () {
  'use strict';

  // ---------- sabitler ----------
  const HINT_COST = 100;      // Words of Wonders'ta gözlenen ipucu fiyatı
  const START_GEMS = 200;     // Words of Wonders'ta gözlenen başlangıç bakiyesi
  const FREE_TUTORIAL_HINTS = 2;
  const GIFT_EVERY = 8;       // 8 bölümde bir hediye kutusu (gözlenen çubuk)
  const GIFT_GEMS = 100;      // hediyenin içeriği WOW'da görülmedi; bu oyunun kendi tercihi
  const PRAISES = ['GÜZEL', 'SÜPER', 'HARİKA', 'MÜKEMMEL'];
  const BONUS_GEMS = 5;       // bulmacada olmayan geçerli kelime (bonus kelime) ödülü
  const TIER_GEMS = 250;      // bir seviyeyi (3 durak) bitirme ödülü
  const REWARD_GEMS = 100;    // ödüllü reklam izleme ödülü (bir ipucu değerinde)
  // Reklam düzeni (yalnızca Android uygulamasında ya da ?reklam=demo ile açılır)
  const AD_FREE_LEVELS = 3;   // ilk 3 bölümde hiç reklam yok (oyuncu önce oyunu öğrensin)
  const INTER_MIN_LEVEL = 6;  // tam ekran reklam en erken 6. bölümden sonra
  const INTER_EVERY = 3;      // en sık 3 bölümde bir
  const INTER_MIN_GAP = 120e3; // iki tam ekran reklam arasında en az 2 dakika
  const STORE_KEY = 'kelime-avi:v1';
  const DAILY_GEMS = [20, 30, 40, 50, 60, 80, 150]; // günlük ödül: üst üste girilen 1.–7. gün
  const VERSION = '0.3';

  // ---------- yardımcılar ----------
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const T = (ms) => (REDUCED ? Math.min(ms, 60) : ms);
  const up = (s) => s.toLocaleUpperCase('tr-TR');
  const chars = (s) => Array.from(s);
  const sceneUrl = (id) => (window.SCENES && SCENES[id]) || '';
  const locOf = (levelNo) => Math.min(LOCATIONS.length - 1, Math.floor((levelNo - 1) / LEVELS_PER_LOCATION));
  const tierOfLoc = (loc) => Math.max(0, TIERS.findIndex((t) => t.locs.includes(loc)));

  // ---------- durum ----------
  function defaultState() {
    return { v: 1, level: 1, completed: 0, gems: START_GEMS, bonus: 0, daily: { day: '', streak: 0 }, freeHints: 0, tut: {}, cards: [], sound: true, haptics: true, cur: null, updatedAt: 0 };
  }
  function sanitize(d) {
    const s = defaultState();
    if (!d || typeof d !== 'object' || d.v !== 1) return s;
    const num = (x, def, min, max) => (Number.isFinite(x) ? Math.min(max, Math.max(min, Math.floor(x))) : def);
    s.level = num(d.level, 1, 1, LEVELS.length + 1);
    s.completed = num(d.completed, 0, 0, 1e7);
    s.gems = num(d.gems, START_GEMS, 0, 1e7);
    s.bonus = num(d.bonus, 0, 0, 1e7);
    if (d.daily && typeof d.daily.day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d.daily.day)) s.daily = { day: d.daily.day, streak: num(d.daily.streak, 1, 1, DAILY_GEMS.length) };
    s.freeHints = num(d.freeHints, 0, 0, 99);
    s.tut = d.tut && typeof d.tut === 'object' ? { ...d.tut } : {};
    s.cards = Array.isArray(d.cards) ? d.cards.filter((c) => LOCATIONS.some((l) => l.id === c)) : [];
    s.sound = d.sound !== false;
    s.haptics = d.haptics !== false;
    s.updatedAt = Number.isFinite(d.updatedAt) ? d.updatedAt : 0;
    const c = d.cur;
    if (c && c.n === s.level && Array.isArray(c.found) && Array.isArray(c.rev) && Array.isArray(c.order)) {
      const L = LEVELS[s.level - 1];
      const okOrder = L && c.order.length === L.letters.length && c.order.every((i) => Number.isInteger(i) && i >= 0 && i < L.letters.length) && new Set(c.order).size === c.order.length;
      // Bölümler güncellenmiş olabilir: kayıtlı kelimeler bu bölüme ait değilse yarım kalan bölüm baştan başlar
      const okFound = L && c.found.every((w) => L.words.some((p) => p.w === w));
      if (okOrder && okFound) {
        s.cur = {
          n: c.n,
          found: [...new Set(c.found)],
          rev: c.rev.filter((k) => typeof k === 'string' && /^\d+,\d+$/.test(k)),
          order: c.order.slice(),
          bonus: Array.isArray(c.bonus) ? [...new Set(c.bonus.filter((w) => (L.x || []).includes(w)))] : [],
        };
      }
    }
    return s;
  }
  let S = defaultState();

  // ---------- kayıt: tarayıcı + (varsa) hesaba bağlı bulut ----------
  function loadLocal() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function saveLocal() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) { /* gizli pencere vb. */ }
  }
  let cloudRef = null, cloudBusy = false, cloudAgain = false, cloudTimer = null;
  function save() {
    S.updatedAt = Date.now();
    saveLocal();
    clearTimeout(cloudTimer);
    cloudTimer = setTimeout(cloudPush, 900);
  }
  async function cloudPush() {
    if (!cloudRef) return;
    if (cloudBusy) { cloudAgain = true; return; }
    cloudBusy = true;
    try {
      await cloudRef.set({ state: JSON.parse(JSON.stringify(S)) });
    } catch (e) {
      const code = e && e.code;
      if (code && code !== 'unavailable' && code !== 'resource_exhausted') cloudRef = null;
    }
    cloudBusy = false;
    if (cloudAgain) { cloudAgain = false; cloudPush(); }
  }
  async function cloudInit() {
    try {
      const c = window.claude;
      if (!c || typeof c.use !== 'function') return;
      const [db, user] = await Promise.all([c.use('db'), c.use('user')]);
      if (!db || !user) return;
      const id = await user.id();
      if (!id) return;
      const ref = db.doc('data/users/' + id + '/progress');
      const snap = await ref.get();
      cloudRef = ref;
      const remote = snap && snap.exists ? snap.data() : null;
      const rs = remote && remote.state;
      if (rs && rs.v === 1 && (rs.updatedAt || 0) > (S.updatedAt || 0) && (screen === 'home' || screen === 'loading')) {
        S = sanitize(rs);
        saveLocal();
        if (screen === 'home') renderHome();
      } else if (!rs || (S.updatedAt || 0) > (rs.updatedAt || 0)) {
        cloudPush();
      }
    } catch (e) { cloudRef = null; }
  }

  // ---------- reklamlar ----------
  // Android uygulamasında gerçek reklamlar yerel (native) katmanda gösterilir; bu bölüm yalnızca
  // "ne zaman" gösterileceğine karar verir. Tarayıcıda adresin sonuna ?reklam=demo eklenirse
  // reklam yerleri gri kutularla gösterilir (tasarımı görmek ve otomatik test için).
  const Ads = (() => {
    const native = window.AndroidAds || null;
    let demo = false;
    try { demo = !native && /[?&]reklam=demo\b/.test(location.search); } catch (e) { /* yok say */ }
    const enabled = !!native || demo;
    let lastInter = Date.now();
    let lastInterLevel = 0;
    let waiting = null;          // tam ekran reklam kapanınca çözülecek söz (promise)
    let bannerOn = false;
    const log = [];              // test için: gösterilen reklamlar

    function settle(value) { const w = waiting; waiting = null; if (w) { clearTimeout(w.timer); w.resolve(value); } }
    function wait(ms) {
      return new Promise((resolve) => { waiting = { resolve, timer: setTimeout(() => settle(false), ms) }; });
    }
    function demoOverlay(kind) {
      return new Promise((resolve) => {
        const el = document.createElement('div');
        el.className = 'ad-full';
        el.id = 'ad-full';
        el.innerHTML = `<div class="ad-full-box"><small>REKLAM (deneme)</small><b>${kind === 'rewarded' ? 'Ödüllü video reklam' : 'Tam ekran reklam'}</b>
          <p>Gerçek uygulamada burada Google reklamı görünür.</p><button class="btn-plain" id="ad-full-close">${kind === 'rewarded' ? 'Videoyu bitir' : 'Kapat'}</button></div>`;
        document.body.appendChild(el);
        el.querySelector('#ad-full-close').addEventListener('click', () => { el.remove(); resolve(true); });
      });
    }
    function banner(show) {
      show = !!show && enabled;
      if (show === bannerOn) return;
      bannerOn = show;
      if (native) { try { native.setBanner(show); } catch (e) { /* yok say */ } }
      else if (demo) { document.documentElement.classList.toggle('ad-banner-on', show); window.dispatchEvent(new Event('resize')); }
    }
    async function interstitial(completed) {
      if (!enabled || completed < INTER_MIN_LEVEL) return false;
      if (completed - lastInterLevel < INTER_EVERY || Date.now() - lastInter < INTER_MIN_GAP) return false;
      let shown = false;
      if (native) {
        try { shown = !!native.showInterstitial(); } catch (e) { shown = false; }
        if (shown) await wait(180e3);
      } else { shown = true; await demoOverlay('interstitial'); }
      if (shown) { lastInter = Date.now(); lastInterLevel = completed; log.push('interstitial@' + completed); }
      return shown;
    }
    function rewardedReady() {
      if (demo) return true;
      try { return !!(native && native.isRewardedReady()); } catch (e) { return false; }
    }
    async function rewarded() {
      if (!enabled) return false;
      let earned = false;
      if (native) {
        let started = false;
        try { started = !!native.showRewarded(); } catch (e) { started = false; }
        if (started) earned = await wait(300e3);
      } else earned = await demoOverlay('rewarded');
      if (earned) { lastInter = Date.now(); log.push('rewarded'); }
      return !!earned;
    }
    // Android katmanı bu işlevleri çağırır
    window.__kelimeAviAds = {
      onInterstitialClosed: () => settle(true),
      onRewardedClosed: (earned) => settle(!!earned),
    };
    return {
      enabled, demo, banner, interstitial, rewarded, rewardedReady, log,
      privacyRequired: () => { try { return !!(native && native.isPrivacyOptionsRequired()); } catch (e) { return false; } },
      showPrivacy: () => { try { native && native.showPrivacyOptions(); } catch (e) { /* yok say */ } },
      testClock: (ms) => { lastInter -= ms; },
    };
  })();

  // ---------- ses (Web Audio ile üretilen, dosyasız efektler) ----------
  const Sound = (() => {
    let ctx = null, master = null;
    function ensure() {
      if (!S.sound) return null;
      try {
        if (!ctx) {
          const AC = window.AudioContext || window.webkitAudioContext;
          if (!AC) return null;
          ctx = new AC();
          master = ctx.createGain();
          master.gain.value = 0.55;
          master.connect(ctx.destination);
        }
        if (ctx.state === 'suspended') ctx.resume();
        return ctx;
      } catch (e) { return null; }
    }
    function tone(freq, start, dur, type, vol) {
      const c = ensure();
      if (!c) return;
      const t = c.currentTime + start;
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = type || 'sine';
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol || 0.2, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t + dur + 0.05);
    }
    const scale = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.5];
    return {
      unlock: () => ensure(),
      tap: (i) => tone(scale[Math.min(i, scale.length - 1)], 0, 0.13, 'triangle', 0.22),
      good: () => [659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.07, 0.24, 'triangle', 0.2)),
      bad: () => { tone(196, 0, 0.12, 'square', 0.06); tone(155.56, 0.09, 0.18, 'square', 0.06); },
      already: () => { tone(587.33, 0, 0.1, 'sine', 0.14); tone(587.33, 0.13, 0.1, 'sine', 0.14); },
      hint: () => [1318.5, 1567.98, 2093].forEach((f, i) => tone(f, i * 0.05, 0.2, 'sine', 0.13)),
      win: () => [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.11, 0.32, 'triangle', 0.18)),
      click: () => tone(880, 0, 0.06, 'sine', 0.1),
      gift: () => [783.99, 987.77, 1174.66, 1567.98].forEach((f, i) => tone(f, i * 0.09, 0.38, 'sine', 0.16)),
    };
  })();
  function buzz(ms) {
    if (!S.haptics || !navigator.vibrate) return;
    try { navigator.vibrate(ms); } catch (e) { /* desteklenmiyor */ }
  }

  // ---------- ekranlar ----------
  let screen = 'loading';
  const SCREENS = { loading: '#scr-loading', home: '#scr-home', game: '#scr-game', complete: '#scr-complete', end: '#scr-end' };
  function showScreen(name) {
    for (const [k, sel] of Object.entries(SCREENS)) {
      const el = $(sel);
      if (k === name) {
        el.hidden = false;
        requestAnimationFrame(() => el.classList.remove('out'));
      } else if (!el.hidden) {
        el.classList.add('out');
        setTimeout(() => { if (screen !== k) el.hidden = true; }, 360);
      }
    }
    screen = name;
    $('#app').classList.toggle('dim-bg', name === 'complete' || name === 'end');
    Ads.banner(name !== 'loading' && S.completed >= AD_FREE_LEVELS);
  }

  let bgFront = 'a', bgScene = '';
  function setBackground(id) {
    if (bgScene === id) return;
    bgScene = id;
    const next = bgFront === 'a' ? 'b' : 'a';
    const nEl = $('#bg-' + next), oEl = $('#bg-' + bgFront);
    nEl.style.backgroundImage = `url("${sceneUrl(id)}")`;
    nEl.style.opacity = '1';
    oEl.style.opacity = '0';
    bgFront = next;
  }

  let shownGems = START_GEMS;
  function updateGems(bump) {
    for (const el of $$('[data-gems] span')) el.textContent = String(shownGems);
    if (bump) for (const el of $$('[data-gems]')) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
  }

  let toastTimer = null;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.hidden = false;
    el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 2600);
  }

  // ---------- ana ekran ----------
  function renderHome() {
    shownGems = S.gems;
    updateGems(false);
    $('#home-count').textContent = String(S.completed);
    $('#btn-play').textContent = S.level <= LEVELS.length ? `BÖLÜM ${S.level}` : 'BAŞTAN OYNA';
    const loc = locOf(S.level);
    const tier = tierOfLoc(loc);
    const done = S.level > LEVELS.length ? LEVELS_PER_LOCATION : (S.level - 1) % LEVELS_PER_LOCATION;
    $('#home-tier-name').textContent = `SEVİYE ${tier + 1} · ${up(TIERS[tier].name)}`;
    $('#home-tier-loc').textContent = `${LOCATIONS[loc].name} · ${done}/${LEVELS_PER_LOCATION}`;
    $('#home-journey').classList.remove('zoom-out');
  }
  function showHome() {
    clearLevelTimers();
    hideTutorial();
    setBackground('kizkulesi');
    renderHome();
    showScreen('home');
    maybeDaily();
  }

  // ---------- günlük ödül ----------
  const dayStr = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const today = () => dayStr(new Date());
  // Günde bir kez, ana ekrana gelince verilir. Dün de alındıysa seri 1 artar (7'den sonra 1'e döner);
  // gün atlandıysa seri baştan başlar. İlk 3 bölümde (oyun öğrenilirken) gösterilmez.
  function maybeDaily() {
    if (S.completed < AD_FREE_LEVELS || S.daily.day === today()) return;
    const y = new Date(); y.setDate(y.getDate() - 1);
    const streak = S.daily.day === dayStr(y) ? (S.daily.streak % DAILY_GEMS.length) + 1 : 1;
    const reward = DAILY_GEMS[streak - 1];
    const before = S.gems;
    S.daily = { day: today(), streak };
    S.gems += reward;
    save();
    setTimeout(() => {
      if (screen !== 'home' || !$('#modal').hidden) { shownGems = S.gems; updateGems(false); return; }
      shownGems = before;
      updateGems(false);
      dailyModal(streak, reward).then(() => { shownGems = S.gems; updateGems(true); });
    }, T(450));
  }

  // ---------- bölüm ----------
  let L = null;                 // geçerli bölüm tanımı
  let cells = new Map();        // "r,c" -> {el, ch, words:Set, state}
  let words = [];               // [{w, keys, found}]
  let letterEls = [];           // harf indeksi -> eleman
  let centers = [];             // harf indeksi -> {x, y}
  let letterSize = 60;
  let sel = [];                 // seçili harf indeksleri
  let dragging = false, lastPt = null;
  let busy = false;
  let levelTimers = [];
  let tutMode = null;           // 'first' | 'hint' | 'shuffle' | null

  function clearLevelTimers() { levelTimers.forEach(clearTimeout); levelTimers = []; }
  function later(fn, ms) { levelTimers.push(setTimeout(fn, ms)); }

  function startLevel() {
    clearLevelTimers();
    hideTutorial();
    if (S.level > LEVELS.length) { showEnd(); return; }
    L = LEVELS[S.level - 1];
    if (!S.cur || S.cur.n !== L.n) S.cur = { n: L.n, found: [], rev: [], order: L.letters.map((_, i) => i), bonus: [] };
    if (!Array.isArray(S.cur.bonus)) S.cur.bonus = [];
    $('#lvl-label').textContent = `BÖLÜM ${L.n}`;
    if (L.n === 3 && !S.tut.hintGiven) { S.freeHints += FREE_TUTORIAL_HINTS; S.tut.hintGiven = true; }
    busy = false;
    sel = [];
    $('#scr-game').classList.remove('leaving');
    setBackground(LOCATIONS[L.loc].id);
    buildBoard();
    buildWheel();
    $('#btn-shuffle').hidden = L.n === 1;
    shownGems = S.gems;
    updateGems(false);
    updateHintBtn();
    showScreen('game');
    requestAnimationFrame(() => { layoutAll(); maybeTutorial(); });
    save();
  }

  function buildBoard() {
    const board = $('#board');
    board.innerHTML = '';
    cells = new Map();
    words = [];
    L.words.forEach((p, wi) => {
      const keys = [];
      chars(p.w).forEach((ch, k) => {
        const r = p.d === 'v' ? p.r + k : p.r;
        const c = p.d === 'h' ? p.c + k : p.c;
        const key = r + ',' + c;
        let cell = cells.get(key);
        if (!cell) {
          const el = document.createElement('div');
          el.className = 'cell';
          el.dataset.key = key;
          board.appendChild(el);
          cell = { el, ch, r, c, words: new Set(), state: 'empty' };
          cells.set(key, cell);
        }
        cell.words.add(wi);
        keys.push(key);
      });
      words.push({ w: p.w, keys, found: S.cur.found.includes(p.w) });
    });
    for (const ws of words) if (ws.found) ws.keys.forEach((k) => setCell(k, 'found'));
    for (const k of S.cur.rev) { const c = cells.get(k); if (c && c.state === 'empty') setCell(k, 'hint'); }
  }

  function setCell(key, state, anim) {
    const cell = cells.get(key);
    if (!cell) return;
    cell.state = state;
    cell.el.classList.remove('hint', 'found', 'outlined');
    if (state !== 'empty') cell.el.classList.add(state);
    cell.el.textContent = state === 'empty' ? '' : cell.ch;
    if (anim) { cell.el.classList.remove('pop'); void cell.el.offsetWidth; cell.el.classList.add('pop'); }
  }

  function layoutBoard() {
    if (!L) return;
    const wrap = $('#board-wrap');
    const cs = getComputedStyle(wrap);
    const W = wrap.clientWidth - 8;
    const H = wrap.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    const gapRatio = 0.09;
    const byW = W / (L.cols + (L.cols - 1) * gapRatio);
    const byH = H / (L.rows + (L.rows - 1) * gapRatio);
    const size = Math.max(22, Math.floor(Math.min(byW, byH, 68)));
    const gap = Math.max(3, Math.round(size * gapRatio));
    const board = $('#board');
    board.style.width = L.cols * size + (L.cols - 1) * gap + 'px';
    board.style.height = L.rows * size + (L.rows - 1) * gap + 'px';
    for (const cell of cells.values()) {
      const st = cell.el.style;
      st.width = st.height = size + 'px';
      st.left = cell.c * (size + gap) + 'px';
      st.top = cell.r * (size + gap) + 'px';
      st.fontSize = Math.round(size * 0.56) + 'px';
    }
  }

  // ---------- harf çemberi ----------
  function buildWheel() {
    const wheel = $('#wheel');
    $$('.letter', wheel).forEach((e) => e.remove());
    letterEls = L.letters.map((ch) => {
      const el = document.createElement('div');
      el.className = 'letter';
      el.textContent = ch;
      el.setAttribute('aria-hidden', 'true');
      wheel.insertBefore(el, $('#btn-shuffle'));
      return el;
    });
    clearSelection();
  }

  function layoutWheel() {
    if (!L) return;
    const stage = $('#stage');
    const D = Math.max(170, Math.floor(Math.min(stage.clientWidth * 0.8, 300, stage.clientHeight - 66)));
    $('#app').style.setProperty('--wheel', D + 'px');
    const n = L.letters.length;
    letterSize = D * (n <= 3 ? 0.3 : n === 4 ? 0.28 : n === 5 ? 0.25 : n === 6 ? 0.225 : 0.205);
    const R = D / 2 - letterSize * 0.66;
    centers = [];
    S.cur.order.forEach((letterIdx, pos) => {
      const a = -Math.PI / 2 + (pos * 2 * Math.PI) / n;
      const x = D / 2 + R * Math.cos(a);
      const y = D / 2 + R * Math.sin(a);
      centers[letterIdx] = { x, y };
      const st = letterEls[letterIdx].style;
      st.left = x + 'px';
      st.top = y + 'px';
      st.width = st.height = letterSize + 'px';
      st.fontSize = Math.round(letterSize * 0.66) + 'px';
    });
    const svg = $('#wheel-lines');
    svg.setAttribute('viewBox', `0 0 ${D} ${D}`);
    drawLines();
  }

  function layoutAll() { layoutWheel(); layoutBoard(); }

  function localPoint(e) {
    const r = $('#wheel').getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function hitLetter(pt, factor) {
    let best = -1, bestD = Infinity;
    centers.forEach((c, i) => {
      const d = Math.hypot(pt.x - c.x, pt.y - c.y);
      if (d < letterSize * factor && d < bestD) { best = i; bestD = d; }
    });
    return best;
  }
  function onSelChange() {
    letterEls.forEach((el, i) => el.classList.toggle('on', sel.includes(i)));
    const pv = $('#preview');
    pv.classList.remove('shake', 'launch');
    pv.innerHTML = sel.map((i) => `<span>${L.letters[i]}</span>`).join('');
    pv.classList.toggle('show', sel.length > 0);
    if (sel.length) { Sound.tap(sel.length - 1); buzz(8); }
  }
  function drawLines() {
    const svg = $('#wheel-lines');
    if (!sel.length) { svg.innerHTML = ''; return; }
    const pts = sel.map((i) => centers[i]).filter(Boolean);
    if (dragging && lastPt) pts.push(lastPt);
    const w = Math.max(6, letterSize * 0.17);
    svg.innerHTML = `<polyline points="${pts.map((p) => p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' ')}" fill="none" stroke="#1f4fa3" stroke-width="${w.toFixed(1)}" stroke-linecap="round" stroke-linejoin="round" opacity="0.92"/>`;
  }
  function clearSelection() {
    sel = [];
    dragging = false;
    lastPt = null;
    letterEls.forEach((el) => el.classList.remove('on'));
    drawLines();
    const pv = $('#preview');
    pv.classList.remove('show', 'shake', 'launch');
  }

  function initWheelInput() {
    const wheel = $('#wheel');
    wheel.addEventListener('pointerdown', (e) => {
      if (busy || screen !== 'game' || (tutMode && tutMode !== 'first')) return;
      Sound.unlock();
      const pt = localPoint(e);
      const i = hitLetter(pt, 0.62);
      if (i < 0) return;
      e.preventDefault();
      try { wheel.setPointerCapture(e.pointerId); } catch (err) { /* yok say */ }
      dragging = true;
      lastPt = pt;
      sel = [i];
      onSelChange();
      drawLines();
    });
    wheel.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const pt = localPoint(e);
      lastPt = pt;
      const i = hitLetter(pt, 0.5);
      if (i >= 0) {
        if (!sel.includes(i)) { sel.push(i); onSelChange(); }
        else if (sel.length > 1 && i === sel[sel.length - 2]) { sel.pop(); onSelChange(); }
      }
      drawLines();
    });
    const end = () => {
      if (!dragging) return;
      dragging = false;
      lastPt = null;
      submit();
    };
    wheel.addEventListener('pointerup', end);
    wheel.addEventListener('pointercancel', end);
    wheel.addEventListener('lostpointercapture', end);
  }

  // Klavye: masaüstünde harf yazıp Enter ile gönderme
  function initKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (screen !== 'game' || busy || !$('#modal').hidden || e.ctrlKey || e.metaKey || e.altKey) return;
      if (tutMode && tutMode !== 'first') return;
      if (e.key === 'Enter') { if (sel.length) { e.preventDefault(); submit(); } return; }
      if (e.key === 'Backspace') { sel.pop(); onSelChange(); drawLines(); e.preventDefault(); return; }
      if (e.key === 'Escape') { clearSelection(); return; }
      if (e.key.length !== 1) return;
      let ch = up(e.key);
      const free = (c) => L.letters.findIndex((x, i) => x === c && !sel.includes(i));
      let i = free(ch);
      if (i < 0 && ch === 'İ') i = free('I');
      else if (i < 0 && ch === 'I') i = free('İ');
      if (i >= 0) { Sound.unlock(); sel.push(i); onSelChange(); drawLines(); }
    });
  }

  function submit() {
    const word = sel.map((i) => L.letters[i]).join('');
    const pv = $('#preview');
    const rects = $$('span', pv).map((s) => s.getBoundingClientRect());
    sel = [];
    letterEls.forEach((el) => el.classList.remove('on'));
    drawLines();
    if (chars(word).length < 2) { pv.classList.remove('show'); return; }
    const wi = words.findIndex((ws) => ws.w === word);
    if (wi < 0 && (L.x || []).includes(word)) { bonusWord(word); return; }
    if (wi >= 0 && !words[wi].found) acceptWord(wi, rects);
    else if (wi >= 0) {
      pv.classList.remove('show');
      Sound.already();
      for (const k of words[wi].keys) { const el = cells.get(k).el; el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
    } else rejectWord();
  }

  // Bulmacada yeri olmayan ama Türkçede var olan kelime: küçük bir elmas ödülü
  function bonusWord(word) {
    const pv = $('#preview');
    if (S.cur.bonus.includes(word)) {
      pv.classList.remove('show');
      Sound.already();
      toast('Bu bonus kelimeyi zaten buldun.');
      return;
    }
    S.cur.bonus.push(word);
    S.bonus += 1;
    S.gems += BONUS_GEMS;
    shownGems = S.gems;
    updateGems(true);
    save();
    Sound.hint();
    buzz(15);
    pv.classList.add('bonus');
    later(() => { if (!sel.length) pv.classList.remove('show'); pv.classList.remove('bonus'); }, T(650));
    toast(`Bonus kelime: ${word}  +${BONUS_GEMS} elmas`);
  }

  function rejectWord() {
    const pv = $('#preview');
    pv.classList.remove('shake'); void pv.offsetWidth; pv.classList.add('shake');
    Sound.bad();
    buzz(30);
    later(() => { if (!sel.length) pv.classList.remove('show'); pv.classList.remove('shake'); }, T(430));
  }

  async function acceptWord(wi, rects) {
    busy = true;
    const ws = words[wi];
    ws.found = true;
    S.cur.found.push(ws.w);
    save();
    Sound.good();
    buzz(15);
    const pv = $('#preview');
    pv.classList.add('launch');
    const anims = ws.keys.map((key, k) => {
      const cell = cells.get(key);
      const src = rects[k];
      const dst = cell.el.getBoundingClientRect();
      if (!src) { setCell(key, 'found', true); return Promise.resolve(); }
      const fl = document.createElement('div');
      fl.className = 'flyer';
      fl.textContent = cell.ch;
      const size = Math.max(src.height, 20);
      fl.style.width = fl.style.height = size + 'px';
      fl.style.fontSize = Math.round(size * 0.8) + 'px';
      document.body.appendChild(fl);
      const sx = src.left + src.width / 2 - size / 2, sy = src.top + src.height / 2 - size / 2;
      const dx = dst.left + dst.width / 2 - size / 2, dy = dst.top + dst.height / 2 - size / 2;
      const sc = (dst.height * 0.92) / size;
      const done = () => { fl.remove(); setCell(key, 'found', true); };
      if (!fl.animate) { done(); return Promise.resolve(); }
      const a = fl.animate(
        [{ transform: `translate(${sx}px, ${sy}px) scale(1)` }, { transform: `translate(${dx}px, ${dy}px) scale(${sc})` }],
        { duration: T(380), delay: T(k * 70), easing: 'cubic-bezier(.5, 0, .25, 1)', fill: 'forwards' }
      );
      return a.finished.then(done, done);
    });
    await Promise.all(anims);
    pv.classList.remove('show', 'launch');
    busy = false;
    afterWordFound();
  }

  function afterWordFound() {
    if (tutMode === 'first') hideTutorial();
    const remaining = words.filter((w) => !w.found);
    if (!remaining.length) { levelComplete(); return; }
    if (remaining.length === 1) {
      const target = remaining[0];
      // Words of Wonders'taki gibi: ~1,5 sn sonra kalan kelimenin yeri bir kez zıplar ve çerçevelenir
      later(() => {
        if (target.found || screen !== 'game') return;
        for (const k of target.keys) {
          const c = cells.get(k);
          c.el.classList.remove('nudge'); void c.el.offsetWidth; c.el.classList.add('nudge');
          if (c.state !== 'found') c.el.classList.add('outlined');
        }
      }, T(1500));
    }
  }

  // ---------- ipucu ve karıştırma ----------
  function updateHintBtn() {
    const free = S.freeHints > 0;
    $('#hint-badge').hidden = !free;
    $('#hint-badge').textContent = String(S.freeHints);
    $('#hint-price').hidden = free;
    $('#btn-hint').setAttribute('aria-label', free ? `İpucu: bir harf aç (${S.freeHints} ücretsiz)` : `İpucu: bir harf aç (${HINT_COST} elmas)`);
  }

  function useHint() {
    if (busy || screen !== 'game' || dragging) return;
    if (tutMode === 'hint') hideTutorial();
    Sound.unlock();
    const cand = [];
    for (const ws of words) if (!ws.found) for (const k of ws.keys) if (cells.get(k).state === 'empty' && !cand.includes(k)) cand.push(k);
    if (!cand.length) return;
    if (S.freeHints > 0) S.freeHints -= 1;
    else if (S.gems >= HINT_COST) { S.gems -= HINT_COST; shownGems = S.gems; updateGems(true); }
    else {
      const b = $('#btn-hint'); b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake');
      Sound.bad();
      gemsModal(true);
      return;
    }
    // Önce tek kelimeye ait hücreler (WOW'da ipucu ortak hücreyi açmadı)
    const single = cand.filter((k) => cells.get(k).words.size === 1);
    const pool = single.length ? single : cand;
    const key = pool[Math.floor(Math.random() * pool.length)];
    setCell(key, 'hint', true);
    S.cur.rev.push(key);
    Sound.hint();
    updateHintBtn();
    // Tüm harfleri açılan kelime bulunmuş sayılır
    let completedAny = false;
    for (const ws of words) {
      if (!ws.found && ws.keys.every((k) => cells.get(k).state !== 'empty')) {
        ws.found = true;
        S.cur.found.push(ws.w);
        ws.keys.forEach((k) => setCell(k, 'found', true));
        completedAny = true;
      }
    }
    save();
    if (completedAny) { Sound.good(); afterWordFound(); }
  }

  function shuffle() {
    if (busy || dragging || screen !== 'game' || L.letters.length < 2) return;
    if (tutMode === 'shuffle') hideTutorial();
    Sound.unlock();
    const prev = S.cur.order.join(',');
    let o = S.cur.order.slice();
    for (let t = 0; t < 10 && o.join(',') === prev; t++) {
      for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; }
    }
    S.cur.order = o;
    clearSelection();
    layoutWheel();
    Sound.click();
    save();
  }

  // ---------- eğitim ----------
  let tutOpts = null;
  function showTutorial(mode, text, opts) {
    tutMode = mode;
    tutOpts = opts;
    $('#tut-text').textContent = text;
    $('#tut-ok').hidden = !opts.ok;
    $('#tut').hidden = false;
    $('#app').classList.add('tut-on');
    $$('.tut-focus').forEach((e) => e.classList.remove('tut-focus'));
    (opts.focus || []).forEach((e) => e.classList.add('tut-focus'));
    positionTutorial();
  }
  function positionTutorial() {
    if (!tutMode || !tutOpts) return;
    const box = $('#tut-box');
    const appR = $('#app').getBoundingClientRect();
    const wheelR = $('#wheel').getBoundingClientRect();
    // Kutu, kelime balonunun çıkacağı yerin hemen üstünde dursun
    box.style.top = Math.max(64, wheelR.top - appR.top - 58 - box.offsetHeight) + 'px';
    const arrow = $('#tut-arrow');
    arrow.hidden = !tutOpts.arrowTo;
    if (tutOpts.arrowTo) {
      const r = tutOpts.arrowTo.getBoundingClientRect();
      arrow.style.left = r.left - appR.left - 44 + 'px';
      arrow.style.top = r.top - appR.top + r.height / 2 - 12 + 'px';
    }
  }
  function hideTutorial() {
    if (!tutMode && $('#tut').hidden) return;
    if (tutMode === 'first') S.tut.first = true;
    if (tutMode === 'hint') S.tut.hintShown = true;
    if (tutMode === 'shuffle') S.tut.shuffle = true;
    tutMode = null;
    tutOpts = null;
    $('#tut').hidden = true;
    $('#app').classList.remove('tut-on');
    $$('.tut-focus').forEach((e) => e.classList.remove('tut-focus'));
    save();
  }
  function maybeTutorial() {
    if (screen !== 'game') return;
    if (L.n === 1 && !S.tut.first && !words[0].found) {
      const first = words[0];
      showTutorial('first', `${first.w} kelimesinin harflerini birleştir.`, {
        focus: [$('#wheel'), ...first.keys.map((k) => cells.get(k).el)],
      });
    } else if (L.n === 3 && !S.tut.hintShown) {
      showTutorial('hint', 'Takılırsan İPUCU kullanabilirsin.', { ok: true, focus: [$('#btn-hint')], arrowTo: $('#btn-hint') });
    } else if (L.n === 5 && !S.tut.shuffle) {
      showTutorial('shuffle', 'Harflerin yerini değiştirmek için ortadaki karıştırma düğmesine dokun.', { ok: true, focus: [$('#wheel')] });
    }
  }

  // ---------- bölüm sonu ----------
  async function levelComplete() {
    busy = true;
    clearLevelTimers();
    const n = L.n;
    const loc = L.loc;
    const locStep = ((n - 1) % LEVELS_PER_LOCATION) + 1;
    await wait(T(380));
    const pr = $('#praise');
    pr.textContent = PRAISES[Math.floor(Math.random() * PRAISES.length)];
    pr.classList.remove('show'); void pr.offsetWidth; pr.classList.add('show');
    Sound.win();
    buzz(25);
    await wait(T(1250));
    $('#scr-game').classList.add('leaving');
    await wait(T(420));
    pr.classList.remove('show');

    const prevCompleted = S.completed;
    const prevGems = S.gems;
    S.completed += 1;
    S.level = n + 1;
    S.cur = null;
    const giftNow = S.completed % GIFT_EVERY === 0;
    if (giftNow) S.gems += GIFT_GEMS;
    const cardNow = locStep === LEVELS_PER_LOCATION && !S.cards.includes(LOCATIONS[loc].id);
    if (cardNow) S.cards.push(LOCATIONS[loc].id);
    // Seviyenin son durağı ilk kez bittiyse seviye ödülü
    const tier = tierOfLoc(loc);
    const tierNow = cardNow && TIERS[tier].locs[TIERS[tier].locs.length - 1] === loc;
    if (tierNow) S.gems += TIER_GEMS;
    save();
    busy = false;
    // Oyuncu bu sırada ana sayfaya döndüyse tebrik ekranını açma (ilerleme zaten kaydedildi)
    if (screen !== 'game') { if (screen === 'home') renderHome(); return; }
    await showComplete({ n, loc, locStep, prevCompleted, prevGems, giftNow, cardNow, tierNow, tier });
  }

  function setBar(fillId, textId, value, max) {
    $(fillId).style.width = (Math.max(0, Math.min(max, value)) / max) * 100 + '%';
    $(textId).textContent = `${value}/${max}`;
  }
  function setLocBar(loc, value) {
    $('#loc-title').textContent = up(LOCATIONS[loc].name);
    $('#loc-thumb').style.backgroundImage = `url("${sceneUrl(LOCATIONS[loc].id)}")`;
    setBar('#loc-fill', '#loc-text', value, LEVELS_PER_LOCATION);
  }

  let completeRun = 0;
  async function showComplete(info) {
    const run = ++completeRun;
    const alive = () => run === completeRun && screen === 'complete';
    setBackground(LOCATIONS[info.loc].id);
    shownGems = info.prevGems;
    updateGems(false);
    $('#cmp-count').textContent = String(S.completed);
    $('#cmp-journey').classList.remove('zoom-out');
    const fills = [$('#gift-fill'), $('#loc-fill')];
    fills.forEach((f) => (f.style.transition = 'none'));
    setBar('#gift-fill', '#gift-text', info.prevCompleted % GIFT_EVERY, GIFT_EVERY);
    setLocBar(info.loc, info.locStep - 1);
    void fills[0].offsetWidth;
    fills.forEach((f) => (f.style.transition = ''));
    const btn = $('#btn-next');
    btn.hidden = true;
    btn.classList.remove('pulse');
    btn.textContent = `BÖLÜM ${info.n}`;
    showScreen('complete');

    await wait(T(550)); if (!alive()) return;
    const giftVal = S.completed % GIFT_EVERY || GIFT_EVERY;
    setBar('#gift-fill', '#gift-text', giftVal, GIFT_EVERY);
    Sound.click();
    await wait(T(500)); if (!alive()) return;
    setBar('#loc-fill', '#loc-text', info.locStep, LEVELS_PER_LOCATION);
    Sound.click();
    await wait(T(650)); if (!alive()) return;

    if (info.giftNow) {
      const gi = $('#gift-icon'); gi.classList.remove('bounce'); void gi.offsetWidth; gi.classList.add('bounce');
      await giftModal();
      shownGems = Math.min(S.gems, info.prevGems + GIFT_GEMS * 2);
      if (!info.tierNow) shownGems = S.gems;
      updateGems(true);
      fills[0].style.transition = 'none';
      setBar('#gift-fill', '#gift-text', 0, GIFT_EVERY);
      void fills[0].offsetWidth; fills[0].style.transition = '';
      if (!alive()) return;
    }
    if (info.cardNow) {
      await cardModal(info.loc, true);
      if (info.loc + 1 < LOCATIONS.length) {
        fills[1].style.transition = 'none';
        setLocBar(info.loc + 1, 0);
        void fills[1].offsetWidth; fills[1].style.transition = '';
      }
      if (!alive()) return;
    }
    if (info.tierNow) {
      await tierModal(info.tier);
      if (!alive()) return;
    }
    shownGems = S.gems;
    updateGems(false);
    btn.hidden = false;
    await wait(T(450)); if (!alive()) return;
    btn.textContent = S.level <= LEVELS.length ? `BÖLÜM ${S.level}` : 'DEVAM';
    btn.classList.remove('pulse'); void btn.offsetWidth; btn.classList.add('pulse');
  }

  let goingNext = false;
  async function goNext() {
    if (goingNext) return;
    goingNext = true;
    try {
      Sound.click();
      const run = completeRun;
      // Bölüm arası tam ekran reklam (kurallar Ads.interstitial içinde)
      await Ads.interstitial(S.completed);
      if (run !== completeRun || screen !== 'complete') return;
      if (S.level > LEVELS.length) { showEnd(); return; }
      $('#cmp-journey').classList.add('zoom-out');
      await wait(T(420));
      if (run !== completeRun || screen !== 'complete') return;
      startLevel();
    } finally { goingNext = false; }
  }

  function showEnd() {
    clearLevelTimers();
    $('#end-text').textContent = `${LOCATIONS.length} tarihî durağın ${LEVELS.length} bölümünü bitirdin. Yeni duraklar eklenene kadar bölümleri baştan oynayabilirsin.`;
    setBackground('kizkulesi');
    showScreen('end');
  }

  // ---------- pencereler ----------
  let modalResolve = null;
  function openModal(html, onBind) {
    const m = $('#modal');
    // Açık bir pencere varsa onu bekleyen akış takılı kalmasın
    if (modalResolve) { const prev = modalResolve; modalResolve = null; prev(); }
    m.innerHTML = `<div class="sheet">${html}</div>`;
    m.hidden = false;
    return new Promise((resolve) => {
      modalResolve = resolve;
      if (onBind) onBind(m);
      const first = m.querySelector('[data-focus]') || m.querySelector('button');
      if (first) first.focus({ preventScroll: true });
    });
  }
  function closeModal(value) {
    const m = $('#modal');
    m.hidden = true;
    m.innerHTML = '';
    const r = modalResolve;
    modalResolve = null;
    if (r) r(value);
  }
  const closeBtn = '<button class="close" data-close aria-label="Kapat"><svg aria-hidden="true"><use href="#i-close"/></svg></button>';

  function giftModal() {
    Sound.gift();
    // Reklam hazırsa oyuncu isterse izleyip hediyeyi ikiye katlar
    const x2 = Ads.enabled && Ads.rewardedReady();
    return openModal(
      `<div class="eyebrow">${GIFT_EVERY} BÖLÜM TAMAM</div><h2>Hediye kutusu!</h2>
       <svg class="gift-big" aria-hidden="true"><use href="#i-gift"/></svg>
       <div class="reward"><svg aria-hidden="true"><use href="#i-gem"/></svg>+${GIFT_GEMS}</div>
       <div class="stack"><button class="btn-blue" data-close data-focus>AL</button>
       ${x2 ? `<button class="btn-plain ad-btn" id="gift-x2"><svg aria-hidden="true"><use href="#i-play"/></svg><span>Reklam izle, 2 katını al</span></button>` : ''}</div>`,
      (m) => {
        const b = $('#gift-x2', m);
        if (!b) return;
        b.addEventListener('click', async () => {
          b.disabled = true;
          const earned = await Ads.rewarded();
          if (earned) { S.gems += GIFT_GEMS; save(); Sound.gift(); toast(`Hediye ikiye katlandı: +${GIFT_GEMS * 2} elmas`); }
          if (b.isConnected) closeModal();
        });
      }
    );
  }

  function dailyModal(streak, reward) {
    Sound.gift();
    const days = DAILY_GEMS.map((g, i) => `<li class="${i + 1 < streak ? 'past' : i + 1 === streak ? 'now' : ''}"><small>${i + 1}. gün</small><b>${g}</b></li>`).join('');
    return openModal(
      `<div class="eyebrow">GÜNLÜK ÖDÜL</div><h2>Hoş geldin!</h2>
       <ul class="days">${days}</ul>
       <div class="reward"><svg aria-hidden="true"><use href="#i-gem"/></svg>+${reward}</div>
       <p>Her gün gir, ödül büyüsün. Bir gün atlarsan seri baştan başlar.</p>
       <div class="stack" style="margin-top:14px"><button class="btn-blue" data-close data-focus>AL</button></div>`
    );
  }

  function tierModal(tier) {
    Sound.gift();
    const next = TIERS[tier + 1];
    return openModal(
      `<div class="eyebrow">SEVİYE ${tier + 1} TAMAM</div><h2>${TIERS[tier].name} seviyesini bitirdin!</h2>
       <p>${next ? `Sıradaki seviye: <b>${next.name}</b> (${next.desc}).` : 'Bütün seviyeleri bitirdin. Harikasın!'}</p>
       <div class="reward"><svg aria-hidden="true"><use href="#i-gem"/></svg>+${TIER_GEMS}</div>
       <button class="btn-blue" data-close data-focus>DEVAM</button>`
    );
  }

  // Seviyeler: hangi seviyede hangi duraklar var, nereye kadar gelindi
  function mapModal() {
    const curLoc = locOf(S.level);
    const allDone = S.level > LEVELS.length;
    const html = TIERS.map((t, ti) => {
      const rows = t.locs.map((li) => {
        const l = LOCATIONS[li];
        const done = allDone || li < curLoc ? LEVELS_PER_LOCATION : li === curLoc ? (S.level - 1) % LEVELS_PER_LOCATION : 0;
        const state = done >= LEVELS_PER_LOCATION ? 'done' : li === curLoc ? 'now' : 'locked';
        const first = li * LEVELS_PER_LOCATION + 1;
        return `<div class="map-row ${state}">
          <div class="map-thumb" style="background-image:url(&quot;${sceneUrl(l.id)}&quot;)">${state === 'locked' ? '<svg aria-hidden="true"><use href="#i-lock"/></svg>' : ''}</div>
          <div class="map-meta"><b>${l.name}</b><small>Bölüm ${first}–${first + LEVELS_PER_LOCATION - 1} · ${l.city}</small>
            <div class="map-bar"><i style="width:${(done / LEVELS_PER_LOCATION) * 100}%"></i></div></div>
          <div class="map-num">${done}/${LEVELS_PER_LOCATION}</div></div>`;
      }).join('');
      return `<div class="map-tier"><div class="map-head"><b>SEVİYE ${ti + 1} · ${up(t.name)}</b><small>${t.desc}</small></div>${rows}</div>`;
    }).join('');
    return openModal(`${closeBtn}<h2>Seviyeler</h2><div class="map">${html}</div>`);
  }

  // Elmas kazanma yolları (+ varsa ödüllü reklam)
  function gemsModal(needHint) {
    const adRow = Ads.enabled
      ? `<button class="btn-blue ad-btn" id="gem-ad"><svg aria-hidden="true"><use href="#i-play"/></svg><span>REKLAM İZLE</span><em><svg aria-hidden="true"><use href="#i-gem"/></svg>+${REWARD_GEMS}</em></button>
         <div class="small" id="gem-ad-note" hidden>Şu an gösterilecek reklam yok. Biraz sonra tekrar dene.</div>`
      : '';
    return openModal(
      `${closeBtn}<h2>${needHint ? 'Elmasın bitti' : 'Elmas kazan'}</h2>
       <div class="reward"><svg aria-hidden="true"><use href="#i-gem"/></svg>${S.gems}</div>
       ${needHint ? `<p>İpucu ${HINT_COST} elmas tutar.</p>` : ''}
       <div class="stack" style="margin-top:14px">${adRow}</div>
       <ul class="ways">
         <li><b>Bonus kelime</b> Bulmacada yeri olmayan her doğru kelime +${BONUS_GEMS} elmas</li>
         <li><b>Günlük ödül</b> Her gün ilk girişte ${DAILY_GEMS[0]}–${DAILY_GEMS[DAILY_GEMS.length - 1]} elmas</li>
         <li><b>Hediye kutusu</b> Her ${GIFT_EVERY} bölümde +${GIFT_GEMS} elmas</li>
         <li><b>Seviye ödülü</b> Bir seviye bitince +${TIER_GEMS} elmas</li>
       </ul>`,
      (m) => {
        const b = $('#gem-ad', m);
        if (!b) return;
        b.addEventListener('click', async () => {
          if (!Ads.rewardedReady()) { $('#gem-ad-note', m).hidden = false; return; }
          b.disabled = true;
          const earned = await Ads.rewarded();
          if (earned) {
            S.gems += REWARD_GEMS;
            shownGems = S.gems;
            updateGems(true);
            save();
            Sound.gift();
            if (!$('#modal').hidden && $('#gem-ad')) closeModal();
            toast(`+${REWARD_GEMS} elmas kazandın!`);
          } else if (b.isConnected) { b.disabled = false; $('#gem-ad-note', m).hidden = false; }
        });
      }
    );
  }

  function cardModal(loc, isNew) {
    const l = LOCATIONS[loc];
    if (isNew) Sound.gift();
    return openModal(
      `${isNew ? '<div class="eyebrow">YENİ KART KAZANDIN</div>' : closeBtn}
       <div class="post-card" style="background-image:url(&quot;${sceneUrl(l.id)}&quot;)" role="img" aria-label="${l.name} çizimi"></div>
       <div class="card-name">${l.name}</div><div class="card-city">${up(l.city)}</div>
       <button class="btn-blue" data-close data-focus>${isNew ? 'DEVAM' : 'TAMAM'}</button>`
    );
  }

  function cardsModal() {
    const items = LOCATIONS.map((l, i) => {
      const open = S.cards.includes(l.id);
      return `<button class="mini-card${open ? '' : ' locked'}" data-card="${i}" ${open ? '' : 'disabled'} aria-label="${open ? l.name : 'Kilitli kart'}">
        <div class="img" style="background-image:url(&quot;${sceneUrl(l.id)}&quot;)">${open ? '' : '<span class="lock"><svg aria-hidden="true"><use href="#i-lock"/></svg></span>'}</div>
        <div class="meta"><b>${open ? l.name : 'Kilitli'}</b><small>${open ? l.city : `Bölüm ${(i + 1) * LEVELS_PER_LOCATION} ile açılır`}</small></div></button>`;
    }).join('');
    return openModal(
      `${closeBtn}<h2>Kartlarım</h2>
       <div class="stats"><div><b>${S.completed}</b>bölüm</div><div><b>${S.cards.length}/${LOCATIONS.length}</b>kart</div></div>
       <div class="cards">${items}</div>`,
      (m) => m.addEventListener('click', (e) => {
        const c = e.target.closest('[data-card]');
        if (c && !c.disabled) { const i = Number(c.dataset.card); closeModal(); cardModal(i, false).then(() => cardsModal()); }
      })
    );
  }

  function settingsModal() {
    const inGame = screen === 'game';
    const sw = (id, on, label) => `<div class="setting"><span id="${id}-l">${label}</span><button class="switch" id="${id}" role="switch" aria-checked="${on}" aria-labelledby="${id}-l"></button></div>`;
    return openModal(
      `${closeBtn}<h2>Ayarlar</h2>
       ${sw('set-sound', S.sound, 'Ses efektleri')}
       ${sw('set-haptics', S.haptics, 'Titreşim')}
       <div class="stack" style="margin-top:16px">
         ${inGame ? '<button class="btn-blue" id="set-home">ANA SAYFA</button>' : ''}
         <button class="btn-plain" id="set-reset">İlerlemeyi sıfırla</button>
         <div class="confirm" id="set-confirm" hidden><p>Bölümler, elmaslar ve kartlar silinecek. Bu işlem geri alınamaz.</p>
           <div class="row"><button class="btn-plain" id="set-cancel">Vazgeç</button><button class="btn-danger" id="set-do-reset">Sıfırla</button></div></div>
       </div>
       ${Ads.privacyRequired() ? '<button class="btn-plain" id="set-privacy" style="margin-top:10px">Reklam gizlilik ayarları</button>' : ''}
       <div class="small">Kelime Avı: Anadolu Yolculuğu · sürüm ${VERSION} · ${LEVELS.length} bölüm<br>Kelimeler, bölümler ve çizimler bu oyuna özgüdür.</div>`,
      (m) => {
        $('#set-sound', m).addEventListener('click', (e) => { S.sound = !S.sound; e.currentTarget.setAttribute('aria-checked', String(S.sound)); save(); if (S.sound) Sound.click(); });
        $('#set-haptics', m).addEventListener('click', (e) => { S.haptics = !S.haptics; e.currentTarget.setAttribute('aria-checked', String(S.haptics)); save(); buzz(20); });
        const priv = $('#set-privacy', m);
        if (priv) priv.addEventListener('click', () => Ads.showPrivacy());
        const home = $('#set-home', m);
        if (home) home.addEventListener('click', () => { closeModal(); showHome(); });
        $('#set-reset', m).addEventListener('click', () => { $('#set-confirm', m).hidden = false; $('#set-reset', m).hidden = true; $('#set-cancel', m).focus(); });
        $('#set-cancel', m).addEventListener('click', () => { $('#set-confirm', m).hidden = true; $('#set-reset', m).hidden = false; });
        $('#set-do-reset', m).addEventListener('click', () => {
          const keep = { sound: S.sound, haptics: S.haptics };
          S = defaultState();
          Object.assign(S, keep);
          save();
          closeModal();
          toast('İlerleme sıfırlandı.');
          showHome();
        });
      }
    );
  }

  // ---------- olaylar ----------
  function bindUI() {
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-act], [data-close]');
      if (!t) return;
      if (t.hasAttribute('data-close')) { Sound.click(); closeModal(); return; }
      const act = t.dataset.act;
      Sound.unlock();
      Sound.click();
      if (act === 'settings') settingsModal();
      else if (act === 'cards') cardsModal();
      else if (act === 'map') mapModal();
      else if (act === 'gems') gemsModal(false);
      else if (act === 'home') { completeRun++; showHome(); }
    });
    $('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal' && $('.close', e.currentTarget)) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#modal').hidden && $('#modal .close')) closeModal(); });
    $('#btn-play').addEventListener('click', async () => {
      Sound.unlock();
      Sound.click();
      if (S.level > LEVELS.length) { S.level = 1; S.cur = null; save(); }
      $('#home-journey').classList.add('zoom-out');
      await wait(T(380));
      startLevel();
    });
    $('#btn-next').addEventListener('click', goNext);
    $('#btn-restart').addEventListener('click', () => { Sound.click(); S.level = 1; S.cur = null; save(); startLevel(); });
    $('#btn-hint').addEventListener('click', useHint);
    $('#btn-shuffle').addEventListener('click', shuffle);
    $('#tut-ok').addEventListener('click', () => { Sound.click(); hideTutorial(); });
    initWheelInput();
    initKeyboard();
    let rz = null;
    window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { if (screen === 'game') { layoutAll(); positionTutorial(); } }, 120); });
  }

  // ---------- açılış ----------
  async function preload() {
    const ids = Object.keys(window.SCENES || {});
    let done = 0;
    const fill = $('#load-fill');
    const step = () => { done++; fill.style.width = Math.round((done / Math.max(1, ids.length)) * 100) + '%'; };
    await Promise.all(ids.map((id) => new Promise((res) => {
      const img = new Image();
      img.onload = img.onerror = () => { step(); res(); };
      img.src = sceneUrl(id);
    })));
    fill.style.width = '100%';
  }

  async function start(hotData) {
    const fromHot = hotData && hotData.S;
    S = sanitize(fromHot || loadLocal() || null);
    shownGems = S.gems;
    bindUI();
    setBackground('kizkulesi');
    const t0 = Date.now();
    await preload();
    await wait(Math.max(0, T(700) - (Date.now() - t0)));
    if (fromHot && fromHot.level === S.level && S.cur) startLevel();
    else showHome();
    cloudInit();
  }

  // Sayfa güncellenince açık oyunun durumu korunsun (yalnızca Claude görüntüleyicisinde vardır)
  const hot = window.claude && window.claude.hot;
  if (hot && typeof hot.snapshot === 'function') { try { hot.snapshot(() => ({ S })); } catch (e) { /* yok say */ } }
  if (hot && typeof hot.ready === 'function') hot.ready(start);
  else start((hot && hot.data) || {});

  // Android "geri" tuşu: pencere açıksa kapatır, oyundaysa ana sayfaya döner.
  // false dönerse uygulama arka plana alınır (ana sayfadayken).
  function back() {
    if ($('#ad-full')) return true;
    if (!$('#modal').hidden) { closeModal(); return true; }
    if (tutMode && tutMode !== 'first') { hideTutorial(); return true; }
    if (busy) return true;
    if (screen === 'game' || screen === 'complete' || screen === 'end') { completeRun++; showHome(); return true; }
    return false;
  }

  // Android katmanı ve testler için küçük bir pencere (oyun mantığını değiştirmez)
  window.__kelimeAvi = { state: () => S, level: () => L, screen: () => screen, back, ads: Ads, today };
})();
