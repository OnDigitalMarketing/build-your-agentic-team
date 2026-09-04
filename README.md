---
node: loop
title: The loop feeds itself
kind: The whole system
mode: system
metric: Both equations, together, tell you whether the loop is gaining or losing.
sections:
  - How the loop is measured
  - What a weakening loop looks like
  - Review cadence
  - Where the loop can break
summary: >-
  Nothing here is a funnel with an end. Campaigns get and keep customers; those
  customers fund the next campaign. Strengthen any node and the whole loop turns
  faster — weaken one and it stalls everywhere, which is why the two equations
  are checked on every campaign, not at the end of the quarter.
---

# Build Your Agentic Team

**A marketing organization as a repository.** Every function is a markdown file.
Every file names a human, an agent, or both. Every node moves a term in one of
two equations. Strategy is a reviewed commit, not a slide.

📊 **[Open the interactive diagram →](https://BznJC.github.io/build-your-agentic-team/)**

---

## The two equations

Everything in this repo is scored by one of these. A node that can't name its
term doesn't belong in the loop.

```
Equation 1   Lifetime Value − Acquisition Cost = Post-Acquisition Value
Equation 2   Sessions × Conversion Rate × Average Order Value = Revenue
```

## The org chart

| File | Node | Mode | Term it moves |
| --- | --- | --- | --- |
| [`/CMO.md`](CMO.md) | CMO | Human + agent | Owns the loop |
| [`/strategy.md`](strategy.md) | Strategy & Brand | Human + agent | Sets the brief |
| [`/customers/icp.md`](customers/icp.md) | Ideal Customers | Human + agent | Equation 1 |
| [`/customers/acquisition.md`](customers/acquisition.md) | Acquisition | **Agent-first** | CAC |
| [`/customers/retention.md`](customers/retention.md) | Retention | Human + agent | LTV |
| [`/campaigns/plan.md`](campaigns/plan.md) | Campaigns | Human + agent | Equation 2 |
| [`/campaigns/seo-geo.md`](campaigns/seo-geo.md) | SEO / GEO | **Agent-first** | Sessions |
| [`/campaigns/paid-ads.md`](campaigns/paid-ads.md) | Paid Ads | Human + agent | Sessions, CVR |
| [`/campaigns/influencer.md`](campaigns/influencer.md) | Influencer | Human + agent | Sessions, LTV |
| [`/campaigns/owned-media.md`](campaigns/owned-media.md) | Owned Media | Human + agent | Sessions |
| [`/analytics.md`](analytics.md) | Analytics | Human + agent | Scores both |
| [`/open/`](open/) | Open slots | Your call | You defend it |

## How the loop is measured

Both equations, every campaign — not at the end of the quarter. Equation 1 asks
whether the customers are worth having. Equation 2 asks whether the work is
producing revenue. A campaign can win Equation 2 and lose Equation 1, and that
is the most expensive way to grow.

`/analytics.md` scores both and reports back up to `/strategy.md`. That report
is a commit.

## What a weakening loop looks like

- Revenue holds while post-acquisition value falls — you're buying worse customers
- Sessions climb while conversion rate falls — you're buying the wrong sessions
- CAC rises and nobody notices for a quarter — attribution is covering for it
- Every node reports green and the aggregate is red — the definitions have drifted

## Review cadence

Weekly, per `/CMO.md`. An agent drafts the plan Monday and the rollup Friday; a
human approves the first and writes the meaning of the second. If a week
produced no diff in this repo, either nothing was learned or nobody wrote it
down.

## Where the loop can break

1. **A node with no named human.** Agent-first still means reviewed.
2. **A file that contradicts `/strategy.md`.** Strategy wins; fix the file.
3. **Two nodes defining the same metric differently.** `/analytics.md` is the
   single definition.
4. **An agent operating outside its guardrails without escalating.** That's a
   file problem, not a model problem — the rule wasn't written testably.

## What "filled in" looks like

The node files ship blank on purpose. [`examples/wildrye/strategy.md`](examples/wildrye/strategy.md)
is one of them written out in full, for a fictional DTC pantry brand — including
the "what this brand will not do" section that does most of the actual work.

A node file is finished when an agent could act on it and be wrong in a way
you'd catch.

## Working in this repo

Every file has YAML frontmatter that the diagram reads. Edit the markdown, and
the published diagram updates on push.

```bash
npm run build     # regenerate the site into ./site
npm run check     # validate the markdown against the diagram, no output
npm run serve     # build, then serve at http://localhost:8000
```

The build is dependency-free — plain Node, no `npm install` required.

**To add a node:** copy [`open/_template.md`](open/_template.md) to
`open/your-node.md`, fill it in, add the row to `/CMO.md`, and push. To make it
appear in the diagram, add it to `design/agentic-marketing-system.dc.html` as
well — `npm run check` will tell you if the two ever disagree.

## Publishing the diagram

`design/agentic-marketing-system.dc.html` is the canvas source (editable in
Claude Design). `scripts/build.mjs` injects the node content from these markdown
files into it and writes `site/index.html`. A GitHub Action runs that on every
push to `main` and deploys to GitHub Pages.

The diagram can't drift from the files, because its content *is* the files.

---

Build Your Agentic Team™ · © 2026 On Digital Marketing LLC. All rights reserved.
