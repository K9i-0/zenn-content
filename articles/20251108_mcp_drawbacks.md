---
title: "MCPの3つの欠点 - よりよく使うために知っておきたいこと"
emoji: "🐙"
type: "idea"
topics: ["MCP", "AI", "Claude", "Anthropic", "AIエージェント",]
published: false
---

MCPが銀の弾丸のように過信されているように感じます。実際には便利で強力なツールですが、設計上の制限と課題があります。**MCPを批判するのではなく、より良く使うために欠点を理解すること**が大切です。

## MCPの3つの欠点

### 1. AIエージェントは必ずしもMCPが得意でない

LLMはコード作成での訓練は豊富ですが、**ツール呼び出しの訓練データは非常に限定的**です[^1]。実際のツール呼び出し例は合成データのみに基づいており、自然言語に存在しない特殊なトークン体系で構成されています。

そのため、LLMはTypeScriptやCLIツールの方が上手く扱えることが多いです。あなたも経験したのではないでしょうか？**GitHub MCPよりも`gh`コマンドの方が上手くいく**という経験。これは必ずしも実装の問題ではなく、**LLMの学習特性による根本的な限界**なのです。

### 2. MCPツールの事前ロードでコンテキストが圧迫される

AIエージェントを使う際、**コンテキストウィンドウの制御は性能を大きく左右します**。適切な粒度のタスクに対して、必要なコンテキストだけを与えることが重要です。

MCPを使う場合、ほとんどのクライアントはすべてのツール定義を事前にコンテキストへ直接ロードします[^2]。これにより、ツールの説明がコンテキストウィンドウのスペースを占有し、応答時間とコストが増加します[^3]。

数が少ないツールでも影響はあります。Obsidian MCPを入れたら、指示してないのに勝手にObsidianに保存し始めた経験はありませんか？**これはツール定義がコンテキストを支配し、意図しない動作を引き起こしている**良い例です。

さらに規模が大きくなると問題は深刻化します。エージェントが数千のツールに接続されている場合、**リクエストを読み込む前に数十万トークンの処理が必要**になります[^4]。この課題に対して、必要なツールのみをオンデマンドで読み込むアプローチが提案されています。これにより、トークン使用量を150,000トークンから2,000トークンへ削減でき、時間とコストが98.7%節約される可能性があります[^5]。

### 3. MCPのやり取り情報もコンテキストを圧迫する

さらに厄介なのは、**MCPクライアントとエージェント間のやり取り自体がコンテキストを消費する**ということです。

具体例を挙げます。Google DriveのトランスクリプトをSalesforceに転送するタスクを考えてください。2時間の会議録音を処理する場合、**完全なトランスクリプトがツール呼び出しの前後で複数回通過**します。結果として、約50,000トークンの追加処理が発生します。

コンテキストが埋まれば、本来のタスク遂行に直接的な悪影響を及ぼします。

## MCPは万能ではない

MCPは便利で強力です。しかし、これらの欠点を理解した上で使う必要があります。

**用途に応じた使い分けが大切です。**複雑なデータ処理には向かないかもしれません。その場合は、code executionやCloudflareの「Code Mode」のような代替案を検討する価値があります。

MCPの欠点を知ることは、それを**より効果的に活用するための第一歩**です。

[^1]: Cloudflareの記事より："LLMs have seen a lot of code. They have not seen a lot of 'tool calls.'"（LLMは多くのコードを見てきました。しかし、多くの『ツール呼び出し』は見ていません）出典: [Cloudflare: Code Mode](https://blog.cloudflare.com/code-mode/)

[^2]: Anthropicの記事より："Most MCP clients load all tool definitions upfront directly into context, exposing them to the model using a direct tool-calling syntax."（ほとんどのMCPクライアントは、すべてのツール定義を事前にコンテキストへ直接ロードし、直接的なツール呼び出し構文を使用してモデルに公開します）出典: [Anthropic: Code Execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)

[^3]: Anthropicの記事より："Tool descriptions occupy more context window space, increasing response time and costs."（ツールの説明がコンテキストウィンドウのスペースを占有し、応答時間とコストが増加します）出典: [Anthropic: Code Execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)

[^4]: Anthropicの記事より："In cases where agents are connected to thousands of tools, they'll need to process hundreds of thousands of tokens before reading a request."（エージェントが数千のツールに接続されている場合、リクエストを読む前に数十万トークンを処理する必要があります）出典: [Anthropic: Code Execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)

[^5]: Anthropicの記事より："This reduces the token usage from 150,000 tokens to 2,000 tokens—a time and cost saving of 98.7%."（これにより、トークン使用量が150,000トークンから2,000トークンに削減され、時間とコストが98.7%節約されます）出典: [Anthropic: Code Execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)

---

## 参考

- [Cloudflare: Code Mode](https://blog.cloudflare.com/code-mode/) - MCPの限界を指摘し、コード実行による代替案を提示
- [Anthropic: Code Execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp) - MCPのコンテキスト課題と設計について詳しく説明
