---
title: "【2026年3月時点】AI駆動開発でFlutterアプリ（CC Pocket）を作ったときの知見"
emoji: "🐙"
type: "tech"
topics: ["ClaudeCode", "Flutter", "codex", "antigravity", "ai駆動開発"]
published: false
---

## はじめに

最近個人開発でCC Pocketというアプリを作りました
運よく界隈の有名人が宣伝してくれた効果で一時は開発ツールの3位に！
せっかくなので？CC Pocketを開発したときに得たAI駆動開発の知見を記事にします😭

![開発ツール3位](/images/ai_driven_flutter_3.png =350x)

### ちょっとだけアプリ紹介

CC PocketはmacのClaude Code / CodexをBridgeサーバー経由でスマホから操作できるようにするアプリです。
Claude Codeの /remote-control とかと大体同じ用途で使えます。

詳しくは以下の記事で
https://zenn.dev/k9i/articles/20260304_ccpocket

## 個人で契約してるAIツール

AI駆動開発でどのサービスを契約してるかは重要かと思うので最初に紹介します。
結構定番どころですが以下のツールを使ってます

- Claude Code
  - Claude Max 5x $100
  - メインで利用
- Codex
  - ChatGPT Plus 3000円
  - Claude Codeがドハマリしてる問題を解決してくれたりするので利用
  - CC PocketをCodex対応させるためにもアカウントが欲しかった
- Antigravity
  - Google AI Pro 2900円
  - Nanobananaでネタ画像作るのが好きなので契約している
  - UIを洗練させるときなどビジュアル的なセンスを求めてるときにピンポイントに利用

## その他の開発環境

ハードウェアやAI以外のソフトウェアはこんな感じです

### ハード

- mac mini M4 16GB 256GB
  - mac miniの最小構成です
  - 常に動かしておけるmacが欲しくてコスパ重視で買ったらいつの間にかメイン機に
- iPhone 16 Pro
  - 途中からCC PocketでCC Pocketを開発してたのでその時のスマホ
  - CC Pocketは特にハードウェア性能が必要な処理は無いはずなのでもっと安価な端末でもいいはず。強いて言えば音声入力は端末スペックによりそうだけど、音声あまり使ってない。
- macbook air M4 32GB 1TB
  - 元々のメイン機
  - UIのブラッシュアップとかmacbookで作業したいときに使ってるが、この用途も別にmac miniで事足りる

### ソフト

- Tailscale
  - mac miniとiPhoneの接続用
  - CC Pocketも外で利用するときはTailscaleを前提にしている
- moshi
  - スマホからターミナル操作できるアプリ。こいつもTailscale推奨
  - CC Pocket使っててもターミナル使いたいときはあるので併用している
  - 便利だけどClaude CodeをスマホからターミナルのUIで操作するのが根本的に辛くない？となってCC Pocketの開発に至る
- shorebird
  - FlutterでOTAできるサービス
  - 外でエージェントが作った最新のアプリを見たいときに割と重宝
  - とはいえmac mini M4だとpatch配布に3分くらい待つので、M5 Proとか欲しい…
- GitHub Actions
  - Publicリポジトリなら無料なのでCDはGitHub Actionsを採用
  - Storeにアップロードする用の認証情報とかはリポジトリのSecretsに登録して、エージェントが直接見えない構成
  - ワークフローがコケてもghコマンドでエラーが取れるので、エージェントが自力で直してくれるのが強い

## 技術選定

### モバイルアプリ

元々Flutterエンジニアであることと、とりあえずの要件でFlutterで困りそうなことがなかったので採用

AI駆動でモバイルアプリ作る場合、現時点では他人向けには以下のスタンス

1. 全くモバイルアプリ経験が無い人 > React Native x ExpoがAI系のエコシステム最も発展してそうなのでおすすめ
2. 経験がある人 > アプリで実現したい機能など要件に最適なフレームワークを選ぶのがおすすめ。要件だけだとどっちでも良さそうなら慣れてるフレームワーク

ほぼVibe Codingでも、こういうUIが作りたい！みたいなときに経験があるフレームワークだと適切なクラス名での指示ができてできあがるものの精度が上がる印象です

### サーバー

特にこだわりなかったので無難にTypeScript x npm

- そもそもClaude SDKとかがJS/TS
- ccusageみたいに、npxでサーバー起動するのが無難に便利そうだと考えていた

Claude CodeのセッションはClaude SDK、Codexのセッションはcodex app-serverで実現しています。
Codex SDKもあるけどこちらはなぜか承認操作がない(どうして)
