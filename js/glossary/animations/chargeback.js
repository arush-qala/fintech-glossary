import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Chargeback",
  desc: "Cardholder disputes; bank claws money back from the merchant. Merchant can contest with evidence.",
  children: [
    node({ id: "holder", x: 8, y: 80, w: 80, h: 40, label: "Cardholder" }),
    node({ id: "issuer", x: 125, y: 80, w: 80, h: 40, label: "Issuer", color: "amber" }),
    node({ id: "merchant", x: 242, y: 80, w: 70, h: 40, label: "Merchant" }),
    arrow({ from: { x: 88, y: 90 }, to: { x: 125, y: 90 }, label: "dispute", id: "cb-a" }),
    arrow({ from: { x: 205, y: 110 }, to: { x: 242, y: 110 }, label: "claw back £80+£15", color: "var(--red)", animated: true, id: "cb-b" }),
  ],
});
