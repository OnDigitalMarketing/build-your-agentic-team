#!/usr/bin/env node
// Builds the published diagram from the markdown files.
//
// The design file (design/*.dc.html) owns the layout. The markdown files own
// the content. This script reads every .md with a `node:` in its frontmatter,
// rebuilds the NODES object, and writes the result to site/index.html — so the
// diagram can never say something the repo doesn't.
//
// Dependency-free on purpose: CI runs it with plain `node`, no install step.

import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, readdirSync, statSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DESIGN = join(ROOT, "design", "agentic-marketing-system.dc.html");
const OUT = join(ROOT, "site");
const CHECK_ONLY = process.argv.includes("--check");

// `examples/` holds filled-in reference copies of node files. They deliberately
// reuse the same frontmatter, so they're skipped to avoid duplicate node ids.
const SKIP_DIRS = new Set(["node_modules", ".git", "site", "design", ".github", "examples"]);

const errors = [];
const warnings = [];

/* ---------- minimal frontmatter parser (the subset this repo uses) ---------- */

function parseFrontmatter(raw) {
  if (!raw.startsWith("---\n")) return null;
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return null;

  const block = raw.slice(4, end + 1);
  const body = raw.slice(end + 4).replace(/^\n/, "");
  const data = {};
  const lines = block.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trimStart().startsWith("#")) continue;

    const m = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (!m) continue;
    const [, key, rest] = m;

    // Folded / literal block scalar: `key: >-`, `>`, `|`, `|-`
    if (/^[>|][-+]?$/.test(rest.trim())) {
      const fold = rest.trim().startsWith(">");
      const parts = [];
      while (i + 1 < lines.length && (lines[i + 1].startsWith("  ") || !lines[i + 1].trim())) {
        parts.push(lines[++i].trim());
      }
      data[key] = fold ? parts.join(" ").trim() : parts.join("\n").trim();
      continue;
    }

    // Block sequence: `key:` followed by `  - item` lines
    if (rest.trim() === "") {
      const items = [];
      while (i + 1 < lines.length && /^\s+-\s+/.test(lines[i + 1])) {
        items.push(lines[++i].replace(/^\s+-\s+/, "").trim().replace(/^["']|["']$/g, ""));
      }
      data[key] = items.length ? items : "";
      continue;
    }

    data[key] = rest.trim().replace(/^["']|["']$/g, "");
  }

  return { data, body };
}

/* ---------- collect the markdown ---------- */

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith(".") || SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry.endsWith(".md")) out.push(full);
  }
  return out;
}

const nodes = {};
const seen = new Map();

for (const path of walk(ROOT)) {
  const raw = readFileSync(path, "utf8");
  const parsed = parseFrontmatter(raw);
  if (!parsed || !parsed.data.node) continue;

  const { data, body } = parsed;
  const id = data.node;
  const rel = "/" + relative(ROOT, path).split(/[\\/]/).join("/");

  if (seen.has(id)) {
    errors.push(`Duplicate node id "${id}": ${seen.get(id)} and ${rel}`);
    continue;
  }
  seen.set(id, rel);

  // Sections are the file's own H2 headings — that's what keeps the panel honest.
  const headings = [...body.matchAll(/^##\s+(.+?)\s*$/gm)].map((m) => m[1]);

  let sections = headings;
  if (Array.isArray(data.sections) && data.sections.length) {
    // An explicit list may reorder or narrow, but every entry must really exist.
    for (const s of data.sections) {
      if (!headings.includes(s)) {
        errors.push(`${rel}: frontmatter lists section "${s}" but the file has no "## ${s}"`);
      }
    }
    sections = data.sections;
  }

  for (const field of ["title", "kind", "summary", "metric"]) {
    if (!data[field]) errors.push(`${rel}: missing required frontmatter field "${field}"`);
  }
  if (!sections.length) warnings.push(`${rel}: no "## " headings found`);

  nodes[id] = {
    kind: data.kind ?? "",
    title: data.title ?? id,
    body: data.summary ?? "",
    file: rel,
    sections,
    metric: data.metric ?? "",
  };
}

/* ---------- reconcile against the design file ---------- */

const design = readFileSync(DESIGN, "utf8");

const declared = new Set();
const idsMatch = /const IDS = \[(.*?)\];/s.exec(design);
if (idsMatch) {
  for (const m of idsMatch[1].matchAll(/"([^"]+)"/g)) declared.add(m[1]);
}
// Layout-only ids in IDS that carry no file of their own.
for (const layoutOnly of ["wires", "eq1", "eq2"]) declared.delete(layoutOnly);

for (const id of declared) {
  if (!nodes[id]) errors.push(`design references node "${id}" but no markdown file declares it`);
}
for (const id of Object.keys(nodes)) {
  if (!declared.has(id)) warnings.push(`"${seen.get(id)}" declares node "${id}", which the diagram doesn't show yet`);
}

/* ---------- report ---------- */

for (const w of warnings) console.warn(`  warn  ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`  ERROR ${e}`);
  console.error(`\n${errors.length} error(s). Build failed.`);
  process.exit(1);
}

const count = Object.keys(nodes).length;
if (CHECK_ONLY) {
  console.log(`✓ ${count} nodes, no drift between the markdown and the diagram.`);
  process.exit(0);
}

/* ---------- emit the site ---------- */

const injected = design.replace(
  /const NODES = \{[\s\S]*?\n\};\n/,
  `const NODES = ${JSON.stringify(nodes, null, 2)};\n`
);

if (injected === design) {
  console.error("ERROR could not find the NODES block in the design file — did its shape change?");
  process.exit(1);
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

writeFileSync(join(OUT, "index.html"), injected);
cpSync(join(ROOT, "design", "support.js"), join(OUT, "support.js"));
cpSync(join(ROOT, "design", "_ds"), join(OUT, "_ds"), { recursive: true });
writeFileSync(join(OUT, ".nojekyll"), ""); // stop Pages from eating the _ds directory

console.log(`✓ built site/index.html from ${count} markdown files`);
