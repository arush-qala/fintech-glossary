import { renderClosedCard, DOMAIN_LABEL, DOMAIN_ORDER, mountAnimation } from "/js/glossary/term-card.js";
import * as router from "/js/glossary/router.js";
import * as searchFilter from "/js/glossary/search-filter.js";
import * as registry from "/js/glossary/animations/registry.js";

async function init() {
  const [terms, glossary, flows] = await Promise.all([
    fetch("/data/terms.json").then(r => r.json()),
    fetch("/data/glossary.json").then(r => r.json()),
    fetch("/data/flows.json").then(r => r.json()),
  ]);

  const context = {
    terms,
    glossary,
    flows,
    termsById: new Map(terms.map(t => [t.id, t])),
    glossaryById: new Map(glossary.map(g => [g.id, g])),
    flowsById: new Map(flows.map(f => [f.id, f])),
  };

  const byDomain = {};
  for (const d of DOMAIN_ORDER) byDomain[d] = [];
  for (const t of terms) if (byDomain[t.domain]) byDomain[t.domain].push(t);
  for (const d of DOMAIN_ORDER) byDomain[d].sort((a, b) => a.name.localeCompare(b.name));

  const main = document.querySelector("[data-main]");
  main.innerHTML = "";
  for (const d of DOMAIN_ORDER) {
    const group = byDomain[d];
    if (!group.length) continue;
    const section = document.createElement("section");
    section.className = "gl-group";
    section.dataset.domain = d;
    section.innerHTML = `
      <header class="gl-group-header">
        <h2>${DOMAIN_LABEL[d]}</h2>
        <span class="gl-group-count">${group.length}</span>
      </header>
      <div class="gl-group-cards" data-cards></div>
    `;
    const cardsRoot = section.querySelector("[data-cards]");
    for (const term of group) {
      const plain = context.glossaryById.get(term.id)?.plain || "";
      cardsRoot.appendChild(renderClosedCard(term, plain, context));
    }
    main.appendChild(section);
  }

  // Mount animations on first expand, pause when closed via an IntersectionObserver.
  document.addEventListener("toggle", (e) => {
    const card = e.target;
    if (!(card instanceof HTMLDetailsElement) || !card.classList.contains("gl-card")) return;
    if (card.open) {
      mountAnimation(card, registry);
      card.classList.remove("gl-offscreen");
    }
  }, true);

  // Pause animations when card is open but scrolled off screen (performance).
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      e.target.classList.toggle("gl-offscreen", !e.isIntersecting);
    }
  }, { rootMargin: "200px" });
  document.querySelectorAll(".gl-card").forEach(c => io.observe(c));

  const stickybar = document.querySelector("[data-stickybar]");
  searchFilter.init(stickybar, terms);

  router.init();
}

init().catch(err => {
  console.error(err);
  const main = document.querySelector("[data-main]");
  if (main) main.textContent = "Failed to load. See console.";
});
