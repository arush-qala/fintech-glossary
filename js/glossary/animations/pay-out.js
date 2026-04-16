import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Pay-Out",
  desc: "Money leaving the payment platform to a beneficiary via ACH, SEPA, or wire.",
  children: [
    node({ id: "platform", x: 8, y: 80, w: 90, h: 40, label: "Platform", sub: "PSP", color: "teal" }),
    node({ id: "beneficiary", x: 232, y: 80, w: 80, h: 40, label: "Beneficiary", sub: "bank" }),
    arrow({ from: { x: 98, y: 100 }, to: { x: 232, y: 100 }, label: "€950", animated: true, id: "po-a" }),
    `<text x="160" y="50" text-anchor="middle" font-family="var(--ff-sans)" font-size="11" font-weight="600" fill="var(--ink-3)">PAY-OUT</text>`,
    `<text x="160" y="160" text-anchor="middle" font-family="var(--ff-mono)" font-size="10" fill="var(--ink-3)">SEPA Instant · ~8s</text>`,
  ],
});
