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
