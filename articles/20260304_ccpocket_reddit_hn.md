---
title: "Reddit / Hacker News 投稿用テンプレート"
---

<!-- ============================================ -->
<!-- r/ClaudeAI 投稿用 -->
<!-- ============================================ -->

## Reddit (r/ClaudeAI)

**Title:** I built CC Pocket — a mobile app to approve tool calls and control Claude Code sessions from your phone

**Body:**

I got tired of walking to my Mac every time Claude Code needed approval for a tool call, so I built **CC Pocket** — a mobile app that lets you control Claude Code (and Codex) sessions remotely.

**What it does:**

- **One-tap approvals** from the session list — no need to open each session
- **Start new sessions** from your phone (project, model, permission mode, even git worktree creation)
- **Rich prompt input** with slash command completion, @file mentions, bullet list assist, and prompt history
- **Diff viewer** with image comparison (side-by-side, slider, overlay)
- **Named sessions** so you can actually find things later
- **Push notifications** when the agent needs your attention

**How it works:**

A lightweight bridge server runs on your Mac (`npx @ccpocket/bridge@latest`) and connects to Claude Code / Codex CLI via stdio. Your phone connects to the bridge via WebSocket over Tailscale or local Wi-Fi.

```
Phone ←WebSocket→ Bridge Server (Mac) ←stdio→ Claude Code CLI
```

**Links:**

- iOS: https://apps.apple.com/us/app/cc-pocket-dev-agent-remote/id6759188790
- Android: https://play.google.com/store/apps/details?id=com.k9i.ccpocket
- GitHub (open source): https://github.com/K9i-0/ccpocket

Built with Flutter + TypeScript. Would love feedback!

<!-- ============================================ -->
<!-- Hacker News (Show HN) 投稿用 -->
<!-- ============================================ -->

## Hacker News (Show HN)

**Title:** Show HN: CC Pocket – Control Claude Code and Codex from your phone

**URL:** https://github.com/K9i-0/ccpocket

**Text (optional — HN では URL 投稿の場合 text は省略可。text を入れる場合は以下):**

CC Pocket is a mobile app (iOS/Android) for remotely controlling Claude Code and OpenAI Codex sessions running on your Mac.

A bridge server on your Mac (`npx @ccpocket/bridge@latest`) connects to the CLI tools via stdio and exposes a WebSocket API. The mobile app connects over Tailscale or local Wi-Fi.

Key features: one-tap tool approvals from session list, start new sessions from phone (with git worktree support), rich prompt input with file mentions and slash commands, diff viewer with image comparison, push notifications.

Built with Flutter (mobile) and TypeScript (bridge). Open source under MIT.

GitHub: https://github.com/K9i-0/ccpocket
