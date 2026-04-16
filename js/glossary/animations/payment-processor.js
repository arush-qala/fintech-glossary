import { scene, node, arrow, mark } from "/js/glossary/animations/primitives.js";

export default () => scene({
  title: "Payment Processor",
  desc: "Processor routes the authorisation request to the card network, receives the issuer's decision, and replies back to the gateway.",
  children: [
    node({ id: "gateway", x: 8, y: 24, w: 70, h: 36, label: "Gateway" }),
    node({ id: "processor", x: 125, y: 80, w: 80, h: 40, label: "Processor", sub: "routes auth", color: "teal" }),
    node({ id: "network", x: 242, y: 24, w: 70, h: 36, label: "Network" }),
    node({ id: "issuer", x: 242, y: 140, w: 70, h: 36, label: "Issuer" }),
    arrow({ from: { x: 78, y: 42 }, to: { x: 125, y: 96 }, animated: true, id: "pp-a" }),
    arrow({ from: { x: 205, y: 96 }, to: { x: 242, y: 42 }, animated: true, id: "pp-b" }),
    arrow({ from: { x: 242, y: 60 }, to: { x: 242, y: 140 }, label: "auth?", id: "pp-c" }),
    arrow({ from: { x: 277, y: 140 }, to: { x: 277, y: 60 }, label: "APPROVED", color: "var(--green)", id: "pp-d" }),
    mark({ x: 295, y: 36, type: "check", r: 8 }),
  ],
});
