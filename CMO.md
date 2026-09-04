---
node: cmo
title: CMO
kind: Human + agent — you
mode: human+agent
metric: Reviewed weekly. Everything below inherits from this file.
summary: >-
  You own the loop, not the tasks. Set the objective, decide which agent gets
  which mandate, and approve anything that changes an equation. Your own seat is
  a hybrid: an agent drafts the plan and the rollup, you make the call.
---

# CMO

The top of the loop. This file is the contract every other file inherits from.
If a node's file contradicts this one, this one wins.

## Objective and constraints

<!-- What is this marketing organization actually trying to do this quarter? -->

**Objective:** _One sentence. A number and a date._

**Constraints:**

- Budget ceiling:
- Headcount (human):
- Headcount (agent):
- Things we will not do to hit the number:

## Org chart: humans and agents

Every node in the loop is staffed. "Staffed" means a named human is accountable
even when an agent does most of the work.

| Node | File | Mode | Human accountable | Agent |
| --- | --- | --- | --- | --- |
| Strategy & Brand | `/strategy.md` | Human + agent | | |
| Ideal Customers | `/customers/icp.md` | Human + agent | | |
| Acquisition | `/customers/acquisition.md` | Agent-first | | |
| Retention | `/customers/retention.md` | Human + agent | | |
| Campaigns | `/campaigns/plan.md` | Human + agent | | |
| SEO / GEO | `/campaigns/seo-geo.md` | Agent-first | | |
| Paid Ads | `/campaigns/paid-ads.md` | Human + agent | | |
| Influencer | `/campaigns/influencer.md` | Human + agent | | |
| Owned Media | `/campaigns/owned-media.md` | Human + agent | | |
| Analytics | `/analytics.md` | Human + agent | | |

## Decision rights and escalation

Three tiers. Anything that moves a term in Equation 1 or Equation 2 is a
tier-two decision at minimum.

**Tier 1 — agent decides, human reviews after.**
Volume work inside written guardrails. Logged, sampled weekly.

**Tier 2 — agent proposes, human approves before it ships.**
Anything with the brand name on it, any spend change, any offer.

**Tier 3 — human decides, agent supports.**
Positioning, pricing, who we will not serve, who we will not stand next to.

**Escalation trigger:** an agent must stop and escalate when
_(fill in: spend variance, off-brief creative, a claim it cannot source, a
segment not in the ICP)_.

## Weekly review cadence

| When | What | Who |
| --- | --- | --- |
| Monday | Agent drafts the week's plan from this file | Agent |
| Monday | Human approves or redirects | CMO |
| Friday | Agent drafts the rollup against both equations | Agent |
| Friday | Human writes the "what it means" paragraph | CMO |

The rollup is a commit. If the week's read did not change any file in this
repo, either nothing was learned or nobody wrote it down.
