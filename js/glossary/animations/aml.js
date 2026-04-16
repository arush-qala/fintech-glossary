import { scene, node, stack, mark } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "AML",
  desc: "Ongoing transaction monitoring flags suspicious patterns and files SARs.",
  children: [
    stack({
      x: 20, y: 30, w: 110,
      items: [
        { label: "£9,500 · Tue" },
        { label: "£9,500 · Wed" },
        { label: "£9,500 · Thu", color: "var(--amber-tint)" },
        { label: "£9,500 · Fri", color: "var(--amber-tint)" },
      ],
    }),
    node({ id: "monitor", x: 180, y: 80, w: 100, h: 40, label: "AML monitor", color: "amber" }),
    mark({ x: 235, y: 150, type: "x" }),
    `<text x="250" y="153" font-family="var(--ff-sans)" font-size="10" fill="var(--red)">SAR filed</text>`,
  ],
});
