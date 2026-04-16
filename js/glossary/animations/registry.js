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
  ["card-network",          () => import("/js/glossary/animations/card-network.js")],
  ["interchange",           () => import("/js/glossary/animations/interchange.js")],
  ["faster-payments",       () => import("/js/glossary/animations/faster-payments.js")],
  ["sepa-instant",          () => import("/js/glossary/animations/sepa-instant.js")],
  ["rtp",                   () => import("/js/glossary/animations/rtp.js")],
  ["wire-transfer",         () => import("/js/glossary/animations/wire-transfer.js")],
  ["iso-20022",             () => import("/js/glossary/animations/iso-20022.js")],
  ["correspondent-banking", () => import("/js/glossary/animations/correspondent-banking.js")],
  ["settlement",            () => import("/js/glossary/animations/settlement.js")],
  ["issuer",                () => import("/js/glossary/animations/issuer.js")],
  ["tokenization",          () => import("/js/glossary/animations/tokenization.js")],
  ["3ds-sca",               () => import("/js/glossary/animations/3ds-sca.js")],
  ["merchant-of-record",    () => import("/js/glossary/animations/merchant-of-record.js")],
  ["pay-out",               () => import("/js/glossary/animations/pay-out.js")],
  ["general-ledger",        () => import("/js/glossary/animations/general-ledger.js")],
  ["journal-entry",         () => import("/js/glossary/animations/journal-entry.js")],
  ["double-entry",          () => import("/js/glossary/animations/double-entry.js")],
  ["kyc",                   () => import("/js/glossary/animations/kyc.js")],
  ["sanctions-screening",   () => import("/js/glossary/animations/sanctions-screening.js")],
  ["mid-market-rate",       () => import("/js/glossary/animations/mid-market-rate.js")],
]);
