# Agentic Search：AIコーディングツールの検索メカニズム

AIコーディングツールがコードベースを「理解・検索」する仕組みについて、Claude Codeを中心に解説します。

## 目次

- [Agentic Searchとは](#agentic-searchとは)
- [Claude Codeの実装](#claude-codeの実装)
- [RAGとの比較](#ragとの比較)
- [検索の最適化戦略](#検索の最適化戦略)
- [実践的な使い方](#実践的な使い方)
- [doccommentの活用](#doccommentの活用)
- [参考ドキュメント](#参考ドキュメント)

---

## Agentic Searchとは

**Agentic Search**は、AIエージェントが従来の開発ツール（grep、ls、readなど）を使って、**動的に複数ラウンドの検索を実行**するアプローチです。

### 基本概念

```
動的な検索オーケストレーション
  = 複数検索ラウンド + 通常の開発ツール + AI判断
```

**特徴：**
- 事前インデックス不要
- リアルタイムでファイルシステムを探索
- 検索結果に基づいて次の検索戦略を決定

### アーキテクチャ別分類

| アプローチ | 代表ツール | メカニズム | メリット | デメリット |
|-----------|-----------|-----------|---------|----------|
| **RAG** | Cursor, Copilot | 事前にベクトル化・インデックス作成 | 高速、セマンティック検索 | インデックス作成時間、同期問題 |
| **Agentic Search** | Claude Code, Codex CLI | grep/lsでリアルタイム探索 | ゼロセットアップ、常に最新 | 初速、トークン消費 |
| **Long Context** | Gemini | 全ファイルをコンテキストに読込 | 取りこぼしゼロ | コスト、レイテンシ |
| **Hybrid** | Devin | RAG + Agent の組み合わせ | 両方の利点を活用 | 実装の複雑性 |

---

## Claude Codeの実装

### アーキテクチャ：シングルスレッド・マスターエージェントループ

Claude Codeは**14個の組み込みツール**をシンプルなループで実行します：

```
while(tool_call):
  ツール実行 → 結果取得 → 次の判断 → 継続 or 終了
```

**ツール構成：**
- **コマンドライン系**（4個）：bash、glob、grep、ls
- **ファイル操作系**（6個）：read、write、edit、multi_edit、notebook_read、notebook_edit
- **Web系**（2個）：web_search、web_fetch
- **制御フロー系**（2個）：todo_write、task

### 検索ツールの詳細

#### 1. Grep（ripgrepベース）

正規表現を使用した高速テキスト検索：

**主要パラメータ：**
```bash
pattern: 検索する正規表現（必須）
path: 検索対象のファイル/ディレクトリ
glob: ファイルパターンでフィルタリング（例：*.js）
type: ファイルタイプ指定（例：js、py、rust、go）
output_mode:
  - "content": マッチ行を表示
  - "files_with_matches": マッチしたファイルパスのみ（デフォルト）
  - "count": マッチ数をカウント
-A/-B/-C: コンテキスト表示（前後の行数）
```

**性能：**
- 100K行のコードベース：数ミリ秒で検索完了

#### 2. Glob

ワイルドカードパターンでファイルを検出：

```bash
# 例
pattern: "**/*.js"  # 全JSファイル
pattern: "src/**/*.ts"  # src以下の全TSファイル
```

#### 3. Read

ファイルの直接読み込み：

```bash
file_path: 絶対パス（必須）
offset: 読み込み開始行（オプション）
limit: 読み込み行数（デフォルト2000行）
```

#### 4. Task（サブエージェント）

複雑な探索タスクを専門エージェントに委譲：

**サブエージェントの特性：**
- 独立したコンテキストウィンドウ
- 並列実行可能
- ネスティング不可

**Explore/Planエージェント：**
- コードベース内の研究と情報収集
- 検索ツール（Read、Glob、Grep）にアクセス
- 短く、シグナルの高いレポートを返却

---

## RAGとの比較

### なぜRAG/インデックスを使わないのか？

Anthropicのリードエンジニアが公表している設計判断：

#### ✅ Agentic Searchを採用した理由

**1. パフォーマンス**
- 内部ベンチマークで「すべてを上回った」
- Ripgrep：100K行を数ミリ秒で検索
- インデックス作成：数分かかる

**2. ゼロセットアップ**
- インストールして即使用可能
- インデックス管理のメンテナンス不要
- 新規ファイルは即座に検索可能（インデックス遅延なし）

**3. 同期問題の回避**
- インデックスはコード変更で同期外れのリスク
- 常に「今のファイルシステム」を見る = 鮮度100%保証

**4. 設計哲学：最小主義**
- サーバーなし、インデックスなし、クリーンなCLIのみ
- セキュリティリスク（インデックス保存場所）を回避

### 実測比較表

| 特性 | Agentic Search (Claude Code) | RAG (Cursor等) |
|------|------------------------------|----------------|
| セットアップ | **不要** | インデックス作成必須 |
| 検索速度 | 数ミリ秒 | インデックス後は高速 |
| 新規ファイル | **即座に検索可能** | インデックス再作成必要 |
| セマンティック理解 | なし（構造理解で補完） | あり（埋め込みベース） |
| 情報の鮮度 | **常に最新（100%保証）** | 数秒〜数分のラグ |
| 実装の複雑性 | 低 | 高 |
| トークン効率 | 最適化が必要 | 検索時は効率的 |

### トレードオフ

**Agentic Searchの利点：**
- ✅ ゼロセットアップ、情報鮮度、デバッグのしやすさ

**Agentic Searchの課題：**
- ❌ セマンティック理解の欠如、トークン消費（最適化で改善可能）

---

## 検索の最適化戦略

### 1. 検索範囲の絞り込み

```bash
# ファイルタイプで絞り込み
Grep --type "py" "pattern"

# Globパターンで絞り込み
Grep --glob "*.js" "pattern"

# 出力モードの選択
Grep --output_mode "files_with_matches" "pattern"  # ファイル名のみ
```

### 2. 階層化検索アプローチ

```
1段階：広範な質問
  "Give me an overview of this codebase"
     ↓
2段階：具体的ファイル検索
  "Find the files that handle user authentication"
     ↓
3段階：相互作用の理解
  "How do these authentication files work together?"
     ↓
4段階：実行フロー追跡
  "Trace the login process from front-end to database"
```

### 3. サブエージェントの並列化

- 複数の探索タスクを独立したコンテキストで同時実行
- 親エージェントが結果を統合
- Git worktreesでマージ競合を回避

### 4. コンテキスト管理

**トークン削減技術：**
- `/clear`と`/compact`コマンドで会話歴を圧縮（50〜70%削減可能）
- `CLAUDE.md`で事前情報を構造化
- カスタムアナライザーで95〜98%のMCPレスポンス削減可能

---

## 実践的な使い方

### 検索フロー例

**ユーザー：「認証周りのロジックはどこ？」**

```
Claude Code内部の動き：

1. Grep で "auth" "login" "authentication" を並列検索
   → 候補ファイル10個を特定

2. Glob で "**/*auth*.ts" "**/*login*.ts" を検索
   → ファイル構造を把握

3. Read で上位3ファイルを詳細読み込み
   → 実装の詳細を理解

4. Grep で import文を追跡
   → 依存関係を把握

5. ユーザーに回答
```

### ベストプラクティス

**1. 検索クエリの工夫**
- 具体的なキーワードを使う
- 正規表現を活用
- ファイルタイプを事前に絞り込む

**2. コンテキストエンジニアリング**
```markdown
# CLAUDE.md の活用例

## 用語集
- AuthService: ユーザー認証サービス（src/services/auth.ts）
- LoginView: ログイン画面（src/views/login.dart）
- UI-001: ログイン画面のUI番号

## プロジェクト構造
- src/services/: ビジネスロジック
- src/views/: UI層
- src/models/: データモデル
```

**3. 並列検索の活用**
- 複数の検索パターンを同時実行
- サブエージェントで独立した調査タスクを並列化

---

## doccommentの活用

### Agentic Searchでの有効性

doccommentは**検索可能なメタデータ**として機能します：

```dart
/// UI-001: ログイン画面
/// ユーザー認証の入り口となる画面。
/// メールアドレスとパスワードによる認証を行う。
///
/// 関連：パスワードリセット画面（UI-002）、新規登録画面（UI-003）
class AuthenticationView extends StatelessWidget {
  // ...
}
```

**検索例：**
```
ユーザー：「ログイン画面のコードを見たい」
  ↓
Claude Code: Grep "ログイン画面"
  ↓
doccommentがヒット → ファイル特定（即座）
```

**利点：**
- ✅ クラス名が`AuthenticationView`でも、「ログイン画面」で検索可能
- ✅ UI番号（UI-001）でも検索可能 → 仕様書との紐付けが容易
- ✅ 完全一致検索のため、確実性が高い

**課題：**
- ❌ 表記揺れに弱い（"ログイン画面" vs "Login Screen"）
  - → 正規表現で対応可能

### RAGとの比較

| 観点 | Agentic Search | RAG |
|------|----------------|-----|
| **画面名検索** | 完全一致で確実 | 表記揺れも吸収 |
| **UI番号検索** | ◎（文字列マッチで確実） | ○（キーワードマッチで可能） |
| **曖昧な検索** | △（正確なキーワード必要） | ◎（関連概念も検出） |
| **説明文の活用** | △（Grep対象だが活用度低） | ◎（セマンティック理解） |
| **仕様書との紐付け** | ◎（UI番号で即座に特定） | ○（可能だが間接的） |

### 両方で最大限活かすdoccomment

```dart
/// UI-001: ログイン画面 (Login Screen)
///
/// ユーザー認証の入り口となる画面。
/// メールアドレスとパスワードによる認証を行う。
///
/// 関連：パスワードリセット画面（UI-002）、新規登録画面（UI-003）
class AuthenticationView extends StatelessWidget {
  // ...
}
```

**工夫点：**
1. **UI番号**：Agentic Searchで仕様書と直接紐付け
2. **画面名（日本語 + 英語）**：表記揺れ対応、多言語チーム対応
3. **説明文**：RAGのセマンティック検索で活きる
4. **関連画面の明記**：両方のアプローチで文脈をリッチにする

---

## まとめ：設計哲学

> **「シンプルなものを優先する（Favor simplicity）」**

Claude Codeの設計原則：
- シングルスレッドループ
- インデックスなし
- 標準開発ツール（Grep/Glob）の活用

**トレードオフの本質：**
- ✅ 即座の利用開始、情報鮮度、デバッグのしやすさ
- ❌ セマンティック理解、トークン効率（最適化で改善可能）

**ユースケース別推奨：**

| シチュエーション | 推奨アプローチ | 理由 |
|----------------|---------------|------|
| コード補完・リファクタリング | RAG (Cursor) | 即答性が必要 |
| バグ調査・エラー追跡 | Agent (Claude Code) | 正確なキーワードマッチが必要 |
| 大規模な仕様変更 | Hybrid / Long Context | 全体俯瞰と見落とし防止 |

**二刀流のワークフロー（Vibe Coding）：**
1. **Cursor (RAG)** で大まかなファイル・ロジックを特定
2. **Claude Code (Agent)** で具体的な修正とテスト実行

---

## 参考ドキュメント

### Claude Code公式・アーキテクチャ

- [Tools and system prompt of Claude Code · GitHub](https://gist.github.com/wong2/e0f34aac66caf890a332f7b6f9e2ba8f)
- [Claude Code Built-in Tools Reference](https://www.vtrivedy.com/posts/claudecode-tools-reference)
- [Claude Code: Behind-the-scenes of the master agent loop](https://blog.promptlayer.com/claude-code-behind-the-scenes-of-the-master-agent-loop/)
- [Agent design lessons from Claude Code](https://jannesklaas.github.io/ai/2025/07/20/claude-code-agent-design.html)
- [Minusx | What makes Claude Code so damn good](https://minusx.ai/blog/decoding-claude-code/)
- [Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
- [ZenML LLMOps Database - Claude Code Architecture](https://www.zenml.io/llmops-database/claude-code-agent-architecture-single-threaded-master-loop-for-autonomous-coding)

### Agentic Search vs RAG の議論

- [Why I'm Against Claude Code's Grep-Only Retrieval?](https://milvus.io/blog/why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md)
- [Claude Researcher Explains How Agentic Search Performed Better Than RAG](https://officechai.com/ai/claude-researcher-explains-how-agentic-search-performed-better-than-rag-for-code-generation/)
- [The RAG Obituary: Killed by Agents, Buried by Context Windows](https://www.nicolasbustamante.com/p/the-rag-obituary-killed-by-agents)
- [Cline vs Claude vs Cursor: The Battle for Smarter Code Search](https://medium.com/@iamalexcarter/cline-vs-claude-vs-cursor-the-battle-for-smarter-code-search-5daa06114030)

### トークン効率と最適化

- [How to Optimize Claude Code Token Usage | ClaudeLog](https://claudelog.com/faqs/how-to-optimize-claude-code-token-usage/)
- [Stop Wasting Tokens: Optimize Claude Code Like a Pro](https://www.geeky-gadgets.com/claude-code-optimization-techniques/)
- [Optimizing Token Efficiency in Claude Code Workflows](https://medium.com/@pierreyohann16/optimizing-token-efficiency-in-claude-code-workflows-managing-large-model-context-protocol-f41eafdab423)
- [Token-efficient tool use - Claude Docs](https://docs.claude.com/en/docs/agents-and-tools/tool-use/token-efficient-tool-use)

### セマンティック/構造的検索の補強

- [ast-grep - Claude Skill](https://github.com/ast-grep/claude-skill)
- [Using ast-grep with AI Tools](https://ast-grep.github.io/advanced/prompting.html)
- [mcp-ragex: Semantic, Symbolic, and Regex Search](https://github.com/jbenshetler/mcp-ragex)
- [Supercharge Your Claude Agents with ast-grep](https://medium.com/coding-nexus/supercharge-your-codex-or-claude-agents-with-ast-grep-smarter-syntax-aware-code-search-d6f69a9c4cad)

---

**作成日：** 2025-11-24
**対象ツール：** Claude Code, Cursor, その他AIコーディングツール
**更新履歴：** 初版作成
