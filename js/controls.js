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
