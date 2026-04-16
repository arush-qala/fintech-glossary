import { scene } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Trial Balance",
  desc: "Every account's balance grouped by debit and credit. The totals must match.",
  children: [
    `<text x="80" y="40" text-anchor="middle" font-family="var(--ff-sans)" font-size="11" font-weight="700" fill="var(--ink-3)">DR</text>`,
    `<text x="240" y="40" text-anchor="middle" font-family="var(--ff-sans)" font-size="11" font-weight="700" fill="var(--ink-3)">CR</text>`,
    `<text x="80" y="70" text-anchor="middle" font-family="var(--ff-mono)" font-size="11" fill="var(--ink)">£428,119.42</text>`,
    `<text x="240" y="70" text-anchor="middle" font-family="var(--ff-mono)" font-size="11" fill="var(--ink)">£428,119.42</text>`,
    `<line x1="20" y1="95" x2="300" y2="95" stroke="var(--line-soft)"/>`,
    `<text x="160" y="135" text-anchor="middle" font-family="var(--ff-sans)" font-size="14" font-weight="700" fill="var(--green)">✓ balanced</text>`,
  ],
});
