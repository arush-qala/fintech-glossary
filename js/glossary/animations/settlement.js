import { scene, node, arrow, timer } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Settlement",
  desc: "Authorisation is a promise; settlement is the money actually moving, often days later.",
  children: [
    node({ id: "auth", x: 8, y: 30, w: 100, h: 40, label: "Auth", sub: "£6.50 · 8:02am", color: "teal" }),
    node({ id: "settle", x: 212, y: 120, w: 100, h: 40, label: "Settlement", sub: "£6.43 · T+2", color: "amber" }),
    arrow({ from: { x: 58, y: 70 }, to: { x: 262, y: 120 }, dashed: true, id: "st-a" }),
    timer({ x: 160, y: 90, label: "48 hrs" }),
  ],
});
