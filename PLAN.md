# FinTech Terminologies — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship an interactive, light-themed static site that teaches 50 fintech + accounting terms through 6 money flows, deployable to Vercel via `npx vercel`.

**Architecture:** Single-page static site. No framework, no bundler. Plain HTML + CSS + ES modules. Data split between `terms.json` (50 terms) and `flows.json` (6 flows with SVG node coordinates). Hash-based router for shareable step URLs.

**Tech Stack:** HTML5 + CSS3 (custom properties, grid, flex) + ES modules. Inline SVG for diagrams. Self-hosted fonts (Fraunces, Inter, JetBrains Mono WOFF2). Vercel for hosting.

**Project root:** `Superprof Freelance Projects/Fintech terminologies/` (all paths below are relative to this root).

---

## File Structure

```
.
├── index.html              # SPA shell
├── css/
│   ├── tokens.css          # palette, type, spacing CSS custom properties
│   ├── base.css            # reset + typography + @font-face
│   └── app.css             # layout + component styles
├── js/
│   ├── app.js              # entry point, wires everything
│   ├── state.js            # central reactive state (flow, step, lens, filter, selectedTermId)
│   ├── flow-renderer.js    # builds the SVG diagram for the active flow
│   ├── detail-pane.js      # renders the right-side detail pane
│   ├── sidebar.js          # domain filter chips
│   ├── topbar.js           # flow tabs + lens toggle
│   ├── controls.js         # step controls + keyboard bindings
│   ├── search.js           # `/` and Cmd/Ctrl+K search overlay
│   └── router.js           # hash-based URL state
├── data/
│   ├── terms.json          # 50 terms
│   └── flows.json          # 6 flows with node layouts
├── assets/
│   ├── fonts/              # Fraunces, Inter, JetBrains Mono WOFF2 files
│   └── favicon.svg
├── vercel.json
├── README.md
├── DESIGN_SPEC.md          # already exists
└── PLAN.md                 # this file
```

**File responsibility rules:**
- Each `js/*.js` module exports a single `init(root, state)` function or similar single-purpose API. Modules read from `state` and subscribe to its change events; they never reach into each other.
- CSS is split by concern (tokens → base → app), never by component. Component styles live in `app.css` in the order components appear on the page.

---

## Task 1: Scaffold project + git init

**Files:**
- Create: `index.html`, `README.md`, `vercel.json`, `.gitignore`, `css/tokens.css`, `css/base.css`, `css/app.css`, `js/app.js`, `data/terms.json`, `data/flows.json`, `assets/favicon.svg`
- Initialise git at project root.

- [ ] **Step 1: Create folder structure**

```bash
cd "Superprof Freelance Projects/Fintech terminologies"
mkdir -p css js data assets/fonts
```

- [ ] **Step 2: Initialise git**

```bash
git init
```

- [ ] **Step 3: Create `.gitignore`**

```
.superpowers/
.DS_Store
.vercel/
node_modules/
```

- [ ] **Step 4: Create `index.html` (minimal shell)**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>FinTech Terminologies — how money actually moves</title>
  <meta name="description" content="An interactive, visual guide to 50 fintech and accounting terms across 6 money flows.">
  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
  <link rel="stylesheet" href="/css/tokens.css">
  <link rel="stylesheet" href="/css/base.css">
  <link rel="stylesheet" href="/css/app.css">
</head>
<body>
  <div id="app" class="app">
    <header class="topbar" data-topbar></header>
    <aside class="sidebar" data-sidebar></aside>
    <main class="flowpane" data-flowpane></main>
    <section class="detail" data-detail></section>
    <footer class="hintbar" data-hintbar></footer>
  </div>
  <div class="search-overlay" data-search hidden></div>
  <script type="module" src="/js/app.js"></script>
</body>
</html>
```

- [ ] **Step 5: Create `js/app.js` (entry stub)**

```js
console.log("flowstack booting");
```

- [ ] **Step 6: Create placeholder empty files**

Create empty `css/tokens.css`, `css/base.css`, `css/app.css`, `data/terms.json` (content `[]`), `data/flows.json` (content `[]`).

- [ ] **Step 7: Create `assets/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="#fbfaf6"/>
  <path d="M6 16h20M6 16l5-4M6 16l5 4M26 16l-5-4M26 16l-5 4" stroke="#0d9488" stroke-width="2.2" fill="none" stroke-linecap="round"/>
</svg>
```

- [ ] **Step 8: Create `README.md`**

````markdown
# FinTech Terminologies

Interactive learning page covering 50 fintech + accounting terms through 6 money flows.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

```bash
npx vercel
```

## Edit content

- `data/terms.json` — the 50 terms.
- `data/flows.json` — 6 flows with step sequences and SVG node layouts.

See `DESIGN_SPEC.md` for the full design rationale.
````

- [ ] **Step 9: Verify shell loads without error**

Run: `python3 -m http.server 8000`
Open `http://localhost:8000`. Open DevTools console. Expected: `flowstack booting` logged, no network errors except the empty CSS/JSON files (which should 200).

- [ ] **Step 10: Commit**

```bash
git add .
git commit -m "scaffold: project structure + shell HTML"
```

---

## Task 2: Design tokens + self-hosted fonts

**Files:**
- Modify: `css/tokens.css`, `css/base.css`
- Add: `assets/fonts/*.woff2` (4 files, see step 2)

- [ ] **Step 1: Populate `css/tokens.css`**

```css
:root {
  /* Palette */
  --paper:       #fbfaf6;
  --paper-warm:  #f1ede3;
  --ink:         #0f172a;
  --ink-2:       #334155;
  --ink-3:       #64748b;
  --line:        #e7e5de;
  --line-soft:   #eef0ec;
  --surface:     #ffffff;

  --teal:        #0d9488;
  --teal-tint:   #ecfeff;
  --teal-line:   #a5f3fc;

  --amber:       #d97706;
  --amber-tint:  #fef3c7;
  --amber-line:  #fde68a;

  --green:       #10b981;
  --green-tint:  #ecfdf5;

  --red:         #ef4444;
  --indigo:      #6366f1;
  --violet:      #a855f7;
  --slate:       #64748b;

  /* Type */
  --ff-serif: "Fraunces", "Iowan Old Style", Georgia, serif;
  --ff-sans:  "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
  --ff-mono:  "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;

  --fs-10: 10px; --fs-11: 11px; --fs-12: 12px; --fs-13: 13px;
  --fs-14: 14px; --fs-16: 16px; --fs-18: 18px; --fs-22: 22px;
  --fs-28: 28px; --fs-36: 36px;

  --lh-tight: 1.25; --lh-body: 1.55;

  /* Spacing */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 20px;
  --s-6: 24px; --s-8: 32px; --s-10: 40px;

  /* Radii + shadow */
  --r-sm: 6px; --r-md: 8px; --r-lg: 10px; --r-xl: 14px; --r-pill: 999px;
  --shadow-1: 0 1px 2px rgba(15,23,42,.04), 0 4px 12px rgba(15,23,42,.04);
  --shadow-2: 0 4px 20px rgba(15,23,42,.08);

  /* Motion */
  --dur-1: 180ms; --dur-2: 240ms; --ease: cubic-bezier(.2,.7,.3,1);
}

@media (prefers-reduced-motion: reduce) {
  :root { --dur-1: 0ms; --dur-2: 0ms; }
}
```

- [ ] **Step 2: Download font files**

Download from the noted sources and place the exact WOFF2 files into `assets/fonts/`:

- `inter-400.woff2` — Inter Regular — https://rsms.me/inter/font-files/Inter-Regular.woff2
- `inter-600.woff2` — Inter SemiBold — https://rsms.me/inter/font-files/Inter-SemiBold.woff2
- `fraunces-600.woff2` — Fraunces SemiBold — https://fonts.gstatic.com/s/fraunces/v31/6NUh8FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk.woff2
- `jetbrainsmono-400.woff2` — JetBrains Mono Regular — https://fonts.gstatic.com/s/jetbrainsmono/v20/tDba2o-flEEny0FZhsfKu5WU4xD-IQ-PuZJJXxfpAO-L.woff2

If any URL fails, use an equivalent WOFF2 from fonts.google.com and rename to the filenames above.

- [ ] **Step 3: Populate `css/base.css`**

```css
@font-face { font-family: "Inter"; src: url("/assets/fonts/inter-400.woff2") format("woff2"); font-weight: 400; font-display: swap; }
@font-face { font-family: "Inter"; src: url("/assets/fonts/inter-600.woff2") format("woff2"); font-weight: 600; font-display: swap; }
@font-face { font-family: "Fraunces"; src: url("/assets/fonts/fraunces-600.woff2") format("woff2"); font-weight: 600; font-display: swap; }
@font-face { font-family: "JetBrains Mono"; src: url("/assets/fonts/jetbrainsmono-400.woff2") format("woff2"); font-weight: 400; font-display: swap; }

*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
html { font-size: 16px; }
body {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--ff-sans);
  line-height: var(--lh-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
h1, h2, h3, h4 { font-family: var(--ff-serif); font-weight: 600; line-height: var(--lh-tight); margin: 0; }
button { font: inherit; color: inherit; background: none; border: none; cursor: pointer; padding: 0; }
a { color: var(--teal); text-decoration: none; }
a:hover { text-decoration: underline; }
:focus-visible { outline: 2px solid var(--teal); outline-offset: 2px; border-radius: 4px; }
kbd {
  font-family: var(--ff-mono); font-size: var(--fs-10);
  background: var(--paper-warm); padding: 2px 6px; border-radius: 4px; border: 1px solid var(--line);
}
[hidden] { display: none !important; }
```

- [ ] **Step 4: Verify fonts load**

Reload `http://localhost:8000`. Open DevTools Network tab, filter to Font. Expected: all 4 woff2 files return 200. Body text should render in Inter (check via Computed styles tab).

- [ ] **Step 5: Commit**

```bash
git add css/ assets/fonts/
git commit -m "design: tokens + self-hosted fonts"
```

---

## Task 3: Author `data/terms.json` (all 50 terms)

**Files:** Create: `data/terms.json`

The full content is provided below. Each term has: `id`, `name`, `alias` (optional), `domain`, `role`, `reference`, `connections` (`confusedWith`, `upstream`, `downstream`), `example`, `flows`.

- [ ] **Step 1: Replace `data/terms.json` with the following content**

```json
[
  { "id": "card-network", "name": "Card Network", "alias": ["Scheme"], "domain": "rails", "role": "Scheme",
    "reference": "The rails that route card authorisations between the acquirer and issuer. Visa, Mastercard, Amex, Discover. They set the rules and the interchange tables.",
    "connections": { "confusedWith": ["payment-processor"], "upstream": ["payment-processor"], "downstream": ["issuer"] },
    "example": "When a £6.50 contactless tap leaves the processor, it's the card network (Visa) that routes it to the issuing bank for approval.",
    "flows": ["card", "payfac"] },

  { "id": "interchange", "name": "Interchange", "domain": "rails", "role": "Fee",
    "reference": "The fee the acquirer pays the issuer on every card transaction. Set by the card network, not negotiable by the merchant. The largest component of card acceptance cost.",
    "connections": { "confusedWith": ["acquirer-fee"], "upstream": ["card-network"], "downstream": ["issuer"] },
    "example": "On that £6.50 coffee, roughly 0.20% + £0.01 is interchange — flowing from the café's acquirer to the cardholder's issuer.",
    "flows": ["card", "payfac"] },

  { "id": "ach", "name": "ACH", "alias": ["Automated Clearing House"], "domain": "rails", "role": "Rail",
    "reference": "The US batch rail for low-cost bank transfers. Settles in batches (same-day or next-day), not real time. Used for payroll, bill pay, B2B.",
    "connections": { "confusedWith": ["rtp", "wire-transfer"], "upstream": ["payer"], "downstream": ["settlement"] },
    "example": "A US employer debits 500 employees' salaries via a single ACH file submitted by 3pm; funds arrive next business day.",
    "flows": ["ach", "ar-ap"] },

  { "id": "faster-payments", "name": "Faster Payments (UK)", "domain": "rails", "role": "Rail",
    "reference": "The UK's real-time bank-to-bank rail. Push payments, typically settle within seconds, 24/7. Widely used by fintechs like Wise for GBP pay-ins.",
    "connections": { "confusedWith": ["sepa-instant", "rtp"], "upstream": ["payer"], "downstream": ["payment-provider"] },
    "example": "A UK SME initiates a £1,000 Wise top-up; Faster Payments lands the funds in Wise's GBP safeguarded account within 20 seconds.",
    "flows": ["b2b-xborder", "ach", "ar-ap"] },

  { "id": "sepa-instant", "name": "SEPA / SEPA Instant", "domain": "rails", "role": "Rail",
    "reference": "The Eurozone's bank transfer network. SEPA Credit Transfer (SCT) is T+1; SEPA Instant (SCT Inst) settles in under 10 seconds, 24/7.",
    "connections": { "confusedWith": ["faster-payments"], "upstream": ["payment-provider"], "downstream": ["beneficiary"] },
    "example": "Wise pays the German supplier €950 via SEPA Instant; the supplier sees the credit in their Deutsche Bank account in 8 seconds.",
    "flows": ["b2b-xborder", "ach"] },

  { "id": "swift", "name": "SWIFT", "alias": ["Society for Worldwide Interbank Financial Telecommunication"], "domain": "rails", "role": "Messaging",
    "reference": "A messaging network between banks, not a money rail. Banks use SWIFT to send payment instructions; actual settlement happens via nostro/vostro accounts they hold with each other.",
    "connections": { "confusedWith": ["wire-transfer", "iso-20022"], "upstream": ["payer"], "downstream": ["correspondent-banking"] },
    "example": "Chase sends a SWIFT MT103 message saying 'debit our nostro at HSBC London, credit beneficiary at HDFC Mumbai'. The money moves via those account entries, not over SWIFT itself.",
    "flows": ["swift"] },

  { "id": "correspondent-banking", "name": "Correspondent Banking", "domain": "rails", "role": "Plumbing",
    "reference": "The chain of intermediary banks a cross-border payment hops through when the sending and receiving banks have no direct relationship. Each hop takes fees and time.",
    "connections": { "confusedWith": ["payment-provider"], "upstream": ["swift"], "downstream": ["nostro-vostro"] },
    "example": "A $50k wire from a Miami bank to an Indonesian bank routes Miami → JPMorgan New York → Standard Chartered Singapore → the Indonesian bank. Three hops, three fees, 2 days.",
    "flows": ["swift"] },

  { "id": "rtp", "name": "RTP (US)", "alias": ["Real-Time Payments"], "domain": "rails", "role": "Rail",
    "reference": "The Clearing House's real-time US rail. Alternative to ACH for instant credit transfers. Available 24/7 but not yet ubiquitous across US banks.",
    "connections": { "confusedWith": ["ach", "fednow"], "upstream": ["payer"], "downstream": ["beneficiary"] },
    "example": "A gig worker requests instant payout; the platform pushes $340 via RTP and it lands in their Bank of America account in under 10 seconds.",
    "flows": ["ach"] },

  { "id": "wire-transfer", "name": "Wire Transfer", "domain": "rails", "role": "Rail",
    "reference": "High-value, same-day, usually irrevocable bank-to-bank transfer. Fedwire in the US, CHAPS in the UK. Used for property, treasury, and cross-border.",
    "connections": { "confusedWith": ["swift", "ach"] },
    "example": "A UK buyer completes a £420,000 house purchase via a CHAPS wire — it settles same-day and cannot be clawed back.",
    "flows": ["swift"] },

  { "id": "iso-20022", "name": "ISO 20022", "domain": "rails", "role": "Standard",
    "reference": "The XML message standard replacing legacy SWIFT MT formats. Carries richer structured data (purpose codes, full addresses, remittance info) so compliance and reconciliation work better.",
    "connections": { "confusedWith": ["swift"], "upstream": ["swift"], "downstream": ["reconciliation"] },
    "example": "Under ISO 20022, a €950 payment can carry the invoice number in structured form, so the supplier's AR system auto-matches it without emailing the buyer.",
    "flows": ["swift", "b2b-xborder"] },

  { "id": "settlement", "name": "Settlement", "domain": "rails", "role": "Event",
    "reference": "The moment the actual money moves between parties, as opposed to authorisation (a promise to pay). A card auth happens in seconds; settlement can take 1–3 days.",
    "connections": { "confusedWith": ["authorisation"], "upstream": ["acquirer"], "downstream": ["merchant-account"] },
    "example": "The café gets an auth at 8:02am for £6.50, but the settled £6.43 (net of fees) lands in their bank account two days later.",
    "flows": ["card", "swift", "b2b-xborder"] },

  { "id": "payment-gateway", "name": "Payment Gateway", "domain": "merchant-stack", "role": "Front-end",
    "reference": "The checkout-layer component that captures card details, encrypts them, tokenises the PAN, and hands off to the processor. It is the 'card reader of the internet' — it does not itself move money.",
    "connections": { "confusedWith": ["payment-processor", "payment-provider"], "downstream": ["payment-processor"] },
    "example": "Shopify's checkout page uses Stripe's gateway: the card number goes directly to Stripe, Shopify only ever sees a token.",
    "flows": ["card", "payfac"] },

  { "id": "payment-processor", "name": "Payment Processor", "domain": "merchant-stack", "role": "Back-end",
    "reference": "The engine that takes the gateway's request and actually talks to the card network and issuer for authorisation. Also handles settlement and reporting to the merchant.",
    "connections": { "confusedWith": ["payment-gateway", "payment-provider"], "upstream": ["payment-gateway"], "downstream": ["card-network"] },
    "example": "Worldpay receives the tokenised £6.50 from the café's gateway, routes it through Visa, gets the Issuer's approval, and sends back APPROVED.",
    "flows": ["card", "payfac"] },

  { "id": "payment-provider", "name": "Payment Provider (PSP)", "alias": ["PSP"], "domain": "merchant-stack", "role": "Orchestrator",
    "reference": "A licensed entity that bundles gateway + processor + accounts + FX + compliance into one product surface. Stripe, Adyen, Wise Business, Airwallex. Merchants integrate once; the PSP routes to rails.",
    "connections": { "confusedWith": ["payment-processor", "payment-gateway"], "upstream": ["pay-in"], "downstream": ["pay-out", "fx"] },
    "example": "Wise Business holds the UK SME's GBP, converts to EUR at mid-market, and pays out via SEPA Instant — one integration, one dashboard, four rails touched.",
    "flows": ["card", "b2b-xborder", "payfac"] },

  { "id": "acquirer", "name": "Acquirer", "alias": ["Acquiring Bank"], "domain": "merchant-stack", "role": "Merchant-side bank",
    "reference": "The merchant's bank in a card transaction. It sponsors the merchant into the card network, receives settled funds, and deposits them into the merchant account.",
    "connections": { "confusedWith": ["issuer", "payment-processor"], "upstream": ["payment-processor"], "downstream": ["merchant-account"] },
    "example": "Barclaycard is the café's acquirer: Visa settles the day's batch to Barclaycard, Barclaycard credits the café's business current account the next morning.",
    "flows": ["card", "payfac"] },

  { "id": "issuer", "name": "Issuer", "alias": ["Issuing Bank"], "domain": "merchant-stack", "role": "Cardholder-side bank",
    "reference": "The cardholder's bank. It issued the card, holds the cardholder's funds or credit line, and authorises or declines each transaction based on balance, risk, and fraud checks.",
    "connections": { "confusedWith": ["acquirer"], "upstream": ["card-network"], "downstream": ["cardholder"] },
    "example": "Lloyds (the issuer) sees the £6.50 auth request via Visa, confirms the customer has funds, runs a fraud check, and replies APPROVED.",
    "flows": ["card"] },

  { "id": "payfac", "name": "PayFac", "alias": ["Payment Facilitator"], "domain": "merchant-stack", "role": "Platform model",
    "reference": "A platform that onboards sub-merchants under its own master acquirer contract, so each sub-merchant doesn't need to sign separately with an acquirer. Faster onboarding, platform takes on risk.",
    "connections": { "confusedWith": ["payment-provider", "acquirer"], "upstream": ["acquirer"], "downstream": ["sub-merchant"] },
    "example": "Shopify Payments lets a new Shopify store accept cards in 5 minutes — Shopify is the PayFac, the store is its sub-merchant, and Shopify's acquirer (Stripe) settles underneath.",
    "flows": ["payfac"] },

  { "id": "merchant-of-record", "name": "Merchant of Record", "alias": ["MoR"], "domain": "merchant-stack", "role": "Legal seller",
    "reference": "The legal entity on the receipt: the party responsible for collecting sales tax, handling refunds, chargebacks, and regulatory compliance. Often a platform (Paddle, Stripe, Apple) acting on behalf of the real creator.",
    "connections": { "confusedWith": ["payfac", "payment-provider"] },
    "example": "A solo dev sells a SaaS through Paddle; Paddle is the MoR, so Paddle handles VAT across 40 countries and the customer's credit card statement shows 'PADDLE.NET*APP NAME'.",
    "flows": ["payfac", "card"] },

  { "id": "tokenization", "name": "Tokenization", "domain": "merchant-stack", "role": "Security",
    "reference": "Replacing the real card number (PAN) with a random, useless-if-stolen token. Reduces PCI scope for merchants — if you never store a PAN, you can't leak one.",
    "connections": { "confusedWith": ["encryption"], "upstream": ["payment-gateway"], "downstream": ["payment-processor"] },
    "example": "On first purchase Stripe stores the card as `tok_1NX8...`; subsequent one-click checkouts send the token, never the 16-digit number.",
    "flows": ["card"] },

  { "id": "3ds-sca", "name": "3DS / SCA", "alias": ["3D Secure", "Strong Customer Authentication"], "domain": "merchant-stack", "role": "Auth step",
    "reference": "The 'verify with your bank' step during checkout. 3D Secure is the protocol; SCA is the PSD2 regulatory requirement that mandates it for most EU/UK card payments.",
    "connections": { "confusedWith": ["tokenization"], "upstream": ["payment-gateway"], "downstream": ["issuer"] },
    "example": "A UK shopper buying £80 of trainers gets a push notification from their bank app to approve — that's SCA via 3DS2, shifting liability from the merchant to the issuer.",
    "flows": ["card"] },

  { "id": "accounts-payable", "name": "Accounts Payable (AP)", "domain": "accounting", "role": "Liability",
    "reference": "Money the business owes suppliers for goods or services already received but not yet paid. Sits on the balance sheet as a current liability until paid.",
    "connections": { "confusedWith": ["accounts-receivable"], "upstream": ["invoice-received"], "downstream": ["pay-out"] },
    "example": "The UK SME receives a €950 invoice from its German supplier on the 1st; AP is credited €950 that day and debited (cleared) when the payment settles on the 10th.",
    "flows": ["ar-ap", "b2b-xborder"] },

  { "id": "accounts-receivable", "name": "Accounts Receivable (AR)", "domain": "accounting", "role": "Asset",
    "reference": "Money owed to the business by customers for goods or services already delivered but not yet paid for. A current asset on the balance sheet.",
    "connections": { "confusedWith": ["accounts-payable"], "upstream": ["invoice-sent"], "downstream": ["cash-received"] },
    "example": "The supplier invoices €950 on day 0; AR increases by €950. On day 8 when Wise credits their account, AR decreases by €950 and cash increases by €950.",
    "flows": ["ar-ap"] },

  { "id": "general-ledger", "name": "General Ledger (GL)", "domain": "accounting", "role": "System of record",
    "reference": "The master book containing every journal entry the business has posted. Every other financial statement (P&L, balance sheet) is derived from the GL.",
    "connections": { "confusedWith": ["sub-ledger"], "upstream": ["journal-entry"], "downstream": ["trial-balance"] },
    "example": "The café's GL has one line per transaction: 'Dec 14, Cash £6.50 / Revenue £6.50'. At month-end, every £6.50 rolls up into the P&L.",
    "flows": ["ar-ap", "b2b-xborder"] },

  { "id": "expense-code", "name": "Expense Code / GL Code", "domain": "accounting", "role": "Classifier",
    "reference": "The specific GL account an expense is booked to — e.g. 6200 Software, 6500 Travel, 7100 Office. Controls how the expense shows up in financial reports and budgets.",
    "connections": { "confusedWith": ["chart-of-accounts"], "upstream": ["invoice-received"], "downstream": ["general-ledger"] },
    "example": "The €950 supplier invoice is coded to 5200 — Cost of Goods Sold, so it hits gross margin, not operating expense.",
    "flows": ["ar-ap"] },

  { "id": "chart-of-accounts", "name": "Chart of Accounts", "domain": "accounting", "role": "Taxonomy",
    "reference": "The complete list of every GL account the business uses, organised by type (asset, liability, equity, revenue, expense). Every expense code lives in the chart.",
    "connections": { "confusedWith": ["expense-code"] },
    "example": "Wise's chart might have 1100 Client Funds (safeguarded), 4100 FX Revenue, 5100 Rail Fees. A new account type requires a finance-team approval to add.",
    "flows": ["ar-ap"] },

  { "id": "journal-entry", "name": "Journal Entry", "domain": "accounting", "role": "Atomic record",
    "reference": "A single debit/credit pair that updates the GL. Every business event produces at least one journal entry; complex events produce several.",
    "connections": { "confusedWith": ["general-ledger"], "downstream": ["general-ledger"] },
    "example": "Receiving the €950 invoice creates: DR 5200 COGS €950, CR 2100 AP €950. Paying it: DR 2100 AP €950, CR 1100 Cash €950.",
    "flows": ["ar-ap"] },

  { "id": "double-entry", "name": "Double-Entry", "domain": "accounting", "role": "Principle",
    "reference": "Every transaction hits at least two accounts, with total debits equal to total credits. The self-checking invariant that makes accounting auditable.",
    "connections": { "confusedWith": ["single-entry"], "downstream": ["trial-balance"] },
    "example": "Selling €100 of coffee: DR Cash €100, CR Revenue €100. Both sides move; neither can happen without the other.",
    "flows": ["ar-ap"] },

  { "id": "accrual-vs-cash", "name": "Accrual vs Cash", "domain": "accounting", "role": "Method",
    "reference": "Accrual recognises revenue when earned and expense when incurred (regardless of cash). Cash recognises when money moves. Large businesses use accrual because it reflects economic reality.",
    "connections": { "confusedWith": ["double-entry"] },
    "example": "The supplier ships on 30 March, invoice due 30 April. Accrual books €950 revenue in March; cash books it in April when Wise pays.",
    "flows": ["ar-ap"] },

  { "id": "clearing-account", "name": "Clearing Account", "domain": "accounting", "role": "Temporary ledger",
    "reference": "A GL account used to hold funds in transit between two other accounts. Reconciled and emptied regularly. Essential for PSP settlements where gross card sales land days after booking.",
    "connections": { "confusedWith": ["general-ledger"], "upstream": ["payment-provider"], "downstream": ["cash-account"] },
    "example": "Café's books on Monday: DR Stripe Clearing £120, CR Revenue £120. Wednesday when Stripe pays out £117 net: DR Cash £117, DR Fees £3, CR Stripe Clearing £120. Clearing returns to zero.",
    "flows": ["ar-ap", "card"] },

  { "id": "trial-balance", "name": "Trial Balance", "domain": "accounting", "role": "Snapshot",
    "reference": "A periodic listing of every GL account's balance, grouped debits and credits. Totals must match — if they don't, there's a journal entry error to hunt down.",
    "connections": { "confusedWith": ["general-ledger"], "upstream": ["general-ledger"] },
    "example": "Month-end TB shows total debits of £428,119.42 and total credits of £428,119.42. Accountant closes the books. If unequal, they dig.",
    "flows": ["ar-ap"] },

  { "id": "kyc", "name": "KYC", "alias": ["Know Your Customer"], "domain": "compliance", "role": "Onboarding check",
    "reference": "Identity verification performed before letting a customer transact. ID document + proof of address + liveness check. Required by AML regulation.",
    "connections": { "confusedWith": ["kyb", "aml"], "downstream": ["sanctions-screening"] },
    "example": "Before Divya's friend can open a Wise personal account, she uploads her passport, takes a selfie, and Wise verifies both match government records.",
    "flows": ["b2b-xborder", "payfac"] },

  { "id": "kyb", "name": "KYB", "alias": ["Know Your Business"], "domain": "compliance", "role": "Business onboarding",
    "reference": "KYC's business cousin. Verify the legal entity (Companies House / EIN) plus its ultimate beneficial owners (UBOs over 25%). Much harder and slower than KYC because ownership layers can be opaque.",
    "connections": { "confusedWith": ["kyc"], "downstream": ["sanctions-screening"] },
    "example": "Wise Business verifies the UK SME's incorporation, director IDs, and traces a 30% UBO through a Jersey holding company — total onboarding 2 days.",
    "flows": ["b2b-xborder", "payfac"] },

  { "id": "aml", "name": "AML", "alias": ["Anti-Money Laundering"], "domain": "compliance", "role": "Ongoing monitoring",
    "reference": "The full programme of transaction monitoring, suspicious activity reporting (SARs), and periodic customer review. Goes beyond onboarding — it runs every day for the life of the customer.",
    "connections": { "confusedWith": ["kyc", "sanctions-screening"], "upstream": ["kyc"] },
    "example": "Wise's AML system flags a series of £9,500 daily payments to a sanctioned jurisdiction (just under the £10k reporting threshold — classic structuring) and files a SAR.",
    "flows": ["swift", "b2b-xborder"] },

  { "id": "sanctions-screening", "name": "Sanctions Screening", "domain": "compliance", "role": "Name check",
    "reference": "Checking every party in a transaction against government watchlists (OFAC, EU, UK, UN) before releasing funds. A hit blocks the payment and triggers investigation.",
    "connections": { "confusedWith": ["aml"], "upstream": ["kyc", "kyb"] },
    "example": "A SWIFT wire to 'Mohammed Al-Something Trading' is held by correspondent bank while screening runs; a false positive match adds 48 hours before release.",
    "flows": ["swift", "b2b-xborder"] },

  { "id": "pci-dss", "name": "PCI DSS", "alias": ["Payment Card Industry Data Security Standard"], "domain": "compliance", "role": "Card data security",
    "reference": "The security standard that applies to anyone storing, processing, or transmitting card data. Prescribes encryption, access control, logging, and audits. Tokenisation is how most merchants reduce PCI scope.",
    "connections": { "confusedWith": ["tokenization"] },
    "example": "A Shopify store never handles card data directly — Stripe does. So the store is PCI SAQ A (the easiest, ~20 question self-assessment) rather than SAQ D.",
    "flows": ["card", "payfac"] },

  { "id": "psd2", "name": "PSD2 / Open Banking", "alias": ["Second Payment Services Directive"], "domain": "compliance", "role": "EU/UK regulation",
    "reference": "EU/UK regulation mandating strong customer authentication for electronic payments, and forcing banks to expose APIs so third parties can initiate payments and read account data with consent.",
    "connections": { "confusedWith": ["3ds-sca"] },
    "example": "A budgeting app connects to a user's Barclays account via Open Banking: the user logs in, consents, and the app reads transactions via the PSD2 API — no screen-scraping.",
    "flows": ["b2b-xborder", "ach"] },

  { "id": "safeguarding", "name": "Safeguarding (UK)", "domain": "compliance", "role": "Fund protection",
    "reference": "UK e-money regulation requiring non-bank payment firms to ring-fence client funds in a segregated account at a credit institution. If the fintech fails, customers get their money back, not the creditors.",
    "connections": { "confusedWith": ["float"] },
    "example": "Every £1 sitting in a Wise GBP balance is held in a safeguarding account at a UK bank; Wise cannot lend it out the way a normal bank would.",
    "flows": ["b2b-xborder"] },

  { "id": "mid-market-rate", "name": "Mid-Market Rate", "domain": "treasury-fx", "role": "Reference rate",
    "reference": "The midpoint between the bid and ask rates in the interbank FX market at a given instant. The 'real' exchange rate you'd see on Reuters. Banks add a spread on top; Wise's pitch is to charge a transparent fee instead.",
    "connections": { "confusedWith": ["fx-spread"], "downstream": ["fx-spread"] },
    "example": "At 10:00 GMT, GBP/EUR mid-market is 1.1732. Wise applies this rate and charges a 0.43% transparent fee; a high-street bank applies 1.14 and charges zero fee — quietly keeping 2.8%.",
    "flows": ["b2b-xborder"] },

  { "id": "fx-spread", "name": "FX Spread / Markup", "domain": "treasury-fx", "role": "Hidden margin",
    "reference": "The difference between the rate a provider quotes you and the mid-market rate. Often buried in a 'no fee' FX offer. The cost of a cross-border payment lives here more than in stated fees.",
    "connections": { "confusedWith": ["mid-market-rate"], "upstream": ["mid-market-rate"] },
    "example": "A £1,000 → EUR transfer at a 2.5% spread nets the customer €25 less than at mid-market — even if the bank advertises 'zero fee'.",
    "flows": ["b2b-xborder", "swift"] },

  { "id": "nostro-vostro", "name": "Nostro / Vostro", "domain": "treasury-fx", "role": "Correspondent accounts",
    "reference": "'Nostro' = our account held at another bank ('ours with them'). 'Vostro' = their account held with us ('yours with us'). The plumbing that makes correspondent banking work: settlement is ledger entries in these accounts.",
    "connections": { "confusedWith": ["correspondent-banking"], "upstream": ["correspondent-banking"] },
    "example": "HSBC London holds a nostro USD account at JPMorgan New York. To send $50k, HSBC debits its nostro; JPMorgan credits the onward beneficiary from its books.",
    "flows": ["swift"] },

  { "id": "float", "name": "Float / Pre-funding", "domain": "treasury-fx", "role": "Working capital",
    "reference": "Money the PSP parks in local accounts ahead of time so that outbound payments feel instant to the user. The PSP eats the opportunity cost of idle cash in exchange for speed.",
    "connections": { "confusedWith": ["safeguarding"] },
    "example": "Wise pre-funds €50m in its SEPA account. When a customer pays out €950, Wise ships from this float immediately — the matching GBP hasn't been converted yet; that happens in a batch later.",
    "flows": ["b2b-xborder"] },

  { "id": "stablecoin-rails", "name": "Stablecoin Rails", "domain": "treasury-fx", "role": "Alt rail",
    "reference": "Using USDC / USDT as the cross-border transport layer. On-ramp fiat → mint stablecoin → send on-chain → burn → off-ramp fiat. Settles in minutes, 24/7; avoids correspondent banking hops.",
    "connections": { "confusedWith": ["swift"] },
    "example": "A Nigerian importer pays a Chinese supplier: NGN → USDC via a local on-ramp → USDC wallet transfer → CNY via a Chinese off-ramp. 10 minutes vs 3 days SWIFT.",
    "flows": ["swift", "b2b-xborder"] },

  { "id": "cross-currency-netting", "name": "Cross-Currency Netting", "domain": "treasury-fx", "role": "Settlement optimisation",
    "reference": "When a PSP has offsetting flows (£1m in, £0.8m out on the same day), it only needs to move the net £0.2m through rails. Saves fees and FX cost dramatically at scale.",
    "connections": { "confusedWith": ["float"] },
    "example": "On a Monday, Wise customers send £100m GBP→EUR and €90m EUR→GBP. Instead of 2 rail movements totalling £190m-equivalent, Wise nets and settles just the difference internally.",
    "flows": ["b2b-xborder"] },

  { "id": "cut-off-time", "name": "Cut-off Time", "domain": "treasury-fx", "role": "Deadline",
    "reference": "The daily deadline after which a transaction is deferred to the next business day. Varies by rail, currency, and bank. Misses can add 24–72 hours to a payment.",
    "connections": { "confusedWith": ["settlement"] },
    "example": "A USD wire submitted at 4:30pm ET misses the 4pm Fedwire cut-off, so it sits until 9am ET tomorrow — and if that's Friday, actually until Monday.",
    "flows": ["swift", "b2b-xborder"] },

  { "id": "treasury-reconciliation", "name": "Treasury Reconciliation", "domain": "treasury-fx", "role": "Daily ops",
    "reference": "Matching the internal ledger to every bank and rail statement, daily. Catches breaks — unmatched debits, mispostings, fraud — before they compound.",
    "connections": { "confusedWith": ["reconciliation"], "upstream": ["general-ledger"] },
    "example": "Wise's treasury team reconciles 40+ bank accounts before 10am daily. A £2,400 break between the HSBC statement and the GL triggers an investigation before trading opens.",
    "flows": ["b2b-xborder", "ar-ap"] },

  { "id": "pay-in", "name": "Pay-In", "domain": "ops", "role": "Inbound",
    "reference": "Money coming into the platform from a customer. Card top-ups, bank transfers in, direct debits. The front half of every PSP flow.",
    "connections": { "confusedWith": ["pay-out"], "downstream": ["payment-provider"] },
    "example": "The UK SME initiates a Faster Payment of £1,000 to their Wise GBP account — that's a pay-in from Wise's perspective.",
    "flows": ["b2b-xborder", "card", "payfac"] },

  { "id": "pay-out", "name": "Pay-Out", "domain": "ops", "role": "Outbound",
    "reference": "Money leaving the platform to an external beneficiary. ACH credits, SEPA pay-outs, wire transfers. The back half of every PSP flow.",
    "connections": { "confusedWith": ["pay-in"], "upstream": ["payment-provider"] },
    "example": "Wise releases €950 via SEPA Instant to the German supplier — that's a pay-out.",
    "flows": ["b2b-xborder", "payfac", "ar-ap"] },

  { "id": "reconciliation", "name": "Reconciliation", "domain": "ops", "role": "Matching",
    "reference": "The process of matching transactions across two or three sources (ledger, bank statement, invoice) to prove every recorded movement actually happened. Two-way = ledger↔bank. Three-way = ledger↔bank↔invoice.",
    "connections": { "confusedWith": ["treasury-reconciliation"] },
    "example": "The SME's AP clerk matches each supplier payment on the bank statement to an invoice and a GL entry. Two £950s where there should be one = duplicate paid, call the supplier.",
    "flows": ["ar-ap", "b2b-xborder"] },

  { "id": "chargeback", "name": "Chargeback", "domain": "ops", "role": "Dispute reversal",
    "reference": "When a cardholder disputes a transaction with their issuer, funds are clawed back from the merchant. The merchant can contest with evidence, but the burden of proof is on them.",
    "connections": { "confusedWith": ["refund-vs-reversal"] },
    "example": "A customer claims they never received the £80 trainers. Their issuer raises a chargeback; Stripe debits the merchant £80 + a £15 fee. The merchant uploads the delivery signature to contest.",
    "flows": ["card", "payfac"] },

  { "id": "refund-vs-reversal", "name": "Refund vs Reversal", "domain": "ops", "role": "Cancellation",
    "reference": "A refund is a new transaction that sends funds back — original sale still happened and shows on both sides. A reversal cancels the original before settlement, so neither party's ledger ever records the charge.",
    "connections": { "confusedWith": ["chargeback"] },
    "example": "The café accidentally charges £65 instead of £6.50 and catches it within 10 minutes — a reversal voids the auth, nothing settles. An hour later would have required a refund — £65 charged then £65 refunded separately.",
    "flows": ["card"] }
]
```

- [ ] **Step 2: Validate the JSON**

Run: `python3 -m json.tool data/terms.json > /dev/null && echo OK`
Expected: prints `OK`.

- [ ] **Step 3: Count terms**

Run: `python3 -c "import json; print(len(json.load(open('data/terms.json'))))"`
Expected: `50`.

- [ ] **Step 4: Commit**

```bash
git add data/terms.json
git commit -m "data: author all 50 terms"
```

---

## Task 4: Author `data/flows.json` (6 flows)

**Files:** Create: `data/flows.json`

Each flow has: `id`, `title`, `scenario`, `steps` (ordered termIds + narration), `layout` (node coordinates for SVG in a 640×260 viewBox), `edges` (list of `{from, to}` termId pairs). `pseudo-*` termIds are used for flow-specific endpoint nodes (payer/beneficiary) that aren't in the 50 terms — the renderer shows them as neutral grey labels.

- [ ] **Step 1: Replace `data/flows.json` with the following content**

```json
[
  {
    "id": "b2b-xborder",
    "title": "B2B cross-border — GBP → EUR via Wise Business",
    "scenario": "A UK SME pays a German supplier €950. Wise receives GBP via Faster Payments, converts at mid-market, pays out via SEPA Instant.",
    "steps": [
      { "termId": "pseudo-payer-sme",  "narration": "The SME initiates a £820 top-up from its Barclays account, destined for Wise." },
      { "termId": "faster-payments",    "narration": "Faster Payments moves the £820 from Barclays to Wise's GBP safeguarded account in ~15 seconds." },
      { "termId": "payment-provider",   "narration": "Wise Business receives the GBP, verifies the SME's KYB status, and routes to the FX engine." },
      { "termId": "mid-market-rate",    "narration": "Wise applies the 10:00 GMT mid-market rate (GBP/EUR = 1.1732) and charges a transparent 0.43% fee." },
      { "termId": "sepa-instant",       "narration": "Wise releases €950 via SEPA Instant to the supplier's Deutsche Bank account." },
      { "termId": "pseudo-beneficiary", "narration": "The supplier sees €950 credited in under 10 seconds. Meanwhile Wise posts the movement to its GL." },
      { "termId": "general-ledger",     "narration": "GL entries: DR Client Funds GBP £820, CR FX Position GBP £820; DR FX Position EUR €950, CR Client Funds EUR €950. Books balance." }
    ],
    "layout": [
      { "termId": "pseudo-payer-sme",   "x": 40,  "y": 110, "w": 110, "h": 44, "label": "UK SME", "sublabel": "GBP account" },
      { "termId": "faster-payments",    "x": 180, "y": 30,  "w": 110, "h": 44, "label": "Faster Payments", "sublabel": "UK rail" },
      { "termId": "payment-provider",   "x": 180, "y": 190, "w": 110, "h": 44, "label": "Wise Business", "sublabel": "PSP" },
      { "termId": "mid-market-rate",    "x": 320, "y": 110, "w": 110, "h": 44, "label": "Mid-market FX", "sublabel": "Wise FX engine" },
      { "termId": "sepa-instant",       "x": 460, "y": 30,  "w": 110, "h": 44, "label": "SEPA Instant", "sublabel": "EU rail" },
      { "termId": "general-ledger",     "x": 460, "y": 190, "w": 110, "h": 44, "label": "General Ledger", "sublabel": "Wise books" },
      { "termId": "pseudo-beneficiary", "x": 580, "y": 110, "w": 50,  "h": 44, "label": "DE Bank", "sublabel": "Supplier" }
    ],
    "edges": [
      { "from": "pseudo-payer-sme", "to": "faster-payments" },
      { "from": "faster-payments", "to": "payment-provider" },
      { "from": "payment-provider", "to": "mid-market-rate" },
      { "from": "mid-market-rate", "to": "sepa-instant" },
      { "from": "mid-market-rate", "to": "general-ledger" },
      { "from": "sepa-instant", "to": "pseudo-beneficiary" }
    ]
  },

  {
    "id": "card",
    "title": "Card payment — contactless tap at a UK café",
    "scenario": "A customer taps a Visa debit card for £6.50. Gateway, processor, acquirer, network, issuer — all touched in seconds.",
    "steps": [
      { "termId": "pseudo-cardholder",  "narration": "Customer taps a Visa debit card on the contactless terminal." },
      { "termId": "payment-gateway",    "narration": "The terminal + gateway encrypt the card data and tokenise the PAN so the merchant never sees the 16 digits." },
      { "termId": "payment-processor",  "narration": "The processor packages the £6.50 auth request and sends it to Visa." },
      { "termId": "card-network",       "narration": "Visa routes the auth to the cardholder's issuer based on the BIN." },
      { "termId": "issuer",             "narration": "The issuing bank checks balance, fraud, and 3DS/SCA exemptions, then replies APPROVED." },
      { "termId": "acquirer",           "narration": "The approval flows back through the network to the processor and acquirer. The café's receipt prints APPROVED." },
      { "termId": "settlement",         "narration": "At end of day the acquirer batches all auths and submits for settlement. Two days later £6.43 (net of interchange + acquirer fee) lands in the café's bank." },
      { "termId": "clearing-account",   "narration": "In the café's books: DR Stripe Clearing £6.50 on sale day; DR Cash £6.43, DR Fees £0.07, CR Stripe Clearing £6.50 on settlement day." }
    ],
    "layout": [
      { "termId": "pseudo-cardholder",  "x": 30,  "y": 110, "w": 90,  "h": 44, "label": "Cardholder", "sublabel": "Visa card" },
      { "termId": "payment-gateway",    "x": 145, "y": 110, "w": 100, "h": 44, "label": "Gateway", "sublabel": "Checkout" },
      { "termId": "payment-processor",  "x": 270, "y": 110, "w": 100, "h": 44, "label": "Processor", "sublabel": "Worldpay" },
      { "termId": "card-network",       "x": 395, "y": 40,  "w": 100, "h": 44, "label": "Card Network", "sublabel": "Visa" },
      { "termId": "issuer",             "x": 520, "y": 40,  "w": 100, "h": 44, "label": "Issuer", "sublabel": "Lloyds" },
      { "termId": "acquirer",           "x": 395, "y": 180, "w": 100, "h": 44, "label": "Acquirer", "sublabel": "Barclaycard" },
      { "termId": "settlement",         "x": 520, "y": 180, "w": 100, "h": 44, "label": "Settlement", "sublabel": "T+2" },
      { "termId": "clearing-account",   "x": 270, "y": 210, "w": 100, "h": 34, "label": "Clearing A/C", "sublabel": "Café books" }
    ],
    "edges": [
      { "from": "pseudo-cardholder", "to": "payment-gateway" },
      { "from": "payment-gateway", "to": "payment-processor" },
      { "from": "payment-processor", "to": "card-network" },
      { "from": "card-network", "to": "issuer" },
      { "from": "issuer", "to": "card-network" },
      { "from": "card-network", "to": "acquirer" },
      { "from": "acquirer", "to": "settlement" },
      { "from": "payment-processor", "to": "clearing-account" }
    ]
  },

  {
    "id": "ach",
    "title": "ACH / domestic — UK salary via Faster Payments",
    "scenario": "A UK employer pays £3,200 net salary to an employee. Same logical flow as ACH but over Faster Payments.",
    "steps": [
      { "termId": "pseudo-employer",    "narration": "The employer submits a payroll batch at 5pm Thursday." },
      { "termId": "faster-payments",    "narration": "Each payment is pushed as a separate Faster Payment — real-time, 24/7, unlike US ACH batching." },
      { "termId": "psd2",               "narration": "The employer bank authenticates the batch under PSD2 SCA (a corporate token)." },
      { "termId": "settlement",         "narration": "Funds settle between the two banks via the Bank of England RTGS rails behind Faster Payments." },
      { "termId": "pseudo-employee",    "narration": "The employee sees £3,200 credited within 30 seconds, even though it's past banking hours." }
    ],
    "layout": [
      { "termId": "pseudo-employer",  "x": 40,  "y": 110, "w": 110, "h": 44, "label": "UK Employer", "sublabel": "Payroll batch" },
      { "termId": "faster-payments",  "x": 190, "y": 70,  "w": 110, "h": 44, "label": "Faster Payments", "sublabel": "Instant rail" },
      { "termId": "psd2",             "x": 190, "y": 160, "w": 110, "h": 44, "label": "PSD2 / SCA", "sublabel": "Auth" },
      { "termId": "settlement",       "x": 340, "y": 110, "w": 110, "h": 44, "label": "BoE RTGS", "sublabel": "Settlement" },
      { "termId": "pseudo-employee",  "x": 490, "y": 110, "w": 110, "h": 44, "label": "Employee", "sublabel": "Current a/c" }
    ],
    "edges": [
      { "from": "pseudo-employer", "to": "faster-payments" },
      { "from": "pseudo-employer", "to": "psd2" },
      { "from": "psd2", "to": "faster-payments" },
      { "from": "faster-payments", "to": "settlement" },
      { "from": "settlement", "to": "pseudo-employee" }
    ]
  },

  {
    "id": "swift",
    "title": "SWIFT wire — $50k USA → India, 2 correspondent hops",
    "scenario": "A Miami firm wires $50,000 to an Indonesian supplier. Two correspondent banks in between, sanctions screening at every hop.",
    "steps": [
      { "termId": "pseudo-us-bank",       "narration": "The Miami bank debits the sender and prepares an ISO 20022 payment message." },
      { "termId": "iso-20022",            "narration": "Rich structured data travels with the payment — invoice reference, purpose code, full supplier address." },
      { "termId": "swift",                "narration": "SWIFT carries the message to JPMorgan (the sender's USD correspondent)." },
      { "termId": "correspondent-banking","narration": "JPMorgan receives the message and posts to its nostro/vostro accounts." },
      { "termId": "nostro-vostro",        "narration": "The Miami bank's nostro USD account at JPMorgan is debited $50k; Standard Chartered Singapore's vostro at JPMorgan is credited." },
      { "termId": "sanctions-screening",  "narration": "Each correspondent screens names against OFAC and UN lists; a false positive here can cost 48 hours." },
      { "termId": "fx-spread",            "narration": "Standard Chartered converts USD → IDR, pocketing a ~2% spread on top of mid-market." },
      { "termId": "pseudo-id-bank",       "narration": "The Indonesian bank credits the supplier. Total elapsed: 2 business days. Total fees: ~$75 visible + ~$1,000 invisible (spread)." }
    ],
    "layout": [
      { "termId": "pseudo-us-bank",       "x": 20,  "y": 110, "w": 90,  "h": 40, "label": "US bank", "sublabel": "Miami" },
      { "termId": "iso-20022",            "x": 130, "y": 30,  "w": 100, "h": 40, "label": "ISO 20022", "sublabel": "Message" },
      { "termId": "swift",                "x": 130, "y": 110, "w": 100, "h": 40, "label": "SWIFT", "sublabel": "Network" },
      { "termId": "correspondent-banking","x": 250, "y": 70,  "w": 110, "h": 42, "label": "Correspondent", "sublabel": "JPM NY" },
      { "termId": "nostro-vostro",        "x": 250, "y": 160, "w": 110, "h": 42, "label": "Nostro / Vostro", "sublabel": "Accounts" },
      { "termId": "sanctions-screening",  "x": 380, "y": 30,  "w": 110, "h": 40, "label": "Sanctions", "sublabel": "Screening" },
      { "termId": "fx-spread",            "x": 380, "y": 190, "w": 110, "h": 40, "label": "FX Spread", "sublabel": "USD → IDR" },
      { "termId": "pseudo-id-bank",       "x": 510, "y": 110, "w": 120, "h": 40, "label": "ID bank", "sublabel": "Beneficiary" }
    ],
    "edges": [
      { "from": "pseudo-us-bank", "to": "iso-20022" },
      { "from": "pseudo-us-bank", "to": "swift" },
      { "from": "iso-20022", "to": "correspondent-banking" },
      { "from": "swift", "to": "correspondent-banking" },
      { "from": "correspondent-banking", "to": "nostro-vostro" },
      { "from": "correspondent-banking", "to": "sanctions-screening" },
      { "from": "nostro-vostro", "to": "fx-spread" },
      { "from": "sanctions-screening", "to": "pseudo-id-bank" },
      { "from": "fx-spread", "to": "pseudo-id-bank" }
    ]
  },

  {
    "id": "payfac",
    "title": "PayFac — Shopify onboards a new sub-merchant",
    "scenario": "A boutique signs up for Shopify, accepts its first card within 5 minutes. Shopify Payments is the PayFac.",
    "steps": [
      { "termId": "pseudo-sub-merchant", "narration": "The boutique owner signs up and enters a business name, EIN, and bank account." },
      { "termId": "kyb",                 "narration": "Shopify runs KYB checks automatically — Companies House lookup, UBO verification, director ID." },
      { "termId": "payfac",              "narration": "Shopify Payments enrols the boutique under its own master merchant agreement with the acquirer — no separate contract needed." },
      { "termId": "pci-dss",             "narration": "The boutique never touches card data — Shopify's gateway handles it, so the boutique qualifies for the simplest PCI scope (SAQ A)." },
      { "termId": "payment-processor",  "narration": "First card sale: £40 processed by Stripe (Shopify's underlying processor)." },
      { "termId": "interchange",         "narration": "Interchange of ~£0.20 flows to the issuer; scheme fee, processor fee, and Shopify's margin come off the top." },
      { "termId": "pay-out",             "narration": "Two days later the net ~£39.00 lands in the boutique's bank via a daily Shopify Payments pay-out." }
    ],
    "layout": [
      { "termId": "pseudo-sub-merchant", "x": 30,  "y": 110, "w": 110, "h": 44, "label": "Boutique", "sublabel": "Sub-merchant" },
      { "termId": "kyb",                 "x": 170, "y": 30,  "w": 100, "h": 44, "label": "KYB", "sublabel": "Onboarding" },
      { "termId": "payfac",              "x": 170, "y": 180, "w": 100, "h": 44, "label": "PayFac", "sublabel": "Shopify Pay" },
      { "termId": "pci-dss",             "x": 300, "y": 30,  "w": 100, "h": 44, "label": "PCI DSS", "sublabel": "SAQ A" },
      { "termId": "payment-processor",   "x": 300, "y": 180, "w": 100, "h": 44, "label": "Processor", "sublabel": "Stripe" },
      { "termId": "interchange",         "x": 430, "y": 110, "w": 100, "h": 44, "label": "Interchange", "sublabel": "~0.5%" },
      { "termId": "pay-out",             "x": 560, "y": 110, "w": 80,  "h": 44, "label": "Pay-out", "sublabel": "T+2" }
    ],
    "edges": [
      { "from": "pseudo-sub-merchant", "to": "kyb" },
      { "from": "pseudo-sub-merchant", "to": "payfac" },
      { "from": "kyb", "to": "pci-dss" },
      { "from": "payfac", "to": "payment-processor" },
      { "from": "payment-processor", "to": "interchange" },
      { "from": "pci-dss", "to": "interchange" },
      { "from": "interchange", "to": "pay-out" }
    ]
  },

  {
    "id": "ar-ap",
    "title": "AR / AP cycle — invoice raised, paid, booked",
    "scenario": "A SaaS vendor invoices a UK customer £1,200. The customer pays 14 days later. Both sides' books move.",
    "steps": [
      { "termId": "accounts-receivable", "narration": "Vendor issues invoice on 1 March. Vendor books: DR AR £1,200, CR Revenue £1,200 (accrual)." },
      { "termId": "accounts-payable",    "narration": "Customer receives invoice. Customer books: DR Software Expense £1,200, CR AP £1,200." },
      { "termId": "expense-code",        "narration": "Customer's AP clerk codes the invoice to GL 6200 (Software) — controls how it appears in the P&L." },
      { "termId": "faster-payments",     "narration": "On 15 March the customer's finance team releases the payment via Faster Payments." },
      { "termId": "reconciliation",      "narration": "Both sides' bank statements show the £1,200 move. The AP clerk does a three-way match: invoice ↔ GL ↔ bank." },
      { "termId": "general-ledger",      "narration": "Customer books: DR AP £1,200, CR Cash £1,200. Vendor books: DR Cash £1,200, CR AR £1,200. Both sets of books balance again." }
    ],
    "layout": [
      { "termId": "accounts-receivable", "x": 30,  "y": 40,  "w": 120, "h": 44, "label": "AR", "sublabel": "Vendor books" },
      { "termId": "accounts-payable",    "x": 30,  "y": 180, "w": 120, "h": 44, "label": "AP", "sublabel": "Customer books" },
      { "termId": "expense-code",        "x": 180, "y": 180, "w": 110, "h": 44, "label": "Expense Code", "sublabel": "GL 6200" },
      { "termId": "faster-payments",     "x": 330, "y": 110, "w": 110, "h": 44, "label": "Faster Payments", "sublabel": "Rail" },
      { "termId": "reconciliation",      "x": 470, "y": 40,  "w": 130, "h": 44, "label": "Reconciliation", "sublabel": "3-way match" },
      { "termId": "general-ledger",      "x": 470, "y": 180, "w": 130, "h": 44, "label": "General Ledger", "sublabel": "Both sides" }
    ],
    "edges": [
      { "from": "accounts-receivable", "to": "faster-payments" },
      { "from": "accounts-payable", "to": "expense-code" },
      { "from": "expense-code", "to": "faster-payments" },
      { "from": "faster-payments", "to": "reconciliation" },
      { "from": "faster-payments", "to": "general-ledger" },
      { "from": "reconciliation", "to": "general-ledger" }
    ]
  }
]
```

- [ ] **Step 2: Validate the JSON**

Run: `python3 -m json.tool data/flows.json > /dev/null && echo OK`
Expected: `OK`.

- [ ] **Step 3: Verify flow count + step counts**

Run:
```bash
python3 -c "
import json
flows = json.load(open('data/flows.json'))
print(f'flows: {len(flows)}')
for f in flows:
    print(f'  {f[\"id\"]}: {len(f[\"steps\"])} steps, {len(f[\"layout\"])} nodes, {len(f[\"edges\"])} edges')
"
```
Expected output:
```
flows: 6
  b2b-xborder: 7 steps, 7 nodes, 6 edges
  card: 8 steps, 8 nodes, 8 edges
  ach: 5 steps, 5 nodes, 5 edges
  swift: 8 steps, 8 nodes, 9 edges
  payfac: 7 steps, 7 nodes, 7 edges
  ar-ap: 6 steps, 6 nodes, 6 edges
```

- [ ] **Step 4: Commit**

```bash
git add data/flows.json
git commit -m "data: author 6 flows with step sequences + SVG layouts"
```

---

## Task 5: State store (central reactive state)

**Files:** Create: `js/state.js`

A tiny pub/sub state module. Every other module reads from and subscribes to it. Keeps components decoupled.

- [ ] **Step 1: Create `js/state.js`**

```js
// Central reactive state. Modules subscribe via state.subscribe(keys, fn).

const listeners = [];
const internal = {
  terms: [],              // loaded from terms.json
  flows: [],              // loaded from flows.json
  termsById: new Map(),   // id -> term
  flowsById: new Map(),   // id -> flow
  activeFlowId: null,
  stepIndex: 0,           // 0-based index into flow.steps
  lens: "reference",      // "reference" | "connections" | "example"
  domainFilter: "all",    // "all" | "rails" | "merchant-stack" | "accounting" | "compliance" | "treasury-fx" | "ops"
  selectedTermId: null,   // term currently shown in detail pane; null = show active step's term
  searchOpen: false,
};

export function get() {
  return internal;
}

export function set(patch) {
  const changedKeys = [];
  for (const [k, v] of Object.entries(patch)) {
    if (internal[k] !== v) { internal[k] = v; changedKeys.push(k); }
  }
  if (changedKeys.length) notify(changedKeys);
}

export function subscribe(keys, fn) {
  listeners.push({ keys: new Set(keys), fn });
  return () => {
    const i = listeners.findIndex(l => l.fn === fn);
    if (i >= 0) listeners.splice(i, 1);
  };
}

function notify(changedKeys) {
  for (const { keys, fn } of listeners) {
    if (changedKeys.some(k => keys.has(k))) fn(internal, changedKeys);
  }
}

export async function load() {
  const [termsRes, flowsRes] = await Promise.all([
    fetch("/data/terms.json"),
    fetch("/data/flows.json"),
  ]);
  const terms = await termsRes.json();
  const flows = await flowsRes.json();
  internal.terms = terms;
  internal.flows = flows;
  internal.termsById = new Map(terms.map(t => [t.id, t]));
  internal.flowsById = new Map(flows.map(f => [f.id, f]));
  if (!internal.activeFlowId) internal.activeFlowId = "b2b-xborder";
}

// Convenience getters
export function activeFlow() { return internal.flowsById.get(internal.activeFlowId); }
export function activeStep() {
  const f = activeFlow();
  return f ? f.steps[internal.stepIndex] : null;
}
export function currentTermId() {
  return internal.selectedTermId || (activeStep() && activeStep().termId);
}
export function currentTerm() {
  const id = currentTermId();
  return id ? internal.termsById.get(id) : null;
}
```

- [ ] **Step 2: Wire `js/app.js` to load state**

Replace `js/app.js`:

```js
import * as state from "/js/state.js";

async function boot() {
  await state.load();
  console.log("loaded", state.get().terms.length, "terms,", state.get().flows.length, "flows");
  console.log("active flow:", state.activeFlow().title);
}

boot().catch(err => {
  console.error("boot failed", err);
  document.body.textContent = "Failed to load. See console.";
});
```

- [ ] **Step 3: Verify load works**

Reload `http://localhost:8000`. Console expected:
```
loaded 50 terms, 6 flows
active flow: B2B cross-border — GBP → EUR via Wise Business
```

- [ ] **Step 4: Commit**

```bash
git add js/state.js js/app.js
git commit -m "feat: central reactive state store"
```

---

## Task 6: App layout CSS

**Files:** Modify: `css/app.css`

- [ ] **Step 1: Write full layout styles**

```css
/* ───── app shell ───── */
.app {
  display: grid;
  grid-template-columns: 200px 1fr 360px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "top top top"
    "side main detail"
    "hint hint hint";
  gap: var(--s-3);
  max-width: 1440px;
  margin: 0 auto;
  padding: var(--s-4);
  min-height: 100vh;
}
.topbar  { grid-area: top; }
.sidebar { grid-area: side; }
.flowpane { grid-area: main; min-width: 0; }
.detail  { grid-area: detail; }
.hintbar { grid-area: hint; }

/* ───── topbar ───── */
.topbar {
  display: flex; align-items: center; gap: var(--s-3); flex-wrap: wrap;
  padding: var(--s-3) var(--s-4);
  background: var(--surface); border: 1px solid var(--line);
  border-radius: var(--r-xl);
}
.topbar .logo { font-family: var(--ff-serif); font-size: var(--fs-18); color: var(--ink); margin-right: var(--s-3); }
.topbar .logo em { color: var(--teal); font-style: normal; }
.topbar .tab {
  padding: 6px 12px; border-radius: var(--r-pill);
  background: var(--surface); font-size: var(--fs-12); color: var(--ink-2);
  border: 1px solid var(--line);
  transition: background var(--dur-1) var(--ease), color var(--dur-1) var(--ease);
}
.topbar .tab:hover { background: var(--paper-warm); }
.topbar .tab[aria-selected="true"] { background: var(--ink); color: #fff; border-color: var(--ink); font-weight: 600; }
.topbar .lens {
  margin-left: auto;
  display: inline-flex; gap: 2px; padding: 3px;
  background: var(--paper-warm); border: 1px solid var(--line); border-radius: var(--r-pill);
}
.topbar .lens button {
  padding: 4px 10px; font-size: var(--fs-11); color: var(--ink-2); border-radius: var(--r-pill);
}
.topbar .lens button[aria-selected="true"] { background: var(--ink); color: #fff; font-weight: 600; }

/* ───── sidebar ───── */
.sidebar {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-xl);
  padding: var(--s-3) var(--s-4);
  align-self: start;
}
.sidebar .label { font-size: var(--fs-10); letter-spacing: .18em; text-transform: uppercase; color: var(--ink-3); margin-bottom: var(--s-2); }
.sidebar .chip {
  display: flex; justify-content: space-between; align-items: center;
  width: 100%; padding: 6px 10px; margin-bottom: 3px;
  border-radius: var(--r-sm); font-size: var(--fs-12); color: var(--ink-2);
  background: transparent; border: 1px solid transparent;
  text-align: left;
}
.sidebar .chip:hover { background: var(--paper-warm); }
.sidebar .chip[aria-pressed="true"] { background: var(--ink); color: #fff; font-weight: 600; }
.sidebar .chip .count { font-variant-numeric: tabular-nums; opacity: .75; font-size: var(--fs-11); }

/* ───── flow pane ───── */
.flowpane {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-xl);
  padding: var(--s-4);
  display: flex; flex-direction: column; gap: var(--s-3);
}
.flowpane h2 { font-size: var(--fs-18); }
.flowpane .scenario { font-size: var(--fs-12); color: var(--ink-3); line-height: var(--lh-body); }
.flowpane .stepbar {
  display: flex; align-items: center; gap: var(--s-2);
  padding: 8px 12px; background: var(--amber-tint); border: 1px solid var(--amber-line);
  border-radius: var(--r-md); font-size: var(--fs-12); color: #78350f;
}
.flowpane .stepbar .ctrl { margin-left: auto; display: inline-flex; gap: 4px; }
.flowpane .stepbar .ctrl button {
  padding: 3px 10px; font-size: var(--fs-11); border-radius: 4px;
  background: #fff; border: 1px solid var(--amber-line); color: #78350f;
}
.flowpane .stepbar .ctrl button:disabled { opacity: .4; cursor: not-allowed; }

.flowpane svg { width: 100%; height: 320px; }
.node rect { fill: #fff; stroke: #cbd5e1; stroke-width: 1.2; transition: fill var(--dur-1) var(--ease), stroke var(--dur-1) var(--ease); cursor: pointer; }
.node.done rect { fill: var(--green-tint); stroke: var(--green); }
.node.active rect { fill: var(--amber-tint); stroke: var(--amber); stroke-width: 2.2; }
.node.selected rect { stroke: var(--teal); stroke-width: 2.2; }
.node.dim { opacity: .28; }
.node text { fill: var(--ink); font-size: 10px; text-anchor: middle; font-weight: 600; pointer-events: none; }
.node .tlabel { font-size: 9px; fill: var(--ink-3); font-weight: 400; }
.edge { stroke: #cbd5e1; stroke-width: 1.3; fill: none; transition: stroke var(--dur-1) var(--ease); }
.edge.done { stroke: var(--green); stroke-width: 2; }
.edge.active { stroke: var(--amber); stroke-width: 2.4; stroke-dasharray: 4 3; }

/* ───── detail pane ───── */
.detail {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-xl);
  padding: var(--s-4);
  align-self: start;
}
.detail .label { font-size: var(--fs-10); letter-spacing: .18em; text-transform: uppercase; color: var(--ink-3); }
.detail h3 { font-size: var(--fs-22); margin: 4px 0 2px; }
.detail .sub { font-size: var(--fs-11); color: var(--ink-3); margin-bottom: var(--s-3); }
.detail .tabs { display: inline-flex; gap: 2px; padding: 3px; background: var(--paper-warm); border: 1px solid var(--line); border-radius: var(--r-pill); margin-bottom: var(--s-3); }
.detail .tabs button { padding: 4px 10px; font-size: var(--fs-11); border-radius: var(--r-pill); color: var(--ink-2); }
.detail .tabs button[aria-selected="true"] { background: var(--ink); color: #fff; font-weight: 600; }
.detail p { font-size: var(--fs-13); line-height: var(--lh-body); color: var(--ink-2); margin: 0 0 var(--s-3); }
.detail .rel { background: var(--teal-tint); border: 1px solid var(--teal-line); padding: 8px 10px; border-radius: var(--r-md); font-size: var(--fs-11); color: #0e7490; margin-bottom: 6px; }
.detail .rel b { color: var(--teal); display: block; font-size: var(--fs-10); letter-spacing: .1em; text-transform: uppercase; margin-bottom: 2px; }
.detail .rel a { display: inline-block; margin: 2px 4px 0 0; padding: 2px 8px; background: #fff; border: 1px solid var(--teal-line); border-radius: var(--r-pill); font-size: var(--fs-11); color: var(--teal); }
.detail .narr { background: var(--amber-tint); border: 1px solid var(--amber-line); padding: 8px 10px; border-radius: var(--r-md); font-size: var(--fs-11); color: #78350f; margin-top: var(--s-3); }
.detail .narr b { display: block; font-size: 9px; letter-spacing: .15em; text-transform: uppercase; margin-bottom: 2px; }

/* ───── hintbar ───── */
.hintbar {
  padding: 8px var(--s-4); background: var(--surface); border: 1px dashed var(--line);
  border-radius: var(--r-lg); font-size: var(--fs-11); color: var(--ink-3); text-align: center;
}

/* ───── search overlay ───── */
.search-overlay {
  position: fixed; inset: 0; background: rgba(15,23,42,.4);
  display: flex; align-items: flex-start; justify-content: center; padding-top: 10vh; z-index: 100;
}
.search-overlay .box { width: min(560px, 92vw); background: #fff; border-radius: var(--r-xl); padding: var(--s-4); box-shadow: var(--shadow-2); }
.search-overlay input { width: 100%; font-size: var(--fs-16); padding: 10px 12px; border: 1px solid var(--line); border-radius: var(--r-md); }
.search-overlay ul { list-style: none; padding: 0; margin: var(--s-3) 0 0; max-height: 50vh; overflow: auto; }
.search-overlay li { padding: 8px 10px; border-radius: var(--r-sm); cursor: pointer; font-size: var(--fs-13); }
.search-overlay li[aria-selected="true"] { background: var(--paper-warm); }
.search-overlay li .dom { color: var(--ink-3); font-size: var(--fs-11); margin-left: var(--s-2); }

/* ───── responsive ───── */
@media (max-width: 1023px) {
  .app {
    grid-template-columns: 1fr;
    grid-template-areas: "top" "side" "main" "detail" "hint";
  }
  .sidebar { max-height: none; }
  .sidebar .chip { display: inline-flex; width: auto; margin: 0 4px 4px 0; }
  .sidebar .label { display: block; }
  .detail { order: 4; }
}
@media (max-width: 640px) {
  .flowpane svg { height: 420px; }
}
```

- [ ] **Step 2: Verify layout visually**

Reload. Expected: the 3-column grid renders empty boxes with the right proportions and rounded borders. Resize to <1024px; layout should collapse to a single column.

- [ ] **Step 3: Commit**

```bash
git add css/app.css
git commit -m "style: full layout + components CSS"
```

---

## Task 7: Topbar (flow tabs + lens toggle)

**Files:** Create: `js/topbar.js`. Modify: `js/app.js`.

- [ ] **Step 1: Create `js/topbar.js`**

```js
import * as state from "/js/state.js";

export function init(root) {
  render(root);
  state.subscribe(["activeFlowId", "lens"], () => render(root));
}

function render(root) {
  const s = state.get();
  root.innerHTML = `
    <div class="logo">⇌ flow<em>stack</em></div>
    ${s.flows.map(f => `
      <button class="tab" role="tab" aria-selected="${f.id === s.activeFlowId}" data-flow="${f.id}">
        ${shortTitle(f.title)}
      </button>`).join("")}
    <div class="lens" role="tablist" aria-label="Content lens">
      ${["reference","connections","example"].map(l => `
        <button role="tab" aria-selected="${l === s.lens}" data-lens="${l}">${capitalize(l)}</button>
      `).join("")}
    </div>
  `;
  root.querySelectorAll("[data-flow]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.set({ activeFlowId: btn.dataset.flow, stepIndex: 0, selectedTermId: null });
    });
  });
  root.querySelectorAll("[data-lens]").forEach(btn => {
    btn.addEventListener("click", () => state.set({ lens: btn.dataset.lens }));
  });
}

function shortTitle(t) {
  const parts = t.split(" — ");
  return parts[0];
}
function capitalize(s) { return s[0].toUpperCase() + s.slice(1); }
```

- [ ] **Step 2: Wire into `js/app.js`**

Replace `js/app.js`:

```js
import * as state from "/js/state.js";
import * as topbar from "/js/topbar.js";

async function boot() {
  await state.load();
  topbar.init(document.querySelector("[data-topbar]"));
}

boot().catch(err => {
  console.error("boot failed", err);
  document.body.textContent = "Failed to load. See console.";
});
```

- [ ] **Step 3: Verify**

Reload. Expected: top bar shows logo + 6 flow tabs (B2B cross-border initially active) + Reference/Connections/Example lens toggle. Clicking tabs changes the selected state (visible in DOM). Nothing else updates yet — that's fine.

- [ ] **Step 4: Commit**

```bash
git add js/topbar.js js/app.js
git commit -m "feat: topbar with flow tabs + lens toggle"
```

---

## Task 8: Sidebar (domain filter)

**Files:** Create: `js/sidebar.js`. Modify: `js/app.js`.

Domain metadata is centralised here.

- [ ] **Step 1: Create `js/sidebar.js`**

```js
import * as state from "/js/state.js";

export const DOMAINS = [
  { id: "all",            label: "All",                short: "All" },
  { id: "rails",          label: "Rails & Networks",   short: "Rails" },
  { id: "merchant-stack", label: "Merchant Stack",     short: "Merchant" },
  { id: "accounting",     label: "Accounting",         short: "Acct" },
  { id: "compliance",     label: "Compliance",         short: "Compliance" },
  { id: "treasury-fx",    label: "Treasury & FX",      short: "Treasury" },
  { id: "ops",            label: "Ops & Recon",        short: "Ops" },
];

export function init(root) {
  render(root);
  state.subscribe(["domainFilter", "terms"], () => render(root));
}

function render(root) {
  const s = state.get();
  root.innerHTML = `
    <div class="label">Filter by domain</div>
    ${DOMAINS.map(d => {
      const count = d.id === "all" ? s.terms.length : s.terms.filter(t => t.domain === d.id).length;
      return `
        <button class="chip" aria-pressed="${s.domainFilter === d.id}" data-domain="${d.id}">
          <span>${d.label}</span><span class="count">${count}</span>
        </button>`;
    }).join("")}
  `;
  root.querySelectorAll("[data-domain]").forEach(btn => {
    btn.addEventListener("click", () => state.set({ domainFilter: btn.dataset.domain }));
  });
}
```

- [ ] **Step 2: Wire into `js/app.js`**

Add to `boot()` after topbar.init:

```js
import * as sidebar from "/js/sidebar.js";
// ...
sidebar.init(document.querySelector("[data-sidebar]"));
```

Final `js/app.js`:

```js
import * as state from "/js/state.js";
import * as topbar from "/js/topbar.js";
import * as sidebar from "/js/sidebar.js";

async function boot() {
  await state.load();
  topbar.init(document.querySelector("[data-topbar]"));
  sidebar.init(document.querySelector("[data-sidebar]"));
}

boot().catch(err => {
  console.error("boot failed", err);
  document.body.textContent = "Failed to load. See console.";
});
```

- [ ] **Step 3: Verify**

Reload. Expected: sidebar shows 7 chips (All 50, Rails 11, Merchant Stack 9, Accounting 10, Compliance 7, Treasury & FX 8, Ops & Recon 5). "All" is active. Clicking a domain toggles the active state.

- [ ] **Step 4: Commit**

```bash
git add js/sidebar.js js/app.js
git commit -m "feat: sidebar with domain filter"
```

---

## Task 9: Flow renderer (SVG diagram)

**Files:** Create: `js/flow-renderer.js`. Modify: `js/app.js`.

Uses `flow.layout` for node coordinates and `flow.edges` for connections. Uses `flow.steps` to determine active/done state. Clicking a node sets `selectedTermId`.

- [ ] **Step 1: Create `js/flow-renderer.js`**

```js
import * as state from "/js/state.js";

const NS = "http://www.w3.org/2000/svg";
const VIEWBOX = "0 0 640 260";

export function init(root) {
  render(root);
  state.subscribe(
    ["activeFlowId", "stepIndex", "selectedTermId", "domainFilter", "terms"],
    () => render(root)
  );
  root.addEventListener("click", e => {
    const g = e.target.closest("g[data-term]");
    if (g) state.set({ selectedTermId: g.dataset.term });
  });
}

function render(root) {
  const s = state.get();
  const flow = state.activeFlow();
  if (!flow) { root.innerHTML = ""; return; }

  const doneIds = new Set(flow.steps.slice(0, s.stepIndex).map(st => st.termId));
  const activeId = flow.steps[s.stepIndex]?.termId;
  const selectedId = state.currentTermId();

  const nodesSvg = flow.layout.map(n => {
    const isDone = doneIds.has(n.termId) && n.termId !== activeId;
    const isActive = n.termId === activeId;
    const isSelected = n.termId === selectedId;
    const term = s.termsById.get(n.termId);
    const dim =
      s.domainFilter !== "all" && term && term.domain !== s.domainFilter;

    const cls = [
      "node",
      isDone ? "done" : "",
      isActive ? "active" : "",
      isSelected ? "selected" : "",
      dim ? "dim" : ""
    ].filter(Boolean).join(" ");

    const cx = n.x + n.w / 2;
    return `
      <g class="${cls}" data-term="${n.termId}" tabindex="0" role="button" aria-label="${n.label}">
        <rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="6"></rect>
        <text x="${cx}" y="${n.y + 20}">${escapeXml(n.label)}</text>
        <text class="tlabel" x="${cx}" y="${n.y + 34}">${escapeXml(n.sublabel || "")}</text>
      </g>`;
  }).join("");

  const layoutByTerm = Object.fromEntries(flow.layout.map(n => [n.termId, n]));
  const edgesSvg = flow.edges.map(e => {
    const a = layoutByTerm[e.from], b = layoutByTerm[e.to];
    if (!a || !b) return "";
    const fromEdge = edgePoint(a, b);
    const toEdge = edgePoint(b, a);
    const isDone = doneIds.has(e.to) && e.to !== activeId;
    const isActive = e.to === activeId;
    const cls = ["edge", isDone ? "done" : "", isActive ? "active" : ""].filter(Boolean).join(" ");
    const markerId = isActive ? "arrA" : isDone ? "arrD" : "arrN";
    return `<path class="${cls}" d="${curve(fromEdge, toEdge)}" marker-end="url(#${markerId})"></path>`;
  }).join("");

  root.innerHTML = `
    <h2>${escapeXml(flow.title)}</h2>
    <div class="scenario">${escapeXml(flow.scenario)}</div>
    ${renderStepBar(flow, s.stepIndex)}
    <svg viewBox="${VIEWBOX}" role="group" aria-label="Flow diagram">
      <defs>
        <marker id="arrN" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#cbd5e1"/></marker>
        <marker id="arrD" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#10b981"/></marker>
        <marker id="arrA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#d97706"/></marker>
      </defs>
      ${edgesSvg}
      ${nodesSvg}
    </svg>
  `;
}

function renderStepBar(flow, stepIdx) {
  const total = flow.steps.length;
  const current = flow.steps[stepIdx];
  const term = state.get().termsById.get(current.termId);
  const summary = term ? term.name : current.termId.replace(/^pseudo-/, "").replace(/-/g, " ");
  return `
    <div class="stepbar">
      <span>Step <b>${stepIdx + 1} / ${total}</b> · ${escapeXml(summary)}</span>
      <div class="ctrl">
        <button data-step="prev" ${stepIdx === 0 ? "disabled" : ""}>← Back</button>
        <button data-step="next" ${stepIdx === total - 1 ? "disabled" : ""}>Next →</button>
      </div>
    </div>
  `;
}

function edgePoint(from, to) {
  const fx = from.x + from.w / 2, fy = from.y + from.h / 2;
  const tx = to.x + to.w / 2,     ty = to.y + to.h / 2;
  const dx = tx - fx, dy = ty - fy;
  const halfW = from.w / 2, halfH = from.h / 2;
  const scale = Math.min(halfW / Math.max(Math.abs(dx), 1), halfH / Math.max(Math.abs(dy), 1));
  return { x: fx + dx * scale, y: fy + dy * scale };
}

function curve(a, b) {
  const mx = (a.x + b.x) / 2;
  return `M${a.x},${a.y} C${mx},${a.y} ${mx},${b.y} ${b.x},${b.y}`;
}

function escapeXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
```

- [ ] **Step 2: Wire into `js/app.js`**

```js
import * as state from "/js/state.js";
import * as topbar from "/js/topbar.js";
import * as sidebar from "/js/sidebar.js";
import * as flowRenderer from "/js/flow-renderer.js";

async function boot() {
  await state.load();
  topbar.init(document.querySelector("[data-topbar]"));
  sidebar.init(document.querySelector("[data-sidebar]"));
  flowRenderer.init(document.querySelector("[data-flowpane]"));
}

boot().catch(err => {
  console.error("boot failed", err);
  document.body.textContent = "Failed to load. See console.";
});
```

- [ ] **Step 3: Verify**

Reload. Expected: centre pane shows the B2B cross-border flow diagram. Switch flows via topbar — diagram re-renders. Click a node — it gets a teal outline. Filter by domain — non-matching nodes dim.

- [ ] **Step 4: Commit**

```bash
git add js/flow-renderer.js js/app.js
git commit -m "feat: SVG flow renderer with state-driven highlighting"
```

---

## Task 10: Detail pane

**Files:** Create: `js/detail-pane.js`. Modify: `js/app.js`.

Renders the currently selected term (or the active step's term) with the active lens.

- [ ] **Step 1: Create `js/detail-pane.js`**

```js
import * as state from "/js/state.js";
import { DOMAINS } from "/js/sidebar.js";

const DOMAIN_LABEL = Object.fromEntries(DOMAINS.map(d => [d.id, d.label]));
const LENSES = [
  { id: "reference",   label: "Reference" },
  { id: "connections", label: "Connections" },
  { id: "example",     label: "Example" },
];

export function init(root) {
  render(root);
  state.subscribe(
    ["activeFlowId", "stepIndex", "selectedTermId", "lens", "terms"],
    () => render(root)
  );
  root.addEventListener("click", e => {
    const lensBtn = e.target.closest("button[data-lens]");
    if (lensBtn) { state.set({ lens: lensBtn.dataset.lens }); return; }
    const rel = e.target.closest("a[data-term]");
    if (rel) { e.preventDefault(); state.set({ selectedTermId: rel.dataset.term }); }
  });
}

function render(root) {
  const s = state.get();
  const term = state.currentTerm();
  const flow = state.activeFlow();
  const step = flow ? flow.steps[s.stepIndex] : null;

  if (!term) {
    root.innerHTML = `
      <div class="label">No selection</div>
      <h3>Pick a node</h3>
      <p>Click any node in the flow diagram, or press → to advance the guided tour.</p>
    `;
    return;
  }

  root.innerHTML = `
    <div class="label">${s.selectedTermId ? "Selected" : `Step ${s.stepIndex + 1}`}</div>
    <h3>${escapeHtml(term.name)}</h3>
    <div class="sub">${DOMAIN_LABEL[term.domain] || term.domain} · ${escapeHtml(term.role || "")}</div>
    <div class="tabs" role="tablist">
      ${LENSES.map(l => `
        <button role="tab" aria-selected="${s.lens === l.id}" data-lens="${l.id}">${l.label}</button>
      `).join("")}
    </div>
    ${lensBody(term, s.lens)}
    ${step && !s.selectedTermId ? `<div class="narr" aria-live="polite"><b>Narration · step ${s.stepIndex + 1}</b>${escapeHtml(step.narration)}</div>` : ""}
  `;
}

function lensBody(term, lens) {
  if (lens === "reference") {
    return `<p>${escapeHtml(term.reference)}</p>`;
  }
  if (lens === "connections") {
    return connectionBlocks(term);
  }
  return `<p>${escapeHtml(term.example)}</p>`;
}

function connectionBlocks(term) {
  const c = term.connections || {};
  const sections = [];
  if (c.confusedWith?.length) sections.push(["Often confused with", c.confusedWith]);
  if (c.upstream?.length)     sections.push(["Upstream", c.upstream]);
  if (c.downstream?.length)   sections.push(["Downstream", c.downstream]);
  if (!sections.length) return `<p>No connections mapped.</p>`;
  return sections.map(([label, ids]) => `
    <div class="rel">
      <b>${label}</b>
      ${ids.map(id => {
        const t = state.get().termsById.get(id);
        const text = t ? t.name : id;
        return t ? `<a href="#" data-term="${id}">${escapeHtml(text)}</a>` : `<span>${escapeHtml(text)}</span>`;
      }).join("")}
    </div>
  `).join("");
}

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
```

- [ ] **Step 2: Wire into `js/app.js`**

```js
import * as detail from "/js/detail-pane.js";
// ...
detail.init(document.querySelector("[data-detail]"));
```

- [ ] **Step 3: Verify**

Reload. Expected: right pane shows the first step's term (UK SME — but that's a pseudo ID, so it shows "Pick a node"). Click `Faster Payments` node — detail updates with its reference text. Click the Connections tab — shows Upstream/Downstream chips. Click "Often confused with" chip — detail swaps to that term.

- [ ] **Step 4: Commit**

```bash
git add js/detail-pane.js js/app.js
git commit -m "feat: detail pane with 3 lenses + connection chips"
```

---

## Task 11: Step controls + keyboard

**Files:** Create: `js/controls.js`. Modify: `js/app.js`.

Binds step-bar buttons and keyboard shortcuts.

- [ ] **Step 1: Create `js/controls.js`**

```js
import * as state from "/js/state.js";

export function init() {
  document.addEventListener("click", e => {
    const btn = e.target.closest("button[data-step]");
    if (!btn) return;
    if (btn.dataset.step === "next") advance(+1);
    if (btn.dataset.step === "prev") advance(-1);
  });

  document.addEventListener("keydown", e => {
    const s = state.get();
    if (s.searchOpen) return;
    const tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea") return;

    if (e.key === "ArrowRight") { e.preventDefault(); advance(+1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); advance(-1); }
    else if (e.key === "1") state.set({ lens: "reference" });
    else if (e.key === "2") state.set({ lens: "connections" });
    else if (e.key === "3") state.set({ lens: "example" });
    else if (e.key.toLowerCase() === "g") cycleFlow();
  });
}

function advance(delta) {
  const s = state.get();
  const flow = state.activeFlow();
  if (!flow) return;
  const next = Math.max(0, Math.min(flow.steps.length - 1, s.stepIndex + delta));
  if (next !== s.stepIndex) state.set({ stepIndex: next, selectedTermId: null });
}

function cycleFlow() {
  const s = state.get();
  const ids = s.flows.map(f => f.id);
  const i = ids.indexOf(s.activeFlowId);
  const next = ids[(i + 1) % ids.length];
  state.set({ activeFlowId: next, stepIndex: 0, selectedTermId: null });
}
```

- [ ] **Step 2: Wire into `js/app.js`**

```js
import * as controls from "/js/controls.js";
// ...
controls.init();
```

- [ ] **Step 3: Hintbar content**

In `js/app.js` after `await state.load()`, set the hintbar:

```js
document.querySelector("[data-hintbar]").innerHTML =
  `Keyboard: <kbd>→</kbd> next · <kbd>←</kbd> back · <kbd>1</kbd><kbd>2</kbd><kbd>3</kbd> lens · <kbd>g</kbd> next flow · <kbd>/</kbd> search`;
```

- [ ] **Step 4: Verify**

Reload. Press → repeatedly. Expected: step counter advances, active node shifts (amber), completed nodes go green. Press ← to go back. Press 1/2/3 to swap lens. Press `g` to cycle flows.

- [ ] **Step 5: Commit**

```bash
git add js/controls.js js/app.js
git commit -m "feat: step controls + keyboard shortcuts"
```

---

## Task 12: Search overlay

**Files:** Create: `js/search.js`. Modify: `js/app.js`.

Slash (`/`) or Cmd/Ctrl+K opens a search input. Selecting a result jumps to the first flow containing that term and selects it.

- [ ] **Step 1: Create `js/search.js`**

```js
import * as state from "/js/state.js";

let overlayEl, inputEl, listEl;
let results = [];
let cursor = 0;

export function init(root) {
  overlayEl = root;
  overlayEl.innerHTML = `
    <div class="box">
      <input type="text" placeholder="Search terms..." aria-label="Search terms">
      <ul role="listbox"></ul>
    </div>
  `;
  inputEl = overlayEl.querySelector("input");
  listEl = overlayEl.querySelector("ul");

  document.addEventListener("keydown", onGlobalKey);
  inputEl.addEventListener("input", onInput);
  inputEl.addEventListener("keydown", onInputKey);
  listEl.addEventListener("click", onListClick);
  overlayEl.addEventListener("click", e => { if (e.target === overlayEl) close(); });
}

function onGlobalKey(e) {
  const tag = (e.target.tagName || "").toLowerCase();
  const isMeta = e.metaKey || e.ctrlKey;
  if ((e.key === "/" && tag !== "input" && tag !== "textarea") || (isMeta && e.key.toLowerCase() === "k")) {
    e.preventDefault();
    open();
  } else if (e.key === "Escape" && state.get().searchOpen) {
    close();
  }
}

function open() {
  state.set({ searchOpen: true });
  overlayEl.hidden = false;
  inputEl.value = "";
  renderResults("");
  inputEl.focus();
}

function close() {
  state.set({ searchOpen: false });
  overlayEl.hidden = true;
}

function onInput() { renderResults(inputEl.value); }

function onInputKey(e) {
  if (e.key === "ArrowDown") { e.preventDefault(); cursor = Math.min(results.length - 1, cursor + 1); paintCursor(); }
  else if (e.key === "ArrowUp") { e.preventDefault(); cursor = Math.max(0, cursor - 1); paintCursor(); }
  else if (e.key === "Enter") { e.preventDefault(); choose(cursor); }
}

function onListClick(e) {
  const li = e.target.closest("li");
  if (!li) return;
  choose(Number(li.dataset.index));
}

function renderResults(q) {
  cursor = 0;
  const needle = q.trim().toLowerCase();
  const terms = state.get().terms;
  results = needle
    ? terms.filter(t => matches(t, needle)).slice(0, 12)
    : terms.slice(0, 12);
  listEl.innerHTML = results.map((t, i) => `
    <li role="option" aria-selected="${i === 0}" data-index="${i}">
      ${escapeHtml(t.name)}<span class="dom">${t.domain}</span>
    </li>
  `).join("");
}

function paintCursor() {
  [...listEl.children].forEach((li, i) => li.setAttribute("aria-selected", i === cursor));
  const selected = listEl.children[cursor];
  if (selected) selected.scrollIntoView({ block: "nearest" });
}

function choose(i) {
  const term = results[i];
  if (!term) return;
  const flowId = term.flows[0];
  const flow = state.get().flowsById.get(flowId);
  const stepIdx = flow ? flow.steps.findIndex(st => st.termId === term.id) : -1;
  state.set({
    activeFlowId: flowId || state.get().activeFlowId,
    stepIndex: stepIdx >= 0 ? stepIdx : 0,
    selectedTermId: term.id,
  });
  close();
}

function matches(t, q) {
  if (t.name.toLowerCase().includes(q)) return true;
  if (t.id.includes(q)) return true;
  if ((t.alias || []).some(a => a.toLowerCase().includes(q))) return true;
  return false;
}

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
```

- [ ] **Step 2: Wire into `js/app.js`**

```js
import * as search from "/js/search.js";
// ...
search.init(document.querySelector("[data-search]"));
```

- [ ] **Step 3: Verify**

Reload. Press `/`. Expected: overlay appears, input focused, showing 12 terms. Type `sep` — filters to SEPA / SEPA Instant. Press Enter — overlay closes, flow switches to B2B cross-border, step jumps to the SEPA Instant step, detail pane shows SEPA Instant. Press Cmd/Ctrl+K — overlay reopens.

- [ ] **Step 4: Commit**

```bash
git add js/search.js js/app.js
git commit -m "feat: search overlay (/ and Cmd/Ctrl+K)"
```

---

## Task 13: Router (hash-based URL state)

**Files:** Create: `js/router.js`. Modify: `js/app.js`.

URL format: `#/flow/<flowId>/step/<n>?lens=<lens>`. Router updates URL when state changes, and applies URL on load + on `hashchange`.

- [ ] **Step 1: Create `js/router.js`**

```js
import * as state from "/js/state.js";

let suppress = false;

export function init() {
  applyHash();
  window.addEventListener("hashchange", () => {
    if (suppress) return;
    applyHash();
  });
  state.subscribe(["activeFlowId", "stepIndex", "lens"], writeHash);
}

function applyHash() {
  const h = window.location.hash.replace(/^#/, "");
  if (!h) return;
  const [pathPart, queryPart] = h.split("?");
  const parts = pathPart.split("/").filter(Boolean); // ["", "flow", id, "step", n] → ["flow", id, "step", n]
  const patch = {};
  if (parts[0] === "flow" && parts[1]) patch.activeFlowId = parts[1];
  if (parts[2] === "step" && parts[3] !== undefined) {
    const n = parseInt(parts[3], 10);
    if (!Number.isNaN(n)) patch.stepIndex = n;
  }
  if (queryPart) {
    const params = new URLSearchParams(queryPart);
    const lens = params.get("lens");
    if (lens && ["reference","connections","example"].includes(lens)) patch.lens = lens;
  }
  if (Object.keys(patch).length) state.set(patch);
}

function writeHash() {
  const s = state.get();
  const hash = `#/flow/${s.activeFlowId}/step/${s.stepIndex}?lens=${s.lens}`;
  if (hash !== window.location.hash) {
    suppress = true;
    history.replaceState(null, "", hash);
    setTimeout(() => { suppress = false; }, 0);
  }
}
```

- [ ] **Step 2: Wire into `js/app.js`** (call AFTER `state.load()` but BEFORE other inits so initial hash wins)

```js
import * as router from "/js/router.js";
// ...
await state.load();
router.init();
topbar.init(...);
// ...
```

- [ ] **Step 3: Verify**

Reload. Expected: URL becomes `#/flow/b2b-xborder/step/0?lens=reference`. Press → — URL updates to `step/1`. Switch flows — URL updates. Paste `http://localhost:8000/#/flow/swift/step/3?lens=connections` in a new tab — page loads directly to that state.

- [ ] **Step 4: Commit**

```bash
git add js/router.js js/app.js
git commit -m "feat: hash-based router for shareable URLs"
```

---

## Task 14: Accessibility pass

**Files:** Modify: `js/flow-renderer.js`, `js/detail-pane.js`, `js/topbar.js`, `js/sidebar.js`, `css/app.css`.

- [ ] **Step 1: Verify ARIA roles already in place**

Check that:
- `topbar .tab` uses `role="tab"` and `aria-selected` ✓ (already done in Task 7)
- `topbar .lens button` uses `role="tab"` with `aria-selected` ✓
- `sidebar .chip` uses `aria-pressed` ✓
- `flow-renderer` nodes have `role="button"` + `aria-label` ✓
- `detail-pane` narration block has `aria-live="polite"` ✓

No edits needed if the above are present. If any are missing, add them now.

- [ ] **Step 2: Add visible focus rings for SVG nodes**

Append to `css/app.css`:

```css
.node:focus-visible { outline: 2px solid var(--teal); outline-offset: 2px; }
.node[tabindex] { cursor: pointer; }
```

- [ ] **Step 3: Keyboard-selectable SVG nodes**

In `js/flow-renderer.js`, the `click` handler already exists. Add a `keydown` handler in `init()`:

```js
root.addEventListener("keydown", e => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const g = e.target.closest("g[data-term]");
  if (g) { e.preventDefault(); state.set({ selectedTermId: g.dataset.term }); }
});
```

- [ ] **Step 4: Verify**

Reload. Press Tab repeatedly — focus rings should visit topbar tabs, lens toggle, sidebar chips, flow nodes (with teal ring), then detail pane buttons. Press Enter on a focused node — it selects in the detail pane.

- [ ] **Step 5: Commit**

```bash
git add js/flow-renderer.js css/app.css
git commit -m "a11y: keyboard-reachable SVG nodes + focus styling"
```

---

## Task 15: Responsive polish

**Files:** Modify: `css/app.css`, `js/topbar.js`.

- [ ] **Step 1: Condense topbar on small screens**

Append to `css/app.css`:

```css
@media (max-width: 640px) {
  .topbar { gap: 6px; padding: 8px; }
  .topbar .logo { font-size: var(--fs-16); }
  .topbar .tab { padding: 4px 8px; font-size: var(--fs-11); }
  .topbar .lens { margin-left: 0; width: 100%; order: 10; justify-content: center; }
  .hintbar { display: none; }
}
@media (max-width: 1023px) {
  .sidebar .label { margin-bottom: var(--s-1); font-size: var(--fs-10); }
  .sidebar { padding: 10px 12px; }
}
```

- [ ] **Step 2: Test widths**

Open DevTools device toolbar.

- 1280px: three-column layout, everything visible.
- 768px: single column; sidebar becomes a horizontal chip strip; flow fills width; detail pane below.
- 375px: hintbar hidden; topbar wraps neatly; flow diagram height expands to 420px (already in CSS from Task 6); detail pane readable.

- [ ] **Step 3: Commit**

```bash
git add css/app.css
git commit -m "style: responsive polish for tablet + mobile"
```

---

## Task 16: `prefers-reduced-motion` + final polish

**Files:** Modify: `css/app.css`.

- [ ] **Step 1: Verify reduced-motion handling**

The tokens in Task 2 already zero motion durations under `prefers-reduced-motion`. Verify:

```css
/* in tokens.css — confirm this block exists */
@media (prefers-reduced-motion: reduce) {
  :root { --dur-1: 0ms; --dur-2: 0ms; }
}
```

Add this to `css/app.css` to disable the dashed-edge animation under reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  .edge.active { stroke-dasharray: none; }
}
```

- [ ] **Step 2: Verify**

System Settings → Accessibility → Reduce Motion = on. Reload. Expected: step transitions are instant, no dashed animations.

- [ ] **Step 3: Commit**

```bash
git add css/app.css
git commit -m "a11y: respect prefers-reduced-motion"
```

---

## Task 17: Vercel deploy

**Files:** Modify: `vercel.json`, `README.md`.

- [ ] **Step 1: Write `vercel.json`**

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    { "source": "/assets/fonts/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/css/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/js/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/data/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=300" }] },
    { "source": "/(.*).html",
      "headers": [{ "key": "Cache-Control", "value": "no-cache" }] }
  ]
}
```

- [ ] **Step 2: Update `README.md` with deploy section**

Append to `README.md`:

````markdown
## Deploy to Vercel

```bash
npx vercel           # first deploy (interactive — accept defaults)
npx vercel --prod    # promote latest to production
```

Cache headers in `vercel.json` give assets/CSS/JS immutable 1-year cache and HTML no-cache, so new deploys are visible instantly.

## URL state

Current flow/step/lens is captured in the URL hash, e.g.
`https://your-site.vercel.app/#/flow/swift/step/3?lens=connections` — share that link and it opens directly on that step.
````

- [ ] **Step 3: Dry-run deploy**

```bash
npx vercel --confirm
```

Accept defaults when prompted. Expected: deploy succeeds; Vercel prints a preview URL.

- [ ] **Step 4: Smoke test the deployed URL**

Open the preview URL. Verify:
- Page loads, fonts render, flow diagram appears
- Click through 2–3 flow tabs
- Press → 3 times — step advances
- Press `/`, type "swift", Enter — jumps to SWIFT flow
- Copy `.../#/flow/ar-ap/step/4?lens=example` — paste in a new tab — loads to that step with Example lens active

- [ ] **Step 5: Commit + promote**

```bash
git add vercel.json README.md
git commit -m "deploy: vercel config + deploy instructions"
npx vercel --prod
```

---

## Self-review checklist (ran after writing the plan)

- **Spec coverage:** every section of `DESIGN_SPEC.md` maps to a task.
  - §1 goal → Tasks 3, 4, 10
  - §2 IA → Tasks 1, 6, 7, 8, 9, 10
  - §3 6 flows → Task 4
  - §4 50 terms → Task 3
  - §5 data model → Tasks 3, 4
  - §6 interactivity → Tasks 9, 10, 11, 12, 13
  - §7 visual design → Tasks 2, 6
  - §8 responsive/a11y → Tasks 14, 15, 16
  - §9 file structure → Task 1 (mirrors the tree exactly)
  - §10 deploy → Task 17
  - §11 out of scope → enforced by what's absent (no auth, no i18n, no dark mode, no analytics task)
  - §12 done criteria → Tasks 3, 4, 11, 12, 13, 15, 17

- **Placeholder scan:** no TBD / TODO / "implement later" anywhere. All JSON content, CSS, and JS provided literally.

- **Type consistency:** `state.set`, `state.subscribe`, `state.get`, `state.activeFlow`, `state.activeStep`, `state.currentTerm`, `state.currentTermId`, `state.load` — consistent across Tasks 5, 7, 8, 9, 10, 11, 12, 13. Domain IDs (`all`, `rails`, `merchant-stack`, `accounting`, `compliance`, `treasury-fx`, `ops`) match between `terms.json` and `sidebar.js`. Flow IDs (`b2b-xborder`, `card`, `ach`, `swift`, `payfac`, `ar-ap`) match between `flows.json`, `router.js`, and default `activeFlowId`. Lens IDs (`reference`, `connections`, `example`) match across topbar, detail-pane, router.
