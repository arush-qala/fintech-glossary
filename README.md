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
- `data/glossary.json` — plain-English "what it is" copy per term (used by the glossary page).

See `DESIGN_SPEC.md` for the full design rationale.

## Glossary page

A companion page at `/glossary.html` teaches all 50 terms as a single-column accordion with bespoke animated SVGs, plain-English copy, and deep links into the flow explorer. Start here if the flows feel opaque.

- Grouped by domain, sticky search + filter bar
- Every term has a scene built from a small library of SVG primitives (`js/glossary/animations/primitives.js`)
- Plain-English copy lives in `data/glossary.json`
- Hash links supported: `/glossary.html#acquirer` auto-opens the Acquirer card
- Each term's "See it live →" button deep-links to the matching flow + step on the main page
