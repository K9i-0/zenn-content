---
title: "CC Pocket – English version for dev.to"
---

<!-- dev.to front matter (paste this when creating the post on dev.to):
---
title: "I built CC Pocket – a mobile app to control Claude Code / Codex on your Mac"
published: true
tags: claudecode, flutter, productivity, opensource
cover_image: (upload ccpocket_overview.png here)
---
-->

When you're using AI coding agents like Claude Code or OpenAI Codex, having to walk over to your Mac every time the agent asks for approval or finishes a task gets old fast.

For work, sure, you deal with it. But for side projects? I want to approve tool calls while taking a walk or lying in bed.

There are terminal-based approaches and Claude Code's built-in `/remote-control`, but I wasn't satisfied with the mobile UX — so I built **CC Pocket**, a mobile app optimized for controlling AI coding agents from your phone.

![CC Pocket overview](/images/ccpocket_en_overview.png)
<!-- dev.to: Replace path with uploaded image URL -->

## Key Features

### One-tap approvals from the session list

The most frequent action when using Claude Code from your phone is **approving tool calls**. CC Pocket shows approval UI directly on the session list, so you can approve without even opening a session. When running multiple sessions in parallel, you can blast through approvals one after another.

![Approval UI on session list](/images/ccpocket_en_approval_list.png)

### Start new sessions from your phone

CC Pocket isn't just for resuming sessions created on your Mac — you can start brand new sessions from the app. Choose a project, permission mode, and model. You can even create a **git worktree** at session start. Branch, worktree, session — all from your phone.

![New session screen](/images/ccpocket_en_new_session.png)

### Rich prompt input on mobile

Just because you're on a phone doesn't mean your prompts should suffer. I put a lot of effort into the input experience:

- **Slash command completion** — Tap the `/` button or type `/` to get an overlay of available commands
- **File mentions** — Tap `@` or type `@` to browse and insert file paths without typing them manually
- **Bullet list assist** — Auto-inserts `-` on newline, with indent/dedent buttons for nesting. Great if you write markdown-style prompts
- **Prompt history** — Past prompts are saved to SQLite and searchable by frequency or favorites. No more retyping common instructions

![Rich prompt input](/images/ccpocket_en_markdown_input.png)

### Named session history

Claude Code's session list is ID-based, which makes it impossible to tell sessions apart later. CC Pocket uses the CLI's `/rename` mechanism to let you name sessions from the app. You can also filter to show only named sessions, making it easy to find important ones.

### Diff viewer with image support

CC Pocket includes a diff viewer to review file changes the agent made — right on your phone.

Text files are shown in unified diff format with added/deleted line highlighting. For **image diffs**, you get three comparison modes:

- **Side by side** — Before and after, shown next to each other
- **Slider** — Drag a divider to compare
- **Overlay** — Adjust opacity to layer images on top of each other

You can also select specific hunks from the diff and attach them to your chat — making it easy to say "change this part like so."

![Diff viewer](/images/ccpocket_en_git_diff.png)

### Dogfooding: built with itself

Once CC Pocket was functional enough to control Claude Code, I started using CC Pocket to develop CC Pocket. This loop surfaces UX friction immediately — "this operation is annoying" or "I need more info here" — and I fix it right away through CC Pocket itself.

## How It Works

```
Phone (CC Pocket) ←WebSocket→ Bridge Server (Mac) ←stdio→ Claude Code / Codex CLI
```

CC Pocket connects to a lightweight **bridge server** running on your Mac, which manages Claude Code and Codex CLI processes.

### 1. Connect your Mac and phone via Tailscale

CC Pocket assumes your Mac and phone are on the same network. [Tailscale](https://tailscale.com/) is the easiest way to do this — many developers already have it set up for tools like [mosh](https://mosh.org/).

> If you're only using it at home on the same Wi-Fi, you can skip Tailscale entirely.

### 2. Start the bridge server on your Mac

The bridge server controls Claude Code SDK and Codex processes on your behalf. Start it with a single command:

```bash
npx @ccpocket/bridge@latest
```

It will display a QR code and connection info.

![Bridge startup](ccpocket_bridge.png)

> Tip: Set `BRIDGE_DEMO_MODE=true` to strip sensitive info (Tailscale IP, API key) from the QR code — handy for demos and screenshots.

### 3. Connect CC Pocket to the bridge

Tap the QR code button on the app's launch screen and scan the code shown by the bridge server. After connecting, either tap **+** to start a new session or resume one from your Mac's session history.

![Launch and first connection](/images/ccpocket_en_launch_and_first.png)
<!-- TODO: 英語セッション履歴の状態でスクショを撮り直して ccpocket_en_launch_and_first.png として保存する -->

## Install

CC Pocket is available on both app stores:

- 📱 [App Store (iOS)](https://apps.apple.com/us/app/cc-pocket-dev-agent-remote/id6759188790)
- 🤖 [Google Play (Android)](https://play.google.com/store/apps/details?id=com.k9i.ccpocket)

The project is open source — stars are appreciated!

- ⭐ [GitHub: K9i-0/ccpocket](https://github.com/K9i-0/ccpocket)

## Tech Stack

For those curious:

| Component | Tech |
|-----------|------|
| Mobile app | Flutter (Dart), BLoC pattern, SQLite, Firebase Cloud Messaging |
| Bridge server | TypeScript, Node.js, WebSocket (`ws`), `@anthropic-ai/claude-agent-sdk`, `@openai/codex-sdk` |
| Networking | Tailscale / local Wi-Fi, mDNS auto-discovery |

## Wrapping Up

If you use Claude Code or Codex for side projects, give CC Pocket a try. Approve tool calls from the couch. Start new sessions from the park. Your Mac doesn't need you hovering over it.

I want an iPhone Fold.
