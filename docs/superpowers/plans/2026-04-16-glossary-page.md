# Glossary Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a standalone glossary page at `/glossary.html` that teaches all 50 fintech/accounting terms via an accordion list with bespoke animated SVGs, plain-English copy, and deep links back to the flow explorer.

**Architecture:** Standalone page that reuses `css/tokens.css` + `css/base.css` from the existing site. New module tree under `js/glossary/` with no dependency on main-site state. Per-term animations live in their own files and lazy-load on expand via dynamic `import()`. Data adds one new file (`data/glossary.json`) for plain-English copy; `terms.json` and `flows.json` are untouched.

**Tech Stack:** HTML5 + CSS3 (custom properties, grid) + ES modules. Inline SVG + Web Animations API for animations. No build tools, no framework, no tests harness (verify in browser). Served by Vercel static hosting.

**Project root:** `Superprof Freelance Projects/Fintech terminologies/` — all paths below are relative to this root.

**Reference spec:** `docs/superpowers/specs/2026-04-16-glossary-page-design.md`

---

## File Structure (target state)

```
glossary.html                          # new, sibling of index.html
css/
  glossary.css                         # new
  tokens.css                           # unchanged
  base.css                             # unchanged
js/
  topbar.js                            # MODIFIED: add "Glossary" link
  glossary/
    app.js                             # new — entry point
    term-card.js                       # new — renders closed + expanded card
    search-filter.js                   # new — sticky bar (search + domain chips)
    router.js                          # new — hash → auto-expand
    animations/
      primitives.js                    # new — shared SVG primitives
      registry.js                      # new — term-id → animation loader
      <term-id>.js × up to 50          # new — one scene per term (animated or static)
data/
  glossary.json                        # new
  terms.json                           # unchanged
  flows.json                           # unchanged
docs/superpowers/
  specs/2026-04-16-glossary-page-design.md   # already exists
  plans/2026-04-16-glossary-page.md          # this file
```

**Module responsibility rules:**
- `glossary/app.js` — single `init()` entry. Loads data, mounts the page, wires submodules.
- `term-card.js` — renders one card. No state outside what's passed in.
- `search-filter.js` — owns sticky bar DOM + emits `filter-change` events via a small event bus.
- `router.js` — reads/writes hash, auto-expands matching card on load.
- `animations/primitives.js` — pure SVG helpers returning strings or elements. No state, no side effects.
- `animations/registry.js` — single `getAnimation(termId)` returning either an animation constructor or a static-frame renderer.
- `animations/<term-id>.js` — one default export returning `{ svg, play() }`.

---

## Execution notes

- **No tests harness exists** in this project. "Verify" steps = open the page in a browser and check the described behaviour.
- **Dev server:** the project is static. Use `python3 -m http.server 5173` from the project root and visit `http://localhost:5173/glossary.html`.
- **Commit cadence:** commit at the end of each task, not mid-task. Each task is a self-contained unit.
- **Playwright available:** use `mcp__plugin_playwright_playwright__browser_*` tools to automate in-browser verification when helpful.

---

## Task 1: Scaffold the page shell

**Goal:** `/glossary.html` loads, shows a header with nav, a hero, a placeholder main area, with no JS errors.

**Files:**
- Create: `glossary.html`, `css/glossary.css`, `js/glossary/app.js`

- [ ] **Step 1: Create `glossary.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Glossary — FinTech Terminologies</title>
  <meta name="description" content="50 fintech and accounting terms, explained plainly with bespoke animations.">
  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
  <link rel="stylesheet" href="/css/tokens.css">
  <link rel="stylesheet" href="/css/base.css">
  <link rel="stylesheet" href="/css/glossary.css">
</head>
<body class="glossary-body">
  <div class="glossary">
    <header class="gl-header" data-header>
      <div class="logo">⇌ flow<em>stack</em></div>
      <nav class="gl-nav">
        <a href="/index.html" class="gl-navlink">Flows</a>
        <a href="/glossary.html" class="gl-navlink" aria-current="page">Glossary</a>
      </nav>
    </header>

    <section class="gl-hero">
      <h1>Glossary</h1>
      <p>50 fintech &amp; accounting terms, explained visually. Start here if the flows feel opaque.</p>
    </section>

    <div class="gl-stickybar" data-stickybar></div>
    <main class="gl-main" data-main></main>
    <footer class="gl-footer">
      <span>Tip: press <kbd>/</kbd> or <kbd>Cmd/Ctrl + K</kbd> to search.</span>
    </footer>
  </div>

  <script type="module" src="/js/glossary/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `css/glossary.css` with layout shell**

```css
/* ───── glossary page shell ───── */
.glossary-body { background: var(--paper); color: var(--ink); }
.glossary {
  max-width: 960px;
  margin: 0 auto;
  padding: var(--s-4);
  display: flex; flex-direction: column; gap: var(--s-4);
  min-height: 100vh;
}

.gl-header {
  display: flex; align-items: center; gap: var(--s-4);
  padding: var(--s-3) var(--s-4);
  background: var(--surface); border: 1px solid var(--line);
  border-radius: var(--r-xl);
  position: sticky; top: var(--s-3); z-index: 5;
}
.gl-header .logo { font-family: var(--ff-serif); font-size: var(--fs-18); }
.gl-header .logo em { color: var(--teal); font-style: normal; }
.gl-nav { margin-left: auto; display: flex; gap: var(--s-2); }
.gl-navlink {
  padding: 6px 12px; border-radius: var(--r-pill);
  font-size: var(--fs-12); color: var(--ink-2);
  border: 1px solid var(--line); background: var(--surface);
  text-decoration: none;
  transition: background var(--dur-1) var(--ease);
}
.gl-navlink:hover { background: var(--paper-warm); }
.gl-navlink[aria-current="page"] { background: var(--ink); color: #fff; border-color: var(--ink); font-weight: 600; }

.gl-hero { padding: var(--s-4) var(--s-2); }
.gl-hero h1 { font-family: var(--ff-serif); font-size: var(--fs-36); line-height: var(--lh-tight); margin-bottom: var(--s-2); }
.gl-hero p { font-size: var(--fs-16); color: var(--ink-2); line-height: var(--lh-body); max-width: 56ch; }

.gl-stickybar {
  position: sticky; top: 72px; z-index: 4;
  background: var(--paper);
  padding: var(--s-3) 0;
}

.gl-main { display: flex; flex-direction: column; gap: var(--s-6); padding-top: var(--s-2); }

.gl-footer {
  padding: var(--s-4) var(--s-2); color: var(--ink-3); font-size: var(--fs-12);
  border-top: 1px solid var(--line-soft); margin-top: var(--s-6);
}
.gl-footer kbd {
  padding: 1px 6px; border: 1px solid var(--line); border-radius: var(--r-sm);
  background: var(--surface); font-family: var(--ff-mono); font-size: var(--fs-11);
}

@media (max-width: 600px) {
  .glossary { padding: var(--s-3); }
  .gl-header { padding: var(--s-2) var(--s-3); }
  .gl-hero h1 { font-size: var(--fs-28); }
}
```

- [ ] **Step 3: Create `js/glossary/app.js` with minimal init**

```js
// Entry point for glossary page. Loads data then mounts.
async function init() {
  const main = document.querySelector("[data-main]");
  main.textContent = "Loading…";
  const [terms, glossary] = await Promise.all([
    fetch("/data/terms.json").then(r => r.json()),
    fetch("/data/glossary.json").then(r => r.json()).catch(() => []),
  ]);
  main.textContent = `Loaded ${terms.length} terms.`;
  console.log("glossary ready", { terms: terms.length, glossary: glossary.length });
}

init().catch(err => {
  console.error(err);
  document.querySelector("[data-main]").textContent = "Failed to load. See console.";
});
```

- [ ] **Step 4: Verify in browser**

Run: `python3 -m http.server 5173` (from project root), visit `http://localhost:5173/glossary.html`.
Expected: page loads, shows header with Flows/Glossary links, hero heading "Glossary", and main area shows `Loaded 50 terms.` with no console errors. `glossary.json` 404 is expected and swallowed.

- [ ] **Step 5: Commit**

```bash
git add glossary.html css/glossary.css js/glossary/app.js
git commit -m "scaffold: glossary page shell"
```

---

## Task 2: Add Glossary link to main site header

**Goal:** Clicking "Glossary" in the main `index.html` topbar navigates to `/glossary.html`.

**Files:**
- Modify: `js/topbar.js`

- [ ] **Step 1: Update `js/topbar.js` render() to include a Glossary link**

Replace the contents of the `render` function with:

```js
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
    <a class="gl-link" href="/glossary.html">Glossary ↗</a>
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
```

- [ ] **Step 2: Add matching CSS in `css/app.css`**

Append to `css/app.css` (at the end of the topbar block, around line 47):

```css
.topbar .gl-link {
  margin-left: var(--s-2);
  padding: 6px 12px; border-radius: var(--r-pill);
  background: var(--teal-tint); color: var(--teal);
  font-size: var(--fs-12); font-weight: 600; text-decoration: none;
  border: 1px solid var(--teal-line);
  transition: background var(--dur-1) var(--ease);
}
.topbar .gl-link:hover { background: #cffafe; }
```

- [ ] **Step 3: Verify**

Visit `http://localhost:5173/index.html`. Expected: topbar shows the existing flow tabs + lens + a new teal "Glossary ↗" link on the right. Clicking navigates to `/glossary.html`.

- [ ] **Step 4: Commit**

```bash
git add js/topbar.js css/app.css
git commit -m "feat: link from main site topbar to glossary"
```

---

## Task 3: Author `data/glossary.json`

**Goal:** Ship plain-English "What it is" copy for all 50 terms, keyed by id to `terms.json`.

**Files:**
- Create: `data/glossary.json`

**Rule:** every `plain` string must be 1–3 sentences, in plain English, aimed at someone who doesn't know payments. Avoid jargon unless defining it inline. No em dashes (project rule).

- [ ] **Step 1: Create `data/glossary.json` with all 50 entries**

```json
[
  { "id": "card-network", "plain": "The railway that carries a card payment between the shop's bank and the shopper's bank. Visa and Mastercard are the two big ones. They don't hold the money; they just route the message and set the rules." },
  { "id": "interchange", "plain": "The fee the shop's bank pays to the shopper's bank on every card transaction. It's the single biggest cost of accepting cards, and the card network (Visa, Mastercard) sets it, not the shop." },
  { "id": "ach", "plain": "The US bank transfer system for everyday low-cost payments. It moves money in batches, not instantly. Payroll, bill pay, and business-to-business transfers all typically ride ACH." },
  { "id": "faster-payments", "plain": "The UK's instant bank transfer system. You hit send, money arrives in seconds, 24/7. It's what fintechs like Wise use to move GBP in and out of customer accounts." },
  { "id": "sepa-instant", "plain": "The euro version of an instant bank transfer. Regular SEPA takes a day; SEPA Instant takes under 10 seconds and works any time. It covers almost all of Europe." },
  { "id": "swift", "plain": "A messaging network that banks use to tell each other to move money. It carries the instructions, not the money itself. The actual funds move through accounts banks hold with each other." },
  { "id": "correspondent-banking", "plain": "When your bank doesn't deal directly with a foreign bank, the payment hops through intermediary banks that do. Each hop adds a fee and a delay. It's why international wires are slow and expensive." },
  { "id": "rtp", "plain": "The USA's instant bank payments system, run by the big banks. Think of it as America's answer to Faster Payments, but it's newer and not every bank is on it yet." },
  { "id": "wire-transfer", "plain": "A high-value same-day bank transfer that usually can't be reversed once sent. Used for property purchases, business treasury moves, and cross-border payments. Fedwire in the US, CHAPS in the UK." },
  { "id": "iso-20022", "plain": "A modern format for payment messages that carries much richer information than the old SWIFT format. Things like the invoice number, purpose of payment, and full addresses travel with the money, making reconciliation and compliance much easier." },
  { "id": "settlement", "plain": "The moment the actual money physically moves between two parties. Different from authorisation, which is just the promise to pay. A card gets authorised in seconds but settled a few days later." },

  { "id": "payment-gateway", "plain": "The checkout page's card reader. It captures the card number, encrypts it, and hands it off to the processor. It never holds money itself; it's just the front door." },
  { "id": "payment-processor", "plain": "The engine behind the gateway that actually talks to Visa, Mastercard, and the shopper's bank to get a yes or no on a transaction. Worldpay and Fiserv are classic processors." },
  { "id": "payment-provider", "plain": "A company that bundles the gateway, the processor, compliance, and bank accounts into one product. Stripe, Adyen, and Wise Business are examples. You integrate once and they route your payments through whichever rail fits." },
  { "id": "acquirer", "plain": "The shop's bank in a card transaction. It sponsors the shop into the card networks and receives the settled funds from Visa or Mastercard on the shop's behalf." },
  { "id": "issuer", "plain": "The shopper's bank. It issued the card, holds the shopper's money or credit line, and decides whether to approve or decline each transaction." },
  { "id": "payfac", "plain": "A platform that lets small businesses accept cards in minutes by onboarding them as sub-merchants under the platform's own bank contract. Shopify Payments, Stripe Connect, and Square work this way." },
  { "id": "merchant-of-record", "plain": "The legal seller on the receipt. This is the party responsible for taxes, refunds, and chargebacks, even if someone else is the real creator of the product. Paddle and Apple often act as merchant of record for app developers." },
  { "id": "tokenization", "plain": "Replacing a real card number with a random string of characters that's useless if stolen. It means the shop never stores your actual card number, so a data breach there can't leak it." },
  { "id": "3ds-sca", "plain": "The 'confirm with your bank app' step during online checkout. 3D Secure is the technology; SCA is the EU and UK regulation that makes banks require it for most card payments. It shifts fraud liability from the shop to the bank." },

  { "id": "accounts-payable", "plain": "Money your business owes to suppliers for things you've already received but haven't paid for yet. It sits as a liability on the balance sheet until the bill is paid." },
  { "id": "accounts-receivable", "plain": "Money your customers owe you for things you've already delivered but they haven't paid for yet. It's an asset on the balance sheet because you expect the cash to come in." },
  { "id": "general-ledger", "plain": "The master book that records every financial transaction the business has made. Every other financial report is built from it. If it's not in the general ledger, it didn't happen." },
  { "id": "expense-code", "plain": "A numbered category that tells you what type of expense something is. 'Software', 'Travel', 'Rent' each get their own code. It's how a business rolls up thousands of individual costs into a readable report." },
  { "id": "chart-of-accounts", "plain": "The full list of every category (expense code) a business uses to classify its money. Think of it as the index of the general ledger. Adding a new category usually needs finance approval." },
  { "id": "journal-entry", "plain": "A single booking in the ledger that records one business event. It always has a debit and a credit that balance. Paying a bill creates one; raising an invoice creates another." },
  { "id": "double-entry", "plain": "The rule that every business event affects at least two accounts, and total debits always equal total credits. It's a built-in self-check that makes accounting errors easier to catch." },
  { "id": "accrual-vs-cash", "plain": "Two different clocks for when a business recognises money. Accrual records revenue when you earn it and cost when you incur it, regardless of when cash moves. Cash accounting only records things when money actually moves. Large companies use accrual because it better reflects reality." },
  { "id": "clearing-account", "plain": "A temporary parking spot in the ledger for money that's on its way from one place to another. You use one when, for example, Stripe owes you a payout but hasn't sent it yet. You reconcile and empty the account regularly." },
  { "id": "trial-balance", "plain": "A periodic report listing every account and its balance, with all debits on one side and all credits on the other. The two sides must equal. If they don't, something was miskeyed and needs hunting down." },

  { "id": "kyc", "plain": "Identity verification done before someone can use a financial service. Passport, selfie, proof of address. It's required by anti-money-laundering laws." },
  { "id": "kyb", "plain": "The business version of identity checks. You verify the company on Companies House, the directors, and the real humans who own more than 25 percent of it. Much harder than personal KYC because ownership can be hidden behind holding companies." },
  { "id": "aml", "plain": "The whole ongoing programme of watching for suspicious money flows, not just a one-time check. It runs every day the customer is active, flags unusual patterns, and files reports to regulators when needed." },
  { "id": "sanctions-screening", "plain": "Checking every name in a transaction against government watchlists of sanctioned people, companies, or countries. A match freezes the payment until investigated. False positives are common and add delays." },
  { "id": "pci-dss", "plain": "The security rulebook for anyone who touches card data. It covers encryption, access controls, logging, and audits. Most small shops keep their obligations minimal by never touching raw card numbers at all, letting Stripe or similar handle it." },
  { "id": "psd2", "plain": "EU and UK law from 2018 that does two big things. It requires banks to make you confirm payments with your bank app (Strong Customer Authentication), and it forces banks to open APIs so apps like budgeting tools can read your account with your permission." },
  { "id": "safeguarding", "plain": "A UK rule that says non-bank payment firms must keep customer money in a separate ring-fenced account at a real bank. If the fintech goes bust, your money is safe because it was never theirs to lose." },

  { "id": "mid-market-rate", "plain": "The 'real' exchange rate, sitting exactly halfway between what banks buy and sell a currency for at a given moment. It's what you see on Google or Reuters. Providers add a markup on top; Wise's pitch is that it charges a visible fee and uses this rate directly." },
  { "id": "fx-spread", "plain": "The quiet markup a bank or provider adds to the real exchange rate. If mid-market is 1.1732 and you're offered 1.14, the 2.8 percent difference is the spread. 'Zero fee' currency exchange often hides its cost here." },
  { "id": "nostro-vostro", "plain": "Banks hold accounts with each other so they can settle international payments. From your bank's view, it's a 'nostro' (ours with them). From the other bank's view, the same account is a 'vostro' (yours with us). Moving money internationally often just means shifting entries in these accounts." },
  { "id": "float", "plain": "Money a payment company parks in local accounts ahead of time so that outbound payments feel instant to users. The company eats the cost of idle cash in exchange for speed. It's why Wise can release euros before your pounds have actually been converted." },
  { "id": "stablecoin-rails", "plain": "Using USDC or USDT to move value across borders instead of banks. You convert cash into the stablecoin, send it on the blockchain, and convert back. It settles in minutes any time of day and skips the correspondent banking chain." },
  { "id": "cross-currency-netting", "plain": "When a payment company has lots of offsetting flows on the same day (money going both ways between two currencies), it only needs to move the net difference through the actual rails. Saves a lot of fees and FX cost at scale." },
  { "id": "cut-off-time", "plain": "The daily deadline after which a payment is pushed to the next business day. Every rail, currency, and bank has different ones. Missing a cut-off can add 24 to 72 hours, especially over a weekend." },
  { "id": "treasury-reconciliation", "plain": "The daily task of matching a company's internal ledger to every bank and payment-rail statement to make sure nothing's missing or misposted. Catches breaks early before they compound into big problems." },

  { "id": "pay-in", "plain": "Money coming into a payment platform from a customer. A card top-up, a Faster Payment, a bank transfer in. It's the front half of every payment company's business." },
  { "id": "pay-out", "plain": "Money leaving a payment platform to a destination bank or beneficiary. A SEPA payout, an ACH credit, a wire. The back half of every payment company's business." },
  { "id": "reconciliation", "plain": "Matching transactions across two or three different sources to prove every recorded movement actually happened. Typically your ledger against the bank statement, and sometimes against invoices too. Duplicates, misspostings, and fraud all surface here." },
  { "id": "chargeback", "plain": "When a shopper disputes a card transaction with their bank and the money gets clawed back from the shop. The shop can fight it with evidence, but the burden is on them. A chargeback often costs a fee on top of the refund." },
  { "id": "refund-vs-reversal", "plain": "A refund is a fresh transaction that sends money back; the original charge still shows on everyone's books. A reversal cancels the original before the money settles, so it's as if the charge never happened. Only a reversal is possible in the first minutes after a transaction." }
]
```

- [ ] **Step 2: Verify file is valid JSON**

Run: `python3 -c "import json; print(len(json.load(open('data/glossary.json'))))"`
Expected: `50`

- [ ] **Step 3: Verify every id in glossary.json exists in terms.json**

Run this one-liner:
```bash
python3 -c "
import json
t = {x['id'] for x in json.load(open('data/terms.json'))}
g = {x['id'] for x in json.load(open('data/glossary.json'))}
print('missing in terms:', g - t)
print('missing in glossary:', t - g)
"
```
Expected: both lines print empty sets.

- [ ] **Step 4: Commit**

```bash
git add data/glossary.json
git commit -m "data: plain-English copy for 50 glossary terms"
```

---

## Task 4: Render all 50 terms as closed cards, grouped by domain

**Goal:** Visiting `/glossary.html` shows 6 domain headings and 50 closed term cards in alphabetical order within each domain. No interactivity yet.

**Files:**
- Create: `js/glossary/term-card.js`
- Modify: `js/glossary/app.js`
- Modify: `css/glossary.css`

- [ ] **Step 1: Create `js/glossary/term-card.js`**

```js
// Renders a single term card (closed state only for now).

export function renderClosedCard(term, plain) {
  const el = document.createElement("details");
  el.className = "gl-card";
  el.id = term.id;
  el.dataset.termId = term.id;
  el.dataset.domain = term.domain;

  const summary = document.createElement("summary");
  summary.className = "gl-card-summary";
  summary.innerHTML = `
    <div class="gl-card-title">
      <h3>${term.name}</h3>
      <p class="gl-card-sub">${subline(term)}</p>
    </div>
    <span class="gl-card-chev" aria-hidden="true">▸</span>
  `;
  el.appendChild(summary);

  // Placeholder body — later tasks fill this on first expand.
  const body = document.createElement("div");
  body.className = "gl-card-body";
  body.dataset.termId = term.id;
  body.dataset.plain = plain || "";
  el.appendChild(body);

  return el;
}

function subline(term) {
  const alias = (term.alias && term.alias.length) ? term.alias.join(" / ") + " · " : "";
  const domainLabel = DOMAIN_LABEL[term.domain] || term.domain;
  return `${alias}${domainLabel} · ${term.role || ""}`;
}

export const DOMAIN_LABEL = {
  "rails": "Rails & Networks",
  "merchant-stack": "Merchant stack",
  "accounting": "Accounting",
  "compliance": "Compliance",
  "treasury-fx": "Treasury & FX",
  "ops": "Ops & Reconciliation",
};

export const DOMAIN_ORDER = ["rails", "merchant-stack", "accounting", "compliance", "treasury-fx", "ops"];
```

- [ ] **Step 2: Replace `js/glossary/app.js` with a rendering pass**

```js
import { renderClosedCard, DOMAIN_LABEL, DOMAIN_ORDER } from "/js/glossary/term-card.js";

async function init() {
  const [terms, glossary] = await Promise.all([
    fetch("/data/terms.json").then(r => r.json()),
    fetch("/data/glossary.json").then(r => r.json()),
  ]);

  const glossaryById = new Map(glossary.map(g => [g.id, g]));

  // Group by domain
  const byDomain = {};
  for (const d of DOMAIN_ORDER) byDomain[d] = [];
  for (const t of terms) {
    if (byDomain[t.domain]) byDomain[t.domain].push(t);
  }
  for (const d of DOMAIN_ORDER) {
    byDomain[d].sort((a, b) => a.name.localeCompare(b.name));
  }

  const main = document.querySelector("[data-main]");
  main.innerHTML = "";
  for (const d of DOMAIN_ORDER) {
    const group = byDomain[d];
    if (!group.length) continue;
    const section = document.createElement("section");
    section.className = "gl-group";
    section.dataset.domain = d;
    section.innerHTML = `
      <header class="gl-group-header">
        <h2>${DOMAIN_LABEL[d]}</h2>
        <span class="gl-group-count">${group.length}</span>
      </header>
      <div class="gl-group-cards" data-cards></div>
    `;
    const cardsRoot = section.querySelector("[data-cards]");
    for (const term of group) {
      const plain = glossaryById.get(term.id)?.plain || "";
      cardsRoot.appendChild(renderClosedCard(term, plain));
    }
    main.appendChild(section);
  }
}

init().catch(err => {
  console.error(err);
  const main = document.querySelector("[data-main]");
  if (main) main.textContent = "Failed to load. See console.";
});
```

- [ ] **Step 3: Add card + group styles to `css/glossary.css`**

Append:

```css
/* ───── group ───── */
.gl-group { display: flex; flex-direction: column; gap: var(--s-2); }
.gl-group-header {
  display: flex; align-items: baseline; gap: var(--s-3);
  padding: 0 var(--s-1) var(--s-2);
  border-bottom: 1px solid var(--line-soft);
}
.gl-group-header h2 {
  font-family: var(--ff-serif); font-size: var(--fs-22); color: var(--ink);
}
.gl-group-count {
  font-size: var(--fs-11); color: var(--ink-3);
  background: var(--paper-warm); border: 1px solid var(--line);
  padding: 2px 8px; border-radius: var(--r-pill);
  font-variant-numeric: tabular-nums;
}
.gl-group-cards { display: flex; flex-direction: column; gap: var(--s-2); }

/* ───── card (closed) ───── */
.gl-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-left: 3px solid transparent;
  border-radius: var(--r-lg);
  overflow: hidden;
  transition: border-left-color var(--dur-1) var(--ease), box-shadow var(--dur-1) var(--ease);
}
.gl-card:hover { border-left-color: var(--teal); }
.gl-card[open] { box-shadow: var(--shadow-1); border-left-color: var(--teal); }

.gl-card-summary {
  list-style: none;
  cursor: pointer;
  padding: var(--s-3) var(--s-4);
  display: flex; align-items: center; gap: var(--s-3);
  user-select: none;
}
.gl-card-summary::-webkit-details-marker { display: none; }
.gl-card-summary:focus-visible {
  outline: 2px solid var(--teal);
  outline-offset: -2px;
  border-radius: var(--r-lg);
}
.gl-card-title { flex: 1; min-width: 0; }
.gl-card-title h3 {
  font-family: var(--ff-serif); font-size: var(--fs-18);
  color: var(--ink); line-height: var(--lh-tight);
}
.gl-card-sub {
  font-size: var(--fs-11); color: var(--ink-3);
  letter-spacing: .02em; margin-top: 2px;
}
.gl-card-chev {
  color: var(--ink-3); font-size: var(--fs-16);
  transition: transform var(--dur-1) var(--ease);
  display: inline-block;
}
.gl-card[open] .gl-card-chev { transform: rotate(90deg); color: var(--teal); }

/* ───── card body (placeholder for now) ───── */
.gl-card-body {
  padding: 0 var(--s-4) var(--s-4);
  color: var(--ink-2);
  font-size: var(--fs-14);
  line-height: var(--lh-body);
}
```

- [ ] **Step 4: Verify in browser**

Expected:
- 6 section headings (Rails & Networks, Merchant stack, Accounting, Compliance, Treasury & FX, Ops & Reconciliation)
- 50 cards total
- Each card has name + subline with alias/domain/role
- Within each group, cards are alphabetical
- Clicking a card toggles native `<details>` open (no animation yet; body is empty)
- No console errors

- [ ] **Step 5: Commit**

```bash
git add js/glossary/app.js js/glossary/term-card.js css/glossary.css
git commit -m "feat: render 50 closed cards grouped by domain"
```

---

## Task 5: Render expanded card body (without animation)

**Goal:** Expanding a card shows the "What it is", "How to spot it", "Don't confuse with" chips, and a "See it live" link. Animation pane is a plain placeholder.

**Files:**
- Modify: `js/glossary/term-card.js`
- Modify: `js/glossary/app.js`
- Modify: `css/glossary.css`

- [ ] **Step 1: Expand `term-card.js` with body rendering**

Replace the file with:

```js
export const DOMAIN_LABEL = {
  "rails": "Rails & Networks",
  "merchant-stack": "Merchant stack",
  "accounting": "Accounting",
  "compliance": "Compliance",
  "treasury-fx": "Treasury & FX",
  "ops": "Ops & Reconciliation",
};
export const DOMAIN_ORDER = ["rails", "merchant-stack", "accounting", "compliance", "treasury-fx", "ops"];

export function renderClosedCard(term, plain, context) {
  const el = document.createElement("details");
  el.className = "gl-card";
  el.id = term.id;
  el.dataset.termId = term.id;
  el.dataset.domain = term.domain;

  const summary = document.createElement("summary");
  summary.className = "gl-card-summary";
  summary.innerHTML = `
    <div class="gl-card-title">
      <h3>${term.name}</h3>
      <p class="gl-card-sub">${subline(term)}</p>
    </div>
    <span class="gl-card-chev" aria-hidden="true">▸</span>
  `;
  el.appendChild(summary);

  const body = document.createElement("div");
  body.className = "gl-card-body";
  body.innerHTML = bodyHtml(term, plain, context);
  el.appendChild(body);

  return el;
}

function subline(term) {
  const alias = (term.alias && term.alias.length) ? term.alias.join(" / ") + " · " : "";
  const domainLabel = DOMAIN_LABEL[term.domain] || term.domain;
  return `${alias}${domainLabel} · ${term.role || ""}`;
}

function bodyHtml(term, plain, context) {
  const confusedChips = (term.connections?.confusedWith || [])
    .map(id => {
      const other = context.termsById.get(id);
      if (!other) return "";
      return `<a class="gl-chip" href="#${id}" data-jump="${id}">${other.name}</a>`;
    })
    .join("");

  const live = deriveSeeItLive(term, context);
  const liveLink = live
    ? `<a class="gl-see-live" href="/index.html#/flow/${live.flowId}/step/${live.step}">See it live in the ${live.flowLabel} flow →</a>`
    : "";

  return `
    <div class="gl-body-grid">
      <div class="gl-anim" data-anim-for="${term.id}">
        <div class="gl-anim-placeholder">animation</div>
      </div>
      <div class="gl-body-text">
        <section class="gl-block">
          <h4>What it is</h4>
          <p>${escape(plain || term.reference || "")}</p>
        </section>
        <section class="gl-block">
          <h4>How to spot it</h4>
          <p>${escape(term.example || "")}</p>
        </section>
        ${confusedChips ? `
          <section class="gl-block">
            <h4>Don't confuse with</h4>
            <div class="gl-chips">${confusedChips}</div>
          </section>` : ""}
        ${liveLink ? `<div class="gl-block">${liveLink}</div>` : ""}
      </div>
    </div>
  `;
}

function deriveSeeItLive(term, context) {
  // If glossary.json has seeItLive override, use it.
  const override = context.glossaryById.get(term.id)?.seeItLive;
  if (override && context.flowsById.get(override.flow)) {
    const flow = context.flowsById.get(override.flow);
    return { flowId: override.flow, step: override.step, flowLabel: shortFlow(flow.title) };
  }
  // Else, first flow in term.flows where a step references this term.
  for (const flowId of term.flows || []) {
    const flow = context.flowsById.get(flowId);
    if (!flow) continue;
    const stepIdx = flow.steps.findIndex(s => s.termId === term.id);
    if (stepIdx >= 0) {
      return { flowId, step: stepIdx, flowLabel: shortFlow(flow.title) };
    }
  }
  // No flow contains this term as a step — link to first listed flow, step 0.
  const firstFlow = (term.flows || [])[0];
  if (firstFlow && context.flowsById.get(firstFlow)) {
    return { flowId: firstFlow, step: 0, flowLabel: shortFlow(context.flowsById.get(firstFlow).title) };
  }
  return null;
}

function shortFlow(title) { return title.split(" — ")[0]; }

function escape(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]));
}
```

- [ ] **Step 2: Update `js/glossary/app.js` to build context and pass it in**

Replace the body of `init()` with:

```js
async function init() {
  const [terms, glossary, flows] = await Promise.all([
    fetch("/data/terms.json").then(r => r.json()),
    fetch("/data/glossary.json").then(r => r.json()),
    fetch("/data/flows.json").then(r => r.json()),
  ]);

  const context = {
    terms,
    glossary,
    flows,
    termsById: new Map(terms.map(t => [t.id, t])),
    glossaryById: new Map(glossary.map(g => [g.id, g])),
    flowsById: new Map(flows.map(f => [f.id, f])),
  };

  const byDomain = {};
  for (const d of DOMAIN_ORDER) byDomain[d] = [];
  for (const t of terms) if (byDomain[t.domain]) byDomain[t.domain].push(t);
  for (const d of DOMAIN_ORDER) byDomain[d].sort((a, b) => a.name.localeCompare(b.name));

  const main = document.querySelector("[data-main]");
  main.innerHTML = "";
  for (const d of DOMAIN_ORDER) {
    const group = byDomain[d];
    if (!group.length) continue;
    const section = document.createElement("section");
    section.className = "gl-group";
    section.dataset.domain = d;
    section.innerHTML = `
      <header class="gl-group-header">
        <h2>${DOMAIN_LABEL[d]}</h2>
        <span class="gl-group-count">${group.length}</span>
      </header>
      <div class="gl-group-cards" data-cards></div>
    `;
    const cardsRoot = section.querySelector("[data-cards]");
    for (const term of group) {
      const plain = context.glossaryById.get(term.id)?.plain || "";
      cardsRoot.appendChild(renderClosedCard(term, plain, context));
    }
    main.appendChild(section);
  }
}
```

- [ ] **Step 3: Add body-grid styles to `css/glossary.css`**

Append:

```css
/* ───── card body layout ───── */
.gl-card-body { padding: 0 var(--s-4) var(--s-4); }
.gl-body-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--s-4);
  padding-top: var(--s-3);
  border-top: 1px solid var(--line-soft);
}
.gl-anim {
  aspect-ratio: 320 / 200;
  background: var(--paper-warm); border: 1px solid var(--line);
  border-radius: var(--r-md);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; position: relative;
}
.gl-anim-placeholder { font-size: var(--fs-11); color: var(--ink-3); letter-spacing: .12em; text-transform: uppercase; }

.gl-body-text { display: flex; flex-direction: column; gap: var(--s-3); min-width: 0; }
.gl-block h4 {
  font-size: var(--fs-10); text-transform: uppercase; letter-spacing: .14em;
  color: var(--ink-3); font-weight: 700; margin-bottom: 4px;
}
.gl-block p { font-size: var(--fs-14); color: var(--ink-2); line-height: var(--lh-body); }

.gl-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.gl-chip {
  padding: 3px 10px; border-radius: var(--r-pill);
  background: var(--paper-warm); color: var(--ink-2);
  font-size: var(--fs-11); border: 1px solid var(--line);
  text-decoration: none;
  transition: background var(--dur-1) var(--ease), color var(--dur-1) var(--ease);
}
.gl-chip:hover { background: var(--ink); color: #fff; border-color: var(--ink); }

.gl-see-live {
  display: inline-block;
  padding: 8px 14px; border-radius: var(--r-md);
  background: var(--teal-tint); color: var(--teal);
  font-size: var(--fs-12); font-weight: 600;
  border: 1px solid var(--teal-line);
  text-decoration: none;
  transition: background var(--dur-1) var(--ease);
}
.gl-see-live:hover { background: #cffafe; }

@media (max-width: 720px) {
  .gl-body-grid { grid-template-columns: 1fr; }
  .gl-anim { aspect-ratio: 16 / 10; }
}
```

- [ ] **Step 4: Verify**

Expand 3–4 different cards. Expected:
- Each shows a grey "animation" placeholder on the left (or top on mobile)
- "What it is" shows the plain-English copy
- "How to spot it" shows the example
- "Don't confuse with" chips appear when the term has `confusedWith` ids
- "See it live →" link appears and points to a valid hash like `/index.html#/flow/card/step/2`
- Clicking that link navigates to the main site at the correct flow + step

- [ ] **Step 5: Commit**

```bash
git add js/glossary/term-card.js js/glossary/app.js css/glossary.css
git commit -m "feat: render expanded card body with plain/example/chips/live-link"
```

---

## Task 6: Accordion expand/collapse — chip navigation + auto-open on hash

**Goal:** Clicking a "Don't confuse with" chip jumps to that term's card, opens it, and highlights it briefly. Arriving at `/glossary.html#acquirer` auto-opens and scrolls to Acquirer.

**Files:**
- Create: `js/glossary/router.js`
- Modify: `js/glossary/app.js`
- Modify: `css/glossary.css`

- [ ] **Step 1: Create `js/glossary/router.js`**

```js
// Handles chip jumps and hash → auto-expand.

export function init() {
  handleHash();
  window.addEventListener("hashchange", handleHash);

  document.addEventListener("click", onClick);
}

function onClick(e) {
  const jump = e.target.closest("[data-jump]");
  if (!jump) return;
  e.preventDefault();
  const id = jump.dataset.jump;
  if (!id) return;
  if (location.hash.replace(/^#/, "") === id) {
    openAndScroll(id, { pulse: true });
  } else {
    location.hash = id;   // hashchange handler will run
  }
}

function handleHash() {
  const id = location.hash.replace(/^#/, "");
  if (!id) return;
  openAndScroll(id, { pulse: true });
}

function openAndScroll(id, { pulse = false } = {}) {
  const el = document.getElementById(id);
  if (!el) return;
  el.open = true;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  if (pulse) {
    el.classList.remove("gl-pulse");
    // Force reflow so the animation restarts when re-applied.
    void el.offsetWidth;
    el.classList.add("gl-pulse");
    setTimeout(() => el.classList.remove("gl-pulse"), 1400);
  }
}
```

- [ ] **Step 2: Wire router into `js/glossary/app.js`**

Add import at top:

```js
import * as router from "/js/glossary/router.js";
```

At the very end of the `init()` function (after the render loop), add:

```js
  router.init();
```

- [ ] **Step 3: Add pulse highlight CSS**

Append to `css/glossary.css`:

```css
.gl-card.gl-pulse {
  animation: gl-pulse-anim 1400ms var(--ease);
}
@keyframes gl-pulse-anim {
  0%   { box-shadow: 0 0 0 0 rgba(13,148,136,.45); border-left-color: var(--teal); }
  60%  { box-shadow: 0 0 0 8px rgba(13,148,136,0); border-left-color: var(--teal); }
  100% { box-shadow: 0 0 0 0 rgba(13,148,136,0); }
}
@media (prefers-reduced-motion: reduce) {
  .gl-card.gl-pulse { animation: none; }
}
```

- [ ] **Step 4: Verify**

- Expand any term with "Don't confuse with" chips. Click a chip. Expected: the target card opens, the page scrolls to it, it pulses teal.
- Type `http://localhost:5173/glossary.html#acquirer` in the address bar and press Enter. Expected: Acquirer card auto-opens and scrolls into view with a pulse.
- Back/forward browser buttons work to revisit different terms.

- [ ] **Step 5: Commit**

```bash
git add js/glossary/router.js js/glossary/app.js css/glossary.css
git commit -m "feat: glossary hash routing + chip jumps"
```

---

## Task 7: Sticky search bar + domain filter

**Goal:** Typing in the search bar live-filters visible cards; domain chips narrow by domain; the two compose; empty state shows when nothing matches.

**Files:**
- Create: `js/glossary/search-filter.js`
- Modify: `js/glossary/app.js`
- Modify: `css/glossary.css`

- [ ] **Step 1: Create `js/glossary/search-filter.js`**

```js
import { DOMAIN_LABEL, DOMAIN_ORDER } from "/js/glossary/term-card.js";

export function init(root, terms) {
  const counts = { all: terms.length };
  for (const d of DOMAIN_ORDER) counts[d] = terms.filter(t => t.domain === d).length;

  root.innerHTML = `
    <div class="gl-sticky-inner">
      <div class="gl-searchwrap">
        <input
          type="search"
          class="gl-search"
          data-search
          placeholder="Search terms…"
          aria-label="Search glossary terms"
          autocomplete="off"
        >
        <kbd class="gl-searchkbd">/</kbd>
      </div>
      <div class="gl-chiprow" role="tablist" aria-label="Filter by domain">
        <button class="gl-dchip" data-domain="all" aria-pressed="true">All <span class="gl-dcount">${counts.all}</span></button>
        ${DOMAIN_ORDER.map(d => `
          <button class="gl-dchip" data-domain="${d}" aria-pressed="false">
            ${DOMAIN_LABEL[d]} <span class="gl-dcount">${counts[d]}</span>
          </button>
        `).join("")}
      </div>
    </div>
    <div class="gl-empty" data-empty hidden>
      No terms match. <button class="gl-empty-reset" data-empty-reset>Clear filters</button>
    </div>
  `;

  const input = root.querySelector("[data-search]");
  const chips = root.querySelectorAll(".gl-dchip");
  const empty = root.querySelector("[data-empty]");
  const reset = root.querySelector("[data-empty-reset]");

  let state = { q: "", domain: "all" };

  function applyFilter() {
    const q = state.q.trim().toLowerCase();
    const d = state.domain;
    let anyVisible = false;

    document.querySelectorAll(".gl-card").forEach(card => {
      const termId = card.dataset.termId;
      const term = terms.find(t => t.id === termId);
      if (!term) return;

      const domainMatch = d === "all" || term.domain === d;
      const queryMatch = !q
        || term.name.toLowerCase().includes(q)
        || (term.alias || []).some(a => a.toLowerCase().includes(q))
        || term.domain.toLowerCase().includes(q);

      const show = domainMatch && queryMatch;
      card.hidden = !show;
      if (show) anyVisible = true;
    });

    // Hide entire group section if all its cards are hidden.
    document.querySelectorAll(".gl-group").forEach(group => {
      const visible = group.querySelectorAll(".gl-card:not([hidden])").length;
      group.hidden = visible === 0;
    });

    empty.hidden = anyVisible;
  }

  input.addEventListener("input", () => {
    state = { ...state, q: input.value };
    applyFilter();
  });

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      state = { ...state, domain: chip.dataset.domain };
      chips.forEach(c => c.setAttribute("aria-pressed", c === chip ? "true" : "false"));
      applyFilter();
    });
  });

  reset.addEventListener("click", () => {
    state = { q: "", domain: "all" };
    input.value = "";
    chips.forEach(c => c.setAttribute("aria-pressed", c.dataset.domain === "all" ? "true" : "false"));
    applyFilter();
  });

  // Keyboard: "/" or Cmd/Ctrl+K focuses search; Esc clears.
  document.addEventListener("keydown", (e) => {
    const activeTag = document.activeElement?.tagName;
    const isTyping = activeTag === "INPUT" || activeTag === "TEXTAREA";
    if ((e.key === "/" && !isTyping) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
      e.preventDefault();
      input.focus();
      input.select();
    } else if (e.key === "Escape" && document.activeElement === input) {
      input.value = "";
      state = { ...state, q: "" };
      applyFilter();
      input.blur();
    }
  });
}
```

- [ ] **Step 2: Mount search-filter from `app.js`**

Add import:
```js
import * as searchFilter from "/js/glossary/search-filter.js";
```

After the rendering loop in `init()` (before `router.init()`):
```js
  const stickybar = document.querySelector("[data-stickybar]");
  searchFilter.init(stickybar, terms);
```

- [ ] **Step 3: Add sticky-bar styles to `css/glossary.css`**

Append:

```css
/* ───── sticky filter bar ───── */
.gl-sticky-inner {
  background: var(--surface); border: 1px solid var(--line);
  border-radius: var(--r-xl);
  padding: var(--s-3); display: flex; flex-direction: column; gap: var(--s-2);
  box-shadow: var(--shadow-1);
}
.gl-searchwrap {
  position: relative;
  display: flex; align-items: center;
}
.gl-search {
  flex: 1;
  padding: 10px 40px 10px 14px;
  border-radius: var(--r-md);
  border: 1px solid var(--line);
  background: var(--paper);
  font-family: var(--ff-sans); font-size: var(--fs-14); color: var(--ink);
  transition: border-color var(--dur-1) var(--ease), background var(--dur-1) var(--ease);
}
.gl-search::placeholder { color: var(--ink-3); }
.gl-search:focus {
  outline: none; border-color: var(--teal); background: var(--surface);
  box-shadow: 0 0 0 3px rgba(13,148,136,.15);
}
.gl-searchkbd {
  position: absolute; right: 10px;
  padding: 1px 6px; border: 1px solid var(--line); border-radius: var(--r-sm);
  background: var(--paper-warm); font-family: var(--ff-mono); font-size: var(--fs-11); color: var(--ink-3);
  pointer-events: none;
}

.gl-chiprow {
  display: flex; gap: 6px; flex-wrap: wrap; align-items: center;
}
.gl-dchip {
  padding: 6px 12px; border-radius: var(--r-pill);
  background: var(--surface); color: var(--ink-2);
  font-size: var(--fs-12);
  border: 1px solid var(--line);
  cursor: pointer;
  transition: background var(--dur-1) var(--ease), color var(--dur-1) var(--ease);
}
.gl-dchip:hover { background: var(--paper-warm); }
.gl-dchip[aria-pressed="true"] { background: var(--ink); color: #fff; border-color: var(--ink); font-weight: 600; }
.gl-dcount { opacity: .7; font-variant-numeric: tabular-nums; margin-left: 4px; font-size: var(--fs-11); }

.gl-empty {
  margin-top: var(--s-3);
  padding: var(--s-4);
  background: var(--paper-warm); border: 1px dashed var(--line);
  border-radius: var(--r-md);
  font-size: var(--fs-13); color: var(--ink-2); text-align: center;
}
.gl-empty-reset {
  margin-left: 8px;
  color: var(--teal); font-weight: 600; background: transparent; border: 0;
  cursor: pointer; text-decoration: underline;
}

@media (max-width: 600px) {
  .gl-chiprow { overflow-x: auto; flex-wrap: nowrap; padding-bottom: 4px; }
  .gl-dchip { flex: 0 0 auto; }
}
```

- [ ] **Step 4: Verify**

- Type `acquirer` in the search. Expected: only cards matching "acquirer" remain visible; empty domain groups hide.
- Click the `Accounting` chip. Expected: only accounting terms visible.
- Type `ledger` with Accounting chip active. Expected: narrows within accounting.
- Click `All` chip and empty the search. Expected: all 50 cards re-appear.
- Press `/` anywhere. Expected: search gets focus.
- Press `Cmd+K` / `Ctrl+K`. Expected: search gets focus.
- Press `Esc` while in search. Expected: input clears.
- Type gibberish ("xyzzyx"). Expected: empty state shows with a working "Clear filters" link.

- [ ] **Step 5: Commit**

```bash
git add js/glossary/search-filter.js js/glossary/app.js css/glossary.css
git commit -m "feat: sticky search + domain filter with empty state"
```

---

## Task 8: SVG primitives library

**Goal:** A shared set of SVG building blocks used by every per-term animation. Pure functions returning SVG fragments (as strings) and a small `scene()` helper.

**Files:**
- Create: `js/glossary/animations/primitives.js`

- [ ] **Step 1: Create `js/glossary/animations/primitives.js`**

```js
// Shared SVG primitives for glossary animations.
// All primitives return SVG string fragments. Coordinates assume a 320×200 viewBox by default.

export const VIEWBOX = { w: 320, h: 200 };

export function scene({ width = VIEWBOX.w, height = VIEWBOX.h, title = "", desc = "", children = [] } = {}) {
  return `
    <svg class="gl-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${escapeAttr(title)}">
      <title>${escapeHtml(title)}</title>
      <desc>${escapeHtml(desc)}</desc>
      <defs>
        <marker id="arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 Z" fill="currentColor"/>
        </marker>
      </defs>
      ${children.join("")}
    </svg>
  `;
}

// Rounded rectangle node with label + optional sublabel + optional icon.
export function node({ id, x, y, w = 88, h = 40, label, sub = "", color = "ink", icon = "" } = {}) {
  const fill = color === "teal" ? "var(--teal-tint)" : color === "amber" ? "var(--amber-tint)" : "var(--surface)";
  const stroke = color === "teal" ? "var(--teal)" : color === "amber" ? "var(--amber-line)" : "var(--line)";
  const textColor = color === "teal" ? "var(--teal)" : color === "amber" ? "#78350f" : "var(--ink)";
  return `
    <g class="gl-node" data-id="${id || ""}" transform="translate(${x}, ${y})">
      <rect width="${w}" height="${h}" rx="8" ry="8" fill="${fill}" stroke="${stroke}" stroke-width="1"/>
      ${icon ? `<text x="8" y="${h/2 + 4}" font-size="14">${icon}</text>` : ""}
      <text x="${icon ? 26 : w/2}" y="${sub ? h/2 - 2 : h/2 + 4}"
            text-anchor="${icon ? "start" : "middle"}"
            font-family="var(--ff-sans)" font-size="11" font-weight="600" fill="${textColor}">${escapeHtml(label)}</text>
      ${sub ? `<text x="${icon ? 26 : w/2}" y="${h/2 + 11}" text-anchor="${icon ? "start" : "middle"}"
                    font-family="var(--ff-sans)" font-size="9" fill="var(--ink-3)">${escapeHtml(sub)}</text>` : ""}
    </g>
  `;
}

// Directed edge between two points. Supports dashed, animated pulse, label.
export function arrow({ from, to, label = "", dashed = false, animated = false, color = "var(--ink-2)", id = "" } = {}) {
  const dash = dashed ? `stroke-dasharray="4 3"` : "";
  const animId = id || `edge-${Math.floor(Math.random() * 1e6)}`;
  const pulse = animated ? `
    <circle r="3" fill="var(--teal)">
      <animateMotion dur="2.4s" repeatCount="indefinite" rotate="auto">
        <mpath href="#${animId}"/>
      </animateMotion>
    </circle>` : "";
  const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  return `
    <g class="gl-edge" style="color: ${color};">
      <path id="${animId}" d="M ${from.x} ${from.y} L ${to.x} ${to.y}"
            fill="none" stroke="${color}" stroke-width="1.5" ${dash}
            marker-end="url(#arrowhead)"/>
      ${label ? `<text x="${mid.x}" y="${mid.y - 6}" text-anchor="middle"
                      font-family="var(--ff-sans)" font-size="9" fill="var(--ink-3)">${escapeHtml(label)}</text>` : ""}
      ${pulse}
    </g>
  `;
}

// Small amber fee badge that detaches mid-arrow. `detachAt` 0..1 is the position along from→to.
export function feeBadge({ from, to, detachAt = 0.5, amount, settleY = null } = {}) {
  const detachX = from.x + (to.x - from.x) * detachAt;
  const detachY = from.y + (to.y - from.y) * detachAt;
  const dropY = settleY != null ? settleY : detachY + 30;
  return `
    <g class="gl-fee">
      <rect x="${detachX - 18}" y="${detachY - 9}" width="36" height="18" rx="6" ry="6"
            fill="var(--amber-tint)" stroke="var(--amber-line)">
        <animate attributeName="y" values="${detachY - 9};${dropY - 9};${dropY - 9}"
                 keyTimes="0;0.6;1" dur="2.4s" repeatCount="indefinite"/>
      </rect>
      <text x="${detachX}" y="${detachY + 3}" text-anchor="middle"
            font-family="var(--ff-mono)" font-size="9" font-weight="600" fill="#78350f">
        ${escapeHtml(amount)}
        <animate attributeName="y" values="${detachY + 3};${dropY + 3};${dropY + 3}"
                 keyTimes="0;0.6;1" dur="2.4s" repeatCount="indefinite"/>
      </text>
    </g>
  `;
}

// Vertical stack (for batches, journal entries). items = [{label, color}].
export function stack({ x, y, items = [], w = 110 } = {}) {
  return `
    <g class="gl-stack" transform="translate(${x}, ${y})">
      ${items.map((it, i) => `
        <rect x="0" y="${i * 14}" width="${w}" height="12" rx="3" ry="3"
              fill="${it.color || "var(--paper-warm)"}" stroke="var(--line)" stroke-width="1"/>
        <text x="6" y="${i * 14 + 9}" font-family="var(--ff-sans)" font-size="9" fill="var(--ink-2)">${escapeHtml(it.label)}</text>
      `).join("")}
    </g>
  `;
}

// Two-column debit/credit mini-ledger. rows = [{dr, cr, account}].
export function ledger({ x, y, rows = [], w = 200 } = {}) {
  const rowH = 14;
  return `
    <g class="gl-ledger" transform="translate(${x}, ${y})">
      <rect x="0" y="0" width="${w}" height="${14 + rows.length * rowH}" rx="4" ry="4"
            fill="var(--surface)" stroke="var(--line)"/>
      <text x="6" y="10" font-family="var(--ff-sans)" font-size="8" fill="var(--ink-3)"
            font-weight="700" letter-spacing="1">DR</text>
      <text x="${w - 6}" y="10" font-family="var(--ff-sans)" font-size="8" fill="var(--ink-3)"
            font-weight="700" letter-spacing="1" text-anchor="end">CR</text>
      ${rows.map((r, i) => `
        <text x="6" y="${14 + i * rowH + 10}" font-family="var(--ff-mono)" font-size="9" fill="var(--ink)">${escapeHtml(r.dr || "")}</text>
        <text x="${w/2}" y="${14 + i * rowH + 10}" text-anchor="middle"
              font-family="var(--ff-sans)" font-size="9" fill="var(--ink-3)">${escapeHtml(r.account || "")}</text>
        <text x="${w - 6}" y="${14 + i * rowH + 10}" text-anchor="end"
              font-family="var(--ff-mono)" font-size="9" fill="var(--ink)">${escapeHtml(r.cr || "")}</text>
      `).join("")}
    </g>
  `;
}

// Small circled check/x outcome marker.
export function mark({ x, y, type = "check", r = 10 } = {}) {
  const color = type === "check" ? "var(--green)" : "var(--red)";
  const glyph = type === "check" ? "✓" : "✗";
  return `
    <g class="gl-mark">
      <circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="0.15"/>
      <text x="${x}" y="${y + 3}" text-anchor="middle" font-size="11" font-weight="700" fill="${color}">${glyph}</text>
    </g>
  `;
}

// Simple clock face for timers / cut-offs.
export function timer({ x, y, label = "", r = 14 } = {}) {
  return `
    <g class="gl-timer" transform="translate(${x}, ${y})">
      <circle r="${r}" fill="var(--surface)" stroke="var(--ink-3)"/>
      <line x1="0" y1="0" x2="0" y2="-${r - 4}" stroke="var(--ink-2)" stroke-width="1.5" stroke-linecap="round">
        <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="3s" repeatCount="indefinite"/>
      </line>
      <line x1="0" y1="0" x2="${r - 6}" y2="0" stroke="var(--ink-2)" stroke-width="1.5" stroke-linecap="round">
        <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="0.5s" repeatCount="indefinite"/>
      </line>
      ${label ? `<text x="0" y="${r + 12}" text-anchor="middle" font-size="9" fill="var(--ink-3)">${escapeHtml(label)}</text>` : ""}
    </g>
  `;
}

// Simple globe with two highlighted regions.
export function globe({ x, y, r = 30, regions = [] } = {}) {
  const meridians = [0, 30, 60, 90, 120, 150].map(deg => {
    const rx = r * Math.abs(Math.cos((deg * Math.PI) / 180));
    return `<ellipse cx="0" cy="0" rx="${rx}" ry="${r}" fill="none" stroke="var(--line)" stroke-width="0.75"/>`;
  }).join("");
  return `
    <g class="gl-globe" transform="translate(${x}, ${y})">
      <circle r="${r}" fill="var(--paper)" stroke="var(--ink-3)"/>
      <line x1="-${r}" y1="0" x2="${r}" y2="0" stroke="var(--line)"/>
      ${meridians}
      ${regions.map(rg => `<circle cx="${rg.dx}" cy="${rg.dy}" r="3" fill="var(--teal)"/>`).join("")}
    </g>
  `;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}
function escapeAttr(s) {
  return String(s).replace(/["']/g, c => ({ "\"": "&quot;", "'": "&#39;" }[c]));
}
```

- [ ] **Step 2: Add base SVG styles to `css/glossary.css`**

Append:

```css
.gl-anim { background: var(--paper); }
.gl-svg { width: 100%; height: 100%; display: block; }

@media (prefers-reduced-motion: reduce) {
  .gl-svg animate,
  .gl-svg animateMotion,
  .gl-svg animateTransform { display: none !important; }
  .gl-svg .gl-fee rect { y: attr(y); }
}
```

- [ ] **Step 3: Verify via a quick smoke test**

Open the browser console on `/glossary.html` and run:
```js
import("/js/glossary/animations/primitives.js").then(p => {
  const svg = p.scene({
    title: "smoke test",
    children: [
      p.node({ x: 40, y: 80, label: "A" }),
      p.node({ x: 200, y: 80, label: "B", color: "teal" }),
      p.arrow({ from: { x: 128, y: 100 }, to: { x: 200, y: 100 }, label: "test", animated: true, id: "smoke" }),
    ],
  });
  document.body.insertAdjacentHTML("afterbegin", `<div style="width:320px;height:200px">${svg}</div>`);
});
```
Expected: a small SVG appears at the top of the page with two nodes and an animated pulse on the arrow. Remove by refreshing.

- [ ] **Step 4: Commit**

```bash
git add js/glossary/animations/primitives.js css/glossary.css
git commit -m "feat: SVG primitives library for glossary animations"
```

---

## Task 9: Animation registry with lazy loading + static fallback

**Goal:** On first expand, the card dynamically loads its animation module and mounts the SVG. If no module exists, show a small placeholder message instead. Animations pause when the card is collapsed.

**Files:**
- Create: `js/glossary/animations/registry.js`
- Modify: `js/glossary/term-card.js`
- Modify: `js/glossary/app.js`
- Modify: `css/glossary.css`

- [ ] **Step 1: Create `js/glossary/animations/registry.js`**

```js
// Registry of available per-term animations.
// Each entry is a lazy dynamic import. Terms not listed fall back to placeholder.

const ANIMATIONS = {
  // Populated in later tasks. Keys are term ids; values are loader functions.
};

// Public API.
export function register(id, loader) {
  ANIMATIONS[id] = loader;
}

export function has(id) {
  return id in ANIMATIONS;
}

export async function load(id) {
  if (!(id in ANIMATIONS)) return null;
  try {
    const mod = await ANIMATIONS[id]();
    return typeof mod.default === "function" ? mod.default() : mod.default;
  } catch (err) {
    console.warn(`animation load failed for ${id}`, err);
    return null;
  }
}

// Batch registration via a manifest.
// Each entry is [id, () => import("/js/glossary/animations/<id>.js")]
export function registerAll(entries) {
  for (const [id, loader] of entries) register(id, loader);
}
```

- [ ] **Step 2: Add `mountAnimation` helper to `term-card.js`**

Add to the end of `term-card.js`:

```js
// Called by app.js on first card expand. Swaps placeholder for animation SVG.
export async function mountAnimation(cardEl, registry) {
  const termId = cardEl.dataset.termId;
  const holder = cardEl.querySelector(`[data-anim-for="${termId}"]`);
  if (!holder || holder.dataset.mounted === "true") return;
  holder.dataset.mounted = "true";

  if (!registry.has(termId)) {
    holder.innerHTML = `<div class="gl-anim-fallback">🪙</div>`;
    return;
  }
  const svg = await registry.load(termId);
  if (!svg) {
    holder.innerHTML = `<div class="gl-anim-fallback">🪙</div>`;
    return;
  }
  holder.innerHTML = svg;
}
```

- [ ] **Step 3: Wire expand-event handling in `js/glossary/app.js`**

Add imports:
```js
import * as registry from "/js/glossary/animations/registry.js";
import { mountAnimation } from "/js/glossary/term-card.js";
```

Replace the `router.init()` call site with this block (at the end of `init()`):

```js
  // Mount animations on first expand, pause when closed via an IntersectionObserver.
  document.addEventListener("toggle", (e) => {
    const card = e.target;
    if (!(card instanceof HTMLDetailsElement) || !card.classList.contains("gl-card")) return;
    if (card.open) {
      mountAnimation(card, registry);
      card.classList.remove("gl-offscreen");
    }
  }, true);

  // Pause animations when card is open but scrolled off screen (performance).
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      e.target.classList.toggle("gl-offscreen", !e.isIntersecting);
    }
  }, { rootMargin: "200px" });
  document.querySelectorAll(".gl-card").forEach(c => io.observe(c));

  const stickybar = document.querySelector("[data-stickybar]");
  searchFilter.init(stickybar, terms);
  router.init();
```

- [ ] **Step 4: Add fallback + offscreen styles**

Append to `css/glossary.css`:

```css
.gl-anim-placeholder,
.gl-anim-fallback {
  font-size: 28px;
  color: var(--ink-3);
  opacity: 0.5;
}
.gl-anim-fallback { font-size: 36px; }
.gl-card.gl-offscreen .gl-svg * { animation-play-state: paused !important; }
```

- [ ] **Step 5: Verify**

Expand a card. Expected: placeholder flips to a coin emoji 🪙 (since no animations are registered yet). Collapse and re-expand: still a coin emoji. No console errors.

- [ ] **Step 6: Commit**

```bash
git add js/glossary/animations/registry.js js/glossary/term-card.js js/glossary/app.js css/glossary.css
git commit -m "feat: animation registry with lazy loading + fallback"
```

---

## Task 10: Ship 11 priority animations

**Goal:** The 11 priority terms each have a bespoke animated SVG on expand.

**Files (all new):**
- `js/glossary/animations/payment-processor.js`
- `js/glossary/animations/payment-provider.js`
- `js/glossary/animations/payment-gateway.js`
- `js/glossary/animations/acquirer.js`
- `js/glossary/animations/ach.js`
- `js/glossary/animations/swift.js`
- `js/glossary/animations/payfac.js`
- `js/glossary/animations/pay-in.js`
- `js/glossary/animations/accounts-payable.js`
- `js/glossary/animations/accounts-receivable.js`
- `js/glossary/animations/expense-code.js`

Registry update:
- Modify: `js/glossary/animations/registry.js` (at the bottom, add `registerAll` with the 11 entries)

- [ ] **Step 1: Create `payment-gateway.js`**

```js
import { scene, node, arrow } from "/js/glossary/animations/primitives.js";

export default () => scene({
  title: "Payment Gateway",
  desc: "Shopper enters card details at checkout. The gateway encrypts and tokenises, passing a useless-if-stolen token onward.",
  children: [
    node({ id: "shopper", x: 8,  y: 80, w: 70, h: 40, label: "Shopper", sub: "card #" }),
    node({ id: "gateway", x: 125, y: 80, w: 80, h: 40, label: "Gateway", sub: "encrypts", color: "teal" }),
    node({ id: "processor", x: 242, y: 80, w: 70, h: 40, label: "Processor" }),
    arrow({ from: { x: 78, y: 100 }, to: { x: 125, y: 100 }, label: "PAN", animated: true, id: "pg-a" }),
    arrow({ from: { x: 205, y: 100 }, to: { x: 242, y: 100 }, label: "token", animated: true, color: "var(--teal)", id: "pg-b" }),
    `<text x="160" y="170" text-anchor="middle" font-family="var(--ff-mono)" font-size="10" fill="var(--ink-3)">
       card 4242…4242 → tok_1NX8…
     </text>`,
  ],
});
```

- [ ] **Step 2: Create `payment-processor.js`**

```js
import { scene, node, arrow, mark } from "/js/glossary/animations/primitives.js";

export default () => scene({
  title: "Payment Processor",
  desc: "Processor routes the authorisation request to the card network, receives the issuer's decision, and replies back to the gateway.",
  children: [
    node({ id: "gateway", x: 8, y: 24, w: 70, h: 36, label: "Gateway" }),
    node({ id: "processor", x: 125, y: 80, w: 80, h: 40, label: "Processor", sub: "routes auth", color: "teal" }),
    node({ id: "network", x: 242, y: 24, w: 70, h: 36, label: "Network" }),
    node({ id: "issuer", x: 242, y: 140, w: 70, h: 36, label: "Issuer" }),
    arrow({ from: { x: 78, y: 42 }, to: { x: 125, y: 96 }, animated: true, id: "pp-a" }),
    arrow({ from: { x: 205, y: 96 }, to: { x: 242, y: 42 }, animated: true, id: "pp-b" }),
    arrow({ from: { x: 242, y: 60 }, to: { x: 242, y: 140 }, label: "auth?", id: "pp-c" }),
    arrow({ from: { x: 277, y: 140 }, to: { x: 277, y: 60 }, label: "APPROVED", color: "var(--green)", id: "pp-d" }),
    mark({ x: 295, y: 36, type: "check", r: 8 }),
  ],
});
```

- [ ] **Step 3: Create `payment-provider.js`**

```js
import { scene, node, arrow } from "/js/glossary/animations/primitives.js";

export default () => scene({
  title: "Payment Provider (PSP)",
  desc: "A PSP bundles gateway, processor, FX, and accounts into one product surface. A merchant integrates once; the PSP routes across rails.",
  children: [
    node({ id: "merchant", x: 8, y: 80, w: 70, h: 40, label: "Merchant" }),
    node({ id: "psp", x: 115, y: 80, w: 90, h: 40, label: "PSP", sub: "Wise / Stripe", color: "teal" }),
    node({ id: "rail-a", x: 240, y: 14, w: 70, h: 30, label: "Faster Pay" }),
    node({ id: "rail-b", x: 240, y: 56, w: 70, h: 30, label: "SEPA" }),
    node({ id: "rail-c", x: 240, y: 98, w: 70, h: 30, label: "Cards" }),
    node({ id: "rail-d", x: 240, y: 140, w: 70, h: 30, label: "SWIFT" }),
    arrow({ from: { x: 78, y: 100 }, to: { x: 115, y: 100 }, animated: true, id: "pv-main" }),
    arrow({ from: { x: 205, y: 95 }, to: { x: 240, y: 29 }, id: "pv-a" }),
    arrow({ from: { x: 205, y: 100 }, to: { x: 240, y: 71 }, id: "pv-b" }),
    arrow({ from: { x: 205, y: 105 }, to: { x: 240, y: 113 }, id: "pv-c" }),
    arrow({ from: { x: 205, y: 110 }, to: { x: 240, y: 155 }, id: "pv-d" }),
  ],
});
```

- [ ] **Step 4: Create `acquirer.js`**

```js
import { scene, node, arrow } from "/js/glossary/animations/primitives.js";

export default () => scene({
  title: "Acquirer",
  desc: "Merchant side. The acquirer receives settled card funds from the network and deposits them into the merchant's bank account the next day.",
  children: [
    node({ id: "network", x: 8, y: 80, w: 80, h: 40, label: "Card Network" }),
    node({ id: "acquirer", x: 125, y: 80, w: 80, h: 40, label: "Acquirer", sub: "merchant bank", color: "teal" }),
    node({ id: "merchant", x: 242, y: 80, w: 70, h: 40, label: "Merchant" }),
    arrow({ from: { x: 88, y: 100 }, to: { x: 125, y: 100 }, label: "batch", animated: true, id: "ac-a" }),
    arrow({ from: { x: 205, y: 100 }, to: { x: 242, y: 100 }, label: "T+1", id: "ac-b" }),
    `<text x="165" y="170" text-anchor="middle" font-family="var(--ff-mono)" font-size="10" fill="var(--ink-3)">
       £6.50 (gross) → £6.43 (net)
     </text>`,
  ],
});
```

- [ ] **Step 5: Create `ach.js`**

```js
import { scene, node, arrow, stack } from "/js/glossary/animations/primitives.js";

export default () => scene({
  title: "ACH",
  desc: "Employer batches payroll into a single file submitted to an ACH operator. The operator disburses credits to every employee bank next business day.",
  children: [
    node({ id: "employer", x: 8, y: 80, w: 70, h: 40, label: "Employer" }),
    stack({
      x: 90, y: 60, w: 90,
      items: [
        { label: "$3,200", color: "var(--paper-warm)" },
        { label: "$2,850", color: "var(--paper-warm)" },
        { label: "$4,100", color: "var(--paper-warm)" },
        { label: "…500 more", color: "var(--paper-warm)" },
      ],
    }),
    node({ id: "ach-op", x: 195, y: 80, w: 60, h: 40, label: "ACH", sub: "batch op", color: "teal" }),
    node({ id: "banks", x: 268, y: 80, w: 48, h: 40, label: "Banks" }),
    arrow({ from: { x: 78, y: 100 }, to: { x: 90, y: 100 }, id: "ach-a" }),
    arrow({ from: { x: 180, y: 100 }, to: { x: 195, y: 100 }, label: "file", id: "ach-b" }),
    arrow({ from: { x: 255, y: 100 }, to: { x: 268, y: 100 }, label: "T+1", animated: true, id: "ach-c" }),
  ],
});
```

- [ ] **Step 6: Create `swift.js`**

```js
import { scene, node, arrow, globe } from "/js/glossary/animations/primitives.js";

export default () => scene({
  title: "SWIFT",
  desc: "SWIFT is a messaging network. Banks send payment instructions through it; actual money moves through accounts they hold with each other (nostro/vostro).",
  children: [
    node({ id: "sender", x: 8, y: 80, w: 64, h: 36, label: "Chase", sub: "US" }),
    globe({ x: 160, y: 100, r: 40, regions: [{ dx: -20, dy: -10 }, { dx: 22, dy: 14 }] }),
    node({ id: "recv", x: 248, y: 80, w: 64, h: 36, label: "HDFC", sub: "India" }),
    arrow({ from: { x: 72, y: 98 }, to: { x: 120, y: 98 }, label: "MT103", animated: true, id: "sw-a" }),
    arrow({ from: { x: 200, y: 98 }, to: { x: 248, y: 98 }, label: "credit", animated: true, id: "sw-b" }),
    `<text x="160" y="180" text-anchor="middle" font-family="var(--ff-mono)" font-size="9" fill="var(--ink-3)">
       message ≠ money · money hops via nostro
     </text>`,
  ],
});
```

- [ ] **Step 7: Create `payfac.js`**

```js
import { scene, node, arrow } from "/js/glossary/animations/primitives.js";

export default () => scene({
  title: "PayFac",
  desc: "A platform onboards many sub-merchants under its own master acquiring contract, so each sub-merchant can start accepting cards in minutes.",
  children: [
    node({ id: "payfac", x: 115, y: 14, w: 90, h: 36, label: "PayFac", sub: "Shopify", color: "teal" }),
    node({ id: "sm1", x: 8, y: 80, w: 60, h: 36, label: "Shop A" }),
    node({ id: "sm2", x: 78, y: 80, w: 60, h: 36, label: "Shop B" }),
    node({ id: "sm3", x: 148, y: 80, w: 60, h: 36, label: "Shop C" }),
    node({ id: "sm4", x: 218, y: 80, w: 60, h: 36, label: "Shop D" }),
    node({ id: "acquirer", x: 115, y: 150, w: 90, h: 36, label: "Acquirer", sub: "Stripe" }),
    arrow({ from: { x: 160, y: 50 }, to: { x: 38, y: 80 }, dashed: true, id: "pf-a" }),
    arrow({ from: { x: 160, y: 50 }, to: { x: 108, y: 80 }, dashed: true, id: "pf-b" }),
    arrow({ from: { x: 160, y: 50 }, to: { x: 178, y: 80 }, dashed: true, id: "pf-c" }),
    arrow({ from: { x: 160, y: 50 }, to: { x: 248, y: 80 }, dashed: true, id: "pf-d" }),
    arrow({ from: { x: 160, y: 116 }, to: { x: 160, y: 150 }, animated: true, id: "pf-settle" }),
  ],
});
```

- [ ] **Step 8: Create `pay-in.js`**

```js
import { scene, node, arrow } from "/js/glossary/animations/primitives.js";

export default () => scene({
  title: "Pay-In",
  desc: "Money coming into the payment platform from a customer: card top-up, Faster Payment, direct debit.",
  children: [
    node({ id: "customer", x: 8, y: 80, w: 80, h: 40, label: "Customer", sub: "bank" }),
    node({ id: "platform", x: 220, y: 80, w: 90, h: 40, label: "Platform", sub: "PSP", color: "teal" }),
    arrow({ from: { x: 88, y: 100 }, to: { x: 220, y: 100 }, label: "£1,000", animated: true, id: "pi-a" }),
    `<text x="160" y="50" text-anchor="middle" font-family="var(--ff-sans)" font-size="11" font-weight="600" fill="var(--ink-3)">PAY-IN</text>`,
    `<text x="160" y="160" text-anchor="middle" font-family="var(--ff-mono)" font-size="10" fill="var(--ink-3)">Faster Payments · ~15s</text>`,
  ],
});
```

- [ ] **Step 9: Create `accounts-payable.js`**

```js
import { scene, node, arrow, ledger } from "/js/glossary/animations/primitives.js";

export default () => scene({
  title: "Accounts Payable",
  desc: "Money the business owes suppliers. Sits on the balance sheet as a liability until paid.",
  children: [
    node({ id: "supplier", x: 8, y: 16, w: 80, h: 30, label: "Supplier" }),
    node({ id: "business", x: 230, y: 16, w: 80, h: 30, label: "Business" }),
    arrow({ from: { x: 88, y: 31 }, to: { x: 230, y: 31 }, label: "invoice €950", animated: true, id: "ap-a" }),
    ledger({
      x: 60, y: 70, w: 200,
      rows: [
        { dr: "€950", account: "5200 COGS", cr: "" },
        { dr: "", account: "2100 AP", cr: "€950" },
      ],
    }),
    `<text x="160" y="170" text-anchor="middle" font-family="var(--ff-sans)" font-size="10" fill="var(--ink-3)">AP rises · owed, not paid</text>`,
  ],
});
```

- [ ] **Step 10: Create `accounts-receivable.js`**

```js
import { scene, node, arrow, ledger } from "/js/glossary/animations/primitives.js";

export default () => scene({
  title: "Accounts Receivable",
  desc: "Money owed to the business by customers. A current asset that turns into cash when the customer pays.",
  children: [
    node({ id: "business", x: 8, y: 16, w: 80, h: 30, label: "Business" }),
    node({ id: "customer", x: 230, y: 16, w: 80, h: 30, label: "Customer" }),
    arrow({ from: { x: 88, y: 31 }, to: { x: 230, y: 31 }, label: "invoice €950", animated: true, id: "ar-a" }),
    ledger({
      x: 60, y: 70, w: 200,
      rows: [
        { dr: "€950", account: "1200 AR", cr: "" },
        { dr: "", account: "4000 Revenue", cr: "€950" },
      ],
    }),
    `<text x="160" y="170" text-anchor="middle" font-family="var(--ff-sans)" font-size="10" fill="var(--ink-3)">AR rises · earned, not collected</text>`,
  ],
});
```

- [ ] **Step 11: Create `expense-code.js`**

```js
import { scene, node, stack } from "/js/glossary/animations/primitives.js";

export default () => scene({
  title: "Expense Code",
  desc: "An invoice gets coded to a specific GL account so it shows up in the right place on reports.",
  children: [
    node({ id: "invoice", x: 8, y: 80, w: 80, h: 36, label: "Invoice", sub: "€950" }),
    `<path d="M 88 98 L 150 98" stroke="var(--ink-2)" stroke-width="1.5" marker-end="url(#arrowhead)"/>`,
    `<text x="119" y="92" text-anchor="middle" font-family="var(--ff-mono)" font-size="9" fill="var(--ink-3)">code?</text>`,
    stack({
      x: 160, y: 32, w: 150,
      items: [
        { label: "5200 · COGS", color: "var(--teal-tint)" },
        { label: "6200 · Software" },
        { label: "6400 · Marketing" },
        { label: "6500 · Travel" },
        { label: "7100 · Office" },
        { label: "7300 · Legal" },
        { label: "7400 · R&D" },
        { label: "8000 · Interest" },
      ],
    }),
    `<rect x="160" y="32" width="150" height="14" fill="none" stroke="var(--teal)" stroke-width="2" rx="3">
       <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
     </rect>`,
  ],
});
```

- [ ] **Step 12: Register all 11 animations**

Append to `js/glossary/animations/registry.js`:

```js
registerAll([
  ["payment-gateway",    () => import("/js/glossary/animations/payment-gateway.js")],
  ["payment-processor",  () => import("/js/glossary/animations/payment-processor.js")],
  ["payment-provider",   () => import("/js/glossary/animations/payment-provider.js")],
  ["acquirer",           () => import("/js/glossary/animations/acquirer.js")],
  ["ach",                () => import("/js/glossary/animations/ach.js")],
  ["swift",              () => import("/js/glossary/animations/swift.js")],
  ["payfac",             () => import("/js/glossary/animations/payfac.js")],
  ["pay-in",             () => import("/js/glossary/animations/pay-in.js")],
  ["accounts-payable",   () => import("/js/glossary/animations/accounts-payable.js")],
  ["accounts-receivable",() => import("/js/glossary/animations/accounts-receivable.js")],
  ["expense-code",       () => import("/js/glossary/animations/expense-code.js")],
]);
```

- [ ] **Step 13: Verify all 11 in browser**

Expand each of the 11 priority terms. Expected: each renders a bespoke SVG with the described animation. Non-priority terms still show the 🪙 fallback. No console errors.

Checklist — open each and visually confirm the scene renders:
- [ ] payment-gateway (card # → token)
- [ ] payment-processor (2 arrows + decision)
- [ ] payment-provider (merchant → PSP → 4 rails)
- [ ] acquirer (network → acquirer → merchant, fee text)
- [ ] ach (batch stack → ACH → banks)
- [ ] swift (Chase → globe → HDFC)
- [ ] payfac (PayFac fans out to 4 shops, settles to acquirer)
- [ ] pay-in (customer → platform arrow)
- [ ] accounts-payable (invoice + AP ledger)
- [ ] accounts-receivable (invoice + AR ledger)
- [ ] expense-code (invoice → one of 8 codes highlighted)

- [ ] **Step 14: Commit**

```bash
git add js/glossary/animations/
git commit -m "feat: 11 priority term animations"
```

---

## Task 11: Ship animations for non-priority terms (20 scenes)

**Goal:** Add animated SVGs for 20 more terms whose scenes compose naturally from primitives. The remaining 19 keep the coin fallback.

**Files (all new):**
Each file follows the pattern from Task 10. Keep each file under ~25 lines.

### Terms to animate in this task (grouped by domain)

**Rails & Networks (9 of 10 remaining):** card-network, interchange, faster-payments, sepa-instant, rtp, wire-transfer, iso-20022, correspondent-banking, settlement

**Merchant Stack (5 of 7 remaining):** issuer, tokenization, 3ds-sca, merchant-of-record, pay-out

**Accounting (3 of 9 remaining):** general-ledger, journal-entry, double-entry

**Compliance (2 of 7):** kyc, sanctions-screening

**Treasury & FX (1 of 8):** mid-market-rate

- [ ] **Step 1: Create `card-network.js`**

```js
import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Card Network",
  desc: "Visa / Mastercard route the authorisation between the merchant's acquirer and the cardholder's issuer.",
  children: [
    node({ id: "acq", x: 8, y: 80, w: 70, h: 40, label: "Acquirer" }),
    node({ id: "net", x: 125, y: 80, w: 80, h: 40, label: "Card Network", sub: "Visa", color: "teal" }),
    node({ id: "iss", x: 242, y: 80, w: 70, h: 40, label: "Issuer" }),
    arrow({ from: { x: 78, y: 100 }, to: { x: 125, y: 100 }, animated: true, id: "cn-a" }),
    arrow({ from: { x: 205, y: 100 }, to: { x: 242, y: 100 }, animated: true, id: "cn-b" }),
  ],
});
```

- [ ] **Step 2: Create `interchange.js`**

```js
import { scene, node, arrow, feeBadge } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Interchange",
  desc: "A small fee drops off the payment and flows from acquirer to issuer.",
  children: [
    node({ id: "acq", x: 8, y: 80, w: 80, h: 40, label: "Acquirer" }),
    node({ id: "iss", x: 232, y: 80, w: 80, h: 40, label: "Issuer", color: "teal" }),
    arrow({ from: { x: 88, y: 100 }, to: { x: 232, y: 100 }, label: "£6.50 auth", id: "ix-a" }),
    feeBadge({ from: { x: 88, y: 100 }, to: { x: 232, y: 100 }, detachAt: 0.5, amount: "£0.02", settleY: 160 }),
    `<text x="160" y="180" text-anchor="middle" font-family="var(--ff-mono)" font-size="9" fill="var(--ink-3)">interchange ≈ 0.2%</text>`,
  ],
});
```

- [ ] **Step 3: Create `faster-payments.js`**

```js
import { scene, node, arrow, timer } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Faster Payments (UK)",
  desc: "UK rail moving GBP bank-to-bank in seconds, 24/7.",
  children: [
    node({ id: "from", x: 8, y: 80, w: 70, h: 40, label: "Barclays" }),
    node({ id: "rail", x: 125, y: 80, w: 80, h: 40, label: "Faster Pay", sub: "UK", color: "teal" }),
    node({ id: "to", x: 242, y: 80, w: 70, h: 40, label: "Wise GBP" }),
    arrow({ from: { x: 78, y: 100 }, to: { x: 125, y: 100 }, animated: true, id: "fp-a" }),
    arrow({ from: { x: 205, y: 100 }, to: { x: 242, y: 100 }, animated: true, id: "fp-b" }),
    timer({ x: 160, y: 165, label: "~15 sec" }),
  ],
});
```

- [ ] **Step 4: Create `sepa-instant.js`**

```js
import { scene, node, arrow, timer } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "SEPA Instant",
  desc: "Eurozone instant bank transfer. Under 10 seconds, any time.",
  children: [
    node({ id: "from", x: 8, y: 80, w: 80, h: 40, label: "Wise EUR" }),
    node({ id: "rail", x: 125, y: 80, w: 80, h: 40, label: "SEPA Instant", color: "teal" }),
    node({ id: "to", x: 232, y: 80, w: 80, h: 40, label: "Deutsche Bank" }),
    arrow({ from: { x: 88, y: 100 }, to: { x: 125, y: 100 }, animated: true, id: "si-a" }),
    arrow({ from: { x: 205, y: 100 }, to: { x: 232, y: 100 }, animated: true, id: "si-b" }),
    timer({ x: 160, y: 165, label: "< 10 sec" }),
  ],
});
```

- [ ] **Step 5: Create `rtp.js`**

```js
import { scene, node, arrow, timer } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "RTP (US)",
  desc: "USA instant bank rail from The Clearing House. 24/7, real-time.",
  children: [
    node({ id: "from", x: 8, y: 80, w: 80, h: 40, label: "Platform" }),
    node({ id: "rail", x: 125, y: 80, w: 80, h: 40, label: "RTP", sub: "TCH", color: "teal" }),
    node({ id: "to", x: 232, y: 80, w: 80, h: 40, label: "BofA" }),
    arrow({ from: { x: 88, y: 100 }, to: { x: 125, y: 100 }, animated: true, id: "rtp-a" }),
    arrow({ from: { x: 205, y: 100 }, to: { x: 232, y: 100 }, animated: true, id: "rtp-b" }),
    timer({ x: 160, y: 165, label: "< 10 sec" }),
  ],
});
```

- [ ] **Step 6: Create `wire-transfer.js`**

```js
import { scene, node, arrow, mark } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Wire Transfer",
  desc: "High-value, same-day, usually irrevocable bank-to-bank transfer.",
  children: [
    node({ id: "buyer", x: 8, y: 80, w: 80, h: 40, label: "Buyer", sub: "£420k" }),
    node({ id: "wire", x: 125, y: 80, w: 80, h: 40, label: "CHAPS / Fedwire", color: "teal" }),
    node({ id: "seller", x: 232, y: 80, w: 80, h: 40, label: "Seller" }),
    arrow({ from: { x: 88, y: 100 }, to: { x: 125, y: 100 }, animated: true, id: "wt-a" }),
    arrow({ from: { x: 205, y: 100 }, to: { x: 232, y: 100 }, animated: true, id: "wt-b" }),
    mark({ x: 160, y: 160, type: "x" }),
    `<text x="180" y="164" font-family="var(--ff-sans)" font-size="10" fill="var(--ink-3)">no reversal</text>`,
  ],
});
```

- [ ] **Step 7: Create `iso-20022.js`**

```js
import { scene, node, arrow, stack } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "ISO 20022",
  desc: "Modern structured XML format carrying rich data alongside each payment.",
  children: [
    node({ id: "from", x: 8, y: 80, w: 70, h: 40, label: "Bank A" }),
    node({ id: "to", x: 242, y: 80, w: 70, h: 40, label: "Bank B" }),
    arrow({ from: { x: 78, y: 100 }, to: { x: 242, y: 100 }, label: "€950 + metadata", animated: true, id: "iso-a" }),
    stack({
      x: 110, y: 130, w: 110,
      items: [
        { label: "amount · €950" },
        { label: "purpose · INV" },
        { label: "ref · INV-2026-04" },
        { label: "debtor · full addr" },
      ],
    }),
  ],
});
```

- [ ] **Step 8: Create `correspondent-banking.js`**

```js
import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Correspondent Banking",
  desc: "Cross-border payments hop through intermediary banks. Each hop adds fees and time.",
  children: [
    node({ id: "a", x: 4, y: 80, w: 60, h: 40, label: "Miami" }),
    node({ id: "b", x: 90, y: 80, w: 60, h: 40, label: "JPM NY", color: "amber" }),
    node({ id: "c", x: 176, y: 80, w: 60, h: 40, label: "StanChart", sub: "SG", color: "amber" }),
    node({ id: "d", x: 262, y: 80, w: 54, h: 40, label: "ID bank" }),
    arrow({ from: { x: 64, y: 100 }, to: { x: 90, y: 100 }, animated: true, id: "cb-a" }),
    arrow({ from: { x: 150, y: 100 }, to: { x: 176, y: 100 }, animated: true, id: "cb-b" }),
    arrow({ from: { x: 236, y: 100 }, to: { x: 262, y: 100 }, animated: true, id: "cb-c" }),
    `<text x="160" y="170" text-anchor="middle" font-family="var(--ff-sans)" font-size="10" fill="var(--ink-3)">3 hops · 3 fees · 2 days</text>`,
  ],
});
```

- [ ] **Step 9: Create `settlement.js`**

```js
import { scene, node, arrow, timer } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Settlement",
  desc: "Authorisation is a promise; settlement is the money actually moving, often days later.",
  children: [
    node({ id: "auth", x: 8, y: 30, w: 100, h: 40, label: "Auth", sub: "£6.50 · 8:02am", color: "teal" }),
    node({ id: "settle", x: 212, y: 120, w: 100, h: 40, label: "Settlement", sub: "£6.43 · T+2", color: "amber" }),
    arrow({ from: { x: 58, y: 70 }, to: { x: 262, y: 120 }, dashed: true, id: "st-a" }),
    timer({ x: 160, y: 90, label: "48 hrs" }),
  ],
});
```

- [ ] **Step 10: Create `issuer.js`**

```js
import { scene, node, arrow, mark } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Issuer",
  desc: "Cardholder's bank. Approves or declines each card transaction based on balance and fraud checks.",
  children: [
    node({ id: "network", x: 8, y: 80, w: 80, h: 40, label: "Network" }),
    node({ id: "issuer", x: 125, y: 80, w: 80, h: 40, label: "Issuer", sub: "Lloyds", color: "teal" }),
    node({ id: "holder", x: 242, y: 80, w: 70, h: 40, label: "Holder" }),
    arrow({ from: { x: 88, y: 100 }, to: { x: 125, y: 100 }, label: "auth?", animated: true, id: "is-a" }),
    arrow({ from: { x: 205, y: 100 }, to: { x: 242, y: 100 }, dashed: true, id: "is-b" }),
    arrow({ from: { x: 165, y: 120 }, to: { x: 88, y: 120 }, label: "APPROVED", color: "var(--green)", id: "is-c" }),
    mark({ x: 60, y: 40, type: "check", r: 8 }),
  ],
});
```

- [ ] **Step 11: Create `tokenization.js`**

```js
import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Tokenization",
  desc: "Real card number is swapped for a random token that's useless if stolen.",
  children: [
    `<text x="30" y="50" font-family="var(--ff-mono)" font-size="12" fill="var(--ink)">4242 4242 4242 4242</text>`,
    node({ id: "vault", x: 120, y: 80, w: 80, h: 40, label: "Vault", color: "teal" }),
    arrow({ from: { x: 160, y: 60 }, to: { x: 160, y: 80 }, id: "tk-a" }),
    arrow({ from: { x: 160, y: 120 }, to: { x: 160, y: 155 }, animated: true, id: "tk-b" }),
    `<text x="160" y="175" text-anchor="middle" font-family="var(--ff-mono)" font-size="12" fill="var(--teal)">tok_1NX8…QpVd</text>`,
  ],
});
```

- [ ] **Step 12: Create `3ds-sca.js`**

```js
import { scene, node, arrow, mark } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "3DS / SCA",
  desc: "Shopper gets a push from their bank app to approve a payment. Liability shifts to the issuer.",
  children: [
    node({ id: "checkout", x: 8, y: 80, w: 80, h: 40, label: "Checkout" }),
    node({ id: "bank", x: 125, y: 80, w: 80, h: 40, label: "Bank app", color: "teal" }),
    node({ id: "approve", x: 242, y: 80, w: 70, h: 40, label: "APPROVED" }),
    arrow({ from: { x: 88, y: 100 }, to: { x: 125, y: 100 }, label: "verify?", animated: true, id: "ds-a" }),
    arrow({ from: { x: 205, y: 100 }, to: { x: 242, y: 100 }, animated: true, id: "ds-b" }),
    mark({ x: 165, y: 155, type: "check" }),
    `<text x="180" y="159" font-family="var(--ff-sans)" font-size="10" fill="var(--ink-3)">liability → issuer</text>`,
  ],
});
```

- [ ] **Step 13: Create `merchant-of-record.js`**

```js
import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Merchant of Record",
  desc: "The platform acts as legal seller: handles tax, refunds, chargebacks on behalf of the real creator.",
  children: [
    node({ id: "dev", x: 8, y: 80, w: 70, h: 40, label: "Dev" }),
    node({ id: "mor", x: 115, y: 80, w: 90, h: 40, label: "Paddle", sub: "MoR", color: "teal" }),
    node({ id: "buyer", x: 242, y: 80, w: 70, h: 40, label: "Buyer" }),
    arrow({ from: { x: 78, y: 100 }, to: { x: 115, y: 100 }, dashed: true, id: "mor-a" }),
    arrow({ from: { x: 205, y: 100 }, to: { x: 242, y: 100 }, label: "receipt", animated: true, id: "mor-b" }),
    `<text x="160" y="165" text-anchor="middle" font-family="var(--ff-mono)" font-size="10" fill="var(--ink-3)">VAT · refunds · chargebacks</text>`,
  ],
});
```

- [ ] **Step 14: Create `pay-out.js`**

```js
import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Pay-Out",
  desc: "Money leaving the payment platform to a beneficiary via ACH, SEPA, or wire.",
  children: [
    node({ id: "platform", x: 8, y: 80, w: 90, h: 40, label: "Platform", sub: "PSP", color: "teal" }),
    node({ id: "beneficiary", x: 232, y: 80, w: 80, h: 40, label: "Beneficiary", sub: "bank" }),
    arrow({ from: { x: 98, y: 100 }, to: { x: 232, y: 100 }, label: "€950", animated: true, id: "po-a" }),
    `<text x="160" y="50" text-anchor="middle" font-family="var(--ff-sans)" font-size="11" font-weight="600" fill="var(--ink-3)">PAY-OUT</text>`,
    `<text x="160" y="160" text-anchor="middle" font-family="var(--ff-mono)" font-size="10" fill="var(--ink-3)">SEPA Instant · ~8s</text>`,
  ],
});
```

- [ ] **Step 15: Create `general-ledger.js`**

```js
import { scene, ledger, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "General Ledger",
  desc: "Every journal entry flows into the GL, the master record of the business.",
  children: [
    `<text x="40" y="30" font-family="var(--ff-mono)" font-size="10" fill="var(--ink-3)">entry 1</text>`,
    `<text x="40" y="60" font-family="var(--ff-mono)" font-size="10" fill="var(--ink-3)">entry 2</text>`,
    `<text x="40" y="90" font-family="var(--ff-mono)" font-size="10" fill="var(--ink-3)">entry 3</text>`,
    arrow({ from: { x: 80, y: 60 }, to: { x: 140, y: 90 }, animated: true, id: "gl-a" }),
    ledger({
      x: 150, y: 50, w: 160,
      rows: [
        { dr: "£6.50", account: "Cash", cr: "" },
        { dr: "", account: "Revenue", cr: "£6.50" },
        { dr: "€950", account: "AR", cr: "" },
      ],
    }),
  ],
});
```

- [ ] **Step 16: Create `journal-entry.js`**

```js
import { scene, ledger } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Journal Entry",
  desc: "A single balanced debit/credit pair recording one business event.",
  children: [
    ledger({
      x: 60, y: 60, w: 200,
      rows: [
        { dr: "€950", account: "5200 COGS", cr: "" },
        { dr: "", account: "2100 AP", cr: "€950" },
      ],
    }),
    `<text x="160" y="140" text-anchor="middle" font-family="var(--ff-sans)" font-size="11" font-weight="600" fill="var(--teal)">
       DR total = CR total ✓
     </text>`,
  ],
});
```

- [ ] **Step 17: Create `double-entry.js`**

```js
import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Double-Entry",
  desc: "Every event hits at least two accounts so total debits always equal total credits.",
  children: [
    node({ id: "cash", x: 30, y: 40, w: 100, h: 36, label: "Cash", sub: "+ £100", color: "teal" }),
    node({ id: "revenue", x: 190, y: 120, w: 100, h: 36, label: "Revenue", sub: "+ £100", color: "amber" }),
    arrow({ from: { x: 80, y: 76 }, to: { x: 240, y: 120 }, dashed: true, animated: true, id: "de-a" }),
    `<text x="160" y="185" text-anchor="middle" font-family="var(--ff-sans)" font-size="11" font-weight="600" fill="var(--ink-2)">
       DR = CR (always)
     </text>`,
  ],
});
```

- [ ] **Step 18: Create `kyc.js`**

```js
import { scene, node, arrow, mark } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "KYC",
  desc: "Identity verification: ID doc + selfie + address, matched against government records.",
  children: [
    node({ id: "doc", x: 8, y: 30, w: 80, h: 30, label: "Passport" }),
    node({ id: "selfie", x: 8, y: 80, w: 80, h: 30, label: "Selfie" }),
    node({ id: "addr", x: 8, y: 130, w: 80, h: 30, label: "Address" }),
    node({ id: "verify", x: 140, y: 80, w: 90, h: 40, label: "KYC check", color: "teal" }),
    arrow({ from: { x: 88, y: 45 }, to: { x: 140, y: 95 }, id: "ky-a" }),
    arrow({ from: { x: 88, y: 95 }, to: { x: 140, y: 100 }, animated: true, id: "ky-b" }),
    arrow({ from: { x: 88, y: 145 }, to: { x: 140, y: 105 }, id: "ky-c" }),
    mark({ x: 270, y: 100, type: "check" }),
  ],
});
```

- [ ] **Step 19: Create `sanctions-screening.js`**

```js
import { scene, node, arrow, mark } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Sanctions Screening",
  desc: "Every name in a transaction is checked against government watchlists before funds release.",
  children: [
    node({ id: "payment", x: 8, y: 80, w: 80, h: 40, label: "Payment", sub: "$50k wire" }),
    node({ id: "list", x: 125, y: 80, w: 80, h: 40, label: "OFAC / UN", sub: "watchlists", color: "amber" }),
    node({ id: "decision", x: 242, y: 80, w: 70, h: 40, label: "Release?" }),
    arrow({ from: { x: 88, y: 100 }, to: { x: 125, y: 100 }, animated: true, id: "ss-a" }),
    arrow({ from: { x: 205, y: 100 }, to: { x: 242, y: 100 }, id: "ss-b" }),
    mark({ x: 280, y: 40, type: "check", r: 8 }),
    mark({ x: 280, y: 160, type: "x", r: 8 }),
  ],
});
```

- [ ] **Step 20: Create `mid-market-rate.js`**

```js
import { scene } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Mid-Market Rate",
  desc: "The real exchange rate — the midpoint between bid and ask in the interbank FX market.",
  children: [
    `<line x1="30" y1="100" x2="290" y2="100" stroke="var(--line)" stroke-width="1"/>`,
    `<text x="40" y="60" font-family="var(--ff-mono)" font-size="11" fill="var(--ink)">Bid 1.1728</text>`,
    `<text x="240" y="60" font-family="var(--ff-mono)" font-size="11" fill="var(--ink)" text-anchor="end">Ask 1.1736</text>`,
    `<circle cx="160" cy="100" r="7" fill="var(--teal)">
       <animate attributeName="r" values="7;10;7" dur="2s" repeatCount="indefinite"/>
     </circle>`,
    `<text x="160" y="135" text-anchor="middle" font-family="var(--ff-mono)" font-size="12" font-weight="700" fill="var(--teal)">1.1732</text>`,
    `<text x="160" y="155" text-anchor="middle" font-family="var(--ff-sans)" font-size="10" fill="var(--ink-3)">mid-market</text>`,
  ],
});
```

- [ ] **Step 21: Register all 20 new animations**

Add to the existing `registerAll([...])` call in `js/glossary/animations/registry.js` (extend the array):

```js
  ["card-network",          () => import("/js/glossary/animations/card-network.js")],
  ["interchange",           () => import("/js/glossary/animations/interchange.js")],
  ["faster-payments",       () => import("/js/glossary/animations/faster-payments.js")],
  ["sepa-instant",          () => import("/js/glossary/animations/sepa-instant.js")],
  ["rtp",                   () => import("/js/glossary/animations/rtp.js")],
  ["wire-transfer",         () => import("/js/glossary/animations/wire-transfer.js")],
  ["iso-20022",             () => import("/js/glossary/animations/iso-20022.js")],
  ["correspondent-banking", () => import("/js/glossary/animations/correspondent-banking.js")],
  ["settlement",            () => import("/js/glossary/animations/settlement.js")],
  ["issuer",                () => import("/js/glossary/animations/issuer.js")],
  ["tokenization",          () => import("/js/glossary/animations/tokenization.js")],
  ["3ds-sca",               () => import("/js/glossary/animations/3ds-sca.js")],
  ["merchant-of-record",    () => import("/js/glossary/animations/merchant-of-record.js")],
  ["pay-out",               () => import("/js/glossary/animations/pay-out.js")],
  ["general-ledger",        () => import("/js/glossary/animations/general-ledger.js")],
  ["journal-entry",         () => import("/js/glossary/animations/journal-entry.js")],
  ["double-entry",          () => import("/js/glossary/animations/double-entry.js")],
  ["kyc",                   () => import("/js/glossary/animations/kyc.js")],
  ["sanctions-screening",   () => import("/js/glossary/animations/sanctions-screening.js")],
  ["mid-market-rate",       () => import("/js/glossary/animations/mid-market-rate.js")],
```

- [ ] **Step 22: Verify each of the 20 in browser**

Walk through each. Expected: each renders a visually distinct SVG scene. No console errors. Total animated terms now = 31 (11 priority + 20). Remaining 19 still show the coin fallback.

- [ ] **Step 23: Commit**

```bash
git add js/glossary/animations/
git commit -m "feat: 20 additional glossary animations (rails, merchant, accounting, compliance, FX)"
```

---

## Task 12: Static-frame animations for the remaining 19 terms

**Goal:** The last 19 terms (KYB, AML, PCI DSS, PSD2, Safeguarding, FX Spread, Nostro/Vostro, Float, Stablecoin Rails, Cross-Currency Netting, Cut-off Time, Treasury Reconciliation, Chart of Accounts, Accrual vs Cash, Clearing Account, Trial Balance, Reconciliation, Chargeback, Refund vs Reversal) get a small static SVG (no animation loop) so every card shows something visual. Keep files to ~12 lines each.

**Files (all new):** one per term under `js/glossary/animations/`.

- [ ] **Step 1: Create `kyb.js`**

```js
import { scene, node, arrow, mark } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "KYB",
  desc: "Business identity verification: Companies House + directors + beneficial owners.",
  children: [
    node({ id: "co", x: 125, y: 14, w: 80, h: 36, label: "Company", color: "teal" }),
    node({ id: "d1", x: 40, y: 80, w: 60, h: 36, label: "Director A" }),
    node({ id: "d2", x: 130, y: 80, w: 60, h: 36, label: "Director B" }),
    node({ id: "ubo", x: 220, y: 80, w: 80, h: 36, label: "UBO 30%+" }),
    arrow({ from: { x: 165, y: 50 }, to: { x: 70, y: 80 }, dashed: true, id: "kyb-a" }),
    arrow({ from: { x: 165, y: 50 }, to: { x: 160, y: 80 }, dashed: true, id: "kyb-b" }),
    arrow({ from: { x: 165, y: 50 }, to: { x: 260, y: 80 }, dashed: true, id: "kyb-c" }),
    mark({ x: 165, y: 150, type: "check" }),
  ],
});
```

- [ ] **Step 2: Create `aml.js`**

```js
import { scene, node, stack, mark } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "AML",
  desc: "Ongoing transaction monitoring flags suspicious patterns and files SARs.",
  children: [
    stack({
      x: 20, y: 30, w: 110,
      items: [
        { label: "£9,500 · Tue" },
        { label: "£9,500 · Wed" },
        { label: "£9,500 · Thu", color: "var(--amber-tint)" },
        { label: "£9,500 · Fri", color: "var(--amber-tint)" },
      ],
    }),
    node({ id: "monitor", x: 180, y: 80, w: 100, h: 40, label: "AML monitor", color: "amber" }),
    mark({ x: 235, y: 150, type: "x" }),
    `<text x="250" y="153" font-family="var(--ff-sans)" font-size="10" fill="var(--red)">SAR filed</text>`,
  ],
});
```

- [ ] **Step 3: Create `pci-dss.js`**

```js
import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "PCI DSS",
  desc: "Security standard for anyone touching card data. Tokenisation keeps most merchants in the easiest tier.",
  children: [
    node({ id: "shop", x: 8, y: 80, w: 80, h: 40, label: "Shop", sub: "no PAN" }),
    node({ id: "psp", x: 125, y: 80, w: 80, h: 40, label: "PSP", sub: "PCI Level 1", color: "teal" }),
    node({ id: "card", x: 242, y: 80, w: 70, h: 40, label: "Card data" }),
    arrow({ from: { x: 205, y: 100 }, to: { x: 242, y: 100 }, id: "pci-a" }),
    `<text x="48" y="160" text-anchor="middle" font-family="var(--ff-mono)" font-size="9" fill="var(--ink-3)">SAQ A (easy)</text>`,
  ],
});
```

- [ ] **Step 4: Create `psd2.js`**

```js
import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "PSD2 / Open Banking",
  desc: "EU/UK law: banks must expose APIs so third-party apps can read accounts and initiate payments with consent.",
  children: [
    node({ id: "app", x: 8, y: 80, w: 80, h: 40, label: "Budget app" }),
    node({ id: "api", x: 125, y: 80, w: 80, h: 40, label: "Bank API", color: "teal" }),
    node({ id: "bank", x: 242, y: 80, w: 70, h: 40, label: "Barclays" }),
    arrow({ from: { x: 88, y: 100 }, to: { x: 125, y: 100 }, label: "consent", id: "ps-a" }),
    arrow({ from: { x: 205, y: 100 }, to: { x: 242, y: 100 }, id: "ps-b" }),
  ],
});
```

- [ ] **Step 5: Create `safeguarding.js`**

```js
import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Safeguarding (UK)",
  desc: "UK rule: non-bank payment firms must ring-fence client funds in a segregated account at a bank.",
  children: [
    node({ id: "fintech", x: 8, y: 80, w: 80, h: 40, label: "Fintech", sub: "Wise" }),
    node({ id: "vault", x: 125, y: 80, w: 80, h: 40, label: "Ring-fenced", sub: "HSBC", color: "teal" }),
    node({ id: "cred", x: 242, y: 30, w: 70, h: 40, label: "Creditors" }),
    node({ id: "cust", x: 242, y: 130, w: 70, h: 40, label: "Customers" }),
    arrow({ from: { x: 88, y: 100 }, to: { x: 125, y: 100 }, id: "sf-a" }),
    arrow({ from: { x: 205, y: 90 }, to: { x: 242, y: 50 }, dashed: true, id: "sf-b" }),
    arrow({ from: { x: 205, y: 110 }, to: { x: 242, y: 150 }, id: "sf-c" }),
  ],
});
```

- [ ] **Step 6: Create `fx-spread.js`**

```js
import { scene } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "FX Spread",
  desc: "Markup a provider charges above the mid-market rate. Often hidden inside a 'zero fee' FX offer.",
  children: [
    `<line x1="30" y1="100" x2="290" y2="100" stroke="var(--line)" stroke-width="1"/>`,
    `<circle cx="130" cy="100" r="6" fill="var(--teal)"/>`,
    `<text x="130" y="80" text-anchor="middle" font-family="var(--ff-mono)" font-size="10" fill="var(--teal)">1.1732 mid</text>`,
    `<circle cx="220" cy="100" r="6" fill="var(--amber)"/>`,
    `<text x="220" y="80" text-anchor="middle" font-family="var(--ff-mono)" font-size="10" fill="var(--amber)">1.14 quoted</text>`,
    `<path d="M 130 130 L 220 130" stroke="var(--amber)" stroke-width="3"/>`,
    `<text x="175" y="155" text-anchor="middle" font-family="var(--ff-sans)" font-size="11" fill="var(--amber)">2.8% markup</text>`,
  ],
});
```

- [ ] **Step 7: Create `nostro-vostro.js`**

```js
import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Nostro / Vostro",
  desc: "Banks hold accounts with each other. 'Nostro' = ours with them, 'vostro' = yours with us. Same account, two views.",
  children: [
    node({ id: "hsbc", x: 8, y: 80, w: 90, h: 40, label: "HSBC London", sub: "nostro USD" }),
    node({ id: "jpm", x: 222, y: 80, w: 90, h: 40, label: "JPM NY", sub: "vostro GBP", color: "teal" }),
    arrow({ from: { x: 98, y: 95 }, to: { x: 222, y: 95 }, label: "debit $50k", id: "nv-a" }),
    arrow({ from: { x: 222, y: 110 }, to: { x: 98, y: 110 }, label: "credit £", id: "nv-b" }),
  ],
});
```

- [ ] **Step 8: Create `float.js`**

```js
import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Float / Pre-funding",
  desc: "PSP parks money in local accounts ahead of time so payouts feel instant.",
  children: [
    node({ id: "float", x: 8, y: 80, w: 90, h: 40, label: "€50m float", sub: "pre-funded", color: "teal" }),
    node({ id: "cust", x: 222, y: 80, w: 90, h: 40, label: "Customer", sub: "gets €950" }),
    arrow({ from: { x: 98, y: 100 }, to: { x: 222, y: 100 }, label: "instant", animated: true, id: "fl-a" }),
    `<text x="160" y="170" text-anchor="middle" font-family="var(--ff-sans)" font-size="10" fill="var(--ink-3)">GBP converts later, in batch</text>`,
  ],
});
```

- [ ] **Step 9: Create `stablecoin-rails.js`**

```js
import { scene, node, arrow, timer } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Stablecoin Rails",
  desc: "Fiat → stablecoin → on-chain transfer → off-ramp to fiat. Minutes instead of days.",
  children: [
    node({ id: "ngn", x: 4, y: 80, w: 60, h: 40, label: "NGN" }),
    node({ id: "mint", x: 78, y: 80, w: 60, h: 40, label: "mint USDC", color: "teal" }),
    node({ id: "send", x: 152, y: 80, w: 60, h: 40, label: "on-chain" }),
    node({ id: "burn", x: 226, y: 80, w: 86, h: 40, label: "off-ramp CNY", color: "teal" }),
    arrow({ from: { x: 64, y: 100 }, to: { x: 78, y: 100 }, id: "sc-a" }),
    arrow({ from: { x: 138, y: 100 }, to: { x: 152, y: 100 }, animated: true, id: "sc-b" }),
    arrow({ from: { x: 212, y: 100 }, to: { x: 226, y: 100 }, id: "sc-c" }),
    timer({ x: 160, y: 165, label: "~10 min" }),
  ],
});
```

- [ ] **Step 10: Create `cross-currency-netting.js`**

```js
import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Cross-Currency Netting",
  desc: "Offsetting flows cancel out. Only the net difference actually moves through rails.",
  children: [
    node({ id: "gbp", x: 8, y: 30, w: 110, h: 36, label: "GBP → EUR", sub: "£100m" }),
    node({ id: "eur", x: 8, y: 130, w: 110, h: 36, label: "EUR → GBP", sub: "€90m (=£77m)" }),
    node({ id: "net", x: 200, y: 80, w: 112, h: 40, label: "Net £23m", sub: "only this moves", color: "teal" }),
    arrow({ from: { x: 118, y: 48 }, to: { x: 200, y: 95 }, id: "cn-a" }),
    arrow({ from: { x: 118, y: 148 }, to: { x: 200, y: 105 }, id: "cn-b" }),
  ],
});
```

- [ ] **Step 11: Create `cut-off-time.js`**

```js
import { scene, node, timer, mark } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Cut-off Time",
  desc: "Daily deadline; miss it and the payment slides to the next business day.",
  children: [
    timer({ x: 80, y: 100, r: 32, label: "4:00pm ET" }),
    node({ id: "submitted", x: 180, y: 60, w: 120, h: 36, label: "Submitted 4:30pm" }),
    mark({ x: 200, y: 130, type: "x" }),
    `<text x="220" y="134" font-family="var(--ff-sans)" font-size="10" fill="var(--red)">missed → T+1</text>`,
  ],
});
```

- [ ] **Step 12: Create `treasury-reconciliation.js`**

```js
import { scene, node, arrow, mark } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Treasury Reconciliation",
  desc: "Daily match of internal ledger to every bank and rail statement. Breaks surface fast.",
  children: [
    node({ id: "gl", x: 8, y: 30, w: 110, h: 36, label: "GL £428,119.42" }),
    node({ id: "bank", x: 8, y: 130, w: 110, h: 36, label: "Bank £428,121.82" }),
    node({ id: "match", x: 200, y: 80, w: 110, h: 40, label: "Break £2.40", color: "amber" }),
    arrow({ from: { x: 118, y: 48 }, to: { x: 200, y: 95 }, id: "tr-a" }),
    arrow({ from: { x: 118, y: 148 }, to: { x: 200, y: 105 }, id: "tr-b" }),
    mark({ x: 255, y: 155, type: "x" }),
  ],
});
```

- [ ] **Step 13: Create `chart-of-accounts.js`**

```js
import { scene, stack } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Chart of Accounts",
  desc: "The indexed list of every category (expense code) the business uses.",
  children: [
    stack({
      x: 80, y: 20, w: 160,
      items: [
        { label: "1100 · Cash" },
        { label: "1200 · AR" },
        { label: "2100 · AP" },
        { label: "4000 · Revenue" },
        { label: "5200 · COGS" },
        { label: "6200 · Software" },
        { label: "7100 · Office" },
        { label: "8000 · Interest" },
        { label: "9000 · Tax" },
      ],
    }),
  ],
});
```

- [ ] **Step 14: Create `accrual-vs-cash.js`**

```js
import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Accrual vs Cash",
  desc: "Accrual records revenue when earned (March); cash records it when money moves (April).",
  children: [
    node({ id: "ship", x: 8, y: 50, w: 100, h: 36, label: "Ship · Mar 30", color: "teal" }),
    node({ id: "pay", x: 212, y: 50, w: 100, h: 36, label: "Pay · Apr 30", color: "amber" }),
    arrow({ from: { x: 108, y: 68 }, to: { x: 212, y: 68 }, dashed: true, id: "av-a" }),
    `<text x="58" y="120" text-anchor="middle" font-family="var(--ff-sans)" font-size="11" font-weight="600" fill="var(--teal)">Accrual: March</text>`,
    `<text x="262" y="120" text-anchor="middle" font-family="var(--ff-sans)" font-size="11" font-weight="600" fill="var(--amber)">Cash: April</text>`,
  ],
});
```

- [ ] **Step 15: Create `clearing-account.js`**

```js
import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Clearing Account",
  desc: "Temporary parking spot for money in transit. Reconciled and emptied regularly.",
  children: [
    node({ id: "rev", x: 8, y: 80, w: 80, h: 40, label: "Revenue" }),
    node({ id: "clear", x: 125, y: 80, w: 80, h: 40, label: "Stripe Clearing", sub: "temp", color: "amber" }),
    node({ id: "cash", x: 242, y: 80, w: 70, h: 40, label: "Cash" }),
    arrow({ from: { x: 88, y: 100 }, to: { x: 125, y: 100 }, label: "DR £120", id: "cl-a" }),
    arrow({ from: { x: 205, y: 100 }, to: { x: 242, y: 100 }, label: "CR £117", id: "cl-b" }),
  ],
});
```

- [ ] **Step 16: Create `trial-balance.js`**

```js
import { scene } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Trial Balance",
  desc: "Every account's balance grouped by debit and credit. The totals must match.",
  children: [
    `<text x="80" y="40" text-anchor="middle" font-family="var(--ff-sans)" font-size="11" font-weight="700" fill="var(--ink-3)">DR</text>`,
    `<text x="240" y="40" text-anchor="middle" font-family="var(--ff-sans)" font-size="11" font-weight="700" fill="var(--ink-3)">CR</text>`,
    `<text x="80" y="70" text-anchor="middle" font-family="var(--ff-mono)" font-size="11" fill="var(--ink)">£428,119.42</text>`,
    `<text x="240" y="70" text-anchor="middle" font-family="var(--ff-mono)" font-size="11" fill="var(--ink)">£428,119.42</text>`,
    `<line x1="20" y1="95" x2="300" y2="95" stroke="var(--line-soft)"/>`,
    `<text x="160" y="135" text-anchor="middle" font-family="var(--ff-sans)" font-size="14" font-weight="700" fill="var(--green)">✓ balanced</text>`,
  ],
});
```

- [ ] **Step 17: Create `reconciliation.js`**

```js
import { scene, node, arrow, mark } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Reconciliation",
  desc: "Match transactions across ledger, bank statement, and invoices. Duplicates and fraud show up here.",
  children: [
    node({ id: "ledger", x: 8, y: 30, w: 80, h: 30, label: "Ledger" }),
    node({ id: "bank", x: 8, y: 85, w: 80, h: 30, label: "Bank" }),
    node({ id: "inv", x: 8, y: 140, w: 80, h: 30, label: "Invoice" }),
    node({ id: "match", x: 180, y: 85, w: 90, h: 30, label: "Match engine", color: "teal" }),
    arrow({ from: { x: 88, y: 45 }, to: { x: 180, y: 95 }, id: "rc-a" }),
    arrow({ from: { x: 88, y: 100 }, to: { x: 180, y: 100 }, id: "rc-b" }),
    arrow({ from: { x: 88, y: 155 }, to: { x: 180, y: 110 }, id: "rc-c" }),
    mark({ x: 285, y: 100, type: "check" }),
  ],
});
```

- [ ] **Step 18: Create `chargeback.js`**

```js
import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Chargeback",
  desc: "Cardholder disputes; bank claws money back from the merchant. Merchant can contest with evidence.",
  children: [
    node({ id: "holder", x: 8, y: 80, w: 80, h: 40, label: "Cardholder" }),
    node({ id: "issuer", x: 125, y: 80, w: 80, h: 40, label: "Issuer", color: "amber" }),
    node({ id: "merchant", x: 242, y: 80, w: 70, h: 40, label: "Merchant" }),
    arrow({ from: { x: 88, y: 90 }, to: { x: 125, y: 90 }, label: "dispute", id: "cb-a" }),
    arrow({ from: { x: 205, y: 110 }, to: { x: 242, y: 110 }, label: "claw back £80+£15", color: "var(--red)", animated: true, id: "cb-b" }),
  ],
});
```

- [ ] **Step 19: Create `refund-vs-reversal.js`**

```js
import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Refund vs Reversal",
  desc: "Reversal cancels before settlement (as if it never happened). Refund is a new offsetting transaction after the fact.",
  children: [
    node({ id: "orig", x: 115, y: 16, w: 90, h: 32, label: "Original charge" }),
    node({ id: "rev", x: 8, y: 80, w: 120, h: 40, label: "Reversal", sub: "< 10 min · cancelled", color: "teal" }),
    node({ id: "ref", x: 192, y: 80, w: 120, h: 40, label: "Refund", sub: "later · new tx", color: "amber" }),
    arrow({ from: { x: 140, y: 48 }, to: { x: 68, y: 80 }, dashed: true, id: "rr-a" }),
    arrow({ from: { x: 180, y: 48 }, to: { x: 252, y: 80 }, id: "rr-b" }),
  ],
});
```

- [ ] **Step 20: Register all 19 final animations**

Extend the `registerAll([...])` array in `js/glossary/animations/registry.js`:

```js
  ["kyb",                      () => import("/js/glossary/animations/kyb.js")],
  ["aml",                      () => import("/js/glossary/animations/aml.js")],
  ["pci-dss",                  () => import("/js/glossary/animations/pci-dss.js")],
  ["psd2",                     () => import("/js/glossary/animations/psd2.js")],
  ["safeguarding",             () => import("/js/glossary/animations/safeguarding.js")],
  ["fx-spread",                () => import("/js/glossary/animations/fx-spread.js")],
  ["nostro-vostro",            () => import("/js/glossary/animations/nostro-vostro.js")],
  ["float",                    () => import("/js/glossary/animations/float.js")],
  ["stablecoin-rails",         () => import("/js/glossary/animations/stablecoin-rails.js")],
  ["cross-currency-netting",   () => import("/js/glossary/animations/cross-currency-netting.js")],
  ["cut-off-time",             () => import("/js/glossary/animations/cut-off-time.js")],
  ["treasury-reconciliation",  () => import("/js/glossary/animations/treasury-reconciliation.js")],
  ["chart-of-accounts",        () => import("/js/glossary/animations/chart-of-accounts.js")],
  ["accrual-vs-cash",          () => import("/js/glossary/animations/accrual-vs-cash.js")],
  ["clearing-account",         () => import("/js/glossary/animations/clearing-account.js")],
  ["trial-balance",            () => import("/js/glossary/animations/trial-balance.js")],
  ["reconciliation",           () => import("/js/glossary/animations/reconciliation.js")],
  ["chargeback",               () => import("/js/glossary/animations/chargeback.js")],
  ["refund-vs-reversal",       () => import("/js/glossary/animations/refund-vs-reversal.js")],
```

- [ ] **Step 21: Verify all 50**

Walk through every term. Expected: every single card now renders an SVG scene on expand (no more coin fallbacks). No console errors.

Counts to confirm:
- Total animation files in `js/glossary/animations/` (excluding `primitives.js` and `registry.js`): **50**
- Registry entries: **50**
- Fallback 🪙 visible anywhere: **0**

- [ ] **Step 22: Commit**

```bash
git add js/glossary/animations/
git commit -m "feat: final 19 glossary animations — all 50 terms covered"
```

---

## Task 13: Accessibility pass + reduced-motion verification

**Goal:** The page is keyboard-navigable, screen-reader-friendly, and respects `prefers-reduced-motion`.

**Files:**
- Modify: `css/glossary.css`
- Modify: `glossary.html`

- [ ] **Step 1: Verify keyboard navigation manually**

- Tab through the page from top. Expected order: nav links → search input → domain chips → each card `summary` in DOM order.
- Focus ring is visible on each (teal outline).
- Enter / Space on a card summary toggles it open.
- Inside an open card, Tab reaches "Don't confuse with" chips and the "See it live" link.
- `/` focuses the search. `Esc` clears it.

Fix any focus issues by adding to `css/glossary.css` (append):

```css
.gl-card-summary:focus-visible,
.gl-chip:focus-visible,
.gl-see-live:focus-visible,
.gl-dchip:focus-visible,
.gl-navlink:focus-visible {
  outline: 2px solid var(--teal);
  outline-offset: 2px;
}
```

- [ ] **Step 2: Verify reduced motion**

In the browser devtools, set `prefers-reduced-motion: reduce` (Rendering panel → Emulate CSS media feature).
Expected:
- No arrow pulses.
- No rotating timer hands.
- No fee badges sliding.
- SVGs show their final static state (all elements visible).
- Card pulse on hash-link doesn't play.

If any animation still loops, identify the offending `<animate>` or `<animateTransform>` tag in the corresponding term file and ensure the CSS rule in `css/glossary.css` (`@media (prefers-reduced-motion: reduce)`) is catching them. The rule added in Task 8 Step 2 should handle this globally.

- [ ] **Step 3: Run Lighthouse audit**

Open Chrome devtools → Lighthouse panel → check "Accessibility" only → run on `/glossary.html`. Expected: ≥ 95. Fix any flagged issues (usually color contrast or missing labels).

- [ ] **Step 4: Commit**

```bash
git add css/glossary.css
git commit -m "a11y: focus rings + reduced-motion verification for glossary"
```

---

## Task 14: Responsive QA + final polish

**Goal:** Page looks correct at 375px, 768px, and 1280px viewports.

**Files:**
- Modify: `css/glossary.css` (only if issues found)

- [ ] **Step 1: Test at 375px (mobile)**

Open devtools → device toolbar → iPhone SE (375 × 667). Expected:
- Hero title wraps cleanly at `fs-28`.
- Header nav doesn't overflow; "Flows" and "Glossary" links stay on one line.
- Sticky bar domain chips scroll horizontally (not wrap).
- Card summary and body stack (animation on top, text below).
- All 50 cards are readable; nothing overflows.
- Scrolling performance is smooth; no jank on expand.

Fix any issues by tightening the existing `@media (max-width: 600px)` blocks in `css/glossary.css`.

- [ ] **Step 2: Test at 768px (tablet)**

Breakpoint between mobile and desktop.
- Body grid switches at 720px to single-column — verify the transition feels right.
- Sticky bar still readable; chips wrap onto two rows if needed.

- [ ] **Step 3: Test at 1280px (desktop)**

- Max-width of `.glossary` caps the content at 960px centred.
- Hero heading is `fs-36`.
- Two-column body grid (animation left, text right).
- No horizontal scroll.

- [ ] **Step 4: Navigate from main site and back**

- Start at `/index.html`. Click "Glossary ↗" in the topbar. Expected: navigates to glossary, aria-current on Glossary nav link.
- Click a "See it live →" button in any term. Expected: arrives at the flow explorer on the correct flow + step, with that term's node highlighted (existing router handles this).
- In glossary, click "Flows" in the header. Expected: back on `/index.html`.

- [ ] **Step 5: End-to-end smoke test checklist**

Run through every checkbox:
- [ ] `/glossary.html` loads without console errors
- [ ] 6 domain sections render in order (Rails, Merchant, Accounting, Compliance, Treasury/FX, Ops)
- [ ] All 50 cards render closed by default
- [ ] Every card's expanded body has: animation + "What it is" + "How to spot it" + chips (if applicable) + "See it live"
- [ ] All 50 animations render on expand (no coin fallback)
- [ ] Priority 11 (payment-processor, payment-provider, payment-gateway, acquirer, ach, swift, payfac, pay-in, accounts-payable, accounts-receivable, expense-code) all play looping animations
- [ ] Search filters by name / alias / domain substring
- [ ] Domain chips filter + combine with search
- [ ] Empty state appears for zero matches with working reset
- [ ] `/` focuses search; `Cmd/Ctrl+K` focuses search; `Esc` clears
- [ ] Hash deep-link (e.g., `/glossary.html#acquirer`) auto-opens + scrolls + pulses
- [ ] "Don't confuse with" chip jumps open the target card
- [ ] "See it live" deep-links to correct flow + step on `/index.html`
- [ ] Main site topbar has working "Glossary ↗" link
- [ ] `prefers-reduced-motion` disables all animation loops
- [ ] Works on 375px / 768px / 1280px viewports
- [ ] No console errors or 404s in the Network panel

- [ ] **Step 6: Commit final polish**

```bash
git add -A
git commit -m "style: responsive polish for glossary + final QA"
```

---

## Task 15: Update project README + deploy

**Files:**
- Modify: `README.md`
- Run: `npx vercel` (if user asks for deploy)

- [ ] **Step 1: Add a "Glossary" section to `README.md`**

After the existing description, add a short section:

```markdown
## Glossary page

A companion page at `/glossary.html` teaches all 50 terms as a single-column accordion with bespoke animated SVGs, plain-English copy, and deep links into the flow explorer. Start here if the flows feel opaque.

- Grouped by domain, sticky search + filter bar
- Every term has an animation built from a small library of SVG primitives (`js/glossary/animations/primitives.js`)
- Plain-English copy lives in `data/glossary.json`
- Hash links supported: `/glossary.html#acquirer` auto-opens the Acquirer card
```

- [ ] **Step 2: Verify git status is clean**

```bash
git status
```
Expected: `nothing to commit, working tree clean`.

- [ ] **Step 3: Commit README**

```bash
git add README.md
git commit -m "docs: add glossary section to README"
```

- [ ] **Step 4: Deploy (when user approves)**

Ask the user before running: "Ready to deploy? I'll run `npx vercel --prod` from the project root."

If approved, run from the project root:
```bash
npx vercel --prod
```

Expected: deploy succeeds; new URL visible in output. Visit `{deploy-url}/glossary.html` and run through a quick smoke test.

---

## Self-review notes

- **Spec coverage:** every section of the spec maps to a task — layout (1, 4, 5), card structure (5), animations (8–12), search/filter (7), deep linking (6), accessibility (13), responsive (14), data model (3), nav between pages (2).
- **Priority-11 animations:** all 11 named in the spec are implemented in Task 10.
- **Non-priority animations:** covered across Tasks 11 (20 animated) + 12 (19 static-frame). Final coverage: all 50 terms show a visual.
- **Type consistency:** primitive signatures used consistently across all animation files. `scene({children:[...]})`, `node({x,y,w,h,label,...})`, `arrow({from:{x,y}, to:{x,y}, ...})`.
- **Placeholders:** none. Every "implement this" has actual code.
- **No tests in plan:** project has no test infrastructure; verification is manual browser checks at each step.
