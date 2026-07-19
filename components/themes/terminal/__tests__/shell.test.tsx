import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TerminalShell } from "@/components/themes/terminal/shell";

function renderShell() {
  return render(<TerminalShell />);
}

describe("TerminalShell", () => {
  it("runs a command from a chip and shows output", async () => {
    renderShell();
    await userEvent.click(screen.getByRole("button", { name: "projects" }));
    expect(await screen.findByText(/GPTForVideo/)).toBeInTheDocument();
  });

  it("runs a typed command", async () => {
    renderShell();
    const input = screen.getByLabelText(/type a command/i);
    await userEvent.type(input, "echo hello-cli-world{enter}");
    // exact match hits the command output line, not the echoed input line
    expect(await screen.findByText("hello-cli-world")).toBeInTheDocument();
  });
});
