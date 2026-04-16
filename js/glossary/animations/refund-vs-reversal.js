import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Refund vs Reversal",
  desc: "Reversal cancels before settlement (as if it never happened). Refund is a new offsetting transaction after the fact.",
  children: [
    node({ id: "orig", x: 115, y: 16, w: 90, h: 32, label: "Original charge" }),
    node({ id: "rev", x: 8, y: 80, w: 120, h: 40, label: "Reversal", sub: "< 10 min · cancelled", color: "teal" }),
    node({ id: "ref", x: 192, y: 80, w: 120, h: 40, label: "Refund", sub: "later · new tx", color: "amber" }),
    arrow({ from: { x: 140, y: 48 }, to: { x: 68, y: 80 }, dashed: true, id: "rr-a" }),
    arrow({ from: { x: 180, y: 48 }, to: { x: 252, y: 80 }, id: "rr-b" }),
  ],
});
