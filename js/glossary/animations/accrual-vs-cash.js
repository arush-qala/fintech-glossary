import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Accrual vs Cash",
  desc: "Accrual records revenue when earned (March); cash records it when money moves (April).",
  children: [
    node({ id: "ship", x: 8, y: 50, w: 100, h: 36, label: "Ship · Mar 30", color: "teal" }),
    node({ id: "pay", x: 212, y: 50, w: 100, h: 36, label: "Pay · Apr 30", color: "amber" }),
    arrow({ from: { x: 108, y: 68 }, to: { x: 212, y: 68 }, dashed: true, id: "av-a" }),
    `<text x="58" y="120" text-anchor="middle" font-family="var(--ff-sans)" font-size="11" font-weight="600" fill="var(--teal)">Accrual: March</text>`,
    `<text x="262" y="120" text-anchor="middle" font-family="var(--ff-sans)" font-size="11" font-weight="600" fill="var(--amber)">Cash: April</text>`,
  ],
});
