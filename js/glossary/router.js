// Handles chip jumps and hash → auto-expand.

export function init() {
  handleHash();
  window.addEventListener("hashchange", handleHash);

  document.addEventListener("click", onClick);
}

function onClick(e) {
  const jump = e.target.closest("[data-jump]");
  if (!jump) return;
  e.preventDefault();
  const id = jump.dataset.jump;
  if (!id) return;
  if (location.hash.replace(/^#/, "") === id) {
    openAndScroll(id, { pulse: true });
  } else {
    location.hash = id;   // hashchange handler will run
  }
}

function handleHash() {
  const id = location.hash.replace(/^#/, "");
  if (!id) return;
  openAndScroll(id, { pulse: true });
}

function openAndScroll(id, { pulse = false } = {}) {
  const el = document.getElementById(id);
  if (!el) return;
  el.open = true;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  if (pulse) {
    el.classList.remove("gl-pulse");
    // Force reflow so the animation restarts when re-applied.
    void el.offsetWidth;
    el.classList.add("gl-pulse");
    setTimeout(() => el.classList.remove("gl-pulse"), 1400);
  }
}
