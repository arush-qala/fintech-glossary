import { scene, node, arrow, globe } from "/js/glossary/animations/primitives.js";

export default () => scene({
  title: "SWIFT",
  desc: "SWIFT is a messaging network. Banks send payment instructions through it; actual money moves through accounts they hold with each other (nostro/vostro).",
  children: [
    node({ id: "sender", x: 8, y: 80, w: 64, h: 36, label: "Chase", sub: "US" }),
    globe({ x: 160, y: 100, r: 40, regions: [{ dx: -20, dy: -10 }, { dx: 22, dy: 14 }] }),
    node({ id: "recv", x: 248, y: 80, w: 64, h: 36, label: "HDFC", sub: "India" }),
    arrow({ from: { x: 72, y: 98 }, to: { x: 120, y: 98 }, label: "MT103", animated: true, id: "sw-a" }),
    arrow({ from: { x: 200, y: 98 }, to: { x: 248, y: 98 }, label: "credit", animated: true, id: "sw-b" }),
    `<text x="160" y="180" text-anchor="middle" font-family="var(--ff-mono)" font-size="9" fill="var(--ink-3)">
       message ≠ money · money hops via nostro
     </text>`,
  ],
});
