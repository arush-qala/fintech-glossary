import * as state from "/js/state.js";

async function boot() {
  await state.load();
  console.log("loaded", state.get().terms.length, "terms,", state.get().flows.length, "flows");
  console.log("active flow:", state.activeFlow().title);
}

boot().catch(err => {
  console.error("boot failed", err);
  document.body.textContent = "Failed to load. See console.";
});
