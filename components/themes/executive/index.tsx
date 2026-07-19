import { ExecutiveNav } from "./nav";
import { ExecutiveHero } from "./hero";
import { ExecutiveSections } from "./sections";

const sans = "var(--font-sans)";

export default function ExecutivePortfolio() {
  return (
    <div
      data-theme="executive"
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--ink)",
        fontFamily: sans,
        position: "relative",
      }}
    >
      <ExecutiveNav />
      <ExecutiveHero />
      <ExecutiveSections />
    </div>
  );
}
