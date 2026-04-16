import { scene, node, arrow, timer } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Stablecoin Rails",
  desc: "Fiat → stablecoin → on-chain transfer → off-ramp to fiat. Minutes instead of days.",
  children: [
    node({ id: "ngn", x: 4, y: 80, w: 60, h: 40, label: "NGN" }),
    node({ id: "mint", x: 78, y: 80, w: 60, h: 40, label: "mint USDC", color: "teal" }),
    node({ id: "send", x: 152, y: 80, w: 60, h: 40, label: "on-chain" }),
    node({ id: "burn", x: 226, y: 80, w: 86, h: 40, label: "off-ramp CNY", color: "teal" }),
    arrow({ from: { x: 64, y: 100 }, to: { x: 78, y: 100 }, id: "sc-a" }),
    arrow({ from: { x: 138, y: 100 }, to: { x: 152, y: 100 }, animated: true, id: "sc-b" }),
    arrow({ from: { x: 212, y: 100 }, to: { x: 226, y: 100 }, id: "sc-c" }),
    timer({ x: 160, y: 165, label: "~10 min" }),
  ],
});
