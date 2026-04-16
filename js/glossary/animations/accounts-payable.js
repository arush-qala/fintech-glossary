import { scene, node, arrow, ledger } from "/js/glossary/animations/primitives.js";

export default () => scene({
  title: "Accounts Payable",
  desc: "Money the business owes suppliers. Sits on the balance sheet as a liability until paid.",
  children: [
    node({ id: "supplier", x: 8, y: 16, w: 80, h: 30, label: "Supplier" }),
    node({ id: "business", x: 230, y: 16, w: 80, h: 30, label: "Business" }),
    arrow({ from: { x: 88, y: 31 }, to: { x: 230, y: 31 }, label: "invoice €950", animated: true, id: "ap-a" }),
    ledger({
      x: 60, y: 70, w: 200,
      rows: [
        { dr: "€950", account: "5200 COGS", cr: "" },
        { dr: "", account: "2100 AP", cr: "€950" },
      ],
    }),
    `<text x="160" y="170" text-anchor="middle" font-family="var(--ff-sans)" font-size="10" fill="var(--ink-3)">AP rises · owed, not paid</text>`,
  ],
});
