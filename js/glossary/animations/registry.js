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

registerAll([
  ["payment-gateway",    () => import("/js/glossary/animations/payment-gateway.js")],
  ["payment-processor",  () => import("/js/glossary/animations/payment-processor.js")],
  ["payment-provider",   () => import("/js/glossary/animations/payment-provider.js")],
  ["acquirer",           () => import("/js/glossary/animations/acquirer.js")],
  ["ach",                () => import("/js/glossary/animations/ach.js")],
  ["swift",              () => import("/js/glossary/animations/swift.js")],
  ["payfac",             () => import("/js/glossary/animations/payfac.js")],
  ["pay-in",             () => import("/js/glossary/animations/pay-in.js")],
  ["accounts-payable",   () => import("/js/glossary/animations/accounts-payable.js")],
  ["accounts-receivable",() => import("/js/glossary/animations/accounts-receivable.js")],
  ["expense-code",       () => import("/js/glossary/animations/expense-code.js")],
]);
