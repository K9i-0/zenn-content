---
title: "Reddit / Hacker News 投稿用テンプレート"
---

<!-- ============================================ -->
<!-- r/ClaudeAI 投稿用 -->
<!-- ============================================ -->

## Reddit (r/ClaudeAI)

**Title:** I built a mobile app to approve tool calls and manage Claude Code sessions from my phone

**Body:**

Anyone else running Claude Code for side projects and getting annoyed at having to walk to their Mac every time it asks for permission? I was literally getting up from the couch every 5 minutes just to hit "approve."

So I built **CC Pocket** — a mobile app for controlling Claude Code (and Codex) from your phone.

The thing I'm most proud of: **approvals show up right on the session list**, so you can just scroll and tap without opening each session. If you're running multiple agents in parallel, you can blast through them.

Other stuff it does:

- Start new sessions from your phone — pick a project, model, permission mode, even create a git worktree
- Rich prompt input with `/` command completion, `@` file mentions, and bullet list formatting
- Diff viewer with image comparison (side-by-side, slider, overlay)
- Name your sessions so you can actually find them later
- Push notifications when the agent needs you

**How it connects:**

A small bridge server runs on your Mac and talks to Claude Code via the SDK. Your phone connects over WebSocket (Tailscale or same Wi-Fi).

```
Phone ←WebSocket→ Bridge (Mac) ←stdio→ Claude Code / Codex
```

Setup is just `npx @ccpocket/bridge@latest`, scan a QR code, and you're in.

**Links:**

- [App Store (iOS)](https://apps.apple.com/us/app/cc-pocket-dev-agent-remote/id6759188790)
- [Google Play (Android)](https://play.google.com/store/apps/details?id=com.k9i.ccpocket)
- [GitHub (open source)](https://github.com/K9i-0/ccpocket)

It's open source (Flutter + TypeScript). Happy to answer questions or hear feedback!

<!-- ============================================ -->
<!-- Hacker News (Show HN) 投稿用 -->
<!-- ============================================ -->

## Hacker News (Show HN)

**Title:** Show HN: CC Pocket – Mobile client for Claude Code and Codex via WebSocket bridge

**URL:** https://github.com/K9i-0/ccpocket

**Text (optional — HN では URL 投稿の場合 text は省略可。text を入れる場合は以下):**

CC Pocket is a mobile app (iOS/Android) for remotely controlling Claude Code and Codex CLI sessions on your Mac.

Architecture: a bridge server on the Mac (`npx @ccpocket/bridge@latest`) wraps the Claude Code SDK and Codex CLI via stdio, exposing a WebSocket API. The phone connects over Tailscale or local Wi-Fi.

The main use case is approving tool calls without being at the keyboard. Approvals are surfaced directly on the session list so you can handle multiple agents quickly. You can also start new sessions (with git worktree creation), write prompts with file mention and slash command completion, and review diffs including image comparisons.

Flutter (Dart) on the client, TypeScript on the bridge. MIT licensed.
