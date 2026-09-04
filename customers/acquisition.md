---
node: acquisition
title: Acquisition
kind: Agent-first — always reviewed
mode: agent-first
metric: Owns the Acquisition Cost term in Equation 1.
summary: >-
  Finds and qualifies new demand against the ICP. An agent can carry most of it
  — the file says which segments to chase and what a lead is worth — but a human
  still reads the output. Nothing here runs unattended; the question is only how
  wide the leash is.
---

# Acquisition

Agent-first. Reads `/customers/icp.md` and `/strategy.md` before it does
anything.

## Target segments in priority order

Work top down. Do not open segment 2 until segment 1 is saturated or fails.

1.
2.
3.

## Qualification rules

Written so an agent can apply them without a judgment call.

**Qualify if all of:**

- [ ]
- [ ]

**Disqualify if any of:**

- [ ]
- [ ]

**Escalate to a human when:** _(the rule is ambiguous, the lead is a named
account, the fit is borderline)_

## Allowable acquisition cost

The ceiling. An agent may not exceed it without tier-two approval per `/CMO.md`.

| Segment | Modeled LTV | Max allowable CAC | Current CAC |
| --- | --- | --- | --- |
| | | | |

**Rule:** allowable CAC = _(share)_ of modeled LTV. If measured CAC exceeds
allowable for two consecutive weeks, stop and escalate.

## Handoff to retention

The moment acquisition's job ends and `/customers/retention.md` begins.

- **Handoff trigger:**
- **What gets passed:**
- **Who owns the customer after handoff:**
