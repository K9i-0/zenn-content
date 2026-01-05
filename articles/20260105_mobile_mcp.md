---
title: "FlutterアプリをAIで操作する - mobile MCP・maestro MCPの仕組みと活用法"
emoji: "🤖"
type: "tech"
topics: ["mcp", "flutter", "ai", "claude", "test"]
published: false
---

## はじめに

AI駆動開発を試してみたけど、「動いているかどうか確認するのが面倒」「何度もビルド＆実行を繰り返す」という経験はありませんか？私自身、Claude Codeで機能を実装しても、毎回手動でアプリを操作して確認するのが億劫でした。

Web開発ではPlaywright MCPを使って、AIが自動的にUIをテストしてくれる時代になりました。モバイルアプリでも同じことができないか調べてみたところ、いくつかの選択肢が見つかったので紹介します。

:::message
**MCPとは？**
MCP（Model Context Protocol）は、AIツールを拡張するための標準プロトコルです。Claude CodeやCursorなどのAIツールに新しい機能を追加できます。
:::

### なぜフィードバックループが重要なのか

Claude Codeの開発者であるBoris氏は、AI駆動開発における検証の重要性についてこう語っています。

https://x.com/bcherny/status/1880043657115439468

> AIに検証方法を与えることが、良い結果を得るための最も重要なこと。フィードバックループがあれば、最終結果の質が2-3倍になる。

Claude CodeはChrome拡張を使ってUIをテストし、動作するまでイテレーションを回しています。この「実装→検証→修正」のループがあるかどうかで、成果物の品質が大きく変わるのです。

:::message
このツイートの日本語解説記事はこちら：
https://zenn.dev/mohy_nyapan/articles/a07975837386f7
:::

### この記事で紹介すること

**mobile MCP**や**maestro MCP**を使えば、モバイルアプリでも同様のフィードバックループを目指すことができます。

この記事では、Flutterエンジニアである私が、以下の内容を解説します：

- mobile MCPとmaestro MCPの違いと選び方
- アクセシビリティ情報を活用した仕組み
- FlutterでのSemantics設定方法
- おすすめの運用パターン

どちらのMCPも複数のプラットフォームに対応しているので、ネイティブやReact Nativeでも活用できます。

## mobile MCPとmaestro MCPの概要

モバイルアプリをAIで操作するためのMCPは、主に2つあります。

### mobile MCP

https://github.com/mobile-next/mobile-mcp

mobile MCPは、iOS/Android両対応の汎用的なモバイル自動化MCPです。アクセシビリティツリーから要素の座標情報を取得し、**座標指定でタップする設計**になっています。デバイスのHOME/BACKボタン操作やアプリのインストール/アンインストールなど、デバイス管理系の機能が充実しています。

### maestro MCP

https://docs.maestro.dev/getting-started/maestro-mcp

maestro MCPは、E2EテストツールであるMaestroの拡張として提供されているMCPです。Maestro CLIの機能をMCP経由で利用でき、**ID/テキスト指定でのタップ操作**が可能です。

### 設計思想の違い

両者のアプローチを整理すると、以下のような違いがあります。

**mobile MCP**
- 汎用的なモバイル自動化を目指した設計
- プラットフォームのアクセシビリティAPIを直接活用
- 特定のテストフレームワークに依存しない

**maestro MCP**
- 既存のE2Eテストツール（Maestro）のMCPラッパー
- Maestro CLIの機能をそのまま活用可能
- YAMLシナリオとの相互運用が前提

### 私がmaestro MCPを選んだ理由

両方試してみた結果、私の環境（Flutter + iOS Simulator）ではmaestro MCPの方が使いやすいと感じました。

| 観点 | mobile MCP | maestro MCP |
|------|:----------:|:-----------:|
| タップ操作 | 座標指定のみ | ID/テキスト指定 |
| identifier検出 | 一部欠落あり | 安定して検出 |
| デバイス操作 | HOME/BACK対応 | BACKのみ |
| E2Eシナリオ連携 | 単独動作 | Maestroフローと共通化可能 |

#### 機能比較（実機検証結果）

| 機能 | maestro MCP | mobile MCP |
|------|:-----------:|:----------:|
| ID/テキスト指定タップ | ✅ | ❌ 座標指定のみ |
| デバイスボタン（HOME） | ❌ | ✅ |
| アプリinstall/uninstall | ❌ | ✅ |
| YAMLフロー実行 | ✅ | ❌ |

:::message
プロジェクトの特性やプラットフォームによって、mobile MCPの方が適しているケースもあるかと思います。デバイス管理系の操作が必要な場合はmobile MCPが有利です。両ツールの詳細な機能差はバージョンアップにより変化する可能性があるため、最新情報は各公式ドキュメントをご確認ください。
:::

#### 操作効率の違い

私がmaestro MCPを選んだ大きな理由は、操作のシンプルさです。例えばFABボタンをタップする場合:

**maestro MCP（1ステップ）**
```
tap_on(id="todo-fab-add")
```

**mobile MCP（3ステップ）**
```
1. list_elements_on_screen → 座標取得
2. 座標計算（中心座標を算出）
3. click_on_screen_at_coordinates(x, y)
```

ID指定タップができるmaestro MCPは、AIのコンテキスト消費が少なく効率的です。

また、すでにMaestroでE2Eテストを書いている（あるいは書こうとしている）プロジェクトでは、同じSemantics IDを使い回せるので整合性が取りやすいのではないかと思います。

## 仕組み紹介

### アクセシビリティツリーとは

アクセシビリティツリーは、アプリのUI要素を木構造で表現したものです。本来はVoiceOver（iOS）やTalkBack（Android）といったスクリーンリーダーが画面内容を読み上げるために使用される仕組みで、視覚に障害のあるユーザーがアプリを操作できるようにするためのものです。

各プラットフォームが以下のAPIを通じて提供しています:

- **iOS**: UIAccessibility API
- **Android**: AccessibilityNodeInfo

これらのAPIを通じて、要素のラベル、役割（ボタン、テキストフィールドなど）、状態（有効/無効、選択中など）といった情報を取得できます。E2Eテストツールやmobile MCPは、この仕組みを「副次的に」活用して操作対象の要素を特定しています。座標ベースの操作と比べて、画面サイズやレイアウトの変化に強いのがメリットです。

### アクセシビリティ情報の活用

これはE2Eテストツールを調べていて気づいた点なのですが、maestro MCPに限らず、多くのE2Eテストツールはアクセシビリティ情報を使って要素を特定しています。スクリーンリーダーなどの支援技術がアプリを理解するために使う情報を、テストツールも活用しているわけです。

MCPも同じ仕組みを利用しているので、**アクセシビリティ情報を適切に設定することが、MCPでの操作性向上に直結する**と考えられます。

### FlutterでのSemantics設定

Flutterでは、`Semantics`ウィジェットを使ってアクセシビリティ情報を設定します。普段はアクセシビリティ目的で使うことが多いと思いますが、これがE2EテストやMCP操作にも効いてくるのは興味深い点です。

```dart
Semantics(
  identifier: 'todo-fab-add',  // 要素の一意識別子
  label: 'Add new todo',       // 要素の説明
  child: FloatingActionButton.extended(
    onPressed: () { /* ... */ },
    label: const Text('Add'),
  ),
)
```

`identifier`は要素の一意識別子で、maestro MCPやUIテストツール（UIAutomator、XCUITest等）でタップ対象を指定する際に使用します。この値はエンドユーザーには公開されず、テスト自動化専用です。一方、`label`はスクリーンリーダー向けの説明文で、アクセシビリティの本来の目的に使用されます。

:::message alert
**スクリーンリーダーへの配慮**

Semanticsを追加する際は、スクリーンリーダーユーザーの体験を損なわないよう注意が必要です。テスト用に`identifier`を設定するのは問題ありませんが、`label`には実際にユーザーが聞いて理解できる説明を設定しましょう。冗長すぎる説明や、テスト用の技術的なIDをそのまま読み上げさせるのは避けるべきです。

理想的には、アクセシビリティツリーで十分な情報を提供できていれば、スクリーンリーダーでも使いやすいアプリになります。E2Eテストとアクセシビリティは対立するものではなく、両立できるものだと考えています。
:::

:::details FABボタンのSemantics実装
```dart
// todo_list_screen.dart
floatingActionButton: Semantics(
  identifier: 'todo-fab-add',
  label: 'Add new todo',
  child: FloatingActionButton.extended(
    onPressed: () => _navigateToEdit(context),
    icon: const Icon(Icons.add_rounded),
    label: const Text('New Task'),
  ),
),
```
:::

:::details IconButtonのSemantics実装
```dart
// todo_list_screen.dart
Semantics(
  identifier: 'settings-button',
  label: 'Settings',
  child: IconButton(
    icon: Icon(Icons.settings_outlined),
    onPressed: () {
      Navigator.of(context).push(
        MaterialPageRoute(builder: (context) => const SettingsScreen()),
      );
    },
    tooltip: 'Settings',
  ),
),
```
:::

:::details カテゴリチップのSemantics実装（動的ID生成）
```dart
// category_chip.dart
Semantics(
  identifier: 'category-chip-${category.id}',  // 動的にIDを生成
  label: 'Filter by ${category.name}',
  child: GestureDetector(
    onTap: widget.onTap,
    child: AnimatedContainer(
      // ... チップのUI実装
    ),
  ),
),
```
:::

:::message
参考リポジトリでは、全てのウィジェットにSemantics識別子を設定しています。実装例は以下をご覧ください：
https://github.com/K9i-0/flutter_e2e_investigation/tree/main/lib/features/todo/ui
:::

### maestro MCPの主要機能

maestro MCPで利用できる機能は、Maestro CLIのコマンド体系に準じています。私が試した範囲では、以下のツールが利用可能でした:

- **`inspect_view_hierarchy`**: 画面上の要素一覧をCSV形式で取得
- **`tap_on`**: ID（`resource-id`）またはテキストでタップ
- **`input_text`**: フォームへのテキスト入力
- **`take_screenshot`**: 画面キャプチャを取得
- **`run_flow`**: MaestroのYAMLシナリオを実行

:::message
MCPで利用可能なツール一覧は公式ドキュメントに詳細が明記されていないため、実際の挙動はバージョンにより異なる可能性があります。最新の対応状況は[公式ドキュメント](https://docs.maestro.dev/getting-started/maestro-mcp)をご確認ください。
:::

AIに操作させる際は、まず画面要素を取得し、その情報を元にタップやテキスト入力を行うのが基本的な流れです。

### 効率的なテスト手順

MCPでの操作を効率化するためのTipsです:

```
✅ 推奨: hierarchy → 操作 → hierarchy → ... → screenshot（最終確認）
❌ 非効率: screenshot → 操作 → screenshot → ...
```

`inspect_view_hierarchy`は軽量で高速なので積極的に使い、`take_screenshot`は視覚確認が必要な時のみ使用するのがおすすめです。スクリーンショットは情報量が多い分、AIのトークン消費も大きくなります。

## おすすめの運用

### AI駆動開発でのフィードバックループ

MCPを活用することで、以下のようなフィードバックループを目指せます:

1. AIがコードを実装
2. MCPでアプリを操作して動作確認
3. 問題があれば修正
4. 再度動作確認

私はまだこのループを完全に回せているわけではありませんが、ユニットテストやlintと同様に、UIの動作確認もAIに任せられるようになれば、開発効率が大きく向上するのではないかと思います。

### Maestroシナリオ（YAML）との相乗効果

maestro MCPの大きな利点は、Maestro CLIで作成したYAMLシナリオとの相乗効果です。これは他のモバイル操作系MCP（mobile-mcpなど）にはない、maestro MCP固有の強みです。

#### なぜYAMLシナリオが必要なのか

「MCPで操作できるなら、YAMLシナリオは不要では？」と思うかもしれません。しかし、繰り返し実行するテストにはシナリオ化が必須です。

| 観点 | MCP（LLM経由） | YAMLシナリオ |
|------|----------------|--------------|
| 実行結果 | 非決定的（同じ指示でも操作が変わりうる） | 決定的（毎回同じ操作） |
| コスト | トークン消費あり | なし |
| 速度 | LLM呼び出し分遅い | 高速 |
| CI/CD適性 | 不向き | 最適 |
| デバッグ | 操作ログを追う必要あり | YAMLを見れば原因が明確 |

CIで100回テストを実行するたびにLLMを呼び出すのは、コスト的にも速度的にも現実的ではありません。**MCPは「探索」、YAMLは「再現」**という役割分担で考えると整理しやすいです。

#### 双方向ワークフロー

MCPとYAMLシナリオは、双方向に活用できます。

**既存シナリオ → 動作確認**
- 既存のYAMLシナリオをAIに読ませて、動作確認の計画を立てさせる
- `runFlow`で既存シナリオをそのまま実行し、リグレッションを検知

**動作確認 → 新規シナリオ**
- MCPで対話的に操作した内容を元に、AIに新しいYAMLシナリオを生成させる
- 一度確認した操作をCI/CDで再利用可能なテストとして蓄積

mobile-mcpなどの他のMCPは「その場限りの操作」に留まりますが、maestro MCPはE2Eテスト資産との循環を生み出せます。機能実装時にMCPで動作確認し、確認できた操作をYAMLに落とし込む。このサイクルこそが、maestro MCPを選ぶ最大の理由だと考えています。

### セットアップ

maestro MCPを使い始めるには、まずMaestro CLIのインストールが必要です。詳細は公式ドキュメントを参照してください。

https://docs.maestro.dev/getting-started/maestro-mcp

## 現時点での課題

正直に言うと、MCPでのモバイルアプリ操作はまだ発展途上だと感じています。私が試した中で感じた課題を共有しておきます。

### 操作の安定性

アプリの起動タイミングやシミュレータの状態によって、操作が失敗することがあります。また、非同期処理（ローディング中など）の待機が難しい場面もありました。

### セットアップの手間

シミュレータ/エミュレータの起動、アプリのインストールなど、MCPを使う前の準備が必要です。Flutterの場合、デバッグビルドでの動作確認が基本となるため、ビルド時間も考慮する必要があります。

### ツールの成熟度

mobile MCP、maestro MCPともにまだ活発に開発中のツールです。ドキュメントが十分でない部分もあり、実際に動かしてみないとわからないこともあります。

### identifier検出の違い

実機検証の結果、mobile MCPではFlutterのButton系ウィジェット（FloatingActionButton, IconButton等）に設定した`Semantics.identifier`が検出されないケースがありました。一方、maestro MCPでは同じ要素の`resource-id`が安定して検出されました。

:::details 要素取得の出力比較（実機検証結果）
**Maestro MCP (inspect_view_hierarchy)**
```csv
36,11,"[251,768][386,824]","accessibilityText=Add new todo; resource-id=todo-fab-add; enabled=true",35
19,11,"[338,78][386,126]","accessibilityText=Settings; resource-id=settings-button; enabled=true",18
```

**Mobile MCP (list_elements_on_screen)**
```json
{"type":"Button","label":"New Task","name":"New Task","coordinates":{"x":251,"y":768,"width":135,"height":56}}
{"type":"Button","label":"Settings","name":"Settings","coordinates":{"x":338,"y":78,"width":48,"height":48}}
```

→ Mobile MCPでは `identifier` (resource-id) が出力されていない
:::

これはFlutter固有の問題というより、mobile MCPがiOSのアクセシビリティAPIから特定の属性を取得する際の制限と考えられます。座標指定タップを行う場合はこの制限の影響を受けませんが、要素の特定にidentifierを活用したい場合はmaestro MCPの方が適しています。

これらの課題を踏まえた上で、ユースケースを見極めて導入するのが良いかと思います。私は「AIに機能実装させた後のスモークテスト」くらいの用途から始めています。

## まとめ

mobile MCPやmaestro MCPを使えば、AI駆動開発においてモバイルアプリのUI検証を自動化できる可能性が広がります。私が試した範囲では、maestro MCPとFlutterのSemantics設計の組み合わせが比較的スムーズに動作しました。

Boris氏の言葉にあるように、AIに検証方法を与えることでフィードバックループが回り、開発の質が向上するはずです。まだ試行錯誤の段階ではありますが、この記事が同じ課題を抱えている方の参考になれば幸いです。

### 今日からできる最初の一歩

1. **参考リポジトリを動かしてみる** - Semanticsの実装例とMaestroシナリオのサンプルを確認
2. **自分のアプリにSemantics IDを設定する** - まずは主要な画面から始める
3. **maestro MCPでAIに操作させてみる** - Claude CodeやCursorで試す

**参考リポジトリ**
https://github.com/K9i-0/flutter_e2e_investigation
