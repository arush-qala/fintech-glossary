import * as state from "/js/state.js";
import * as topbar from "/js/topbar.js";

async function boot() {
  await state.load();
  topbar.init(document.querySelector("[data-topbar]"));
}

boot().catch(err => {
  console.error("boot failed", err);
  document.body.textContent = "Failed to load. See console.";
});
