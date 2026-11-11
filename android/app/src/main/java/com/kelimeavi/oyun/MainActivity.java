package com.kelimeavi.oyun;

import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.util.Base64;
import android.view.ViewGroup;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.LinearLayout;

import androidx.activity.ComponentActivity;
import androidx.activity.EdgeToEdge;
import androidx.activity.OnBackPressedCallback;
import androidx.activity.SystemBarStyle;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.webkit.WebViewAssetLoader;

import java.nio.charset.StandardCharsets;

/**
 * Oyunu (assets/index.html) uygulama içinde, internet gerektirmeden açar.
 * Ekran düzeni: üstte oyun (WebView), altta reklam şeridi (banner).
 */
public class MainActivity extends ComponentActivity {
    private static final String START_URL = "https://appassets.androidplatform.net/assets/index.html";
    private static final int NIGHT = Color.parseColor("#121838");
    private WebView webView;
    private AdsBridge ads;
    private boolean pageReady;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Android 15+ ekranı kenardan kenara çizer; durum çubuğu simgeleri açık renk olsun
        EdgeToEdge.enable(this, SystemBarStyle.dark(Color.TRANSPARENT), SystemBarStyle.dark(Color.TRANSPARENT));
        super.onCreate(savedInstanceState);

        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(NIGHT);

        webView = new WebView(this);
        webView.setBackgroundColor(NIGHT);
        webView.setOverScrollMode(WebView.OVER_SCROLL_NEVER);
        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);          // ilerleme kaydı (localStorage)
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setTextZoom(100);                    // telefonun yazı boyutu ayarı düzeni bozmasın

        FrameLayout adContainer = new FrameLayout(this);
        adContainer.setBackgroundColor(Color.parseColor("#0B0E24"));
        adContainer.setVisibility(FrameLayout.GONE);

        root.addView(webView, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f));
        root.addView(adContainer, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        // Durum çubuğu, gezinme çubuğu ve kamera çentiği oyunun üstüne binmesin
        ViewCompat.setOnApplyWindowInsetsListener(root, (v, insets) -> {
            Insets bars = insets.getInsets(WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout());
            v.setPadding(bars.left, bars.top, bars.right, bars.bottom);
            return WindowInsetsCompat.CONSUMED;
        });

        if (BuildConfig.ADS_ENABLED) {
            ads = new AdsBridge(this, webView, adContainer);
            webView.addJavascriptInterface(ads, "AndroidAds");
        }

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri u = request.getUrl();
                return !"appassets.androidplatform.net".equals(u.getHost());
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                pageReady = true;
                runDebugScript(getIntent());
            }
        });

        // Geri tuşu: önce oyuna sorulur (pencereyi kapat / ana sayfaya dön); oyun "hayır" derse uygulama arka plana alınır
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                webView.evaluateJavascript(
                        "(function(){try{return !!(window.__kelimeAvi&&window.__kelimeAvi.back&&window.__kelimeAvi.back())}catch(e){return false}})()",
                        v -> { if (!"true".equals(v)) moveTaskToBack(true); });
            }
        });

        setContentView(root);
        if (savedInstanceState != null && webView.restoreState(savedInstanceState) != null) return;
        webView.loadUrl(START_URL);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        if (pageReady) runDebugScript(intent);
    }

    /** Yalnızca hata ayıklama (debug) derlemesinde: otomatik test, oyuna küçük komutlar gönderebilir. Yayın sürümünde çalışmaz. */
    private void runDebugScript(Intent intent) {
        if (!BuildConfig.DEBUG || intent == null) return;
        String b64 = intent.getStringExtra("js64");
        if (b64 == null) return;
        intent.removeExtra("js64");
        try {
            webView.evaluateJavascript(new String(Base64.decode(b64, Base64.DEFAULT), StandardCharsets.UTF_8), null);
        } catch (IllegalArgumentException ignored) {
            // bozuk veri: yok say
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        webView.saveState(outState);
    }

    @Override
    protected void onPause() {
        if (ads != null) ads.onPause();
        webView.onPause();
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        webView.onResume();
        if (ads != null) ads.onResume();
    }

    @Override
    protected void onDestroy() {
        if (ads != null) ads.onDestroy();
        webView.destroy();
        super.onDestroy();
    }
}
