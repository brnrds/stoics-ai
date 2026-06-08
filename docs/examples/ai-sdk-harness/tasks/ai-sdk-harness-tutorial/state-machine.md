---
title: "State Machine"
description: "Provisioning, active, hibernating, hibernated. Two timeouts and what counts as activity."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/state-machine"
md_url: "https://vercel.com/academy/build-ai-agent-harness/state-machine.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:13:03.980Z"
content_type: "lesson"
course: "build-ai-agent-harness"
course_title: "Build Your Own AI Coding Agent Harness"
prerequisites:  []
---

<agent-instructions>
Vercel Academy — structured learning, not reference docs.
Lessons are sequenced.
Adapt commands to the human's actual environment (OS, package manager, shell, editor) — detect from project context or ask, don't assume.
The lesson shows one path; if the human's project diverges, adapt concepts to their setup.
Preserve the learning goal over literal steps.
Quizzes are pedagogical — engage, don't spoil.
Quiz answers are included for your reference.
</agent-instructions>

# State Machine

# State Machine

A cloud sandbox is not "running" or "stopped." It moves through four states, and the difference between them is what's costing you money.

Treat the lifecycle as a state machine. That sounds heavyweight. It isn't. Four states, two timers, and one activity tracker is the entire thing. The mistakes happen when one of those pieces is missing or wrong, and the bill at the end of the month is what tells you about it.

## Outcome

You can name the four states, explain the two timeouts that move the sandbox between them, and identify what the activity tracker should count and what it should ignore.

## The States

```
provisioning -> active -> hibernating -> hibernated
                  ^             |
                  +-------------+ (restore)
```

| State        | What's happening                             | Cost                 |
| ------------ | -------------------------------------------- | -------------------- |
| Provisioning | VM is spinning up, dependencies installing   | Billing has started  |
| Active       | Agent is working, commands run, files change | Full per-minute cost |
| Hibernating  | Snapshot in progress, sandbox finishing up   | Full per-minute cost |
| Hibernated   | VM is stopped, snapshot is stored            | Storage cost only    |

Active is the expensive state. Hibernated is the cheap one. The two transitions in between (provisioning and hibernating) are short but billed at full rate, so you don't want them happening more than they need to.

## The Two Timeouts

Two clocks run on every cloud sandbox. They expire on different things and you only control one of them.

### Hard expiry

The provider sets a maximum lifetime. One to four hours, depending on the platform. When the clock hits zero, the VM is killed regardless of what's happening. You can't extend it. You can't argue with it. You can only finish before it fires, or snapshot before it does.

### Inactivity window

You set this. After N minutes of no activity, the sandbox hibernates itself. Five minutes is a reasonable default for most agent workloads. Two minutes is aggressive (the sandbox hibernates between turns). Twenty minutes is loose (you're paying for idle time).

```ts
const INACTIVITY_WINDOW = 5 * 60 * 1000;
```

Hard expiry is the worst-case bill. Inactivity is the typical bill. They both matter.

## What Counts as Activity

The activity tracker is what makes the inactivity window work. The implementation is one timestamp updated on every "real" event, but the trick is deciding what's real:

| Event                                     | Counts as activity? |
| ----------------------------------------- | ------------------- |
| Chat message from user                    | Yes                 |
| Tool call executed                        | Yes                 |
| Sandbox event (file write, process spawn) | Yes                 |
| Status polling                            | No                  |
| Reconnect probe                           | No                  |
| Health check                              | No                  |

If your status polling counts as activity, the sandbox never hibernates and you pay for hours of idle time. If your tool calls don't count, the sandbox hibernates mid-task and you lose the in-progress work. Both failure modes are common.

## Tracing a Timeline

```
0:00  User sends message, sandbox is provisioned
0:02  Sandbox active, agent starts working
0:05  Agent runs npm install (3 minutes)
0:08  Agent finishes, responds to user
0:13  Inactivity window expires (5 min since last activity)
0:13  Sandbox starts hibernating, snapshot in progress
0:14  Snapshot complete, sandbox hibernated
0:20  User sends another message, sandbox restores from snapshot
0:21  Sandbox active again, agent continues where it left off
1:30  Hard expiry hits, VM is killed
```

Two questions worth answering against this timeline:

1. At what point should the harness warn the user that the hard expiry is approaching?
2. When should an auto-snapshot fire so the user can resume after expiry?

The answer to both depends on how much your platform charges for storage and how disruptive a forced expiry is for the agent's task. There's no single right answer. There's a wrong one (do nothing) and a less-wrong one (auto-snapshot at 80% of hard expiry).

## Try It

This is a concept lesson. Check yourself:

1. Draw the state machine from memory and label each transition
2. Explain in one sentence why hard expiry can't be extended
3. Pick one event from the activity table and explain why it does or doesn't count

If you wired the lifecycle hooks from Module 4, you have a place to attach state, `lastActivityAt`, and `hardExpiryAt` when you build a real cloud backend. The local and `just-bash` backends won't actually fire these timeouts, but the shape is in place.

## Commit

No code in this lesson. The local sandbox doesn't have meaningful timeouts to track yet.

## Done-When

- [ ] You can name the four states in order
- [ ] You can describe the difference between hard expiry and the inactivity window
- [ ] You can identify what counts as activity and what counts as noise
- [ ] You can trace the timeline above and explain when an auto-snapshot should fire


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
