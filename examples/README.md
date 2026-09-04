# Worked examples

Filled-in versions of the node files, so you can see how specific a file has to
get before an agent can actually work from it.

These are excluded from the build — they reuse the same frontmatter as the real
node files, and the build would read them as duplicates.

## Wildrye Provisions

Fictional DTC pantry brand: regeneratively-farmed grains and flours, ~$14M
revenue, 38% on subscription. Chosen because it has a real strategic tension —
a premium price in a commodity category, with a provenance claim that has to be
defensible.

| File | Blank version | What to look at |
| --- | --- | --- |
| [`wildrye/strategy.md`](wildrye/strategy.md) | [`/strategy.md`](../strategy.md) | How "what this brand will not do" turns into rules an agent can check a draft against without asking |

## The standard to write to

A node file is finished when **an agent could act on it and be wrong in a way
you'd catch.** That's the bar. Three tests:

1. **Testable, not aspirational.** "Premium home cooks" is not a segment.
   "Buys organic, reads past the label, $9/bag is not a decision" is.
2. **The negative space is specific.** Most files fail here. What the brand
   *won't* do does more work than what it will, because it's what an agent
   checks against.
3. **It names its own weaknesses.** An agent that doesn't know where you're weak
   will write copy that pretends you aren't.
