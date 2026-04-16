import { renderClosedCard, DOMAIN_LABEL, DOMAIN_ORDER } from "/js/glossary/term-card.js";

async function init() {
  const [terms, glossary] = await Promise.all([
    fetch("/data/terms.json").then(r => r.json()),
    fetch("/data/glossary.json").then(r => r.json()),
  ]);

  const glossaryById = new Map(glossary.map(g => [g.id, g]));

  // Group by domain
  const byDomain = {};
  for (const d of DOMAIN_ORDER) byDomain[d] = [];
  for (const t of terms) {
    if (byDomain[t.domain]) byDomain[t.domain].push(t);
  }
  for (const d of DOMAIN_ORDER) {
    byDomain[d].sort((a, b) => a.name.localeCompare(b.name));
  }

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
      const plain = glossaryById.get(term.id)?.plain || "";
      cardsRoot.appendChild(renderClosedCard(term, plain));
    }
    main.appendChild(section);
  }
}

init().catch(err => {
  console.error(err);
  const main = document.querySelector("[data-main]");
  if (main) main.textContent = "Failed to load. See console.";
});
