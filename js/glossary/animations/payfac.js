import { scene, node, arrow } from "/js/glossary/animations/primitives.js";

export default () => scene({
  title: "PayFac",
  desc: "A platform onboards many sub-merchants under its own master acquiring contract, so each sub-merchant can start accepting cards in minutes.",
  children: [
    node({ id: "payfac", x: 115, y: 14, w: 90, h: 36, label: "PayFac", sub: "Shopify", color: "teal" }),
    node({ id: "sm1", x: 8, y: 80, w: 60, h: 36, label: "Shop A" }),
    node({ id: "sm2", x: 78, y: 80, w: 60, h: 36, label: "Shop B" }),
    node({ id: "sm3", x: 148, y: 80, w: 60, h: 36, label: "Shop C" }),
    node({ id: "sm4", x: 218, y: 80, w: 60, h: 36, label: "Shop D" }),
    node({ id: "acquirer", x: 115, y: 150, w: 90, h: 36, label: "Acquirer", sub: "Stripe" }),
    arrow({ from: { x: 160, y: 50 }, to: { x: 38, y: 80 }, dashed: true, id: "pf-a" }),
    arrow({ from: { x: 160, y: 50 }, to: { x: 108, y: 80 }, dashed: true, id: "pf-b" }),
    arrow({ from: { x: 160, y: 50 }, to: { x: 178, y: 80 }, dashed: true, id: "pf-c" }),
    arrow({ from: { x: 160, y: 50 }, to: { x: 248, y: 80 }, dashed: true, id: "pf-d" }),
    arrow({ from: { x: 160, y: 116 }, to: { x: 160, y: 150 }, animated: true, id: "pf-settle" }),
  ],
});
