import { scene, ledger, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "General Ledger",
  desc: "Every journal entry flows into the GL, the master record of the business.",
  children: [
    `<text x="40" y="30" font-family="var(--ff-mono)" font-size="10" fill="var(--ink-3)">entry 1</text>`,
    `<text x="40" y="60" font-family="var(--ff-mono)" font-size="10" fill="var(--ink-3)">entry 2</text>`,
    `<text x="40" y="90" font-family="var(--ff-mono)" font-size="10" fill="var(--ink-3)">entry 3</text>`,
    arrow({ from: { x: 80, y: 60 }, to: { x: 140, y: 90 }, animated: true, id: "gl-a" }),
    ledger({
      x: 150, y: 50, w: 160,
      rows: [
        { dr: "£6.50", account: "Cash", cr: "" },
        { dr: "", account: "Revenue", cr: "£6.50" },
        { dr: "€950", account: "AR", cr: "" },
      ],
    }),
  ],
});
