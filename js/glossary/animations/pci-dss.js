import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "PCI DSS",
  desc: "Security standard for anyone touching card data. Tokenisation keeps most merchants in the easiest tier.",
  children: [
    node({ id: "shop", x: 8, y: 80, w: 80, h: 40, label: "Shop", sub: "no PAN" }),
    node({ id: "psp", x: 125, y: 80, w: 80, h: 40, label: "PSP", sub: "PCI Level 1", color: "teal" }),
    node({ id: "card", x: 242, y: 80, w: 70, h: 40, label: "Card data" }),
    arrow({ from: { x: 205, y: 100 }, to: { x: 242, y: 100 }, id: "pci-a" }),
    `<text x="48" y="160" text-anchor="middle" font-family="var(--ff-mono)" font-size="9" fill="var(--ink-3)">SAQ A (easy)</text>`,
  ],
});
