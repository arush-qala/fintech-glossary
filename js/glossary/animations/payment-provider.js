import { scene, node, arrow } from "/js/glossary/animations/primitives.js";

export default () => scene({
  title: "Payment Provider (PSP)",
  desc: "A PSP bundles gateway, processor, FX, and accounts into one product surface. A merchant integrates once; the PSP routes across rails.",
  children: [
    node({ id: "merchant", x: 8, y: 80, w: 70, h: 40, label: "Merchant" }),
    node({ id: "psp", x: 115, y: 80, w: 90, h: 40, label: "PSP", sub: "Wise / Stripe", color: "teal" }),
    node({ id: "rail-a", x: 240, y: 14, w: 70, h: 30, label: "Faster Pay" }),
    node({ id: "rail-b", x: 240, y: 56, w: 70, h: 30, label: "SEPA" }),
    node({ id: "rail-c", x: 240, y: 98, w: 70, h: 30, label: "Cards" }),
    node({ id: "rail-d", x: 240, y: 140, w: 70, h: 30, label: "SWIFT" }),
    arrow({ from: { x: 78, y: 100 }, to: { x: 115, y: 100 }, animated: true, id: "pv-main" }),
    arrow({ from: { x: 205, y: 95 }, to: { x: 240, y: 29 }, id: "pv-a" }),
    arrow({ from: { x: 205, y: 100 }, to: { x: 240, y: 71 }, id: "pv-b" }),
    arrow({ from: { x: 205, y: 105 }, to: { x: 240, y: 113 }, id: "pv-c" }),
    arrow({ from: { x: 205, y: 110 }, to: { x: 240, y: 155 }, id: "pv-d" }),
  ],
});
