import * as state from "/js/state.js";

export const DOMAINS = [
  { id: "all",            label: "All",                short: "All" },
  { id: "rails",          label: "Rails & Networks",   short: "Rails" },
  { id: "merchant-stack", label: "Merchant Stack",     short: "Merchant" },
  { id: "accounting",     label: "Accounting",         short: "Acct" },
  { id: "compliance",     label: "Compliance",         short: "Compliance" },
  { id: "treasury-fx",    label: "Treasury & FX",      short: "Treasury" },
  { id: "ops",            label: "Ops & Recon",        short: "Ops" },
];

export function init(root) {
  render(root);
  state.subscribe(["domainFilter", "terms"], () => render(root));
}

function render(root) {
  const s = state.get();
  root.innerHTML = `
    <div class="label">Filter by domain</div>
    ${DOMAINS.map(d => {
      const count = d.id === "all" ? s.terms.length : s.terms.filter(t => t.domain === d.id).length;
      return `
        <button class="chip" aria-pressed="${s.domainFilter === d.id}" data-domain="${d.id}">
          <span>${d.label}</span><span class="count">${count}</span>
        </button>`;
    }).join("")}
  `;
  root.querySelectorAll("[data-domain]").forEach(btn => {
    btn.addEventListener("click", () => state.set({ domainFilter: btn.dataset.domain }));
  });
}
