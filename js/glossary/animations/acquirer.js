import { scene, node, arrow } from "/js/glossary/animations/primitives.js";

export default () => scene({
  title: "Acquirer",
  desc: "Merchant side. The acquirer receives settled card funds from the network and deposits them into the merchant's bank account the next day.",
  children: [
    node({ id: "network", x: 8, y: 80, w: 80, h: 40, label: "Card Network" }),
    node({ id: "acquirer", x: 125, y: 80, w: 80, h: 40, label: "Acquirer", sub: "merchant bank", color: "teal" }),
    node({ id: "merchant", x: 242, y: 80, w: 70, h: 40, label: "Merchant" }),
    arrow({ from: { x: 88, y: 100 }, to: { x: 125, y: 100 }, label: "batch", animated: true, id: "ac-a" }),
    arrow({ from: { x: 205, y: 100 }, to: { x: 242, y: 100 }, label: "T+1", id: "ac-b" }),
    `<text x="165" y="170" text-anchor="middle" font-family="var(--ff-mono)" font-size="10" fill="var(--ink-3)">
       £6.50 (gross) → £6.43 (net)
     </text>`,
  ],
});
