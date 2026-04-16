import { scene, node, arrow, mark } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Treasury Reconciliation",
  desc: "Daily match of internal ledger to every bank and rail statement. Breaks surface fast.",
  children: [
    node({ id: "gl", x: 8, y: 30, w: 110, h: 36, label: "GL £428,119.42" }),
    node({ id: "bank", x: 8, y: 130, w: 110, h: 36, label: "Bank £428,121.82" }),
    node({ id: "match", x: 200, y: 80, w: 110, h: 40, label: "Break £2.40", color: "amber" }),
    arrow({ from: { x: 118, y: 48 }, to: { x: 200, y: 95 }, id: "tr-a" }),
    arrow({ from: { x: 118, y: 148 }, to: { x: 200, y: 105 }, id: "tr-b" }),
    mark({ x: 255, y: 155, type: "x" }),
  ],
});
