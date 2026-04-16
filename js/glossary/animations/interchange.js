import { scene, node, arrow, feeBadge } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Interchange",
  desc: "A small fee drops off the payment and flows from acquirer to issuer.",
  children: [
    node({ id: "acq", x: 8, y: 80, w: 80, h: 40, label: "Acquirer" }),
    node({ id: "iss", x: 232, y: 80, w: 80, h: 40, label: "Issuer", color: "teal" }),
    arrow({ from: { x: 88, y: 100 }, to: { x: 232, y: 100 }, label: "£6.50 auth", id: "ix-a" }),
    feeBadge({ from: { x: 88, y: 100 }, to: { x: 232, y: 100 }, detachAt: 0.5, amount: "£0.02", settleY: 160 }),
    `<text x="160" y="180" text-anchor="middle" font-family="var(--ff-mono)" font-size="9" fill="var(--ink-3)">interchange ≈ 0.2%</text>`,
  ],
});
