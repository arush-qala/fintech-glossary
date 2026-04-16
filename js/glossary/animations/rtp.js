import { scene, node, arrow, timer } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "RTP (US)",
  desc: "USA instant bank rail from The Clearing House. 24/7, real-time.",
  children: [
    node({ id: "from", x: 8, y: 80, w: 80, h: 40, label: "Platform" }),
    node({ id: "rail", x: 125, y: 80, w: 80, h: 40, label: "RTP", sub: "TCH", color: "teal" }),
    node({ id: "to", x: 232, y: 80, w: 80, h: 40, label: "BofA" }),
    arrow({ from: { x: 88, y: 100 }, to: { x: 125, y: 100 }, animated: true, id: "rtp-a" }),
    arrow({ from: { x: 205, y: 100 }, to: { x: 232, y: 100 }, animated: true, id: "rtp-b" }),
    timer({ x: 160, y: 165, label: "< 10 sec" }),
  ],
});
