import { scene } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "FX Spread",
  desc: "Markup a provider charges above the mid-market rate. Often hidden inside a 'zero fee' FX offer.",
  children: [
    `<line x1="30" y1="100" x2="290" y2="100" stroke="var(--line)" stroke-width="1"/>`,
    `<circle cx="130" cy="100" r="6" fill="var(--teal)"/>`,
    `<text x="130" y="80" text-anchor="middle" font-family="var(--ff-mono)" font-size="10" fill="var(--teal)">1.1732 mid</text>`,
    `<circle cx="220" cy="100" r="6" fill="var(--amber)"/>`,
    `<text x="220" y="80" text-anchor="middle" font-family="var(--ff-mono)" font-size="10" fill="var(--amber)">1.14 quoted</text>`,
    `<path d="M 130 130 L 220 130" stroke="var(--amber)" stroke-width="3"/>`,
    `<text x="175" y="155" text-anchor="middle" font-family="var(--ff-sans)" font-size="11" fill="var(--amber)">2.8% markup</text>`,
  ],
});
