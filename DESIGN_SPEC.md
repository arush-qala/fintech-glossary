# FinTech Terminologies — Design Spec

**Date:** 2026-04-15
**Audience:** Arush (learning) and Divya (Senior Data Analyst/Scientist, Wise Business — 5 yrs).
**Goal:** An interactive, visual-first learning page that teaches 50 fintech + accounting terms through the lens of how money actually moves. Deployed on Vercel for easy sharing.

---

## 1. Product Goal

Teach the *relationships* between fintech terms, not just their definitions. Gateway vs processor vs PayFac is a connections problem — so the page is organised around **money flows**, with terms surfaced where they show up in the transaction lifecycle.

Every term answers three questions, exposed via a **lens toggle**:

1. **Reference** — what is it, in 2–3 lines.
2. **Connections** — what comes before/after it, what it's often confused with.
3. **Worked example** — a concrete sentence using realistic numbers.

## 2. Information Architecture

- **Top bar:** 6 flow tabs + lens toggle (Flow / Reference / Worked example).
- **Left sidebar:** 6 domain filters with term counts. "All" shows everything.
- **Centre pane:** active flow rendered as an SVG diagram; nodes are terms, edges show movement. Active step is highlighted; completed steps are muted green.
- **Right pane:** detail for the currently selected node — name, domain, role, the 3 lens tabs, "Often confused with" + "Next step" chips, step narration.
- **Bottom bar:** keyboard shortcuts legend.

## 3. The 6 Flows

Each flow is a linear sequence of 5–9 nodes (terms) with edges. The same term can appear in multiple flows.

| # | Flow | Seed example |
|---|------|--------------|
| 1 | Card payment | Customer taps contactless card at a UK café for £6.50 |
| 2 | B2B cross-border (Wise) | UK SME pays German supplier €950 via Wise Business |
| 3 | ACH / domestic | UK employer pays £3,200 salary via Faster Payments |
| 4 | SWIFT wire | US firm sends $50k to India; 2 correspondent hops |
| 5 | PayFac | Shopify onboards a boutique sub-merchant; first sale clears |
| 6 | AR / AP cycle | Invoice raised → customer pays → AP books the expense |

**Default flow on load:** B2B cross-border (Wise) — matches Divya's daily context at Wise Business.

## 4. The 50 Terms

Grouped by domain; each term carries a list of flow IDs it appears in. Full term data lives in `terms.json`; flow step sequences live in `flows.json`.

- **Rails & Networks (11):** Card network, Interchange, ACH, Faster Payments, SEPA / SEPA Instant, SWIFT, Correspondent banking, RTP (US), Wire transfer, ISO 20022, Settlement.
- **Merchant Stack (9):** Payment Gateway, Payment Processor, Payment Provider (PSP), Acquirer, Issuer, PayFac, Merchant of Record, Tokenization, 3DS / SCA.
- **Accounting (10):** Accounts Payable, Accounts Receivable, General Ledger, Expense code / GL code, Chart of accounts, Journal entry, Double-entry, Accrual vs Cash, Clearing account, Trial balance.
- **Compliance (7):** KYC, KYB, AML, Sanctions screening, PCI DSS, PSD2 / Open Banking, Safeguarding (UK).
- **Treasury & FX (8):** Mid-market rate, FX spread / markup, Nostro / Vostro, Float / pre-funding, Stablecoin rails, Cross-currency netting, Cut-off time, Treasury reconciliation.
- **Ops & Reconciliation (5):** Pay-In, Pay-Out, Reconciliation, Chargeback, Refund vs Reversal.

## 5. Data Model

```jsonc
// terms.json — array of 50 objects
{
  "id": "payment-provider",
  "name": "Payment Provider",
  "alias": ["PSP"],
  "domain": "merchant-stack",
  "role": "Orchestrator",
  "reference": "A licensed entity that holds client funds and moves money ...",
  "connections": {
    "confusedWith": ["payment-processor", "payment-gateway"],
    "upstream": ["pay-in-rail"],
    "downstream": ["fx-engine", "pay-out-rail"]
  },
  "example": "Wise Business receives £820 via Faster Payments, routes to FX ...",
  "flows": ["b2b-xborder", "card", "payfac"]
}
```

```jsonc
// flows.json — 6 objects, each a step sequence
{
  "id": "b2b-xborder",
  "title": "B2B cross-border — GBP → EUR via Wise Business",
  "scenario": "A UK SME pays a German supplier €950.",
  "steps": [
    { "termId": "payer",          "narration": "The SME initiates..." },
    { "termId": "faster-payments","narration": "..." },
    { "termId": "payment-provider","narration": "Wise receives the GBP ..." },
    { "termId": "fx-engine",      "narration": "Mid-market rate applied ..." },
    { "termId": "sepa-instant",   "narration": "..." },
    { "termId": "beneficiary",    "narration": "..." }
  ],
  "layout": [
    { "termId": "payer",           "x": 60,  "y": 130 },
    { "termId": "faster-payments", "x": 185, "y": 60  }
    // ... node coordinates for the SVG diagram
  ]
}
```

Node positions are authored per flow (not auto-laid-out) so each diagram reads cleanly.

## 6. Interactivity

- **Step-through:** `→` advances, `←` reverses, `Space` or Auto button toggles auto-advance (2.5s/step). Active node highlighted amber; completed nodes muted green; upcoming nodes neutral.
- **Lens toggle:** `1` / `2` / `3` or click — swaps detail pane between Reference / Connections / Worked example. Selection persists across steps.
- **Domain filter:** clicking a sidebar chip dims non-matching nodes in the current flow (grey 30% opacity) and highlights matching ones; rebuilds the detail pane's terms list.
- **Flow switch:** click a top tab or press `g` to cycle. Resets step to 0.
- **Search:** `/` opens an inline term search (Cmd/Ctrl+K also). Selecting a result jumps to the first flow containing that term and highlights it.
- **Chip clicks in detail pane:** clicking "Often confused with →" or "Next step →" chips selects that term.

## 7. Visual Design

- **Palette:** warm-white paper `#fbfaf6`, dark slate text `#0f172a`, teal `#0d9488` (links/interactive), amber `#d97706` (active step), green `#10b981` (completed), slate `#64748b` (meta). All text-on-background combinations meet WCAG AA contrast.
- **Typography:** Fraunces (serif, headings), Inter (sans, UI + body), JetBrains Mono (small labels). Self-host via `@font-face` with WOFF2 in `assets/fonts/` — no external font requests.
- **Motion:** 180ms ease for node state changes, 240ms for pane transitions. `prefers-reduced-motion` disables non-essential motion.
- **Icons:** inline SVG only. No icon library dependency.

## 8. Responsive & Accessibility

- **≥1024px (desktop):** 3-column layout as mocked.
- **768–1023px:** sidebar collapses into a horizontal filter scroller above the flow pane.
- **<768px (mobile):** detail pane moves below the flow diagram; flow diagram becomes vertical (top-down) instead of horizontal.
- **Keyboard-first:** every interaction reachable via keyboard. Visible focus rings (2px teal outline).
- **ARIA:** flow diagram uses `role="group"` with labelled `role="button"` nodes. Step narration announced via `aria-live="polite"`. Lens toggle as a proper tablist.

## 9. File Structure

```
Fintech terminologies/
├── index.html              # single-page shell
├── css/
│   └── app.css             # ~400 lines, no framework
├── js/
│   ├── app.js              # entry, wires everything
│   ├── flow-renderer.js    # builds the SVG diagram
│   ├── detail-pane.js      # renders the right pane
│   ├── router.js           # hash-based: #/flow/b2b-xborder/step/3
│   └── search.js
├── data/
│   ├── terms.json          # all 50 terms
│   └── flows.json          # 6 flows with node layouts
├── assets/
│   ├── fonts/              # self-hosted Fraunces, Inter, JetBrains Mono WOFF2
│   └── favicon.svg
├── vercel.json             # cache headers + clean URLs
├── README.md               # local preview + deploy instructions
└── DESIGN_SPEC.md          # this file
```

No build step, no bundler, no framework. Plain ES modules loaded by `<script type="module">`.

## 10. Deployment

- **Local preview:** any static server (`python3 -m http.server 8000`, or `npx serve`).
- **Vercel:** `npx vercel` from the project root; auto-detected as static. `vercel.json` sets 1-year cache on `/assets/*`, `/css/*`, `/js/*` and no-cache on HTML. Clean URLs enabled.
- **Sharing:** the Vercel URL is shareable with Divya directly. URL state (flow + step + lens) is captured in the hash so specific steps are linkable.

## 11. Out of Scope (explicit)

- User accounts, progress tracking, quizzes.
- Editing terms in-browser (content edits happen by editing `terms.json`).
- Internationalisation (English only).
- Offline/PWA behaviour.
- Analytics.
- Dark mode (light is the explicit choice).

## 12. Done criteria

1. All 50 terms present in `terms.json` with reference / connections / example populated.
2. All 6 flows present in `flows.json` with step sequences + node layouts.
3. Step-through works in every flow without layout breakage.
4. Lens toggle, domain filter, search, and keyboard shortcuts all functional.
5. Responsive layout works at 375px, 768px, 1280px.
6. `vercel deploy` ships a working URL.
7. README documents: content-editing workflow, local preview command, deploy command.
