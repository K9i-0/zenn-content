---
title: "Flutterパッケージの更新に役立つTips"
emoji: "🐙"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["flutter", "dart"]
published: false
---
Flutterやpubのパッケージを更新する際に便利なTipsをまとめました。

## VS Code拡張機能
### Version Lens
pubspec.yamlを開いているときに、パッケージ名の上に最新バージョンを表示してくれます。バージョンをポチるとすぐに反映されて便利です。

![](/images/SCR-20230403-wcz.png)

https://marketplace.visualstudio.com/items?itemName=pflannery.vscode-versionlens

### Flutter Links
pubspec.yamlを開いているときに、パッケージ名の上にpub.devのリンクを表示してくれます。ChangeLogを確認するためにpub.devをすぐに開けて便利です。

![](/images/SCR-20230403-wgb.png)

https://marketplace.visualstudio.com/items?itemName=djbkwon.flutter-dependency-docs

## コマンド系
### pub deps
pub depsコマンドはパッケージの依存関係を表示するコマンドです。
依存パッケージの競合が起きたときなどに役立ちます。
flutterプロジェクトならflutter pub depsと実行します。

![](/images/SCR-20230403-wix.png)


### dart fix --apply
dart fix --applyコマンドは、静的解析の警告を自動的に修正してくれるコマンドです。バージョンアップで細かい警告が大量発生しても簡単に修正できる場合があります。

## その他


### dependency_validatorパッケージ
dependency_validatorパッケージは不要な依存パッケージが無いかチェックできます。バージョンアップのついでにいつの間にか使っていなかったパッケージの依存を削除するのに役立ちます。

https://pub.dev/packages/dependency_validator

ただし、riverpod_lintなど利用していても誤検知されるものもあるのでdart_dependency_validator.yamlで対策しましょう。
以下のように書けば無視されます。
```yaml:dart_dependency_validator.yaml
ignore:
  - riverpod_lint
```

### pod update用のコマンド
パッケージ更新後、PodのキャッシュがおかしくなりiOSビルドが通らないことがあります。そんなときpod updateコマンドでPodのキャッシュをクリアすることが役立ちます。自分は以下の一連のコマンドをすぐに実行できるようにしています。

```
cd ios
rm -rf Pods/
rm -rf Podfile.lock
cd ..
flutter clean
flutter pub get
cd ios
pod install --repo-update
cd ..
```

### Dependabot
Dependabotは更新すべきライブラリを調べてくれるGithubの機能です。設定した間隔で更新すべきライブラリを更新するプルリクエストを作成してくれます。

pubの場合は一例として以下のように書けば動きます。
ただしpub対応はbetaで結構微妙です。
```yaml:.github/dependabot.yaml
version: 2
enable-beta-ecosystems: true
updates:
  - package-ecosystem: "pub"
    directory: "/"
    schedule:
      interval: "weekly"
```


## まとめ
Flutterパッケージ更新の便利なTipsの紹介でした。
他におすすめがあったらコメントで教えて下さい🥳