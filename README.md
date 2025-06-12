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

3. **依存関係をインストール**
   ```bash
   # Zenn CLIとその他の依存関係をインストール
   npm install
   ```

4. **動作確認**
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
```

### プレビュー

```bash
# ローカルでプレビュー表示（http://localhost:8000）
npm run preview
# または
npx zenn preview
```

### 記事・本の管理

```bash
# 記事一覧を表示
npx zenn list:articles

# 本一覧を表示
npx zenn list:books
```

## 📁 プロジェクト構造

```
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

3. **プレビュー確認**
   ```bash
   npm run preview
   ```
   - ブラウザで http://localhost:8000 にアクセス

4. **公開**
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
```

## 🛠️ トラブルシューティング

### Node.jsが見つからない場合

```bash
# miseでNode.jsを再インストール
mise install node@20.19.2
mise use node@20.19.2
```

### Zenn CLIが動作しない場合

```bash
# Zenn CLIを最新版に更新
npm install zenn-cli@latest

# 依存関係を再インストール
rm -rf node_modules package-lock.json
npm install
```

### プレビューが表示されない場合

```bash
# ポートが使用中の場合、別のポートを指定
npx zenn preview --port 3000
```

## 📚 参考リンク

- [Zenn CLIの使い方](https://zenn.dev/zenn/articles/zenn-cli-guide)
- [Zenn CLIをインストールする](https://zenn.dev/zenn/articles/install-zenn-cli)
- [ZennとGitHubリポジトリを連携する](https://zenn.dev/zenn/articles/connect-to-github)
- [mise公式ドキュメント](https://mise.jdx.dev/)

## 🔧 開発環境

- **Node.js**: v20.19.2（miseで管理）
- **npm**: v10.8.2
- **Zenn CLI**: v0.1.144
- **エディタ**: Cursor（zenn-articles.mdcルール適用済み）
