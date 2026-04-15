import * as state from "/js/state.js";
import * as router from "/js/router.js";
import * as topbar from "/js/topbar.js";
import * as sidebar from "/js/sidebar.js";
import * as flowRenderer from "/js/flow-renderer.js";
import * as detail from "/js/detail-pane.js";
import * as controls from "/js/controls.js";
import * as search from "/js/search.js";

async function boot() {
  await state.load();
  router.init();
  document.querySelector("[data-hintbar]").innerHTML =
    `Keyboard: <kbd>→</kbd> next · <kbd>←</kbd> back · <kbd>1</kbd><kbd>2</kbd><kbd>3</kbd> lens · <kbd>g</kbd> next flow · <kbd>/</kbd> search`;
  topbar.init(document.querySelector("[data-topbar]"));
  sidebar.init(document.querySelector("[data-sidebar]"));
  flowRenderer.init(document.querySelector("[data-flowpane]"));
  detail.init(document.querySelector("[data-detail]"));
  controls.init();
  search.init(document.querySelector("[data-search]"));
}

boot().catch(err => {
  console.error("boot failed", err);
  document.body.textContent = "Failed to load. See console.";
});
