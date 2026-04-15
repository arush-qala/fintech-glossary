import * as state from "/js/state.js";
import * as topbar from "/js/topbar.js";
import * as sidebar from "/js/sidebar.js";
import * as flowRenderer from "/js/flow-renderer.js";

async function boot() {
  await state.load();
  topbar.init(document.querySelector("[data-topbar]"));
  sidebar.init(document.querySelector("[data-sidebar]"));
  flowRenderer.init(document.querySelector("[data-flowpane]"));
}

boot().catch(err => {
  console.error("boot failed", err);
  document.body.textContent = "Failed to load. See console.";
});
