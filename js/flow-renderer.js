import * as state from "/js/state.js";

const NS = "http://www.w3.org/2000/svg";
const VIEWBOX = "0 0 640 260";

export function init(root) {
  render(root);
  state.subscribe(
    ["activeFlowId", "stepIndex", "selectedTermId", "domainFilter", "terms"],
    () => render(root)
  );
  root.addEventListener("click", e => {
    const g = e.target.closest("g[data-term]");
    if (g) state.set({ selectedTermId: g.dataset.term });
  });
  root.addEventListener("keydown", e => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const g = e.target.closest("g[data-term]");
    if (g) { e.preventDefault(); state.set({ selectedTermId: g.dataset.term }); }
  });
}

function render(root) {
  const s = state.get();
  const flow = state.activeFlow();
  if (!flow) { root.innerHTML = ""; return; }

  const doneIds = new Set(flow.steps.slice(0, s.stepIndex).map(st => st.termId));
  const activeId = flow.steps[s.stepIndex]?.termId;
  const selectedId = state.currentTermId();

  const nodesSvg = flow.layout.map(n => {
    const isDone = doneIds.has(n.termId) && n.termId !== activeId;
    const isActive = n.termId === activeId;
    const isSelected = n.termId === selectedId;
    const term = s.termsById.get(n.termId);
    const dim =
      s.domainFilter !== "all" && term && term.domain !== s.domainFilter;

    const cls = [
      "node",
      isDone ? "done" : "",
      isActive ? "active" : "",
      isSelected ? "selected" : "",
      dim ? "dim" : ""
    ].filter(Boolean).join(" ");

    const cx = n.x + n.w / 2;
    return `
      <g class="${cls}" data-term="${n.termId}" tabindex="0" role="button" aria-label="${n.label}">
        <rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="6"></rect>
        <text x="${cx}" y="${n.y + 20}">${escapeXml(n.label)}</text>
        <text class="tlabel" x="${cx}" y="${n.y + 34}">${escapeXml(n.sublabel || "")}</text>
      </g>`;
  }).join("");

  const layoutByTerm = Object.fromEntries(flow.layout.map(n => [n.termId, n]));
  const edgesSvg = flow.edges.map(e => {
    const a = layoutByTerm[e.from], b = layoutByTerm[e.to];
    if (!a || !b) return "";
    const fromEdge = edgePoint(a, b);
    const toEdge = edgePoint(b, a);
    const isDone = doneIds.has(e.to) && e.to !== activeId;
    const isActive = e.to === activeId;
    const cls = ["edge", isDone ? "done" : "", isActive ? "active" : ""].filter(Boolean).join(" ");
    const markerId = isActive ? "arrA" : isDone ? "arrD" : "arrN";
    return `<path class="${cls}" d="${curve(fromEdge, toEdge)}" marker-end="url(#${markerId})"></path>`;
  }).join("");

  root.innerHTML = `
    <h2>${escapeXml(flow.title)}</h2>
    <div class="scenario">${escapeXml(flow.scenario)}</div>
    ${renderStepBar(flow, s.stepIndex)}
    <svg viewBox="${VIEWBOX}" role="group" aria-label="Flow diagram">
      <defs>
        <marker id="arrN" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#cbd5e1"/></marker>
        <marker id="arrD" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#10b981"/></marker>
        <marker id="arrA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#d97706"/></marker>
      </defs>
      ${edgesSvg}
      ${nodesSvg}
    </svg>
  `;
}

function renderStepBar(flow, stepIdx) {
  const total = flow.steps.length;
  const current = flow.steps[stepIdx];
  const term = state.get().termsById.get(current.termId);
  const summary = term ? term.name : current.termId.replace(/^pseudo-/, "").replace(/-/g, " ");
  return `
    <div class="stepbar">
      <span>Step <b>${stepIdx + 1} / ${total}</b> · ${escapeXml(summary)}</span>
      <div class="ctrl">
        <button data-step="prev" ${stepIdx === 0 ? "disabled" : ""}>← Back</button>
        <button data-step="next" ${stepIdx === total - 1 ? "disabled" : ""}>Next →</button>
      </div>
    </div>
  `;
}

function edgePoint(from, to) {
  const fx = from.x + from.w / 2, fy = from.y + from.h / 2;
  const tx = to.x + to.w / 2,     ty = to.y + to.h / 2;
  const dx = tx - fx, dy = ty - fy;
  const halfW = from.w / 2, halfH = from.h / 2;
  const scale = Math.min(halfW / Math.max(Math.abs(dx), 1), halfH / Math.max(Math.abs(dy), 1));
  return { x: fx + dx * scale, y: fy + dy * scale };
}

function curve(a, b) {
  const mx = (a.x + b.x) / 2;
  return `M${a.x},${a.y} C${mx},${a.y} ${mx},${b.y} ${b.x},${b.y}`;
}

function escapeXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
