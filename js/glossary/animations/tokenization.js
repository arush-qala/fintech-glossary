import { scene, node, arrow } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Tokenization",
  desc: "Real card number is swapped for a random token that's useless if stolen.",
  children: [
    `<text x="30" y="50" font-family="var(--ff-mono)" font-size="12" fill="var(--ink)">4242 4242 4242 4242</text>`,
    node({ id: "vault", x: 120, y: 80, w: 80, h: 40, label: "Vault", color: "teal" }),
    arrow({ from: { x: 160, y: 60 }, to: { x: 160, y: 80 }, id: "tk-a" }),
    arrow({ from: { x: 160, y: 120 }, to: { x: 160, y: 155 }, animated: true, id: "tk-b" }),
    `<text x="160" y="175" text-anchor="middle" font-family="var(--ff-mono)" font-size="12" fill="var(--teal)">tok_1NX8…QpVd</text>`,
  ],
});
