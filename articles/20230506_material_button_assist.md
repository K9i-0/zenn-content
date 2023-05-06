---
title: "【Flutter】custom_lintを使ったパッケージを作ってみた"
emoji: "🐙"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["flutter", "dart", "customlint", "materialdesign"]
published: false
---

## はじめに
現在FlutterFireなどで有名なInvertaseがContent Creation Competition 2023というコンペを開催しています。
コンペに参加するには文書、動画、音声いずれかのコンテンツを作って5/24までに応募すればOKです。
https://twitter.com/invertaseio/status/1650532933210439681?s=20

コンペはInvertaseが関わってる以下のOSSに題材にすれば良いみたいです。
今回Custom Lintsを使ったパッケージをコンペ向けに作ってみたので、この記事では作成したパッケージについて紹介します。

![](/images/2023-05-06-12-12-37.png)

## 作成したパッケージの紹介
Material DesignのCommon buttonsを使いやすくするmaterial_button_assistというパッケージを作成しました。

https://pub.dev/packages/material_button_assist

Common buttonsというのは以下の5つのボタンです。

![](/images/2023-05-06-12-23-49.png)

Flutterの場合以下のようなコードになります。
```dart:アイコン無し
ElevatedButton(
  onPressed: () {},
  child: const Text('Hello World!'),
),
FilledButton(
  onPressed: () {},
  child: const Text('Hello World!'),
),
FilledButton.tonal(
  onPressed: () {},
  child: const Text('Hello World!'),
),
OutlinedButton(
  onPressed: () {},
  child: const Text('Hello World!'),
),
TextButton(
  onPressed: () {},
  child: const Text('Hello World!'),
),
```

アイコンがある場合はこうです。
```dart:アイコン有り
ElevatedButton.icon(
  onPressed: () {},
  label: const Text('Hello World!'),
  icon: const Icon(Icons.abc),
),
FilledButton.icon(
  onPressed: () {},
  label: const Text('Hello World!'),
  icon: const Icon(Icons.abc),
),
FilledButton.tonalIcon(
  onPressed: () {},
  label: const Text('Hello World!'),
  icon: const Icon(Icons.abc),
),
OutlinedButton.icon(
  onPressed: () {},
  label: const Text('Hello World!'),
  icon: const Icon(Icons.abc),
),
TextButton.icon(
  onPressed: () {},
  label: const Text('Hello World!'),
  icon: const Icon(Icons.abc),
),
```
今回作ったパッケージは、自分が感じた以下の課題感を解決するものです。
- ボタン名前を忘れがち
- Filled tonal buttonだけ書き方が違う
- iconの有無で、引数名がchildかlabelか変わる

### material_button_assistの提供するアシスト
material_button_assistは、先程述べた課題を解決する３つのアシストを提供します。

#### Convert to other button
Common buttonsのいずれかのボタンを他のボタンに変換するアシストです。
VS CodeならボタンWidgetのカーソルが合った状態でCommand + .を押すとConvert to 〇〇Buttonという項目が表示され変換できます。

このアシストを使うことで、5つのボタン名をうろ覚えでも選べるようになるほか、Filled tonal buttonの書き方の違いにも柔軟に対応できます。
![](/images/convert-to-other-button.gif)

#### Add icon
ボタンをアイコン有りに変換します。
変換時にchildをlabelに変換し、iconがない場合は仮の値を設定します。

![](/images/add-icon.gif)

#### Remove icon
Add iconの逆の変換です。
![](/images/remove-icon.gif)

## material_button_assistのようなパッケージの作り方

## まとめ
custom_lintを使ったmaterial_button_assistパッケージを作った話でした。

material_button_assistのソースコードは以下のリポジトリで管理しています。気に入った方はスターしてもらえると嬉しいです。

https://github.com/K9i-0/material_widget_lint/tree/main/packages/material_button_assist