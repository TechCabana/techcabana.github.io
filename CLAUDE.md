# CLAUDE.md

Project context and working agreement for the personal portfolio site.
Read this first in every session.

---

## 1. Project

A **static personal portfolio** served from GitHub Pages. Hand-written HTML, CSS and one
plain JavaScript file. No framework, no build step, no package manager, no server.

- **Repo:** `TechCabana/TechCabana.github.io` (`origin`, branch `main`) — **public**
- **Live site:** https://techcabana.github.io/
- **Trello board:** https://trello.com/b/7za9xsnM/techcabana
- **Owner:** Ankhit Sharma (Trello `@ankhitsharma1`, timezone `Europe/London`)

Because the repository is named `<owner>.github.io`, **a push to `main` is a deploy.** There
is no workflow, no staging environment and no approval step between a commit and the live
site. That single fact drives most of the workflow rules below.

**Goals, in priority order**
1. Loads fast and works on a phone — this is the first thing a recruiter sees
2. Stays a static site with no build step; nothing between the source and what ships
3. One coherent visual system, not a pile of per-page styles
4. Accessible: real landmarks, keyboard-reachable controls, honest contrast

---

## 2. Current state

**As of 2026-08-11.** Restate this section rather than trusting it once it is more than a
few commits old — a stale briefing here causes real errors, not cosmetic drift.

```
index.html            782 lines   single-page site: nav + 7 sections + demo modal
assets/css/style.css 1659 lines   all styling, tokenised colour, 2 breakpoints
assets/js/main.js     206 lines   nav, scroll, filters, toast, contact form, demo modal
pages/                 4 files    familytree, wordoftheday, utilitytool, yugioh
assets/images/       9 + 6 files  project thumbnails and screenshots; yugioh/ card art
```

Sections in `index.html`, in order: `#home` (hero with particles canvas), `#about`,
`#experience`, `#skills`, `#projects`, `#education`, `#contact`, then the demo modal.

**No CI, no tests, no LICENSE file, no `.gitignore` beyond what is listed here.** GitHub
reports the licence as `NOASSERTION`. The licence question was decided 2026-08-15: leave the
repository unlicensed (all rights reserved) rather than add MIT or GPL-3.0 — this is a personal
portfolio nobody should be forking. The decision is recorded in the README's Licence section.

Two branches survive on the remote from earlier work: `AddSkillsFiltering` and
`ChangeInCSS`. Both are merged; neither is active.

---

## 3. How the site is built

### The page pattern

Every project has two pieces:

1. **A card in the projects grid** in `index.html`, with a `project-thumb-N` class for the
   thumbnail and a `data-demo-src="pages/<name>.html"` attribute on its arrow button.
2. **A deep-dive page** in `pages/`, opened inside the demo modal iframe by `main.js`.

The deep-dive pages share a class vocabulary rather than a stylesheet section: `demo-page`,
`back-link`, `demo-page-eyebrow`, `demo-page-title`, `demo-tag`, `write-up-card`,
`write-up-section`, `screenshot-card`. Each page redeclares those rules in its own `<style>`
block and links `../assets/css/style.css` for the tokens. The outer wrapper carrying the
`demo-page` class is a `<main>` element, not a `<div>` — each page is its own document and
needs its own main landmark. **Copy an existing page as the starting point** — divergence
between the four pages is a defect, not a style choice.

### Design tokens

Every colour lives in `:root` at the top of `assets/css/style.css`. Do not write a colour
value anywhere else.

| Token | Value | Role |
|---|---|---|
| `--bg` | `#080d12` | page ground |
| `--surf` / `--surf2` | `#0d1520` / `#111d2e` | layered surfaces |
| `--accent` | `#06b6d4` | the single interaction accent |
| `--head` / `--body` / `--muted` | `#f0f9ff` / `#cbd5e1` / `#475569` | type scale |
| `--border` | `rgba(255,255,255,0.06)` | hairline separation |

Type: **Bricolage Grotesque** for headings, **Inter** for body, **JetBrains Mono** for
anything that is data — tags, serials, stats. Loaded from Google Fonts.

Breakpoints are `900px` and `640px`, plus `1150px` for the projects grid alone.

### External dependencies

Three, all from a CDN, all in `index.html`:

| What | Why | Note |
|---|---|---|
| Google Fonts | the three typefaces | preconnected |
| `@emailjs/browser@3` | contact form submission | see below |
| `particles.js@2.0.0` | hero background canvas | configured inline at the bottom of `index.html` |

**The EmailJS keys in `index.html` are meant to be public.** `emailjs.init("Q0ETI2C…")`
takes a *publishable* key, and the service and template ids in `main.js` are equally
public by design — EmailJS enforces on the origin allowlist, not on secrecy. Do not "fix"
this by moving them to an env var; there is nowhere on a static site to hide them. Do
check the allowlist if submissions start failing.

---

## 4. Design rules

The owner's brief: a dark theme that **does not look AI-generated**.

**Never use** (these are the tells):
- Diagonal navy→indigo body gradients (`#1a1a2e → #16213e` at 135deg and relatives)
- Gradient-clipped heading text via `background-clip: text`
- Blanket `rgba(255,255,255,0.1)` glassmorphism on every surface
- Emoji as UI chrome
- uiGradients-style rainbow pastel gradients on a dark ground
- A uniform 20-25px pill radius on every element
- Accent-coloured glow shadows
- Idle infinite float animations
- The `Segoe UI` system stack, or the `Inter + Space Grotesk` pairing

**Do instead:**
- Flat near-black layered surfaces with hairline borders; depth from layering, not glow
- **One** restrained interaction accent — `--accent`, used for focus, hover and selection
  and nothing else
- Hierarchy from weight, size and tracking, not from colour
- Colour that carries meaning where meaning exists: the skill-level tokens
  (`--expert` / `--proficient` / `--familiar`) and the promotion green are data, not decoration
- Motion: 120-200ms `ease-out` for state, ~350ms for view transitions, `transform` and
  `opacity` only, all wrapped in `prefers-reduced-motion`

---

## 5. Trello board

Lists: **Backlog → To Do → In-Progress → Review → Done**

Backlog is ordered by build sequence. Dependencies point backwards only, so pulling from
the top never blocks.

Labels were named on 2026-08-10. The MCP **cannot** rename labels — use the REST API
(`PUT /1/labels/{id}` with a `name` param). Trello labels have no description field, only a
name and a colour. Every card also states its domain on the first line of its description.

| Colour | Label name |
|---|---|
| Blue | Content & Copy |
| Orange | UI & Design |
| Red | Bugs & Correctness |
| Yellow | Responsive & Layout |
| Purple | Accessibility |
| Green | Repo & Tooling |

Every new card must carry exactly one domain label, including cards created by
`audit project`. Read the board rather than this file for card counts — they move every
session.

---

## 6. Workflow — trigger commands

Three commands drive the board. Each is explicit; never run one unprompted.

### `process To Do`
Works a **batch** of up to three cards onto one branch, so the owner reviews a related set
in one pass rather than card by card.

1. Read every card in **To Do**.
2. Evaluate and plan all of them first. **Present the plan before touching code**, naming
   which cards are in the batch and why the batch stops where it does.
3. Create one branch for the batch, named after the first card (§6.1 rule 7).
4. Work the cards **in dependency order, one at a time**, moving each to **In-Progress** as
   it starts and leaving it there until the batch reaches Review.
5. **One commit per card**, each a self-contained Conventional Commit naming what it changed.
   Never squash two cards into one commit — the per-card history is what makes the batch
   reviewable and what lets a single card be revised later.
6. Stop and hand over when any of these is true (§6.1 rule 2):
   - three cards are done
   - the next card depends on something not yet merged
   - the next card needs an owner decision
   - the diff has grown too large to review well
7. Run the Fable review gate (§6.2) over the whole batch, open **one PR**, then move every
   card in the batch to **Review**.
8. If anything is unclear or ambiguous: **stop and ask. Never assume.** Raise the question on
   that card (§7), leave it in To Do, and carry on with the next card in the batch.

### `process In-Progress`
1. Read the owner's answers on each In-Progress card.
2. Resume development from where it stopped.
3. Finish the card, including the verification in §6.3.
4. Commit, push a branch, and open a PR.
5. **Run the Fable review gate (§6.2) before the card moves.** Only after it passes does the
   card go to **Review**.

### `process Review`
Approval is **per card**, merging is **per batch**.

1. Check each card in **Review** for a verdict from the owner.
2. **Approval** is the word `approve` / `approved` / `Approved`, any casing.
3. Group the cards by the PR they belong to.
4. Merge a PR only when **every card in that batch is approved**. Merging deploys the site.
   Move all of the batch's cards to **Done**.
5. If any card in a batch has a **changes-requested** verdict, **hold the entire PR** — do not
   merge, do not split the branch. Follow §6.1 rule 1 for that card only.
6. If some cards are approved and others have no verdict yet, do nothing and say which cards
   are still waiting.
7. Cards in a batch that is on hold stay in Review, except the one being reworked.

### `audit project`
Run by **Fable**. A standing health check of scope versus delivery — it writes cards, never code.

1. Read the current repo state, the merged PRs, and every card across all five lists.
2. Evaluate delivered work against the project goals (§1), the page pattern (§3) and the
   design rules (§4).
3. Identify gaps: scope in the goals with no card covering it, decisions that have drifted,
   regressions, dropped follow-ups, divergence between the four deep-dive pages, and anything
   a merged PR promised but did not actually deliver.
4. For each real gap, create a card in **Backlog** with a domain label (§5), a description
   carrying `file:line` evidence, and a `**Done when:**` line.
5. Do **not** duplicate an existing card — check all five lists first, and extend the
   existing card instead where one already covers the ground.
6. Report a summary in chat: what is on track, what has drifted, which cards were created.

Creates cards only. Never edits code, never moves cards between lists, never merges.

---

## 6.1 Decided workflow rules

These are settled. Follow them without asking.

**1. Changes-requested path.**
Any verdict on a Review card that is *not* an approval is treated as changes requested.
On `process Review`:
- Move **that card only** back to **In-Progress**. The rest of its batch stays in Review.
- **Hold the whole PR.** Do not merge it, even if every other card in the batch is approved,
  and never rebase or split the rejected card out — the batch stays atomic.
- Leave the branch and PR **open** — never close or delete them. Follow-up work is new
  commits on the same branch, so the PR history and the owner's review threads survive.
- Record the requested changes in the card description under a `## 🔄 CHANGES REQUESTED`
  heading, so the ask survives across sessions.
- The next `process In-Progress` addresses the feedback, pushes to the same branch, re-runs
  the Fable gate, and moves the card back to **Review**.
- A card may cycle Review ↔ In-Progress any number of times.

**2. Batch size: a hard cap of three cards per PR.**
Never exceed three, even when the cards look small. Stop short of three whenever the next
card depends on something unmerged, needs an owner decision, or would push the diff past what
can be reviewed carefully. State where the batch stops, and why, in the plan before starting.

Cards are still built **one at a time in dependency order**, with **one commit per card**. A
blocked card does not consume a batch slot — leave it in To Do with a question comment and
move to the next card.

**3. There is no test suite, so verification is manual and mandatory.**
This repo has no npm, no Vitest and no CI. §6.3 lists what must actually be run before a card
moves to Review, and the result is stated in the PR body. "It looks right" is not a result.

**4. Branch and open a PR. It is a working practice, not a gate.**
`main` has **no branch protection at all** — no required PR, no required checks, no force-push
block (verified against the API on 2026-08-10). Default to a branch and a PR anyway, because
a PR is where the diff gets read, the Fable gate runs, and the Trello card gets its link.

Skipping the PR is allowed when it genuinely adds nothing — a one-line copy fix, or an urgent
revert. Say so and why, rather than doing it quietly. When in doubt, open the PR; it costs
almost nothing.

**5. Merge is deploy; rollback is a revert.**
`TechCabana.github.io` publishes `main` at the repository root, so **a merge to `main` puts
the change in front of the public within a minute.** There is no build to fail first and no
staging URL to catch it. If a merge breaks the live site, the fix is `git revert` of the merge
commit and a new PR — never a force-push or a history rewrite.

Because of this, treat anything touching `index.html`, `style.css` or `main.js` as
production-affecting, and check the site after every merge rather than assuming.

**6. Card ↔ branch ↔ PR linking is mandatory.**
- Branch: `<type>/<trello-shortlink>-<slug>` (e.g. `feat/rllFN9Hf-yugioh-project-page`)
- PR body links the Trello card URL
- The PR URL is written back into the card description under a `## 🔗 PR` heading

Nothing else connects a card to its code across sessions — if the link is missing, the next
session cannot find the work.

**7. Never commit or push unless the owner asks.**
Rule 5 is why. A commit on `main` is a publication, so it is the owner's call, not a tidy-up
step at the end of a task.

---

## 6.2 Model assignment

Different stages run on different models. Delegate with the `Agent` tool, passing the
`model` parameter.

| Stage | Model | Why |
|---|---|---|
| Planning, architecture, design system work, cross-page refactors | **Opus 5**, high effort | Judgement-heavy, cross-file reasoning |
| Well-specified single-card implementation, mechanical edits, copy changes | **Sonnet 5**, high effort | Faster on bounded work with a clear spec |
| Review gate and `audit project` | **Fable** | Independent reviewer; must not be the model that wrote the code |

Default to Opus when the card is ambiguous, spans several files, or involves a design
decision; Sonnet when the card reads like a spec and the diff is predictable. State which
model was used in the PR body.

### The Fable review gate

Runs when a card is finished and its PR is open, **before** the card moves to Review. Fable
must not be the model that wrote the code — the point is an independent pass.

Fable's remit:
1. Run the §6.3 verification and report the **real** result — never assume it passed.
2. Audit the PR against the card's `**Done when:**` line, against §3, §4 and §8 of this file,
   and against the repo's own conventions.
3. Look for missed cases, accessibility regressions, responsive breakage, divergence from the
   shared page vocabulary, and scope that crept in or fell out.
4. **Fix any gap that does not need an owner decision** — convention drift, a missing `alt`,
   an unhandled error path, doc gaps — and push to the same branch so the PR arrives ready
   to merge.
5. Anything that *does* need an owner decision becomes a Trello comment tagging
   `@ankhitsharma1`, per §7. Never guess.
6. Report findings in chat: what was checked, what was fixed, what still needs the owner.

Only once the gate passes does the card move to Review.

---

## 6.3 Verification before a card moves

There is no CI to catch a mistake, and a merge is a deploy. Run these and state the outcome:

| Check | How |
|---|---|
| Every referenced asset resolves | Resolve each `src` and `url()` added or changed against the filesystem — a 404 image is invisible in review and obvious on the live site |
| Markup is balanced | Parse the changed HTML and confirm no unclosed or mismatched tags |
| CSS is well-formed | Brace count balances; no colour value written outside the `:root` block |
| Every `var()` resolves | Each `var(--token)` in the stylesheet names a token defined in `:root`, or one set inline in the markup — `--delay` is set per element and is the only legitimate exception. A dead rule painting an undefined token went unnoticed until a batch found it by accident |
| The page actually renders | Serve the directory (`npx serve .` or `python -m http.server 8000`) and open it. `file://` is fine for these pages, but serve it anyway so behaviour matches production |
| Responsive | Check at ≥1150px, ~1000px, ~800px and ~400px — the four states the breakpoints produce |
| Reduced motion | Confirm new animation is inside a `prefers-reduced-motion` guard |
| Links and modal | Any new `data-demo-src` opens the right page; any new external link has `target="_blank" rel="noopener"` |

Report honestly. If a check was skipped, say which and why.

---

## 7. Asking questions on a card

Comments work via the **Trello REST API**, not the MCP — the MCP has no comment support.
Credentials come from `.env` (see §9).

**To raise a question**, post a comment on the card. Use a JSON body — it is the only form
that cannot be double-encoded:

```bash
curl -s -X POST "https://api.trello.com/1/cards/$CARD_ID/actions/comments?key=$KEY&token=$TOKEN" \
  -H "Content-Type: application/json" \
  --data-binary @comment.json     # {"text": "Claude: @ankhitsharma1 BLOCKED — Q1. ..."}
```

Write `comment.json` with the Write tool, never with a shell heredoc or an inline `-d '...'`
string. A single quote inside the text breaks shell quoting and leaves `'\''` in the body.

Then move on to the next card and say in chat which cards are blocked and why.

### Encoding: the one way to get this wrong

**Never percent-encode the text yourself.** Two faults produce unreadable comments, and both
have happened on a sibling board:

1. **Double encoding** — text percent-encoded by hand and then again by `--data-urlencode`.
   Trello stores whatever it receives, so the escapes become the comment.
2. **A cp1252 console** — text piped through a Windows console that is not UTF-8, so `—`
   becomes `%97` and emoji become `??`. `%97` is not valid UTF-8, so it cannot be decoded back.

Rules that prevent both:

- Send a **JSON body**, as above. JSON escaping is handled by `JSON.stringify`, so no
  percent-encoding is involved at any point.
- If `--data-urlencode` is used instead, pass **raw UTF-8 text** and let curl encode it
  **exactly once**. Text that already contains `%28` or `%2C` is a bug, not input.
- Never pipe comment text through PowerShell. Use the Bash tool, or Node's `fetch` with a
  `JSON.stringify` body.
- **Verify after posting.** Read the comment back and check it for `%[0-9A-Fa-f]{2}`.
- Prefer plain ASCII punctuation. An em dash or an emoji is what turns a console-encoding
  problem into an unrecoverable one.

**To read answers:**

```bash
curl -s "https://api.trello.com/1/cards/$CARD_ID/actions?filter=commentCard&key=$KEY&token=$TOKEN"
```

Returns newest first. Each entry has `data.text`, `memberCreator.username`, and `date`.

**Card IDs:** the REST API takes the **raw 24-character id**, not the MCP's ARI. Strip the
`ari:cloud:trello::card/workspace/<workspaceId>/` prefix — the trailing segment is the id.

**Account note:** the API token is authorised as **`techcabana`**, so comments posted by this
workflow appear under that account. The owner is **`@ankhitsharma1`** — always mention that
handle, never `techcabana`, or the notification goes to the wrong account.

**Every comment written by the assistant MUST begin with `Claude:`.**

```
Claude: <the comment>
```

No exceptions, and no shorter form. It applies to every comment the assistant posts —
questions, status notes, merge records, gate results, scope changes, anything. Build the
prefix into the text before the request is made, so a comment cannot be posted without it.

Trello shows the account name, not who actually typed it, and the token authenticates as the
owner's own account. Without the prefix an assistant-written comment is indistinguishable
from one the owner typed — which matters most for approvals, since the approval gate would
otherwise be forgeable by the thing it is meant to gate. The owner's own comments carry no
prefix, so anything unprefixed is theirs.

**Never add the prefix to an existing unprefixed comment.** Unprefixed means the owner wrote
it, so relabelling one would falsify authorship — the exact failure the rule exists to prevent.

**Never assume. Never proceed on a guess.** A blocked card stays blocked until answered.

---

## 8. Code, commit and PR conventions

**Branches:** `<type>/<trello-shortlink>-<slug>` — e.g. `feat/rllFN9Hf-yugioh-project-page`.
The Trello short link makes the card ↔ branch mapping unambiguous.

**Commits:** [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).
```
feat: add Yu-Gi-Oh! card collection project page
fix: stop the demo modal iframe reloading on close
refactor: pull the toast helper out of the contact handler
style: align the deep-dive pages on one write-up card treatment
chore: add .gitignore and README
```

**PRs:** one **batch** per PR, up to three cards (§6.1 rule 2). The body carries a section per
card — what changed, why, how it was verified (§6.3) — and links every Trello card in the
batch. Write the PR URL back into each card's description. Name which model did the work.

**Code rules** (these also come from the global CLAUDE.md):
- snake_case as the default naming convention, except where the surrounding code and the DOM
  API already use camelCase — match the file you are in
- Comment functions to explain purpose
- Handle errors and exceptions properly — no silent failures. The contact form's
  `.catch()` → toast path is the pattern
- Keep code modular; use appropriate data structures
- Match the surrounding code's style, including its comment banners

**Accessibility is not optional.** Every image carries a real `alt`. Every control is
keyboard-reachable and has a visible focus state. New sections use real landmarks rather than
another `div`.

---

## 9. Tooling status

**✅ `gh` CLI — installed and authenticated.** Account `TechCabana`, scopes `gist`,
`read:org`, `repo`, `workflow`. The token lives in the **Windows keyring**, not `hosts.yml` —
that file does not exist and its absence proves nothing. Always check with `gh auth status`.

**✅ GitHub Pages — enabled.** Source: branch `main`, path `/`, `build_type: legacy`, HTTPS
enforced, serving at https://techcabana.github.io/. No workflow is involved: Jekyll's legacy
builder publishes the branch directly.

**✅ Trello — MCP for cards, lists and moves; REST for comments and label renames.** The MCP
can neither post comments nor rename a label; both need the REST API with credentials from
`.env`.

**⚠️ No CI, no tests, no build.** §6.3 is the substitute. Do not add a `ci.yml` badge or claim
a test count in the README until one exists.

**⚠️ Branch protection on `main`: none.** Verified 2026-08-10 — the API returns
`Branch not protected`. Nothing stops a direct push or a force-push, which is exactly why
§6.1 rules 4, 5 and 7 exist.

### Credential handling

Secrets are read from `.env` in the repo root. That file is **gitignored and never committed,
never printed, and never pasted into chat**. Read values from the environment at the point of
use; do not echo them.

```
TRELLO_API_KEY=...
TRELLO_TOKEN=...
```

The EmailJS keys in `index.html` are **not** secrets — see §3. If a real secret is ever
committed or exposed, rotate it immediately; removing the commit is not sufficient.

---

## 10. Session defaults

- Caveman mode ON (full) and auto mode ON — set by the global CLAUDE.md
- Caveman applies to chat only. Code, commits, PR bodies, README and this file are written
  normally.
- Auto mode does **not** override §6, §7 or §6.1 rule 7: on a workflow card, always ask
  rather than assume, and never commit or push unprompted.
