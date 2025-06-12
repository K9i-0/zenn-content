# Cursor × Zenn 執筆環境

このディレクトリには、CursorでZenn記事を効率的に執筆するための設定とルールが含まれています。

## 📁 ディレクトリ構成

```
.cursor/
├── rules/
│   ├── zenn-articles.mdc      # Zenn記事作成ルール（Auto Attached）
│   └── zenn-cli-commands.mdc  # Zenn CLIコマンド（Always）
└── README.md                  # このファイル
```

## 🚀 Cursorでの記事執筆の始め方

### 1. 新しい記事の作成

Cursor内蔵ターミナルで以下を実行：

```bash
npm run new:article
```

### 2. Cursorルールの活用

- `articles/`ディレクトリ内の`.md`ファイルを開くと、`zenn-articles.mdc`ルールが自動適用
- `@zenn-articles`で明示的にルールを参照可能
- Cursor AIが記事構成やMarkdown記法をサポート

### 3. 効率的な執筆

#### Cursorの便利機能

- **Cmd+K**: インライン編集でMarkdown整形
- **Cmd+L**: チャットでAIに執筆支援を依頼
- **Cmd+Shift+P**: コマンドパレットから各種操作

#### 推奨ワークフロー

1. 記事テンプレート作成 → `npm run new:article`
2. Cursorで記事ファイルを開く
3. フロントマター設定（タイトル、絵文字、トピック等）
4. 記事本文執筆（AI支援活用）
5. リアルタイムプレビュー → `npm run preview`
6. 公開設定 → `published: true`
7. GitHubにpush

## 🎯 Cursorルールの詳細

### Cursorルールの機能

#### `zenn-articles.mdc`（Auto Attached）

- ✅ **フロントマター**: 必須項目の自動案内
- ✅ **記事構成**: 導入→使い方→具体例→まとめの流れ
- ✅ **コードブロック**: 言語指定とファイル名の記述ルール
- ✅ **画像参照**: `/images/`ディレクトリからの正しい参照方法
- ✅ **文章スタイル**: Zenn記事の推奨スタイル

#### `zenn-cli-commands.mdc`（Always）

- ✅ **Zenn CLI**: 執筆ワークフローとコマンド一覧
- ✅ **トラブルシューティング**: よくある問題の解決方法
- ✅ **公開前チェックリスト**: 記事公開前の確認項目

### AI支援の活用例

```
@zenn-articles Flutterの新機能について記事を書きたいです。構成を提案してください。
```

```
@zenn-cli-commands 記事作成から公開までの流れを教えてください。
```

```
@zenn-articles この技術記事のコードブロックを適切な形式に整形してください。
```

## 🛠️ カスタマイズ

### 新しいルールの追加

```bash
# Cursorコマンドパレットから
Cmd+Shift+P → "New Cursor Rule"
```

### ルールの編集

`rules/zenn-articles.mdc`を直接編集することで、執筆ルールをカスタマイズ可能。

## 📚 参考資料

- [Cursor Rules公式ドキュメント](https://docs.cursor.com/context/rules)
- [Zenn CLI公式ガイド](https://zenn.dev/zenn/articles/zenn-cli-guide)
- [Zenn Markdown記法](https://zenn.dev/zenn/articles/markdown-guide)

## 💡 執筆Tips

### 効率的な記事作成

- **テンプレート活用**: ルールに定義された構成に従う
- **AI支援**: 技術的な説明やコード例の生成に活用
- **プレビュー**: 執筆中は常にプレビューを確認
- **段階的公開**: `published: false`で下書き管理

### Cursor固有の活用法

- **コンテキスト**: `@`記号でファイルやルールを参照
- **インライン編集**: Cmd+Kで部分的な修正
- **チャット**: 記事の構成や内容について相談
- **コード生成**: サンプルコードの自動生成

---

**Happy Writing with Cursor! 🎉**
