"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useTheme } from "@/components/theme-provider";
import TerminalPortfolio from "@/components/themes/terminal";

const ExecutivePortfolio = dynamic(
  () => import("@/components/themes/executive"),
  { ssr: false },
);

const EditorialPortfolio = dynamic(
  () => import("@/components/themes/editorial"),
  { ssr: false },
);

export function ThemedPortfolio() {
  const { theme } = useTheme();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ric =
      window.requestIdleCallback ??
      ((cb: IdleRequestCallback) =>
        window.setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 }), 1));
    const handle = ric(() => {
      import("@/components/themes/executive");
      import("@/components/themes/editorial");
    });
    return () => {
      if (typeof window.cancelIdleCallback === "function" && typeof handle === "number") {
        window.cancelIdleCallback(handle);
      }
    };
  }, []);

  if (theme === "executive") return <ExecutivePortfolio />;
  if (theme === "editorial") return <EditorialPortfolio />;
  return <TerminalPortfolio />;
}
