# AGENTS.md — Ashton Sprunger Master Site (`ashtonsprunger.com`)

## 1. Executive Summary & Design Philosophy

This repository houses the source code for the personal site and portfolio of **Ashton Sprunger**, targeted for deployment at `ashtonsprunger.com`.

### Core Philosophy: Utilitarian, Quiet, and "Underbaked"
The site deliberately rejects modern agency fluff, marketing slogans, gradient glows, card grids, and interactive gimmicks. It is designed to read like a **clean, fast, plain-text document**—understated, direct, and unpretentious.

* **No marketing jargon:** State facts plainly. Zero buzzwords, zero hype.
* **No graphics, decorative images, or canvas simulations:** No animated waveforms, no simulated scatter plots, no card backgrounds, no ambient glow or blur circles.
* **Minimalist palette:** Strictly monochrome or near-monochrome (black/off-black background, muted light text, subtle gray dividers).
* **Zero client JavaScript by default:** Pure static HTML and minimal CSS. No stateful islands unless strictly requested.
* **Single-column layout:** Narrow, readable column (left-aligned, reading document style), standard text links, simple horizontal rules, and generous whitespace.

---

## 2. Hard Boundaries & Factual Constraints

All agents working on this codebase **must strictly observe** the following rules:

### A. Software
* **Focus:** Pure software development only.
* **NO Hardware:** Do **NOT** include hardware, microcontrollers, Arduino builds, telescope electronic focusers (e.g., Ardufocus), or DIY soldering projects.
* **Software Subpage:** `/software` is a dedicated subpage expanding each software project with sub-links (with smooth view transitions to/from the homepage).
* **Flagship Project:** **AstroPlot RAW** (`/software/astroplot`)
  * *What it is:* A desktop tool for astrophotographers to organize RAW exposure files (`.CR2`, `.CR3`, `.NEF`, `.ARW`, `.FITS`).
  * *How it works:* Plots brightness against capture time to group files into `/lights`, `/darks`, `/flats`, and `/biases` for stacking programs (Siril, DeepSkyStacker, PixInsight).
  * *Key Facts:* Local-first, runs 100% offline on CPU, zero telemetry, non-destructive file operations with local undo.
  * *Links:* Direct download (.exe), buy license ($9.99), video walkthrough.
* **Additional Projects:**
  * `siteslips.com`
  * `convertthings.com`
  * GitHub (`github.com/ashtonsprunger`)
  * Checkers AI (`/software/checkers`)

### B. Photography
* **Photography Subpage (`/photography`):** Quiet expanded directory subpage showing photography items (portfolio overview, categories, Facebook) with smooth view transitions.
* **Commercial Portfolio (`/photography/portfolio` or `/portfolio`):** Standalone commercial photography portfolio with dedicated layout ("Ashton Sprunger Photography"), wider canvas, and high visual presentation.
* **NOT an Astrophotographer:** Ashton is **not** an astrophotographer. His photography business does not include deep-sky imaging.
* **Actual Focus:** 
  * **Portraits & Seniors:** High school seniors, personal branding, and creative portraits in **Fort Wayne, Indiana**.
  * **Families & Community:** Outdoor family sessions and local community documentary work.
* **Features:** Dedicated photography header, clean modern gallery, client investment/packages, and dedicated session booking inquiry flow.

### C. Music
* **Music Subpage (`/music`):** Quiet expanded directory subpage focusing on **Hope Harmony** as the primary artist project with sub-links to `hopeharmony.net`, Spotify, Apple Music, and YouTube.
* **Exclusively Hope Harmony:** All music work centers on Hope Harmony.

---

## 3. Technology Stack & Rules

* **Framework:** **Astro** (static output mode)
* **Styling:** **Tailwind CSS** (restricted to simple typography, colors, borders, and spacing)
* **JavaScript:** **0 KB client-side JS** (pure HTML/CSS)
* **Hosting Target:** Cloudflare Pages or Vercel (`ashtonsprunger.com`)

---

## 4. Visual Design System

* **Background:** Deep neutral / near-black (`#0e0e10` or `#111111`)
* **Text:** Neutral off-white (`#e5e5e5` / `#d4d4d4`) with muted secondary gray (`#888888` / `#a3a3a3`)
* **Links:** Underlined, high-contrast, clean hover states (`text-neutral-200 underline hover:text-white`)
* **Dividers:** Simple hairline borders (`border-neutral-800`)
* **Typography:** Clean system sans-serif or monospace throughout; no decorative fonts
* **Structure:** Single column (`max-w-2xl`), left-aligned, standard paragraph margins

---

## 5. Site Map & Navigation

```
/ (Home)                           — Plain intro, directory index of disciplines, links
├── /software                      — Software directory expanding each item with sub-links
│   ├── /software/astroplot        — Dedicated AstroPlot RAW product landing page
│   └── /software/checkers         — Checkers AI vs. Dave browser game
├── /photography                   — Quiet expanded photography subpage
│   └── /photography/portfolio     — Dedicated commercial portrait portfolio (/portfolio redirects here)
├── /music                         — Quiet expanded music subpage for Hope Harmony
├── /about                         — 2-3 short paragraphs + plain list of tools used
└── /contact                       — Email address, location, simple contact method
```

---

## 6. Guidelines for AI Agents

1. **Resist Feature Creep & Decoration:** Do not add badges, pills, glow effects, gradients, shadows, carousels, modals, canvas visualizers, or synthesizers.
2. **Ruthless Brevity:** Keep copy as concise as possible. If a paragraph can be a sentence, make it a sentence. If it can be omitted, omit it.
3. **Preserve Truthfulness:** Never claim astrophotography, never include hardware, and keep music 100% focused on Hope Harmony.
4. **Fast & Accessible:** Ensure the site loads instantaneously on any device with standard semantic HTML.
