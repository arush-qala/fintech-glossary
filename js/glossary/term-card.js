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
