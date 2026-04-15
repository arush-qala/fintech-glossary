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
  const parts = pathPart.split("/").filter(Boolean);
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
