import { scene, node, arrow, mark } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Issuer",
  desc: "Cardholder's bank. Approves or declines each card transaction based on balance and fraud checks.",
  children: [
    node({ id: "network", x: 8, y: 80, w: 80, h: 40, label: "Network" }),
    node({ id: "issuer", x: 125, y: 80, w: 80, h: 40, label: "Issuer", sub: "Lloyds", color: "teal" }),
    node({ id: "holder", x: 242, y: 80, w: 70, h: 40, label: "Holder" }),
    arrow({ from: { x: 88, y: 100 }, to: { x: 125, y: 100 }, label: "auth?", animated: true, id: "is-a" }),
    arrow({ from: { x: 205, y: 100 }, to: { x: 242, y: 100 }, dashed: true, id: "is-b" }),
    arrow({ from: { x: 165, y: 120 }, to: { x: 88, y: 120 }, label: "APPROVED", color: "var(--green)", id: "is-c" }),
    mark({ x: 60, y: 40, type: "check", r: 8 }),
  ],
});
