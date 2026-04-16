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
  const override = context.glossaryById.get(term.id)?.seeItLive;
  if (override && context.flowsById.get(override.flow)) {
    const flow = context.flowsById.get(override.flow);
    return { flowId: override.flow, step: override.step, flowLabel: shortFlow(flow.title) };
  }
  for (const flowId of term.flows || []) {
    const flow = context.flowsById.get(flowId);
    if (!flow) continue;
    const stepIdx = flow.steps.findIndex(s => s.termId === term.id);
    if (stepIdx >= 0) {
      return { flowId, step: stepIdx, flowLabel: shortFlow(flow.title) };
    }
  }
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
