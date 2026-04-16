import { scene, node, arrow, stack } from "/js/glossary/animations/primitives.js";

export default () => scene({
  title: "ACH",
  desc: "Employer batches payroll into a single file submitted to an ACH operator. The operator disburses credits to every employee bank next business day.",
  children: [
    node({ id: "employer", x: 8, y: 80, w: 70, h: 40, label: "Employer" }),
    stack({
      x: 90, y: 60, w: 90,
      items: [
        { label: "$3,200", color: "var(--paper-warm)" },
        { label: "$2,850", color: "var(--paper-warm)" },
        { label: "$4,100", color: "var(--paper-warm)" },
        { label: "…500 more", color: "var(--paper-warm)" },
      ],
    }),
    node({ id: "ach-op", x: 195, y: 80, w: 60, h: 40, label: "ACH", sub: "batch op", color: "teal" }),
    node({ id: "banks", x: 268, y: 80, w: 48, h: 40, label: "Banks" }),
    arrow({ from: { x: 78, y: 100 }, to: { x: 90, y: 100 }, id: "ach-a" }),
    arrow({ from: { x: 180, y: 100 }, to: { x: 195, y: 100 }, label: "file", id: "ach-b" }),
    arrow({ from: { x: 255, y: 100 }, to: { x: 268, y: 100 }, label: "T+1", animated: true, id: "ach-c" }),
  ],
});
