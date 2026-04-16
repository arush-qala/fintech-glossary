import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Cross-Currency Netting",
  desc: "Offsetting flows cancel out. Only the net difference actually moves through rails.",
  children: [
    node({ id: "gbp", x: 8, y: 30, w: 110, h: 36, label: "GBP → EUR", sub: "£100m" }),
    node({ id: "eur", x: 8, y: 130, w: 110, h: 36, label: "EUR → GBP", sub: "€90m (=£77m)" }),
    node({ id: "net", x: 200, y: 80, w: 112, h: 40, label: "Net £23m", sub: "only this moves", color: "teal" }),
    arrow({ from: { x: 118, y: 48 }, to: { x: 200, y: 95 }, id: "cn-a" }),
    arrow({ from: { x: 118, y: 148 }, to: { x: 200, y: 105 }, id: "cn-b" }),
  ],
});
