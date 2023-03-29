---
title: "Flutterパッケージ更新の便利なTips"
emoji: "🐙"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["flutter", "dart"]
published: false
---
Flutterやpubのパッケージを更新する際に役立つTipsをいくつかまとめてみました。

## VS Code拡張機能
### Version Lens
pubspec.yamlを開いているときに、パッケージ名の上に最新バージョンを表示してくれるVS Code拡張機能です。

https://marketplace.visualstudio.com/items?itemName=pflannery.vscode-versionlens

### Flutter Links
pubspec.yamlを開いているときに、パッケージ名の上にpub.devのリンクを表示してくれるVS Code拡張機能です。ChangeLogを確認するためにpub.devを開く際に便利です。

https://marketplace.visualstudio.com/items?itemName=djbkwon.flutter-dependency-docs

## コマンド系
### pub deps
pub depsコマンドはパッケージの依存関係を表示してくれます。

### dependency_validator
不要なパッケージが残っているのが気になる場合、dependency_validatorを使うことで使っていないパッケージを見つけることができます。ただし、riverpod_lintなどは警告が出ることがあるので注意してください。

### pod update
パッケージ更新後、PodのキャッシュがおかしくなりiOSビルドが通らないことがあります。この場合、pod updateコマンドでPodのキャッシュをクリアすることが役立ちます。

### dart fix --apply
dart fix --applyコマンドは、簡単な修正を自動的に適用してくれます。これにより、手間を省くことができます。

## その他
### wasabeef/import-asdf-tool-versions-action
asdfを使ってFlutterバージョンを管理している場合、wasabeef/import-asdf-tool-versions-actionを使用することで、tool-versionsを読み取り、GitHub Actionsのワークフローを実行できます。これにより、Flutterバージョン更新時の修正漏れを防ぐことができます。

## まとめ
Flutterパッケージ更新の便利なTipsの紹介でした。
他におすすめがあったらコメントで教えて下さい🥳