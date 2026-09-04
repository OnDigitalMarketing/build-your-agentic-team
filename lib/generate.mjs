// Turns interview answers into the two files someone downloads:
//
//   toNodeMarkdown()  → the node file, ready to commit to their own repo
//   toSkillMarkdown() → a SKILL.md, so the agent doing the work carries the file
//
// Pure functions over plain data — no Node APIs, no DOM. Runs in the browser,
// in the build, and in a server route without changes.

const isBlank = (v) =>
  v == null ||
  (typeof v === "string" && !v.trim()) ||
  (Array.isArray(v) && v.every(isBlank));

/** One question's answer, rendered as the markdown body of its section. */
export function renderAnswer(ask, value) {
  if (isBlank(value)) return `_(not answered — ${ask.q.replace(/\.$/, "").toLowerCase()})_`;

  switch (ask.type) {
    case "list":
      return value
        .filter((v) => !isBlank(v))
        .map((v) => `- ${String(v).trim()}`)
        .join("\n");

    case "pairs": {
      const [left, right] = ask.labels ?? ["", ""];
      const rows = value
        .filter((p) => !isBlank(p))
        .map((p) => `| ${(p[0] ?? "").trim()} | ${(p[1] ?? "").trim()} |`);
      return [`| ${left} | ${right} |`, `| --- | --- |`, ...rows].join("\n");
    }

    case "table": {
      const cols = ask.columns ?? [];
      const rows = value
        .filter((r) => !isBlank(r))
        .map((r) => `| ${cols.map((_, i) => (r[i] ?? "").trim()).join(" | ")} |`);
      return [
        `| ${cols.join(" | ")} |`,
        `| ${cols.map(() => "---").join(" | ")} |`,
        ...rows,
      ].join("\n");
    }

    default:
      return String(value).trim();
  }
}

/** A section becomes an `## ` heading plus its questions, each with its prompt kept as context. */
function renderSection(section, answers) {
  const parts = [`## ${section.section}`, ""];

  for (const ask of section.ask) {
    // Single-question sections don't need the question restated as a subhead.
    if (section.ask.length > 1) parts.push(`**${ask.q.replace(/\?$/, "")}**`, "");
    parts.push(renderAnswer(ask, answers[ask.id]), "");
  }

  return parts.join("\n");
}

const yamlFold = (s, indent = "  ") =>
  String(s)
    .trim()
    .replace(/\s+/g, " ")
    .replace(/(.{1,72})(\s|$)/g, `${indent}$1\n`)
    .trimEnd();

/**
 * The node file itself — same frontmatter shape the diagram reads, so what
 * someone downloads drops straight into a copy of this repo and just works.
 */
export function toNodeMarkdown(node, interview, answers, meta = {}) {
  const front = [
    "---",
    `node: ${node.id ?? interview.node}`,
    `title: ${node.title}`,
    `kind: ${node.kind}`,
    `metric: ${node.metric}`,
    "summary: >-",
    yamlFold(node.body),
    "---",
    "",
  ];

  const heading = meta.org ? `# ${node.title} — ${meta.org}` : `# ${node.title}`;
  const stamp = meta.date ? `**Last reviewed:** ${meta.date}${meta.author ? ` by ${meta.author}` : ""}` : null;

  const body = interview.sections.map((s) => renderSection(s, answers)).join("\n");

  return [...front, heading, "", ...(stamp ? [stamp, ""] : []), body].join("\n").replace(/\n{3,}/g, "\n\n") + "\n";
}

/**
 * The same content as a Claude Skill, so the agent that does this work carries
 * the strategy with it instead of being told about it in a prompt each time.
 */
export function toSkillMarkdown(node, interview, answers, meta = {}) {
  const org = meta.org ?? "this organization";
  const slug = (meta.org ?? node.title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const description =
    `${org}'s ${node.title.toLowerCase()} file. Use when drafting, reviewing, or ` +
    `deciding anything that ships under this brand — it defines what the work must ` +
    `match and what it must never do.`;

  const body = interview.sections.map((s) => renderSection(s, answers)).join("\n");

  return [
    "---",
    `name: ${slug}-${(node.id ?? interview.node)}`,
    `description: ${description}`,
    "---",
    "",
    `# ${node.title} — ${org}`,
    "",
    node.body,
    "",
    "## How to use this file",
    "",
    "Read it before you draft, and check every draft back against it. Two rules:",
    "",
    "1. **The negative space is binding.** Where this file says the brand will not",
    "   do something, that is a hard stop, not a preference. Flag the draft; don't",
    "   soften it and continue.",
    "2. **When this file is silent, ask.** Do not infer a position from the tone of",
    "   the rest of the document. Silence means nobody has decided yet.",
    "",
    `**This node's measure:** ${node.metric}`,
    "",
    "---",
    "",
    body,
  ].join("\n").replace(/\n{3,}/g, "\n\n") + "\n";
}

/** Percentage of questions answered, for the wizard's progress state. */
export function completeness(interview, answers) {
  const all = interview.sections.flatMap((s) => s.ask);
  const done = all.filter((a) => !isBlank(answers[a.id]));
  return { done: done.length, total: all.length, pct: Math.round((done.length / all.length) * 100) };
}
