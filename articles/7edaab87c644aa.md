---
title: "Grinderタスクを複数プロジェクトで共有する方法"
emoji: "🐙"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["flutter", "dart", "grinder"]
published: false
---
## はじめに
GrinderはDart言語で作成されたタスクをターミナルやCIで実行できる便利なパッケージです。Flutterプロジェクトにコマンドを簡単に紐付けることができ、多くの開発者に支持されています。

しかし、Grinderを業務や個人のプロジェクトで頻繁に利用していると、一つの課題が浮かび上がります。複数のプロジェクトでGrinderタスク名を統一し、新たな便利なタスクを作成した際に他のプロジェクトにもすぐ反映させたいというニーズがあります。

そこで、この記事では、Grinderタスクを複数のプロジェクトで共有する方法を紹介します。

## サンプル
実装方法の説明の前に、実際に共有用のタスクを提供するパッケージを作成したので紹介します。

https://pub.dev/packages/k9i_cli

こちらのパッケージは4つのGrinderタスクを提供します。実際に導入してみましょう。

### 依存の追加
pubspec.yamlのdev_dependenciesにgrinderとk9i_cliを追加します。

```yaml:pubspec.yaml
dev_dependencies:
  grinder: ^0.9.3
  k9i_cli: ^1.0.0
```

### タスクの読み込み
grind.dartのmainでgrind(arg)の前にaddAllTasksを追記します。


```dart:tool/grind.dart
import 'package:grinder/grinder.dart';
import 'package:k9i_cli/k9i_cli.dart';

void main(List<String> args) {
  // Add all tasks from the k9i_cli package.
  addAllTasks();

  grind(args);
}
```

### 実行
grind -hでタスクが追加されていることを確認します。
４つのタスクが読み込まれています🥳
```
Available tasks:
  build                flutter pub run build_runner build --delete-conflicting-outputs
  watch                flutter pub run build_runner watch --delete-conflicting-outputs
  serveWeb             Serve Flutter web app on local IP.
  updatePods           Clean and update Pods installation.
```
余談ですが、アノテーションを使った場合と違って、タスク名がケバブケースにならないみたいです👀

## 実装
サンプルの説明からわかるように、Grinderタスクをdartのパッケージ化することで複数プロジェクトでタスクを共有できます。

### パッケージの作成
適当な方法でパッケージを作成します。
```
dart create -t package-simple パッケージ名
```

### タスクの書き方
普通にGrinderを使うときはアノテーションを使ってタスクを記述しますが、今回はaddTask関数を使うことでタスクを記述します。

https://google.github.io/grinder.dart/grinder/addTask.html

以下はlogを出力するだけのシンプルなタスクです。

```dart
void addSampleTask() {
  addTask(
    GrinderTask(
      'sample',
      description: 'Sample task',
      taskFunction: () {
        log('Sample task');
      },
    ),
  );
}
```

### 公開
先程作ったタスクをメインのプロジェクトで利用するために、パッケージを公開する必要があります。
以下のどちらかが良いかと思います。

1. かぶりにくい名前でpub.devに公開する
2. Githubなどのpublicリポジトリで公開する

#### かぶりにくい名前でpub.devに公開する
サンプルのやり方です。
pub.devは同じ名前でパッケージを登録できないため、自分しか使わないパッケージを公開しないほうが良いかと思います。k9i_cliはそんな名前使いたいの自分だけだろと割り切って登録しています😅

#### Githubなどのpublicリポジトリで公開する
pubspec.yamlはgitリポジトリを参照することができるので、publicリポジトリとしてパッケージを公開しても良いです。

k9i_cliを例にすると以下ような書き方です。
```yaml:pubspec.yaml
dev_dependencies:
  k9i_cli:
    git:
      url: https://github.com/K9i-0/k9i_cli.git
      ref: ^1.0.0 # tagやブランチ名
```

### grind.dartの編集
最後にgrind.dartを編集したら利用できます。
```dart:tool/grind.dart
import 'package:grinder/grinder.dart';
import 'package:k9i_cli/k9i_cli.dart';

void main(List<String> args) {
  addSampleTask();

  grind(args);
}
```

## まとめ
Grinderタスクを複数プロジェクトで共有する方法でした。

サンプルで紹介したパッケージのリポジトリです。参考にどうぞ🚀
https://github.com/K9i-0/k9i_cli