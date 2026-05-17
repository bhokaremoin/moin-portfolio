"use client";

import { useTheme } from "@/components/theme-provider";
import EditorialPortfolio from "@/components/themes/editorial";
import ExecutivePortfolio from "@/components/themes/executive";
import TerminalPortfolio from "@/components/themes/terminal";

export function ThemedPortfolio() {
  const { theme } = useTheme();
  if (theme === "executive") return <ExecutivePortfolio />;
  if (theme === "editorial") return <EditorialPortfolio />;
  return <TerminalPortfolio />;
}
