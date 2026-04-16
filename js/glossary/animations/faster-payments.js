import { scene, node, arrow, timer } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Faster Payments (UK)",
  desc: "UK rail moving GBP bank-to-bank in seconds, 24/7.",
  children: [
    node({ id: "from", x: 8, y: 80, w: 70, h: 40, label: "Barclays" }),
    node({ id: "rail", x: 125, y: 80, w: 80, h: 40, label: "Faster Pay", sub: "UK", color: "teal" }),
    node({ id: "to", x: 242, y: 80, w: 70, h: 40, label: "Wise GBP" }),
    arrow({ from: { x: 78, y: 100 }, to: { x: 125, y: 100 }, animated: true, id: "fp-a" }),
    arrow({ from: { x: 205, y: 100 }, to: { x: 242, y: 100 }, animated: true, id: "fp-b" }),
    timer({ x: 160, y: 165, label: "~15 sec" }),
  ],
});
