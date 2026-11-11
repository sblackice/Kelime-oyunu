#!/usr/bin/env bash
# Kelime Avı – Android emülatöründe duman testi (GitHub Actions içinde çalışır).
# Uygulamayı kurar, açar, çökmediğini doğrular ve ekran görüntüleri alır.
# Kullanım: emulator-test.sh <debug-apk> <çıktı-klasörü>
set -u
APK="$1"; OUT="$2"; PKG=com.kelimeavi.oyun
mkdir -p "$OUT"
fail=0

shot() { adb exec-out screencap -p > "$OUT/$1.png"; echo "ekran görüntüsü: $1"; }
# Oyuna küçük bir JavaScript komutu gönderir (yalnızca debug derlemesinde çalışan kanca)
js() { adb shell am start -n "$PKG/.MainActivity" --es js64 "$(printf '%s' "$1" | base64 -w0)" > /dev/null; }
alive() { adb shell pidof "$PKG" > /dev/null; }
check() { if eval "$2"; then echo "  ✓ $1"; else echo "  ✗ $1"; fail=1; fi; }

adb logcat -c
adb install -r "$APK" || { echo "kurulum başarısız"; exit 1; }
adb shell am start -W -n "$PKG/.MainActivity"
sleep 25
shot 01-acilis
check "uygulama açıldı ve çalışıyor" alive

# Kaydı 7. bölüme al (reklam şeridi 3. bölümden sonra görünür) ve yeniden yükle
js "localStorage.setItem('kelime-avi:v1', JSON.stringify({v:1,level:7,completed:6,gems:0,tut:{first:true,hintShown:true,hintGiven:true,shuffle:true},cards:[]})); location.reload();"
sleep 15
shot 02-ana-ekran-reklam-seridi
js "console.log('KA-DURUM ' + JSON.stringify({ekran: __kelimeAvi.screen(), bolum: __kelimeAvi.state().level, reklamAcik: __kelimeAvi.ads.enabled, bolumSayisi: LEVELS.length, en: innerWidth, boy: innerHeight}));"
sleep 2
js "document.querySelector('#btn-play').click();"
sleep 6
shot 03-oyun
check "oyun ekranı açıkken uygulama çalışıyor" alive

# Elmas 0: ipucu → 'Elmasın bitti' penceresi → REKLAM İZLE
js "document.querySelector('#btn-hint').click();"
sleep 3
shot 04-elmas-penceresi
js "console.log('KA-ODULLU hazir=' + __kelimeAvi.ads.rewardedReady()); var b=document.querySelector('#gem-ad'); if(b) b.click();"
sleep 12
shot 05-odullu-reklam
adb shell input keyevent KEYCODE_BACK
sleep 4
shot 06-geri-tusu-sonrasi
check "reklam denemesinden sonra uygulama çalışıyor" alive

adb logcat -d > "$OUT/logcat.txt"
grep -E "KA-DURUM|KA-ODULLU|KelimeAviAds" "$OUT/logcat.txt" | sed 's/^/  günlük: /' | tail -30
check "çökme (FATAL EXCEPTION) yok" "! grep -A3 'FATAL EXCEPTION' '$OUT/logcat.txt' | grep -q '$PKG'"
check "oyun durumu okundu (7. bölüm, reklam köprüsü açık)" "grep -q 'KA-DURUM.*\"bolum\":7,\"reklamAcik\":true' '$OUT/logcat.txt'"
exit $fail
