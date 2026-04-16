import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Card Network",
  desc: "Visa / Mastercard route the authorisation between the merchant's acquirer and the cardholder's issuer.",
  children: [
    node({ id: "acq", x: 8, y: 80, w: 70, h: 40, label: "Acquirer" }),
    node({ id: "net", x: 125, y: 80, w: 80, h: 40, label: "Card Network", sub: "Visa", color: "teal" }),
    node({ id: "iss", x: 242, y: 80, w: 70, h: 40, label: "Issuer" }),
    arrow({ from: { x: 78, y: 100 }, to: { x: 125, y: 100 }, animated: true, id: "cn-a" }),
    arrow({ from: { x: 205, y: 100 }, to: { x: 242, y: 100 }, animated: true, id: "cn-b" }),
  ],
});
