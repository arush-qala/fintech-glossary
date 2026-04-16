import { scene, node, timer, mark } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Cut-off Time",
  desc: "Daily deadline; miss it and the payment slides to the next business day.",
  children: [
    timer({ x: 80, y: 100, r: 32, label: "4:00pm ET" }),
    node({ id: "submitted", x: 180, y: 60, w: 120, h: 36, label: "Submitted 4:30pm" }),
    mark({ x: 200, y: 130, type: "x" }),
    `<text x="220" y="134" font-family="var(--ff-sans)" font-size="10" fill="var(--red)">missed → T+1</text>`,
  ],
});
