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
