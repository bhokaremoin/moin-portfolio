import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ThemeProvider } from "@/components/theme-provider";

function renderSwitcher() {
  return render(
    <ThemeProvider initialTheme="terminal">
      <ThemeSwitcher />
    </ThemeProvider>,
  );
}

describe("ThemeSwitcher", () => {
  it("renders a radiogroup with three labeled segments", () => {
    renderSwitcher();
    const group = screen.getByRole("radiogroup", { name: /theme/i });
    expect(group).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Terminal" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Code" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Executive" })).toBeInTheDocument();
  });

  it("marks the active theme as checked", () => {
    renderSwitcher();
    expect(screen.getByRole("radio", { name: "Terminal" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Code" })).not.toBeChecked();
  });

  it("switches theme on click and updates the DOM attribute", async () => {
    renderSwitcher();
    await userEvent.click(screen.getByRole("radio", { name: "Executive" }));
    expect(screen.getByRole("radio", { name: "Executive" })).toBeChecked();
    expect(document.documentElement.dataset.theme).toBe("executive");
  });

  it("moves selection with arrow keys", async () => {
    renderSwitcher();
    const terminal = screen.getByRole("radio", { name: "Terminal" });
    terminal.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Code" })).toBeChecked();
  });
});
