import { DOMAIN_LABEL, DOMAIN_ORDER } from "/js/glossary/term-card.js";

export function init(root, terms) {
  const counts = { all: terms.length };
  for (const d of DOMAIN_ORDER) counts[d] = terms.filter(t => t.domain === d).length;

  root.innerHTML = `
    <div class="gl-sticky-inner">
      <div class="gl-searchwrap">
        <input
          type="search"
          class="gl-search"
          data-search
          placeholder="Search terms…"
          aria-label="Search glossary terms"
          autocomplete="off"
        >
        <kbd class="gl-searchkbd">/</kbd>
      </div>
      <div class="gl-chiprow" role="tablist" aria-label="Filter by domain">
        <button class="gl-dchip" data-domain="all" aria-pressed="true">All <span class="gl-dcount">${counts.all}</span></button>
        ${DOMAIN_ORDER.map(d => `
          <button class="gl-dchip" data-domain="${d}" aria-pressed="false">
            ${DOMAIN_LABEL[d]} <span class="gl-dcount">${counts[d]}</span>
          </button>
        `).join("")}
      </div>
    </div>
    <div class="gl-empty" data-empty hidden>
      No terms match. <button class="gl-empty-reset" data-empty-reset>Clear filters</button>
    </div>
  `;

  const input = root.querySelector("[data-search]");
  const chips = root.querySelectorAll(".gl-dchip");
  const empty = root.querySelector("[data-empty]");
  const reset = root.querySelector("[data-empty-reset]");

  let state = { q: "", domain: "all" };

  function applyFilter() {
    const q = state.q.trim().toLowerCase();
    const d = state.domain;
    let anyVisible = false;

    document.querySelectorAll(".gl-card").forEach(card => {
      const termId = card.dataset.termId;
      const term = terms.find(t => t.id === termId);
      if (!term) return;

      const domainMatch = d === "all" || term.domain === d;
      const queryMatch = !q
        || term.name.toLowerCase().includes(q)
        || (term.alias || []).some(a => a.toLowerCase().includes(q))
        || term.domain.toLowerCase().includes(q);

      const show = domainMatch && queryMatch;
      card.hidden = !show;
      if (show) anyVisible = true;
    });

    document.querySelectorAll(".gl-group").forEach(group => {
      const visible = group.querySelectorAll(".gl-card:not([hidden])").length;
      group.hidden = visible === 0;
    });

    empty.hidden = anyVisible;
  }

  input.addEventListener("input", () => {
    state = { ...state, q: input.value };
    applyFilter();
  });

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      state = { ...state, domain: chip.dataset.domain };
      chips.forEach(c => c.setAttribute("aria-pressed", c === chip ? "true" : "false"));
      applyFilter();
    });
  });

  reset.addEventListener("click", () => {
    state = { q: "", domain: "all" };
    input.value = "";
    chips.forEach(c => c.setAttribute("aria-pressed", c.dataset.domain === "all" ? "true" : "false"));
    applyFilter();
  });

  document.addEventListener("keydown", (e) => {
    const activeTag = document.activeElement?.tagName;
    const isTyping = activeTag === "INPUT" || activeTag === "TEXTAREA";
    if ((e.key === "/" && !isTyping) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
      e.preventDefault();
      input.focus();
      input.select();
    } else if (e.key === "Escape" && document.activeElement === input) {
      input.value = "";
      state = { ...state, q: "" };
      applyFilter();
      input.blur();
    }
  });
}
