# Glossary Page — Design Spec

**Date:** 2026-04-16
**Audience:** Divya (primary user) and others new to fintech who need to understand individual terms *before* they can make sense of payment flows.
**Goal:** Add a standalone glossary page that teaches each of the 50 fintech/accounting terms in isolation — plain-English definition, bespoke animated SVG, concrete example, "don't confuse with" links, and a deep link into the flow where the term lives.

---

## 1. Problem

The current site (flow explorer at `index.html`) organises terms inside 6 payment flows. This is great once a user already knows what "Payment Processor" or "Acquirer" mean. Divya's feedback: users who don't know the terms can't meaningfully follow the flows. They need a term-first entry point.

## 2. Solution Overview

A new standalone page, `glossary.html`, that lists all 50 terms as a single-column accordion, grouped by domain, with a sticky search + filter bar. Each term expands to show a bespoke animated SVG plus structured learning copy. Every term links out to the existing flow explorer for "see it live."

## 3. Scope

### In scope
- New `glossary.html` page with accordion list of 50 terms
- Bespoke animated SVG per term (composed from shared primitives)
- New `data/glossary.json` holding plain-English "what it is" copy
- Search + domain filter (sticky bar)
- Deep linking within the glossary (`#term-id`) and out to flows
- Reciprocal navigation links in `index.html` and `glossary.html` headers
- Accessibility: keyboard nav, `prefers-reduced-motion`, `<title>`/`<desc>` on SVGs
- Mobile responsive down to 375px

### Out of scope
- Dark mode on glossary (site is light-only)
- Cross-page state sync for filter/search
- "Play again" animation controls
- Per-term analytics or learning progress tracking
- Rewriting existing `terms.json` `reference` copy (stays as-is for flow explorer)
- Bespoke SVG primitives for single-use cases (term falls back to static final frame)

## 4. Information Architecture

### Page structure (top to bottom)
1. **Header** — logo, nav links to "Flows" (index.html) and "Glossary" (current, active)
2. **Hero** — title + one-line description
3. **Sticky filter bar** — search input + 7 domain chips (`All · Rails · Merchant · Accounting · Compliance · Treasury/FX · Ops`)
4. **Term groups** — 6 domain sections, each with heading + count + list of term cards
5. **Footer** — minimal, consistent with main site

### Ordering
Terms are grouped by domain (matching `DESIGN_SPEC.md`), alphabetical within group:
- **Rails & Networks (11):** ACH, Card Network, Correspondent Banking, Faster Payments, Interchange, ISO 20022, RTP, SEPA / SEPA Instant, Settlement, SWIFT, Wire Transfer
- **Merchant Stack (9):** 3DS / SCA, Acquirer, Issuer, Merchant of Record, Payment Gateway, Payment Processor, Payment Provider (PSP), PayFac, Tokenization
- **Accounting (10):** Accounts Payable, Accounts Receivable, Accrual vs Cash, Chart of Accounts, Clearing Account, Double-Entry, Expense Code / GL Code, General Ledger, Journal Entry, Trial Balance
- **Compliance (7):** AML, KYB, KYC, PCI DSS, PSD2 / Open Banking, Safeguarding (UK), Sanctions Screening
- **Treasury & FX (8):** Cross-currency Netting, Cut-off Time, Float / Pre-funding, FX Spread / Markup, Mid-market Rate, Nostro / Vostro, Stablecoin Rails, Treasury Reconciliation
- **Ops & Reconciliation (5):** Chargeback, Pay-In, Pay-Out, Reconciliation, Refund vs Reversal

## 5. Term Card

### Closed state
- Title: term name, Fraunces 22px
- Subtitle: `alias` (if any) + domain + role, Inter 12px, `--ink-3`
- Chevron (▸) rotates on open
- Entire card is click target; also keyboard-reachable (Tab, Enter/Space)
- Hover: 1px `--teal` left border slides in

### Expanded state — 4 blocks
1. **Animation** — SVG scene, ~320×200 on desktop (left), full-width above text on mobile. Plays on expand, loops subtly. Reduced-motion users see static final frame.
2. **What it is** — plain-English paragraph (2–3 sentences). New copy in `glossary.json`.
3. **How to spot it** — realistic-numbers example. Reuses `example` from `terms.json`.
4. **Don't confuse with** — chips for each id in `connections.confusedWith`. Clicking jumps to that term's card + opens it.
5. **See it live →** — CTA button linking to `index.html#/flow/<flow-id>/step/<step-index>`. Derived from `seeItLive` in `glossary.json` if set, else `terms.flows[0]` with step auto-derived from `flows.json`.

### Accordion behaviour
- Multiple cards can be open simultaneously (users compare terms)
- Expand via CSS `grid-template-rows: 0fr → 1fr` for smooth height animation
- Animation lazy-mounts on first expand, stays mounted thereafter
- Deep-linked card (`glossary.html#acquirer`) auto-expands + scrolls into view + brief teal highlight pulse

## 6. Animation Approach

### Shared primitives (`js/glossary/animations/primitives.js`)
- `Node(label, icon, color)` — rounded rect matching flow-diagram node style
- `Arrow(from, to, {dashed, animated, label})` — directional edge with optional moving pulse
- `FeeBadge(amount)` — amber chip that detaches mid-flight
- `Timer(duration)` — small clock that ticks
- `Stack(items)` — vertical stack (batches, journal entries)
- `Check` / `X` — outcome markers
- `Ledger(rows)` — two-column debit/credit view for accounting terms
- `Globe(regions)` — cross-border scenes (SWIFT, correspondent banking)

### Per-term scene file
Each term exports a function returning an SVG fragment + a lightweight animation timeline (CSS keyframes or WAAPI). Target: ~15–30 lines per file.

Example:
```js
// animations/interchange.js
export default () => scene([
  Node("Acquirer", { x: 40, y: 80 }),
  Node("Issuer",   { x: 260, y: 80 }),
  Arrow("Acquirer", "Issuer", { label: "£6.50 auth" }),
  FeeBadge("£0.02", { detachAt: 0.6, settleOn: "Issuer" }),
]);
```

### Motion style
- Easing + duration match existing site (`--dur-2`, same cubic-bezier)
- Subtle pulse on arrows (same feel as flow renderer)
- No bouncy/playful motion
- `@media (prefers-reduced-motion: no-preference)` wrapper; reduced-motion users see static final frame

### Coverage plan
- **Priority 11 (full animation):** Payment Processor, Payment Provider (PSP), Payment Gateway, Acquirer, ACH, SWIFT, PayFac, Pay-In, Accounts Payable, Accounts Receivable, Expense Code
- **Remaining 39:** animated where the scene composes from existing primitives; static final frame if it would require a bespoke primitive for one term. No bespoke primitives added for single-use cases.

## 7. Search & Filter

- **Search:** free text, real-time. Matches against `name`, `alias`, domain. Non-matching cards hide; their domain heading hides if the whole group is empty.
- **Domain filter:** 7 chips, single-select, `All` default. Chip style reuses the existing tab look from `topbar.js`.
- **Compose:** search and filter combine (e.g., domain=Accounting + "ledger" narrows within accounting).
- **Empty state:** "No terms match. Try clearing filters." + reset link.
- **Keyboard:** `/` or `Cmd/Ctrl+K` focuses search (mirrors existing site). `Esc` clears search.

## 8. Data Model

### New file: `data/glossary.json`
Array of 50 objects, one per term, keyed by `id` to `terms.json`.

```jsonc
{
  "id": "payment-processor",
  "plain": "The tech plumbing that actually moves a card charge from the merchant through to the card network. It doesn't hold your money — it routes the message.",
  "seeItLive": { "flow": "card", "step": 2 }  // optional; defaults to terms.flows[0]
}
```

- `plain` — required, 2–3 sentences, plain English
- `seeItLive` — optional; if omitted, derive from `terms.flows[0]` and look up step index in `flows.json`

### Unchanged
- `data/terms.json` — untouched
- `data/flows.json` — untouched

## 9. File Structure

```
glossary.html                    # new, sibling of index.html
css/
  glossary.css                   # new; layout + accordion + animation wrappers
  tokens.css                     # existing, reused
  base.css                       # existing, reused
js/
  glossary/
    app.js                       # entry; wires search/filter/accordion
    term-card.js                 # renders one card (closed + expanded)
    animations/
      registry.js                # maps term id → animation constructor (dynamic import)
      primitives.js              # shared SVG primitives
      <term-id>.js               # one per animated term
data/
  glossary.json                  # new
  terms.json                     # unchanged
  flows.json                     # unchanged
```

### Module responsibility rules
- `glossary/app.js` — single `init()` entry; reads `terms.json` + `glossary.json`; sets up search, filter, accordion
- `term-card.js` — renders a card; no cross-module knowledge beyond the data it receives
- `animations/registry.js` — exposes `getAnimation(termId)` returning a constructor or a static-frame renderer. Uses dynamic import so animations load only when a card expands
- `animations/primitives.js` — pure SVG helpers; no state
- `animations/<term-id>.js` — composes primitives into a scene for one term

## 10. Navigation Between Pages

- Add "Glossary" link to `js/topbar.js` (main site header) → `/glossary.html`
- `glossary.html` header has reciprocal "Flows" link → `/index.html`
- No other changes to existing site files

## 11. Accessibility

- Each card uses native `<details><summary>` (styled)
- Animations wrapped in `@media (prefers-reduced-motion: no-preference)`; reduced-motion users see static final frame
- Each SVG has `<title>` + `<desc>` describing the scene
- Focus rings match existing site
- Target: Lighthouse a11y ≥ 95

## 12. Responsive Layout

- **≥960px:** animation left (320×200), text right
- **600–960px:** animation full-width on top (440×220), text below
- **<600px:** stacked; animation 280×160; filter chips horizontal-scroll

## 13. Definition of Done

- [ ] `glossary.html` loads and shows all 50 terms grouped by domain
- [ ] All 11 priority terms have animated SVGs playing on expand
- [ ] ≥25 non-priority terms have animated SVGs; remainder have static final frames — all 50 render something visual
- [ ] Search + domain filter work individually and together
- [ ] "Don't confuse with" chips jump to the right card and open it
- [ ] "See it live →" deep-links into the correct flow + step on `index.html`
- [ ] Main site header links to `/glossary.html`; glossary header links back
- [ ] Lighthouse a11y ≥ 95 on glossary page
- [ ] `prefers-reduced-motion` respected (static final frames only)
- [ ] Works on mobile viewport (375px wide)
- [ ] Deep link `glossary.html#<term-id>` auto-opens and scrolls to that term

## 14. Open Questions / Risks

- **Per-term "plain" copy authoring** — 50 × 2–3 sentences is ~100–150 sentences of new copy. Quality gate: Divya-equivalent reviewer should find each one genuinely plain-English. Not a blocker but the writing effort is real.
- **Primitive coverage** — if the 8 primitives don't compose into a scene for a non-priority term, we ship static. Expected range: 25–39 animated, 11–25 static among the non-priority 39. Acceptable per agreed scope.
- **Animation performance** — 50 potentially animating SVGs in one DOM. Mitigation: lazy-mount on first expand; pause loops when card is collapsed or off-screen (via `IntersectionObserver`).
