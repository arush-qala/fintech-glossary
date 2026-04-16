import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Clearing Account",
  desc: "Temporary parking spot for money in transit. Reconciled and emptied regularly.",
  children: [
    node({ id: "rev", x: 8, y: 80, w: 80, h: 40, label: "Revenue" }),
    node({ id: "clear", x: 125, y: 80, w: 80, h: 40, label: "Stripe Clearing", sub: "temp", color: "amber" }),
    node({ id: "cash", x: 242, y: 80, w: 70, h: 40, label: "Cash" }),
    arrow({ from: { x: 88, y: 100 }, to: { x: 125, y: 100 }, label: "DR £120", id: "cl-a" }),
    arrow({ from: { x: 205, y: 100 }, to: { x: 242, y: 100 }, label: "CR £117", id: "cl-b" }),
  ],
});
