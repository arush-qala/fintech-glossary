// Registry of available per-term animations.
// Each entry is a lazy dynamic import. Terms not listed fall back to placeholder.

const ANIMATIONS = {
  // Populated in later tasks. Keys are term ids; values are loader functions.
};

export function register(id, loader) {
  ANIMATIONS[id] = loader;
}

export function has(id) {
  return id in ANIMATIONS;
}

export async function load(id) {
  if (!(id in ANIMATIONS)) return null;
  try {
    const mod = await ANIMATIONS[id]();
    return typeof mod.default === "function" ? mod.default() : mod.default;
  } catch (err) {
    console.warn(`animation load failed for ${id}`, err);
    return null;
  }
}

// Batch registration via a manifest.
export function registerAll(entries) {
  for (const [id, loader] of entries) register(id, loader);
}
