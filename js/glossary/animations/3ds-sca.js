import { scene, node, arrow, mark } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "3DS / SCA",
  desc: "Shopper gets a push from their bank app to approve a payment. Liability shifts to the issuer.",
  children: [
    node({ id: "checkout", x: 8, y: 80, w: 80, h: 40, label: "Checkout" }),
    node({ id: "bank", x: 125, y: 80, w: 80, h: 40, label: "Bank app", color: "teal" }),
    node({ id: "approve", x: 242, y: 80, w: 70, h: 40, label: "APPROVED" }),
    arrow({ from: { x: 88, y: 100 }, to: { x: 125, y: 100 }, label: "verify?", animated: true, id: "ds-a" }),
    arrow({ from: { x: 205, y: 100 }, to: { x: 242, y: 100 }, animated: true, id: "ds-b" }),
    mark({ x: 165, y: 155, type: "check" }),
    `<text x="180" y="159" font-family="var(--ff-sans)" font-size="10" fill="var(--ink-3)">liability → issuer</text>`,
  ],
});
