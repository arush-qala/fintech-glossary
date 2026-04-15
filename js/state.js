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
