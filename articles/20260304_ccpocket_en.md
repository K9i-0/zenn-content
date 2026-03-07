---
title: "CC Pocket – English version for dev.to"
---

<!-- dev.to front matter (paste this when creating the post on dev.to):
---
title: "I built a mobile app to control Claude Code and Codex from my phone"
published: true
tags: claudecode, flutter, productivity, opensource
cover_image: (upload ccpocket_overview.png here)
---
-->

I use Claude Code and Codex CLI for most of my side projects. The problem? Every time the agent needs approval or finishes a task, I have to walk over to my Mac. That's fine during work hours, but on weekends I just want to kick things off from the couch and check in from my phone.

There are terminal-sharing approaches and Claude Code now has `/remote-control`, but none of them felt right on a phone screen. So I built my own: **CC Pocket** — a mobile app designed specifically for controlling AI coding agents remotely.

![CC Pocket overview](/images/ccpocket_en_overview.png)
<!-- dev.to: Replace path with uploaded image URL -->

## What makes it useful

### Approve tool calls without opening a session

The #1 thing you do when monitoring Claude Code from your phone is tap "approve." CC Pocket puts the approval UI right on the session list — no need to open individual sessions. Running 3 agents in parallel? Just scroll and tap.

![Approval UI on session list](/images/ccpocket_en_approval_list.png)

### Spin up new sessions from your phone

You're not limited to resuming sessions from your Mac. Pick a project, choose a permission mode and model, and go. You can even create a **git worktree** at session start — branch, worktree, and session, all without touching your laptop.

![New session screen](/images/ccpocket_en_new_session.png)

### Prompt input that doesn't suck on mobile

I spent a lot of time on this because phone keyboards + long prompts = pain. Here's what I built:

- **`/` command completion** — Tap `/` to get an overlay of all available slash commands
- **`@` file mentions** — Browse and insert file paths instead of typing them
- **Bullet list mode** — Auto-inserts `-` on newline with indent/dedent buttons. Handy for markdown-style prompts
- **Prompt history** — Saved to SQLite, searchable by frequency or favorites. Stop retyping the same instructions

![Rich prompt input](/images/ccpocket_en_markdown_input.png)

### Name your sessions

Claude Code's session list shows IDs, which are useless for finding anything later. CC Pocket hooks into the CLI's `/rename` command so you can name sessions. Filter by named sessions only to quickly find the ones that matter.

### Diff viewer (with image diffs!)

Review what the agent changed, right on your phone. Text diffs show in unified format with add/delete highlighting. Image diffs get three modes:

- **Side by side** — Before and after, next to each other
- **Slider** — Drag a divider across the image
- **Overlay** — Adjust opacity to layer before/after

You can also select specific hunks and attach them to the chat — great for saying "change *this part* like so."

![Diff viewer](/images/ccpocket_en_git_diff.png)

### Built with itself

Once CC Pocket could control Claude Code, I started developing CC Pocket *through* CC Pocket. The feedback loop is tight — I hit a UX annoyance, fix it through the app, and the fix ships in the same session. Dogfooding at its finest.

## Architecture

```
Phone (CC Pocket) ←WebSocket→ Bridge Server (Mac) ←stdio→ Claude Code / Codex CLI
```

CC Pocket talks to a lightweight **bridge server** on your Mac that manages agent processes via the Claude Code SDK and Codex CLI.

### Setup (< 5 min)

**1. Network:** Your Mac and phone need to be reachable. Same Wi-Fi works. For anywhere-access, [Tailscale](https://tailscale.com/) is the easiest option — one-click mesh VPN, no port forwarding.

**2. Bridge server:** One command:

```bash
npx @ccpocket/bridge@latest
```

It shows a QR code with connection details.

![Bridge startup](ccpocket_bridge.png)

> **Tip:** Set `BRIDGE_DEMO_MODE=true` to strip sensitive info from the QR code — useful for screenshots and demos.

**3. Connect:** Scan the QR code from CC Pocket's launch screen. Then either tap **+** for a new session or pick one from your Mac's session history.

![Launch and first connection](/images/ccpocket_en_launch_and_first.png)
<!-- TODO: 英語セッション履歴の状態でスクショを撮り直して ccpocket_en_launch_and_first.png として保存する -->

## Install

Available on both stores:

- [App Store (iOS)](https://apps.apple.com/us/app/cc-pocket-dev-agent-remote/id6759188790)
- [Google Play (Android)](https://play.google.com/store/apps/details?id=com.k9i.ccpocket)

The project is fully open source:

{% github K9i-0/ccpocket %}

## Tech Stack

| Component | Tech |
|-----------|------|
| Mobile app | Flutter (Dart), BLoC, SQLite, FCM |
| Bridge server | TypeScript, Node.js, WebSocket, `@anthropic-ai/claude-agent-sdk`, `@openai/codex-sdk` |
| Networking | Tailscale / local Wi-Fi, mDNS auto-discovery |

## Try it out

If you use Claude Code or Codex for side projects, give it a spin. Approve tool calls from bed, start sessions from a coffee shop, review diffs on the train. Your Mac doesn't need you sitting in front of it.

Feedback, issues, and PRs are welcome on [GitHub](https://github.com/K9i-0/ccpocket). And if you find it useful, a star goes a long way.

---

*Now if only Apple would make an iPhone Fold so I could see more code on this screen...*
