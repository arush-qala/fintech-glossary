import { scene, node, arrow, mark } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Reconciliation",
  desc: "Match transactions across ledger, bank statement, and invoices. Duplicates and fraud show up here.",
  children: [
    node({ id: "ledger", x: 8, y: 30, w: 80, h: 30, label: "Ledger" }),
    node({ id: "bank", x: 8, y: 85, w: 80, h: 30, label: "Bank" }),
    node({ id: "inv", x: 8, y: 140, w: 80, h: 30, label: "Invoice" }),
    node({ id: "match", x: 180, y: 85, w: 90, h: 30, label: "Match engine", color: "teal" }),
    arrow({ from: { x: 88, y: 45 }, to: { x: 180, y: 95 }, id: "rc-a" }),
    arrow({ from: { x: 88, y: 100 }, to: { x: 180, y: 100 }, id: "rc-b" }),
    arrow({ from: { x: 88, y: 155 }, to: { x: 180, y: 110 }, id: "rc-c" }),
    mark({ x: 285, y: 100, type: "check" }),
  ],
});
