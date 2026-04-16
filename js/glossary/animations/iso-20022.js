import { scene, node, arrow, stack } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "ISO 20022",
  desc: "Modern structured XML format carrying rich data alongside each payment.",
  children: [
    node({ id: "from", x: 8, y: 80, w: 70, h: 40, label: "Bank A" }),
    node({ id: "to", x: 242, y: 80, w: 70, h: 40, label: "Bank B" }),
    arrow({ from: { x: 78, y: 100 }, to: { x: 242, y: 100 }, label: "€950 + metadata", animated: true, id: "iso-a" }),
    stack({
      x: 110, y: 130, w: 110,
      items: [
        { label: "amount · €950" },
        { label: "purpose · INV" },
        { label: "ref · INV-2026-04" },
        { label: "debtor · full addr" },
      ],
    }),
  ],
});
