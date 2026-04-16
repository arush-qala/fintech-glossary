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
  ["kyb",                      () => import("/js/glossary/animations/kyb.js")],
  ["aml",                      () => import("/js/glossary/animations/aml.js")],
  ["pci-dss",                  () => import("/js/glossary/animations/pci-dss.js")],
  ["psd2",                     () => import("/js/glossary/animations/psd2.js")],
  ["safeguarding",             () => import("/js/glossary/animations/safeguarding.js")],
  ["fx-spread",                () => import("/js/glossary/animations/fx-spread.js")],
  ["nostro-vostro",            () => import("/js/glossary/animations/nostro-vostro.js")],
  ["float",                    () => import("/js/glossary/animations/float.js")],
  ["stablecoin-rails",         () => import("/js/glossary/animations/stablecoin-rails.js")],
  ["cross-currency-netting",   () => import("/js/glossary/animations/cross-currency-netting.js")],
  ["cut-off-time",             () => import("/js/glossary/animations/cut-off-time.js")],
  ["treasury-reconciliation",  () => import("/js/glossary/animations/treasury-reconciliation.js")],
  ["chart-of-accounts",        () => import("/js/glossary/animations/chart-of-accounts.js")],
  ["accrual-vs-cash",          () => import("/js/glossary/animations/accrual-vs-cash.js")],
  ["clearing-account",         () => import("/js/glossary/animations/clearing-account.js")],
  ["trial-balance",            () => import("/js/glossary/animations/trial-balance.js")],
  ["reconciliation",           () => import("/js/glossary/animations/reconciliation.js")],
  ["chargeback",               () => import("/js/glossary/animations/chargeback.js")],
  ["refund-vs-reversal",       () => import("/js/glossary/animations/refund-vs-reversal.js")],
]);
