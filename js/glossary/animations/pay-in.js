import { scene, node, arrow } from "/js/glossary/animations/primitives.js";

export default () => scene({
  title: "Pay-In",
  desc: "Money coming into the payment platform from a customer: card top-up, Faster Payment, direct debit.",
  children: [
    node({ id: "customer", x: 8, y: 80, w: 80, h: 40, label: "Customer", sub: "bank" }),
    node({ id: "platform", x: 220, y: 80, w: 90, h: 40, label: "Platform", sub: "PSP", color: "teal" }),
    arrow({ from: { x: 88, y: 100 }, to: { x: 220, y: 100 }, label: "£1,000", animated: true, id: "pi-a" }),
    `<text x="160" y="50" text-anchor="middle" font-family="var(--ff-sans)" font-size="11" font-weight="600" fill="var(--ink-3)">PAY-IN</text>`,
    `<text x="160" y="160" text-anchor="middle" font-family="var(--ff-mono)" font-size="10" fill="var(--ink-3)">Faster Payments · ~15s</text>`,
  ],
});
