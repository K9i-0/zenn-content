---
title: "Marionette MCPのcall_custom_extensionで、Store画像撮影やUI検証を自動化しよう"
emoji: "🐙"
type: "tech"
topics: ["Flutter", "MCP", "claudecode", "aiagent", "dart"]
published: false
---

## はじめに

Flutterエンジニアの皆さん、普段の開発でどんなMCPを使っていますか？
今回は僕イチ推しのMarionette MCPと、最近追加されたcall_custom_extensionについて紹介します！

## Marionette MCPとは

[LeanCode](https://leancode.co/)が開発しているFlutterに特化したMCPです。

Flutter専用のMCPとしては公式が出している[Dart and Flutter MCP server](https://docs.flutter.dev/ai/mcp-server)がありますが、あちらはエラーの取得やコードの分析など開発時の利用を想定しています。一方、Marionette MCPはボタンのタップやテキスト入力などランタイムでの操作に特化したものです。

どちらを選択するかではなく、併用するのがおすすめです。
