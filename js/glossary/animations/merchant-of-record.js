import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Merchant of Record",
  desc: "The platform acts as legal seller: handles tax, refunds, chargebacks on behalf of the real creator.",
  children: [
    node({ id: "dev", x: 8, y: 80, w: 70, h: 40, label: "Dev" }),
    node({ id: "mor", x: 115, y: 80, w: 90, h: 40, label: "Paddle", sub: "MoR", color: "teal" }),
    node({ id: "buyer", x: 242, y: 80, w: 70, h: 40, label: "Buyer" }),
    arrow({ from: { x: 78, y: 100 }, to: { x: 115, y: 100 }, dashed: true, id: "mor-a" }),
    arrow({ from: { x: 205, y: 100 }, to: { x: 242, y: 100 }, label: "receipt", animated: true, id: "mor-b" }),
    `<text x="160" y="165" text-anchor="middle" font-family="var(--ff-mono)" font-size="10" fill="var(--ink-3)">VAT · refunds · chargebacks</text>`,
  ],
});
