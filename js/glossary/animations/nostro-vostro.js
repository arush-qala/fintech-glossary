import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Nostro / Vostro",
  desc: "Banks hold accounts with each other. 'Nostro' = ours with them, 'vostro' = yours with us. Same account, two views.",
  children: [
    node({ id: "hsbc", x: 8, y: 80, w: 90, h: 40, label: "HSBC London", sub: "nostro USD" }),
    node({ id: "jpm", x: 222, y: 80, w: 90, h: 40, label: "JPM NY", sub: "vostro GBP", color: "teal" }),
    arrow({ from: { x: 98, y: 95 }, to: { x: 222, y: 95 }, label: "debit $50k", id: "nv-a" }),
    arrow({ from: { x: 222, y: 110 }, to: { x: 98, y: 110 }, label: "credit £", id: "nv-b" }),
  ],
});
