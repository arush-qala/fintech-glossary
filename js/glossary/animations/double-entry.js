import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Double-Entry",
  desc: "Every event hits at least two accounts so total debits always equal total credits.",
  children: [
    node({ id: "cash", x: 30, y: 40, w: 100, h: 36, label: "Cash", sub: "+ £100", color: "teal" }),
    node({ id: "revenue", x: 190, y: 120, w: 100, h: 36, label: "Revenue", sub: "+ £100", color: "amber" }),
    arrow({ from: { x: 80, y: 76 }, to: { x: 240, y: 120 }, dashed: true, animated: true, id: "de-a" }),
    `<text x="160" y="185" text-anchor="middle" font-family="var(--ff-sans)" font-size="11" font-weight="600" fill="var(--ink-2)">
       DR = CR (always)
     </text>`,
  ],
});
