---
title: "Marionette MCP の call_custom_extension で、Store 画像撮影や UI 検証を自動化しよう"
emoji: "🐙"
type: "tech"
topics: ["Flutter", "MCP", "claudecode", "aiagent", "dart"]
published: false
---

## はじめに

Flutter エンジニアの皆さん、普段の開発でどんな MCP を使っていますか？
今回は僕イチ推しの Marionette MCP と、最近追加された `call_custom_extension` について紹介します！

## Marionette MCP とは

[LeanCode](https://leancode.co/) が開発している Flutter に特化した MCP です。

Flutter 専用の MCP としては公式が出している [Dart and Flutter MCP server](https://docs.flutter.dev/ai/mcp-server) がありますが、あちらはエラーの取得やコードの分析など開発時の利用を想定しています。一方、Marionette MCP はボタンのタップやテキスト入力などランタイムでの操作に特化したものです。

どちらを選択するかではなく、併用するのがおすすめです。

---

以前 Flutter で使えるランタイムの操作に特化した MCP を比較したスライドがあるので、興味があればどうぞ

https://k9i-0.github.io/flutter_deck_template/fluttergakkai_9/#/title

## これまでのつらみ

まずは `call_custom_extension` 登場以前に大変だったシナリオを紹介します。

### 深い階層へのナビゲーション

こんな体験はありませんか？

Claude Code 等に実装させた画面の検証も AI に投げて優雅にランチをして帰宅。いざ PC を開いたらそもそも検証させたい画面に辿り着けてない🤪

人間にとっては直感的にたどり着ける画面でも、AI にとっては何度もツールの呼び出しをして初めてたどり着けるようなことがあります。
ツールを呼び出しまくれば、当然トークン代も嵩みますね…

### スクショを撮らせようとしたら言語設定やテーマが間違ってた

似た問題ですが、ライトテーマ x 日本語でスクショを撮って欲しいのに間違ってたみたいなこともあるあるだと思います。
あと、そういう設定ってちょっと導線が深くなりがちなので、AI が苦労します。

## `call_custom_extension` の紹介

`call_custom_extension` は先ほど挙げた課題を解決するものです！
