import { scene, node, arrow, timer } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "SEPA Instant",
  desc: "Eurozone instant bank transfer. Under 10 seconds, any time.",
  children: [
    node({ id: "from", x: 8, y: 80, w: 80, h: 40, label: "Wise EUR" }),
    node({ id: "rail", x: 125, y: 80, w: 80, h: 40, label: "SEPA Instant", color: "teal" }),
    node({ id: "to", x: 232, y: 80, w: 80, h: 40, label: "Deutsche Bank" }),
    arrow({ from: { x: 88, y: 100 }, to: { x: 125, y: 100 }, animated: true, id: "si-a" }),
    arrow({ from: { x: 205, y: 100 }, to: { x: 232, y: 100 }, animated: true, id: "si-b" }),
    timer({ x: 160, y: 165, label: "< 10 sec" }),
  ],
});
