import { scene, node, arrow, mark } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "KYC",
  desc: "Identity verification: ID doc + selfie + address, matched against government records.",
  children: [
    node({ id: "doc", x: 8, y: 30, w: 80, h: 30, label: "Passport" }),
    node({ id: "selfie", x: 8, y: 80, w: 80, h: 30, label: "Selfie" }),
    node({ id: "addr", x: 8, y: 130, w: 80, h: 30, label: "Address" }),
    node({ id: "verify", x: 140, y: 80, w: 90, h: 40, label: "KYC check", color: "teal" }),
    arrow({ from: { x: 88, y: 45 }, to: { x: 140, y: 95 }, id: "ky-a" }),
    arrow({ from: { x: 88, y: 95 }, to: { x: 140, y: 100 }, animated: true, id: "ky-b" }),
    arrow({ from: { x: 88, y: 145 }, to: { x: 140, y: 105 }, id: "ky-c" }),
    mark({ x: 270, y: 100, type: "check" }),
  ],
});
