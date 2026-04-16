import { scene, node, arrow } from "/js/glossary/animations/primitives.js";

export default () => scene({
  title: "Payment Gateway",
  desc: "Shopper enters card details at checkout. The gateway encrypts and tokenises, passing a useless-if-stolen token onward.",
  children: [
    node({ id: "shopper", x: 8,  y: 80, w: 70, h: 40, label: "Shopper", sub: "card #" }),
    node({ id: "gateway", x: 125, y: 80, w: 80, h: 40, label: "Gateway", sub: "encrypts", color: "teal" }),
    node({ id: "processor", x: 242, y: 80, w: 70, h: 40, label: "Processor" }),
    arrow({ from: { x: 78, y: 100 }, to: { x: 125, y: 100 }, label: "PAN", animated: true, id: "pg-a" }),
    arrow({ from: { x: 205, y: 100 }, to: { x: 242, y: 100 }, label: "token", animated: true, color: "var(--teal)", id: "pg-b" }),
    `<text x="160" y="170" text-anchor="middle" font-family="var(--ff-mono)" font-size="10" fill="var(--ink-3)">
       card 4242…4242 → tok_1NX8…
     </text>`,
  ],
});
