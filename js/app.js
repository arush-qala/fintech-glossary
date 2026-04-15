import * as state from "/js/state.js";
import * as topbar from "/js/topbar.js";
import * as sidebar from "/js/sidebar.js";

async function boot() {
  await state.load();
  topbar.init(document.querySelector("[data-topbar]"));
  sidebar.init(document.querySelector("[data-sidebar]"));
}

boot().catch(err => {
  console.error("boot failed", err);
  document.body.textContent = "Failed to load. See console.";
});
