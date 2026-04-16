import { scene, node, arrow, ledger } from "/js/glossary/animations/primitives.js";

export default () => scene({
  title: "Accounts Receivable",
  desc: "Money owed to the business by customers. A current asset that turns into cash when the customer pays.",
  children: [
    node({ id: "business", x: 8, y: 16, w: 80, h: 30, label: "Business" }),
    node({ id: "customer", x: 230, y: 16, w: 80, h: 30, label: "Customer" }),
    arrow({ from: { x: 88, y: 31 }, to: { x: 230, y: 31 }, label: "invoice €950", animated: true, id: "ar-a" }),
    ledger({
      x: 60, y: 70, w: 200,
      rows: [
        { dr: "€950", account: "1200 AR", cr: "" },
        { dr: "", account: "4000 Revenue", cr: "€950" },
      ],
    }),
    `<text x="160" y="170" text-anchor="middle" font-family="var(--ff-sans)" font-size="10" fill="var(--ink-3)">AR rises · earned, not collected</text>`,
  ],
});
