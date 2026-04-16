import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Safeguarding (UK)",
  desc: "UK rule: non-bank payment firms must ring-fence client funds in a segregated account at a bank.",
  children: [
    node({ id: "fintech", x: 8, y: 80, w: 80, h: 40, label: "Fintech", sub: "Wise" }),
    node({ id: "vault", x: 125, y: 80, w: 80, h: 40, label: "Ring-fenced", sub: "HSBC", color: "teal" }),
    node({ id: "cred", x: 242, y: 30, w: 70, h: 40, label: "Creditors" }),
    node({ id: "cust", x: 242, y: 130, w: 70, h: 40, label: "Customers" }),
    arrow({ from: { x: 88, y: 100 }, to: { x: 125, y: 100 }, id: "sf-a" }),
    arrow({ from: { x: 205, y: 90 }, to: { x: 242, y: 50 }, dashed: true, id: "sf-b" }),
    arrow({ from: { x: 205, y: 110 }, to: { x: 242, y: 150 }, id: "sf-c" }),
  ],
});
