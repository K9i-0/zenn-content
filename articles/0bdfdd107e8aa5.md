---
title: "Flutterアプリからブラウザアプリを開く"
emoji: "👾"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["Flutter"]
published: true
---
# はじめに
FlutterアプリでChromeやFirefoxなどのブラウザアプリを指定してURLを開く方法です。
※ Android、iOSにしか対応していません。

# パッケージのインストール
pubspec.yaml ファイルに android_intent_plus, url_launcher を追加し、flutter pub get
```yaml
dependencies:
  android_intent_plus: <任意のバージョン>
  url_launcher: <任意のバージョン>
```

# Android用コード
android_intent_plusパッケージを使います。
```dart
Future<void> _launchBrowserAndroid(
  BrowserType browserType,
  String url,
) async {
  switch (browserType) {
    case BrowserType.chrome:
      final intent = AndroidIntent(
        action: 'action_view',
        data: url,
        package: 'com.android.chrome',
      );
      return await intent.launch();
    case BrowserType.firefox:
      final intent = AndroidIntent(
        action: 'action_view',
        data: url,
        package: 'org.mozilla.firefox',
      );
      return await intent.launch();
    case BrowserType.opera:
      final intent = AndroidIntent(
        action: 'action_view',
        data: url,
        package: 'com.opera.browser',
      );
      return await intent.launch();
  }
}
```

# iOS用コード
url_launcherパッケージを使います。
```dart
Future<void> _launchBrowserIOS(
  BrowserType browserType,
  String url,
) async {
  final String formattedUrl;
  switch (browserType) {
    case BrowserType.chrome:
      formattedUrl = url
          .replaceFirst('https://', 'googlechrome://')
          .replaceFirst('http://', 'googlechrome://');
      break;
    case BrowserType.firefox:
      formattedUrl = 'firefox://open-url?url=$url';
      break;
    case BrowserType.opera:
      formattedUrl = url
          .replaceFirst('https://', 'touch-https://')
          .replaceFirst('http://', 'touch-http://');
      break;
  }
  launchUrl(
    Uri.parse(formattedUrl),
    mode: LaunchMode.externalApplication,
  );
}
```

# まとめ
全体の実装です。exampleディレクトリに利用例があります。
https://github.com/K9i-0/multi_browser_launcher