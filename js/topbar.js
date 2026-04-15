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
