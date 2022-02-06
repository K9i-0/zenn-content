---
title: "AndroidのDebug用keystoreを共有する"
emoji: "🐙"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["android", "Flutter"]
published: false
---
# 鍵を生成する
```
keytool -J-Dkeystore.pkcs12.legacy -genkey -v -keystore debug.keystore -keyalg RSA -validity 10950 -storepass android -alias androiddebugkey -dname "CN=Android Debug, O=Android, C=US"

```

# ハッシュを出力する

```
keytool -list -v -keystore debug.keystore -alias androiddebugkey -storepass android -keypass android
```