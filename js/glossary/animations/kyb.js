import { scene, node, arrow, mark } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "KYB",
  desc: "Business identity verification: Companies House + directors + beneficial owners.",
  children: [
    node({ id: "co", x: 125, y: 14, w: 80, h: 36, label: "Company", color: "teal" }),
    node({ id: "d1", x: 40, y: 80, w: 60, h: 36, label: "Director A" }),
    node({ id: "d2", x: 130, y: 80, w: 60, h: 36, label: "Director B" }),
    node({ id: "ubo", x: 220, y: 80, w: 80, h: 36, label: "UBO 30%+" }),
    arrow({ from: { x: 165, y: 50 }, to: { x: 70, y: 80 }, dashed: true, id: "kyb-a" }),
    arrow({ from: { x: 165, y: 50 }, to: { x: 160, y: 80 }, dashed: true, id: "kyb-b" }),
    arrow({ from: { x: 165, y: 50 }, to: { x: 260, y: 80 }, dashed: true, id: "kyb-c" }),
    mark({ x: 165, y: 150, type: "check" }),
  ],
});
