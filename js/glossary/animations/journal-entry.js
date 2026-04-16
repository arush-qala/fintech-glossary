import { scene, ledger } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Journal Entry",
  desc: "A single balanced debit/credit pair recording one business event.",
  children: [
    ledger({
      x: 60, y: 60, w: 200,
      rows: [
        { dr: "€950", account: "5200 COGS", cr: "" },
        { dr: "", account: "2100 AP", cr: "€950" },
      ],
    }),
    `<text x="160" y="140" text-anchor="middle" font-family="var(--ff-sans)" font-size="11" font-weight="600" fill="var(--teal)">
       DR total = CR total ✓
     </text>`,
  ],
});
