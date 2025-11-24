---
title: "DocCommentの充実が結局AIファーストだと思う理由 - SDD流行へのアンチテーゼ"
emoji: "🐙"
type: "tech"
topics: ["AI", "claudecode", "AIエージェント", "SDD", "documentation",]
published: false
---

AIコーディング、特にCursorやClaude Codeのようなツールの普及に伴い、「AIにいかに正確なコンテキストを与えるか」が開発者の最大の関心事になっています。

その中で現在、**SDD（Spec Driven Development）的なアプローチ——つまり、詳細なMarkdown仕様書を書き、それをAIに読み込ませて実装する手法——が注目されています。しかし、私は実務での経験を通じて、「仕様書を充実させるよりも、コード内のDocCommentを充実させるシンプルなアプローチこそが、AIファーストな開発である」**という結論に至りました。

本記事では、Flutter開発の現場で採用している運用と、その技術的背景にある「Agentic Search（自律的探索）」の特性について解説します。