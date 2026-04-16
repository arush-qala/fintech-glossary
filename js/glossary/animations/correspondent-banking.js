import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Correspondent Banking",
  desc: "Cross-border payments hop through intermediary banks. Each hop adds fees and time.",
  children: [
    node({ id: "a", x: 4, y: 80, w: 60, h: 40, label: "Miami" }),
    node({ id: "b", x: 90, y: 80, w: 60, h: 40, label: "JPM NY", color: "amber" }),
    node({ id: "c", x: 176, y: 80, w: 60, h: 40, label: "StanChart", sub: "SG", color: "amber" }),
    node({ id: "d", x: 262, y: 80, w: 54, h: 40, label: "ID bank" }),
    arrow({ from: { x: 64, y: 100 }, to: { x: 90, y: 100 }, animated: true, id: "cb-a" }),
    arrow({ from: { x: 150, y: 100 }, to: { x: 176, y: 100 }, animated: true, id: "cb-b" }),
    arrow({ from: { x: 236, y: 100 }, to: { x: 262, y: 100 }, animated: true, id: "cb-c" }),
    `<text x="160" y="170" text-anchor="middle" font-family="var(--ff-sans)" font-size="10" fill="var(--ink-3)">3 hops · 3 fees · 2 days</text>`,
  ],
});
