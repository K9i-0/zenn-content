---
title: "Codex for Claude Code Users: What to Know Before You Try It"
published: false
description: "A hands-on guide for Claude Code users who want to try Codex and understand Codex App, plans, permissions, config files, and mobile workflows."
tags: codex, ai, claude, productivity
---

## Introduction

I've been seeing more developers say that Codex has become easier to use, more cost-effective, or simply a better fit for some workflows than it used to be.

This is not a "Claude Code is bad, everyone should switch" article. I still use Claude Code at work, and if cost were less of a factor in my personal setup, I would probably be using both more actively.

If you're already comfortable with Claude Code and you're wondering whether Codex is worth trying too, this guide covers the things I wish I had known when I started using it.

This is based on my own usage and observations as of May 2026.

## My Codex Background

I used to be mainly a Claude Code user. For about half a year, Codex was only my secondary tool.

Around GPT-5.4, I started to feel that Codex had become strong enough for my day-to-day coding work. For personal projects, I eventually moved almost entirely to Codex because cost and usage limits mattered a lot to me.

For work, I still use Claude Code. Partly because of internal approval and procurement reasons, but also because I don't think this has to be an either-or decision. In a team setting, I would be happy to use both depending on the project and constraints.

![a chart or screenshot showing that your Claude commits have decreased](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tfbnlxll5sgkobgzy5ex.png)

## Why Codex Is Worth Trying

Based on my own experience and what I've seen people posting on X, Codex has become more attractive for a few reasons:

- GPT-5.5 is very strong.
- Some Claude Code users started comparing results more seriously around Opus 4.6 and Opus 4.7.
- For the same subscription cost, Codex can feel like it gives you more usable capacity.
- Codex used to lag behind on tooling, but Codex App has improved a lot.
- OpenAI seems relatively open to third-party tools, including projects like OpenClaw.
- OpenAI provides an official App Server protocol, so you can also integrate Codex-style workflows into your own apps.

In short, even if you're happy with Claude Code, Codex may now be worth adding to your toolkit because of model quality, pricing and limits, or tool UX.

## What Claude Code Users Should Know

From here, I'll focus on how Claude Code concepts map to Codex.

## Start With Codex App, Not the CLI

Claude Code is commonly used from the CLI. With Codex, at least in my circles, more people seem to use the desktop app: Codex App.

You can use Codex from the CLI, but the settings experience there is still not as friendly as I'd like. Codex App, on the other hand, has a much more polished settings UI.

Official docs:
https://developers.openai.com/codex/app/settings

## Subscription Plans

You can use Codex with a free ChatGPT account, but if you want to use it seriously, you'll probably want to look at Plus or Pro.

I'm in Japan, so the prices I see are roughly JPY 3,000 for Plus, and either JPY 16,800 or JPY 30,000 for Pro. Pricing and limits can vary by region and can change, so check the official pricing page before deciding.

Official pricing:
https://chatgpt.com/pricing/

## Plus vs. Pro

If you want to use the latest GPT-5.5 heavily, Pro is the easier recommendation.

If you want to keep costs down, Plus with GPT-5.4 can still be a very good setup. GPT-5.4 is already strong enough for a lot of real coding work.

## Permission Modes

Claude Code has permission modes such as `default`, `accept edits`, `plan mode`, `auto mode`, and `bypass permissions`.

In Codex, the equivalent setup is a bit more fragmented. The main pieces are:

- approval
- plan
- reviewer
- sandbox

## Approval

This is the closest concept to Claude Code's permission mode.

- `Untrusted`: Codex can automatically run known-safe read commands, but asks before commands that change state or could trigger external execution.
- `On Request`: Codex can read, edit, and run commands inside the workspace automatically. It asks before editing outside the workspace, accessing the network, or doing other higher-risk actions.
- `On Failure`: Codex asks when a command fails. This is currently less recommended for interactive use; `On Request` is usually better for interactive sessions, while `Never Ask` is more appropriate for non-interactive runs.
- `Never Ask`: Codex does not show approval prompts and stays within the configured sandbox constraints. If a `.rules` entry uses `decision = "prompt"`, that prompt cannot be shown in this mode and the request fails.

Official docs:
https://developers.openai.com/codex/agent-approvals-security

## Plan

Claude Code's plan mode is separate from approval settings in Codex. You can turn planning on or off independently.

One detail that can be surprising: Codex's multiple-choice AskUserTool is only available while plan mode is active. If you ask Codex to ask you a question but no choice UI appears, this is often why.

## Reviewer

This controls whether approval requests are reviewed by the user or by an AI reviewer.

For example, if you set approval to `On Request` and reviewer to `auto_review`, the experience starts to feel closer to Claude Code's auto mode.

## Sandbox

Sandboxing is not really part of Claude Code's permission mode model, but in Codex it is tightly connected to approvals.

The sandbox controls what Codex can access or modify. Approval controls when Codex needs to ask before doing something outside the current allowed scope.

## Quick Summary of Modes

That sounds like a lot, but Codex App simplifies it.

In the app UI, approval, reviewer, and sandbox are grouped into simpler presets such as Default permissions, Auto-review, and Full access. Plan mode is available as a separate toggle.

![Codex App permission mode settings](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/h3irc1pvngoyz9lbmpjo.png)

## Configuration Files

Codex can use configuration files globally and inside a project's `.codex` directory.

The two important files are:

- `config.toml` for general settings
- `.rules` for command approval rules

One thing to note: Codex does not have a direct equivalent of Claude Code's `settings.local.json` for personal, project-specific settings. You can get close by creating profiles in your global `config.toml`, but the model is different.

## `config.toml`

The official docs are the best place to check the full details, but this is where you configure things like default models and MCP servers.

When you change settings in the Codex App UI, those changes are reflected in the global `config.toml`.

Official docs:
https://developers.openai.com/codex/config-basic

## `.rules`

`.rules` is where you define command approval rules.

Rules match command prefixes using a `pattern` list. Each matching rule chooses one of three decisions:

- `allow`
- `prompt`
- `forbidden`

The priority is:

```text
forbidden > prompt > allow
```

That means if you want to allow a broad command but block one specific subcommand, you can define the broad rule as `allow` and then add a more specific `forbidden` rule for the subcommand.

Here is the official example:

```text
# Prompt before running commands with the prefix `gh pr view` outside the sandbox.
prefix_rule(
    # The prefix to match.
    pattern = ["gh", "pr", "view"],

    # The action to take when Codex requests to run a matching command.
    decision = "prompt",

    # Optional rationale for why this rule exists.
    justification = "Viewing PRs is allowed with approval",

    # `match` and `not_match` are optional "inline unit tests" where you can
    # provide examples of commands that should (or should not) match this rule.
    match = [
        "gh pr view 7888",
        "gh pr view --repo openai/codex",
        "gh pr view 7888 --json title,body,comments",
    ],
    not_match = [
        # Does not match because the `pattern` must be an exact prefix.
        "gh pr --repo openai/codex view 7888",
    ],
)
```

Official docs:
https://developers.openai.com/codex/rules

## Remote Control From Your Phone

As of this writing, the official experience for directly controlling a Codex App or CLI session from a phone is still limited. There are hints that a mobile experience may be coming, but it is not the main workflow yet.

Codex does have a useful advantage here: subscription-based usage can also be used through third-party tools.

That is exactly the gap I built CC Pocket for.

CC Pocket lets you use Codex from your phone, so if your main blocker is "I want to keep a coding agent moving while I'm away from my laptop," it is worth trying.

GitHub:
https://github.com/K9i-0/ccpocket

Install page:
https://k9i-0.github.io/ccpocket/install/

## Conclusion

These are the things I wish I had known when I first started using Codex as a Claude Code user.

The biggest mental shift is that Codex is not just "Claude Code with a different model." The app, approval model, sandboxing, config system, and third-party tooling ecosystem all work a little differently.

If you're already happy with Claude Code, you don't need to replace it. But if cost, usage limits, mobile workflows, or model behavior are making you curious, Codex App is now good enough to be worth a serious try.

And if you want to use Codex from your phone, try CC Pocket:

https://k9i-0.github.io/ccpocket/install/
