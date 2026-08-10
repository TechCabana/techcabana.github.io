<div align="center">

# Ankhit Sharma — Portfolio

**A static personal portfolio, published straight from `main`.**

[![Language](https://img.shields.io/github/languages/top/TechCabana/TechCabana.github.io?style=flat)](https://github.com/TechCabana/TechCabana.github.io)
[![Repo size](https://img.shields.io/github/repo-size/TechCabana/TechCabana.github.io?style=flat)](https://github.com/TechCabana/TechCabana.github.io)
[![Last commit](https://img.shields.io/github/last-commit/TechCabana/TechCabana.github.io?style=flat)](https://github.com/TechCabana/TechCabana.github.io/commits/main)
[![Open issues](https://img.shields.io/github/issues/TechCabana/TechCabana.github.io?style=flat)](https://github.com/TechCabana/TechCabana.github.io/issues)

[Live site](https://techcabana.github.io/) ·
[Getting started](#getting-started) ·
[Architecture](#architecture) ·
[Project structure](#project-structure) ·
[Testing](#testing)

</div>

---

## Overview

This is a single-page portfolio site: an introduction, a work history, a skills matrix, a
set of project deep-dives, education, and a contact form. It is hand-written HTML, CSS and
one plain JavaScript file, served by GitHub Pages. There is no framework, no build step, no
package manager and nothing running on a server.

The constraint that shaped everything else is the repository name. `TechCabana.github.io` is
a GitHub user site, so Pages publishes the branch root directly — **a push to `main` is a
deploy**, with no build to fail first and no staging URL to catch a mistake. Every working
practice in this repository follows from that.

### Goal

Have somewhere to point people that loads instantly on a phone, reads as deliberately built
rather than generated, and costs nothing to run. Adding a project should mean writing one
page and one card, not learning a build system again six months later.

### Scope

| In scope | Not in scope |
| --- | --- |
| A single-page portfolio with per-project deep-dive pages | A blog, a CMS, or anything with an admin surface |
| Static hosting on GitHub Pages | A runtime backend, a database, or user accounts |
| One dark visual system, tokenised in CSS | Per-page theming or a component library |
| Contact by form, via a third-party sender | Storing or processing messages in this repository |
| Hand-written HTML, CSS and ES5-compatible JavaScript | A bundler, a transpiler, or a package manager |

---

## Getting started

### Prerequisites

| Requirement | Version | Notes |
| --- | --- | --- |
| A web browser | any modern one | Enough to view the site |
| Git | any | |
| Node.js or Python | any recent | Only to serve the directory locally |

Nothing is installed, because there is nothing to install. The site has no dependencies that
are not loaded from a CDN at run time.

### 1. Clone

```bash
git clone https://github.com/TechCabana/TechCabana.github.io.git
cd TechCabana.github.io
```

### 2. Run

```bash
npx serve .            # or: python -m http.server 8000
```

Open the printed URL. You should see the hero section with the particle background, and the
navigation should highlight each section as you scroll.

Opening `index.html` straight from disk mostly works, because nothing uses `fetch()`. Serve
it anyway — it is the only way to be sure relative paths behave as they will in production.

### 3. Verify

There is no test suite. See [Testing](#testing) for what to check by hand instead.

### Everyday use

| Task | Command |
| --- | --- |
| Serve the site locally | `npx serve .` |
| Deploy | `git push origin main` — Pages republishes within about a minute |
| Check what is live | `gh api repos/TechCabana/TechCabana.github.io/pages --jq .status` |

### If it does not work

| Symptom | Cause | Fix |
| --- | --- | --- |
| A project thumbnail is blank | The `background-image` path in `style.css` does not resolve | Paths in `assets/css/style.css` are relative to the stylesheet, so they start `../images/`, not `assets/images/` |
| A deep-dive page loads unstyled | The page's `<link>` is wrong | Pages in `pages/` link `../assets/css/style.css` |
| The demo modal opens empty | `data-demo-src` points at a file that is not there | The attribute is a path relative to `index.html`, e.g. `pages/yugioh.html` |
| The contact form reports an error | The EmailJS origin allowlist does not include the origin you are on | Add `localhost` to the allowlist in the EmailJS dashboard, or test from the live domain |
| A change is live that you did not expect | A push to `main` is a deploy | `git revert` the commit and push again. Never force-push |

---

## Architecture

### Tools and technologies

![HTML5](https://img.shields.io/badge/HTML5-semantic-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-custom%20properties-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-vanilla-F7DF1E?style=flat&logo=javascript&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-222222?style=flat&logo=githubpages&logoColor=white)

| Layer | Choice | Why this one |
| --- | --- | --- |
| Markup and styles | Hand-written HTML and CSS | No build step means nothing sits between the source and what ships |
| Scripting | One plain JavaScript file, no modules | A page of scroll handlers and a modal does not need a framework or a bundler |
| Styling system | CSS custom properties in a single `:root` block | One place to change a colour; the alternative is hunting hex values across 1,600 lines |
| Typography | Google Fonts | Three families, preconnected. Self-hosting is a known trade to revisit |
| Contact | EmailJS, browser SDK | A static site cannot send mail. The alternative is a form backend or a serverless function, both of which add an account and a moving part |
| Hero background | particles.js | Loaded from a CDN and configured inline |
| Hosting | GitHub Pages, user site | Free, already on the same account, and the repository name makes it automatic |

### How the pieces fit

```
   you                       GitHub                        visitors
    │                          │                               │
    │  git push origin main    │                               │
    └─────────────────────────>│                               │
                               │  Pages (legacy builder)       │
                               ├──> serves main at /  ─────────┤
                               │                               │
                                                               │  page load
                               ┌───────────────────────────────┤
                               │                               │
                        Google Fonts  ────> typefaces          │
                        jsDelivr      ────> particles.js       │
                        jsDelivr      ────> EmailJS SDK ───────┴──> contact form
```

Everything except the three CDN assets is served from this repository. No request the site
makes carries a credential.

### End to end walk-through

1. A change is committed to a branch and reviewed in a pull request.
2. The pull request merges to `main`. There is no workflow — GitHub's legacy Pages builder
   picks the branch up directly.
3. Pages republishes the repository root within about a minute. The live site is now the
   contents of `main`.
4. A visitor loads `index.html`. It links `assets/css/style.css` for every style token and
   pulls three typefaces from Google Fonts.
5. `particles.js` initialises the hero canvas from the configuration block at the bottom of
   `index.html`.
6. `assets/js/main.js` wires the page: the navbar scroll state, the active-section
   highlight, smooth anchor scrolling, the mobile menu, a fade-up `IntersectionObserver`,
   the skills filter bar, the toast helper, the contact form and the demo modal.
7. Clicking a project's arrow button reads its `data-demo-src` attribute and loads that page
   from `pages/` into the modal's iframe.
8. Submitting the contact form calls `emailjs.sendForm()` with a service and template id.
   Success and failure both surface as a toast; the failure path also logs to the console.

### Why this approach

| Decision | Alternative considered | Why the choice was made |
| --- | --- | --- |
| No build step | Vite, or a static site generator | The site is four pages. A build step would add a toolchain to maintain and a way for the published output to differ from the source |
| Deep-dive pages in an iframe modal | Separate full-page navigation | The modal keeps the visitor in the portfolio and needs no routing. Each page is still a real URL that works on its own |
| Per-page `<style>` blocks for the deep-dives | Adding every rule to `style.css` | The deep-dive layout is used by four pages and nothing else. Keeping it out of the global sheet stops it competing with the portfolio's own layout |
| EmailJS from the browser | A form backend, or a serverless function | Neither is free forever and both add an account to maintain. EmailJS enforces on an origin allowlist, so its keys are publishable by design |
| A user site rather than a project site | `TechCabana/portfolio` with a Pages deploy workflow | A user site serves from the root, so the URL has no path prefix and no `base` to configure |
| No branch protection on `main` | Requiring a pull request | GitHub forbids self-approval and this is a single-account repository, so a required review would only block the one person who can merge. The pull request is a practice here, not a gate |

### Data model

None. The site holds no structured data — every value is written directly into the markup.

### Project structure

```
TechCabana.github.io/
├── index.html              the whole portfolio: nav, 7 sections, demo modal
├── pages/                  project deep-dives, opened in the modal iframe
│   ├── familytree.html
│   ├── wordoftheday.html
│   ├── utilitytool.html
│   └── yugioh.html
├── assets/
│   ├── css/style.css       every style rule; colour tokens live in :root at the top
│   ├── js/main.js          all behaviour, in labelled sections
│   └── images/             project thumbnails and screenshots
│       └── yugioh/         card art mirrored from the YuGiOhCardCollection repo
├── CLAUDE.md               project context and the working agreement
└── README.md               this file
```

| Path | Role |
| --- | --- |
| `index.html` | The single page. Sections are `#home`, `#about`, `#experience`, `#skills`, `#projects`, `#education`, `#contact` |
| `assets/css/style.css` | Design tokens, layout, components, and the `900px` / `640px` breakpoints. The projects grid adds one at `1150px` |
| `assets/js/main.js` | Navbar, scroll spy, smooth scroll, mobile menu, fade-up observer, skills filter, toast, contact form, demo modal |
| `pages/*.html` | One deep-dive per project. Each links the shared stylesheet for tokens and declares its own layout rules |
| `assets/images/` | Thumbnails referenced from `style.css` as `../images/…`, and screenshots referenced from a page as `../assets/images/…` |

Adding a project means two edits: a `.project-card` in the projects grid with a
`data-demo-src` attribute and a `project-thumb-N` class, a matching `project-thumb-N` rule in
`style.css`, and a new page in `pages/` copied from an existing one.

---

## Testing

**There is no automated test suite and no CI.** Saying otherwise would be the more flattering
option and the less useful one. Because a merge to `main` publishes immediately, the checks
below are run by hand before anything lands:

| Check | What it catches |
| --- | --- |
| Every new `src` and `url()` resolves on disk | A 404 image, invisible in a diff and obvious on the live site |
| Changed HTML parses with balanced tags | An unclosed element silently swallowing the rest of a section |
| CSS braces balance, and no colour is written outside `:root` | A stray hex value drifting away from the token system |
| The page renders when served over HTTP | Anything that depends on a path being relative to the right file |
| Four widths: ≥1150px, ~1000px, ~800px, ~400px | The states the three breakpoints actually produce |
| New motion sits inside a `prefers-reduced-motion` guard | An animation with no way to turn it off |
| New external links carry `target="_blank" rel="noopener"` | A tab-nabbing vector, and a lost visitor |

What this does not cover: the contact form's live delivery path, cross-browser rendering
outside Chromium, and anything about the CDN assets. Those are exercised by using the site.

---

## Contributing

This is a personal site, but issues and pull requests are welcome. Open an issue before
starting anything large, so the approach can be agreed first. Commits follow
[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), branches are named
`<type>/<slug>`, and work lands on `main` through a pull request. `CLAUDE.md` holds the full
working agreement, including the design rules the theme has to obey.

Bear in mind that merging to `main` publishes the site immediately.

---

## Licence

**No licence has been granted yet.** There is no `LICENSE` file in this repository, so default
copyright applies: all rights reserved, and the code may not be reused without permission.
Choosing a licence is an open decision tracked on the board — this section will be replaced
once it is made.

### Credits and third-party terms

- Typefaces — [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque),
  [Inter](https://fonts.google.com/specimen/Inter) and
  [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono), served by Google Fonts
  under the SIL Open Font License.
- [particles.js](https://github.com/VincentGarreau/particles.js) by Vincent Garreau, MIT.
- [EmailJS](https://www.emailjs.com/) browser SDK, used under their terms of service.
- Card artwork under `assets/images/yugioh/` comes from [YGOPRODeck](https://ygoprodeck.com/)
  and is mirrored rather than hotlinked, at their request. *Yu-Gi-Oh!* and all card names and
  artwork are trademarks of Konami; the project page is unaffiliated and carries no
  endorsement.

---

<div align="center">

<sub>Built and maintained by <a href="https://github.com/TechCabana">TechCabana</a></sub>

</div>
