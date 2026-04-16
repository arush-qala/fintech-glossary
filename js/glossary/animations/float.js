import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Float / Pre-funding",
  desc: "PSP parks money in local accounts ahead of time so payouts feel instant.",
  children: [
    node({ id: "float", x: 8, y: 80, w: 90, h: 40, label: "€50m float", sub: "pre-funded", color: "teal" }),
    node({ id: "cust", x: 222, y: 80, w: 90, h: 40, label: "Customer", sub: "gets €950" }),
    arrow({ from: { x: 98, y: 100 }, to: { x: 222, y: 100 }, label: "instant", animated: true, id: "fl-a" }),
    `<text x="160" y="170" text-anchor="middle" font-family="var(--ff-sans)" font-size="10" fill="var(--ink-3)">GBP converts later, in batch</text>`,
  ],
});
