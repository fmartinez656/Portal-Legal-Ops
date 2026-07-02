# CODING AGENTS: READ THIS FIRST

This started as a **handoff bundle** from Claude Design (claude.ai/design): a user mocked up designs in HTML/CSS/JS using an AI design tool, then exported this bundle so a coding agent could implement the designs for real.

**It is no longer a fresh, untouched handoff.** Since the original export, the repo has gone through a visual redesign iteration ("El Registro") and a cleanup pass. Read the "Current status" section below before assuming anything about what's still relevant.

## Current status (updated 2026-07-02)

- **`project/` is the source of truth.** It reflects the latest visual iteration ("El Registro": Fraunces/Libre Franklin/IBM Plex Mono typography, brand colors morado `#2E004F` + naranja `#FF8000`). This redesign was made directly by the user in a separate editor session and has **no corresponding chat transcript** — it's a real commit, not documented conversation, so don't expect to find its rationale in `chats/`.
- **The original single-file bundled `index.html` was removed** (it was a snapshot of an earlier iteration — different typography, still wired to a React/Babel-based "Tweaks" design-tool panel that was never part of the product). Don't look for it; it no longer exists and shouldn't be recreated.
- **The "Tweaks" panel (`tweaks.jsx` / `tweaks-panel.jsx`) is gone from `project/` too.** It was an internal control panel from the design tool (theme/density/typography live-editing), not part of the portal. Do not reintroduce it or its React/Babel CDN dependencies.
- **This has not been implemented in a production stack yet.** Everything in `project/` is still static prototype HTML/CSS/JS with mocked, in-memory data — no backend, no real auth, no persistence.
- **Production implementation for this project must follow Grupo Ternova's architecture policy (PT-ARQ-004)** before any code is written: domain decomposition, Azure API Management / Service Bus for integration, Entra ID for identity, containerized cloud-native compute, etc. An Architecture Definition Document is being drafted for this iniciative — check for a `docs/adrs/` directory; if present, read it before proposing a technical approach, since it may already answer questions you'd otherwise ask the user.

## What you should do — IMPORTANT

**Read the chat transcript first.** `chats/chat1.md` shows the full back-and-forth between the user and the design assistant for the original design pass — it tells you **what the user actually wanted** and **where they landed** after iterating. Don't skip it. Keep in mind it predates the "El Registro" redesign (see "Current status" above), so it won't explain the current typography/visual system, only the underlying functional model (roles, permissions, request flows, etc.), which is still accurate.

**Read `project/Portal Legal Ternova.html` in full.** Read it top to bottom — don't skim. Then **follow its imports**: open every file it pulls in (`data.js`, `app.js`, `views.js`, `styles.css`) so you understand how the pieces fit together before you start implementing.

**If anything is ambiguous, ask the user to confirm before you start implementing.** It's much cheaper to clarify scope up front than to build the wrong thing.

## About the design files

The design medium is **HTML/CSS/JS** — these are prototypes, not production code. Your job is to **recreate them pixel-perfectly** in whatever technology makes sense for the target codebase (React, Vue, native, whatever fits the approved architecture). Match the visual output; don't copy the prototype's internal structure (direct `innerHTML` manipulation, global mutable state) unless it happens to fit.

**Don't render these files in a browser or take screenshots unless the user asks you to.** Everything you need — dimensions, colors, layout rules — is spelled out in the source. Read the HTML and CSS directly; a screenshot won't tell you anything they don't.

## Repo contents

- `README.md` — this file
- `chats/chat1.md` — the original design conversation (read it!)
- `project/` — the current prototype: `Portal Legal Ternova.html`, `app.js`, `data.js`, `views.js`, `styles.css`
- `docs/origen/` — historical source material (the original truncated prototype text and brand guide image the design tool worked from). Reference only — not a source for implementation, everything relevant from it was already absorbed into `project/`.
- `docs/adrs/` — architecture documentation for the production build, if present (see "Current status" above).
