// Entry point for glossary page. Loads data then mounts.
async function init() {
  const main = document.querySelector("[data-main]");
  main.textContent = "Loading…";
  const [terms, glossary] = await Promise.all([
    fetch("/data/terms.json").then(r => r.json()),
    fetch("/data/glossary.json").then(r => r.json()).catch(() => []),
  ]);
  main.textContent = `Loaded ${terms.length} terms.`;
  console.log("glossary ready", { terms: terms.length, glossary: glossary.length });
}

init().catch(err => {
  console.error(err);
  document.querySelector("[data-main]").textContent = "Failed to load. See console.";
});
