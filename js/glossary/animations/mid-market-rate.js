import { scene } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Mid-Market Rate",
  desc: "The real exchange rate — the midpoint between bid and ask in the interbank FX market.",
  children: [
    `<line x1="30" y1="100" x2="290" y2="100" stroke="var(--line)" stroke-width="1"/>`,
    `<text x="40" y="60" font-family="var(--ff-mono)" font-size="11" fill="var(--ink)">Bid 1.1728</text>`,
    `<text x="240" y="60" font-family="var(--ff-mono)" font-size="11" fill="var(--ink)" text-anchor="end">Ask 1.1736</text>`,
    `<circle cx="160" cy="100" r="7" fill="var(--teal)">
       <animate attributeName="r" values="7;10;7" dur="2s" repeatCount="indefinite"/>
     </circle>`,
    `<text x="160" y="135" text-anchor="middle" font-family="var(--ff-mono)" font-size="12" font-weight="700" fill="var(--teal)">1.1732</text>`,
    `<text x="160" y="155" text-anchor="middle" font-family="var(--ff-sans)" font-size="10" fill="var(--ink-3)">mid-market</text>`,
  ],
});
