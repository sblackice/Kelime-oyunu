package com.kelimeavi.oyun;

import android.os.Handler;
import android.os.Looper;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;

import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;
import com.google.android.ump.ConsentInformation;
import com.google.android.ump.ConsentRequestParameters;
import com.google.android.ump.UserMessagingPlatform;

import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Reklam köprüsü: oyun (JavaScript) "ne zaman" reklam gösterileceğine karar verir,
 * bu sınıf reklamı Google Mobile Ads (AdMob) ile yükler ve gösterir.
 *
 * Üç reklam türü:
 *  - Banner: oyunun altındaki ince şerit.
 *  - Geçiş (interstitial): bölüm aralarında tam ekran.
 *  - Ödüllü (rewarded): oyuncu isterse izler, karşılığında elmas kazanır.
 *
 * Reklamlar, kullanıcı izni (Avrupa için UMP izin penceresi) alınmadan başlatılmaz.
 */
final class AdsBridge {
    private static final String TAG = "KelimeAviAds";
    private static final long RETRY_MS = 60_000;

    private final MainActivity activity;
    private final WebView webView;
    private final FrameLayout container;
    private final Handler ui = new Handler(Looper.getMainLooper());
    private final AtomicBoolean started = new AtomicBoolean(false);
    private ConsentInformation consent;

    private AdView banner;
    private boolean bannerWanted;
    private InterstitialAd interstitial;
    private RewardedAd rewarded;
    private volatile boolean interstitialReady;
    private volatile boolean rewardedReady;
    private volatile boolean privacyRequired;
    private boolean destroyed;

    AdsBridge(MainActivity activity, WebView webView, FrameLayout container) {
        this.activity = activity;
        this.webView = webView;
        this.container = container;
        requestConsentThenStart();
    }

    // ---------- kullanıcı izni ----------
    private void requestConsentThenStart() {
        consent = UserMessagingPlatform.getConsentInformation(activity);
        ConsentRequestParameters params = new ConsentRequestParameters.Builder().build();
        consent.requestConsentInfoUpdate(activity, params,
                () -> UserMessagingPlatform.loadAndShowConsentFormIfRequired(activity, formError -> {
                    if (formError != null) Log.w(TAG, "izin formu: " + formError.getMessage());
                    updatePrivacyFlag();
                    if (consent.canRequestAds()) start();
                }),
                error -> Log.w(TAG, "izin bilgisi alınamadı: " + error.getMessage()));
        // Önceki oturumda izin alındıysa beklemeden başla
        if (consent.canRequestAds()) start();
    }

    private void updatePrivacyFlag() {
        privacyRequired = consent.getPrivacyOptionsRequirementStatus()
                == ConsentInformation.PrivacyOptionsRequirementStatus.REQUIRED;
    }

    private void start() {
        if (!started.compareAndSet(false, true)) return;
        updatePrivacyFlag();
        new Thread(() -> MobileAds.initialize(activity, status -> ui.post(() -> {
            if (destroyed) return;
            Log.i(TAG, "reklam altyapısı hazır");
            applyBanner();
            loadInterstitial();
            loadRewarded();
        }))).start();
    }

    // ---------- banner ----------
    private AdSize bannerSize() {
        DisplayMetrics dm = activity.getResources().getDisplayMetrics();
        int widthPx = container.getWidth() > 0 ? container.getWidth() : dm.widthPixels;
        return AdSize.getCurrentOrientationAnchoredAdaptiveBannerAdSize(activity, Math.max(320, (int) (widthPx / dm.density)));
    }

    private void applyBanner() {
        if (destroyed) return;
        if (!bannerWanted || !started.get()) {
            container.setVisibility(View.GONE);
            return;
        }
        if (banner == null) {
            AdSize size = bannerSize();
            banner = new AdView(activity);
            banner.setAdUnitId(BuildConfig.AD_BANNER);
            banner.setAdSize(size);
            // Reklam yüklenirken ekran zıplamasın diye yer baştan ayrılır
            container.setMinimumHeight(size.getHeightInPixels(activity));
            container.addView(banner, new FrameLayout.LayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT, Gravity.CENTER));
            banner.loadAd(new AdRequest.Builder().build());
        }
        container.setVisibility(View.VISIBLE);
    }

    // ---------- geçiş reklamı ----------
    private void loadInterstitial() {
        if (destroyed || interstitial != null) return;
        InterstitialAd.load(activity, BuildConfig.AD_INTERSTITIAL, new AdRequest.Builder().build(), new InterstitialAdLoadCallback() {
            @Override
            public void onAdLoaded(@NonNull InterstitialAd ad) {
                interstitial = ad;
                interstitialReady = true;
            }

            @Override
            public void onAdFailedToLoad(@NonNull LoadAdError error) {
                Log.w(TAG, "geçiş reklamı yüklenemedi: " + error.getMessage());
                interstitial = null;
                interstitialReady = false;
                ui.postDelayed(AdsBridge.this::loadInterstitial, RETRY_MS);
            }
        });
    }

    // ---------- ödüllü reklam ----------
    private void loadRewarded() {
        if (destroyed || rewarded != null) return;
        RewardedAd.load(activity, BuildConfig.AD_REWARDED, new AdRequest.Builder().build(), new RewardedAdLoadCallback() {
            @Override
            public void onAdLoaded(@NonNull RewardedAd ad) {
                rewarded = ad;
                rewardedReady = true;
            }

            @Override
            public void onAdFailedToLoad(@NonNull LoadAdError error) {
                Log.w(TAG, "ödüllü reklam yüklenemedi: " + error.getMessage());
                rewarded = null;
                rewardedReady = false;
                ui.postDelayed(AdsBridge.this::loadRewarded, RETRY_MS);
            }
        });
    }

    private void js(String call) {
        if (destroyed) return;
        webView.evaluateJavascript("window.__kelimeAviAds&&window.__kelimeAviAds." + call, null);
    }

    // ---------- oyunun (JavaScript) çağırdığı işlevler ----------
    // Not: bu işlevler arka plan iş parçacığında çağrılır; ekranla ilgili işler ui.post ile ana iş parçacığına aktarılır.

    @JavascriptInterface
    public void setBanner(boolean show) {
        ui.post(() -> {
            bannerWanted = show;
            applyBanner();
        });
    }

    /** @return reklam gösterilecekse true (oyun, kapanmasını bekler) */
    @JavascriptInterface
    public boolean showInterstitial() {
        if (!interstitialReady) return false;
        interstitialReady = false;
        ui.post(() -> {
            final InterstitialAd ad = interstitial;
            interstitial = null;
            if (ad == null || destroyed) {
                js("onInterstitialClosed()");
                return;
            }
            ad.setFullScreenContentCallback(new FullScreenContentCallback() {
                @Override
                public void onAdDismissedFullScreenContent() {
                    js("onInterstitialClosed()");
                    loadInterstitial();
                }

                @Override
                public void onAdFailedToShowFullScreenContent(@NonNull AdError error) {
                    js("onInterstitialClosed()");
                    loadInterstitial();
                }
            });
            ad.show(activity);
        });
        return true;
    }

    @JavascriptInterface
    public boolean isRewardedReady() {
        return rewardedReady;
    }

    /** @return reklam gösterilecekse true; sonuç onRewardedClosed(true/false) ile bildirilir */
    @JavascriptInterface
    public boolean showRewarded() {
        if (!rewardedReady) return false;
        rewardedReady = false;
        ui.post(() -> {
            final RewardedAd ad = rewarded;
            rewarded = null;
            if (ad == null || destroyed) {
                js("onRewardedClosed(false)");
                return;
            }
            final boolean[] earned = {false};
            ad.setFullScreenContentCallback(new FullScreenContentCallback() {
                @Override
                public void onAdDismissedFullScreenContent() {
                    js("onRewardedClosed(" + earned[0] + ")");
                    loadRewarded();
                }

                @Override
                public void onAdFailedToShowFullScreenContent(@NonNull AdError error) {
                    js("onRewardedClosed(false)");
                    loadRewarded();
                }
            });
            ad.show(activity, reward -> earned[0] = true);
        });
        return true;
    }

    @JavascriptInterface
    public boolean isPrivacyOptionsRequired() {
        return privacyRequired;
    }

    @JavascriptInterface
    public void showPrivacyOptions() {
        ui.post(() -> UserMessagingPlatform.showPrivacyOptionsForm(activity, formError -> {
            if (formError != null) Log.w(TAG, "gizlilik formu: " + formError.getMessage());
        }));
    }

    // ---------- yaşam döngüsü ----------
    void onPause() {
        if (banner != null) banner.pause();
    }

    void onResume() {
        if (banner != null) banner.resume();
    }

    void onDestroy() {
        destroyed = true;
        ui.removeCallbacksAndMessages(null);
        if (banner != null) banner.destroy();
    }
}
