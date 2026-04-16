import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "PSD2 / Open Banking",
  desc: "EU/UK law: banks must expose APIs so third-party apps can read accounts and initiate payments with consent.",
  children: [
    node({ id: "app", x: 8, y: 80, w: 80, h: 40, label: "Budget app" }),
    node({ id: "api", x: 125, y: 80, w: 80, h: 40, label: "Bank API", color: "teal" }),
    node({ id: "bank", x: 242, y: 80, w: 70, h: 40, label: "Barclays" }),
    arrow({ from: { x: 88, y: 100 }, to: { x: 125, y: 100 }, label: "consent", id: "ps-a" }),
    arrow({ from: { x: 205, y: 100 }, to: { x: 242, y: 100 }, id: "ps-b" }),
  ],
});
