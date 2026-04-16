import { scene, stack } from "/js/glossary/animations/primitives.js";
export default () => scene({
  title: "Chart of Accounts",
  desc: "The indexed list of every category (expense code) the business uses.",
  children: [
    stack({
      x: 80, y: 20, w: 160,
      items: [
        { label: "1100 · Cash" },
        { label: "1200 · AR" },
        { label: "2100 · AP" },
        { label: "4000 · Revenue" },
        { label: "5200 · COGS" },
        { label: "6200 · Software" },
        { label: "7100 · Office" },
        { label: "8000 · Interest" },
        { label: "9000 · Tax" },
      ],
    }),
  ],
});
