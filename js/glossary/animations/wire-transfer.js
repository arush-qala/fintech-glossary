import { scene, node, arrow, mark } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Wire Transfer",
  desc: "High-value, same-day, usually irrevocable bank-to-bank transfer.",
  children: [
    node({ id: "buyer", x: 8, y: 80, w: 80, h: 40, label: "Buyer", sub: "£420k" }),
    node({ id: "wire", x: 125, y: 80, w: 80, h: 40, label: "CHAPS / Fedwire", color: "teal" }),
    node({ id: "seller", x: 232, y: 80, w: 80, h: 40, label: "Seller" }),
    arrow({ from: { x: 88, y: 100 }, to: { x: 125, y: 100 }, animated: true, id: "wt-a" }),
    arrow({ from: { x: 205, y: 100 }, to: { x: 232, y: 100 }, animated: true, id: "wt-b" }),
    mark({ x: 160, y: 160, type: "x" }),
    `<text x="180" y="164" font-family="var(--ff-sans)" font-size="10" fill="var(--ink-3)">no reversal</text>`,
  ],
});
