import { scene, node, arrow, mark } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Sanctions Screening",
  desc: "Every name in a transaction is checked against government watchlists before funds release.",
  children: [
    node({ id: "payment", x: 8, y: 80, w: 80, h: 40, label: "Payment", sub: "$50k wire" }),
    node({ id: "list", x: 125, y: 80, w: 80, h: 40, label: "OFAC / UN", sub: "watchlists", color: "amber" }),
    node({ id: "decision", x: 242, y: 80, w: 70, h: 40, label: "Release?" }),
    arrow({ from: { x: 88, y: 100 }, to: { x: 125, y: 100 }, animated: true, id: "ss-a" }),
    arrow({ from: { x: 205, y: 100 }, to: { x: 242, y: 100 }, id: "ss-b" }),
    mark({ x: 280, y: 40, type: "check", r: 8 }),
    mark({ x: 280, y: 160, type: "x", r: 8 }),
  ],
});
