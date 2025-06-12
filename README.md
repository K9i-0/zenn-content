# Zenn Content

Zennの記事置き場です。

執筆->公開にラグがあることがあるので、未公開記事が見えたりします。

## 📋 セットアップ手順

### 前提条件

- [mise](https://mise.jdx.dev/)がインストールされていること
- Gitがインストールされていること

### 初回セットアップ

1. **リポジトリをクローン**

   ```bash
   git clone <repository-url>
   cd zenn-content
   ```

2. **Node.js環境をセットアップ**

   ```bash
   # Node.js 20.19.2をインストール（miseを使用）
   mise use node@20.19.2
   ```

1. **依存関係をインストール**

   ```bash
   # Zenn CLIとその他の依存関係をインストール
   npm install
   ```

2. **動作確認**

   ```bash
   # Zenn CLIのバージョン確認
   npx zenn --version
   
   # 記事一覧表示
   npx zenn list:articles
   ```

## 🚀 日常的な執筆コマンド

### 記事・本の作成

```bash
# 新しい記事を作成
npm run new:article
# または
npx zenn new:article

# 新しい本を作成
npm run new:book
# または
npx zenn new:book

```text

### プレビュー

```bash
# ローカルでプレビュー表示（http://localhost:8000）
npm run preview
# または
npx zenn preview

```text

### 記事・本の管理

```bash
# 記事一覧を表示
npx zenn list:articles

# 本一覧を表示
npx zenn list:books

```text

## 📁 プロジェクト構造

```text
zenn-content/
├── articles/          # 記事ファイル（.md）
├── books/            # 本ファイル（.md）
├── images/           # 画像ファイル
├── .cursor/
│   └── rules/
│       └── zenn-articles.mdc  # Cursor AI用記事作成ルール
├── mise.toml         # mise設定ファイル
├── package.json      # npm設定・依存関係
└── README.md         # このファイル

```

## ✏️ 記事作成の流れ

1. **新規記事作成**

   ```bash
   npm run new:article
   ```

2. **記事編集**
   - 生成された`articles/xxx.md`ファイルを編集
   - Cursor AIの`zenn-articles.mdc`ルールが自動適用される

1. **プレビュー確認**

   ```bash
   npm run preview
   ```

   - ブラウザで <http://localhost:8000> にアクセス

2. **公開**
   - GitHubにpushすることでZennに自動公開

## 📝 記事のフロントマター例

新しい記事を作成する際は、以下のフロントマターを参考にしてください：

```yaml
---
title: "記事のタイトル"
emoji: "🐙"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["Flutter", "Dart", "関連技術"]
published: false # 下書きの場合はfalse、公開時はtrue
---

```text

## 🛠️ トラブルシューティング

### Node.jsが見つからない場合

```bash
# miseでNode.jsを再インストール
mise install node@20.19.2
mise use node@20.19.2

```text

### Zenn CLIが動作しない場合

```bash
# Zenn CLIを最新版に更新
npm install zenn-cli@latest

# 依存関係を再インストール
rm -rf node_modules package-lock.json
npm install

```text

### プレビューが表示されない場合

```bash
# ポートが使用中の場合、別のポートを指定
npx zenn preview --port 3000

```text

## 📚 参考リンク

- [Zenn CLIの使い方](https://zenn.dev/zenn/articles/zenn-cli-guide)
- [Zenn CLIをインストールする](https://zenn.dev/zenn/articles/install-zenn-cli)
- [ZennとGitHubリポジトリを連携する](https://zenn.dev/zenn/articles/connect-to-github)
- [mise公式ドキュメント](https://mise.jdx.dev/)

## 📝 Markdownlint対応

このプロジェクトでは、Markdownファイルの品質を保つために[markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)を導入しています。

### セットアップ

```bash
# markdownlint-cli2をグローバルインストール
npm install -g markdownlint-cli2

# プロジェクト依存関係をインストール
npm install glob

```text

### 使用方法

```bash
# Markdownファイルのlintチェック
markdownlint-cli2 "README.md" "articles/*.md" ".cursor/*.md"

# 自動修正可能なエラーを修正
node scripts/fix_markdown.js

# package.jsonのスクリプトを使用
npm run lint:md        # エラーチェック
npm run lint:md:fix    # 自動修正 + エラーチェック

```

### 設定

- `.markdownlint.json`: Zenn記事に適したmarkdownlint設定
- `scripts/fix_markdown.js`: よくあるエラーの自動修正スクリプト
- `.cursor/rules/markdownlint-compliance.mdc`: Cursor用のmarkdownlintルール

詳細な修正手順は[@markdownlint-compliance](/.cursor/rules/markdownlint-compliance.mdc)を参照してください。

## 🔧 開発環境

- **Node.js**: v20.19.2（miseで管理）
- **npm**: v10.8.2
- **Zenn CLI**: v0.1.144
- **markdownlint-cli2**: v0.18.1
- **エディタ**: Cursor（zenn-articles.mdcルール適用済み）
