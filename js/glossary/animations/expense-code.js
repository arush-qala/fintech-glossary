import { scene, node, stack } from "/js/glossary/animations/primitives.js";

export default () => scene({
  title: "Expense Code",
  desc: "An invoice gets coded to a specific GL account so it shows up in the right place on reports.",
  children: [
    node({ id: "invoice", x: 8, y: 80, w: 80, h: 36, label: "Invoice", sub: "€950" }),
    `<path d="M 88 98 L 150 98" stroke="var(--ink-2)" stroke-width="1.5" marker-end="url(#arrowhead)"/>`,
    `<text x="119" y="92" text-anchor="middle" font-family="var(--ff-mono)" font-size="9" fill="var(--ink-3)">code?</text>`,
    stack({
      x: 160, y: 32, w: 150,
      items: [
        { label: "5200 · COGS", color: "var(--teal-tint)" },
        { label: "6200 · Software" },
        { label: "6400 · Marketing" },
        { label: "6500 · Travel" },
        { label: "7100 · Office" },
        { label: "7300 · Legal" },
        { label: "7400 · R&D" },
        { label: "8000 · Interest" },
      ],
    }),
    `<rect x="160" y="32" width="150" height="14" fill="none" stroke="var(--teal)" stroke-width="2" rx="3">
       <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
     </rect>`,
  ],
});
