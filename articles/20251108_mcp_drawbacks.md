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

さらに厄介なのは、**MCPクライアントとエージェント間のやり取り自体がコンテキストを消費する**ということです。MCPでは、ツール呼び出しとその結果がすべてモデルのコンテキストを通過します[^6]。

具体例を挙げます。Google DriveのトランスクリプトをSalesforceに転送するタスクを考えてください。2時間の会議録音を処理する場合、**完全なトランスクリプトがツール呼び出しの前後で複数回通過**します[^7]。結果として、約50,000トークンの追加処理が発生します。

コンテキストが埋まれば、本来のタスク遂行に直接的な悪影響を及ぼします。また、大規模なドキュメントや複雑なデータ構造の場合、データコピー時のエラーも発生しやすくなります[^8]。

この課題への対策として、**サブエージェントを活用する**方法があります。サブエージェントは独立したコンテキストで動作し、MCPツールを選択的に割り当てられます[^9]。例えば、Google Drive操作とSalesforce操作をそれぞれ別のサブエージェントに委譲すれば、中間データがメインエージェントのコンテキストを通過せず、トークン消費を大幅に削減できる可能性があります。

## MCPは万能ではない

MCPは便利で強力です。しかし、これらの欠点を理解した上で使う必要があります。

**用途に応じた使い分けが大切です。**複雑なデータ処理には向かないかもしれません。その場合は、code executionやCloudflareの「Code Mode」のような代替案を検討する価値があります。

MCPの欠点を知ることは、それを**より効果的に活用するための第一歩**です。

[^1]: Cloudflareの記事より："LLMs have seen a lot of code. They have not seen a lot of 'tool calls.'"（LLMは多くのコードを見てきました。しかし、多くの『ツール呼び出し』は見ていません）出典: [Cloudflare: Code Mode](https://blog.cloudflare.com/code-mode/)

[^2]: Anthropicの記事より："Most MCP clients load all tool definitions upfront directly into context, exposing them to the model using a direct tool-calling syntax."（ほとんどのMCPクライアントは、すべてのツール定義を事前にコンテキストへ直接ロードし、直接的なツール呼び出し構文を使用してモデルに公開します）出典: [Anthropic: Code Execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)

[^3]: Anthropicの記事より："Tool descriptions occupy more context window space, increasing response time and costs."（ツールの説明がコンテキストウィンドウのスペースを占有し、応答時間とコストが増加します）出典: [Anthropic: Code Execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)

[^4]: Anthropicの記事より："In cases where agents are connected to thousands of tools, they'll need to process hundreds of thousands of tokens before reading a request."（エージェントが数千のツールに接続されている場合、リクエストを読む前に数十万トークンを処理する必要があります）出典: [Anthropic: Code Execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)

[^5]: Anthropicの記事より："This reduces the token usage from 150,000 tokens to 2,000 tokens—a time and cost saving of 98.7%."（これにより、トークン使用量が150,000トークンから2,000トークンに削減され、時間とコストが98.7%節約されます）出典: [Anthropic: Code Execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)

[^6]: Anthropicの記事より："Most MCP clients load all tool definitions upfront directly into context, exposing them to the model using a direct tool-calling syntax."（ほとんどのMCPクライアントは、すべてのツール定義を事前にコンテキストに直接ロードし、直接的なツール呼び出し構文を使用してモデルに公開します）出典: [Anthropic: Code Execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)

[^7]: Anthropicの記事より："Every intermediate result must pass through the model. In this example, the full call transcript flows through twice. For a 2-hour sales meeting, that could mean processing an additional 50,000 tokens."（すべての中間結果はモデルを通過しなければなりません。この例では、会議の完全なトランスクリプトが2回流れます。2時間の営業会議の場合、追加で50,000トークンを処理することを意味する可能性があります）出典: [Anthropic: Code Execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)

[^8]: Anthropicの記事より："With large documents or complex data structures, models may be more likely to make mistakes when copying data between tool calls."（大規模なドキュメントや複雑なデータ構造の場合、ツール呼び出し間でデータをコピーする際にモデルがエラーを犯す可能性が高くなります）出典: [Anthropic: Code Execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)

[^9]: Claude Codeドキュメントより：「各サブエージェントは独立したコンテキストで動作し、メイン会話の汚染を防ぎ、高レベルの目標に焦点を当てた状態を保ちます」また「サブエージェントは設定されたMCPサーバーからのMCPツールにアクセスできます」出典: [Claude Code: サブエージェント](https://code.claude.com/docs/ja/sub-agents)

---

## 参考

- [Cloudflare: Code Mode](https://blog.cloudflare.com/code-mode/) - MCPの限界を指摘し、コード実行による代替案を提示
- [Anthropic: Code Execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp) - MCPのコンテキスト課題と設計について詳しく説明
- [Claude Code: サブエージェント](https://code.claude.com/docs/ja/sub-agents) - MCPタスクをサブエージェントに委譲してコンテキストを分離する方法
